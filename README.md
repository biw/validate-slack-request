[![Build Status](https://travis-ci.org/gverni/validate-slack-request.svg?branch=master)](https://travis-ci.org/gverni/validate-slack-request) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

# validate-slack-request

A simple module to validate Slack requests based on [this article](https://api.slack.com/docs/verifying-requests-from-slack). The module requires a valid expressJS request object as defined [here](https://expressjs.com/en/api.html#reqhttps://expressjs.com/en/api.html#req). See more about that in the [API section](#api)

Disclaimer: this module is not developed nor endorsed by Slack 

# Installation 

To install use: 

```$ npm install validate-slack-request```

Since Slack is sending requests using a POST with `application/x-www-form-urlencoded` encoded payload, the `express.urlencoded` module needs to be enabled in Express in order to parse the POST payload. To enable it, add the following to your main express script (e.g. `app.js` or `server.js`)

```javascript
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
```

# API 

```validateSlackRequest (slackAppSigningSecret, httpReq, logging)```

Where:
* `slackAppSigningSecret`: this is the Slack Signing Secret assigned to the app when created. This can be accessed from the Slack app settings under "Basic Information". Look for "Signing secret". 
* `httpReq`: Express request object as defined [here](https://expressjs.com/en/api.html#reqhttps://expressjs.com/en/api.html#req). If this module is used outside Express, make sure that `httpreq` exposes the following: 
  * `get()`: used to retrieve HTTP request headers (e.g. `httpReq.get('Content-Type')`)
  * `.body` : JSON object representing the body of the HTTP POST request.
* `logging`: Optional parameter (default value is `false`) to print log information to console. 

# Example

In express it can be added to your route using: 

```
const slackValidateRequest = require('validate-slack-request')

... 

router.post('/', function (req, res, next) {
  if (validateSlackRequest(process.env.SLACK_APP_SIGNING_SECRET, req)) {
    // Valid request - Send appropriate response 
    res.send(...)
  }
  ...
}
```
    
Above example assumes that the signing secret is stored in environment variable `SLACK_APP_SIGNING_SECRET` (hardcoding of this variable is not advised) 

# Errors 

Following errors are thrown when invalid arguments are passed: 

* `Invalid slack app signing secret`: this error is thrown when the slack app signing secret (`slackAppSigningSecret`) is not a non-empty string. There is no check on actual validity of the app secret 
* `Invalid type for logging. Provided ..., expected boolean`: this error is thrown when `logging` argument is not a boolean 
