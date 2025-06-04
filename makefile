.PHONY: up down build logs

up:
	docker-compose -f docker-compose.yml up -d

down:
	docker-compose -f docker-compose.yml down

build:
	docker-compose -f docker-compose.yml build

logs:
	docker-compose -f docker-compose.yml logs -f

restart:
	docker-compose -f docker-compose.yml restart

migrate:
	docker-compose -f docker-compose.yml exec app npx prisma migrate dev