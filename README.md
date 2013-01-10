QuestionBuilder
===============

Excerpt of some in-progress JavaScript code from the BYU Learning Suite. Illustrates the use of Backbone, Handlebars, and RequireJS that I worked to introduce. 

The Question Builder is an interface for instructors to create online exam and quiz questions. I have been refactoring our current implementation using the new JavaScript frameworks we have introduced.

#####A short explanation of the repository
* Screenshots/: Some screenshots of the UI I was generating
* drivers/: Modules in here serve as the initialization point for the Backbone modules. Driver files provide the API for creating and using components of the page.
* models/: Modules containing the Backbone Models and Collections. Questions have multiple types which we represent with different classes.
* views/: Backbone view modules are stored here. Views are broken down into subviews to keep the modules as small and simple as possible.
* templates/: Handlebars templates are stored in here.
