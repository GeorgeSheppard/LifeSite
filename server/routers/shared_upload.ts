type SharedUpload = any;
// When a user is not logged in and is just trying the website, they read from a shared account on dynamo
// DB. When they make put operations we don't actually make modifications to the database but instead just
// update the query client cache. This means it is all wiped when they refresh without making changes to the database.
export const sharedUpload: SharedUpload = [];