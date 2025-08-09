```
nix shell ......

python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
source .venv/bin/activate # reactivate the venv to ensure you're using the right installation

sqlmesh plan # see the plan for the changes you're making
```
