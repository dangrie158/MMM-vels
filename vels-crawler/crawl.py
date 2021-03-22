import json
from datetime import datetime

from bs4 import BeautifulSoup
import requests
from influxdb import InfluxDBClient


URL = 'https://www.boulderado.de/boulderadoweb/gym-clientcounter/index.php?mode=get&token=eyJhbGciOiJIUzI1NiIsICJ0eXAiOiJKV1QifQ.eyJjdXN0b21lciI6InZlbHNzdHV0dGdhcnQyNzIwMTkifQ.NxmqnR3YpytZLchLIStdahLp8Fr3SkYxcd4MRzYqFXA'

client = InfluxDBClient('192.168.178.150', 8086,
                        'telegraf', 'telegraf', 'telegraf')

page = requests.get(URL)
soup = BeautifulSoup(page.text, 'html.parser')

data = {}
for count_value in ('act', 'free'):
    count_string = soup.find(
        'div', {'class': f'{count_value}counter-content'}).find('span').text
    count = int(count_string)
    data[count_value] = count

new_point = {
    "measurement": "boulder_center_utilization",
    "tags": {
        "location": "vels",
    },
    "time": datetime.utcnow().isoformat(),
    "fields": {
        "free": data["free"],
        "active": data["act"],
    }
}

client.write_points([new_point])
