FROM haskell:8
MAINTAINER Alex Brandt <alunduil@alunduil.com>

WORKDIR /usr/local/src/alunduil-blog

RUN cabal update

COPY ./alunduil-blog.cabal /usr/local/src/alunduil-blog/alunduil-blog.cabal
RUN cabal install --only-dependencies

COPY . /usr/local/src/alunduil-blog
RUN cabal install

ENTRYPOINT [ "site" ]
