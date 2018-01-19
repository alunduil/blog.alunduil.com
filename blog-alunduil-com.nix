let
  config = {
    packageOverrides = pkgs: rec {
      haskellPackages = pkgs.haskellPackages.override {
        overrides = haskellPackagesNew: haskellPackagesOld: rec {

          blog-alunduil-com =
            haskellPackagesNew.callPackage ./default.nix { };

        };
      };
    };
  };

  pkgs = import <nixpkgs> { inherit config; };
in
  { blog-alunduil-com = pkgs.haskellPackages.blog-alunduil-com;
  }
