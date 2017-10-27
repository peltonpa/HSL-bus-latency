import psycopg2
import getpass
import matplotlib.pyplot as plt
import datetime
import time
import os
import plotly.plotly as py
import plotly.graph_objs as go


password = os.environ.get("PGPASSWORD") or getpass.getpass("Postgress password: ")

def seconds_from_midnight(d = None):
    d = d or datetime.datetime.now()
    return d.timestamp() - time.mktime(d.date().timetuple())
    
def seconds_from_midnight_to_datetime(t, d = None):
    if d:
        d = d.date()
    else:
        d = datetime.date.today()
        
    return datetime.datetime.fromtimestamp(time.mktime(d.timetuple()) + t)
      
#(125280, 'HSL:1079_20171016_Pe_2_0937', 'HSL:1431136', 37080, -28, datetime.datetime(2017, 10, 20, 7, 17, 46, 716849))


class DBWrapper:
    cursor_count = 0
    def __init__(self, dbname="digitransit3", user="postgres", password=""):
        self.conn = psycopg2.connect(f"dbname=digitransit3 user=postgres password={password}")
        self.cur =  self.conn.cursor(name=f"asdf{self.cursor_count}")
        self.cursor_count += 1
    def __enter__(self):
        return self.cur
        
    def __exit__(self, type, value, traceback):
        pass

def get_average_late_count_for_routes():        
    lateness = {}
    total = {}
    with DBWrapper(password=password) as cur:
        cur.execute("SELECT * FROM polls ORDER BY tripgtfsid")
        for c in cur:
            id, tripgtfsid, stopgtfsid, scheduledarrival, arrivaldelay, polled_at = c
            bus_id = tripgtfsid.split("_", 1)[0]
            if bus_id not in lateness:
                lateness[bus_id] = 0
                total[bus_id] = 0
            if arrivaldelay - 2*60 > 0:
                lateness[bus_id] += 1
            total[bus_id] += 1
            
    for k, v in lateness.items():
        lateness[k] = v / total[k]
        
    return lateness
    
def get_average_lateness_for_routes():        
    lateness = {}
    total = {}
    with DBWrapper(password=password) as cur:
        cur.execute("SELECT * FROM polls ORDER BY tripgtfsid")
        for c in cur:
            id, tripgtfsid, stopgtfsid, scheduledarrival, arrivaldelay, polled_at = c
            bus_id = tripgtfsid.split("_", 1)[0]
            if bus_id not in lateness:
                lateness[bus_id] = 0
                total[bus_id] = 0
            if arrivaldelay - 2*60 > 0:
                lateness[bus_id] += arrivaldelay
            total[bus_id] += 1
            
    for k, v in lateness.items():
        lateness[k] = v / total[k]
        
    return lateness

            
def get_late_per_stops_for_hours():
    """ Get data per hour"""
    
    data_asdf = {}
    for i in range(24):
                data_asdf[i] = {
                    "early_sum":0,
                    "early_count": 0,
                    "late_sum":0,
                    "late_count": 0,
                    }
    stops_on_hour = [0] * 24
    
    with DBWrapper(password=password) as cur: 
        cur.execute("SELECT * FROM polls ;" ) # WHERE polled_at BETWEEN date '2017-10-20' AND date '2017-10-21' ORDER BY tripgtfsid, scheduledarrival")
        
        for i, c in enumerate(cur):
            # {0: 0, 1:0, ... 23: 0 }   
            id, bus_id, stop_id, s_from_mdn, late, polltime = c
            predicted = seconds_from_midnight_to_datetime(s_from_mdn, polltime)
            this = data_asdf[predicted.hour] #+ (predicted.minute  >= 30) * 0.5]
            stops_on_hour[predicted.hour] += 1
            if late - 60 * 3 > 0:
                this["late_sum"] += late
                this["late_count"] += 1
                
            elif late + 60 * 3 > 0:
                this["early_sum"] += late
                this["early_count"] += 1
             
    print("late")        
    
    draw_list = []
    draw_list2 = []
    for h, this in data_asdf.items():
        draw_list.append(- this['late_sum'] / (this['late_count'] or 1))
        draw_list2.append(this["late_count"] / (stops_on_hour[int(h)] or 1))
        
        print(f"{h} avg: {this['late_sum'] / (this['late_count'] or 1)} total: {this['late_count']}")
        
    # plt.plot(list(data_asdf.keys()), draw_list,)
    plt.plot(list(data_asdf.keys()), draw_list2,)
    plt.show()

    
