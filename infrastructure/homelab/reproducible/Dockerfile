#FROM ubuntu:24.04
FROM docker:dind

RUN apt update && apt install -y openssh-server sudo #git
RUN sed -i 's/PermitRootLogin prohibit-password/PermitRootLogin yes/' /etc/ssh/sshd_config


RUN useradd -m -s /bin/bash lane
RUN echo "lane:password" | chpasswd
RUN usermod -aG sudo lane


# RUN git clone http://192.168.86.100:3000/lkat/monorepo.git /home/lane/git/monorepo

EXPOSE 22

ENTRYPOINT service ssh start && bash