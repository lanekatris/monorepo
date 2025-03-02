MODEL (
    name models.issue
      );

select concat('Volleyball needs scores updated for: ', opponent) message from noco.volleyball where date < now() and (sets_won is null or sets_lost is null)