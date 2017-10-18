import requests
import json
import time 
import datetime

URL = 'https://api.digitransit.fi/routing/v1/routers/hsl/index/graphql'
HEADERS = {'Content-Type': 'application/graphql'}

with open("bus_data.json") as file:
    bus_data = json.load(file)
    
def get_realtime_bus_data(route_gtfsId, tries = 5):
    if tries <= 0:
        raise ValueError("Tries must be at least 1")
    data = '''
    {{
    route(id: "{route_gtfsId}") {{
        gtfsId
        shortName
        stops {{
            name
            gtfsId
            stoptimesWithoutPatterns {{
                scheduledArrival
                arrivalDelay
                
                
                realtime
                
                serviceDay
                
                
                
                trip {{
                    gtfsId
                    
                    
                    directionId
                    
                }}
            }}
        }}
      }}
    }}
    '''.format(route_gtfsId=route_gtfsId)

    
    i = 0
    while  i < tries:
        response = requests.post(url=URL, data=data, headers=HEADERS)
        try:
            response.raise_for_status()
        except requests.exceptions.HTTPError:
            i += 1
        else:
            break
    content_json = response.json()["data"]
    return content_json
    
    
def filter_next_stop_for_busses(content_json):
    ## SHOULD WORK
    final = {}
    route_name = content_json["route"]["shortName"]
    route_gtfsId = content_json["route"]["gtfsId"]
    for stop in content_json["route"]["stops"]:
        stopGtfsId = stop["name"]
        
        for stoptime in stop["stoptimesWithoutPatterns"]:
        
            # Take only busses that have realtime
            if stoptime["realtime"] and \
               route_gtfsId in stoptime["trip"]["gtfsId"]:
                this_data = {
                    "stopGtfsId":       stopGtfsId,
                    
                    "scheduledArrival": stoptime["scheduledArrival"],
                    "arrivalDelay":     stoptime["arrivalDelay"],
                    "realtime":         stoptime["realtime"],
                    "serviceDay":       stoptime["serviceDay"],
                    "directionId":      stoptime["trip"]["directionId"]
                }

                
                tripGtfsId = stoptime["trip"]["gtfsId"]
                # take only the stops data that has the minimum scheduled arrival
                
                # if no previous, currently nearest is this
                if (tripGtfsId not in final):
                    final[tripGtfsId] = this_data
                    
                # else if this arrival time is sooner than previous, currently nearest is this
                elif (this_data["scheduledArrival"]
                        < final[tripGtfsId]["scheduledArrival"]):
                    final[tripGtfsId] = this_data
                  
     
    return final
    
def yield_changed(old, new):
    ## NOT TESTED
    for id, old_data in old.items():
        if id in new and old_data["stopGtfsId"] == new[id]["stopGtfsId"]:
            continue
        yield {id: old_data}

            
def get_realtime_for_all(data: {"name": "id"}):
    ## SHOULD WORK
    all = {}
    for name, data in data.items():
        route_gtfsId = data.get("gtfsId")
        content_json = get_realtime_bus_data(route_gtfsId)
        next_stops = filter_next_stop_for_busses(content_json)
        all.update(next_stops)
    return all

    
def seconds_from_midnight():
    return time.time() - time.mktime(datetime.date.today().timetuple())
    

def update_current(old, new, discard_min = 5):
    """ Returns tuple(updated, visited_stops)"""
    
    # discard time is now + n minutes
    discard_time = seconds_from_midnight()  + discard_min *60
    print(discard_time)
    updated = old.copy()
    visited_stops = {}
    for id, old_data in old.items():
        # If the next stop is changed and it is later than current next stop
        if id in new and (old_data["stopGtfsId"] != new[id]["stopGtfsId"] 
                     and new[id]["scheduledArrival"] > old_data["scheduledArrival"]):
            visited_stops[id] = old_data
            updated[id] = new[id]
        
        # if some bus has been out of radat for discard_min minutes 
        elif id not in new and (old_data["scheduledArrival"] + old_data["arrivalDelay"]
                                    > discard_time):
            visited_stops[id] = old_data
            del updated[id]
        
    for id in new:
        if id not in updated:
            updated[id] = new[id]
    
    return updated, visited_stops
    
    
def main():
    print(bus_data.keys())
    # return
    data = {"550": bus_data["550"]}
    previous = get_realtime_for_all(data)
    while True:
        current = get_realtime_for_all(data)
        previous, visited_stops = update_current(previous, current)
        for id, item in visited_stops.items():
            print("# CHANGED: ", id,  json.dumps(item, indent=4))
            print("next: ", json.dumps(previous.get(id), indent=4))
        time.sleep(1)


if __name__ == "__main__":
    main()
