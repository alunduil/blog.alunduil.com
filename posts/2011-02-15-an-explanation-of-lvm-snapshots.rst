---
title: An Explanation of LVM Snapshots
tags: lvm, lvm snapshots, snapshots, san, partitions, physical volumes, volume groups, extents, logical volumes, database backups, backups
---

Introduction
------------

It seems that disk snapshots have become a hot topic and a confusing topic.  I
intend to simply outline what snapshots look like in terms of the lower layers
of abstraction and nothing more.  Snapshots are built into things like LVM,
SAN, &c but I will not be covering those technologies.  Instead, what I intend
to clarify is how snapshots work in LVM.

Lower Layers
------------

Layer 1: The Hard Disk
======================

A hard disk is historically split into several pieces called partitions.
These logically separate the blocks on a disk and allow us to make sure that
disks are not over-allocated for one particular purpose or lose access to a
system if a critical partition (anything with run in the name) is filled to
capacity.

Layer 2: LVM Physical Volume
============================

The partitions that disks are carved into typically get turned into LVM
physical volumes.  There is a one to one mapping between partitions on hard
drives (or whole disks as they don't need to be partitioned) and physical
volumes.  LVM physical volumes connect the underlying disk structure to the
organization that LVM is going to provide.

Layer 3: LVM Volume Groups
==========================

The physical volumes we create can be grouped together into volume groups,
groups of extents (the smallest unit of disk in LVM) that can then be
re-allocated to logical volumes.

Layer 4: LVM Logical Volumes
============================

By carving our pools, volume groups, up into particular chunks we have come
full circle and are using our disk (now a few layers removed) as a group of
extents that get partitioned again.  At this layer the partitions are logical
volumes and can be allocated to particular purposes just like the partitions
we started with.

It should be evident that we have created small units of contiguous extents
(not contiguous physical blocks) that map through the aforementioned layers
back to physical blocks on a disk somewhere.  This abstraction allows us to
perform the magic involved with LVM snapshots.

LVM Snapshots
-------------

For certain purposes (database backups, &c), it is necessary to have the disk
being backed up in a consistent state.  If we want these conditions it usually
involves stopping any services that write to that region of the disk and
ensuring the changes have been flushed and that nothing further will write to
that region.  Stopping production services for backup purposes is a
possibility if you've got the cash to create a redundant environment but this
becomes a much simpler problem when using LVM snapshots.

An LVM snapshot is a temporary region of disk set aside to preserve the
consistency of the region it's a snapshot of.  When an LVM snapshot is created
the following happens:

* LVM reserves space for the original blocks that get changed by writes; this
  is the snapshot space (name and size in the LVM command)
* LVM creates a new device (e.g. /dev/mapper/vg-snapshot) to access the disk
  contents at the snapshot's creation time
* When a write occurs on the original disk the original extent gets written
  into the snapshot area

The reason that LVM snapshots don't use a differencing disk is speed.  With
this setup for snapshots we have instant creation and instant deletion:

:creation: Since we only create a new device node that passes through to the
           original logical volume for anything not contained in the snapshot,
           access continues normally until things start getting written to the
           logical volume.  Once writes have happened we can short circuit this
           pass-through with the extents in the snapshot that map to locations
           in the logical volume.
:deletion: Since only the original, un-interesting extents are ever stored in
           the snapshot it doesn't contain any long-lived information that
           needs to be applied back to the original disk and can simply be
           dropped without concern.

Of course, this means that when we are reading this data or writing to the
logical volume, we have extra operations to perform that didn't occur before
the snapshot existed:

:read: Check that the extent requested hasn't been added to the snapshot
       location and read from the logical volume if this is the case.
:write: Write the new extent to the logical volume but also write the original
        contents and location of that extent into the snapshot region.

Conclusion
----------

LVM snapshots are a convenient way of getting a consistent view of a
particular logical volume while doing backups or other sensitive-to-write
operations.  One caveat to keep in mind (besides the ever so slight write
performance drop), is the size of the snapshot dictates how much information
can be written to the logical volume before the snapshot is useless and is no
longer valid.  Keep the amount of writing you expect for the logical volume in
mind when determining the size of the snapshot you're creating.

