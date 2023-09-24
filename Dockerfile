FROM node:20

WORKDIR /app
RUN mkdir frontend
COPY frontend/package*.json ./frontend
COPY frontend ./frontend

RUN     mkdir backend
COPY backend/package*.json backend
COPY backend ./backend
COPY script.sh script.sh
RUN chmod 777 script.sh
# RUN cd frontend
EXPOSE 3000
EXPOSE 3001
CMD ["./script.sh"]
# COPY /nfs/sgoinfre/goinfre/Perso/orbiay/Main_Trandandand/backend/package*.json ./backend
# COPY ../src ./src 