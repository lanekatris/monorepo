{config,pkgs,...}:

{
  imports = [
  ./neovim.nix
  ];
                 
    home.username = "lane";
    home.homeDirectory = "/home/lane";
    home.stateVersion = "25.11";
    programs.bash = {
        enable = true;
        shellAliases = {
            btw = "echo ftw brother flake style";
          };
        bashrcExtra = ''
          eval "$(direnv hook bash)"
          export SSH_AUTH_SOCK="$HOME/.1password/agent.sock"
        '';
      };
    programs.direnv = {
        enable = true;
        nix-direnv.enable = true;
      };

      home.packages = with pkgs; [

      tree          
	neovim         
obsidian
spotify
git
ghostty
google-chrome

discord



# ai
cursor-cli


# bambu-studio
pkgs.jetbrains.webstorm




pkgs.gnomeExtensions.pop-shell
#    pkgs.gnomeExtensions.pop-shell-shortcuts
#pkgs.gnomeExtensionsApp
    gnome-tweaks
      ];
  }
