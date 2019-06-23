import sys
import json
import time

from requests import get
from requests.exceptions import RequestException
from contextlib import closing
from bs4 import BeautifulSoup
#######################
### REQUEST HELPERS ###
#######################

### PARSE URL ###
def parse(stuff):
    return BeautifulSoup(stuff, "html.parser")

### GET REQUEST, FETCH URL ###
def simple_get(url):
    """
    Attempts to get the content at `url` by making an HTTP GET request.
    If the content-type of response is some kind of HTML/XML, return the
    text content, otherwise return None.
    """
    try:
        with closing(get(url, stream=True)) as resp:
            if is_good_response(resp):
                return resp.content
            else:
                return None

    except RequestException as e:
        log_error('Error during requests to {0} : {1}'.format(url, str(e)))
        return None

def is_good_response(resp):
    """
    Returns True if the response seems to be HTML, False otherwise.
    """
    content_type = resp.headers['Content-Type'].lower()
    return (resp.status_code == 200
            and content_type is not None
            and content_type.find('html') > -1)

def log_error(e):
    """
    It is always a good idea to log errors.
    This function just prints them, but you can
    make it do anything.
    """
    print(e)


######################
### FULL LIST PAGE ###
###     PARSING    ###
######################

### GET ALL CELLS FROM A SINGLE RUNNER'S ROW OF DATA ###
def get_row_data(row):
    data = row.select('td')
    return data

def get_runner_data(row):
    row_data = get_row_data(row)
    bib_number = row_data[3].text
    last_name = row_data[4].text
    first_name = row_data[5].text
    sex = row_data[6].text
    age = row_data[7].text
    link = row_data[4].select_one('a')['href']

    data_dict = {
        'link': link,
        'last_name': last_name,
        'first_name': first_name,
        'bib_number': bib_number,
        'sex': sex,
        'age': age,
        'data': [],
    }
    return data_dict

### GET THE LINK TO AN INDIVIDUAL RUNNER'S RESULTS PAGE ###
def get_runner_link(row):
    row = get_row_data(row)
    anchor_tag = row[4].select_one('a')
    return anchor_tag['href']

### GET THE RESULT DATA OF ALL RUNNERS ###
def get_results(page_data):
    return page_data.select('.result')

### GET THE LIST OF ALL INDIVIDUAL RUNNER PAGE LINKS ###
def get_all_runner_links(page_data):
    results = get_results(page_data)
    return list(map(get_runner_link, results))

def get_all_runner_data(page_data):
    results = get_results(page_data)
    return list(map(get_runner_data, results))

#######################
### INDIVIDUAL PAGE ###
###     PARSING     ###
#######################

_COLUMN_LABELS = [
    'time',
    'course_distance',
    'course_time',
    'course_pace',
    'interval_distance',
    'interval_time',
    'interval_pace',
    'chip_time_place_overall',
    'chip_time_place_sex',
    'chip_time_place_age'
]

_CHECKPOINT_LABELS = [
    'start',
    'first_quarter',
    'half_way',
    'three_quarter',
    '5k_to_go',
    '1_mile_to_go',
    'finish'
]

### GET ALL ROWS (1) ###
def get_single_runner_data_all_rows(data):

    ### (drop the first 2 since they don't have any data)
    return data.select('.splits.tabular tr')[2:]


### GET DATA FROM ALL CELLS IN A SINGLE ROW (2) ###
def format_single_row_cell_data(row_data):

        ### remove spacer columns from list ###
        cells = row_data.select('.td_num')

        ### initialize and populate dictionary ###
        cell_data = {}
        for(index, value) in enumerate(cells):
            label = _COLUMN_LABELS[index]
            cell_data[label] = value.text

        return cell_data


### LABEL ALL ROWS WITH CHECKPOINT NAME ###
def format_checkpoints(rows):
    all_rows = {}
    for (index, row) in enumerate(rows):
        label = _CHECKPOINT_LABELS[index]
        formatted_row = format_single_row_cell_data(row)
        all_rows[label] = (formatted_row)

    return all_rows

#######################
### JSON CONVERSION ###
#######################

def append_runner_data(data_dict, runner):
    data_dict['data'].append(runner)
    return data_dict

def write_to_file(data):
    with open('revel-marathon.json', 'w') as json_file:
        json.dump(data, json_file)


###########################
### DATA FETCHING LOGIC ###
###########################

### ALL RESULTS PAGE ###
# revel_full_list_url = 'https://www.runrevel.com/rdv/results?sort=&race=166515&event=Marathon&gender=&division=&search=&page_166640=1&size_166640=100000'
all_runners_page = parse(simple_get(revel_full_list_url))

