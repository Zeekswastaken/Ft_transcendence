#!/bin/bash
npm install -g npm-run-all
cd backend 
npm i -f
cd ..
npm install -g @nestjs/cli
cd frontend
npm-run-all --parallel  dev api