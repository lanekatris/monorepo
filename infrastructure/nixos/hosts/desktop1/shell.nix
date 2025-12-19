{ pkgs ? import <nixpkgs> {} }:

pkgs.mkShell {
  buildInputs = with pkgs; [
      go


  # all for nodejs and npm install / node-gyp
      nodejs_22
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
#      libcairo2-dev
#      libpango1.0-dev
#      libjpeg-dev
#      libgif-dev
#      librsvg2-dev


deno
   ];

    shellHook = ''
       export npm_config_python=${pkgs.python3.interpreter}
       export LD_LIBRARY_PATH=${pkgs.stdenv.cc.cc.lib}/lib:$LD_LIBRARY_PATH
     '';
}
