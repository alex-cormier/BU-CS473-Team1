FROM maven:3.6.0-jdk-11-slim AS build
WORKDIR /app
COPY src /app/src
COPY pom.xml /app
RUN mvn -f /app/pom.xml clean package

# pull official base image
FROM node:13.12.0-alpine

# set working directory


# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/frontend/node_modules/.bin:$PATH

# install app dependencies
COPY /frontend/package.json /app/frontend
COPY /frontend/yarn.lock /app/frontend
RUN yarn add
RUN yarn add reactstrap bootstrap react-router-dom@5.3.0

# add app
COPY . /app

# start app
CMD ["yarn", "start"]

#FROM nginx:latest
#COPY ./index.html /usr/share/nginx/html/index.html
#COPY ./style.css /usr/share/nginx/html/style.css
#COPY ./app.js /usr/share/nginx/html/app.js
#COPY ./img/ /usr/share/nginx/html/img/

#COPY ./loginform/ /usr/share/nginx/html/loginform/

#EXPOSE 80
