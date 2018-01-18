FROM alpine:3.7
MAINTAINER Alex Brandt <alunduil@alunduil.com>

RUN apk add --no-cache musl-dev zlib-dev
RUN apk add --no-cache cabal ghc

WORKDIR /usr/local/src/blog.alunduil.com

RUN cabal update

COPY ./*.cabal ./
RUN cabal install -j --only-dependencies

COPY . ./
RUN cabal install site

ENTRYPOINT [ "/usr/local/bin/site" ]
CMD [ "build" ]
