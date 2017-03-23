---
title: Teaching: Introductory C++ Programming
tags: tutor, computer science, students, programming, c-plus-plus, object-oriented programming, oop, functions, control structures, keywords, factorial, makefiles, header files, source files, compiling, array, structs, api, advanced programming interface, alice, education, java, c-sharp
---

It's strange that I'm the only tutor for our Computer Science and Information
Systems department, but I can live with that.  What irks me though, is how
these students come to gain their knowledge about programming.

To be fair, I will not mention names or place blame.  I truly believe this to
be a simple matter of miscommunication and easily solved.  I also feel that
the scope of these classes needs to be monitored a little more closely and
what follows is my proposal for what should be taught in an introductory
programming course contrasted with my understanding of what is currently being
taught in our introductory courses.

The courses in question are our first introductory classes to C++ (101 and
201).  These courses together should leave the student comfortable with the
basic constructs and built-ins of C++.  It should also make them comfortable
with classes and working in an object oriented programming (OOP) paradigm.
The problem crops up in the transition between these two courses.  It seems
(and this I know thanks to my tutees) that their understanding of the basics
gets muddled in the first course, and thus they cannot build upon this
knowledge in the second course.  I have heard many things about what may be
happening wrong in this course to cause such a calamity, but let us refocus
and start by going over what should be covered in the first class in order to
succeed in the following course and program.

In an introductory programming course it should be important for students to
become familiar with functions, control structures, and various keywords (not
all of them mind you, just most of them).  Thus they should be comfortable
looking through a piece of code like the following and have an understanding
of the majority of it:

.. code-block:: c++

    #include <iostream>
    #include <cstdlib>
    
    using namespace std;

    int factorial(int n)
    {
        if (n == 0)
            return 1;
        return n * factorial(n - 1);
    }

    int main(int argc, char *argv[])
    {
        if (argc != 2)
        {
            cerr << "You must pass a number to get the factorials!" << endl;
            return EXIT_FAILURE;
        }

        int n = argv[1] + 1;

        while (--n, n > 0)
            cout << "The factorial of " << n << " is " << factorial(n) << "." << endl;

        return EXIT_SUCCESS;
    }

The students should also be able to understand Makefiles (rudimentary
Makefiles not automake or anything of its ilk), header files versus source
files, the stages of compiling and how to deal with different errors in each
(i.e. a linking error versus a compilation error), and they should understand
array mechanics (if not exactly what they are then how to use them).  They
should be able to put all of this together, and make a nice modular program
that allows them to expand and reuse code in an intelligent way.  Then if
there is time (although this gets covered in great detail in the secod
course) a quick coverage of structs should ensue.  At this point the eduction
they should have gained from the first class should be enough of the basics
that they understand the constructs of the language and can start reading
simple programs like the one above.

In reality, this goal (mind you this is my personal goal and does not reflect
the goals of the professors or the department) was not met, and based on
experience with people I'm tutoring who are in the second course at this time,
it is quite obvious where their shortcomings are.  Those shortcomings are
outlined below:

* Lack of understanding as to how looping control structures function
* Lack of knowledge as to how arrays function and how to use them
* Lack of knowledge as to how the compiler actually takes the source code
  (possibly spread over many files) and makes an executable
* Lack of understanding as to how to solve simple problems like manipulating
  all of the entries in an array
* Lack of understanding as to how to do a simple search or utilize functions
  provided in an advanced programming interface (API)

.. note::

    This list will be updated appropriately as I gain more knowledge on what
    the students actually know.  Thus, this list may have inaccuracies and
    shortcomings and may not reflect reality.

The list goes on in much the same fashion here after, and this is obviously a
product of the course not fulfilling its primary purpose of laying down a
foundation that the students can build on.  To better acheive this goal it may
be necessary to recommend some supplemental texts (see the list at the end of
this article for recommended books for the various programming courses).

Now, what I've heard reports of in this class is the following:

#. The concepts outlined above are not getting covered in the detail taht is
   required of them in the subsequent classes (which only confirms what I've
   observed in students)
#. There has been a report that a new teaching tool, `Alice
   <http://www.alice.org/>`_ , was used in the introduction course

The first point appears to just be a shortcoming of the class and could be
ameliorated by spending more time going over more examples of the concepts in
question.

