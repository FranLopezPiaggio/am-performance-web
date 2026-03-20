# AM Performance Web — Docker Makefile
# ─────────────────────────────────────────────────────────────
# Uso: make <comando>
# ─────────────────────────────────────────────────────────────
.PHONY: help build up down kill restart logs shell status clean prune \
        dev dev-build dev-down dev-logs dev-shell

COMPOSE     := docker compose -f docker-compose.yml
COMPOSE_DEV := docker compose -f docker-compose.dev.yml

# ─────────────────────────── Ayuda ───────────────────────────

help: ## Mostrar todos los comandos disponibles
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | \
	  awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-15s\033[0m %s\n", $$1, $$2}'

# ──────────────────────── Producción ─────────────────────────

build: ## Construir imagen de producción (sin caché)
	$(COMPOSE) build --no-cache

up: ## Iniciar contenedor de producción en background
	$(COMPOSE) up -d

down: ## Detener y eliminar contenedor de producción
	$(COMPOSE) down

kill: ## Forzar el apagado inmediato del contenedor
	$(COMPOSE) kill
	$(COMPOSE) rm -f

restart: down up ## Reiniciar contenedor de producción

logs: ## Ver logs del contenedor de producción (streaming)
	$(COMPOSE) logs -f

status: ## Ver estado de los contenedores
	$(COMPOSE) ps

shell: ## Abrir shell en el contenedor de producción
	$(COMPOSE) exec web sh

# ──────────────────────── Desarrollo ─────────────────────────

dev: ## Iniciar en modo desarrollo con hot-reload
	$(COMPOSE_DEV) up

dev-build: ## Construir imagen de desarrollo (sin caché)
	$(COMPOSE_DEV) build --no-cache

dev-down: ## Detener el entorno de desarrollo
	$(COMPOSE_DEV) down

dev-logs: ## Ver logs del contenedor de desarrollo (streaming)
	$(COMPOSE_DEV) logs -f

dev-shell: ## Abrir shell en el contenedor de desarrollo
	$(COMPOSE_DEV) exec web sh

# ────────────────────────── Limpieza ─────────────────────────

clean: ## Eliminar contenedores, imágenes y volúmenes del proyecto
	$(COMPOSE) down --rmi local --volumes --remove-orphans
	$(COMPOSE_DEV) down --rmi local --volumes --remove-orphans

prune: ## Limpiar recursos Docker no usados en el sistema (con confirmación)
	docker system prune -f --volumes
