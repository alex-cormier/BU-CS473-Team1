FROM nginx:latest
COPY ./index.html /usr/share/nginx/html/index.html
COPY ./style.css /usr/share/nginx/html/style.css
COPY ./app.js /usr/share/nginx/html/app.js
COPY ./img/ /usr/share/nginx/html/img/

COPY ./loginform/ /usr/share/nginx/html/loginform/ 

#EXPOSE 80
