---
title: Ping Checks Fail in Cacti with iputils-20100418
tags: cacti, ping, iputils, iputils-20100418, icmp, icmp_seq, icmp_req
---

Introduction
------------

It appears the output of ping has changed in this release of iputils from
referring to the icmp seq numbers as `icmp_seq` to `icmp_req` which
obliterates the ping.pl script that cacti uses to do pings of servers it
watches and results in NaN values.

The Fix
-------

The fix is quite simple: change the seq to req in the grep line of ping.pl but
the following fix is probably more versatile (and will be checked for
upstream).

.. code-block:: diff

    *** a/ping.pl 2010-07-09 17:33:46.000000000 -0500
    --- b/ping.pl 2010-10-24 18:22:16.325881546 -0500
    *************
    *** 4,10 ****
      $host = $ARGV[0];
      $host =~ s/tcp:/$1/gis;

    ! open(PROCESS, "ping -c 1 $host | grep icmp_seq | grep time |");
      $ping = <process>;
      close(PROCESS);
      $ping =~ m/(.*time=)(.*) (ms|usec)/;
    --- 4,10 ----
      $host = $ARGV[0]
      $host =~ s/tcp:/$1/gis;

    ! open(PROCESS, "ping -c 1 $host | grep -E icmp_/(r\|s\)eq | grep time |");
      $ping = <process>;
      close(PROCESS);
      $ping =~ m/(.*time=)(.*) (ms|usec)/;

Conclusion
----------

Sometimes things just break because of small changes.  This is a simple
example of that and the quick fix for the annoyance of not recording ping
times in Cacti.

