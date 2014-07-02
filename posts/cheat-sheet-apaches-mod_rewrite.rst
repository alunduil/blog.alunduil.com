.. title: Cheat Sheet: Apache's mod_rewrite
.. slug: cheat-sheet-apaches-mod_rewrite
.. date: 2011/04/28 19:51:32
.. tags: apache, mod_rewrite, http, rewrite, rewritecond, rewriterule, wordpress, drupal, .htaccess, rewritelog, rewriteloglevel, pcre, regex, regular expressions, curl
.. link: 
.. description: 
.. type: text

Introduction
------------

I was recently requested to document common `Apache rewrite
<http://httpd.apache.org/docs/current/mod/mod_rewrite.html>`_ pitfalls and
examples.  As a result, I have crafted the following document.  It is intended
as a two page document where the first page is a reference guide of commonly
used rewrite variables and flags; the second page is a short list of examples,
gotchas, and troubleshooting advice.

Rewrite Cheat Sheet
-------------------

Common Variables
================

HTTP Headers
````````````

* HTTP_USER_AGENT
* HTTP_REFERER
* HTTP_COOKIE
* HTTP_FORWARDED
* HTTP_HOST
* HTTP_PROXY_CONNECTION
* HTTP_ACCEPT

Connection & Request
````````````````````

* REMOTE_ADDR
* REMOTE_HOST
* REMOTE_PORT
* REMOTE_USER
* REMOTE_IDENT
* REQUEST_METHOD
* SCRIPT_FILENAME
* PATH_INFO
* QUERY_STRING
* AUTH_TYPE

Server Internals
````````````````

* DOCUMENT_ROOT
* SERVER_ADMIN
* SERVER_NAME
* SERVER_ADDR
* SERVER_PORT
* SERVER_PROTOCOL
* SERVER_SOFTWARE

Date and Time
`````````````

* TIME_YEAR
* TIME_MON
* TIME_DAY
* TIME_HOUR
* TIME_MIN
* TIME_SEC
* TIME_WDAY
* TIME

Specials
````````

* API_VERSION
* THE_REQUEST
* REQUEST_URI
* REQUEST_FILENAME
* IS_SUBREQ
* HTTPS

Variable Descriptions
`````````````````````

:REQUEST_FILENAME: The full local filesystem path to the file or script
                   matching the request, if this has already been determined
                   by the server at the time REQUEST_FILENAME is referenced.
                   Otherwise, such as wehn used in virtual host context, the
                   same value as REQUEST_URI.
:HTTPS: Will contain the text "on" if the connection is using SSL/TLS, or
        "off" otherwise.  (This variable can be safely used regardless of
        whether or not `mod_ssl` is loaded.)

Flag Descriptions
=================

:nocase|NC: This makes the test case-insensitive — differences between
            uppercase (i.e. A, B, C, &c) and lowercase (i.e. a, b, c, %c) are
            ignored, both in the expanded *TestString* and the *CondPattern*.
:last|L: Stop the rewriting process immediately and don't apply any more
         rules.
:proxy|P: Force the substitution URL to be internally sent as a proxy request.
:qsappend|QSA: Appends any query string created in the rewrite target to any
               query string that was in the original request URL.
:redirect|R[=code]: Forces an external redirect, optionally with the specified
                    HTTP status code.
:forbidden|F: Returns a 403 FORBIDDEN response to the client browser.

Good Examples
=============

Add www to the domain of all requests::

  RewriteCond %{HTTP_HOST} !^www [NC]
  RewriteRule ^ http://www.%{HTTP_HOST}%{REQUEST_URI} [R,L,QSA]

Force all requests to HTTPS::

  RewriteCond %{HTTPS} off
  RewriteRule ^ https://%{HTTP_HOST}%{REQUEST_URI} [R,L,QSA]

Redirect a specific subweb to another domain::

  RewriteRule ^/?subweb/(.*) https://other.example.com/$1 [R,L,QSA]

Block specific IPs from access::

  RewriteCond %{REMOTE_ADDR} ^127.0.0
  RewriteRule ^ - [F,L]

Creating a filesystem alias with mod_rewrite::

  RewriteRule ~/?alias/(.*) /var/www/vhosts/$1/httpdocs/$1 [L,R]

A condition that stops CMS software from over-riding fullstatus (added before
the offending rewriterule)::

  RewriteCond %{REQUEST_URI} !server-status [NC]

Bad Examples
============

Recursive rewrites::

  RewriteRule ^ http://www.%{HTTP_HOST}%{REQUEST_URI} [R,L,QSA]

Gotchas
=======

Some rewrites may conflict with existing rewrites provided by CMS packages
(i.e. wordpress, drupal, &c).  Check for any existing rewrites in an .htaccess
file.

RewriteRule and RewriteCond can only be used in the following contexts:

* server config
* virtual host
* directory
* .htaccess

Common Troubleshooting
======================

* Enable logging with RewriteLog and RewriteLogLevel; example::

    RewriteLog <file path>
    RewriteLogLevel 3 # range: 0 — 9

* Check the regular expressions with a PCRE checker; many can be found on the
  Internet
* Utilize curl to test redirects, R, `curl -I example.com`

