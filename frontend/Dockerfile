FROM node:11.14-alpine

ENV WORKING_DIRECTORY /opt/portfolio-optimizer
RUN mkdir -p $WORKING_DIRECTORY

WORKDIR $WORKING_DIRECTORY

COPY . $WORKING_DIRECTORY

RUN npm --loglevel error install

EXPOSE 4200
