---
title: How To: Boot Using GRUB from a Compaq Smart Array RAID Controller
tags: grub, compaq smart array, gentoo, device map, mbr, master boot record
---

Introduction
------------

When utilizing `GRUB <http://www.gnu.org/software/grub/>`_ to boot from a
Compaq Smart Array there are a few items that aren't commonly encountered and 
require special configuration.  The configuration required is quite simple but
can require hours to determine.

.. note::

    These instructions have been tested on `Gentoo <http://www.gentoo.org/>`_
    but should be generic enough to work on all distributions.

GRUB Configuration
------------------

I'm assuming that the system is installed and GRUB has been installed as well.
A working GRUB configuration is shown below:

.. code-block:: grub

    default 0
    timeout 3
    splashimage=(hd0,4)/boot/grub/splash.xpm.gz

    title=linux-2.6.20-gentoo-r8
        root (hd0,4)
        kernel /boot/bzImage-2.6.20-gentoo-r8 root=/dev/ida!c0d0p7

.. note::

    The boot partition for the above example is partition five on the first
    disk.

The interesting thing about this configuration is the exclamation point (!)
between the first subdirectory and the device node in the device node's path.
Because the device name in the configuration has an exclamation point we need
to manually update the device map, `/boot/grub/device.map`, accordingly.  The
corresponding device map for the above GRUB configuration is shown below:

.. code-block:: grub

    (fd0) /dev/fd0
    (hd0) /dev/ida/c0d0

.. note::

    If you don't have a floppy it doesn't require a device mapping.

Installing GRUB to the MBR
--------------------------

The last requirement is to install GRUB (with the provided configuration) to
the master boot record (MBR).

Begin by entering the GRUB command line interface:

.. code-block:: bash

    /sbin/grub --batch --device-map=/boot/grub/device.map --config-file=/boot/grub/grub.conf --no-floppy

Once you're in, use the following commands to install GRUB:

.. code-block:: grub

    grub> device (hd0) /dev/ida/c0d0
    grub> root (hd0,4)
    grub> setup (hd0)
    grub> quit

Conclusion
----------

At this point GRUB should be installed and configured correctly.  The only
thing left is rebooting the machine to verify that it worked.

