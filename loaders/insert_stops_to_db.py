import os
import json
import psycopg2

password = os.environ.get("PG_PASS", "")
connstring = "dbname='digitransit' user='postgres' host='localhost' password='{0}'".format(password)
with open("bus_data.json") as file:
    bus_data = json.load(file)

conn = psycopg2.connect(connstring)
cur = conn.cursor()
cur.execute("""INSERT INTO stops VALUES ('joo', 'ei', 'ei', 'joo', 2, 2)""")
for key, value in bus_data.items():
    for stop in bus_data[key]["stops"]:
        params = [stop["gtfsId"], stop["name"], stop["desc"], stop["url"], stop["lon"], stop["lat"]]
        insert = """
                  INSERT INTO stops
                  VALUES(
                    '{0}', '{1}', '{2}', '{3}', {4}, {5}
                  )
                  ON CONFLICT
                  DO NOTHING
                """.format(*params)
        print(insert)
        cur.execute(insert)

conn.commit()

'''

for key, value in bus_data.items():
    for stop in bus_data[key]["stops"]:
        print(stop)
'''

