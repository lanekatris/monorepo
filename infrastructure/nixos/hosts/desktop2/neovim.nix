{ pkgs, lib, ...}:

{
  home.packages = with pkgs; [
    
fd
fzf
gcc
ripgrep
lazygit

# Tresitter
#nodejs
   # pkgs.vimPlugins.nvim-tresitter

# For nix LSPs
rustc
cargo
  ];
  }
