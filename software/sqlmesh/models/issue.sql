MODEL (
    name models.issue
      );

select concat('Volleyball needs scores updated for: ', opponent) message from noco.volleyball where date < now() and (sets_won is null or sets_lost is null)
union
select 'Rhinofit sync may have an issue' message where not exists (select *
                                                                   from events
                                                                   where event_name = 'rhinofit_worker_v1'
                                                                     and created_at > now() - interval '16 minutes')