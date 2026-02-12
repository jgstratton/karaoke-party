FROM python:3-alpine
WORKDIR /app
EXPOSE 5000

# RUN apt-get update -y

COPY requirements.txt requirements.txt

RUN pip3 install -r requirements.txt &&\
	pip3 install --upgrade "yt-dlp[default]"
# pip3 install --upgrade yt-dlp

# install ffmpeg and move to yt-dlp, needed for file merging
RUN apk add ffmpeg
RUN cp /usr/bin/ffmpeg /usr/local/bin

COPY app.py app.py
CMD ["python3", "/app/app.py"]