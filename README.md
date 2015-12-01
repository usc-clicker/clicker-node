# USC Clicker Node app

Requires Node.js v4.2.x

Clone this repo, then run `npm install`

Start the app with `sails lift` or `node app.js`

## Architecture Overview

Clicker uses [Sails.js](http://sailsjs.org/), a MVC framework for Node.js.  It's backed by the [Express](http://expressjs.com/) web framework.

Models are located in `api/models`, and controllers are located in `api/controllers`.

For more details on Sails, consult the documentation at http://sailsjs.org/documentation/concepts.

The front-end is currently built with [Material Design Lite](http://www.getmdl.io/), [jQuery](https://jquery.com/), and [Handlebars](http://handlebarsjs.com/) for client-side templating. The ejs pages that are rendered by the Sails templating engine are located in `views.` CSS stylesheets and other assets are located in `assets.`

## Development and Production Environments

There are several differences to be aware of when running the node app locally for development purposes and in production.

When running **locally**, make sure that the database connection in `config/env/development.js` is commented out. This will ensure that Sails uses a local disk database and doesn't try to connect to the production MySQL database.

When running in the **production environment** (on the server) **_without critical user data, while making changes to database schema_**, Sails still must be run in a `development` mode to allow database migration to occur. In this case, the database connection in `config/env/development.js` should be uncommented so that Sails uses the production MySQL database, but allows database migration to occur (Sails automatically updates the MySQL database schema to reflect changes made in the modules).

When running in a **production environment _with real user data, when the database schema is stable_**, Sails should be run in production mode by running the command `sails lift --prod`. Since this is currently not the configuration being used since the schema has continued to evolve during development, the cron task that launches the node app with `forever` should be updated accordingly to include the `--prod` flag.  To do this, run `crontab -e` while logged into the server over SSH as user `csci477`.

For more details on Sails migration, refer to the Sails documentation: http://sailsjs.org/documentation/concepts/models-and-orm/model-settings

## Production Environment Details

The node app is currently deployed to a server managed by CSCI 401 course staff.  For more details and SSH login credentials, contact the instructor.

A few notes on the current configuration:

* [forever](https://github.com/foreverjs/forever) is used to manage the node app on the server. This is a tool that automatically restarts node applications when they crash, to ensure the server keeps running. 
* The node app runs on port 1337 in all configurations (development and production). On the production server, an `iptables` entry forwards port 80 to port 1337.  For more details on this, see this Stack Overflow post http://stackoverflow.com/a/16573737/1798556
* To view logs, SSH into the server and type `forever list.` This will display the currently running node application(s) along with their corresponding log files, which you can `cat`, `tail`, etc. as needed
* The server is configured to automatically start the Clicker node app with `forever` on startup via a cron task.

## Deploying to Production

The server has a git remote set up with a `post-receive` script that automatically runs `npm-install` and `forever restartall`, so all you need to do is push to this remote, and the server will update itself and restart automatically.

To add this git remote, enter `git remote add prod csci477@fontify.usc.edu/home/csci477/clicker-node.git` from your local copy of the repository. 

When you are ready to deploy to production, ensure that the database configurations in `config/env` are correct, and then run `git push prod`. For login credentials, contact the instructor.

# API

Base url: `http://fontify.usc.edu`

###Auth

`POST /auth/register`

Return `200` if account creation successful; `403` if registration failed (email already in use, password does not meet requirements, etc)

#####Parameters

<table>
    <thead>
        <tr>
            <th>Name</th>
            <th>Required?</th>
            <th width="50">Type</th>
            <th width=100%>Description</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td><code>email</code></td>
            <td>yes</td>
            <td>string</td>
            <td>Email address of the user.</td>
        </tr>
        <tr>
            <td><code>password</code></td>
            <td>yes</td>
            <td>password</td>
            <td>Password of the user. </td>
        </tr>
        <tr>
            <td><code>usc_id</code></td>
            <td>yes</td>
            <td>integer</td>
            <td>USC student id</td>
        </tr>
    </tbody>
</table>

`POST /auth/login`

Returns `200` if login successful; `403` if email or password is invalid

#####Parameters

<table>
    <thead>
        <tr>
            <th>Name</th>
            <th>Required?</th>
            <th width="50">Type</th>
            <th width=100%>Description</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td><code>email</code></td>
            <td>yes</td>
            <td>string</td>
            <td>Email address of the user. If the email does not exist, a `403` will be returned.</td>
        </tr>
        <tr>
            <td><code>password</code></td>
            <td>yes</td>
            <td>password</td>
            <td>Password of the user.  If the password is incorrect, a `403` will be returned.</td>
        </tr>
    </tbody>
</table>

###User

`POST /user/enroll`

#####Parameters

<table>
    <thead>
        <tr>
            <th>Name</th>
            <th>Required?</th>
            <th width="50">Type</th>
            <th width=100%>Description</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td><code>user</code></td>
            <td>yes</td>
            <td>string</td>
            <td>User email</td>
        </tr>
        <tr>
            <td><code>section_id</code></td>
            <td>yes</td>
            <td>integer</td>
            <td>Section ID of the section to be enrolled in</td>
        </tr>
    </tbody>
</table>

`POST /user/unenroll`

#####Parameters

<table>
    <thead>
        <tr>
            <th>Name</th>
            <th>Required?</th>
            <th width="50">Type</th>
            <th width=100%>Description</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td><code>user</code></td>
            <td>yes</td>
            <td>string</td>
            <td>User email</td>
        </tr>
        <tr>
            <td><code>section_id</code></td>
            <td>yes</td>
            <td>integer</td>
            <td>Section ID of the section to be unenrolled from</td>
        </tr>
    </tbody>
</table>

`GET /user/classes`

#####Parameters

<table>
    <thead>
        <tr>
            <th>Name</th>
            <th>Required?</th>
            <th width="50">Type</th>
            <th width=100%>Description</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td><code>user</code></td>
            <td>yes</td>
            <td>string</td>
            <td>User email</td>
        </tr>
    </tbody>
</table>

`GET /user/stats`

#####Parameters

<table>
    <thead>
        <tr>
            <th>Name</th>
            <th>Required?</th>
            <th width="50">Type</th>
            <th width=100%>Description</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td><code>user</code></td>
            <td>yes</td>
            <td>string</td>
            <td>Email address of user</td>
        </tr>
        <tr>
            <td><code>section_id</code></td>
            <td>optional</td>
            <td>integer</td>
            <td>Section ID to return stats for; if ommitted, stats for all quizzes will be returned.</td>
        </tr>
    </tbody>
</table>

###Question

`POST /question/ask`

#####Parameters

<table>
    <thead>
        <tr>
            <th>Name</th>
            <th>Required?</th>
            <th width="50">Type</th>
            <th width=100%>Description</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td><code>id</code></td>
            <td>yes</td>
            <td>integer</td>
            <td>Question ID</td>
        </tr>
    </tbody>
</table>

###Class

`GET /class`

<table>
    <thead>
        <tr>
            <th>Name</th>
            <th>Required?</th>
            <th width="50">Type</th>
            <th width=100%>Description</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td><code>id</code></td>
            <td>optional</td>
            <td>integer</td>
            <td>ID of class; omitting this will return all classes</td>
        </tr>
    </tbody>
</table>

###Section

`GET /section`

<table>
    <thead>
        <tr>
            <th>Name</th>
            <th>Required?</th>
            <th width="50">Type</th>
            <th width=100%>Description</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td><code>id</code></td>
            <td>optional</td>
            <td>integer</td>
            <td>ID of session; omitting this will return all classes.  Please note that we are using session IDs as Parse Channels.</td>
        </tr>
    </tbody>
</table>
