---
title: Optimizing LAMP: Apache and MySQL
tags: optimization, mysql, apache, apache mpm, mpm, apc, memcached, major hayden, racker hacker, mysqltuner, wget, perl, memory, connections, query cache, temporary tables, threads, gentoo, prefork, worker, peruser, event
---

Introduction
------------

Faster and faster … optimization always comes up when discussing web
applications and serving techniques.  We'll be covering optimization of `MySQL
<http://www.mysql.com/>`_ as well as how to tune the `Apache
<http://httpd.apache.org/>`_ MPM (multi-processing module).

Quick Wins
----------

There are a few applications that require little to no configuration that can
be installed or enabled to improve performance in a PHP environment:

* `APC <posts/using-apc-to-speed-up-php.html>`_
* `Memcached <posts/using-memcached-with-mediawiki-and-wordpress.html>`_

Optimizing MySQL
----------------

`Major Hayden (a.k.a. Racker Hacker) <http://rackerhacker.com/>`_ wrote an
excellent utility for profiling MySQL called `mysqltuner.pl
<https://raw.github.com/rackerhacker/MySQLTuner-perl/master/mysqltuner.pl>`_.
This utility summarizes the common analytics that MySQL captures and presents
them with recommendations for optimizations.  The recommendations should
generally be ignored as they're for a specific work type but the nice report
of information (shown below) can be used as a quick guide for tuning MySQL.
Running this script is extermely easy: `wget -O - mysqltuner.pl | perl`.  If
you do not have a `~/.my.cnf` file with your credentials the script will prompt
you for them so it can collect the information it needs.

.. code-block:: bash

    >>  MySQLTuner 1.2.0 - Major Hayden <major@mhtx.net>
    >>  Bug reports, feature requests, and downloads at
    >>  http://mysqltuner.com/
    >>  Run with '--help' for additional options and output filtering

    -------- General Statistics --------------------------------------------------
    [--] Skipped version check for MySQLTuner script
    [OK] Currently running supported MySQL version 5.1.67-log
    [OK] Operating on 32-bit architecture with less than 2GB RAM

    -------- Storage Engine Statistics -------------------------------------------
    [--] Status: +Archive -BDB -Federated +InnoDB -ISAM -NDBCluster 
    [--] Data in MyISAM tables: 5M (Tables: 25)
    [--] Data in InnoDB tables: 23M (Tables: 74)
    [!!] Total fragmented tables: 9

    -------- Security Recommendations -------------------------------------------
    [OK] All database users have passwords assigned

    -------- Performance Metrics -------------------------------------------------
    [--] Up for: 3045d 21h 30m 31s (14K q [0.000 qps], 24 conn, TX: 45M, RX: 1M)
    [--] Reads / Writes: 50% / 50%
    [--] Total buffers: 318.0M global + 5.4M per thread (50 max threads)
    [OK] Maximum possible memory usage: 589.9M (29% of installed RAM)
    [OK] Slow queries: 0% (2/14K)
    [OK] Highest usage of available connections: 4% (2/50)
    [OK] Key buffer size / total MyISAM indexes: 16.0M/2.9M
    [!!] Key buffer hit rate: 73.3% (90 cached / 24 reads)
    [OK] Query cache efficiency: 85.0% (8K cached / 10K selects)
    [OK] Query cache prunes per day: 0
    [OK] Sorts requiring temporary tables: 0% (0 temp sorts / 169 sorts)
    [!!] Temporary tables created on disk: 34% (506 on disk / 1K total)
    [OK] Thread cache hit rate: 91% (2 created / 24 connections)
    [!!] Table cache hit rate: 2% (13 open / 486 opened)
    [OK] Open file limit used: 0% (29/4K)
    [OK] Table locks acquired immediately: 100% (3K immediate / 3K locks)
    [OK] InnoDB data size / buffer pool: 23.4M/32.0M

    -------- Recommendations -----------------------------------------------------
    General recommendations:
        Run OPTIMIZE TABLE to defragment tables for better performance
        Temporary table size is already large - reduce result set size
        Reduce your SELECT DISTINCT queries without LIMIT clauses
        Increase table_cache gradually to avoid file descriptor limits
    Variables to adjust:
        table_cache (> 2048)

.. note::

  The longer MySQL is running the more data you have to work with when doing
  analysis like this.  By only getting information from a one hour uptime you
  may be missing out on trends over a day or days.

Understanding how these parameters affect memory and runtime are going to be
the best way to optimize MySQL for your particular workload.  Blindly
following the recommendations provided can make your MySQL instance run worse
rather than better.

With that in mind, the next section is a small glossary of parameters that
have the most noticeable impact on MySQL's performance.  As always your
mileage may vary and the `MySQL manual
<http://dev.mysql.com/doc/refman/5.5/en/index.html>`_ s are an excellent
resource as well.

Glossary of mysqltuner Categories and Controlling Parameters
============================================================

:Maximum possible memory: Not actually a hard limit on the memory usage but
                          the calculated maximum memory usage based on per
                          thread allocations and number of threads allowed; a
                          good check to ensure you're not overallocating memory
                          with other MySQL parameters
