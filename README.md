<p align="center"><a href="https://laravel.com" target="_blank"><img src="https://raw.githubusercontent.com/laravel/art/master/logo-lockup/5%20SVG/2%20CMYK/1%20Full%20Color/laravel-logolockup-cmyk-red.svg" width="400" alt="Laravel Logo"></a></p>

<p align="center">
<a href="https://github.com/laravel/framework/actions"><img src="https://github.com/laravel/framework/workflows/tests/badge.svg" alt="Build Status"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/dt/laravel/framework" alt="Total Downloads"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/v/laravel/framework" alt="Latest Stable Version"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/l/laravel/framework" alt="License"></a>
</p>

## About Laravel

Laravel is a web application framework with expressive, elegant syntax. We believe development must be an enjoyable and creative experience to be truly fulfilling. Laravel takes the pain out of development by easing common tasks used in many web projects, such as:

- [Simple, fast routing engine](https://laravel.com/docs/routing).
- [Powerful dependency injection container](https://laravel.com/docs/container).
- Multiple back-ends for [session](https://laravel.com/docs/session) and [cache](https://laravel.com/docs/cache) storage.
- Expressive, intuitive [database ORM](https://laravel.com/docs/eloquent).
- Database agnostic [schema migrations](https://laravel.com/docs/migrations).
- [Robust background job processing](https://laravel.com/docs/queues).
- [Real-time event broadcasting](https://laravel.com/docs/broadcasting).

Laravel is accessible, powerful, and provides tools required for large, robust applications.

## Learning Laravel

Laravel has the most extensive and thorough [documentation](https://laravel.com/docs) and video tutorial library of all modern web application frameworks, making it a breeze to get started with the framework.

You may also try the [Laravel Bootcamp](https://bootcamp.laravel.com), where you will be guided through building a modern Laravel application from scratch.

If you don't feel like reading, [Laracasts](https://laracasts.com) can help. Laracasts contains thousands of video tutorials on a range of topics including Laravel, modern PHP, unit testing, and JavaScript. Boost your skills by digging into our comprehensive video library.

## Laravel Sponsors

We would like to extend our thanks to the following sponsors for funding Laravel development. If you are interested in becoming a sponsor, please visit the [Laravel Partners program](https://partners.laravel.com).

### Premium Partners

- **[Vehikl](https://vehikl.com/)**
- **[Tighten Co.](https://tighten.co)**
- **[WebReinvent](https://webreinvent.com/)**
- **[Kirschbaum Development Group](https://kirschbaumdevelopment.com)**
- **[64 Robots](https://64robots.com)**
- **[Curotec](https://www.curotec.com/services/technologies/laravel/)**
- **[Cyber-Duck](https://cyber-duck.co.uk)**
- **[DevSquad](https://devsquad.com/hire-laravel-developers)**
- **[Jump24](https://jump24.co.uk)**
- **[Redberry](https://redberry.international/laravel/)**
- **[Active Logic](https://activelogic.com)**
- **[byte5](https://byte5.de)**
- **[OP.GG](https://op.gg)**

## Contributing

Thank you for considering contributing to the Laravel framework! The contribution guide can be found in the [Laravel documentation](https://laravel.com/docs/contributions).

## Code of Conduct

In order to ensure that the Laravel community is welcoming to all, please review and abide by the [Code of Conduct](https://laravel.com/docs/contributions#code-of-conduct).

## Security Vulnerabilities

If you discover a security vulnerability within Laravel, please send an e-mail to Taylor Otwell via [taylor@laravel.com](mailto:taylor@laravel.com). All security vulnerabilities will be promptly addressed.

## License

The Laravel framework is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).


```markdown
# GeoServer Installation

## Introduction

GeoServer is a JAVA based application developed to ease the styling and sharing of geospatial data using Open Source technology. It follows the standards of the Open Geospatial Consortium (OGC) and thus has wide application in a variety of industries. GeoServer’s website provides comprehensive information regarding its usability and documentation.

## Installation Guide

Installing GeoServer in a GUI-based system such as Windows, Mac, or even Ubuntu GUI is straightforward. However, if you only have access to an SSH terminal, follow the steps below:

### Step 1: Check/Install JAVA 17

GeoServer currently supports JAVA-JRE-17. Install it using the following commands:

```bash
sudo apt-get update
sudo apt-get install openjdk-17-jdk
sudo apt-get install openjdk-17-jre
```

Verify the installation by typing `java -version`.

### Step 2: Installation of Postgres (Optional)

If you wish to use a database with GeoServer, it is recommended to install PostgreSQL. PostGIS is likely already installed if you're running PostgreSQL as a service from a cloud provider like DigitalOcean. To enable PostGIS, you can:

1. Connect to your database as the postgres user or another super-user account.
2. Run the command: `CREATE EXTENSION postgis`

### Step 3: Downloading GeoServer

Downloading GeoServer without a GUI requires manual downloading and installation. Visit the GeoServer build page [here](https://build.geoserver.org/geoserver/) to select the desired version. For example:

```bash
cd /usr/share
mkdir geoserver
cd geoserver
wget https://build.geoserver.org/geoserver/main/geoserver-main-latest-bin.zip
```

Unzip the downloaded file:

```bash
unzip geoserver-main-latest-bin.zip
```

Set up a variable:

```bash
echo "export GEOSERVER_HOME=/usr/share/geoserver" >> ~/.profile
. ~/.profile
```

Ensure the correct ownership:

```bash
sudo chown -R USER_NAME /usr/share/geoserver/
```

### Step 4: Starting GeoServer

Navigate to the bin directory and run `startup.sh`:

```bash
cd bin
sh startup.sh
```

Once GeoServer is up and running, access it through a web browser using the designated port (usually 8080).

### Step 5: Configuring GeoServer for Usage and Running as a Service

To make GeoServer accessible publicly and resolve CORS issues, edit the `web.xml` file located at `geoserver/webapps/geoserver/WEB-INF`. Use a text editor like Vim:

```bash
sudo apt install vim
sudo vim web.xml
```

Add the following lines to the `web.xml` file, replacing the URL with your chosen URL:

```xml
<context-param>
  <param-name>PROXY_BASE_URL</param-name>
  <param-value>https://map.homeful.ph/geoserver</param-value>
</context-param>

<context-param>
  <param-name>GEOSERVER_CSRF_WHITELIST</param-name>
  <param-value>homeful.ph,map.homeful.ph,map.homeful.ph/geoserver</param-value>
</context-param>
```

Uncomment the CORS-related lines and save the changes. Then restart GeoServer.

To run GeoServer as a service, follow the instructions provided in the [official documentation](https://docs.geoserver.org/2.21.x/en/user/production/linuxscript.html).

### Step 6: NGINX Configuration (Optional)

If you're using NGINX as a reverse proxy to serve GeoServer, you'll need to configure NGINX to pass requests to GeoServer. Add the following configuration to your NGINX configuration file (usually located at `/etc/nginx/nginx.conf` or in a site-specific configuration file):

```nginx
location /geoserver {
  proxy_pass http://localhost:8080/geoserver;
  proxy_set_header Host $host;
  proxy_set_header X-Real-IP $remote_addr;
  proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
  proxy_set_header X-Forwarded-Proto $scheme;
  proxy_redirect ~http://[^/]+(/.)$ $1;
}
```

Replace `/geoserver` with the URL path you want to use for GeoServer. After adding the configuration, restart NGINX for the changes to take effect.

### Step 7: Ensure GeoServer is Running Properly

Remove the Marlin renderer library jar file to ensure proper functioning:

```bash
rm webapps/geoserver/WEB-INF/lib/marlin-0.9.3.jar
```

### Step 8: Access GeoServer

You can access GeoServer using the default credentials:
- Username: admin
- Password: geoserver

## Troubleshooting

If you encounter errors while accessing GeoServer, double-check the changes made in the `web.xml` file.

## Conclusion

GeoServer is now successfully installed and configured for usage. Enjoy leveraging its geospatial capabilities!
```
```