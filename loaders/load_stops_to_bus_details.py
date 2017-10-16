# This file loads data for all stops of buses specified in bus_details.py into
# a json to be used for database inserts and GraphQL queries

import requests
import json
from bus_details import *
from time import sleep

url = "https://api.digitransit.fi/routing/v1/routers/hsl/index/graphql"
headers = {"content-type": "application/graphql"}

for key, value in details.items():
    bus_id = details[key]["gtfsId"]
    data = '''
    {{
      route(id: "{0}") {{
        stops {{
          gtfsId
          name
          lat
          lon
          url
          desc
        }}
      }}  
    }}
    '''.format(bus_id)
    r = None
    while True:
        try:
            r = requests.post(url, data)
            if (r.status_code == 200):
                break
        except: 
            pass

    print(len(r.content))
    print(bus_id)
    response_json = json.loads(r.text)
    details[key]["stops"] = response_json["data"]["route"]["stops"]

with open("bus_data.json", "w") as fp:
    json.dump(details, fp)
