MODEL (
    name models.disc_golf_round
      );

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