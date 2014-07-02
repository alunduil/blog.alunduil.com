.. title: An Explanation of System Load Average
.. slug: an-explanation-of-system-load-average
.. date: 2010/09/09 10:05:26
.. tags: load average, load, system load
.. link: 
.. description: 
.. type: text

Introduction
------------

Often in administration, people make reference to a magic number known as load
average but it's not always clear what this number actually means.  Most of
the time its simply an indicator of whether or not the server is under duress.
This number doesn't have a whole lot of detail embodied in it but it's
intended to be a one-glance check on server health.

Calculation of Load Average
---------------------------

The load average is an exponentially damped/weighted moving average that is
similar to a running n² average.  This number is calculated in accordance with
the jiffies the kernel is tracking rather than the clock ticks.  Every time
slice (which *can* but shouldn't be tweaked in the kernel) the system load
average is updated.  This rolling average allows us to keep a minimal amount
of information on hand and still have an average since boot.

The load that gets placed into this average algorithm is simply a count of the
number of processes in the run queue at that instant.  Thus, since processes
who are waiting on I/O (those in the D state) need to periodically check in or
wait to be woken up by the kernel; these processes can contribute to the count
of processes in the run queue.  Since these processes aren't taking CPU time
but are taking space in the run queue they can increase the apparent load on
the server (thus bringing in the I/O wait of the system into the load average)
without raising the CPU usage time.

Conclusion
----------

The load average doesn't tell you a whole lot of information but coupled with
information from `iostat` or your CPU usage you can quickly use it to guage
whether your server is falling down under it's load.  Since it reports the
number of processes in the run queue it is safe to assume a reaonably
efficient use of hardware would dictate you want N + 1 (N being the number of
cores in the system) as your load average.

References
----------

More information, including source code for this calculation, can be found on
the `wikipedia page <http://en.wikipedia.org/wiki/Load_%28computing%29>`_.

Anexcellent reference on the how the Linux process life cycle works is Robert
Love's Linux Kernel Development.  Another reference on the process life cycle
is the `KLDP Wiki <http://wiki.kldp.org/wiki.php/ProcessManagement>`_

