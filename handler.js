'use strict';
const got = require('got');

module.exports.index = (event, context, callback) => {
  const token = event.pathParameters.token;
  const statusText = event.pathParameters.status;
  console.log(statusText, token);
  setStatus(token, statusText)
  .then((result) => {
    console.log(result.body);
    callback(null, makeResponse(result.statusCode, result.body));
  })
  .catch((error) => {
    console.log(error);
    callback(null, makeResponse(400, error));
  })
};

function setStatus(token, statusText) {
  const options = {
    headers: {
      'Authorization': `Bearer ${token}`
    },
    method: 'POST',
    body: {
      'profile': {
        'status_text': getStatusName(statusText),
        'status_emoji' : getStatusEmoji(statusText)
      }
    },
    json: true,
  };

  return got('https://slack.com/api/users.profile.set', options);

};

function getStatusName(statusText) {
  const statusMap = {
    'remote':'Working Remote',
    'meeting':'In a Meeting',
    'commuting': 'Commuting',
    'vacation': 'On vacation!',
    'deep%20work': `Deep work. Please don't disturb!`,
    'sick': ':mask:'
  }
  if(statusText in statusMap) {
    return statusMap[statusText];
  }
  return statusText;
}

function getStatusEmoji(statusText) {
  const statusMap = {
    'remote':':house_with_garden:',
    'meeting':':calendar:',
    'commuting': ':train:',
    'vacation': ':palm_tree:',
    'deep%20work': ':hear_no_evil:',
    'lunch': ':bento:'
  }
  if(statusText in statusMap) {
    return statusMap[statusText];
  }
  return ':simple_smile:';
}

function makeResponse(statusCode, result) {
  const response = {
    statusCode: statusCode,
    body: JSON.stringify(result)
  };
  return response;
}