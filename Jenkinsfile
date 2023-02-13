pipeline {
	agent any
	environment {
        DOCKER_REPOSITORY_HOST = credentials('jenkins-docker-registry-host')
        DOCKER_REPOSITORY_PORT = credentials('jenkins-docker-registry-port')
    }
	stages {

		stage('Build .net api docker image') {
			steps {
				script {
					echo "building karaoke-party-api"
					docker.withRegistry('http://${jenkins-docker-registry-host}:${jenkins-docker-registry-port}') {
						def dockerImage = docker.build("jgstratton/karaoke-party-api:latest")
						dockerImage.push()
					}
				}
			}
		}
	}
}