all_runners = get_all_runner_data(all_runners_page)
all_runners_length = len(all_runners)

# TODO consolidate/refactor this
for i, runner in enumerate(all_runners):
    print('FETCHING DATA FOR:', runner['last_name'] + ', ' + runner['first_name'], i + 1, ' of ', all_runners_length)
    page_link = runner['link']
    revel_single_runner_page = parse(simple_get(page_link))
    single_runner_all_rows = get_single_runner_data_all_rows(revel_single_runner_page)
    all_singe_runner_results_data = format_checkpoints(single_runner_all_rows)
    append_runner_data(runner, all_singe_runner_results_data)
    print('DONE')
    time.sleep(1)

write_to_file(all_runners)

### SINGLE RUNNER PAGE ###
# sample_link = 'https://www.runrevel.com/rdv/results?pk=1580643'
# revel_single_runner_page = parse(simple_get(sample_link))
# single_runner_all_rows = get_single_runner_data_all_rows(revel_single_runner_page)
# output = format_checkpoints(single_runner_all_rows)
# print(output)

######################
### EXAMPLE OUTPUT ###
######################

#   (1) FORMAT_SINGLE_ROW_CELL_DATA
#   {
#       'time': '6:00:01AM'
#       'course_distance': '0.0'
#       'course_time': '00:00.00'
#       'course_pace': ''
#       'interval_distance': '0.0'
#       'interval_time': ''
#       'interval_pace': ''
#       'chip_time_place_overall': '4'
#       'chip_time_place_sex': '3 M'
#       'chip_time_place_age': ''
#    }

#   (2) GET_SINGLE_RUNNER_DATA_ALL_ROWS
#   {
#       'start': {
#           'time': '6:00:01AM',
#           'course_distance': '0.0',
#           'course_time': '00:00.00',
#           'course_pace': '',
#           'interval_distance': '0.0',
#           'interval_time': '',
#           'interval_pace': '',
#           'chip_time_place_overall': '4',
#           'chip_time_place_sex': '3 M',
#           'chip_time_place_age': ''
#       },
#       'first_quarter': {
#           'time': '6:38:09AM',
#           'course_distance': '6.55',
#           'course_time': '38:08.31',
#           'course_pace': '5:49',
#           'interval_distance': '6.55',
#           'interval_time': '38:08.31',
#           'interval_pace': '5:49',
#           'chip_time_place_overall': '1',
#           'chip_time_place_sex': '1 M',
#           'chip_time_place_age': ''
#       },
#       'half_way': {
#           'time': '7:15:27AM',
#           'course_distance': '13.1',
#           'course_time': '1:15:25.93',
#           'course_pace': '5:45',
#           'interval_distance': '6.55',
#           'interval_time': '37:17.61',
#           'interval_pace': '5:41',
#           'chip_time_place_overall': '1',
#           'chip_time_place_sex': '1 M',
#           'chip_time_place_age': ''
#       },
#       'three_quarter': {
#           'time': '7:54:30AM',
#            'course_distance': '19.65',
#            'course_time': '1:54:29.39',
#            'course_pace': '5:49',
#            'interval_distance': '6.55',
#            'interval_time': '39:03.46',
#            'interval_pace': '5:57',
#            'chip_time_place_overall': '1',
#            'chip_time_place_sex': '1 M',
#            'chip_time_place_age': ''
#        },
#       '5k_to_go': {
#           'time': '8:16:57AM',
#           'course_distance': '23.1',
#           'course_time': '2:16:56.81',
#           'course_pace': '5:55',
#           'interval_distance': '3.45',
#           'interval_time': '22:27.42',
#           'interval_pace': '6:30',
#           'chip_time_place_overall': '1',
#           'chip_time_place_sex': '1 M',
#           'chip_time_place_age': ''
#       },
#       '1_mile_to_go': {
#           'time': '8:30:24AM',
#           'course_distance': '25.2',
#           'course_time': '2:30:23.85',
#           'course_pace': '5:58',
#           'interval_distance': '2.1',
#           'interval_time': '13:27.03',
#           'interval_pace': '6:24',
#           'chip_time_place_overall': '1',
#           'chip_time_place_sex': '1 M',
#           'chip_time_place_age': ''
#       },
#       'finish': {
#           'time': '8:37:35AM',
#           'course_distance': '26.2',
#           'course_time': '2:37:34.24',
#           'course_pace': '6:00',
#           'interval_distance': '1.0',
#           'interval_time': '07:10.38',
#           'interval_pace': '7:10',
#           'chip_time_place_overall': '1',
#           'chip_time_place_sex': '1 M',
#           'chip_time_place_age': ''
#       }
#   }