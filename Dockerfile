FROM ubuntu:22.04

ENV DJANGO_SETTINGS_MODULE=notes_tracker.settings 

RUN apt-get update && \
    apt-get dist-upgrade --yes && \
    apt install software-properties-common -y && \
	apt-get install -y python3.11 python3.11-dev python3-pip && \
    update-alternatives --install /usr/bin/python3 python /usr/bin/python3.11 1 && \
	apt-get autoremove -y && apt-get clean -y && \
	pip3 install --upgrade pip && \
    rm -rf /var/lib/apt/lists/*

RUN useradd -ms /bin/bash blog
RUN groupadd grp-blog
RUN usermod -G grp-blog blog

ADD requirements.txt /home/source_code/requirements.txt
RUN pip3 install --no-cache-dir --trusted-host pypi.python.org -r /home/source_code/requirements.txt

COPY ./ /home/source_code/notes_tracker/

ENTRYPOINT /bin/bash

RUN chown -R blog:grp-blog /home/source_code/notes_tracker/

USER blog

EXPOSE 8090