.. title: Optimizing Gentoo: CFLAGS II
.. slug: optimizing-gentoo-cflags-ii
.. date: 2011/02/15 16:35:45
.. tags: gentoo, cflags, optimization, gcc, use flags
.. link: 
.. description: 
.. type: text

Introduction
------------

As I mentioned in `Optimizing Gentoo: CFLAGS
</posts/optimizing-gentoo-cflags>`_, you want to be comfortable with the
existing documentation on CFLAGS before going crazy trying to optimize your
CFLAGS on your system.  With the wrong CFLAGS things can and will randomly
stop working or possibly building.  Thus, it's a good idea to have a good
understanding of what you're doing to the code when you modify these *sacred*
parameters.

Let's build on what we accomplished last time and get any ebuilds that are
machine instruction set aware building those sections as well as the changes
you made to the CFLAGS last time.

Finding USE Flag Names
----------------------

How can we find the flags that we want to add to our
`/etc/portage/package.use` or `/etc/make.conf` files?  As always BASH is our
friend and can be used to find this answer for us:

.. code-block:: bash

    . /etc/make.conf && gcc -Q -c -v ${CFLAGS} --help=target | grep enabled

This displays the currently enabled flags based on your CFLAGS parameter from
`/etc/make.conf` and allows us to find which flags have USE flags with the
following:

.. code-block:: bash

    gawk '/-m.*/ { print $1 }' | cut -d 'm' --complement -f 1 | xargs -i{} equery h "{}"

The resulting USE flags can be added to `/etc/portage/package.use` or
`/etc/make.conf` as your needs dictate.

Conclusion
----------

Using a little scripting we can extract the USE flags that correspond with the
instruction sets we enabled last time.

