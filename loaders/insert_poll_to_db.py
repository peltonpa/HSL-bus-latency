import os
import json
import psycopg2

class db_inserter():
    def __init__(self):
        password = os.environ.get("PG_PASS", "")
        connstring = "dbname='digitransit' user='postgres' host='localhost' password='{0}'".format(password)
        self.conn = psycopg2.connect(connstring)
        self.cur = self.conn.cursor()
        self.inserted_trips = []
    
    def insert_trip(self, id, data):
        if not (id in self.inserted_trips):
            self.inserted_trips.append(id)
            params = [id, data["directionId"]]
            insert = "INSERT INTO trips VALUES ('{0}', '{1}') ON CONFLICT DO NOTHING".format(*params)
            self.cur.execute(insert)
            self.conn.commit()
    
    def insert_poll(self, id, data):
        params = [id, data["stopGtfsId"], data["scheduledArrival"], data["arrivalDelay"]]
        drop = "DELETE FROM polls WHERE tripGtfsId = '{0}' AND stopGtfsId = '{1}'".format(id, data["stopGtfsId"])
        insert = "INSERT INTO polls VALUES (DEFAULT, '{0}', '{1}', {2}, {3}, DEFAULT)".format(*params)
        self.cur.execute(drop)
        self.cur.execute(insert)
        self.conn.commit()
