from pymongo import Connection
from bson.json_util import dumps
from datetime import datetime
import json


conn = Connection()
db = conn.tourliste
tours = db.tours

def get_max_planid():
	maxresult = tours.find_one(sort=[("planid", -1)])
	if maxresult and "planid" in maxresult:
		maxresult["_id"] = None
		print maxresult["planid"]
		return maxresult["planid"]
	else:
		print 0
		return 0

def insert_tour(data):
	tours.insert(data)

# data:{"name":name,"score":score}
def update_tour(data):
    tours.update({"planid":data["planid"]},{"$set":data})

def find_tour(planid):
	return tours.find_one({"planid":planid})


def find_all_tours():
	return tours.find()

# douban eventlist

doubanevent = db.doubanevent

def find_douban_eventlist(date):
	return doubanevent.find_one({"date":date})["event"]

def save_douban_eventlist(event):
	doubanevent.save(event)
