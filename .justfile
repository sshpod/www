set shell := ["zsh", "-uc"]

default:
  @just --list

install:
  npm ci

update:
  npm_config_cache=/tmp/npm-cache npm install -D vitepress@latest

dev:
  npm run dev -- --host

run: dev

build:
  npm run build

check:
  npm run build

test: build

preview: build
  npm run preview -- --host

clean:
  rm -rf docs/.vitepress/dist docs/.vitepress/cache