:Highest usage of available connections: The maximum number of concurrent
                                         connections seen since MySQL was
                                         started; may indicate a spike during
                                         the runtime of MySQL and not a
                                         sustained connection set
:Query cache efficiency: Query cache hit rate; ideally all queries would come
                         from the query cache but some workloads want this
                         disabled completely (i.e. extremely dynamic queries
                         where there are very few identical queries happening
                         back to back)
:Temporary tables created on disk: Indicates the number of temporary tables
                                   (from joins and other temporary table
                                   creating queries) that were created on the
                                   disk rather than in memory; this is the
                                   first place to trim if memory usage is too
                                   high but also a good place to allocate
                                   those gobs of extra memory on the system
:Thread cache hit rate: Number of threads (connections) that were re-used
                        rather than torn down and re-created
:Table cache hit rate: Number of table file descriptors that were re-used
                       rather than re-opened.

Optimizing Apache
-----------------

Common Apache tunables are in httpd.conf unless your distribution organizes
its Apache configuration into multiple, easier to read files.  Gentoo stores
the tunables we'll be covering in `/etc/apache2/modules.d/00_mpm.conf`.

Apache allows you to change the multi-processing strategy through modules.
The common MPMs are prefork (the default), worker, peruser, and event.
Determining which MPM you are currently using is done by issuing
`/usr/sbin/apache2 -l`.  Most binary distributions don't even offer the last
two as options for their builds of Apache.

.. code-block:: apache

    # Server-Pool Management (MPM specific)

    # PidFile: The file in which the server should record its process
    # identification number when it starts.
    #
    # DO NOT CHANGE UNLESS YOU KNOW WHAT YOU ARE DOING
    PidFile /var/run/apache2.pid

    # The accept serialization lock file MUST BE STORED ON A LOCAL DISK.
    #LockFile /var/run/apache2.lock

    # Only one of the below sections will be relevant on your
    # installed httpd.  Use "/usr/sbin/apache2 -l" to find out the
    # active mpm.

    # common MPM configuration
    # These configuration directives apply to all MPMs
    #
    # StartServers: Number of child server processes created at startup
    # MaxClients: Maximum number of child processes to serve requests
    # MaxRequestsPerChild: Limit on the number of requests that an individual child
    #                      server will handle during its life


    # prefork MPM
    # This is the default MPM if USE=-threads
    #
    # MinSpareServers: Minimum number of idle child server processes
    # MaxSpareServers: Maximum number of idle child server processes
    <IfModule mpm_prefork_module>
      StartServers            5
      MinSpareServers         5
      MaxSpareServers         10
      MaxClients              150
      MaxRequestsPerChild     10000
    </IfModule>
    
    # worker MPM
    # This is the default MPM if USE=threads
    #
    # MinSpareThreads: Minimum number of idle threads available to handle request spikes
    # MaxSpareThreads: Maximum number of idle threads
    # ThreadsPerChild: Number of threads created by each child process
    <IfModule mpm_worker_module>
      StartServers            3
      MinSpareThreads         10
      MaxSpareThreads         20
      ThreadsPerChild         10
      MaxClients              150
      MaxRequestsPerChild     5000
    </IfModule>
    
    # event MPM
    #
    # MinSpareThreads: Minimum number of idle threads available to handle request spikes
    # MaxSpareThreads: Maximum number of idle threads
    # ThreadsPerChild: Number of threads created by each child process
    <IfModule mpm_event_module>
      StartServers        2
      MinSpareThreads     25
      MaxSpareThreads     75
      ThreadsPerChild     25
      MaxClients          150
      MaxRequestsPerChild 10000
    </IfModule>
    
    # peruser MPM
    #
    # MinSpareProcessors: Minimum number of idle child server processes
    # MinProcessors: Minimum number of processors per virtual host
    # MaxProcessors: Maximum number of processors per virtual host
    # ExpireTimeout: Maximum idle time before a child is killed, 0 to disable
    # Multiplexer: Specify a Multiplexer child configuration.
    # Processor: Specify a user and group for a specific child process
    <IfModule mpm_peruser_module> 
      MinSpareProcessors  4
      MinProcessors       2
      MaxProcessors       80
      MaxClients          256
      MaxRequestsPerChild 4000
      ExpireTimeout       0
      
      #Multiplexer nobody nobody
      User        nobody
      Group       nobody
      Processor   apache apache
    </IfModule>
    
    # vim: ts=4 filetype=apache

Glossary of MPM Parameters
==========================

The important parameters to tweak when playing with Apache memory and
performance are the following:

:StartServers: Number of servers to start running and handling connections when
               Apache is started
:MinSpareServers: Minimum number of servers to have running and not handling
                  connections
:MaxSpareServers: Maximum number of servers to have running and not handling
                  connections
:MaxClients: Maximum number of clients that can simultaneously connect to
             Apache
:MaxRequestsPerChild: Maximum number of requests that a child will respond to
                      before terminating

Conclusion
----------

Optimizing Apache and MySQL can be done in a multitude of ways with an even
larger number of tunable parameters.  As always, after making changes test to
verify that they do improve performance for your workload.  This should
provide a start when optimizing a LAMP setup.
    
