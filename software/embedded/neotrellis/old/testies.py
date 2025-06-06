import btree
import random
import uuid

try:
    f = open("mydb", "r+b")
except OSError:
    f = open("mydb", "w+b")

db = btree.open(f)

id = uuid.uuid4()
# print(bytearray(str(id)), 'utf-8')
# db[bytes(id, 'utf-8')] = b"idk"
# db["3"] = b"three"

# db.flush()

print("printing db")
for idk in db:
    print(idk)

db.close()
f.close()


# print(uuid.uuid4())
