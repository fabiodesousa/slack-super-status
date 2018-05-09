#!/bin/bash

# Script parameters and default values.
lambdapath="$(pwd)/lambdas/*";
stackname=${1:-slack};
region=${2:-us-east-1};
profile=${3:-default};
stage=${4:-dev};
commitInfo=`git log -1 --pretty=%B%h%n%cn`;
#echo $profile;

# Initialize the account
unset AWS_ACCESS_KEY_ID;
unset AWS_SECRET_ACCESS_KEY;
unset AWS_SESSION_TOKEN;
export AWS_PROFILE=$profile

#$(pwd)/lambdas/* -depth 1 -type d;
for D in `find ./lambdas -depth 1 -type d`;
  do 
    pushd $D;
    npm install;
    node node_modules/.bin/mocha -R json-stream > ./test/report;
    if grep -q "\"fail\"" ./test/report
    then
      echo "tests failed in $D, aborting"
      exit 1
    fi
    rm -rf node_modules;
    npm install --production;
    popd;
  done

pwd;

s3bucket=slack-deployment;

aws cloudformation package \
  --template-file $(pwd)/cloudformation/template.yml \
  --output-template-file $(pwd)/cloudformation/serverless-output.yml \
  --s3-bucket $s3bucket \
  --region $region;

aws cloudformation deploy \
  --template-file $(pwd)/cloudformation/serverless-output.yml \
  --stack-name $stackname \
  --capabilities CAPABILITY_IAM \
  --parameter-overrides AppName=$stackname StageName=$stage \
  --region $region;
  