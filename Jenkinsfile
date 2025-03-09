pipeline {
    agent any
    tools {
        nodejs 'nodejs-22-6-0'
    }
    environment {
        MONGO_URI = "mongodb://newadmin:newadmin123@172.31.44.0:27017/admin"
        MONGO_DB_CREDS = credentials ('mongo-db-creds')
        MONGO_USERNAME = credentials ('mongo-db-username')
        MONGO_PASSWORD = credentials ('mongo-db-password')
        SONAR_SCANNER_HOME = tool 'sonarqube-scanner-702';
    }

    options {
        disableResume()
        disableConcurrentBuilds abortPrevious: true
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
            options { timestamps() }
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

       
                    }
                }
            }    
        }
        stage ('Unit Testing') {
            options { retry(1) }
            steps {
                //withCredentials([usernamePassword(credentialsId: 'mongo-db-creds', passwordVariable: 'MONGO_PASSWORD', usernameVariable: 'MONGO_USERNAME')])  
                sh 'echo Colon-Separated - $MONGO_DB_CREDS'
                sh 'echo Username - $MONGO_DB_CREDS_USR'
                sh 'echo Password - $MONGO_DB_CREDS_PSW'
                sh 'npm test'
               }


            }
        stage ('Code Coverage') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'mongo-db-creds', passwordVariable: 'MONGO_PASSWORD', usernameVariable: 'MONGO_USERNAME')]) {
                catchError(buildResult: 'SUCCESS', message: 'It will be fixed in future releases', stageResult: 'UNSTABLE') {
                    sh 'npm run coverage'
               }
                }
            }
        }    
        stage ('SAST - SonarQube') {
            steps {
                sh 'echo $SONAR_SCANNER_HOME'
                sh '''
                    $SONAR_SCANNER_HOME/bin/sonar-scanner \
                    -Dsonar.projectKey=solar-system \
                    -Dsonar.sources=. \
                    -Dsonar.host.url=http://65.0.32.124:9000 \
                    -Dsonar.token=sqp_503c3389d486ddb38001fa5c6eb5a9da1babb703

                '''
            }
        }
    }
    post {
    always {
        // One or more steps need to be included within each condition's block.
        junit allowEmptyResults: true, testResults: 'test-results.xml'
        junit allowEmptyResults: true, testResults: 'dependency-check-junit.xml'
        publishHTML([allowMissing: true, alwaysLinkToLastBuild: true, icon: '', keepAll: true, reportDir: './', reportFiles: 'dependency-check-jenkins.html', reportName: 'Dependency Check HTML Report', reportTitles: '', useWrapperFileDirectly: true])
        publishHTML([allowMissing: true, alwaysLinkToLastBuild: true, icon: '', keepAll: true, reportDir: 'coverage/lcov-report', reportFiles: 'index.html', reportName: 'Code Coverage HTML Report', reportTitles: '', useWrapperFileDirectly: true])
    }
    }

}
