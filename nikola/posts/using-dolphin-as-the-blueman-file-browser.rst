.. title: Using Dolphin as the Blueman File Browser
.. slug: using-dolphin-as-the-blueman-file-browser
.. date: 2010/06/27 12:05:31
.. tags: draft, bluetooth, blueman, gnome-bluetooth, kbluetooth, kde, gtk, gnome, nautilus, obex ftp, obex, fuse, obexfs, dolphin 
.. link: 
.. description: 
.. type: text

Introduction
------------

Bluetooth, a convenience that shouldn't be underestimated.  Bluetooth has
invaded pretty much every peripheral device we've come to know and love (i.e.
mice, keywords, ad-hoc networks, hands-free, &c).  One of the most convenient
aspects of bluetooth is the ability to browse filesystems through a simple
ad-hoc network connection from a phone or other peripheral device.

The *One* Problem with Blueman
------------------------------

`Blueman <http://blueman-project.org/>`_ is currently my preferred bluetooth
management utility but others do exist (i.e. `gnome-bluetooth
<http://live.gnome.org/GnomeBluetooth>`_ and kbluetooth).  I have found the
configurability of blueman to give a bit more flexibility than other solutions.

One concern about using blueman under `KDE <http://www.kde.org/>`_ is it's
`GTK <http://www.gtk.org/>`_ skin and it's affinity for `GNOME
<http://www.gnome.org/>`_.  This affinity makes working with blueman under KDE
require a few tweaks.  Of course, no tweaks are required when running
kbluetooth under KDE.

The only complaint I have against blueman thus far is its insistence on using
`nautilus <http://live.gnome.org/Nautilus>`_ as the file browsing utility (I
neither use nor install nautilus).

The Solution
------------

**IMAGE GOES HERE**

.. <p>[caption id="attachment_155" align="aligncenter" width="300" caption="Blueman Transfer Settings"]<a href="http://www.alunduil.com/wp-content/uploads/2010/06/blueman.png"><img src="http://www.alunduil.com/wp-content/uploads/2010/06/blueman-300x253.png" alt="Blueman Transfer Settings" title="Blueman Transfer Settings" width="300" height="253" class="size-medium wp-image-155" /></a>[/caption]</p>

The above image shows that we can modify the obex ftp browser that is used by
blueman.  Let's change this to a custom script (shown below) that uses a
`FUSE <http://fuse.sourceforge.net>`_, `obexfs
<http://dev.zuckschwerdt.org/openobex/wiki/ObexFs>`_, and `dolphin
<http://www.kde.org/>`_ to achieve our desired behavior: browsing the bluetooth
device's files with dolphin.

.. code-block:: bash

    #!/bin/bash
    # bluemount.sh

    obexfs -b ${1} ~/.bluemnt
    dolphin ~/.bluemnt --nofork
    fusermount -u ~/.bluemnt

This script requires obexfs, fuse, and dolphin to work properly.  What the
script does is the following:

1. mount the bluetooth file system to a location we can browse (`~/.bluemnt`)
  
  * `~/.bluemnt` was an arbitrary choice I made and can be set to anything

2. the argument passed from blueman, `${1}`, is the device id that obexfs
   expects when mounting the filesystem

3. after the filesystem is ready we open the location with dolphin

  * dolphin is told not to fork so that the last portion gets called when
    we're finished

4. unmount the filesystem when we're not browsing it any longer

Conclusion
----------

Using dolphin as blueman's file browser isn't as difficult as it might seem
and with one simple hook we have it working as simply as nautilus.  At this
point we can use the one click ease that blueman had provided us with but get
the file manager we not only expect but desire.

