{ pkgs, ... }:
{
  config.vim = {

    extraPackages = with pkgs; [
      alejandra
      lazygit
    ];

    theme = {
      enable = true;
      name = "tokyonight";
      style = "night";
    };
    telescope.enable = true; # fuzzy finder
    globals = {
      leader = " ";
    };

    # plugins = {
    #   neo-tree = {
    #     enable = true;
    #   };
    # };

    # terminal.enable = true;
    # lazygit.enable = true;
    terminal = {

      toggleterm = {
        enable = true;
        # mappings.open = "[[<C-_>]]";
        lazygit = {
          enable = true;
        };
      };
    };
    languages = {
      enableLSP = true;
      enableTreesitter = true;

      nix.enable = true;
    };

    lsp = {
      servers.nil_ls = {
        enable = true;

        settings = {
          formatting = {
            command = [ "alejandra" ];
          };
        };
      };
    };

    # Keymaps
    keymaps = [
      {
        mode = "n";
        key = "<leader><leader>";
        action = ":Telescope find_files<CR>";
        desc = "Find files (Telescope)";
      }
      {
        mode = "n";
        key = "<leader>e";
        action = ":Neotree toggle<CR>";
        desc = "Toggle Neotree";
      }
      {
        mode = "n";
        key = "<leader>f";
        action = ":lua vim.lsp.buf.format()<CR>";
        desc = "Format file";
      }
      # Window navigation
      {
        mode = "n";
        key = "<C-h>";
        action = "<C-w>h";
        desc = "Move to left window";
      }
      {
        mode = "n";
        key = "<C-l>";
        action = "<C-w>l";
        desc = "Move to right window";
      }
      {
        mode = "n";
        key = "<C-j>";
        action = "<C-w>j";
        desc = "Move to lower window";
      }
      {
        mode = "n";
        key = "<C-k>";
        action = "<C-w>k";
        desc = "Move to upper window";
      }

      {
        mode = "t";
        key = "<C-k>";
        action = "<C-\\><C-n><C-w>k";
        desc = "Move from terminal to code buffer";
      }
      {
        mode = "n";
        key = "<C-j>";
        action = "<C-w>j";
        desc = "Move from code buffer to terminal";
      }
      #                        {
      #   mode = "n";
      #   key = "<C-_>";
      #   action = ":ToggleTerm<CR>";
      #   desc = "Toggle terminal";
      # }
    ];

    filetree.neo-tree.enable = true;

    binds = {

      whichKey = {
        enable = true;

        # Optional: LazyVim-like tuning
      };
    };

  };
}
