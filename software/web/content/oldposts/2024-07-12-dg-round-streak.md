---
date: 2024-08-04
slug: disc-golf-streak
title: Determining Disc Golf Streaks
tags:
  - disc-golf
---

#### Overview

Udisc is a fantastic app but it doesn't show "streaks". I wanted to know if I was on a scoring streak for consecutive rounds. 

It's simple, if I was under par for a round, and played at least one other round consecutively under par: I'm on a streak.

Also, I wanted to see a list of the courses/rounds I've played and know if it was the first time I've ever played there. 
Once again, Udisc will tell you your unique courses, but it isn't front and center if what you played was new at that time. 
Going forward of course, the rounds for that course wouldn't show "new" any more.

Final result: [My Rounds](/dg/rounds).

#### More Detail

Since we are on a website, I want to display my rounds via the web. Udisc lets you export a CSV of all your rounds. [Example CSV](./2024-06-udisc-scorecards.csv).

I upload these into [Neon Postgres](https://neon.tech/) instead of something like Sqlite since I use it for all data persistence which makes my life easier/simpler.

Here is Udisc's CSV format/schema:
```sql
create table if not exists udisc_scorecard
(
    playername  varchar(255),
    coursename  varchar(255),
    layoutname  varchar(255),
    startdate   timestamp,
    enddate     timestamp,
    total       integer,
    "+/-"       integer,
    roundrating integer,
    hole1       integer,
    hole2       integer,
    hole3       integer,
    hole4       integer,
    hole5       integer,
    hole6       integer,
    hole7       integer,
    hole8       integer,
    hole9       integer,
    hole10      integer,
    hole11      integer,
    hole12      integer,
    hole13      integer,
    hole14      integer,
    hole15      integer,
    hole16      integer,
    hole17      integer,
    hole18      integer,
    hole19      integer,
    hole20      integer,
    hole21      integer,
    hole22      integer,
    hole23      integer,
    hole24      integer,
    hole25      integer,
    hole26      integer,
    hole27      integer,
    hole28      integer,
    hole29      integer,
    hole30      integer,
    id          serial
);
```

Here is the query to get each round and if it is a streak or not:
```sql
with x as (select row_number() over (
    partition by coursename
    order by startdate
    ) = 1               new_course,
                  lag("+/-", 1) over (
                      order by startdate
                      ) previous_score,
                  *
           from kestra.udisc_scorecard
           where playername = 'Lane'
           order by startdate desc)
select previous_score < 0 and "+/-" < 0 streak, * from x
```

**Breakdown**
(Starting inner query to outer)
- Udisc gives you at least 2 rows per round, one for "Par" and one with your name. You must filter by your name since that is what you scored
- Order by `startdate` since I want to see latest rounds first
- To determine if it was a new course we can use `row_number()` and do something like a running `group by` (`partition`) _at that point in time_. For that round, since we did a group by and count, if it is `1` then this is the first time playing it. All others would represent how many times you've played the course which would be over `1`
- I needed to know the previous row's data to know how I scored in that round; that is where `lag` comes in. The sorting I imagine you'd want to match your outer query to match. You don't need to care about any row before the previous which is nice - well your current row and the previous row


### Search History
- [PostgreSQL ROW_NUMBER() Explained with Practical Examples](https://www.postgresqltutorial.com/postgresql-window-function/postgresql-row_number/)
- [How to Get the First Row per Group in PostgreSQL - PopSQL](https://popsql.com/learn-sql/postgresql/how-to-get-the-first-row-per-group-in-postgresql)
- [Is it possible to look at the output of the previous row of a PostgreSQL query? - Stack Overflow](https://stackoverflow.com/questions/70158295/is-it-possible-to-look-at-the-output-of-the-previous-row-of-a-postgresql-query)
- [sql - Row of the first positive number preceding a negative number in Postgres? - Stack Overflow](https://stackoverflow.com/questions/58801601/row-of-the-first-positive-number-preceding-a-negative-number-in-postgres)
- [sql - Trying to query postgresql for current and longest streak - Stack Overflow](https://stackoverflow.com/questions/59077286/trying-to-query-postgresql-for-current-and-longest-streak)
- [PostgreSQL - LAG Function - GeeksforGeeks](https://www.geeksforgeeks.org/postgresql-lag-function/)
- [postgresql - Show current row "win streak" - Database Administrators Stack Exchange](https://dba.stackexchange.com/questions/235306/show-current-row-win-streak)
- [locking - How to keep an unique counter per row with PostgreSQL? - Database Administrators Stack Exchange](https://dba.stackexchange.com/questions/47774/how-to-keep-an-unique-counter-per-row-with-postgresql)
