from pymongo import Connection
from bson.json_util import dumps
from datetime import datetime
import json


conn = Connection()
db = conn.tourliste
tours = db.tours

def get_max_tourid():
	maxresult = tours.find_one(sort=[("tourid", -1)])
	maxresult["_id"] = None
	return maxresult["tourid"]

def insert_tour(data):
	tours.insert(data)

# data:{"name":name,"score":score}
def update_score(data):
    tours.update({"tourid":data["tourid"]},{"$set":data})

def find_tour(tourid):
	cursor = tours.find({"tourid":tourid})
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