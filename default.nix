{ mkDerivation, base, hakyll, stdenv }:
mkDerivation {
  pname = "blog-alunduil-com";
  version = "0.2.0.0";
  src = ./.;
  isLibrary = false;
  isExecutable = true;
  executableHaskellDepends = [ base hakyll ];
  homepage = "http://blog.alunduil.com";
  description = "Personal Blog";
  license = stdenv.lib.licenses.unfree;
  hydraPlatforms = stdenv.lib.platforms.none;
}
