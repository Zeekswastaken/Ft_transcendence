FROM debian

RUN apt update -y \
    && apt upgrade -y 

RUN apt install lsb-release -y \
    && apt install wget -y \
    && apt install gnupg2 -y

RUN  sh -c 'echo "deb http://apt.postgresql.org/pub/repos/apt $(lsb_release -cs)-pgdg main" > /etc/apt/sources.list.d/pgdg.list' \
    && wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | apt-key add - \
    && apt update

RUN apt install postgresql-15 -y \
    && apt install vim -y


COPY ./script.sh ./
RUN chmod +x ./script.sh

USER postgres


CMD ["./run_postgresql.sh"]