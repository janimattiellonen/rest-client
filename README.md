# REST and CORS testing

Simple example app that tests how RESTful AJAX queries can be made using CORS or proxy.

## Nginx vhost templates

### Proxy

```
server {
    listen 80;
    charset utf-8;
    root /opt/local/nginx/wwwroot/rest-client;
    server_name rest-client.localhost;
    access_log  /var/log/nginx/rest-client.access.log custom;
    error_log  /var/log/nginx/rest-client.error.log;
    gzip  on;
    index index.html;

    gzip_min_length  1000;
    gzip_proxied     expired no-cache no-store private auth;
    gzip_types       text/css text/plain text/xml application/xml application/xml+rss text/javascript application/x-javascript;
    gzip_vary on;


    	location /api/ {
		proxy_set_header X-Real-IP $remote_addr;
                proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
                proxy_set_header X-NginX-Proxy true;
                proxy_pass http://api_server/app_dev.php/api/;
                proxy_ssl_session_reuse off;
                proxy_set_header Host $http_host;
                proxy_redirect off;
	}
}
```

### Target

Added as reference.

```
server {
    listen 80;
    server_name rest.localhost;
    root /opt/local/nginx/wwwroot/silex-simple-rest/web;
    index index.php;

    error_log  /var/log/nginx/rest.error.log;
    access_log  /var/log/nginx/rest.access.log custom;

    location ~ \.php$ {
        fastcgi_split_path_info ^(.+\.php)(/.+)$;
        include fastcgi_params;
        fastcgi_pass 127.0.0.1:9004;
        fastcgi_param  SCRIPT_FILENAME  $document_root$fastcgi_script_name;
        fastcgi_param HTTPS off;
    }


    location / {
        if (-f $request_filename) {
            expires max;
            break;
        }

        rewrite ^(.*) /index.php last;
    }
}
```

## References

* http://oskarhane.com/avoid-cors-with-nginx-proxy_pass/
* https://github.com/MoonScript/jQuery-ajaxTransport-XDomainRequest