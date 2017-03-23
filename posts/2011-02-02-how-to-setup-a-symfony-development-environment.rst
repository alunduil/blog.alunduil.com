---
title: How To: Setup a Symfony Development Environment
tags: symfony, mvc, framework, php, agile, use flags, apache, mysql, documentroot, docroot, virtualhost, virtual host
---

Introduction
------------

`Symfony <http://symfony.com/>`_ , is an MVC (Model, View, Controller)
framework written in `PHP <http://php.net/>`_ that takes the toil out of
application writing.

By utilizing a framework and a lifecycle like Agile, elegant code is easier to
produce and maintain.  With proper design patterns already in use, one simply
fills in the appropriate logic to create an application.

These benefits are wonderful but we need an environment we can write and test
this application.  The easiest location is a local workspace but how do we
create a Symfony development environment?

The Players
-----------

The following packages should be installed before setting up the environment
(required USE flags are in parenthesis):

* apache
* mysql
* php (cli ctype reflection spl simplexml xml pcre session apache2 mysql pdo
  xsl)
* symfony

The Music
---------

Now that all of the players are installed, how do we turn a directory full of
various projects into a browseable web location such as
http://localhost/PROJECT?  The easy way is to setup symlinks to the real
DocumentRoots in a dummy directory for apache's sake:

.. code-block:: bash

    rm -rf /var/www/localhost/htdocs
    ln -snf ${PROJECT_DIR} /var/www/localhost/htdocs 

Once we've set the stage, we can change the virtual host declaration for the
default virtual host in apache.  All we need is a few extra lines:

.. code-block:: apache

    AliasMatch ^/((?!cgi-bin|icons).+)/sf/(.*) /usr/share/php5/data/symfony/web/sf/$2
    AliasMatch ^/((?!sf|cgi-bin|icons).+?)/(.*) /var/www/localhost/htdocs/$1/web/$2

    Options Indexes FollowSymLinks

    Order allow,deny
    Allow from all

The last thing is to ensure that your symfony project's .htaccess file
redirects / to /index.php.

Conclusion
----------

That should get a working development environment for multiple symfony
projects up and running that allows easy access to each project as a subweb
off of localhost.

