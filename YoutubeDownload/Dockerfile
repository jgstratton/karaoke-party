FROM python:3-alpine
WORKDIR /app
EXPOSE 5000

# RUN apt-get update -y

COPY requirements.txt requirements.txt

RUN pip3 install -r requirements.txt &&\

	# install master
	pip3 install --force-reinstall https://github.com/yt-dlp/yt-dlp/archive/master.tar.gz
# pip3 install --upgrade yt-dlp

# install ffmpeg and move to yt-dlp, needed for file merging
RUN apk add ffmpeg
RUN cp /usr/bin/ffmpeg /usr/local/bin

COPY app.py app.py
CMD ["python3", "/app/app.py"]