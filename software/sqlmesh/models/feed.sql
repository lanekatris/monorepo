MODEL (
    name models.feed
      );



select concat('scorecard-', to_char("startdate",'yyyyMMddHH24MISS'))          id,
       'scorecard'                         type,
       "startdate"::date                   date,
       jsonb_build_object('scorecard', u.*) data
from models.disc_golf_round u
union
select concat('disc-', d.id)                   id,
                  'disc'                                  type,
                  coalesce(d.created, d.created_at::date) date,
                  jsonb_build_object('disc', d.*)          data
           from noco.disc d


union
select concat('lost-disc-', d.id)                   id,
       'lost-disc'                                  type,
       d."LostDate" date,
                  jsonb_build_object('disc', d.*)          data
from noco.disc d where d."LostDate" is not null


union
select
    concat('adventure-', a.id),
    'adventure' type,
    file_date::date date,
    jsonb_build_object('adventure', a.*) data
from models.adventures a