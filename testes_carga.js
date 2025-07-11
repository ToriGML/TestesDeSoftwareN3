import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
  vus: 20,
  duration: '30s',
};

const BASE_URL = 'http://localhost:8000/games';

export default function () {
  
  const payload = JSON.stringify({
    title: `Test Game ${Math.random()}`,
    genre: 'Stress',
    year: 2023,
  });

  let createRes = http.post(BASE_URL, payload, { headers: { 'Content-Type': 'application/json' } });
  check(createRes, { 'created game': (res) => res.status === 200 });

  const game = JSON.parse(createRes.body);
  const id = game.id;

  let getRes = http.get(`${BASE_URL}/${id}`);
  check(getRes, { 'read game': (res) => res.status === 200 });

  const updatePayload = JSON.stringify({ title: 'Updated', genre: 'Stress', year: 2024 });
  let updateRes = http.put(`${BASE_URL}/${id}`, updatePayload, { headers: { 'Content-Type': 'application/json' } });
  check(updateRes, { 'updated game': (res) => res.status === 200 });

  let delRes = http.del(`${BASE_URL}/${id}`);
  check(delRes, { 'deleted game': (res) => res.status === 200 });

  sleep(1);
}
