pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                git url: 'https://github.com/BachyrPro/ecolight.git', branch: 'main'
            }
        }

        stage('Build & Run Docker') {
            steps {
                // Stoppe les containers existants
                sh 'docker-compose down'

                // Reconstruit et lance les containers en mode détaché
                sh 'docker-compose up --build -d'
            }
        }

        stage('Test Backend Health') {
            steps {
                // Teste si le backend répond sur le port 5000 (ajuste si besoin)
                sh 'curl --fail http://localhost:5000/health'
            }
        }
    }

    post {
        success {
            echo '✅ Pipeline CI/CD réussie !'
        }
        failure {
            echo '❌ Pipeline CI/CD échouée.'
        }
    }
}
