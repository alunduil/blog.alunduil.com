.. title: Python Development: Dynamically Loaded Modules or Plugins
.. slug: python-development-dynamically-loaded-modules-or-plugins
.. date: 2010/12/17 22:24:46
.. tags: modules, plugins, extensions, python, subcommands, eggs, entry points
.. link: 
.. description: 
.. type: text

Introduction
------------

Sometimes dynamically loaded modules (plugins or extensions) are pretty
convenient to provide extensible functionality for your applications.  For
example, you need to provide a command that provides known data sources to
subcommands but want the subcommands to be easily written and added even after
the application has been finalized.  We could do this with a simple modular
design but it seems more natural to allow for the subcommands to be defined
elsewhere with a standard interface to allow for extensible behavior even
after the initial application development cycle.

.. note::
    This discussion does not cover eggs and their entry points but entry
    points would be a potential solution to this situation as well.

The Problem
-----------

How do we find and then load and then run code that we didn't necessarily
write?  The first step is fairly obvious, we ask (via a parameter,
configuration option, &c) where the code that should be loaded is located.
Once we have the location the other steps are much easier.  In more detail, we
need to know a location that contains code following our plugin API.  To do
this we can use the following code (where `d` is the directory with our
plugins):

.. code-block:: python

    sys.path.append(d)
    files = itertools.chain(*[ [ os.path.join(x[0], fs) for fs in x[2] ] for x in os.walk(d) ] )
    plugins = [ f.split('/')[-1].split('.')[0] for f in files if f.endswith('.py') ]
    modules = [ __import__(p, globals(), locals(), [], -1) for p in plugins ]

    for p, m in zip(plugins, modules):
        matches = [ x for x in m.__dic__.keys() if x.lower() == p ]
        if len(matches) == 1: # and issubclass(m.__dict__[matches[0]], PluginBase):
            self._commands.append(m.__dict__[matches[0]]())

Break Down
----------

#. We add our directory to the python module path so we can simply load them
   by name
#. Then we get a list of the files in this directory
#. Then we filter this down to the names of the python files to find the Class
   that we need to create an instance of
#. We then import the modules as module objects we can manipulate
#. We then loop through the correlated list of plugin names and module objects
#. We look for an object in the module dictionary that matches the name of the
   file (case insensitive)
#. If we find a match we then add an instantiated object of the class we found

Quite a bit is going on in this short snippet of code but the important thing
is that it takes a directory path and creates a list of instantiated plugin
objects we can use just like any other object variable.  Once we have the
objects it's simply a matter of calling functions on them:
`self._commands[n].method()`.

Conclusion
----------

Getting a modular design can be daunting and making that modular design as
dynamic as possible can be even more daunting but the modern languages (this
technique but not syntax works with ruby as well) make this process much
easier than the compiled languages.  (More to come on that later I hope.)

