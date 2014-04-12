#coding=utf-8

from flask import Flask, jsonify
from flask import request
import dpapi
import mongocli
import json

app = Flask(__name__)

@app.route('/tourlist/api/<int:planid>', methods = ['GET'])
def get_task(planid):
    data =  mongocli.find_tour(planid)
    if(data):
    	data['_id'] = None
    	return jsonify(data)
    else:
    	return jsonify({"result":"none"})

@app.route('/tourlist/api/add', methods = ['POST'])
def add_task():
	max_planid = mongocli.get_max_planid()+1
	mongocli.insert_tour({"planid":max_planid})
	return jsonify({"planid":max_planid})

@app.route('/tourlist/api/<int:planid>',methods=['PUT'])
def update_tour(planid):
	if not request.json:
		abort(400)
	else:
		mongocli.update_tour(request.json)
		return jsonify({"result":"success"})

@app.route('/tourlist/api/searchdpshop',methods=['GET'])
def get_search_dpshop():
	if not request.args.get('query'):
		return jsonify({"result":"badrequest"})
	else:
		query = json.loads(request.args.get('query'))
		return (json.dumps(dpapi.get_nearby_dpinfo(query)))

if __name__ == "__main__":
    app.run(debug = True)