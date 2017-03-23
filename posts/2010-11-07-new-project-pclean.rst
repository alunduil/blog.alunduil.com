---
title: "New Project: pclean"
tags: pclean, gentoo, use flags, alunduil-overlay, bugzilla
---

I've often gotten frustrated with my /etc/portage/package.* files when they
become massive and full of crud that I don't even have installed any longer.
Because of this I have crafted a simple little utility to clean out packages
that are no longer installed and USE flags that are no longer valid from these
files.  This should help trim the cruft from the Gentoo configuration.

`pclean <http://github.com/alunduil/pclean>`_, does all of this and only has
one major problem (so far) before I call it good enough for a 1.0 release.  If
you would like to try this little utility; it's available in `my overlay
</posts/new-project-alunduil-overlay.html>`_ and if you notice any odd
behavior please report it to `my bugzilla
<https://bugzilla.alunduil.com/buglist.cgi?cmdtype=runnamed&namedcmd=Pclean>`_.

