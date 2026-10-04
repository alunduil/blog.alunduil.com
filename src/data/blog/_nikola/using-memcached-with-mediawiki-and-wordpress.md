---
pubDatetime: 2011-02-03T21:13:29Z
title: Using Memcached with MediaWiki and WordPress
description: "Pointing MediaWiki and WordPress at a remote memcached takes one LocalSettings.php block and one sed against W3 Total Cache's config file."
tags:
  - caching
  - memcached
  - php
shape: how-to
timezone: America/Chicago
hideEditPost: true
---

> **Archival republish.** From this blog's Nikola era; lightly copyedited.

## Introduction

[Memcached](https://memcached.org/) is a simple key/value memory store
that uses keys to perform fast lookups of values stored in memory. Most
languages have simple bindings that make this very easy from a programming
perspective. This also means that it's not quite as simple to configure as
[APC](/posts/using-apc-to-speed-up-php/).

## Installation and Configuration

I recommend using your choice of installation mechanism (or your
distribution's choice; mine's `emerge`) to install Memcached.

The configuration usually consists of an RC configuration parameter file
that specifies how much memory to allocate and a port to listen on. In
[Gentoo](https://www.gentoo.org/) this file is located in `/etc/conf.d/`
as usual but look for it in `/etc/sysconfig` on
[RHEL](https://www.redhat.com/en/technologies/linux-platforms/enterprise-linux)-like
distributions.

Update the configuration to listen on the interface of your choice, use
the amount of memory that's appropriate for your application and system,
&c. That's all there is to Memcached and you're now ready to start the
service.

## Configuring WordPress to Use Memcached

> If you don't already have the [PHP](https://www.php.net/) bindings for
> Memcached installed, install them with your package manager or with
> [PECL](https://pecl.php.net/).

I've previously mentioned the [W3 Total
Cache](/posts/using-apc-to-speed-up-php/)
[WordPress](https://wordpress.org/) plugin but unfortunately this plugin
doesn't allow you to easily configure Memcached usage through the web
interface. It defaults to using the Memcached server located at
`127.0.0.1:11211` which isn't appropriate for a remote installation of
Memcached. We need to modify
`DOCROOT/wp-content/w3-total-cache-config.php` so that the Memcached
servers point to our remote server's location before enabling it in the
interface. The following [sed](https://www.grymoire.com/Unix/Sed.html)
command can make this change for us:

```bash
sed -i -e 's/127.0.0.1:11211/HOST:PORT/g' DOCROOT/wp-content/w3-total-cache-config.php
```

## Configuring MediaWiki to Use Memcached

> Just like WordPress,
> [MediaWiki](https://www.mediawiki.org/wiki/MediaWiki) needs the PHP
> bindings for Memcached pre-installed.

Setting up MediaWiki with Memcached is a simple matter and only requires
an edit of its `LocalSettings.php` file. We need to add the following
section to enable Memcached:

```php
## Shared memory settings
$wgMainCacheType = CACHE_MEMCACHED;
$wgParserCacheType = CACHE_MEMCACHED;
$wgMessageCacheType = CACHE_MEMCACHED;
$wgMemCachedServers = array("giskard.alunduil.com:11211");

$wgSessionsInMemcached = true;
```

These settings not only enable Memcached but also specify the set of
Memcached servers to use and whether or not to put sessions into
Memcached.

If you do use multiple Memcached servers and want to apply a weighting
factor you can do this with nested PHP `arrays`:

```php
$wgMemCachedServers = array(array("host:port", weight), array("host2:port2", weight));
```

## Conclusion

Using Memcached can greatly reduce the load placed on databases behind
webapps or other data storage and retrieval systems. This usually improves
the perceived load on the web application itself but not necessarily.
