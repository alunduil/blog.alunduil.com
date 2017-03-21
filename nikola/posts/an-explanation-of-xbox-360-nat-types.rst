.. title: An Explanation of Xbox 360 NAT Types
.. slug: an-explanation-of-xbox-360-nat-types
.. date: 2010/01/12 00:29:17
.. tags: xbox, xbox 360, nat, network address translation, open nat, moderate nat, closed nat, xbox live, udp, vista, windows vista, universal plug and play, upnp, security
.. link: 
.. description: 
.. type: text

I finally broke down and purchased an `Xbox 360 <http://www.xbox.com>`_ with
`Halo 3 <http://halo.bungie.net/projects/halo3/default.aspx>`_ .  It is an
incredible improvement over the first system and is backwards compatible.  The
first intriguing thing about the system from a technologist perspective is
their idea of network address translation (NAT) types: Open, Moderate, and
Closed.  I didn't realise this was possible but after a few packet captures I
learned a couple of things:

* Xbox Live uses port 3047
* Xbox Live uses UDP
* Xbox Live thinks Open NAT means UDP port 3047 is directly accessible on the
  Xbox in question behind your NAT device

This leads me to the conclusion that the Xbox Live and Vista ready devices are
just engineered to provide holes in networks (utilizing Universal Plug 'n'
Play (UPnP) of course).  I guess acceptance of this as a requirement to play
is something a security policy can help decide.

