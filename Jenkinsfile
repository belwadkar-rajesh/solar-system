pipeline {
    agent any
    tools {
        nodejs 'nodejs-22-6-0'
    }

    stages {
        stage('VM Node Version') {
            steps {
                sh '''
                    node -v
                    npm -v
                    hostname
                '''
            }
        }
        stage ('Installing Dependencies') {
            steps {
                sh 'npm install --no-audit'
            }

        }
        stage ('NPM Dependencies audit') {
            steps {
                sh '''
                    npm audit --audit-level=critical
                    echo $?
                    '''
            }
        }
    }
}