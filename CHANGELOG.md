v3.1.1
======

 - Fix a bit of problems with user settings of management frontend

------

v3.1.0
======

 - Many minor usability improvements  
    This mostly means help text on empty states (like there was for deleted
    changes) for basically every possible empty state in management.

 - Rewrite all management frontend into Backbone.js  
    I finally got tired of how bloated the frontend was for what it was meant
    to accomplish. This also helped me learn more about Backbone and how it
    works. Also the management frontend is now lighter. Win-win!  
    Also this marks the first release to be done on Gitlab instead of Github.
    There are many reasons which I won't recite, but a mirror will remain on
    Github for the foreseeable future.

------

v3.0.1
======

 - Fix a XSS vulnerability in the JSON parser  
    See this for more details: https://mathiasbynens.be/notes/etago
    Basically, browsers interpret </script anywhere within the <script> content,
    therefore a malicious party could exploit the data passing used in this
    version, since the json module doesn't escape braces. SimpleJSON does, so
    I switched to that.

------

v3.0.0
======

 - Major management frontend rewrite  
    Here I went and basically threw everything away and recreated it from
    scratch! Now the backend is not managed by React Router anymore and that
    helps to get rid of some bloat.  
    This took a lot of time to do, and more can be seen in PR 32.

 - Introduce a public API  
    Now all that can have read access to the website can get the data in a
    structured JSON format as well! It's not yet documented, however you can
    take a look at the code.  
    The same API is used by the management frontend (which requires admin auth).

 - A lot of codebase cleanup and bug fixes  
    (including, but not limited to, finally fixing the ISO8601 validation)

------

v2.0.3
======

 - Mostly minor frontend improvements

------

v2.0.2
======

 - Fix underscores not being accepted as valid URI parts (#29)

 - Other minor improvements

------

v2.0.1
======

 - Fix dates not being saved when editing

 - Fix date rendering

 - Minor interface improvements

------

v2.0.0
======

 - Management frontend rewrite (into React)

 - Enable frontend CI testing

 - Rewrite everything from Flask to webapp2

 - Abandon custom auth system and instead rely on Google accounts

------

v1.1.4
======

 - Add button to purge old changes

 - Fix date handling with bad input

------

v1.1.3
======

 - Bunch of frontend and localization updates

 - Fix multi mode

------

v1.1.2
======

 - Add multi mode

------

v1.1.1
======

 - Fix change creation (#20)

------

v1.1.0
======

 - Add password changing interface

 - Add one-time-setup

 - Add user creation interface

------

v1.0.4
======

 - Add RSS feeds for changes

 - Add filtering by class

------

v1.0.3
======

 - Minor interface improvements

------

v1.0.2
======

 - Minor interface improvements

------

v1.0.1
======

 - Minor interface improvements

------

v1.0.0
======

 - Initial release
