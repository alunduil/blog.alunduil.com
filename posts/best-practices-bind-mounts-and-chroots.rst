.. title: Best Practices: Bind Mounts and chroots
.. slug: best-practices-bind-mounts-and-chroots
.. date: 2011/01/31 12:32:06
.. tags: chroot, jail, chroot jail, bind mounts, autochroot, ldd, mount
.. link: 
.. description: 
.. type: text

Introduction
------------

Not overly recently, I was asked to configure a chroot jail by setting up bind
mounts instead of copying over the involved binaries.  The incident caused a
really interesting system failure, a wake-up call to myself, and an ambitious
project to create an autochroot command.

The Stage
---------

Setting up a chroot jail requires that all binaries and referenced items will
need to be inside the jail location.  This creates quite a complicated
configuration for something even as simple as creating a chroot jail for bash
itself.  Not only do we need to create a clean directory structure and
duplicate our file system hierarchy including bash and all of its
dependencies.  The dependencies for bash can be found out with `ldd`:

.. code-block:: bash

    ldd /bin/bash
            linux-vdso.so.1 (0x00007ffffbdd9000)
            libreadline.so.6 => /lib64/libreadline.so.6 (0x00007fdf9fa02000)
            libncurses.so.5 => /lib64/libncurses.so.5 (0x00007fdf9f7ae000)
            libdl.so.2 => /lib64/libdl.so.2 (0x00007fdf9f5aa000)
            libc.so.6 => /lib64/libc.so.6 (0x00007fdf9f202000)
            /lib64/ld-linux-x86-64.so.2 (0x00007fdf9fc49000)

Once all of the dependencies (and their dependencies) are in place, the proper
items to do work in this minimal shell environment also need to be installed.
This may include device nodes or system environment files (e.g. /etc/passwd,
/etc/shadow).  This can make some utilities a pain to install in a chroot by
hand (e.g. /usr/bin/ssh, /usr/bin/scp, &c).

Creating a chroot
-----------------

So, it's hard; that's not a big deal.  There are ways to make creating
chroot's easier; like bind mounts </sarcasm>:

.. code-block:: bash

    mount -o bind

This handy feature allows one to take any directory on the system and mount it
in another location (like a mountpoint alias).  These become extremely useful
when setting up a chroot environment for system recovery via a live
environment but can be a ticking time bomb if used incorrectly.

Setting up a chroot with bind mounts is incredibly easy.  We simply mount all
of the required sections from the external filesystem inside the chroot
location:

.. code-block:: bash

    mount -o bind /dev /chroot/dev
    mount -o bind /lib /chroot/lib
    mount -o bind /usr/lib /chroot/usr/lib

That was extremely simple; far simpler than finding the dependencies and
copying them into the chroot environment by hand.

The Problem
-----------

Our chroot environment has been setup and running for a while with the bind
mounts and everything has continued working thus far.  What happens when we no
longer need this chroot environment and the person removing it doesn't realise
how we've setup this environment?  Most likely they'll simply `rm -rf /chroot`
and leave it at that.  Since we've used bind mounts and a recursive rm starts
at leaves we're going to be in for a *pleasant* surprise when things in /dev,
/lib, and /usr/lib start to go missing.

The Lesson
----------

Don't use bind mounts as a quick solution for setting up chroot environments.
Even when everything goes smoothly there may be consequences of particular
actions that are not intended.

One potential workaround that comes to mind is setting the bind mounts to read
only with the `ro` mount option.  This might not behave quite as expected; in
fact the following is what happens when attempting this:

.. code-block:: bash

    mkdir -p /mnt/bind
    mount -o bind,ro /proc /mnt/bind
    mount: warning: /mnt/bind seems to be mounted read-write.
    mount
    /proc on /mnt/bind type none (rw,bind)

Mounting a bind mount does not respect the read only mount option we passed
(at least in this particular case).

Conclusion
----------

In general, bind mounts should not be used for chroot environments that are
intended to be persistent.  It is more work to determine dependencies and copy
the chroot components by hand but the result is far more resilient to
potential issues that may crop up.

One solution that I've not seen but would be nice is a script that can
programmatically do the dependency resolution and copying of the items to be
placed in a chroot environment.  I've started a GitHub project, `autochroot
<http://github.com/alunduil/autochroot>`_ but no work has been started on this
yet.

