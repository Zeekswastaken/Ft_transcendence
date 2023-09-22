
FROM node:16

# RUN npm install -g npm@latest

WORKDIR /app
RUN     mkdir backend
COPY package*.json backend


# COPY /nfs/sgoinfre/goinfre/Perso/orbiay/Main_Trandandand/backend/package*.json ./backend
# COPY ../src ./src 
COPY ./ ./backend
RUN chmod +x ./backend/script.sh
EXPOSE 3000
# RUN npm install -f
CMD ["./backend/script.sh","bash"]
