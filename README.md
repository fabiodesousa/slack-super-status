# slack-super-status
Update your Slack status via Google Assistant

## overview
This is a very simple little slack integration that uses IFTTT and AWS Lambda to change Slack status via Google Assistant.
- IFTTT handles Google Assistant input such as, "Hey Google, change my status to lunch"
- IFTTT parses the status parameter and sends that to the Lambda function via API Gateway
- The Lambda function checks against a hardcoded map to see if there's an associated emoji with the status
- The Lambda function makes a request to the Slack API

## Updates
**March 22, 2018:**
- Added more statuses
- Updating status will also update presence (away vs auto)
- Updating status will also set snooze if applicable (e.g. if Offline, snooze notifications)

## TODO
- Make the status maps into an object
- Don't hardcode that information