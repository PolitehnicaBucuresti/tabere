# Local dev: needs Node + npm. Production: needs Docker + Docker Compose v2.
.PHONY: help install dev-start prod-start prod-stop

help:
	@echo "Targets:"
	@echo "  make install     Install npm dependencies (npm ci)"
	@echo "  make dev-start   Run Next.js locally (development)"
	@echo "  make prod-start  Build & run app in Docker (production)"
	@echo "  make prod-stop   Stop Docker Compose stack"

install:
	npm ci

dev-start:
	@test -d node_modules || $(MAKE) install
	npm run dev

prod-start:
	bash scripts/docker-up.sh

prod-stop:
	docker compose down
