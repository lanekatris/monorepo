# Choosing Planetscale

I'm changing my database once again for personal projects...
<!--truncate-->

![](https://ik.imagekit.io/lkat/blog/tr:h-0.5/DALL_E_2022-10-25_05.29.47_-_planets_space_cosmos_connected_network_vast_detailed__Rs6WfLmHs.png?ik-sdk-version=javascript-1.4.3&updatedAt=1666690208807)

*DALL-E: planets space cosmos connected network vast detailed*

## Background

:::note  
  
These choices are for **personal projects** that could potentially be used by other users  
  
:::

As I've been playing around with various databases for various use cases I've circled all the way around to a relational database 🤷‍♂️

**I wanted**:
- Cloud hosted
- Cheap / free
- Easy connectivity primarily for DataGrip
- Different query pattern support

It can take a lot of effort for CRUD. Well it's more mundane work. Oh you have an idea, now you need queries at the least. What infrastructure will host that? Something abstracted like Prisma or AppSync? Kubernetes hosted Node app? Cloud function calling DyanmoDB?

**Different query pattern support** 

I don't want to bastardize anything, I know if I want *search* that ElasticSearch or Algolia is best at doing that. Do I even need search? I'm not at scale and I can do search with a relational database. I can always iterate. **KISS**

**DataGrip**

Almost deserves a dedicated discussion. Can connect to everything. JetBrains key bindings. CSV's. Export. Load. If DataGrip can connect to it your app can. If you can't tell, I enjoy using it. Might as well get cell editing in a database instead of another hop with Excel and exporting and importing CSV into a database


### ESDB

I [migrated away](./2022-10-17-spinning-down-lightsail-instance.md) from a Lightsail instance running [ESDB](https://www.eventstore.com/). I even was paying for [ESDB Cloud](https://www.eventstore.com/event-store-cloud) for a while because I wanted to go all in

I dropped that because I could get a Lightsail instance for the same price $20~ so why not use Lightsail to run the database and my applications?

I love the concept of Event Sourcing and I wanted to force myself to use it by using ESDB and I feel I did that. So goal achieved 👍

Although, the data that I wanted was feeds, search, and creating state from events. All this is great but it takes effort to do. Too much effort for the projects that I wanted to rapidly bang out. Since I was hosting the DB in lightsail I accessed it over TailScale TODO which worked great but it was a bit slow. That was because I had a shit ton of events in my streams. I wasn't following the 

> many short streams 

best practice.

I was keeping all change events in one stream and constructed state from that. So my fault with design

Its just too much effort when you are immutable when you have 4000 project ideas. If I wanted to change a simple value I had to create a typed event to persist the change and a switch statement when querying the data

Streams are cheap in ESDB and that doesn't really map conceptually to relational tables or no-sql collections in my mind. Thats not a big deal for me though. 

With JSON datatypes in a relational DB I get the best of both worlds for the types of projects that I want to support 💪

### DynamoDB

The free tier was enticing, it's an AWS service so easy integration with EventBridge, and no schema migrations

No current support in DataGrip

Querying for data is different, you either need indexes or you have to SCAN

Importing is meh, I guess you have the power of Glue. Export to S3 is nice but it's just not as nice/easy as working with relational

I don't have that good of reasons for moving away from DynamoDB. I didn't give it very long of a chance but it is **just awkward** to work with compared to others. So that's my reason for now until I find others 😉

I definately want geospatial queries and they just seem extra in Dynamo. There are [packages](https://www.npmjs.com/package/dynamodb-geo) to support it but it doesn't feel as native. That could be a wrong read though on my part

### Bit.io

I love the collaboration potential, ability to easily upload data, UX, web SQL editor, Postgres

**Bit.io doesn't work for me because**:
- No PostGis support (I want to do geo spatial queries)
- Forward slashes freak out DataGrip Java drivers
- Also, variables suck in Postgres

### Search

At the moment it is too much effort to index a search database. I mean Algolia makes it easy but for now I want to keep few databases as possible and with low record count I'll stick with relational

### Airtable

I'm a big fan of productivity apps like AirTable, Evernote, Notion.so, and Obsidian. What does that have to do with anything? Well AirTable is the most relevant

I'm currently paying for this and it has been great. 

**Pros**
- Api
- Pretty
- Nicer UX than Excel
- Collaboration (which I don't need)
- BI / Charting potential and great 3rd party integration support

**Cons**
- Price
- Slow to start on mobile and sometimes desktop
- Exporting is meh

I plan on 🪓'ng my subscription because I'm already on a paid plan and I'll blow past their row limits as I work with data loads with miscellaneous projects

They have great overlays like maps and automatically finding geo-coordinates from addresses in your data but I want more control over that

In one sense Airtable is like a glorified Excel but they are different obviously and I won't get into that

### Pulumi (IaC)

I think it's worth mentioning that managed services like DyanamoDB can be created with Pulumi and then those table names can be referenced wherever. Can't do that to my knowledge for Postgres tables. You can do databases though

So by choosing relational I'll need to hand jam schema or make schema migrations 🤷‍♂️

### PlanetScale

Finally, PlanetScale

I find this very similar to Bit.io and I wanted to stick with Bit.io. The native JSON, geo data types, and Datagrip friendliness is what won this for me.

I listened to a podcast and it seems that PlanetScale solves a lot at scale. Things like many connections, schema changes at scale, etc. I don't have these issues, but it is great to learn about

Variables work as expected in MySql

I did notice some geo weirdness and some distance functions not matching google... [this ](https://stackoverflow.com/questions/74017579/different-distance-between-google-maps-and-mysql-st-distance-sphere)worked for me

An [awesome article](https://aaronfrancis.com/2021/efficient-distance-querying-in-my-sql) for working with MySql geo, and [another one](https://www.endpointdev.com/blog/2021/03/spatial-queries-with-mysql/)

### Follow Up 2022-11-27

So working with MySQL in my favorite IDE has been nice until I've been running into issues working with JSON. I also haven't been doing any geospatial queries like I thought I was.

You can't pluck distinct json array values **easily**. Frustrating.

Not saying this will make me change things yet again but I'm not getting the niceties that I was wanting.