.PHONY: up down build logs migrate migrate-dev check-containers

up:
	docker-compose -f docker-compose.yml up -d

down:
	docker-compose -f docker-compose.yml down

down-rm:
	docker-compose -f docker-compose.yml down --rmi all

build:
	docker-compose -f docker-compose.yml build

logs:
	docker-compose -f docker-compose.yml logs -f

restart:
	docker-compose -f docker-compose.yml restart

# Check if required containers are running
check-containers:
	@if [ "$(shell docker ps -q -f name=pae_site_collector-db-1)" = "" ]; then \
		echo "Database container is not running. Starting containers..."; \
		$(MAKE) up; \
		sleep 5; \
	fi
	@if [ "$(shell docker ps -q -f name=pae_site_collector-app-1)" = "" ]; then \
		echo "App container is not running. Starting containers..."; \
		$(MAKE) up; \
		sleep 5; \
	fi

# Run migrations in development mode (creates new migrations)
migrate-dev: check-containers
	@echo "Running database migrations in development mode..."
	@docker-compose -f docker-compose.yml exec app npx prisma migrate dev

# Run migrations in production mode (applies existing migrations)
migrate: check-containers
	@echo "Running database migrations..."
	@docker-compose -f docker-compose.yml exec app npx prisma migrate deploy

# Generate Prisma client
generate: check-containers
	@echo "Generating Prisma client..."
	@docker-compose -f docker-compose.yml exec app npx prisma generate