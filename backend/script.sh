#!/bin/bash
cd backend
npm install -g npm@10.1.0
npm i -f
npm install -g @nestjs/cli
nest start --watch