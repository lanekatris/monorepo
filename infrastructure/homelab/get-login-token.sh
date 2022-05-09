token=$(sudo microk8s kubectl -n kube-system get secret | grep default-token | cut -d " " -f1)
sudo microk8s kubectl -n kube-system describe secret $token
