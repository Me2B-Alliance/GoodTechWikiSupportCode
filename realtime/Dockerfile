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
#RUN git clone --depth=1 --branch v5.1.20 https://github.com/Jermolene/TiddlyWiki5.git
#RUN git clone --depth=1 https://github.com/me2b-alliance/TiddlyWiki5.git
#RUN git clone --depth=1 ../TiddlyWiki5
WORKDIR /usr/src/app/TiddlyWiki5
#RUN mkdir wiki
EXPOSE 8080

# launch tiddlywiki
COPY launch.sh /tmp/launch.sh
CMD [ "bash", "-c", "/tmp/launch.sh" ]
