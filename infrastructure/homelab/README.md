# Prerequistes
ansible-galaxy install gepaplexx.microk8s

# How to run

Go into WSL:

```shell
cd /mnt/c/Code/monorepo/infrastructure/homelab/
ANSIBLE_CONFIG=/mnt/c/Code/monorepo/infrastructure/homelab/ansible.cfg ansible-playbook playbook.yml -i hosts -kK
```


Running on the actual server:
`ansible-playbook  playbook.yml -i hosts -kK`


#### Make Service LoadBalancer

`sudo kubectl patch svc guestbook-ui -p '{"spec": {"type": "LoadBalancer"}}'`

# Ansible

ssh -i 'C:\Users\looni\Downloads\LightsailDefaultKey-us-east-2 (1).pem' ubuntu@lanekatris.com


# Updated 2023-09-17

Fire up Noco DB:
`docker compose up -d`

Fire up n8n:
`docker compose -f docker-compose.n8n.yml up -d`

Fire up Kestra:
`sudo docker compose -f docker-compose.kestra.yml up -d`