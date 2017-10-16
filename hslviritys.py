import requests

URL = 'https://api.digitransit.fi/routing/v1/routers/hsl/index/graphql'
HEADERS = {'Content-Type': 'application/graphql'}

route_gtfsIds = ["HSL:2550", "HSL:4560", "HSL:1058", "HSL:1058B", "HSL:1014",
                 "HSL:1018", "HSL:1079", "HSL:1039", "HSL:1039B", "HSL:1071",
                 "HSL:1094", "HSL:1094A", "HSL:1069", "HSL:1075", "HSL:1043",
                 "HSL:1023", "HSL:1051", "HSL:1067", "HSL:1067V", "HSL:1059",
                 "HSL:1073"]

for route in route_gtfsIds:
    data = f'''
    {{
    route(id: "{route}") {{
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
            if stoptime["realtime"]:
                print("    scheduled: ", stoptime["scheduledArrival"],
                      ", delay: ", stoptime["arrivalDelay"],
                      ", id: ", stoptime["trip"]["gtfsId"])
    print()
