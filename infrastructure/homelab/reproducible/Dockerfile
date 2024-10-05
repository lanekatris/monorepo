FROM ubuntu:24.04

RUN apt update && apt install -y openssh-server sudo
RUN sed -i 's/PermitRootLogin prohibit-password/PermitRootLogin yes/' /etc/ssh/sshd_config


RUN useradd -m -s /bin/bash lane
RUN echo "lane:password" | chpasswd
RUN usermod -aG sudo lane

EXPOSE 22

ENTRYPOINT service ssh start && bash