---
title: "Optimizing Gentoo: CFLAGS"
tags: cflags, gentoo, isa, instruction set architecture, optimization, gcc
---

Introduction
------------

Determining what CFLAGS to use on a Gentoo system can be slightly awkward if
you're not sure about the processor you're working on and what instruction set
architectures (ISAs) it supports.

We also don't want to make any breaking changes to our build system and will
limit ourselves for this discussion to enabling the ISAs for our processor.

.. note::

    It's assumed throughout this quick guide that you've read and are familiar
    with the existing `Gentoo Optimization Guide
    <http://www.gentoo.org/doc/en/gcc-optimization.xml>`_.

Research
--------

As we mentioned, we need to know our system and processor before we can start
enabling CFLAGS.

Processor flags can be pulled from the CPU information in the proc filesystem:

.. code-block:: bash

    grep flags /proc/cpuinfo | uniq
    flags           : fpu vme de pse tsc msr pae mce cx8 apic sep mtrr pge mca cmov pat pse36 clflush mmx fxsr sse sse2 ht syscall nx mmxext fxsr_opt rdtscp lm 3dnowext 3dnow rep_good extd_apicid pni cx16 lahf_lm cmp_legacy svm extapic cr8_legacy 3dnowprefetch

Knowing the processor flags is only half of the battle, we also need to know
which ISAs gcc will enable automatically with `-march=native`.  We can use the
following to see what -m parameters are not enabled:

.. code-block:: bash

    gcc -Q -c -v -march=native --help=target | grep disabled

If any flag (prefixed with -m in the gcc output) is in both of these outputs
it can probably be safely added to your CFLAGS line in `/etc/make.conf`.  For
my CPU the result is: `-msse3 -m3dnow`; thus, my CFLAGS are: `-march=native
-O2 -pipe -msse3 -m3dnow`.

Conclusion
----------

Adding particular ISA support in your CFLAGS does ensure that you're using
everything your processor has to offer and augments the aforementioned Gentoo
Optimization Guide.

