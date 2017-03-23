---
title: "Optimizing Gentoo: Vacuum Portage Configurations"
tags: gentoo, portage, use flags, portageq
---

All systems collect dust but with the configurability of Gentoo, we tend to
collect a bit more dust in our world than other distributions.  This will be a
quick walkthrough of helpful one-liners that assist with keeping
`/etc/portage/package.*` clean.

In all of the examples presented, replace `/etc/portage/package.use` with the
file you are currently cleaning.

Check for Multiple Occurences of an Atom
----------------------------------------

.. code-block:: bash

    for atom in $(gawk '{ print $1 }' /etc/portage/package.use)
    do
      [ "${grep ${atom} /etc/portage/package.use | wc -l)" -gt "1" ] && echo ${atom}
    done

Check for N Uses of a USE Flag
------------------------------

.. code-block:: bash

    for flag in ${gawk '{ print $2 }' /etc/portage/package.use)
    do
      [ "${grep "${flag}" /etc/portage/package.use | wc -l)" -gt "2" ] && echo ${flag}
    done

This can be used to find frequently used USE flags that might be better placed
in `/etc/make.conf`.

Check for Removed Atoms
-----------------------

.. code-block:: bash

    for atom in $(gawk '{ print $1 }' /etc/portage/package.use)
    do
      [ "$(portageq match / ${atom} | wc -l)" -lt "1" ] && echo ${atom}
    done

