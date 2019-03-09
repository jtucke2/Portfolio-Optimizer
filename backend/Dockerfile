FROM python:3.7-alpine3.7

ENV WORKING_DIRECTORY /opt/portfolio-optimizer
RUN mkdir -p $WORKING_DIRECTORY

WORKDIR $WORKING_DIRECTORY

COPY . $WORKING_DIRECTORY

RUN pip3 install pipenv --default-timeout=100
# installing dev to do unit tests from docker
RUN pipenv install --dev --system

EXPOSE 5000
