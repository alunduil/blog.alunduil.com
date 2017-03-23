---
title: "Python Development: Writing Small Interpreters"
tags: parser, interpreter, compiler, sql, context free grammar, grammar, lr parser, ll parser, pyparsing, python, readline, c, c-plus-plus, bison, lemon
---

Introduction
------------

Writing parsers or interpreters or compilers isn't too common of a topic but
it's an extremely useful design to be familiar with.  For example, sometimes
we want to do more than parse options for input or we might want a custom
configuration file format.  Another example would be using another language to
do custom processing.  What if we have a strict data store but want to have a
little flexibility with how we access this data store?  We could write an
elaborate model library that provides nice easy access to the data store or we
could write a structured query language (`SQL
<http://en.wikipedia.org/wiki/SQL>`_ ) parser that does this translation for us
and is far easier to adapt to other needs.

.. note::

    This article assumes some prior knowledge about `context free grammer
    <http://en.wikipedia.org/wiki/Context-free_grammar>`_ .

Creating a Grammar
------------------

Creating a parser is far easier once the grammar has been created and thought
about.  This is not only true because it's proper planning but also because
most parser generators (including the one we're looking at) read a grammar as
their input.

We'll be looking at the expression grammar from tiny basic as an example.
This is a simple grammar, safe for `LR
<http://en.wikipedia.org/wiki/LR_parser>`_ or `LL
<http://en.wikipedia.org/wiki/LL_parser>`_ parsing (which is important to
note when we talk about other languages like SQL).

Tiny Basic Expression Grammar
-----------------------------

.. code-block:: bnf

  expression ::= (+|-|ε) term ((+|-) term)*
  term ::= factor ((*|/) factor)*
  factor ::= number | (expression)

The parser generator we'll utilize is `pyparsing
<http://pyparsing.wikispaces.com/>`_ , an easy to use LL parser.
The following is the pyparsing code to implement the above grammar:

.. code-block:: python

    expr = Forward()
    factor = ( Word(nums) | Group(Suppress('(') + expr + Suppress(')') )
    term = Group(factor + ZeroOrMore((Literal('*') | Literal('/')) + factor))
    expr << Group(Optional(Literal('-') | Literal('+')) + term + ZeroOrMore((Literal('-') | Literal('+')) + term))
    
This pyparsing snippet turns sentences like the following:

.. code-block:: math

    5 + 5 * 6 / 3 - (47 + 56) * 34

Into easily consumable lists like the following:

.. code-block:: python
    
    [[['5'], '+', ['5', '*', '6', '/', '3'], '-', [[[['47'], '+', ['56']]], '*', '34']]]

We could improve this parser by having it autoreduce expressions and other
expression handling code but it suffices for demonstration purposes.

We still need to invoke the parser in order to get the parsed set of tokens.
The following snippet shows the relevant python line:

.. code-block:: python

    expr.parseString('5+5*6/3-(47+56)*34')

Parser Testing
--------------

Proper testing includes unit tests and other strategies but sometimes the 
easiest way to see what's going on with parsers is to write a small interpreter
that loops over expressions so you can see the effects.  Using python and 
readline we can create a convenient environment for live interaction of this 
sort:

.. code-block:: python

    import rlcompleter
    import readline
    import so

    if not os.access(".history", os.F_OK):
        open(".history", "w").close()

    readline.read_history_file(".history")

    buffer = ""

    while True
        try:
            line = raw_input(pycolorize.light_blue("BASIC$ "))
        except EOFError:
            readline.write_history_file(".history")
            print
            break

        if line.lower() == "exit" or line.lower() == "quit":
            readline.write_history_file(".history")
            break

        buffer += line
        result = ACTION_ON_BUFFER
        buffer = ""

Complete Reference Script
-------------------------

.. code-block:: python

    import rlcompleter
    import readline
    import os
    import pprint
    import pycolorize

    from pyparsing import *

    if not os.access(".history", os.F_OK):
        open(".history", "w").close()

    readline.read_history_file(".history")

    class ExpressionParser(object):
        def __init__(self):
            self._expr = Forward()
            factor = ( Word(nums) | Group(Suppress('(') + self._expr + Suppress(')')) )
            term = Group(factor + ZeroOrMore(Literal('*') | Literal('/')) + factor)
            self._expr << Group(Optional(Literal('-') | Literal('+')) + term + ZeroOrMore((Literal('-') | Literal('+')) + term))

        def _calculate(self, l):
            while any([ isinstance(x, list) for x in l]):
                for n, i in enumerate(l):
                    if isinstance(i, list):
                        l[n] = self._calculate(i)
                return str(eval(" ".join(l)))

        def __call__(self, string):
            return self._calculate(self._expr.parseString(string.asList()))

    print pycolorize.green("Enter your commands to tokenize:")
    print pycolorize.green("Enter a blank line to exit.")

    while True:
        try:
            line = raw_input(pycolorize.light_blue("BASIC$ "))
        except EOFError:
            readline.write_history_file(".history")
            print
            break

        if line.lower() == "exit" or line.lower() == "quit":
            readline.write_history_file(".history")
            break

        buffer += line
        result = None

        try:
            result = ExpressionParser()(buffer)
        except ParseBaseException, e:
            buffer = ""
            
            pycolorize.error(e.line)
            pycolorize.error(" "*(e.col - 1) + "^")
            pycolorize.error(str(e))

            continue

        pycolorize.status("Result: %s", result)

        buffer = ""

Conclusion
----------

Writing parsers with pyparsing is quite simple but remember that any non-LL
grammars will need to have the left-recursion factored out.  Python isn't the
only language with available parser generators: C and C++ have `bison
<http://www.gnu.org/software/bison/>`_ and `lemon
<http://www.hwaci.com/sw/lemon/>`_ , and other languages are sure to have them 
as well.

