---
tags: [mom]
---
# Parsing Docx Files For Mom


## Background

My mother passed away on December 20th, 2020. She wrote sci-fi in many variations of many stories all on a similar timeline. 

I backed up all her files; at least where I knew to look. She wrote SO MUCH on paper which was just thrown away.

Writing was something she did in her leisure time. No end goal of publishing or doing any formailityies or rigidity; just writing.

TODO: picture

## Technical

All the writing I was able to find was in `docx` format. I've dabled in .NET in my past and you'd think that there is a beautiful .NET 6 API to work with documents. There isn't. 

It is all nonsense trial old software. So I gave up on this project a few times; because I was looking in the wrong place.

A simple Google brought me to this [StackOverflow article](https://stackoverflow.com/questions/5671988/how-to-extract-just-plain-text-from-doc-docx-files) which brought me to [Apache Tika](https://tika.apache.org/).

I have opinions on Java but all I need is something easy, and this library is the easiest method I found. Java is everywhere, I shouldn't hate on it. This isn't a production app, this is a one time data parsing and curation. Keep your self blah blah to yourself, just get the job done.

So I downloaded the JAR, already had the Java runtime installed, and ran: `java -jar .\tika-app-2.6.0.jar --text C:\Users\looni\OneDrive\Documents\Mom\Documents\Ashe1.docx`

This dumped text with newlines preserved. This is what I needed. Now my plan was:
- Move only story files to one directory
- Query all files in that directory sorted by date
- Parse them with Tika
- Combine all text into one file and stor that somewhere

Share it with my aunt.

So here is the final product: TODO
todo: text analysis
todo: nsfw
painting - chalk paint

I don't have any worries of privacy

Also, these source files were saved on OneDrive. I didn't have a copy locally when I was filtering out documents for actual stories shoe wrote. OneDrive was so slow for this. I suppose you can't blame them, these files would be on the coldest of cold storage they have based on date, file type, and never accessed before for the most part.

Tika has a bulk feature. Instead of over engineering I'm planning on levereging it exhaustively.

## AWS TODO (name of the nlp processing)

I took the results from TODO ^^^ name recognition????? todo and wanted to do some analtycis. The Jupyter Notebook was a pain since I'm not familiar: https://bit.io/lanekatris/everything
```sql
with x as (
select lower(jsonb_array_elements(entities)->>'Text') idk, jsonb_array_elements(entities)->>'Type' t from "output1"
)
select idk, count(idk) from x where t = 'PERSON' group by idk order by count(idk) desc
```

## Onedrive

Since I'm dealing with small files I found it was easier to select all files and choose "Always Keep On This Device". You can always rever this easily by bulk selecting.

Onedrive is quite slow if you don't have the file downloaded already and you move it to another folder since it has to download then move. 





TODO: I could just have a page dedicated to mom with photos i find and say her interests






# TODO: sort by date, includle file name
tar -xvzf '.\output (1).tar.gz'
todo: list out the possibilities of aws comprehend and the ones I chose
