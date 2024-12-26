# Define custom function directory
ARG FUNCTION_DIR="/function"

# Since installing ffmpeg is slower, do that in a separate base image
FROM python:3.12-slim

RUN mkdir -p /function
WORKDIR /function

RUN apt-get -y update \
	&& apt-get -y install ffmpeg --no-install-recommends \
	&& apt-get clean

RUN	pip3 install --force-reinstall https://github.com/yt-dlp/yt-dlp/archive/master.tar.gz

COPY . /function
RUN pip3 install  awslambdaric
RUN pip3 install -r requirements.txt

# Set runtime interface client as default command for the container runtime
ENTRYPOINT [ "/usr/local/bin/python", "-m", "awslambdaric" ]

# Pass the name of the function handler as an argument to the runtime
CMD [ "lambda_function.handler" ]