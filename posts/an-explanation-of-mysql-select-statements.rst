.. title: An Explanation of MySQL SELECT Statements
.. slug: an-explanation-of-mysql-select-statements
.. date: 2010/08/13 12:25:11
.. tags: sql, select, aliases, tables, columns, inner join, subquery, mysql
.. link: 
.. description: 
.. type: text

Introduction
------------

SQL SELECT statements have the following form:

.. code-block:: sql

    SELECT *COLUMNS*
    FROM *TABLES*
    [ WHERE *CONDITIONS* ]
    [ GROUP BY *COLUMNS*
      [ HAVING *CONDITIONS* ]
      ]
    [ ORDER BY *COLUMNS* ASC|DESC ]

The way SQL processes these directives is slightly different:

.. code-block:: sql

    FROM *TABLES*
    [ WHERE *CONDITIONS* ]
    [ GROUP BY *COLUMNS*
      [ HAVING *CONDITIONS* ]
      ]
    [ ORDER BY *COLUMNS* ASC|DESC ]
    SELECT *COLUMNS*

FROM Clause
-----------

.. code-block:: sql

    FROM *TABLE* [ AS ALIAS ] ... *TABLE* [ AS ALIAS ]

This lets SQL know which tables are being used for the query and any aliases
they might be referenced as in the query.  The aliases are only *necessary*
when an inner join is performed.

Examples
========

.. code-block:: sql

    FROM table1, table2
    FROM table1 AS t1, table2 AS t2
    FROM table1 AS t1a, table1 AS t1b

WHERE Clause
------------

.. code-block:: sql

    WHERE *CONDITIONS*

This lets SQL know which rows should be selected from the table based on the
*CONDITIONS* passed.  The *CONDITIONS* can also be combined with the logical
`OR` and `AND` operators.  (Which should be properly parenthesized to
demonstrate priority.)

The following operators can act on columns in a where clause: `=`, `<>` (also
`!=`), `>`, `<`, `>=`, `<=` `BETWEEN`, `LIKE`, `IN`.

Examples
========

.. code-block:: sql

    WHERE t1.c1 = "string"
    WHERE t1.c1 = t2.c1 and t1.c2 <> t2.c2
    WHERE t1.c1 = t2.c1 and (t1.c2 <> t2.c2 or t1.c3 <> t2.c3)
    WHERE t1.c1 in (value set)

This last example demonstrates using either an explicit set or a subquery
where the subquery returns a list of values that filter this main query.

GROUP BY Clause
---------------

.. code-block:: sql

    GROUP BY *COLUMNS*

This lets SQL know to group the table for aggregate filtering operations.  For
example, if you need to sort the results based on the max sales of your sales
people you could GROUP BY your sales members' identifiers and then use a
HAVING clause to filter based on their `max(sales_amount)`.  This clause is
only really useful when a HAVING clause is useful.

Multiple GROUP BY columns just restricts the groupings to be tighter and
tighter.  For example, if you have three columns t1, t2, and t3 and you use a
GROUP by t1, t2 you will end up with the following groupings:

* t1 and t2 are all the same in this group; t3 varies
* t1 and t2 are all the same in this group; t3 varies

Examples
========

.. code-block:: sql

    GROUP BY c1, c2
    GROUP BY c1

HAVING Clause
-------------

.. code-block:: sql

    HAVING *CONDITIONS*

This is very similar to the WHERE clause and the logical operators `AND` and
`OR` can be used as in the WHERE clause.  The difference here is that
typically you'll be filtering based on an aggregate operation on an ungrouped
column to filter out groups.

Examples
========

.. code-block:: sql

    HAVING max(t3) > N
    HAVING average(t3) BETWEEN x AND y

ORDER BY Clause
---------------

.. code-block:: sql

    ORDER BY *COLUMNS* ASC|DESC

This lets SQL know you want to sort the specified columns in ascending or
descending order.  The sorting will be applied to the columns in the oder that
they are specified.  Thus, it works similar to the way groups work; it makes
groups out of the first specification and the the second, &c.  Performing the
new operation only within the context of the previous.  Thus, the following
data would be sorted as shown:

* Before Sorting:

  +----+----+----+
  | c1 | c2 | c3 |
  +====+====+====+
  | aa | aa | aa |
  +----+----+----+
  | bb | bb | bb |
  +----+----+----+
  | aa | dd | ee |
  +----+----+----+
  | cc | cc | cc |
  +----+----+----+
  | aa | bb | cc |
  +----+----+----+

* After Sorting (ORDER BY c1, c2, c3):

  +----+----+----+
  | c1 | c2 | c3 |
  +====+====+====+
  | aa | aa | aa |
  +----+----+----+
  | aa | bb | cc |
  +----+----+----+
  | aa | dd | ee |
  +----+----+----+
  | bb | bb | bb |
  +----+----+----+
  | cc | cc | cc |
  +----+----+----+

Examples
========

.. code-block:: sql

    ORDER BY c1
    ORDER BY c1, c2, c3

SELECT Clause
-------------

.. code-block:: sql

    SELECT *COLUMNS*

This lets SQL know which columns (or what projection) of the table to actually
display.  One can also specify aggregate functions here to perform functions
such as counting, averaging, &c.

Examples
========

.. code-block:: sql

    SELECT col1, col2
    SELECT col1, t1.col2
    SELECT COUNT(col1)

Conclusion
----------

Remember that SQL SELECT statements are not processed in the order that they
are parsed.  This will simplify the query building process to think of it as
operations on a set of data (since that is what it is).  The steps are as
follows:

#. Select the set to act on.
#. Filter out the elements from the set.
#. Group the remaining elements.
#. Filter out groups of elements.
#. Sort the elements.
#. Get the projection of the elements' attributes.

All of this somehow translates to the SQL SELECT statement syntax we started
this discussion with:

.. code-block:: sql

    SELECT *COLUMNS*
    FROM *TABLES*
    [ WHERE *CONDITIONS* ]
    [ GROUP BY *COLUMNS*
      [ HAVING *CONDITIONS* ]
      ]
    [ ORDER BY *COLUMNS* ASC|DESC ]

References
----------

* `MySQL Manual <http://dev.mysql.com/doc/refman/5.0/en/select.html>`_

