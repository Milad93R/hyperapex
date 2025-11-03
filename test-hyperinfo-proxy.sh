#!/bin/bash

# Test script for hyperinfo proxy endpoint
# Usage: ./test-hyperinfo-proxy.sh

echo "Testing Hyperinfo Proxy Endpoint..."
echo "=================================="
echo ""

curl -X POST http://localhost:3168/api/hyperinfo/proxy \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
    "type": "userFillsByTime",
    "user": "0xA13CF65c9fb9AFfFA991E8b371C5EE122F8ba537",
    "startTime": 1
}' \
  -w "\n\nHTTP Status: %{http_code}\n" \
  -s

echo ""
echo "Test completed!"

