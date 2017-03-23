---
title: Singularity, an Alternative Openstack Guest Agent
tags: openstack,openstack-guest-agent,nova-agent,gentoo,github,singularity
---

Introduction
------------

Recently, the openstack guest agent (nova-agent) hasn't been working up to par
on Gentoo systems.  As an excercise and for a bit of fun, I've re-written the
agent functionality from scratch.  The attempt is located on `GitHub
<https://github.com/alunduil/singularity>`_ and currently works correctly on
Gentoo systems.  Others have volunteered to create appropriate configurators
for other distributions as well as test the framework on these distributions.

Design Considerations
---------------------

Singularity was designed to meet the following considerations:

* maintainable and extensible code
* use system libraries but leverage virtual environments for segregation
* framework for pluggably configuring a system based on information from the
  hypervisor
* configurators are focused on one task and kept small
* configurable; particular functions can be disabled individually

Conclusion
----------

Singularity should be stable enough to use in production but without
appropriate testing this claim feels hollow.  The plan is to mark it 1.0
sometime within the next week unless major issues are reported or noticed.

