const crypto = require('crypto')
const querystring = require('querystring')

/**
 * Validate incoming Slack request
 *
 * @param {string} slackAppSigningSecret - Slack application signing secret
 * @param {object} httpReq - Express request object
 * @param {boolean} [logging=false] - Enable logging to console
 *
 * @returns {boolean} Result of vlaidation
 */
function validateSlackRequest (slackAppSigningSecret, httpReq, logging) {
  logging = logging || false
  if (typeof logging !== 'boolean') {
    throw new Error('Invalid type for logging. Provided ' + typeof logging + ', expected boolean')
  }
  if (!slackAppSigningSecret || typeof slackAppSigningSecret !== 'string' || slackAppSigningSecret === '') {
    throw new Error('Invalid slack app signing secret')
  }
  const xSlackRequestTimeStamp = httpReq.get('X-Slack-Request-Timestamp')
  const SlackSignature = httpReq.get('X-Slack-Signature')
  const bodyPayload = querystring.stringify(httpReq.body).replace(/%20/g, '+') // Fix for #1
  if (!(xSlackRequestTimeStamp && SlackSignature && bodyPayload)) {
    if (logging) { console.log('Missing part in Slack\'s request') }
    return false
  }
  const baseString = 'v0:' + xSlackRequestTimeStamp + ':' + bodyPayload
  const hash = 'v0=' + crypto.createHmac('sha256', slackAppSigningSecret)
    .update(baseString)
    .digest('hex')

  if (logging) {
    console.log('Slack verifcation:\n Request body: ' + bodyPayload + '\n Calculated Hash: ' + hash + '\n Slack-Signature: ' + SlackSignature)
  }
  return (SlackSignature === hash)
}

module.exports = validateSlackRequest
