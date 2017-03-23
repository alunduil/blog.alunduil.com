---
title: Using AWStats on Gentoo
tags: awstats, emerge, use flags, apache2, geoip, vhosts, virtual hosting, cron
---

Requirements
------------

.. note::

    It's assumed for the purposes of this guide that you already have apache
    installed and running a website to monitor.

Start by installing awstats:

.. code-block:: bash

    emerge -av awstats

The USE flags that can be tweaked are the following:

:apache2: Add apache2 support **(recommended)**
:geoip: Add geoip support for country and city lookup based on IPs
:vhosts: Adds support for installing web-based applications into a virtual
         hosting environment

Configuration
-------------

1. setup a configuration file for the web site so we can update the statistics:

   .. code-block:: bash

       cp /etc/awstats/awstats.model.conf /etc/awstats/awstats.FQDN.conf

   Where FQDN is the fully qualified domain name of your website you'll be
   monitoring.

   After you've copied the default configuration, customize it for your
   particular needs.

2. enable awstats in your apache virtualhost configuration:

   .. code-block:: apache

       CustomLog /var/www/localhost/log/apache/production.log combined

       Alias /awstats/classes "/usr/share/webapps/awstats/6.9-r1/htdocs/classes/"
       Alias /awstats/css "/usr/share/webapps/awstats/6.9-r1/htdocs/css/"
       Alias /awstats/icon "/usr/share/webapps/awstats/6.9-r1/htdocs/icon/"
       
       ScriptAlias /awstats/ "/usr/share/webapps/awstats/6.9-r1/hostroot/cgi-bin/"
       ScriptAlias /awstats "/usr/share/webapps/awstats/6.9-r1/hostroot/cgi-bin/awstats.pl"
       ScriptAlias /awstats.pl "/usr/share/webapps/awstats/6.9-r1/hostroot/cgi-bin/awstats.pl"

       Options ExecCGI
       AllowOverride None

       Order allow,deny
       Allow from all

3. verify the logging output in
   `/etc/apache2/modules.d/00_mod_log_config.conf`:

   .. code-block:: apache

       # The following directives define some format nicknames for use with
       # a CustomLog directive (see below).
       LogFormat "%h %l %u %t \"%r\" %&gt;s %b \"%{Referer}i\" \"%{User-Agent}i\"" combined
       LogFormat "%h %l %u %t \"%r\" %&gt;s %b" common
       
       LogFormat "%{Referer}i -&gt; %U" referer
       LogFormat "%{User-Agent}i" agent
       LogFormat "%v %h %l %u %t \"%r\" %&gt;s %b %T" script
       LogFormat "%v %h %l %u %t \"%r\" %&gt;s %b \"%{Referer}i\" \"%{User-Agent}i\" VLOG=%{VLOG}e" vhost
       # You need to enable mod_logio.c to use %I and %O
       LogFormat "%h %l %u %t \"%r\" %&gt;s %b \"%{Referer}i\" \"%{User-Agent}i\" %I %O" combinedio
       LogFormat "%v %h %l %u %t \"%r\" %&gt;s %b \"%{Referer}i\" \"%{User-Agent}i\" %I %O" vhostio
       
       # The location and format of the access logfile (Common Logfile Format).
       # If you do not define any access logfiles within a
       # container, they will be logged here.  Contrariwise, if you *do*
       # define per- access logfiles, transactions will be
       # logged therein and *not* in this file.
       CustomLog /var/log/apache2/access_log common
       
       # If you would like to have agent and referer logfiles,
       # uncomment the following directives.
       #CustomLog /var/log/apache2/referer_log referer
       #CustomLog /var/log/apache2/agent_logs agent
       
       # If you prefer a logfile with access, agent, and referer information
       # (Combined Logfile Format) you can use the following directive.
       #CustomLog /var/log/apache2/access_log combined

4. add a cron entry to update the statistics on a regular basis:
   
   .. code-block:: cron

       # AWStats
       */15 * * * * perl /usr/share/webapps/awstats/6.9-r1/hostroot/cgi-bin/awstats.pl -config=FQDN -update > /dev/null

Conclusion
----------

Barring the standard "your mileage may vary" warning your awstats setup should
be complete and functional.  It will take a bit of time (~15 minutes) for the
statistics to start collecting.

