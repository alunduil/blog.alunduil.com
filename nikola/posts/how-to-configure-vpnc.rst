.. title: How To: Configure vpnc
.. slug: how-to-configure-vpnc
.. date: 2010/01/11 22:43:19
.. tags: vpnc, cisco, vpn, virtual private network, tun/tap, tun, tap, ipsec, xauth, alias, sudo
.. link: 
.. description: 
.. type: text

Introduction
------------

`vpnc <http://www.unix-ag.uni-kl.de/~massar/vpnc/>`_ is a handy `Cisco
<http://www.cisco.com/>`_ virtual private network (VPN) client.  This allows
remote work, secure network connections, &c.  Our university uses Cisco VPN
services to allow remote access to internal servies (i.e. license servers).

Installing vpnc
---------------

vpnc is found in many distributions' package management systems.  Before
scouring for the sources try searching the package manager.  Otherwise,
install the source with the following standard build process:

.. code-block:: bash

    make 
    su -c "make install"

The other thing to keep in mind is that vpnc requires tun/tap to be built into
your kernel.  vpnc will error with a reminder if it is missing when vpnc is
first run.

Configuring vpnc
----------------

The configuration file needs a few pieces of information before vpnc can
connect us to the remote network.  Edit `/etc/vpnc/default.conf` to have the
following information:

.. code-block:: vpnc

    #Interface name tun0
    IPSec gateway 199.17.118.250
    IPSec ID wireless
    IPSec secret REMOVED
    Xauth ${USERNAME} # DragonMail user name
    Xauth ${PASSWORD} # DragonMail password (not required)

.. note::

    Only use the password line if you've secured this configuration and don't
    want to type a password everytime you connect.

    Please, e-mail your name and DragonID to `Alex Brandt
    <mailto:alunduil@alunduil.com>`_ to request the removed secret.

    Thanks to Conor Shenk for decrypting the password.

Checking vpnc
-------------

Now, if everything is properly configured and installed then all you need to
do is run `vpnc` as root.  If this works, we can set it up so that certain
users can run `vpnc` without becoming root.  Otherwise, troubleshoot, check
the vpnc homepage, &c.

Add Convenience to vpnc
-----------------------

* Autostart vpnc:

  If we want vpnc to start on system boot we can add it to our `rc.local`
  file.  We'll also want to add `vpnc-disconnect` to the shutdown scripts for
  the system.

* Unprivileged vpnc:

  If we would like to run vpnc as a regular user, we'll need to setup a system
  like sudo.  Using `visudo`, add a line similar to the following to the sudo
  configuration for your user:

  .. code-block:: sudoers

      USERNAME HOSTNAME = NOPASSWD:/usr/bin/vpnc,/usr/bin/vpnc-disconnect

* Aliasing vpnc:

  Using aliases can make life even easier.  Simply add aliases like the
  following to a `.bashrc` file to simplify commands requiring the remote
  network:

  .. code-block:: bash

      alias vpnc="sudo vpnc"
      alias vpnc-disconnect="sudo vpnc-disconnect"
      alias idl="vpnc && idl && vpnc-disconnect"

Conclusion
----------

Using vpnc is quite simple and provides convenient access to remote resources
securely.

