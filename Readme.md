🚀 Load Testing Platform (K6 + Grafana + Prometheus + InfluxDB)

이 레포지토리는 K6 기반 부하 테스트 플랫폼 템플릿입니다.
API 서버가 무엇이든 간에, K6 시나리오를 실행하고 메트릭을 수집하여 Grafana 대시보드로 시각화할 수 있습니다.

Spring Boot 등 외부 서비스와 의존성이 없으며, curl 요청만으로 부하 테스트를 시작할 수 있는 구조입니다.

📂 프로젝트 구조
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
│       ├── index.js         ← API 엔드포인트 (/load/start)
│       └── k6-run.js        ← K6 실행 스크립트
├── prometheus
│   └── prometheus.yml
└── scenarios
    ├── health.js
    ├── load.js
    └── spike.js

🐳 1. 실행 방법
1) 의존성 설치 & 컨테이너 실행
docker compose up -d --build

실행 후 구성 요소

load-api → K6 실행 REST API

Prometheus

InfluxDB

Grafana (3001포트)

K6 (load-api 내부에서 실행됨)

⚡ 2. 부하 테스트 실행 방법

부하 시나리오는 /scenarios 폴더 안에 .js 파일로 작성합니다.
예: load.js, spike.js, health.js

🔥 Load 테스트 실행
curl -X POST http://localhost:3000/load/start \
  -H "Content-Type: application/json" \
  -d '{"scenario":"load.js","vus":200,"duration":"2m"}'

⚡ Spike 테스트 실행
curl -X POST http://localhost:3000/load/start \
  -H "Content-Type: application/json" \
  -d '{"scenario":"spike.js"}'

🩺 Health 테스트 실행
curl -X POST http://localhost:3000/load/start \
  -H "Content-Type: application/json" \
  -d '{"scenario":"health.js"}'

🎛 3. Grafana 접속

http://localhost:3001

기본 계정

ID: admin

PW: admin

포함된 대시보드

✔ K6 Load Test Dashboard (k6-min.json)

✔ 시스템 메트릭

✔ Prometheus 기본 메트릭

📡 4. 시스템 아키텍처
[Client] → curl → load-api → K6 → API 서버 대상 부하 발생
                                 ↓
                              InfluxDB → Grafana 시각화
                    Prometheus → Grafana 메트릭 수집


load-api는 단순히 K6를 대신 실행해주는 “부하 테스트 오케스트레이터” 역할만 수행합니다.

🧪 5. 시나리오 작성 예시

scenarios/load.js

import http from 'k6/http';
import { sleep } from 'k6';

export const options = {
  vus: 100,
  duration: '2m',
};

export default function () {
  http.get(`${__ENV.TARGET_URL}/api/users`);
  sleep(1);
}


TARGET_URL 은 load-api 환경변수를 통해 주입됩니다.

🛠 6. load-api 설명
/load/start 엔드포인트
POST /load/start
{
  "scenario": "load.js",
  "vus": 200,
  "duration": "2m"
}

동작 방식

전달된 시나리오 파일 실행

컨테이너 내부에서 K6 실행

결과 메트릭을 InfluxDB로 전달

Grafana에서 실시간 확인 가능

📌 7. 환경 변수
TARGET_URL 설정 (테스트 대상 API)

docker-compose.yml → load-api

environment:
  - TARGET_URL=http://your-api-url.com

🚀 8. 확장 방법

/scenarios 에 새로운 시나리오 추가

load-api에서 새로운 옵션 추가

Grafana 대시보드 추가

외부 API 인증 토큰 적용 가능

✔ 최종 정리

이 레포는 어떤 백엔드 서비스든 상관없이 K6로 부하를 발생시키고,
Grafana + Prometheus + InfluxDB로 모니터링 가능한 재사용 가능 템플릿이다.

curl 로 쉽게 부하 시작 → Grafana에서 바로 시각화