def get_early_and_late_for_all():
    """ get data per day"""
    with DBWrapper(password=password) as cur:
        cur.execute("SELECT * FROM polls ;" ) # WHERE polled_at BETWEEN date '2017-10-20' AND date '2017-10-21' ORDER BY tripgtfsid, scheduledarrival")
        
        data_asdf = {}
        
        much_late= little_late= much_early= little_early= in_time = 0 
        for i, c in enumerate(cur):
            # {0: 0, 1:0, ... 23: 0 }

            
            id, bus_id, stop_id, s_from_mdn, late, polltime = c
            predicted = seconds_from_midnight_to_datetime(s_from_mdn, polltime)
                    
            if late + 60 * 4 < 0:
               much_early += 1

            elif late + 60 * 2 < 0:
               little_early += 1
               
               
            elif late - 60 * 4 > 0:
               much_late += 1
               
            elif late - 60 * 2 > 0:
               little_late += 1
                
            else:
                in_time += 1
                
        print("much_late\tlittle_late\tmuch_early\tlittle_early\tin_time")
        print(f"{much_late}\t{little_late}\t{much_early}\t{little_early}\t{in_time}")
  
    
def count_and_delay():
         #    o
    #  o
         # ####
         # count +
         
    delays = {}
    for i in range(-30, 31):
        delays[i] = 0
    
    with DBWrapper(password=password) as cur: 
        cur.execute("SELECT * FROM polls ;")
        for i, c in enumerate(cur): 
            id, tripgtfsid, stopgtfsid, scheduledarrival, arrivaldelay, polled_at = c
            asdf = seconds_from_midnight_to_datetime(arrivaldelay, polled_at)
            # Delays starting half a minute or 30 if its >= 15min
            d = int(arrivaldelay / 30)
            if abs(d) <= 30:
                delays[d] += 1
                
    for delay, count in delays.items():
        print(f"{delay*30},{count}")
# myöh ja ajoissa hajonta            
def main3():
    try:
        conn = psycopg2.connect(f"dbname=digitransit3 user=postgres password={password}")
    except psycopg2.OperationalError as e:
        print(e)
        raise SystemExit("Wrong password")
    cur = conn.cursor(name="asdf")
    cur.execute("SELECT * FROM polls ;" ) # WHERE polled_at BETWEEN date '2017-10-20' AND date '2017-10-21' ORDER BY tripgtfsid, scheduledarrival")
    
    data_asdf = {}
    for i in range(7):
            data_asdf[i] = {
                "early_sum":0,
                "early_count": 0,
                "late_sum":0,
                "late_count": 0,
                }

    
    stops_on_day = [0] * 7
    for i, c in enumerate(cur):
        # {0: 0, 1:0, ... 23: 0 }

        
        id, bus_id, stop_id, s_from_mdn, late, polltime = c
        predicted = seconds_from_midnight_to_datetime(s_from_mdn, polltime)
        stops_on_day[predicted.weekday()] += 1
        this = data_asdf[predicted.weekday()] #+ (predicted.minute  >= 30) * 0.5]
        if late - 60 * 3 > 0:
            this["late_sum"] += late
            this["late_count"] += 1
            
        elif late + 60 * 3 < 0:
            this["early_sum"] += late
            this["early_count"] += 1
         
    print("late")        
    
    draw_list = []
    draw_list2 = []
    for i, (h, this) in enumerate(data_asdf.items()):
        draw_list.append(this['early_count'] / stops_on_day[int(i)])
        draw_list2.append(this["late_count"]  / stops_on_day[int(i)] )
        
        print(f"{h} avg: {this['late_sum'] / (this['late_count'] or 1)} total: {this['late_count']}")
        
    # plt.plot(list(data_asdf.keys()), draw_list,)
    plt.plot(list(data_asdf.keys()), draw_list2,)
    plt.plot(list(data_asdf.keys()), draw_list,)
    plt.grid(True)
    plt.show()
    cur.close()


def get_late_per_hour_for_day():
    late = [[0] * 24 for i in range(7)]
    total = [[0] * 24 for i in range(7)]
    with DBWrapper(password=password) as cur: 
        cur.execute("SELECT * FROM polls")
        for c in cur:
            id, tripgtfsid, stopgtfsid, scheduledarrival, arrivaldelay, polled_at = c
            sched = seconds_from_midnight_to_datetime(scheduledarrival, polled_at)
            sched
            if arrivaldelay - 60*2 > 0:
                late[sched.weekday()][sched.hour] += 1
            total[sched.weekday()][sched.hour] += 1
            
    final = [[0] * 24 for i in range(7)]    
    for i, (late_row, total_row) in enumerate(zip(late, total)):
        for j, (late_h, total_h) in enumerate(zip(late_row, total_row)):
            if total_h > 0:
                final[i][j] = late_h / total_h
    return final

