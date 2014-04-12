from pymongo import Connection
from bson.json_util import dumps
from datetime import datetime
import json


conn = Connection()
db = conn.tourliste
tours = db.tours

def get_max_planid():
	maxresult = tours.find_one(sort=[("planid", -1)])
	if "planid" in maxresult:
		maxresult["_id"] = None
		return maxresult["planid"]
	else:
		return 0

def insert_tour(data):
	tours.insert(data)

# data:{"name":name,"score":score}
def update_tour(data):
    tours.update({"planid":data["planid"]},{"$set":data})

def find_tour(planid):
	cursor = tours.find({"planid":planid})
	if cursor.count() >0:
		return cursor[0]
	else:
		return None


# def find_and_remove_crazy():
# 	w = dumps(crazy.find())
# 	crazy.remove()
# 	return w

# def modify_crazy(data):
# 	crazy.update({"name":data["name"]},{"$set":{"data":data}},upsert=True)