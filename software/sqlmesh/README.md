# New Way
```
nix develop
sqlmesh plan


GRANT SELECT ON ALL TABLES IN SCHEMA models TO web_anon;

ssh lane@server1
cd monorepo/infrastructure/homelab
docker compose restart postgrest
```

# Old Way
```
nix shell ......

python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
source .venv/bin/activate # reactivate the venv to ensure you're using the right installation

sqlmesh plan # see the plan for the changes you're making
```
