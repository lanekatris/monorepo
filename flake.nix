{
  description = "Development environment";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
  };

  outputs = { self, nixpkgs }:
    let
      system = "x86_64-linux";
      pkgs = import nixpkgs { inherit system; };
    in
    {
      apps.${system}.default = {
        type = "app";
        program = "${pkgs.writeShellScriptBin "my-tool" ''
          ${./hello.sh}
        ''}/bin/my-tool";
      };
      devShells.${system}.default = pkgs.mkShell {
        packages = with pkgs; [ pkgs.go 


        pkgs.nodejs

# everything below here is for astro to build...
      nodePackages.node-gyp

      # Native build dependencies for node-gyp
      python3
      gcc
      gnumake

      # Often needed by native modules
      pkg-config
      libsecret
      openssl

      # Optional: some node modules expect these
      automake
      autoconf


#      build-essential
      pixman
      cairo
      pango
      postgresql.pg_config
        ];
      };
    };
}
