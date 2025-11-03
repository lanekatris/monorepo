Neondb is fantastic. 

SAAS apps can access it.

I’m cheap though. 

Helpful:
- https://forums.docker.com/t/mysterious-docker-issue-with-postgres/149898/3

Not helpful:
- https://discourse.nixos.org/t/how-to-find-the-package-name-for-executable/6120

Found via this: https://search.nixos.org/packages?channel=25.05&show=postgresql_17_jit&query=pg_dump
I used pg_dump by `nix-shell -p postgresql_17_jit`
which pg_dump
/nix/store/r7lws1ff5r4igpwzabzksd2rc7mmr287-postgresql-and-plugins-17.6/bin/pg_dump
In datagrip I chose this executable. ~70mb dump



I edited my connection string my go lang woeker on the server to point to it. 

I HARD deleted my neondb project. No fear brother. Take a step, new mentality.



# Problems

Astrojs, i’m using neon serverless driver! This doesn’t work without: https://neon.com/guides/local-development-with-neon


2025-10-01
I just need to change permissions on the backuper, not postgres:18