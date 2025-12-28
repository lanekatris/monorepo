# Symbolic link Nixos configuration files

```
sudo mv /etc/nixos/configuration.nix /etc/nixos/configuration.nix.bak
sudo mv /etc/nixos/hardware-configuration.nix /etc/nixos/hardware-configuration.nix.bako

sudo ln -s /home/lane/monorepo/infrastructure/nixos/hosts/desktop2/configuration.nix /etc/nixos/configuration.nix
sudo ln -s /home/lane/monorepo/infrastructure/nixos/hosts/desktop2/hardware-configuration.nix /etc/nixos/hardware-configuration.nix

sudo nixos-rebuild switch

```
