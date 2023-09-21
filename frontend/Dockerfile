FROM node:16

WORKDIR /app
RUN mkdir frontend
COPY package*.json ./frontend

# RUN npm install

COPY . ./frontend

# RUN npm run build

EXPOSE 3001
RUN chmod +x ./frontend/script.sh
CMD ["./frontend/script.sh", "bash"]
