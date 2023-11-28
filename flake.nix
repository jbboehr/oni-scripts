{
  description = "terebinth";

  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs/nixos-22.11";
    flake-utils = {
      url = "github:numtide/flake-utils";
    };
    pre-commit-hooks = {
      url = "github:cachix/pre-commit-hooks.nix";
      # inputs.nixpkgs.follows = "nixpkgs";
      # inputs.nixpkgs-stable.follows = "nixpkgs";
      # inputs.gitignore.follows = "gitignore";
      # inputs.flake-utils.follows = "flake-utils";
    };
    gitignore = {
      url = "github:hercules-ci/gitignore.nix";
      inputs.nixpkgs.follows = "nixpkgs";
    };
  };

  outputs = {
    self,
    nixpkgs,
    flake-utils,
    pre-commit-hooks,
    gitignore,
  }:
    flake-utils.lib.eachDefaultSystem (system: let
      pkgs = nixpkgs.legacyPackages.${system};
      lib = pkgs.lib;
      src = gitignore.lib.gitignoreSource ./.;

      pre-commit-check = pre-commit-hooks.lib.${system}.run {
        inherit src;
        hooks = {
          actionlint.enable = true;
          alejandra.enable = true;
          alejandra.excludes = ["\/vendor\/" "\/node_modules\/"];
          shellcheck.enable = true;
        };
      };
    in rec {
      devShells.default = pkgs.mkShell {
        buildInputs = with pkgs; [
          actionlint
          alejandra
          nodejs
          pre-commit
        ];
        shellHook = ''
          ${pre-commit-check.shellHook}
          export PATH="$PWD/node_modules/.bin:$PATH"
          ln -srf ${lib.getExe pkgs.nodejs} .direnv/nodejs
          ln -srf ${pkgs.nodejs}/bin/npm .direnv/npm
        '';
      };

      formatter = pkgs.alejandra;
    });
}
