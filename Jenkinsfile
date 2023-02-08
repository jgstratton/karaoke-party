pipeline {
	agent any
	environment {
        DOCKER_REPOSITORY_HOST = credentials('jenkins-docker-repository-host')
        DOCKER_REPOSITORY_PORT = credentials('jenkins-docker-repository-port')
    }
	stages {

		stage("Clone Repository") {
			git credentialsId: '2a8e9a6c-4ecb-4eaa-a535-69d872091532', url: 'https://github.com/jgstratton/karaoke-party'
		}

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