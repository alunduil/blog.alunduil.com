.. title: Using Holland to Backup PostgreSQL
.. slug: using-holland-to-backup-postgresql
.. date: 2011/02/02 19:04:39
.. tags: backups, bacula, postgresql, postgres, database, holland, sqlite, mysql
.. link: 
.. description: 
.. type: text

Introduction
------------

Backups are a subject I return to semi-frequently with a passion to avoid "oh
shit" scenarios.  Last time I built my backup system, `Bacula
<http://www.bacula.org/en/>`_ with a `PostgreSQL
<http://www.postgresql.org/>`_ database backend, I determined that I would
move to a common database backup script for all of my databases.  `Holland
<http://hollandbackup.org/>`_ fits the bill perfectly with support for
PostgreSQL, `SQLite <http://www.sqlite.org/>`_ , and `MySQL
<http://www.mysql.com/>`_ .  This allows one command to backup all of my
databases on all of my servers and subsequently creates a much simpler bacula
configuration (the database job is defined the same as the catalog job).

Configuring Holland for PostgreSQL
----------------------------------

The problem I ran into with Holland backing up my PostgreSQL databases is the
lack of example configuration file.  It wasn't hard to craft a working default
PostgreSQL configuration and the following is what I came up with
(`/etc/holland/backupsets/default.conf`):

.. code-block:: ini

    [holland:backup]

    plugin = pgdump
    backups-to-keep = 1
    auto-purge-failures = yes
    purge-policy = after-backup
    estimated-size-factor = 1.0

    [pgdump]

    role = postgres

    [pgauth]

    username = postgres

Conclusion
----------

Setting up Holland to backup databases is incredibly easy and flexible.  By
having a common backup solution for all databases, other configurations become
easier and processes can be streamlined.

