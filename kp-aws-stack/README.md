### Commands

```bash
sam build --use-container
sam deploy --guided
sam local invoke DownloadSongFunction -e event.json
```

```bash
aws ecr get-login-password --region YOUR_REGION | docker login --username AWS --password-stdin ECR_URI

# build the image for AWS lambda function
docker build --platform linux/amd64 -t kp-download-song-local .

# test the docker image locally
docker run --platform linux/amd64 -d -v ~/.aws-lambda-rie:/aws-lambda -p 9000:8080 --entrypoint /aws-lambda/aws-lambda-rie kp-download-song-local /usr/local/bin python -m awslambdaric lambda_function.handler

# tag the local image
docker tag kp-download-song-local ECR_URI

# push image
docker push ECR_URI:song-download-latest
```
