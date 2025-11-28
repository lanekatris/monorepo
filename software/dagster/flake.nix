{
  description = "SQLMesh development environment";
  
  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/cf8cc1201be8bc71b7cbbbdaf349b22f4f99c7ae";
  };
  
  outputs = { self, nixpkgs }:
    let
      pkgs = nixpkgs.legacyPackages.x86_64-linux;
    in {
      devShells.x86_64-linux.default = pkgs.mkShell {
        packages = [
          pkgs.python3
          pkgs.python3Packages.pip
          pkgs.python3Packages.virtualenv
          # pkgs.postgresql
          pkgs.python3Packages.psycopg2
          pkgs.python3Packages.numpy
          # Add C++ standard library and other required libraries
          pkgs.gcc
          pkgs.glibc
          pkgs.stdenv.cc.cc.lib
        ];
        
        # Set environment variables to help find the libraries
        shellHook = ''
          # Create virtual environment if it doesn't exist
          if [ ! -d ".venv" ]; then
            python -m venv .venv
          fi
          
          # Activate virtual environment
          source .venv/bin/activate
          
          # Set library paths
          export LD_LIBRARY_PATH="${pkgs.stdenv.cc.cc.lib}/lib:$LD_LIBRARY_PATH"
          export LIBRARY_PATH="${pkgs.stdenv.cc.cc.lib}/lib:$LIBRARY_PATH"
          
          # Install packages with extras
          pip install dagster dagster-webserver dagster-dg-cli create-dagster
          
          echo "SQLMesh environment loaded with PostgreSQL support"
        '';
      };
    };
} 
