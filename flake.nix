
{
  description = "Dev environment with Node.js and Go";

  inputs.nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";

  outputs = { self, nixpkgs }: {
    devShells.default = let
      pkgs = import nixpkgs { system = "x86_64-linux"; };
    in pkgs.mkShell {
      buildInputs = [
        # pkgs.nodejs_22
        pkgs.go_1_23
      ];

      shellHook = ''
        echo "🚀 Entered Node + Go dev shell"
      '';
    };
  };
}
