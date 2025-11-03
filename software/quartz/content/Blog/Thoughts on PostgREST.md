# Background

I have use cases all the time where I want to show live data on a web page. 

Sometimes things I want to expose publicly and some just private. 

I recently [[Switching from neondb to self hosted postgres]] and I was having to change my custom db access code on my AstroJS and NextJS sites. This is annoying and a good use of AI. 

So, 2 problems:
- If I change my db I have to change data access code in each project
- I'm not solving "showing live data easily" very well, it's brittle and annoying to build and deploy


> [!NOTE] What about CRUD?
> So I'm focused on viewing data, but luckily, long ago, I solved my CRUD issues by using [NocoDB](https://nocodb.com/). 

# Solution

Using [PostgREST](https://docs.postgrest.org/en/v13/index.html#) seems like it is going to be awesome. I literally have a table that I want to ugly show in an iframe in Obsidian. This is all I want, period.

This is now solved with PostgREST. Easy peasy:

In Obsidian:
```html
<iframe src="http://server1:3033/issue" width="100%"/>
```

Docker Compose:
```yaml
  postgrest:
    image: postgrest/postgrest:v12.2.0
    restart: always
    depends_on:
      - mydb
    environment:
      PGRST_DB_SCHEMA: models
      PGRST_DB_URI: postgres://lkat:${MY_POSTGRES_PASSWORD}@mydb:5432/neondb
      PGRST_DB_ANON_ROLE: web_anon
      PGRST_SERVER_PORT: 3000
    ports:
      - "3033:3000"
```

Postgres:
```sql
create role web_anon nologin;

grant usage on schema models to web_anon;

grant select on all tables in schema models to web_anon

ALTER DEFAULT PRIVILEGES FOR USER web_anon IN SCHEMA models GRANT SELECT ON TABLES TO web_anon;
```

