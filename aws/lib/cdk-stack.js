const core = require('@aws-cdk/core');
const s3 = require('@aws-cdk/aws-s3');

class CreateS3Bucket extends core.Stack {
  constructor(scope, id, props) {
    super(scope, id, props);

    new s3.Bucket(this, 'MyLifeBucket', {
      versioned: true,
      removalPolicy: core.RemovalPolicy.DESTROY,
      accessControl: 'Private',
      publicReadAccess: false,
      cors: [
        {
          allowedHeaders: ['*'],
          allowedMethods: ['POST'],
          allowedOrigins: ['*'],
        },
      ],
    });
  }
}

module.exports = { CreateS3Bucket };