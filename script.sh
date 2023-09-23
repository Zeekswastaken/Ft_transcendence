#!/bin/bash
npm install -g npm-run-all
npm install -g @nestjs/cli
cd frontend
npm-run-all --parallel  dev api