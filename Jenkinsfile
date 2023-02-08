pipeline {
	agent any
	environment {
        DOCKER_REPOSITORY_HOST = credentials('jenkins-docker-repository-host')
        DOCKER_REPOSITORY_PORT = credentials('jenkins-docker-repository-port')
    }
	stages {

		stage('Build .net api docker image') {
			steps {
				dockerImage = docker.build("jgstratton/karaoke-party-api:latest")
				docker.withRegistry('https://${DOCKER_REPOSITORY_HOST}:${DOCKER_REPOSITORY_PORT}') {
					def customImage = docker.build("covid-builder:${env.BUILD_ID}")
					
				}
			}
		}
	}
}