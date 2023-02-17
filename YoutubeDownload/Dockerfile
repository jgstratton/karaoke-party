FROM ubuntu:18.04
WORKDIR /app
EXPOSE 5000

RUN apt-get update -y
RUN apt-get install python3-pip -y

COPY requirements.txt requirements.txt

RUN pip3 install -r requirements.txt &&\
	pip3 install --upgrade yt-dlp

COPY app.py app.py
CMD ["python3", "/app/app.py"]