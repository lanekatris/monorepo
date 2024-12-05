---
title: Find duplicates in SQL
pubDate: "2024-11-12"
tags:
  - sql
---

# Overview

SQL is a beast. I want to start capturing contextual information about how to do things as I forget SQL quickest out of all languages I deal with.

I was using Snowflake and [this article](https://www.chaosgenius.io/blog/snowflake-data-duplication/) was useful.

I'm not going to go into the different ways to find duplicates, but we all know the dreaded:

1. New requirement
2. Add some joins
3. Row count changes in your query
4. Why?
5. Hack - add a `distinct`

In our case, adding `distinct` was the solve... but after investigating it was OK and we didn't have `outer apply` in Snowflake syntax.

It also wasn't worth the effort of massaging the data to only return one row on the join or use some fancy Snowflake specific syntax.

# Finding the Duplicates

I used `ROW_NUMBER()` from the article above. I never really thought of this but seemed like a good idea.

I could take the query, add this `row_number()`, wrap it in a CTE, and then add to my where clause where the row number is greater than 1.

Makes a lot of sense partitioning... kind of weird to add every column but that's how this method works... so works for me.

