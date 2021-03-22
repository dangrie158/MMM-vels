#!env python3

# migrate the old JSONL data file to the influx db

import json
from influxdb import InfluxDBClient

client = InfluxDBClient('grafana.local', 8086,
                        '<secret>', '<secret>', 'telegraf')


with open(f'data.json', 'r') as in_file:
    old_data = json.load(in_file)

data_points = []
for point in old_data:
    p = {
        "measurement": "boulder_center_utilization",
        "tags": {
            "location": "vels",
        },
        "time": point["date"],
        "fields": {
            "free": point["free"],
            "active": point["act"],
        }
    }

    data_points.append(p)

client.write_points(data_points)
