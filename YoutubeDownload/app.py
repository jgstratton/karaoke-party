from flask import (Flask, request, jsonify)
import json
import subprocess
import random
import string
import os
import shutil
from subprocess import check_output
from unidecode import unidecode

app = Flask(__name__)
youtubedl_path="/usr/local/bin/yt-dlp"
download_path="/usr/lib/songs"
high_quality=False # not sure how this works

@app.route('/')
def hello_world():
	return 'Hello World'

@app.route("/search", methods=["GET"])
def search():
	if "search_string" in request.args:
		search_string = request.args["search_string"]
		search_results = get_search_results(search_string)
	else:
		search_string = None
		search_results = {}
	return jsonify(search_results)

def get_search_results(textToSearch):
	num_results = 10
	yt_search = 'https://www.youtube.com/results?search_query=%s' % (textToSearch)
	cmd = [youtubedl_path, "-j", "--no-playlist", "--flat-playlist","--match-filter","url!*=/shorts/", "-I", "1:10", yt_search]
	app.logger.info(cmd)
	try:
		output = subprocess.check_output(cmd).decode("utf-8")
		rc = []
		for each in output.split("\n"):
			if len(each) > 2:
				j = json.loads(each)
				if (not "title" in j) or (not "url" in j):
					continue
				rc.append({
					"title": j["title"],
					"url": j["url"],
					"id": j["id"]
				})
		return rc
	except Exception as e:
		raise e

@app.route("/download", methods=["GET"])
def download():
	song = request.args["url"]
	# download in the background since this can take a few minutes
	download_result = download_video(song)
	return {
		"status": "success",
		"file": download_result
	}

def download_video(video_url):
	temp_folder = ''.join(random.choices(string.ascii_lowercase, k=5))
	temp_path = download_path + "/" + temp_folder
	os.mkdir(temp_path)
	dl_path = temp_path + "/%(title)s---%(id)s.%(ext)s"
	file_quality = "bestvideo[ext=mp4][height<=720]+bestaudio[ext=m4a]/best[ext=mp4]/best"
	app.logger.info(file_quality)
	cmd = [youtubedl_path, "-f", file_quality, "-o", dl_path, "--max-downloads", "1",video_url]
	rc = subprocess.call(cmd)
	if rc != 0:
		rc = subprocess.call(cmd) # retry once. Seems like this can be flaky
	
	# there should only be one file in the temp folder, the newly downloaded file
	new_file_name = ""
	for file_name in os.listdir(temp_path):
		try:
			new_file_name = file_name
			shutil.copy(os.path.join(temp_path,file_name), os.path.join(download_path + "/", file_name))
		except OSError:
			# possible the file already exists
			print('File already exists in the destination folder')

	shutil.rmtree(temp_path)
	return new_file_name

if __name__ == '__main__':
  app.run(debug = True, host='0.0.0.0') # make this run on docker