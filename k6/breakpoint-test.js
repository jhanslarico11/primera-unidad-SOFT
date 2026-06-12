import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '30s', target: 50 },   // Rampa a 50 usuarios
    { duration: '30s', target: 50 },   // Mantén 50
    { duration: '30s', target: 100 },  // Sube a 100
    { duration: '30s', target: 100 },  // Mantén 100
    { duration: '30s', target: 200 },  // Sube a 200
    { duration: '30s', target: 200 },  // Mantén 200
    { duration: '30s', target: 500 },  // Sube a 500
    { duration: '30s', target: 500 },  // Mantén 500
    { duration: '30s', target: 0 },    // Reduce a 0
  ],
  thresholds: {
    // Detiene la prueba si hay más del 5% de errores
    'http_req_failed': [{ threshold: 'rate < 0.05', abortOnFail: true }],
    // Detiene si el tiempo de respuesta supera los 30 segundos
    'http_req_duration': [{ threshold: 'p(95) < 30000', abortOnFail: true }],
  },
};

export default function () {
  const start = new Date();
  let res = http.get('http://127.0.0.1:8000/login');
  const duration = new Date() - start;

  const success = check(res, {
    'status es 200': (r) => r.status === 200,
    'respuesta rápida': (r) => duration < 30000, // menos de 30 segundos
  });

  if (!success) {
    console.log(`❌ Fallo - Status: ${res.status}, Tiempo: ${duration}ms`);
  }

  sleep(1);
}
