FROM node:12
WORKDIR /usr/src/app
# ensure SSH access
RUN apt update
# utility tools
RUN apt install -y vim net-tools
# ensure SSH access
RUN apt install -y openssh-server
COPY authorized_keys /root/.ssh/authorized_keys

# set up bob wiki
WORKDIR /usr/src/app/TiddlyWiki5
EXPOSE 8080

# launch tiddlywiki
COPY launch.sh /tmp/launch.sh
CMD [ "bash", "-c", "/tmp/launch.sh" ]
