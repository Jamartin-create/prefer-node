SHELL := /bin/bash
BRANCH=$(shell git rev-parse --abbrev-ref HEAD)
VERSION=1-$(shell git describe --always --dirty)-alpine

REPO_NAME=lilmartin/express-template

IAMGE_REPO=docker.io

push:
	docker buildx build --platform=linux/amd64 -t docker.io/${REPO_NAME}:${VERSION} .
	docker push docker.io/${REPO_NAME}:${VERSION}
	docker rmi docker.io/${REPO_NAME}:${VERSION}
	@echo "The image name is docker.io/${REPO_NAME}:${VERSION}"


without_push:
	docker buildx build --platform=linux/amd64 -t docker.io/${REPO_NAME}:${VERSION} .
	@echo "The image name is docker.io/${REPO_NAME}:${VERSION}"