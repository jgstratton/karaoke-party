pipeline {
	agent any
	environment {
		DOCKER_REGISTRY_HOST = credentials('jenkins-docker-registry-host')
		DOCKER_REGISTRY_PORT = credentials('jenkins-docker-registry-port')
	}
	stages {
		stage('Build .net api docker image') {
			steps {
				script {
					echo "building karaoke-party-api"
					docker.withRegistry("http://${DOCKER_REGISTRY_HOST}:${DOCKER_REGISTRY_PORT}") {
						docker
							.build("jgstratton/karaoke-party-api:latest")
							.push()
					}
				}
			}
		}
		stage('Build yt-dlp docker image') {
			steps {
			    script {
    				dir("./YoutubeDownload") {
    					docker.withRegistry("http://${DOCKER_REGISTRY_HOST}:${DOCKER_REGISTRY_PORT}") {
    						docker
    							.build("jgstratton/karaoke-party-yt-dlp:latest")
    							.push()
    					}
    				}
			    }
			}
		}
	}
}