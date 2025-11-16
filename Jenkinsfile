pipeline {
    agent any
    
    environment {
        DOCKER_IMAGE = 'karthiknat/integrated-web'
        IMAGE_TAG = "${BUILD_NUMBER}"
    }
    
    stages {
        stage('Checkout') {
            steps {
                echo 'Checking out Angular application code...'
                checkout scm
            }
        }
        
        stage('Install Dependencies') {
            steps {
                echo 'Installing Node.js dependencies...'
                script {
                    bat "npm ci"
                }
            }
        }
        
        stage('Build Angular App') {
            steps {
                echo 'Building Angular application...'
                script {
                    bat "npm run build -- --configuration=production"
                }
            }
        }
        
        stage('Build Docker Image') {
            steps {
                echo 'Building Docker image...'
                script {
                    bat "docker build -t ${DOCKER_IMAGE}:${IMAGE_TAG} -t ${DOCKER_IMAGE}:latest ."
                }
            }
        }
        
        stage('Push to Docker Hub') {
            steps {
                echo 'Pushing Docker image to Docker Hub...'
                script {
                    withCredentials([usernamePassword(credentialsId: 'dockerhub-credentials', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                        bat "docker login -u %DOCKER_USER% -p %DOCKER_PASS%"
                        bat "docker push ${DOCKER_IMAGE}:${IMAGE_TAG}"
                        bat "docker push ${DOCKER_IMAGE}:latest"
                    }
                }
            }
        }
        
        stage('Deploy to Kubernetes') {
            steps {
                echo 'Deploying to Docker Desktop Kubernetes...'
                script {
                    withCredentials([file(credentialsId: 'kube-config', variable: 'KUBECONFIG')]) {
                        bat "kubectl apply -f angular-deploy.yml --kubeconfig=%KUBECONFIG%"
                        bat "kubectl rollout restart deployment/angular-app-deployment --kubeconfig=%KUBECONFIG%"
                        bat "kubectl rollout status deployment/angular-app-deployment --kubeconfig=%KUBECONFIG%"
                    }
                }
            }
        }
    }
    
    post {
        success {
            echo 'Angular application build and deployment successful!'
            echo 'Application will be accessible at: http://kong-proxy.local/web'
            echo 'After configuring Kong routing in the next section'
        }
        failure {
            echo 'Pipeline failed. Check logs for details.'
        }
    }
}