FROM postgres:9.6
RUN localedef -i fi_FI -c -f UTF-8 -A /usr/share/locale/locale.alias fi_FI.UTF-8
ENV LANG fi_FI.utf8

RUN apt-get update \
  && DEBIAN_FRONTEND=noninteractive apt-get install --no-install-recommends -y \
  postgresql-contrib-$PG_MAJOR=$PG_VERSION \
  postgresql-$PG_MAJOR-postgis-2.2 2.3 \
  postgresql-$PG_MAJOR-postgis-2.2 2.3-scripts \
  && apt-get clean \
  && rm -rf /var/lib/apt/lists/*