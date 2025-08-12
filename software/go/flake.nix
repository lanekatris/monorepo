{
  description = "Go development environment and build tools";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = nixpkgs.legacyPackages.${system};
        
        # Go version matching your go.mod
        goVersion = "1.23.0";
        
        # Build the main binary
        buildGoModule = pkgs.buildGoModule {
          pname = "lk";
          version = "0.1.0";
          src = ./.;
          
          # Let Nix handle dependency fetching (no vendor folder required)
          vendorHash = null;
          
          # Build the main binary from cmd/lk
          subPackages = [ "cmd/lk" ];
          
          # Set the module name to match your go.mod
          modRoot = ".";
          
          # Build flags - ignore vendor directory and use module system
          buildFlags = [ 
            "-ldflags=-s -w"
            "-mod=mod"
          ];
          
          # Install the binary
          postInstall = ''
            mv $out/bin/lk $out/bin/lk
          '';
        };
      in
      {
        # Development shell with Go and tools
        devShells.default = pkgs.mkShell {
          buildInputs = with pkgs; [
            # Go toolchain
            go_1_23
            
            # Development tools
            gopls
            delve
            go-tools
            
            # Build tools
            goreleaser
            
            # Database tools (since you use PostgreSQL)
            postgresql
            
            # Additional useful tools
            sqlc
            air # Hot reload for Go
          ];
          
          shellHook = ''
            echo "Go development environment loaded!"
            echo "Go version: $(go version)"
            echo ""
            echo "Available commands:"
            echo "  go run cmd/lk/main.go  - Run the main program"
            echo "  go build cmd/lk        - Build the binary"
            echo "  go test ./...          - Run all tests"
            echo "  go mod tidy            - Clean up dependencies"
            echo "  go mod vendor          - Vendor dependencies"
            echo ""
            echo "Development tools:"
            echo "  gopls                  - Go language server"
            echo "  dlv                    - Go debugger"
            echo "  air                    - Hot reload (if configured)"
          '';
          
          # Set Go environment variables
          GOPATH = "/home/lane/.go";
          GOROOT = "${pkgs.go_1_23}/share/go";
          GOCACHE = "/home/lane/.cache/go-build";
          GOMODCACHE = "/home/lane/.cache/go-mod";
        };
        
        # Build the binary
        packages.default = buildGoModule;
        
        # Apps for running the program
        apps = {
          # Run the program
          run = {
            type = "app";
            program = "${buildGoModule}/bin/lk";
          };
          
          # Build the program
          build = {
            type = "app";
            program = "${pkgs.writeShellScriptBin "build" ''
              echo "Building Go binary..."
              ${pkgs.go_1_23}/bin/go build -o bin/lk cmd/lk/main.go
              echo "Binary built at bin/lk"
            ''}/bin/build";
          };
          
          # Test the program
          test = {
            type = "app";
            program = "${pkgs.writeShellScriptBin "test" ''
              echo "Running Go tests..."
              ${pkgs.go_1_23}/bin/go test ./...
            ''}/bin/test";
          };
          
          # Clean build artifacts
          clean = {
            type = "app";
            program = "${pkgs.writeShellScriptBin "clean" ''
              echo "Cleaning build artifacts..."
              rm -rf bin/ result/
              echo "Clean complete"
            ''}/bin/clean";
          };
        };
        
        # Default app (run)
        defaultApp = self.apps.${system}.run;
        
        # Default package
        defaultPackage = self.packages.${system}.default;
      }
    );
} 