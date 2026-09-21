---
pubDatetime: 2011-02-03T17:05:04Z
title: Using APC to Speed Up PHP
description: "APC caches PHP's compiled bytecode so it isn't recompiled on every request, which speeds up an application without touching a line of its code."
tags:
  - php
  - caching
  - performance
timezone: America/Chicago
hideEditPost: true
---

> **Archival republish.** From this blog's Nikola era; lightly copyedited.

## Introduction

Making [PHP](https://www.php.net/) run faster is easily accomplished by
updating the code or algorithm in use but what if we don't want to fix the
code or even look at it? What other options do we have for speeding up our
PHP applications?

We've already discussed optimizing LAMP by optimizing
[MySQL](https://www.mysql.com/) and [Apache](https://httpd.apache.org/) in
"Optimizing LAMP: Apache and MySQL".

## Install APC

[APC](https://pecl.php.net/package/APC) is a PHP opcode caching system.
This means that when the PHP script is executed and converted to bytecode
the intermediary bytecode is cached in APC so that it can simply be looked
up next time this line is seen rather than compiling it again.

APC not only provides opcode caching but can also be used as an object
cache (similar to [Memcached](https://memcached.org/)). This object
caching requires modifications to the application that wants to utilize it
whereas the opcode caching is automatically enabled for all PHP executed
while the module is loaded.

> To use the object cache with [WordPress](https://wordpress.org/) one
> should use the [W3 Total
> Cache](https://wordpress.org/plugins/w3-total-cache/) plugin.

To install APC simply install it with your package manager (the package is
probably named pecl-apc) or with [PECL](https://pecl.php.net/).

## Configuring APC

APC's configuration is in the normal location,
`/etc/php/apache2-php5/ext-active/apc.ini` and usually looks like the
following:

```ini
extension=apc.so
apc.enabled="1"
apc.shm_segments="4"
apc.shm_size="128"
apc.num_files_hint="1024"
apc.ttl="7200"
apc.user_ttl="7200"
apc.gc_ttl="3600"
apc.cache_by_default="1"
;apc.filters=""
;apc.mmap_file_mask="/tmp/apcphp5.XXXXXX"
apc.slam_defense="0"
apc.file_update_protection="2"
apc.enable_cli="0"
apc.max_file_size="1M"
apc.stat="1"
apc.write_lock="1"
apc.report_autofilter="0"
apc.include_once_override="0"
apc.rfc1867="0"
apc.rfc1867_prefix="upload_"
apc.rfc1867_name="APC_UPLOAD_PROGRESS"
apc.rfc1867_freq="0"
apc.localcache="0"
apc.localcache.size="512"
apc.coredump_unmap="0"
```

> The options for APC are documented in the APC Manual.

Most of these options can be left with their default values and provide
the desired effect.

If you have plenty of available memory on the system utilizing APC you can
tweak the following to improve your experience:

- **`apc.shm_segments`** — number of chunks to use in `/dev/shm`.
- **`apc.shm_size`** — size of the `apc.shm_segments`.

These two parameters dictate the total memory usage for APC. In fact, if
you simply multiply these values together you'll get the maximum amount of
memory used by APC for the cache.

## Caveats

There is a limitation in the kernel on the size of shm files that limits
the `apc.shm_size`. Run the following command to determine this limit for
your system:

```bash
cat /proc/sys/kernel/shmmax
```

> `/proc/sys/kernel/shmmax` prints out the limit in Bytes but APC expects
> its sizes in MegaBytes.

## Conclusion

APC can help you get a bit more performance out of your PHP applications
without modifying a line of application code or a lot of configuration.
Play with the memory settings to determine what's right for your workload
and start serving PHP just a hair faster.
