import json
import random
import string
import os
import subprocess
import shutil
import boto3
from subprocess import check_output
from botocore.exceptions import ClientError

bucket_name = "karaoke-files"
youtubedl_path="/usr/local/bin/yt-dlp"
download_path="/tmp"
cookie_path = "/tmp/cookies"
os.mkdir(cookie_path)
shutil.copyfile("/function/cookies.txt", "/tmp/cookies/cookies.txt")

# use yt-dlp to get the video information (without downloading the file)
def get_file_details(video_url):
	cmd = [
		youtubedl_path,
		"--write-info-json",
		"--cookies", "/tmp/cookies/cookies.txt",
		"--skip-download",
		"--print",
		'{"id":"%(id)s","title":"%(title)S","ext":"%(ext)s"}',
		video_url
	]

	try:
		print(f"Checking if video for for {video_url} exists in S3")
		result = subprocess.run(cmd, capture_output=True, text=True)
	except Exception as e:
		# retry once
		print(f"Failed with error: {e}. Retrying once")
		result = subprocess.run(cmd, capture_output=True, text=True)
	
	string_result = result.stdout
	print(string_result)
	return json.loads(string_result)

def file_exists_in_s3(file_key):
	print(f"Checking for file {file_key} in S3")
	s3_client = boto3.client('s3')
	try:
		s3_client.head_object(Bucket=bucket_name, Key=file_key)
		print(" - File found in S3")
		return True
	except ClientError as e:
		if e.response['Error']['Code'] == '404':
			print(" - File not found in S3")
			return False
		else:
			raise

# get the video information and check if it already exists in the s3 bucket,
# if found it will return the file name, otherwise it will return an empty string
def check_video(video_url):

	info_dict = get_file_details(video_url)
	video_title = info_dict.get('title', None)
	video_id = info_dict.get('id', None)
	video_ext = info_dict.get('ext', None)
	print(f"Retrieved video info: {video_title}, {video_id}, {video_ext}")

	def build_response(key, status):
		return {
			'found': status,
			'title': video_title,
			's3_key': key,
			'url': video_url,
			'video_id': video_id
		}

	key = f"Songs/{video_title}---{video_id}.{video_ext}"
	if file_exists_in_s3(key):
		return build_response(key, True)
	
	key = f"Songs/{video_id}.{video_ext}"
	if file_exists_in_s3(key):
		return build_response(key, True)

	if (video_ext != 'mp4'):
		key = f"Songs/{video_title}---{video_id}.mp4"
		if file_exists_in_s3(key):
			return build_response(key, True)
		key = f"Songs/{video_id}.mp4"
		if file_exists_in_s3(key):
			return build_response(key, True)
	
	print(f"No variations of the file were found in S3")
	return build_response('', False)

def download_video(cur_response):
	temp_folder = ''.join(random.choices(string.ascii_lowercase, k=5))
	temp_path = download_path + "/" + temp_folder
	os.mkdir(temp_path)
	
	dl_path = temp_path + "/%(id)s.%(ext)s"
	file_quality = "bestvideo[ext=mp4][height<=720]+bestaudio[ext=m4a]/best[ext=mp4]/best"
	
	print("**************")
	print(cur_response)
	print("**************")
	cmd = [
		youtubedl_path,
		"-f",
		file_quality,
		"-o",
		dl_path,
		"--max-downloads",
		"1",
		"--cookies",
		"/tmp/cookies/cookies.txt",
		"--cache-dir",
		"/tmp/~.cache/yt-dlp",
		cur_response['url']
	]

	print("Attempting to download file with yt-dlp")
	rc = subprocess.call(cmd)
	if rc != 0 and rc != 101: #yt-dlp will return 101 max-download errors incorrectly
		print(f"YT-DLP Failed with status code {rc}: Attempting to download file again")
		rc = subprocess.call(cmd) # retry once. Seems like this can be flaky
	
	# there should only be one file in the temp folder, the newly downloaded file
	s3key = ""
	for file_name in os.listdir(temp_path):
		try:
			s3key = f"Songs/{file_name}"
			final_file_full_path = os.path.join(download_path + "/", file_name)
			shutil.copy(os.path.join(temp_path,file_name), final_file_full_path)
			print("File download complete, uploading to S3")
			s3 = boto3.resource('s3')
			s3.Bucket("karaoke-files").upload_file(final_file_full_path, s3key)
		except OSError:
			# possible the file already exists
			print('File already exists in the destination folder')

	shutil.rmtree(temp_path)
	cur_response['found'] = True
	cur_response['s3_key'] = s3key
	return

def handler(event, context):
	print ("~~~BEGIN EVENT LOG~~~")
	print (event)
	print ("~~~END EVENT LOG~~~")

	if ('video_url' not in event):
		return {
			"error": "video_url is a required parameter"
		}
		
	
	response = check_video(event['video_url'])
	if (not response['found']):
		download_video(response)
		
	return response