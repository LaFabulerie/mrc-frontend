FROM arm32v7/nginx
COPY ./dist/admin /usr/share/nginx/html
EXPOSE 80
