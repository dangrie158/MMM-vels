import json
from datetime import datetime

from bs4 import BeautifulSoup
import requests

URL = 'https://www.boulderado.de/boulderadoweb/gym-clientcounter/index.php?mode=get&token=eyJhbGciOiJIUzI1NiIsICJ0eXAiOiJKV1QifQ.eyJjdXN0b21lciI6InZlbHNzdHV0dGdhcnQyNzIwMTkifQ.NxmqnR3YpytZLchLIStdahLp8Fr3SkYxcd4MRzYqFXA'

page = requests.get(URL)
soup = BeautifulSoup(page.text, 'html.parser')

data = {
    'date': datetime.utcnow().isoformat()
}

for count_value in ('act', 'free'):
    count_string = soup.find('div', {'class': f'{count_value}counter-content'}).find('span').text
    count = int(count_string)
    data[count_value] = count


with open(f'data.json', 'r') as in_file:
    old_data = json.load(in_file)

new_data = old_data + [data]

with open(f'data.json', 'w') as save_file:
    json.dump(new_data, save_file)