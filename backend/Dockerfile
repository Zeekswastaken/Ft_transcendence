FROM node:16

WORKDIR /app

COPY package*.json ./

RUN npm install
RUN npm install -g @nestjs/cli
RUN npm install pg --save
RUN npm install webpack --save-dev
RUN npm install reflect-metadata --save
RUN npm install rxjs --save
RUN npm install @nestjs/typeorm
RUN npm install pg typeorm
RUN npm install @nestjs/serve-static serve-static
RUN npm install path
RUN npm install passport-local @nestjs/passport
RUN npm install @nestjs/passport passport-google-oauth20
RUN npm install passport-42
RUN npm install speakeasy
RUN npm install passport passport-google-oauth20 nodemailer
RUN npm install jsonwebtoken
RUN npm install @nestjs/jwt
RUN npm install --save @nestjs/platform-express ejs
RUN npm install --save ejs @nestjs/platform-express express

COPY . .
COPY ./script.sh .
RUN chmod +x ./script.sh
#COPY ./typeorm.config.ts ./

RUN npm run build

EXPOSE 3000


CMD [ "./script.sh" ]