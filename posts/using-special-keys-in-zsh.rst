.. title: Using Special Keys in Zsh
.. slug: using-special-keys-in-zsh
.. date: 2011/01/27 20:27:40
.. tags: zsh, bash, special keys, delete, home, page up, page down, inputrc, bindkeys
.. link:
.. description:
.. type: text

I recently made the plunge and bagan using `Zsh <http://www.zsh.org/>`_ in
lieu of `Bash <http://www.gnu.org/software/bash/>`_ .  I've not regretted the
decision in the slightest but there have been minor annoyances that needed to
be dealt with.  The simplest annoyance was the special keys (i.e. delete,
home, &c).  The solution is quite simple and elegant but not completely
obvious.

The bindings are usually read from the inputrc file (located in /etc/) by Bash
but Zsh does not do this by default.  There are probably more elegant
solutions to this problem but a quick brute force solution is to create a
bindkeys file from inputrc:

.. code-block:: bash

    gawk '$1 ~ /.*:/ { print "bindkey",$1,$2 }' /etc/inputrc | sed -e 's/://g' > ~/.zshrc-bindkeys

Once this file has been crafted, it's simply a matter of invoking it from your
.zshrc with `source ~/.zshrc-bindkeys`.

