# S3 to DynamoDB

Currently all user data is stored in S3 with one json per user. This was primarily for speed of development.

Drawbacks:

- Each time a recipe is mutated, the modified json is sent to S3, AKA changing one instruction in one recipe causes a json representing the entire user state to be sent to S3. The S3 bucket is versioned so changing one minor attribute causes a duplicate of the entire user state to be stored...
- Shared recipes are not possible without sharing the entire user profile
- Makes initial load visibly slow, all user data is requested at once
- Makes mutation speed slower, because we have to send the entire user data

This document is to document my thoughts on how a DynamoDB migration would work.

The queries DynamoDB needs to facilitate are the following:

- Fetch recipes for a user
- Fetch 3D prints for a user
- Fetch meal plan for a user
- Fetch a recipe from another user

This is a very simple use case, and we can split the parts of the user state into many records prefixed with the user id.

AWS documentation talks about the main factor that slows down a query is the difference in physical location between all the data. Given that fetching a recipe from another user will be rare it is best to keep all user information together. For this reason the partition key will be the user id, and the sort key will be a string prefix + the id of the item to find. e.g. `R-<recipe-id>`, `MP`, `P-<print-id>`. This should co-locate the data and mean we can search for recipes for a user on the partition key then sorting via the `R` prefix.