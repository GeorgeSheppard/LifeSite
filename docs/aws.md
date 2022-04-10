1. Create a new IAM role with permissions for `AWSCloudFormationFullAccess` and `AmazonS3FullAccess`. In this case I created a user inside a group with the policies attached.

2. Install [AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html)

3. Run aws configure passing in access key id and secret access key from the role.

4. Run `cdk deploy`

5. Visit the deployed bucket and copy the name and region into `.env.local`

6. Add the bucket domain into `next.config.js`

Note: If you ever get in a bad state (can happen if you manually delete a resource) then use `npx cdk destroy`
You can look in `CloudFormation` to see what is there.