.. title: Using Hamachi on Gentoo
.. slug: using-hamachi-on-gentoo
.. date: 2010/09/27 16:11:12
.. tags: gentoo, hamachi, vpn, ebuild, emerge, rc-update, tuncfg, tun, tun/tap, openvpn, lan
.. link: 
.. description: 
.. type: text

Introduction
------------

`Hamachi <https://secure.logmein.com/products/hamachi2/>`_ is a lightweight
personal VPN connector that is a breeze to setup but there can be some pain if
you don't know what to expect.  As always Gentoo provides us with an ebuild
that simplifies the installation process but getting up and running is still a
little confusing.

Installation and Setup
----------------------

User Specific Configurations
============================

The obvious first step is `emerge -av hamachi` (this is only available to
~ARCH right now so add this to `/etc/portage/package.keywords` if desired).
The following are the typical instructions to install hamachi on Gentoo using
portage:

.. code-block:: bash

    echo "net-misc/hamachi ~${ARCH}" >> /etc/portage/package.keywords # Optional
    emerge -av hamachi
    rc-update add tuncfg default

After these steps have been taken, you can run hamachi as any user on the
system for ad-hoc VPN creation.

Server-Wide Configuration
=========================

If you prefer to do a system wide VPN configuration with hamachi, a different
approach must be taken:

.. code-block:: bash

    echo "net-misc/hamachi ~${ARCH}" >> /etc/portage/package.keywords # Optional
    emerge -av hamachi
    rc-update add hamachi default

Now all configuration should be placed inside `/etc/hamachi` for the VPN
tunnels to be configured at startup or when the hamachi service starts.

Kernel Configuration
--------------------

For hamachi to work correctly you do need the tun parameter in your kernel or
loaded as a module.  This parameter is located in Device Drivers → Network
device support → Universal TUN/TAP device driver support.

Using Hamachi
-------------

Now that hamachi is on the system we need to start using it.  The server-wide
installation doesn't require this (but I'm sure you can use this method to
create a configuration usable by the server-wide instance) but the user
specific usage does.

Starting hamachi is as simple as the following:

.. code-block:: bash

    hamachi-init
    hamachi start
    hamachi login
    hamachi create NETWORK [ PASSWORD ]
    hamachi join NETWORK [ PASSWORD ]
    hamachi go-online NETWORK

That's it.  You're now connected to a private network named NETWORK.  You can
view who else is connected to your network with `hamachi list` and `hamachi
get-nicks`.

Conclusion
----------

Setting up a VPN can be daunting (see the OpenVPN configuration documentation)
or it can be a breeze with hamachi.  Need a quick VPN for LAN gaming or a VPN
for performing maintenance over The Internet on a device behind a firewall?
Hamachi may be the quick solution you're looking for.

