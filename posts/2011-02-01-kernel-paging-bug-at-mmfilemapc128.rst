---
title: Kernel Paging Bug at mm/filemap.c:128
tags: kernel, kernel panic, kernel bug, mm, memory management, apache2, remove_from_page_cache, truncate_inode_page, truncate_inode_pages_range, truncate_inode_pages, ext4_evict_inode, evict, iput, d_kill, dput, fput, remove_vma, __do_munmap, sys_munmap, syscall_call
---

In the last couple of months, I've been plagued by a problem with the system
that hosts this website.  A nice kernel panic followed by a random uptime and
a crash.  This is a bit difficult to swallow when the server is nearly 1500
miles away but a reboot and away it goes again.

The actual error is shown here:

.. code-block:: dmesg

    Feb 01 14:13:27 [kernel] kernel BUG at mm/filemap.c:128!
    Feb 01 14:13:27 [kernel] Modules linked in:
    Feb 01 14:13:27 [kernel] Pid: 13604, comm: apache2 Not tainted 2.6.36-hardened-r6 #1 0K8980/Dimension 3000
    Feb 01 14:13:27 [kernel] EIP: 0060:[<c105af4f>] EFLAGS: 00010046 CPU: 0
    Feb 01 14:13:27 [kernel] EIP is at __remove_from_page_cache+0x44/0x91
    Feb 01 14:13:27 [kernel] EAX: 00000000 EBX: c16acf40 ECX: 00000015 EDX: 00000015
    Feb 01 14:13:27 [kernel] ESI: de877d7c EDI: ffffffff EBP: 00000015 ESP: dc4abe28
    Feb 01 14:13:27 [kernel]  DS: 0068 ES: 0068 FS: 00d8 GS: 0033 SS: 0068
    Feb 01 14:13:27 [kernel]  de877d7c c16acf40 c105afbc c16acf40 de877d7c c1061079 c16acf40 00000000
    Feb 01 14:13:27 [kernel] <0> c1061123 de877d7c 00000015 00000006 ffffffff 00000000 0000000e 00000000
    Feb 01 14:13:27 [kernel] <0> c1641f40 c1641f60 c1641f80 c1641fa0 c173ecc0 c1695de0 c16acf40 c15d2f00
    Feb 01 14:13:27 [kernel]  [<c105afbc>] ? remove_from_page_cache+0x20/0x27
    Feb 01 14:13:27 [kernel]  [<c1061079>] ? truncate_inode_page+0x6c/0x7d
    Feb 01 14:13:27 [kernel]  [<c1061123>] ? truncate_inode_pages_range+0x99/0x23a
    Feb 01 14:13:27 [kernel]  [<c10612cd>] ? truncate_inode_pages+0x9/0xc
    Feb 01 14:13:27 [kernel]  [<c10fa452>] ? ext4_evict_inode+0x83/0x265
    Feb 01 14:13:27 [kernel]  [<c108dab2>] ? evict+0x17/0x7b
    Feb 01 14:13:27 [kernel]  [<c108e211>] ? iput+0x182/0x1df
    Feb 01 14:13:27 [kernel]  [<c108b58e>] ? d_kill+0x2a/0x43
    Feb 01 14:13:27 [kernel]  [<c108c292>] ? dput+0xf3/0xfb
    Feb 01 14:13:27 [kernel]  [<c107e289>] ? fput+0x191/0x1b3
    Feb 01 14:13:27 [kernel]  [<c106e14f>] ? remove_vma+0x34/0x52
    Feb 01 14:13:27 [kernel]  [<c106f26a>] ? __do_munmap+0x257/0x2a8
    Feb 01 14:13:27 [kernel]  [<c106f335>] ? sys_munmap+0x49/0x60
    Feb 01 14:13:27 [kernel]  [<c1378005>] ? syscall_call+0x7/0xb
    Feb 01 14:13:27 [kernel] ---[ end trace 4598df0f375c22c4 ]---

The uprecords of this machine:

.. code-block:: bash

         #               Uptime | System                                     Boot up
    ----------------------------+---------------------------------------------------
         1    24 days, 20:31:52 | Linux 2.6.32-hardened-r2  Thu Nov 25 20:58:34 2010
         2    18 days, 09:10:28 | Linux 2.6.36-hardened-r6  Sat Jan  8 12:31:38 2011
         3    15 days, 12:41:25 | Linux 2.6.32-hardened-r9  Fri Oct  8 09:48:07 2010
         4    14 days, 03:43:24 | Linux 2.6.32-hardened-r2  Wed Nov  3 11:29:55 2010
         5     9 days, 19:44:59 | Linux 2.6.32-hardened-r2  Sun Oct 24 15:14:10 2010
         6     7 days, 21:49:22 | Linux 2.6.32-hardened-r2  Mon Dec 20 17:31:43 2010
         7     7 days, 17:34:24 | Linux 2.6.36-hardened-r6  Tue Dec 28 15:58:45 2010
         8     7 days, 08:53:26 | Linux 2.6.32-hardened-r2  Thu Nov 18 11:55:57 2010
         9     5 days, 16:58:46 | Linux 2.6.36-hardened-r6  Wed Jan 26 21:43:51 2011
        10     3 days, 00:09:43 | Linux 2.6.36-hardened-r6  Wed Jan  5 12:17:33 2011
    ----------------------------+---------------------------------------------------
    ->  13     0 days, 00:14:46 | Linux 2.6.36-hardened-r6  Tue Feb  1 15:02:26 2011
    ----------------------------+---------------------------------------------------
    1up in     0 days, 00:40:31 | at                        Tue Feb  1 15:57:42 2011
    t10 in     2 days, 23:54:58 | at                        Fri Feb  4 15:12:09 2011
    no1 in    24 days, 20:17:07 | at                        Sat Feb 26 11:34:18 2011
        up   115 days, 09:00:18 | since                     Fri Oct  8 09:48:07 2010
      down     0 days, 21:28:47 | since                     Fri Oct  8 09:48:07 2010
       %up               99.230 | since                     Fri Oct  8 09:48:07 2010

I suspect this to be a hardware problem but if anyone has any other ideas as
to what might cause this type of problem please let me know.

