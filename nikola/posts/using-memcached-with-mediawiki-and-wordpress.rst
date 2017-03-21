.. title: Using Memcached with MediaWiki and Wordpress
.. slug: using-memcached-with-mediawiki-and-wordpress
.. date: 2011/02/03 15:13:29
.. tags: memcached, cache, apc, emerge, gentoo, rhel, wordpress, pecl, w3tc, w3 total cache, sed, mediawiki
.. link: 
.. description: 
.. type: text

Introduction
------------

`Memcached <http://code.google.com/p/memcached/>`_ is a simple key/value
memory store that uses keys to perform fast lookups of values stored in
memory.  Most languages have simple bindings that make this very easy from a
programming perspective.  This also means that it's not quite as simple to
configure as `APC </posts/using-apc-to-speed-up-php.html>`_.

Installation and Configuration
------------------------------

I recommend using your choice of installation mechanism (or your
distribution's choice; mine's `emerge`) to install Memcached.

The configuration usually consists of an RC configuration parameter file that
specifies how much memory to allocate and a port to listen on.  In `Gentoo
<http://www.gentoo.org/>`_ this file is located in `/etc/conf.d/` as usual but
look for it in `/etc/sysconfig` on `RHEL
<http://www.redhat.com/products/enterprise-linux/>`_ -like distributions.

Update the configuration to listen on the interface of your choice, use the
amount of memory that's appropriate for your application and system, &c.
That's all there is to Memcached and you're now ready to start the service.

Configuring Wordpress to Use Memcached
--------------------------------------

.. note::

    If you don't already have the `PHP <http://php.net/>`_ bindings for
    Memcached installed, install them with your package manager or with `PECL
    <http://pecl.php.net/>`_.

I've previously mentioned the `W3 Total Cache
</posts/using-apc-to-speed-up-php.html>`_ `Wordpress <http://wordpress.org/>`_
plugin but unfortunately this plugin doesn't allow you to easily configure
Memcached usage through the web interface.  It defaults to using the Memcached
server located at `127.0.0.1:11211` which isn't appropriate for a remote
installation of Memcached.  We need to modify
`DOCROOT/wp-content/w3-total-cache-config.php` so that the Memcached servers
point to our remote server's location before enabling it in the interface.
The following `sed <http://www.grymoire.com/Unix/Sed.html>`_ command can make
this change for us:

.. code-block:: bash

    sed -i -e 's/127.0.0.1:11211/HOST:PORT/g' DOCROOT/wp-content/w3-total-cache-config.php

Configuring MediaWiki to Use Memcached
--------------------------------------

.. note::

    Just like Wordpress, `MediaWiki
    <http://www.mediawiki.org/wiki/MediaWiki>`_ needs the PHP bindings for
    Memcached pre-installed.

Setting up MediaWiki with Memcached is a simple matter and only requires an
edit of its `LocalSettings.php` file.  We need to add the following section to
enable Memcached:

.. code-block:: php

    ## Shared memory settings
    $wgMainCacheType = CACHE_MEMCACHED;
    $wgParserCacheType = CACHE_MEMCACHED;
    $wgMessageCacheType = CACHE_MEMCACHED;
    $wgMemCachedServers = array("giskard.alunduil.com:11211");
    
    $wgSessionsInMemcached = true;

These settings not only enable Memcached but also specifies the set of
Memcached servers to use and whether or not to put sessions into Memcached.

If you do use multiple Memcached servers and want to apply a weighting factor
you can do this with nested PHP `arrays`:

.. code-block:: php

    $wgMemCachedServers = array(array("host:port", weight), array("host2:port2", weight));

Conclusion
----------

Using Memcached can greatly reduce the load placed on databases behind webapps
or other data storage and retrieval systems.  This usually improves the
perceived load on the web application itself but not necessarily.

