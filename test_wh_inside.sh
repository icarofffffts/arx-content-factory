#!/bin/sh
curl -s -o /dev/null -w '%{http_code}' http://localhost:5678/webhook/content-factory-trigger -X POST -H 'Content-Type: application/json' -d '{"topic":"teste"}'
