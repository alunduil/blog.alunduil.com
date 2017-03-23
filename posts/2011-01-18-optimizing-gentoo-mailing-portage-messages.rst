---
title: Optimizing Gentoo: Mailing Portage Messages
tags: portage, cron, puppet, make.conf, portage_elog_classes, portage_elog_system, portage_elog_command, portage_elog_mailuri, portage_elog_mailfrom, portage_elog_mailsubject
---

Introduction
------------

Portage is an amazingly simple and complex piece of technology.  The
simplicity in each piece's ability to do a specific function comes together in
a complex package management system that rivals all others.  Automating
updates is something that admins everywhere do out of necessity.  In fact,
automating everything is what an admin does.  Automating portage's updates is
a bit more harrowing than other package management systems but isn't
impossible.

Problem
-------

Automating package updates with portage is simple: add a cron job that calls
the appropriate items, but being notified of available updates or the helpful
messages that are part of the updates requires a little tweaking to the
portage configuration itself.

Solution
--------

Turning up the verbosity of portage in the cron job doesn't quite do the job
we expect.  Sure, it adds the messages to the e-mail cron generates but it
also adds plenty more for us to look through.

This also doesn't help when utilities like `Puppet <https://puppetlabs.com/>`_
update packages.

Configuring portage to e-mail the messages only is quite simple and solves
this issue much more satisfactorily.

The `make.conf` man page lets us know about the following parameters that
affect how output is logged:

* PORTAGE_ELOG_CLASSES
* PORTAGE_ELOG_SYSTEM
* PORTAGE_ELOG_COMMAND
* PORTAGE_ELOG_MAILURI
* PORTAGE_ELOG_MAILFROM
* PORTAGE_ELOG_MAILSUBJECT

These parameters allow us to log various output from portage runs to a large
number of destinations.  If we simply want to mail output (not the full build
output) we add the following directives to `make.conf`:

.. code-block:: bash

    PORTAGE_ELOG_SYSTEM="save mail"
    PORTAGE_ELOG_MAILFROM="portage@alunduil.com"

This block leaves the normal configuration, save, but adds the mail facility.

Conclusion
----------

Automating maintenance tasks and making administration more event driven frees
up time for other more interesting areas of the infrastructure that can
continue improving quality while allowing the administrator more time.

