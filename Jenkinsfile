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
        stage ('Dependencies scanning') {
            parallel {

                stage ('NPM Dependencies audit') {
                    steps {
                        sh '''
                            npm audit --audit-level=critical
                            echo $?
                            '''
                    }
                }
                stage ('OWASP Dependencies check') {
                    steps {
                        dependencyCheck additionalArguments: '''
                            --scan \'./\'
                            --nvdApiKey=cc537789-ead1-40c4-a8ae-4610acaa9f42 \
                            --format \'ALL\' 
                            --disableYarnAudit \
                            --prettyPrint''', odcInstallation: 'OWASP-DepCheck-10'
                        dependencyCheckPublisher failedTotalCritical: 1, pattern: 'dependency-check-report.xml', stopBuild: false

                        junit allowEmptyResults: true, testResults: 'dependency-check-junit.xml'

                        publishHTML([allowMissing: true, alwaysLinkToLastBuild: true, icon: '', keepAll: true, reportDir: './', reportFiles: 'dependency-check-jenkins.html', reportName: 'Dependency Check HTML Report', reportTitles: '', useWrapperFileDirectly: true])
                    }
                }
            }    
        }
    }
}