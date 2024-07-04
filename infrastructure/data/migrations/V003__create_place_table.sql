create table temp.place
(
    id       serial
        constraint place_pk
            primary key,
    friendly_id text default gen_random_uuid() not null,
    name     text,
    location text,
    state    text,
    state_park boolean,
    national_park boolean
);