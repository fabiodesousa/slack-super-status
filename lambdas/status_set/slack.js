const got = require('got');

 exports.setStatus = (token, statusText) => {
  const options = {
    headers: {
      'Authorization': `Bearer ${token}`
    },
    method: 'POST',
    body: {
      'profile': {
        'status_text': exports.getStatusName(statusText),
        'status_emoji' : exports.getStatusEmoji(statusText)
      }
    },
    json: true,
  };

  return got('https://slack.com/api/users.profile.set', options);

};

exports.setSnooze = (token, statusText) => {
  if(exports.getStatusPresence(statusText) == 'away') {
    return got(`https://slack.com/api/dnd.setSnooze?token=${token}&num_minutes=${1440}`);
  }
  else {
    return got(`https://slack.com/api/dnd.endSnooze?token=${token}`);
  }
}

exports.setPresence = (token, statusText) => {
  return got(`https://slack.com/api/users.setPresence?token=${token}&presence=${exports.getStatusPresence(statusText)}`);
}

exports.getStatusName = (statusText) => {
  const statusMap = {
    'remote':'Working Remote',
    'meeting':'In a Meeting',
    'commuting': 'Commuting',
    'vacation': 'On vacation!',
    'deep%20work': `Deep work. Please don't disturb!`,
    'sick': 'Out sick:',
    'walking': 'Going for a walk',
    'lunch': 'Having lunch!',
    'offline': 'I am not online right now'
  }
  if(statusText in statusMap) {
    return statusMap[statusText];
  }
  return statusText;
}

exports.getStatusPresence = (statusText) => {
  const statusMap = {
    'remote':'auto',
    'meeting':'away',
    'commuting': 'away',
    'vacation': 'away',
    'deep%20work': `away`,
    'sick': 'away',
    'walking': 'away',
    'lunch': 'away',
    'offline': 'away'
  }
  if(statusText in statusMap) {
    return statusMap[statusText];
  }
  return statusText;
}

exports.getStatusEmoji = (statusText) => {
  const statusMap = {
    'remote':':house_with_garden:',
    'meeting':':calendar:',
    'commuting': ':train:',
    'vacation': ':palm_tree:',
    'deep%20work': ':hear_no_evil:',
    'lunch': ':bento:',
    'sick': ':mask:',
    'walking': ':walking:',
    'offline': ':x:'
  }
  if(statusText in statusMap) {
    return statusMap[statusText];
  }
  return ':simple_smile:';
}

exports.makeResponse = (statusCode, result) => {
  const response = {
    statusCode: statusCode,
    body: JSON.stringify(result)
  };
  return response;
}