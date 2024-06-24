<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>PAG-IBIG HELP SEMINAR APP</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f0f0f0;
            color: #333;
            margin: 0;
            padding: 0;
            display: flex;
            flex-direction: column;
            align-items: center;
        }
        h1 {
            margin: 20px 0;
        }
        .container {
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            margin: 20px;
        }
        #player {
            margin: 20px;
        }
        video, canvas {
            display: block;
            margin: 20px;
            border: 1px solid #ccc;
            box-shadow: 0 4px 8px rgba(0,0,0,0.1);
        }
        #snapshots {
            display: flex;
            justify-content: center;
            flex-wrap: wrap;
        }
    </style>
</head>
<body>
    <h1>PAG-IBIG HELP SEMINAR APP</h1>
    <div id="player"></div>
    <div class="container">
        <video id="camera" width="320" height="240" autoplay></video>
        <div id="snapshots">
            <canvas id="videoSnapshot" width="320" height="240"></canvas>
            <canvas id="cameraSnapshot" width="320" height="240"></canvas>
            <canvas id="screenSnapshot" width="320" height="240"></canvas>
        </div>
    </div>
    <script src="https://www.youtube.com/iframe_api"></script>
    <script type="text/javascript">
        let player;
        let cameraStream;
        let snapshotInterval;
        let mediaRecorder;
        let recordedChunks = [];

        function onYouTubeIframeAPIReady() {
            player = new YT.Player('player', {
                height: '360',
                width: '640',
                videoId: 'GnZ05zTOQow', // Example video ID
                events: {
                    'onStateChange': onPlayerStateChange
                }
            });
        }

        function onPlayerStateChange(event) {
            if (event.data == YT.PlayerState.PLAYING) {
                if (!snapshotInterval) {
                    snapshotInterval = setInterval(takeSnapshots, 5000); // Take snapshots every 5 seconds
                }
                captureScreenSnapshot();
                startRecordingCamera();
            } else if (event.data == YT.PlayerState.PAUSED || event.data == YT.PlayerState.ENDED) {
                clearInterval(snapshotInterval);
                snapshotInterval = null;
                stopRecordingCamera();
                captureScreenSnapshot();
            }
        }

        function takeSnapshots() {
            captureCameraSnapshot();
            captureVideoSnapshotPlaceholder();
            // captureScreenSnapshot();
        }

        function captureCameraSnapshot() {
            const cameraCanvas = document.getElementById('cameraSnapshot');
            const cameraContext = cameraCanvas.getContext('2d');
            const cameraVideo = document.getElementById('camera');
            if (cameraVideo) {
                cameraContext.drawImage(cameraVideo, 0, 0, cameraCanvas.width, cameraCanvas.height);
                // sendSnapshotToServer(cameraCanvas, 'cameraSnapshot.png');
            }
        }

        function captureVideoSnapshotPlaceholder() {
            const videoCanvas = document.getElementById('videoSnapshot');
            const videoContext = videoCanvas.getContext('2d');
            const placeholderImage = new Image();
            placeholderImage.src = 'https://via.placeholder.com/320x240.png?text=Video+Snapshot';
            placeholderImage.onload = () => {
                videoContext.drawImage(placeholderImage, 0, 0, videoCanvas.width, videoCanvas.height);
                // sendSnapshotToServer(videoCanvas, 'videoSnapshot.png');
            };
        }

        async function captureScreenSnapshot() {
            try {
                const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
                const screenCanvas = document.getElementById('screenSnapshot');
                const screenContext = screenCanvas.getContext('2d');
                const screenVideo = document.createElement('video');

                screenVideo.srcObject = screenStream;
                screenVideo.onloadedmetadata = () => {
                    screenVideo.play();
                    screenVideo.onplay = () => {
                        screenContext.drawImage(screenVideo, 0, 0, screenCanvas.width, screenCanvas.height);
                        // sendSnapshotToServer(screenCanvas, 'screenSnapshot.png');
                        screenStream.getTracks().forEach(track => track.stop());
                    };
                };
            } catch (err) {
                console.error("Error capturing screen: " + err);
            }
        }

        function startRecordingCamera() {
            if (cameraStream) {
                mediaRecorder = new MediaRecorder(cameraStream);
                mediaRecorder.ondataavailable = event => {
                    if (event.data.size > 0) {
                        recordedChunks.push(event.data);
                    }
                };
                mediaRecorder.start();
            }
        }

        function stopRecordingCamera() {
            if (mediaRecorder) {
                mediaRecorder.stop();
                mediaRecorder.onstop = () => {
                    const recordedBlob = new Blob(recordedChunks, { type: 'video/webm' });
                    drawRecordedVideoOnCanvas(recordedBlob);
                    sendVideoToServer(recordedBlob, 'recordedCamera.webm');
                    recordedChunks = [];
                };
            }
        }

        function sendVideoToServer(blob, filename) {
            // const formData = new FormData();
            // formData.append('snapshots', blob, filename);
            // fetch('/upload', {
            //     method: 'POST',
            //     body: formData
            // })
            // .then(response => response.text())
            // .then(data => console.log(data))
            // .catch(error => console.error('Error:', error));
        }

        function drawRecordedVideoOnCanvas(blob) {
            const videoCanvas = document.getElementById('videoSnapshot');
            const videoContext = videoCanvas.getContext('2d');
            const recordedVideo = document.createElement('video');

            recordedVideo.src = URL.createObjectURL(blob);
            recordedVideo.onloadedmetadata = () => {
                recordedVideo.play();
                recordedVideo.onplay = () => {
                    recordedVideo.currentTime = 0; // Restart video
                    recordedVideo.addEventListener('timeupdate', () => {
                        videoContext.drawImage(recordedVideo, 0, 0, videoCanvas.width, videoCanvas.height);
                        if (recordedVideo.ended) {
                            URL.revokeObjectURL(recordedVideo.src);
                        }
                    });
                };
            };
        }


        // Access the camera with proper fallback
        navigator.mediaDevices = navigator.mediaDevices || ((navigator.mozGetUserMedia || navigator.webkitGetUserMedia) ? {
            getUserMedia: function(c) {
                return new Promise(function(y, n) {
                    (navigator.mozGetUserMedia ||
                    navigator.webkitGetUserMedia).call(navigator, c, y, n);
                });
            }
        } : null);

        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices.getUserMedia({ video: true })
                .then(stream => {
                    cameraStream = stream;
                    document.getElementById('camera').srcObject = stream;
                })
                .catch(err => {
                    console.error("Error accessing the camera: " + err);
                });
        } else {
            alert("getUserMedia not supported in this browser.");
        }

    </script>
</body>
</html>
