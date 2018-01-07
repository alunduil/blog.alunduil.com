{ mkDerivation, base, hakyll, stdenv }:
mkDerivation {
  pname = "alunduil-blog";
  version = "0.2.0.0";
  src = ./.;
  isLibrary = false;
  isExecutable = true;
  executableHaskellDepends = [ base hakyll ];
  homepage = "http://blog.alunduil.com";
  description = "Personal Blog";
  license = stdenv.lib.licenses.unfree;
}
