create table temp.place_visit
(
    id         serial
        constraint place_visit_pk
            primary key,
    place_friendly_id   text,
    visited_on date
);

