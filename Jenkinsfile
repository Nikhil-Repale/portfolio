pipeline {
    agent any

    environment {
        GIT_CRED          = 'gitlab_cred'
        DOCKER_CRED       = 'docker_cred_1'
        KUBECONFIG_CRED   = 'kubeconfig-cred'

        REPO_URL          = 'https://github.com/Nikhil-Repale/portfolio.git'
        BRANCH            = 'main'

        DOCKER_USER       = 'nikhil2202'
        IMAGE_NAME        = 'portfolio'
        IMAGE_TAG         = 'latest'

        K8S_NAMESPACE     = 'portfolio'
    }

    stages {

        stage('Cleanup') {
            steps {
                sh '''
                    echo "Cleaning workspace..."
                    rm -rf portfolio_repo

                    echo "Cleaning old Docker images..."
                    docker images | grep portfolio | awk '{print $3}' | xargs -r docker rmi -f || true
                '''
            }
        }

        stage('Clone Repository') {
            steps {
                dir('portfolio_repo') {
                    checkout([
                        $class: 'GitSCM',
                        branches: [[name: "*/${BRANCH}"]],
                        userRemoteConfigs: [[
                            url: "${REPO_URL}",
                            credentialsId: GIT_CRED
                        ]]
                    ])
                }
            }
        }

        stage('Docker Login') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: DOCKER_CRED,
                    usernameVariable: 'DUSER',
                    passwordVariable: 'DPASS'
                )]) {
                    sh '''
                        echo "Docker Login..."
                        echo "$DPASS" | docker login -u "$DUSER" --password-stdin
                    '''
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                dir('portfolio_repo') {
                    sh '''
                        echo "Building Docker image..."
                        docker build -t ${DOCKER_USER}/${IMAGE_NAME}:${IMAGE_TAG} .
                    '''
                }
            }
        }

        stage('Push Image') {
            steps {
                sh '''
                    echo "Pushing image to Docker Hub..."
                    docker push ${DOCKER_USER}/${IMAGE_NAME}:${IMAGE_TAG}
                '''
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                withCredentials([string(
                    credentialsId: KUBECONFIG_CRED,
                    variable: 'KUBECONFIG_BASE64'
                )]) {

                    dir('portfolio_repo') {
                        sh '''
                            echo "Deploying to Kubernetes..."

                            echo "$KUBECONFIG_BASE64" | base64 -d > kubeconfig.yaml
                            export KUBECONFIG=kubeconfig.yaml

                            kubectl apply -f deployment.yaml

                            kubectl -n portfolio set image deployment/portfolio-deployment \
                            portfolio=${DOCKER_USER}/${IMAGE_NAME}:${IMAGE_TAG} --record
                        '''
                    }
                }
            }
        }
    }

    post {
        success {
            echo "Deployment successful."
        }
        failure {
            echo "Pipeline failed. Check logs."
        }
        always {
            sh "rm -f ~/.netrc || true"
        }
    }
}
