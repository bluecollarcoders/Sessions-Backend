# Sessions-Backend Api

This is the Backend Api for the Sessions App. The app allows a user/singer or rapper to post a project and a proposal can be made by by a producer for said project. 

# Methods 

# users 

* get "users/" = requires login. Retrieves list of all users.
* get "users/id" = requires correct users login credentials. Retrieves information on specific user.
* post "users/" = Adds a new user. Expects the following data. username, password, first_name, last_name, email.
* patch "users/:id = requires correct users login information. Allows user to update profile
* delete "users/:id" requires correct users login. 

# projects

* get "projects/" = requires nothing anyone can look a projects, which is a list of projects posted by users

* get "projects/:id" = requires nothing anyone can look a projects, which is a specific project obtained by the id.

* post "projects/" = requires login from user to post a project.

* delete "projects/:id = requires login from user to delete a project.

* update "projects/:id = requires login from user to update a project.

* post "projects/:id/proposals = require nothing, anyone can make a proposal.

 

