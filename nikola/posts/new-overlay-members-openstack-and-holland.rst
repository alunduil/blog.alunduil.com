.. title: New Overlay Members: openstack and holland
.. slug: new-overlay-members-openstack-and-holland
.. date: 2012/04/08 17:27:38
.. tags: alunduil-overlay, repoman, python, distutils, eclass, gentoo, holland, openstack, nova
.. link: 
.. description: 
.. type: text

I've recently made a push to clean the packages provided by `my overlay
</posts/alunduil-overlay.html>`_.  I've purged older packages and re-visited
repoman's guidance on package design as well as updated all python builds to
properly utilize the distutils eclass.

Some of the more notable changes to the overlay include the following:

* Live Holland Ebuilds
  
  * Added live ebuilds for all `Holland Backup Framework
    <http://hollandbackup.org/>`_ ebuilds 
  * There are currently known collisions between the base holland ebuild and
    the holland-lib-common ebuild

* Live Openstack Ebuilds

  * Added a live ebuild for the `Openstack <http://openstack.org/>`_ Nova
    Project
  * Work needs to be done to setup proper configuration items
  * A configure function needs to be added to the ebuild to setup the base
    items outlined in various Openstack guides
  * An init script should be crafted that allows control over the system

