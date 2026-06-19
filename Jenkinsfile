pipeline {
    agent any
    stages {
        stage('1. Entorno') {
            steps {
                echo "🚀 Jenkins Pipeline - Ventas Web"
                bat 'k6 version'
            }
        }
        stage('2. Servidor') {
            steps {
                bat 'start /B php -S localhost:8000 -t public'
                bat 'timeout /t 5 /nobreak > NUL'
            }
        }
        stage('3. K6 Test') {
            steps {
                bat 'k6 run k6/scenarios/all-controllers-test.js --env BASE_URL=http://localhost:8000'
            }
        }
    }
    post {
        always {
            bat 'taskkill /F /IM php.exe 2>NUL'
        }
    }
}
