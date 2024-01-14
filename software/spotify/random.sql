select max(artistname), trackname, count(*)
from spotify_streaming_history
group by trackname
order by count(*) desc

-- really knowing what I listened the most of
select trackname, sum(msplayed), sum(msplayed) / 3600000 as hours
from spotify_streaming_history
group by trackname
order by sum(msplayed) desc

-- knowing what i listened most of but no podcasts - most listened to songs
select trackname, sum(msplayed), sum(msplayed) / 60000 as minutes,
       sum(msplayed) / 3600000 as hours, max(sp.name) is not null as is_podcast,
       max(artistname)
from spotify_streaming_history ssh
         left join spotify_podcasts sp on ssh.artistname = sp.name
group by trackname
order by sum(msplayed) desc;

-- Podcast Listen Time
select sum(msplayed)  / 3600000 as hours from vw_spotify_history_v2 where is_podcast = true

-- podcast and music listen time
select is_podcast, sum(msplayed)  / 3600000 as hours from vw_spotify_history_v2 group by is_podcast


select sum(msplayed) total_milliseconds, min(endtime) start_date, max(endtime) end_date
from spotify_streaming_history

-- top 5 listened to songs
select max(artistname) as artist, trackname,sum(msplayed) / 60000 as minutes from vw_spotify_history_v2 where is_podcast = false group by trackname order by sum(msplayed) desc limit 5

-- podcast list
select name,publisher,replace(uri,'spotify:show:', 'https://open.spotify.com/show/') from spotify_podcasts order by name

-- top 5 most listened to bands
select artistname, sum(msplayed) from vw_spotify_history_v2 where is_podcast = false group by artistname order by sum(msplayed) desc


select *
from spotify_streaming_history

select count(*)
from spotify_streaming_history



create table spotify_podcasts
(
    name      text,
    publisher text,
    uri       text
);



select ssh.*, sp.name is not null as is_podcast
from spotify_streaming_history ssh
         left join spotify_podcasts sp on ssh.artistname = sp.name