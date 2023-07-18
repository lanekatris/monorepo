# First Thoughts on AWS Athena
Makes querying random files rather easy. Kind of like the "T" and "L" in "ETL"...
<!--truncate-->

![](DALL-E-2022-10-22-07.31.51---athena-greek-oil-paintingdetailed-powerful-beautiful-pretty.png) 
*DALL-E: athena greek oil paintingdetailed powerful beautiful pretty*

### First Thing

> You **cannot** use normal json

Take your data and make it [JSON Line format](https://jsonlines.org/):
```Typescript
let lines = ''; 

for (const fileName of fileNames) {  
	const response = await readFile(fileName);  
	lines += `${JSON.stringify(response)}\n`;  
}  
  
fs.writeFileSync('testies.jsonl', lines);
```

Obviously this isn't performant and loads everything into memory but I have a LOT of memory 💪

I'm assuming this [npm package](https://www.npmjs.com/package/jsonlines) streams to file and is high-performing but haven't investigated

### Why Athena?

Now that I have my personal code more organized I can easily write ETL for miscellaneous data, well the `T` part of that. Why waste time on that if potentially it would be easier to query with SQL and export?

I won't get into what it is, others can elaborate: https://aws.amazon.com/athena/

### My Scenario

I always need a goal to work with something. So I wanted to take the exported EventStore data I did here and query for only the data I wanted. I could have done this in JavaScript.

So I have 10K files that look like organized like this:
```
la---          10/17/2022  9:42 AM          21096 http%3A%2F%2F100.120.122.119%3A32417%2Fstreams%2F%2524all%2F0000000002D94D2C0000000002D94D2C%2Fbackward%2F20.json
la---          10/17/2022  9:42 AM          21087 http%3A%2F%2F100.120.122.119%3A32417%2Fstreams%2F%2524all%2F0000000002D95F800000000002D95F80%2Fbackward%2F20.json
la---          10/17/2022  9:42 AM          21281 http%3A%2F%2F100.120.122.119%3A32417%2Fstreams%2F%2524all%2F0000000002D971EA0000000002D971EA%2Fbackward%2F20.json
```

With the EventStore response format in each file, I want `entries`:

```Typescript
export interface EsdbResponse {  
  title: string;  
  id: string;  
  updated: Date;  
  author: Author;  
  headOfStream: boolean;  
  links: Link[];  
  entries: Entry[];  
}

export interface Entry {  
  eventId: string;  
  eventType: string;  
  eventNumber: number;  
  data?: string;  
  streamId: string;  
  isJson: boolean;  
  isMetaData: boolean;  
  isLinkMetaData: boolean;  
  positionEventNumber: number;  
  positionStreamId: string;  
  title: string;  
  id: string;  
  updated: Date;  
  author: Author;  
  summary: string;  
  links: Link[];  
}
```

I started by testing uploading 2 of the 10K files

After getting numerous JSON parse exceptions I realized that I needed to format my files as JSONL (see above for a code snippet)

I did that locally which created a JSONL file that was 155MB and uploaded that manually to S3

After that I ran a crawler and good to go querying my data! SQL:

```SQL
select 
	"item".eventtype, 
	"item"
from
    ("default"."delete_me_athena" cross join unnest("entries") t (item))
where
    "item"."eventtype" not in ('pdga-course-cached',  '$>',
  '$metadata',
  '$ProjectionUpdated',
  '$ProjectionCreated',
  '$ProjectionsInitialized',
  '$Checkpoint',
  '$@',
  'PersistentConfig1',
  '$ProjectionCheckpoint',
  'SubscriptionCheckpoint')
limit 100
```

I haven't tried to parse my query results or download as CSV. The first part was completed though and that's what I wanted to see

### Why Choose JSONL?

I looked at [supported formats](https://docs.aws.amazon.com/athena/latest/ug/supported-serdes.html) but I wasn't familiar and wanted to get my POC working. I wanted to do [Amazon ION](https://github.com/amzn/ion-js) since it is *Amazon* and similar to JSON but I didn't know if I needed schema or not so said screw it

I investigated no other formats. It dawned on me to just create the JSONL format, it literally is so easy to do

Here is an [online formatter](https://www.convertjson.com/json-to-jsonlines.htm) to get you rolling, don't let prettier overwrite your changes though...

### Final Thoughts

#### Future Use

As I do integrations here and there I want to try Athena more. Like getting data from Feedly or downloading my Amazon order history and doing some analytics or at least transforming. By using the baked in crawlers that figure out my schema from random files I then can query against it and explore the data

I would hope we can all agree that data discovery isn't too good with just your IDE viewing a file and JavaScript

#### Similarity To Google BigQuery

I find the UI and data manipulation possibilities pretty similar. Although BigQuery isn't doing the file-based querying to my knowledge. 

#### Price

I'm not worried about price. $5/TB scanned seems OK. I'm dealing with chump files so should be good there. If this ever becomes an issue I'll do a follow up

### Some Resources

- https://aws.amazon.com/premiumsupport/knowledge-center/error-json-athena/
- https://ktree.com/process-nested-jsons-using-aws-athena.html
- https://docs.aws.amazon.com/athena/latest/ug/parsing-JSON.html
- https://www.europeclouds.com/blog/a-beginners-guide-to-athena-part-2-query-csv-json-files
- https://docs.aws.amazon.com/athena/latest/ug/flattening-arrays.html

