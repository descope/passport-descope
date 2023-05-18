# <a title="Descope passport strategy" href="https://passportjs.org/"><img width="64" alt="WordPress blue logo" src="https://images.ctfassets.net/vwq10xzbe6iz/tnwT7PN9aBmT7vgkTtGhV/940f001eb249a42904cd40e64d13c7e9/passportJS-300x300.png"></a> Strategy by Descope

[![License](https://img.shields.io/:license-MIT-blue.svg?style=flat)](https://opensource.org/licenses/MIT)


## Overview
This strategy is designed to help manage authentication and sessions in your express-based applications. This strategy authenticates users by validating the JWT in either Authorization Bearer or cookie, and provides additional user management features.

## Getting started

### Requirements

- [Node 12.0.0+](https://nodejs.org/en)

### Installation

The Descope Passport strategy can be installed with npm. 

```
npm i passport-descope
```

## Using the Strategy

In order to utilize the authentication functions, you will need to initialize a `DescopeStrategy` object. You will need to define a retrieve your Descope Project ID and define a verify callback function to be able to authenticate using the `DescopeStrategy` object,

```
var DescopeStrategy = require('passport-descope');

passport.use(new DescopeStrategy({
  projectId: '<Your project ID>',
  managementKey: '<OPTIONAL management key>'
  verify: (jwtDetails, cb) => cb(null, {id: jwtDetails.token.sub})
}));
```

**Required**

1. `projectId` - The project ID you can retrieve from the Descope Console [here](https://app.descope.com/settings/project).

2. `verify` - The verify function is specific to the `passport-descope` strategy, and the exact argument it receives `(jwtDetails, cb)` and the parameter it yields `{id: jwtDetails.token.sub}` is dependent on our Descope authentication strategy.

**Optional**

3. `managementKey` - If you would like to also return user information as part of the verifyCallback function, you will need to include a Descope Management Key when you initialize your `DescopeStrategy` object. You can create one in the Company Settings portal [here](https://app.descope.com/settings/company/settings).

---

If you would like to learn more about Passport JS Strategies, please visit their [website](https://www.passportjs.org/concepts/authentication/strategies/).

## Code Samples

- [TODO List Sample App](https://github.com/descope-sample-apps/passportjs_sample)

## Feedback

### Contributing

We appreciate feedback and contribution to this repository!

### Raise an issue

To provide feedback or report a bug, please [raise an issue on our issue tracker](https://github.com/descope/passport-descope/issues).


This project is licensed under the MIT license. See the <a href="./LICENSE"> LICENSE</a> file for more info.</p>