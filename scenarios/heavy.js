import http from "k6/http";
import { sleep } from "k6";

export let options = {
  vus: 50,          // 동시에 50명
  duration: "2m",   // 2분 동안 부하
};

export default function () {
  // Docker 안에서 외부 local 서버 접근 시 host.docker.internal 필수
  http.get("http://host.docker.internal:4000/heavy");

  sleep(1); // 1초 쉬고 반복
}
