---
title: Updating Bacula — Database Issues
tags: backups, bacula, gentoo, emerge, portage
---

Introduction
------------

Backups, a subject always talked about but rarely put into practice.  If you
do happen to have a backup solution, excellent, you probably sleep easier than
most knowing your data is safe.

I've been using bacula for my backup solution for over a year now and one
thing I've never had enough experience with has been upgrades.  The upgrade
process can be pretty hairy depending on your distribution, level of
investment, &c.

Updating Bacula
---------------

Recently, `bacula <http://www.bacula.org/en/>`_-5.0.2-r1 was marked stable in
the portage tree (`Gentoo <http://www.gentoo.org/>`_).  Upon finishing the
emerge, I attempted to restart all of the bacula services to bring the new
version live:

.. code-block:: bash

    /etc/init.d/bacula-sd restart
    /etc/init.d/bacula-fd restart
    /etc/init.d/bacula-dir restart

The Problem
-----------

All went well until I performed the restart on the directory (bacula-dir).  At
that point things took a turn for the worse.  The director didn't want to
start and there were no messages on the screen indicating why this might be
the case.

The Solution
------------

The database needed some schema changes to be applied before the director
could start again.  In order to determine this I ran the following:

.. code-block:: bash

    bacula -u root -g bacula -c /etc/bacula/bacula-dir.conf -fvm

This finally output the magical answer: update the database schema a couple of
versions.  It's important to know which versions you're dealing with as you
must run each update to the database individually.  

.. note::

    Back up the databases you're about to modify, just in case.

The database update scripts are located in `/usr/libexec/bacula/updatedb/` and
when run in the correct order will get you back up and running in short order.
Afterwards, restart the bacula-dir service and everything should be up and
running again.

Conclusion
----------

When updating bacula don't forget the catalog database may have changes that
need to be applied as well before the service will restart correctly.

