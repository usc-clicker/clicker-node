# USC Clicker Node app

Requires Node.js v4.1.0

Clone this repo, then run `npm install`

Start the app with `sails lift` or `node app.js`


## API

Base url: `http://fontify.usc.edu`

###AUTH

`POST /auth/login`

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
            <td>integer</td>
            <td>Email address of the user. If the email does not exist, a new account will be created with this email and password.</td>
        </tr>
        <tr>
            <td><code>password</code></td>
            <td>yes</td>
            <td>password</td>
            <td>Password of the user.  If the email does not exist, a new account will be created with this email and password.</td>
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
            <td><code>id</code></td>
            <td>yes</td>
            <td>integer</td>
            <td>ID of the class to be enrolled in</td>
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

###Auth
