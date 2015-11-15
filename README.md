# USC Clicker Node app

Requires Node.js v4.2.x

Clone this repo, then run `npm install`

Start the app with `sails lift` or `node app.js`


## API

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
            <td><code>student_id</code></td>
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