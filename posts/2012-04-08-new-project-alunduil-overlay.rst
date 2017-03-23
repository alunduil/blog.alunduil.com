---
title: "New Project: alunduil-overlay"
tags: overlay, gentoo, eix-remote, layman, alunduil-overlay
---

Introduction
------------

A `Gentoo <http://www.gentoo.org/>`_ overlay for personal projects as well as
interesting things that aren't found in `eix-remote` when I sit down to use
them.  Typically, this includes minor patches, use flags, or other minor
items.

Installing alunduil-overlay
---------------------------

#. `install layman <http://www.gentoo.org/proj/en/overlays/userguide.xml>`_
#. add http://www.alunduil.com/svn/portage/trunk/alunduil-overlay.xml to the
   overlay variable in `/etc/layman/layman.cfg`
#. add the overlay using layman: `layman -f -a alunduil-overlay`

Issue Reporting
---------------

Please, report any issues with the ebuilds provided to `bugzilla.alunduil.com
<http://bugzilla.alunduil.com>`_ under the alunduil-overlay product.

