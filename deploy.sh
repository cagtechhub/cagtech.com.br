#!/usr/bin/env bash
set -euo pipefail

docker compose up -d --remove-orphans --build
docker compose ps
