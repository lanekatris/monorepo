{
  description = "Everything";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";

    home-manager = {
      url = "github:nix-community/home-manager/master";
      inputs.nixpkgs.follows = "nixpkgs";
    };

    nvf.url = "github:notashelf/nvf";
  };

  outputs = { self, nixpkgs, home-manager, nvf, ... }:
  let
    system = "x86_64-linux";

    pkgs = nixpkgs.legacyPackages.${system};

    # Build Neovim once using nvf
    myNeovim =
      (nvf.lib.neovimConfiguration {
        inherit pkgs;
        modules = [ ./nvf.nix ];
      }).neovim;
  in
  {
    # Allows: nix build / nix run .
    packages.${system}.default = myNeovim;

    nixosConfigurations.desktop2 = nixpkgs.lib.nixosSystem {
      inherit system;

      modules = [
        ./configuration.nix

        # Required for nvf options
        nvf.nixosModules.default

        # Put nvf-built Neovim on PATH
        # ({ pkgs, ... }: {
        #   environment.systemPackages = [
        #     myNeovim
        #   ];
        # })

        # Home Manager
        home-manager.nixosModules.home-manager {
          home-manager = {
            useGlobalPkgs = true;
            useUserPackages = true;
            users.lane = import ./home.nix;
            backupFileExtension = "backup";
          };
        }


                                        {
                                                  environment.systemPackages = [myNeovim];
                                        }
      ];
    };
  };
}

