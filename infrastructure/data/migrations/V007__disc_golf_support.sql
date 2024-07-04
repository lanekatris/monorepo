alter table temp.place
    add disc_golf boolean;

create table if not exists temp.place_scorecard
(
    place_friendly_id text,
    scorecard_course_name      text
);