def get_late_per_n_mins_for_day(mins=20):
    n = (23 * int(60/mins) + int(59/mins))
    late  = [[0] * n for i in range(7)]
    total = [[0] * n for i in range(7)]
    final = [[0] * n for i in range(7)]   
    with DBWrapper(password=password) as cur: 
        cur.execute("SELECT * FROM polls")
        for c in cur:
            id, tripgtfsid, stopgtfsid, scheduledarrival, arrivaldelay, polled_at = c
            sched = seconds_from_midnight_to_datetime(scheduledarrival, polled_at)
            if arrivaldelay - 60*2 > 0:
                late[sched.weekday()][(sched.hour*int(60/mins) -1) +int(sched.minute/mins)] += 1
            total[sched.weekday()][(sched.hour*int(60/mins) -1) +int(sched.minute/mins)] += 1
            
 
    for i, (late_row, total_row) in enumerate(zip(late, total)):
        for j, (late_h, total_h) in enumerate(zip(late_row, total_row)):
            if total_h > 0:
                final[i][j] = late_h / total_h
    return final

def get_late_amount_per_n_mins_for_day(mins=20):
    n = (23 * int(60/mins) + int(59/mins))
    late  = [[0] * n for i in range(7)]
    total = [[0] * n for i in range(7)]
    final = [[0] * n for i in range(7)]   
    with DBWrapper(password=password) as cur: 
        cur.execute("SELECT * FROM polls")
        for c in cur:
            id, tripgtfsid, stopgtfsid, scheduledarrival, arrivaldelay, polled_at = c
            sched = seconds_from_midnight_to_datetime(scheduledarrival, polled_at)
            if arrivaldelay > 0:
                late[sched.weekday()][(sched.hour*int(60/mins) -1) +int(sched.minute/mins)] += arrivaldelay
                total[sched.weekday()][(sched.hour*int(60/mins) -1) +int(sched.minute/mins)] += 1
            
 
    for i, (late_row, total_row) in enumerate(zip(late, total)):
        for j, (late_h, total_h) in enumerate(zip(late_row, total_row)):
            if total_h > 0:
                final[i][j] = late_h / total_h
    return final

    
def get_heatmap(mins=20):
    heatmap_seed = get_late_amount_per_n_mins_for_day(mins)
    heatmap_seed.reverse()
    # Shift 00-01 to end 
    ylabels = ['Sunday', 'Saturday', 'Friday', 'Thursday', 'Wednesday', 'Tuesday', 'Monday']

    x_axis =[]
    for i in range(1, 25):
        for j in range(0, int(60/mins)):
            x_axis.append(f"{i}:{j*mins}")
    for row in heatmap_seed:
        for i in range(0, int(60/mins)):
            row.append(row.pop(0))
        
    trace = go.Heatmap(z=heatmap_seed,
                   y=ylabels,
                   x=x_axis
                   )# colorscale=[[0, 'rgb(50,200,50)'], [1, 'rgb(200,50,0)']])
    data=[trace]
    py.iplot(data, filename='labelled-heatmap3')

    
def get_avg_delay_betveen_stops():
    with DBWrapper(password=password) as cur: 
        cur.execute("SELECT * FROM polls ORDER BY tripgtfsid, scheduledarrival, polled_at;")
        previous = next(cur)
        data = {}
        for c in cur:
            id, tripgtfsid, stopgtfsid, scheduledarrival, arrivaldelay, polled_at = c
            prev_id, prev_tripgtfsid, prev_stopgtfsid, prev_scheduledarrival, prev_arrivaldelay, prev_polled_at = previous
            if (stopgtfsid, prev_stopgtfsid) not in data:
                data[(stopgtfsid, prev_stopgtfsid)] = 0
            if stopgtfsid != prev_stopgtfsid and tripgtfsid == prev_tripgtfsid and scheduledarrival > prev_scheduledarrival:
               data[(stopgtfsid, prev_stopgtfsid)] += arrivaldelay - prev_arrivaldelay
        with open("asdf.csv", "w") as a:
            for (s, l), value in data.items():
                a.write(f"{s} - {l},{value}\n")
if __name__ == "__main__":
    print("Hello World")

