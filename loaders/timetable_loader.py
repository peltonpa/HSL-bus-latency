import os
import requests
from bus_details import *

password = os.environ.get("PG_PASS", "")

url = "https://api.digitransit.fi/routing/v1/routers/hsl/index/graphql"
headers = {"content-type": "application/graphql"}
bus_id = details.get("58").get("bus_id")
data = '''
{{
  stop(id: "{0}") {{
    name
    lat
    lon
    wheelchairBoarding
  }}  
}}
'''.format(bus_id)
r = requests.post(url, data)
print(r.content)

