# Learning Tid Bits September 2022

`HttpClient` baseurl ending slash and relative URL: https://stackoverflow.com/questions/23438416/why-is-httpclient-baseaddress-not-working

Didn't use a sql `between` but did an `.addDays(1)` and just doing `date < endDate`: https://www.sqlitetutorial.net/sqlite-between/

View EF generated SQL: `query.ToQueryString()`: https://stackoverflow.com/questions/37527783/get-sql-code-from-an-entity-framework-core-iqueryablet

Querying Dyanmo db with reserved keywords and filtering by boolean values: https://stackoverflow.com/questions/40461910/aws-dynamodb-query-not-filtering-on-bool-value and AWS docs on special characters	
https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Expressions.ExpressionAttributeNames.html#Expressions.ExpressionAttributeNames.ReservedWords

When querying Dynamodb you need to include the primary key  unless you use global secondary indexes: https://stackoverflow.com/questions/47681108/query-condition-missed-key-schema-element-validation-error

Of course you can view your next.js cloud function logs on netlify: https://www.netlify.com/blog/2020/12/13/logging-in-next.js/ (for things like when you forget to include requried valuels for `next-auth` to work correctly)

Next.js `next-auth` is so easy to get working with Auth0 since I already had a Auth0 project ready to roll: https://github.com/nextauthjs/next-auth-example 

I wanted to host a site on netlify but then have Cloudflare zero trust login in front of it. If a user directly navigates to the Netlify site they could get around it. I didn't see an easy way to get around this so decided to go with next-auth.

If you get 403s GET'ing your API Gateway routes be sure you don't have anything in the body of your request. I had copied a request in Insomnia and it freaks out Api Gateway. This took quite a while to figure out: https://stackoverflow.com/questions/46351920/cloud-front-the-request-could-not-be-satisfied