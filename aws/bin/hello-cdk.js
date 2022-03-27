#!/usr/bin/env node

const cdk = require('@aws-cdk/core');
const { CreateS3Bucket } = require('../lib/cdk-stack');

const app = new cdk.App();
new CreateS3Bucket(app, 'MyLife');