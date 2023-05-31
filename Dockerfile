# specify the ubuntu base image
FROM ubuntu

# install nodejs and npm
RUN apt-get update && apt-get install -y nodejs npm

# install gcc and g++
RUN apt-get install -y gcc g++

# install python
RUN apt-get install -y python-is-python3

# install java
RUN apt-get install -y openjdk-8-jdk

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./
RUN npm install

# Bundle app source
COPY . .

# expose port 8080
EXPOSE 8080

# start the app
CMD [ "npm", "start" ]
