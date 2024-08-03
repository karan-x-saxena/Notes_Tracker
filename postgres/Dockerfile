FROM postgres:15.1

ARG USERNAME
ARG PASSWORD

ENV POSTGRES_DB=archiver_db \
    POSTGRES_USER=${USERNAME} \
    POSTGRES_PASSWORD=${PASSWORD} \
    PGDATA=/var/lib/postgresql/data/pgdata \
    POSTGRES_HOST_AUTH_METHOD=md5

ENTRYPOINT bash docker-entrypoint.sh postgres

EXPOSE 5432