---
title: "How To: Deliver and Forward with Postfix"
tags: store and forward, deliver and forward, postfix, bcc, recipient_bcc_maps, regexp, auto bcc
---

Introduction
------------

At times it would not only be nice but also might be necessary to have the
ability to locally deliver mail for a domain as well as forward those same
mail messages to another domain (migrations to other services, &c).  How does
one go about configuring `postfix <http://www.postfix.org/>`_ in such a way
that fulfills these requirements?

Implementation
--------------

Luckily the BCC field of e-mail allows us to accomplish this quite elegantly.
The postfix parameter we'll take advantage of is `recipient_bcc_maps`.  By
setting this to a regexp lookup table, we're able to add a BCC to all messages
destined for a particular domain passing through this instance of postfix::

    recipient_bcc_map = regexp:PATH

After we've added the above to our postfix configuration, we still need to
create the regexp mapping file with lines similar to the following::

    /(.*)@example.com/ ${1}@other.example.com

Conclusion
----------

Setting up a deliver and forward configuration on postfix is very simple and
requires little consideration about the mail delivery process itself.

References
----------

#. `Auto BCC <http://www.postfix.org/ADDRESS_REWRITING_README.html#auto_bcc>`_

