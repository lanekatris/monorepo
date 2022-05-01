# Prerequistes
ansible-galaxy install gepaplexx.microk8s

# How to run

Go into WSL:

```shell
cd /mnt/c/Code/monorepo/infrastructure/homelab/
ANSIBLE_CONFIG=/mnt/c/Code/monorepo/infrastructure/homelab/ansible.cfg ansible-playbook playbook.yml -i hosts -kK
```





#### Make Service LoadBalancer

`sudo kubectl patch svc guestbook-ui -p '{"spec": {"type": "LoadBalancer"}}'`
