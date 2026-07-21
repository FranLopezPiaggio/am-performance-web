# AM Performance Web — Makefile
# ──────────────────────────────────────────────────

.PHONY: dev build test test-e2e lint clean

dev:
	docker compose -f docker-compose.dev.yml up

dev-build:
	docker compose -f docker-compose.dev.yml up --build

build:
	docker compose build

up:
	docker compose up -d

down:
	docker compose down

test:
	npm test

test-watch:
	npm run test:watch

test-e2e:
	npm run test:e2e

lint:
	npm run lint

clean:
	rm -rf .next node_modules
	npm install
