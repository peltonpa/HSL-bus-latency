import requests
import json

URL = 'https://api.digitransit.fi/routing/v1/routers/hsl/index/graphql'
HEADERS = {'Content-Type': 'application/graphql'}

with open("loaders/bus_data.json") as file:
    bus_data = json.load(file)

for name, data in bus_data.items():
    route_gtfsId = data.get("gtfsId")
    data = f'''
    {{
    route(id: "{route_gtfsId}") {{
        gtfsId
        shortName
        stops {{
            gtfsId
            name
            url
            lat
            lon
            stoptimesWithoutPatterns {{
                scheduledArrival
                arrivalDelay
                timepoint
                realtime
                realtimeState
                serviceDay
                trip {{
                    gtfsId
                    id
                    serviceId
                    directionId
                    tripShortName
                }}
            }}
        }}
      }}
    }}
    '''

    route_data = requests.post(url=URL, data=data, headers=HEADERS)
    content_json = route_data.json()["data"]

    print("route:", content_json["route"]["shortName"])
    for stop in content_json["route"]["stops"]:
        print("  stop:", stop["name"])
        for stoptime in stop["stoptimesWithoutPatterns"]:
            if stoptime["realtime"] and \
                    route_gtfsId in stoptime["trip"]["gtfsId"]:
                print("    scheduled: ", stoptime["scheduledArrival"],
                      ", delay: ", stoptime["arrivalDelay"],
                      ", id: ", stoptime["trip"]["gtfsId"], sep="")
    print()
