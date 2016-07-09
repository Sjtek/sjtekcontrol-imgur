FROM node:latest
MAINTAINER Wouter Habets <wouterhabets@gmail.com>

EXPOSE 3000
VOLUME ["/etc/sjtekcontrol/imgur"]
WORKDIR /src

ADD package.json /src/package.json
RUN cd /src && npm install --production
ADD . /src

CMD ["npm", "start"]