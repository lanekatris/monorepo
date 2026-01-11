# Edit this configuration file to define what should be installed on
# your system. Help is available in the configuration.nix(5) man page, on
# https://search.nixos.org/options and in the NixOS manual (`nixos-help`).

{ config, lib, pkgs, ... }:
let
  # Build the Go program
  # Using builtins.path to reference the Go source relative to this file
  # This works in pure evaluation mode (required for flakes)
  # Path: from infrastructure/nixos/hosts/desktop2/configuration.nix
  #       up 4 levels to monorepo root, then into software/go
  lk = pkgs.buildGoModule {
    pname = "lk";
    version = "0.1.0";
    src = lib.cleanSource (builtins.path {
      path = ../../../../software/go;
      name = "lk-source";
    });
    vendorHash = "sha256-RrJrbxqWg/eg3FwA8mwTC4jRftMrlxlo3eB176eNi7E="; # Let Nix calculate the hash automatically
    subPackages = [ "cmd/lk" ];
    modRoot = ".";
    buildFlags = [ 
      "-ldflags=-s -w"
      "-mod=mod"
    ];
  };
in
{
  imports =
    [ # Include the results of the hardware scan.
      ./hardware-configuration.nix
      # (import "${home-manager}/nixos")
    ];

    # home-manager.useUserPackages = true;
    # home-manager.useGlobalPkgs = true;
    # home-manager.backupFileExtension = "backup";
    # home-manager.users.lane = import ./home.nix;
    #
    #
  nix.settings.experimental-features = ["nix-command" "flakes"];

  # Use the systemd-boot EFI boot loader.
  boot.loader.systemd-boot.enable = true;
  boot.loader.efi.canTouchEfiVariables = true;
nixpkgs.config.allowUnfree = true; 
  networking.hostName = "desktop2"; # Define your hostname.

  # Configure network connections interactively with nmcli or nmtui.
  networking.networkmanager.enable = true;

  # Set your time zone.
  time.timeZone = "America/New_York";

  # Configure network proxy if necessary
  # networking.proxy.default = "http://user:password@proxy:port/";
  # networking.proxy.noProxy = "127.0.0.1,localhost,internal.domain";

  # Select internationalisation properties.
  # i18n.defaultLocale = "en_US.UTF-8";
  # console = {
  #   font = "Lat2-Terminus16";
  #   keyMap = "us";
  #   useXkbConfig = true; # use xkb.options in tty.
  # };

  # Enable the X11 windowing system.
  services.xserver.enable = true;


  # Enable the GNOME Desktop Environment.
  services.displayManager.gdm.enable = true;
  services.desktopManager.gnome.enable = true;
environment.gnome.excludePackages = with pkgs; [geary];


# opengl
  hardware.graphics = {
    enable = true;
  };

  services.xserver.videoDrivers = [ "nvidia" ];
hardware.nvidia = { 
  modesetting.enable = true;   # REQUIRED for Wayland
  open = true;                # use proprietary driver
  powerManagement.enable = true; # THIS FIXES COOMING OUT OF SLEEP
    nvidiaSettings = true;
    powerManagement.finegrained = false;
};

# REQUIRED so GDM + Wayland can use NVIDIA
services.xserver.displayManager.gdm.wayland = true;

# Prevent fallback to nouveau
boot.blacklistedKernelModules = [ "nouveau" ];
  # Configure keymap in X11
  # services.xserver.xkb.layout = "us";
  # services.xserver.xkb.options = "eurosign:e,caps:escape";

  # Enable CUPS to print documents.
  # services.printing.enable = true;

  # Enable sound.
  # services.pulseaudio.enable = true;
  # OR
  # services.pipewire = {
  #   enable = true;
  #   pulse.enable = true;
  # };

  # Enable touchpad support (enabled default in most desktopManager).
  # services.libinput.enable = true;
virtualisation.docker.enable = true;

  # Define a user account. Don't forget to set a password with ‘passwd’.
users.users.lane = {
  isNormalUser = true;
  extraGroups = [ "wheel" "networkmanager" "docker" "dialout" ];
    packages = with pkgs; [
    ];
};


programs._1password.enable = true;
  programs._1password-gui = {
    enable = true;
    # Certain features, including CLI integration and system authentication support,
    # require enabling PolKit integration on some desktop environments (e.g. Plasma).
    polkitPolicyOwners = [ "lane" ];
  };
services.tailscale.enable = true;


services.flatpak.enable = true;
# services.flatpak.extraPortals = ["gtk"];

    programs.dconf.enable = true;

      programs.dconf.profiles.user.databases = [
        {
          settings = {
            "org/gnome/shell" = {
              enabled-extensions = [
                "pop-shell@system76.com"
              ];
            };
            "org/gnome/shell/extensions/pop-shell" = {
              tile-by-default = true;
              gap-inner = "<int32 2>";
              gap-outer = "<int32 2>";
              smart-gaps = true;
              show-title = true;
              stacking-with-mouse = true;
            };
          };
        }
      ];

  # programs.firefox.enable = true;

  # List packages installed in system profile.
  # You can use https://search.nixos.org/ to find more packages (and options).
  environment.systemPackages = with pkgs; [
    vim # Do not forget to add an editor to edit configuration.nix! The Nano editor is also installed by default.
    screenfetch # Required by lk-worker service
  ];

  programs.ssh.startAgent = false;


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

  # LK Go program daemon service
  systemd.services.lk-worker = {
    description = "LK Temporal Worker Service";
    wantedBy = [ "multi-user.target" ];
    after = [ "network.target" ];
    
    # Make screenfetch and other system binaries available
    path = with pkgs; [
      screenfetch
      coreutils
      findutils
      gnugrep
      gnused
      systemd
    ];
    
    serviceConfig = {
      Type = "simple";
      User = "lane";
      Group = "users";
      ExecStart = "${lk}/bin/lk worker";
      Restart = "always";
      RestartSec = 5;
      StandardOutput = "journal";
      StandardError = "journal";
      
      # Set PATH to include NixOS system paths
      # This ensures system binaries like screenfetch are found
      Environment = [
        "PATH=/run/wrappers/bin:/run/current-system/sw/bin:/nix/var/nix/profiles/default/bin:/usr/bin:/bin"
      ];
      
      # Environment variables (add as needed)
      # Environment = [
      #   "TEMPORAL_ADDRESS=100.97.2.90:7233"
      #   "TEMPORAL_QUEUE_NAME=server"
      # ];
      
      # Working directory
      WorkingDirectory = "/home/lane";
      
      # Security settings
      PrivateTmp = false; # Allow access to /tmp if needed
      ProtectSystem = false; # Allow access to system directories if needed
      ProtectHome = false; # Allow access to home directory for config file
    };
  };

  # Open ports in the firewall.
  # networking.firewall.allowedTCPPorts = [ ... ];
  # networking.firewall.allowedUDPPorts = [ ... ];
  # Or disable the firewall altogether.
  # networking.firewall.enable = false;

  # Copy the NixOS configuration file and link it from the resulting system
  # (/run/current-system/configuration.nix). This is useful in case you
  # accidentally delete configuration.nix.
  # system.copySystemConfiguration = true;

  # This option defines the first version of NixOS you have installed on this particular machine,
  # and is used to maintain compatibility with application data (e.g. databases) created on older NixOS versions.
  #
  # Most users should NEVER change this value after the initial install, for any reason,
  # even if you've upgraded your system to a new NixOS release.
  #
  # This value does NOT affect the Nixpkgs version your packages and OS are pulled from,
  # so changing it will NOT upgrade your system - see https://nixos.org/manual/nixos/stable/#sec-upgrading for how
  # to actually do that.
  #
  # This value being lower than the current NixOS release does NOT mean your system is
  # out of date, out of support, or vulnerable.
  #
  # Do NOT change this value unless you have manually inspected all the changes it would make to your configuration,
  # and migrated your data accordingly.
  #
  # For more information, see `man configuration.nix` or https://nixos.org/manual/nixos/stable/options#opt-system.stateVersion .
  system.stateVersion = "26.05"; # Did you read the comment?

}

