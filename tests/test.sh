#!/usr/bin/env bash

API_URL="http://localhost:3000/api/logs"
HEALTH_URL="http://localhost:3000/health"

echo "==> Health check"
curl -s $HEALTH_URL | jq .
echo

echo "==> Delete all logs to start clean"
LOG_IDS=$(curl -s "$API_URL" | jq -r '.logs[]?.id')
for id in $LOG_IDS; do
  echo "Deleting log id: $id"
  curl -s -X DELETE "$API_URL/$id" > /dev/null
done
echo

echo "==> Ensure DB is empty (GET all logs)"
curl -s "$API_URL" | jq .
echo

echo "==> Try GET by ID when no logs exist (should 404)"
curl -s -w "\nHTTP_CODE:%{http_code}\n" "$API_URL/0"
echo

echo "==> POST a new log (valid)"
RESPONSE=$(curl -s -X POST "$API_URL" \
  -H "Content-Type: application/json" \
  -d '{"userId": "user1", "action": "login", "metadata": {"ip": "127.0.0.1"}}')
echo "$RESPONSE" | jq .
echo

echo "==> Wait for log to be processed (Kafka delay)..."
sleep 3

echo "==> GET all logs (should have 1)"
curl -s "$API_URL" | jq .
echo

echo "==> GET log by ID (should succeed)"
LOG_ID=$(curl -s "$API_URL" | jq '.logs[0].id')
curl -s "$API_URL/$LOG_ID" | jq .
echo

echo "==> POST with missing required fields (should 400)"
curl -s -X POST "$API_URL" \
  -H "Content-Type: application/json" \
  -d '{"userId": "user2"}' | jq .
echo

echo "==> DELETE log by ID (should succeed)"
curl -s -X DELETE "$API_URL/$LOG_ID" | jq .
echo

echo "==> GET log by ID after delete (should 404)"
curl -s -w "\nHTTP_CODE:%{http_code}\n" "$API_URL/$LOG_ID"
echo

echo "==> GET all logs after delete (should be empty)"
curl -s "$API_URL" | jq .
echo

echo "==> DELETE non-existent log (should 404)"
curl -s -X DELETE "$API_URL/99999" | jq .
echo

echo "==> GET with filters (should be empty)"
curl -s "$API_URL?userId=user1&action=login" | jq .
echo

# --- Multiple logs processing ---

echo "==> POST multiple logs"
RESP1=$(curl -s -X POST "$API_URL" -H "Content-Type: application/json" -d '{"userId": "userA", "action": "login", "metadata": {"ip": "10.0.0.1"}}')
RESP2=$(curl -s -X POST "$API_URL" -H "Content-Type: application/json" -d '{"userId": "userB", "action": "logout", "metadata": {"ip": "10.0.0.2"}}')
RESP3=$(curl -s -X POST "$API_URL" -H "Content-Type: application/json" -d '{"userId": "userA", "action": "update", "metadata": {"ip": "10.0.0.1"}}')
echo "$RESP1" | jq .
echo "$RESP2" | jq .
echo "$RESP3" | jq .
echo

echo "==> Wait for logs to be processed (Kafka delay)..."
sleep 3

echo "==> GET all logs (should have 3)"
curl -s "$API_URL" | jq .
echo

echo "==> GET logs filtered by userId=userA"
curl -s "$API_URL?userId=userA" | jq .
echo

echo "==> GET logs filtered by action=logout"
curl -s "$API_URL?action=logout" | jq .
echo

echo "==> GET logs filtered by userId=userA and action=update"
curl -s "$API_URL?userId=userA&action=update" | jq .
echo

echo "==> DELETE one of the logs (userB logout)"
LOG_ID_B=$(curl -s "$API_URL?action=logout" | jq -r '.logs[0].id')
curl -s -X DELETE "$API_URL/$LOG_ID_B" | jq .
echo

echo "==> GET all logs after deleting userB logout (should have 2)"
curl -s "$API_URL" | jq .
echo

echo "==> All tests completed."