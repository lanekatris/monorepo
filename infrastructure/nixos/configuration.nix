# Edit this configuration file to define what should be installed on
# your system.  Help is available in the configuration.nix(5) man page
# and in the NixOS manual (accessible by running ‘nixos-help’).

{ config, pkgs, ... }:

let
#  lk = import ../../software/go/lk-build.nix;
#    lk = import ../../software/go/lk-build.nix { inherit pkgs; };
in {


  imports =
    [ # Include the results of the hardware scan.
      ./hardware-configuration.nix
#      ./lk.nix
#        ../../software/go/lk-build.nix
    ];

#  systemd.services.lk = {
#    description = "LK Go Service";
#    wantedBy = [ "multi-user.target" ];
#    after = [ "network.target" ];
#
#    serviceConfig = {
#      ExecStart = "${lk}/bin/lk";
#      Restart = "always";
#      RestartSec = 5;
##      WorkingDirectory = "/var/lib/lk"; # optional, depends on your app
##      User = "lk";                      # optional, create this user if needed
#    };
#    };
nix.settings.experimental-features = [ "nix-command" "flakes" ];



services.tailscale.enable = true;
  # Bootloader.
  boot.loader.systemd-boot.enable = true;
  boot.loader.efi.canTouchEfiVariables = true;

  networking.hostName = "lane-desktop"; # Define your hostname.
  # networking.wireless.enable = true;  # Enables wireless support via wpa_supplicant.

  # Configure network proxy if necessary
  # networking.proxy.default = "http://user:password@proxy:port/";
  # networking.proxy.noProxy = "127.0.0.1,localhost,internal.domain";

  # Enable networking
  networking.networkmanager.enable = true;

  # Set your time zone.
  time.timeZone = "America/New_York";

  # Select internationalisation properties.
  i18n.defaultLocale = "en_US.UTF-8";

  i18n.extraLocaleSettings = {
    LC_ADDRESS = "en_US.UTF-8";
    LC_IDENTIFICATION = "en_US.UTF-8";
    LC_MEASUREMENT = "en_US.UTF-8";
    LC_MONETARY = "en_US.UTF-8";
    LC_NAME = "en_US.UTF-8";
    LC_NUMERIC = "en_US.UTF-8";
    LC_PAPER = "en_US.UTF-8";
    LC_TELEPHONE = "en_US.UTF-8";
    LC_TIME = "en_US.UTF-8";
  };

  # Enable the X11 windowing system.
  services.xserver.enable = true;

  # Enable the GNOME Desktop Environment.
  services.xserver.displayManager.gdm.enable = true;
  services.xserver.desktopManager.gnome.enable = true;

# I'm not sure if this worked, the config is valid though
services.xserver.desktopManager.gnome.extraGSettingsOverrides = ''
    [org.gnome.settings-daemon.plugins.power]
    sleep-inactive-ac-type='nothing'
    sleep-inactive-battery-type='nothing'
  '';

# This might have done it...
  systemd.targets.sleep.enable = false;
    systemd.targets.suspend.enable = false;
    systemd.targets.hibernate.enable = false;
    systemd.targets.hybrid-sleep.enable = false;

  # Configure keymap in X11
  services.xserver.xkb = {
    layout = "us";
    variant = "";
  };


  # Sleep
#  services.xserver.enableAutomaticBrightnessLowering = false;

#  services.xserver.disableScreenLock = true;
#  systemd.sleep = false;

#  services.gnome = {
#      core-utilities.enable = true;
#    };

  # Enable CUPS to print documents.
  services.printing.enable = true;

  # Enable sound with pipewire.
  services.pulseaudio.enable = false;
  security.rtkit.enable = true;
  services.pipewire = {
    enable = true;
    alsa.enable = true;
    alsa.support32Bit = true;
    pulse.enable = true;
    # If you want to use JACK applications, uncomment this
    #jack.enable = true;

    # use the example session manager (no others are packaged yet so this is enabled by default,
    # no need to redefine it in your config for now)
    #media-session.enable = true;
  };

  # Enable touchpad support (enabled default in most desktopManager).
  # services.xserver.libinput.enable = true;

  # Define a user account. Don't forget to set a password with ‘passwd’.
  users.users.lane = {
    isNormalUser = true;
    description = "Lane";
    extraGroups = [ "networkmanager" "wheel" "docker" ];
    packages = with pkgs; [
    #  thunderbird

    ];
  };

  # Install firefox.
  programs.firefox.enable = true;

  # Allow unfree packages
  nixpkgs.config.allowUnfree = true;

  # List packages installed in system profile. To search, run:
  # $ nix search wget
  environment.systemPackages = with pkgs; [
  #  vim # Do not forget to add an editor to edit configuration.nix! The Nano editor is also installed by default.
  #  wget
  git
vim
google-chrome
chromium
pkgs.jetbrains.webstorm
pkgs.jetbrains.goland
pkgs.jetbrains.datagrip
pkgs.jetbrains.rider
pkgs.vscode
code-cursor
obsidian
spotify
discord
slack
oterm # for ollama/open-qqwebui
citrix_workspace
screenfetch
inkscape
flameshot
#lk
#pkgs.ollama
#   (pkgs.ollama.override {
#      acceleration = "cuda";
#    })
#    open-webui
#    pkgs.dconf
#    gnomeExtensions.forge
  ];
#
# dconf.settings = {
#      "org/gnome/settings-daemon/plugins/power" = {
#        # Set to 'nothing' to prevent suspend when inactive on AC power
#        sleep-inactive-ac-type = "nothing";
#        # Set the timeout in seconds (e.g., 0 for never)
#        sleep-inactive-ac-timeout = 0;
#      };
#    };
## This didn't work, it is still jacked up after coming out of sleep
#   systemd.services."systemd-suspend" = {
#      serviceConfig = {
#        Environment=''"SYSTEMD_SLEEP_FREEZE_USER_SESSIONS=false"'';
#      };
#    };

   programs._1password.enable = true;
    programs._1password-gui = {
      enable = true;
      # Certain features, including CLI integration and system authentication support,
      # require enabling PolKit integration on some desktop environments (e.g. Plasma).
      polkitPolicyOwners = [ "lane" ];
    };

  services.ollama = {
    # package = pkgs.unstable.ollama; # If you want to use the unstable channel package for example
    enable = true;
    acceleration = "cuda"; # Or "rocm"
    # environmentVariables = { # I haven't been able to get this to work, but please see the serviceConfig workaround below
      # HOME = "/home/ollama";
      # OLLAMA_MODELS = "/home/ollama/models";
      # OLLAMA_HOST = "0.0.0.0:11434"; # Make Ollama accesible outside of localhost
      # OLLAMA_ORIGINS = "http://localhost:8080,http://192.168.0.10:*"; # Allow access, otherwise Ollama returns 403 forbidden due to CORS
    #};
  };

  # The Ollama environment variables, as mentioned in the comments section
  systemd.services.ollama.serviceConfig = {
    Environment = [ "OLLAMA_HOST=0.0.0.0:11434" ];
  };

  services.open-webui = {
    enable = true;
    environment = {
      ANONYMIZED_TELEMETRY = "False";
      DO_NOT_TRACK = "True";
      SCARF_NO_ANALYTICS = "True";
      OLLAMA_API_BASE_URL = "http://127.0.0.1:11434/api";
      OLLAMA_BASE_URL = "http://127.0.0.1:11434";
    };
  };


#    programs.gnome-shell-extensions.enable = true;
#    services.dbus.packages = with pkgs; [ dconf ];
#    programs.dconf.enable = true;
#    dconf.settings = {
#    "org/gnome/desktop/interface" = {
#          clock-format = "12h";
#        };
#        "org/gnome/shell" = {
#          enabled-extensions = [ "forge@jmmaranan.com" ];
#        };
#      };

virtualisation.docker.enable = true;

  virtualisation.docker.extraOptions = ''
    --insecure-registry=server1:5000
  '';
  # Enable OpenGL
  hardware.graphics = {
    enable = true;
  };

  # Load nvidia driver for Xorg and Wayland
  services.xserver.videoDrivers = ["nvidia"];

  hardware.nvidia = {

    # Modesetting is required.
    modesetting.enable = true;

    # Nvidia power management. Experimental, and can cause sleep/suspend to fail.
    # Enable this if you have graphical corruption issues or application crashes after waking
    # up from sleep. This fixes it by saving the entire VRAM memory to /tmp/ instead
    # of just the bare essentials.
    powerManagement.enable = false;

    # Fine-grained power management. Turns off GPU when not in use.
    # Experimental and only works on modern Nvidia GPUs (Turing or newer).
    powerManagement.finegrained = false;

    # Use the NVidia open source kernel module (not to be confused with the
    # independent third-party "nouveau" open source driver).
    # Support is limited to the Turing and later architectures. Full list of
    # supported GPUs is at:
    # https://github.com/NVIDIA/open-gpu-kernel-modules#compatible-gpus
    # Only available from driver 515.43.04+
    open = false;

    # Enable the Nvidia settings menu,
	# accessible via `nvidia-settings`.
    nvidiaSettings = true;

    # Optionally, you may need to select the appropriate driver version for your specific GPU.
    package = config.boot.kernelPackages.nvidiaPackages.stable;
  };

  # Some programs need SUID wrappers, can be configured further or are
  # started in user sessions.
  # programs.mtr.enable = true;
  # programs.gnupg.agent = {
  #   enable = true;
  #   enableSSHSupport = true;
  # };

  # List services that you want to enable:

  # Enable the OpenSSH daemon.
  # services.openssh.enable = true;

  # Open ports in the firewall.
  # networking.firewall.allowedTCPPorts = [ ... ];
  # networking.firewall.allowedUDPPorts = [ ... ];
  # Or disable the firewall altogether.
  # networking.firewall.enable = false;

  # This value determines the NixOS release from which the default
  # settings for stateful data, like file locations and database versions
  # on your system were taken. It‘s perfectly fine and recommended to leave
  # this value at the release version of the first install of this system.
  # Before changing this value read the documentation for this option
  # (e.g. man configuration.nix or on https://nixos.org/nixos/options.html).
  system.stateVersion = "25.05"; # Did you read the comment?



#  services.lk = import ../../software/go;
##      pkgs.lk.override {
##        installPhase = ''
##          mkdir -p ${config.system.packagesDir}
##          # Copy your Go app's binary into the packages directory
##          cp lk /home/lane/goapp_binary
##          chmod +x /home/lane/goapp_binary
##        '';
##      };
#
#    systemd.services.lk = {
#      description = "My Go App Service";
#      after = [ "network-online.target" ];
#      requires = [ "network-online.target" ];
#      wantedBy = [ "multi-user.target" ];
#      path = "/home/lane/goapp_binary"; # Adjust path
#      script = ''
#        /home/lane/goapp_binary
#      '';
#    };



}
