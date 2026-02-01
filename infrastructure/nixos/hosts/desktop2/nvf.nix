{ pkgs, ... }:
{
  config.vim = {
    globals = {
      leader = " ";
    };

    extraPackages = with pkgs; [
      alejandra # nix code formatter
      lazygit
    ];

    theme = {
      enable = true;
      name = "gruvbox";
      style = "light";
    };

    telescope.enable = true; # fuzzy finder
    autocomplete.nvim-cmp.enable = true; # completion engine, not too familiar
    filetree.neo-tree.enable = true;
    binds = {
      whichKey = {
        enable = true;
      };
    };

    terminal = {
      toggleterm = {
        enable = true;
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
    ];
  };
}
