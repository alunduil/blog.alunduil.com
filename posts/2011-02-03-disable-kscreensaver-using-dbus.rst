---
title: Disable KScreenSaver Using DBUS
tags: kde 4, kde, powerdevil, kscreensaver, screensaver, dbus, qdbusviewer, python, subversion, xkcd
---

KDE 4 has some major improvements over older versions, but it also seems to
have gone backwards in places.  The new libraries probably contribute to this
and are absolutely the way to go.  A nice ability that I've been looking for
in powerdevil (the new power manager in KDE 4) is how to have the screensaver
disabled when entering presentation mode.  This is behavior that I know I
expected but found, to my dismay and partway through a presentation, was not
available as the screensaver came to life.

After looking around for ways to solve this issue, I finally found some
interesting information in the form of the DBUS interface provided by the
screensaver in KDE.  Using `qdbusviewer` I was able to find an API for the
screensaver that can be invoked at any point and from anywhere (assuming the
application is part of the session with the screensaver).  Using this new
ammunition for more Googling, I found that I could write a daemon in python
that would keep the screensaver from displaying while it was turned on.

The result of this work can be found in my subversion repository as
`stop_kscreensaver.py 
<http://svn.alunduil.com/svn/stop_kscreensaver/trunk/stop_kscreensaver.py>`_.
This script only has three parameters and is very easy to use.  When starting
the daemon you simply pass a time between activity simulations (this should be
set just shorter than the timeout for the screensaver it is meant to control)
and if desired a different logging level.  To stop the daemon you simply pass
the kill parameter which reads the PID from a standard file and makes sure the
daemon dies.

The timing parameter for this script is fairly functional in that you can pass
the time in with various units and the conversion will be taken into account.
For example, one could pass a time of 2h32.1m94.34s.  Why anyone would is
beyond me, but it's there if anyone finds it useful.  If no units are passed,
the script assumes that the number passed was in seconds.  As always if any
bugs are found please e-mail me, `Alex Brandt <mailto:alunduil@alunduil.com>`_
with a description of the problem.  Patches for issues that you experienced
are always welcome.

Now the important part.  How do we get this to work with powerdevil?  That's
the easiest part of all with powerdevil's "execute this scrip when switching to
this profile."  We simply save the script somewhere, make it executable (chmod
755), and then set the path (or browse to it) in the powerdevil configuration
interface.

Once that is in place you can switch to the profile you set the daemon up to
start in and the screensaver although active will not start up until you
switch profiles again.  This lets you watch that movie you wanted to just like
our favorite comic `XKCD <http://xkcd.com/196/>`_ tells us about.

