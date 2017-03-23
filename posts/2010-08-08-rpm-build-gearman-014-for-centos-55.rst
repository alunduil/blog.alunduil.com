---
title: RPM Build: Gearman-0.14 for CentOS-5.5
tags: php, gearman, centos, rpm, rpms, rhel, ius, epel, yum, fedora, rhell, pecl
---

Introduction
------------

I was recently tasked with working on getting `PHP <http://php.net/>`_ 5.3
installed with `Gearman <http://gearman.org/>`_ on `CentOS
<http://www.centos.org/>`_ 5.5.  I've learned quite a few of the pains of
working with RPMs and have reminded myself why I don't work with `RHEL
<http://www.redhat.com/products/enterprise-linux/>`_ on a regular basis (for
personal items anyway).  I have had some success in getting everything working
correctly and the following is the quick easy way to get this done on an
x86_64 CentOS 5.5 install (although other RHELs should work as well).

Step 1: Upgrade PHP
-------------------

First, we need to upgrade PHP from the `IUS Community Repository
<http://wiki.iuscommunity.org/Doc/ClientUsageGuide#Configuration>`_.  Once you
have the `EPEL <http://fedoraproject.org/wiki/EPEL>`_ and IUS repositories
installed and working, you simply run these commands:

.. code-block:: bash

    yum remove php
    yum install php53

If the second yum command complains, simply remove all php packages installed
(i.e. `rpm -qa | grep ^php`) and install the corresponding php53 packages.

Step 2: Install Gearman
-----------------------

I recompiled the `Fedora <http://fedoraproject.org/>`_ source RPMs (with a
slightly modified spec file) to get Gearman to play nicely with the CentOS 5.5
environment.  These RPMs are available in `RHELL
<http://svn.alunduil.com/svn/RHELL/trunk/>`_.  Install these RPMs and you'll
have the gearman installation required to install the PHP bindings for
Gearman.

If you have any issues, please let me, `Alex Brandt
<mailto:alunduil@alunduil.com>`_, know.

Step 3: Install PHP's Gearman Bindings
--------------------------------------

The easiest part of this ordeal is to simply install the `PECL
<http://pecl.php.net/>`_ package for the PHP Gearman bindings:

.. code-block:: bash

    pear install channel://pecl.php.net/gearman-0.7.0

Conclusion
----------

If you must use RHEL, this guide should help you get gearman running with PHP.

