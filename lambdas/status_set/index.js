const slack = require('./slack');

exports.handler = async (event) => {
  const token = event.pathParameters.token;
  const statusText = event.pathParameters.status;
  try {
    const statusResult = await slack.setStatus(token, statusText);
    const snoozeResult = await slack.setSnooze(token, statusText);
    const presenceResult = await slack.setPresence(token, statusText);
    return slack.makeResponse(presenceResult.statusCode, presenceResult.body);
  }
  catch(error) {
    return slack.makeResponse(400, error);
  }
}
