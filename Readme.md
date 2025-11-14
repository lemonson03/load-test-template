# 🚀 Load Testing Platform (K6 + Grafana + Prometheus + InfluxDB)

이 레포지토리는 **K6 기반 부하 테스트 플랫폼 템플릿**입니다.  
API 서버가 무엇이든 간에 K6 시나리오를 실행하고, 메트릭을 수집하여 Grafana 대시보드로 시각화할 수 있습니다.

Spring Boot 등 외부 서비스와 의존성이 없으며,  
단순히 `curl` 요청만으로 부하 테스트를 실행할 수 있는 구조입니다.

---

## 📂 프로젝트 구조

```
.
├── docker-compose.yml
├── grafana
│   ├── dashboards
│   │   ├── dashboards.yml
│   │   └── k6-min.json
│   └── provisioning
│       └── datasources
│           └── datasources.yml
├── influxdb
│   └── init.iql
├── load-api
│   ├── Dockerfile
│   ├── package.json
│   └── src
│       ├── index.js
│       └── k6-run.js
├── prometheus
│   └── prometheus.yml
└── scenarios
    ├── health.js
    ├── load.js
    └── spike.js
```

---

## 🐳 1. 실행 방법

### 1. 컨테이너 실행
```bash
docker compose up -d --build
```

---

## 📡 구성 요소 설명

### **load-api**
- REST API 형태로 k6 테스트 실행
- 예: `/load/start`

### **K6**
- load-api 내부에서 도커로 실행됨
- prometheus-remote-write로 메트릭 전송

### **Prometheus**
- K6 메트릭 수집

### **InfluxDB**
- 시간 기반 메트릭 저장 (선택적)

### **Grafana (3001 포트)**
- K6 대시보드 및 Prometheus 메트릭 시각화

---

## ⚡ 부하 테스트 실행 방법

### ✔ Load 테스트
```bash
curl -X POST http://localhost:3000/load/start \
  -H "Content-Type: application/json" \
  -d '{"scenario":"load.js","vus":200,"duration":"2m"}'
```

### ✔ Spike 테스트
```bash
curl -X POST http://localhost:3000/load/start \
  -H "Content-Type: application/json" \
  -d '{"scenario":"spike.js"}'
```

---

## 📊 Grafana 접속

- URL: http://localhost:3001  
- 기본 계정: `admin / admin`

---

## 🎯 목적

- 프로젝트마다 재사용 가능한 **표준 부하 테스트 플랫폼**
- K6 → Prometheus → Grafana → 시각화까지 자동 구성
- API 서버만 바뀌어도 그대로 사용 가능

---

## 📝 라이선스
MIT