Also, the students themselves need to realize that they can control their
education and must participate for a class to truly be successful for them.
When entering a class, students should think to themselves, "What do I want
from this class and how can I have this class help me achieve that goal?"  By
asking questions and looking for more material on the specific area of study
the student is interested in, they can get a much more fulfilling experience
and better understanding of the topics involved, but they may hit a point
where they just can't keep up with the course and need further assistance that
isn't self-guided.  Tutors are available from the tutoring department, and
should not be shied away from.  If a student really wants to learn the
material, they have to be willing to get help and help themself towards that
goal.  That's only part of the problem, students who do try are still having a
hard time within the status quo.

The second point requires that I do not put forth my personal opinion, but
does require that I state its purpose (from the `Alice
<http://www.alice.org/>`_ website):

::

    Alice is an innovative 3-D programming environment that makes it easy to
    create an animation for telling a story, playing an interactive game, or a
    video to share on the web.  Alice is a freely available teaching tool
    designed to be a student's first exposure to object-oriented programming.
    It allows students to learn fundamental programming concepts in the
    context of creating animated movies and simple video games.  In Alice, 3-D
    objects (e.g., people, animals, and vehicles) populate a virtual world and
    students create a program to animate the objects.

    In Alice's interactive interface, students drag and drop graphic tiles to
    create a program, where the instructions correspond to standard statements
    in a production oreinted programming language, such as Java, C++, and C#.
    Alice allows students to immediately see how their animation programs run,
    enabling them to easily understand the relationship between the
    programming statements and the behavior of objects in their animation.  By
    manipulating the objects in their virtual world, students gain experience
    with all the programming constructs typically taught in an introductory
    programming course.

In conclusion, it is my perception that there is a missing communication link
in the way these courses are handled, but it's not just between the professors
of the two courses (they seem to hot a smooth break between the courses), it's
between the students and the professors that the communication has really
broken down.  The students must speak up for their education or they may see
it going down a path that does not maximally further their education.  This is
wider spread than just the simple course example I've given here.  Almost
everywhere one looks, it seems that students are becoming more lethargic;
pushing to just get through the courses.  There is a lack of genuine interest
in the education being provided, and more of a view that college is now a
necessity to continue in society.  Fortunately, we can still fight for the
freedom of our minds.

Supplemental Texts for CSIS Courses
-----------------------------------

:CSIS 152:
  * `C++ in Plain English 
    <http://www.amazon.com/C%2B%2B-Plain-English-Brian-Overland/dp/0764535455/ref=pd_bbs_sr_1?ie=UTF8&amp;s=books&amp;qid=1207338570&amp;sr=8-1>`_
    by Brian Overland
:CSIS 252:
  * `C++ in Plain English 
    <http://www.amazon.com/C%2B%2B-Plain-English-Brian-Overland/dp/0764535455/ref=pd_bbs_sr_1?ie=UTF8&amp;s=books&amp;qid=1207338570&amp;sr=8-1>`_
    by Brian Overland
:CSIS 352:
  * `C++ in Plain English 
    <http://www.amazon.com/C%2B%2B-Plain-English-Brian-Overland/dp/0764535455/ref=pd_bbs_sr_1?ie=UTF8&amp;s=books&amp;qid=1207338570&amp;sr=8-1>`_
    by Brian Overland
  * `Beyond the C++ Standard Library: An Introduction to Boost
    <http://www.amazon.com/Beyond-C%2B%2B-Standard-Library-Introduction/dp/0321133544/ref=sr_1_3?ie=UTF8&amp;s=books&amp;qid=1207338678&amp;sr=1-3>`_
    by Björn Karlsson
  * `C++ Coding Standards: 101 Rules, Guidelines, and Best Practices
    <http://www.amazon.com/C%2B%2B-Coding-Standards-Guidelines-Depth/dp/0321113586/ref=pd_bbs_sr_1?ie=UTF8&amp;s=books&amp;qid=1207338781&amp;sr=1-1>`_
    by Herb Sutter & Andrei Alexandrescu
  * `Design Patterns: Elements of Reusable Object-Oriented Software
    <http://www.amazon.com/Design-Patterns-Object-Oriented-Addison-Wesley-Professional/dp/0201633612/ref=pd_bbs_sr_1?ie=UTF8&amp;s=books&amp;qid=1208386350&amp;sr=8-1>`_
    by Erich Gamma, Richard Helm, Ralph Johnson & John M. Vlissides

