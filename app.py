#coding=utf-8

from flask import Flask, jsonify, url_for
from flask import request
import dpapi
import mongocli
import json

app = Flask(__name__, static_url_path='')

@app.route('/tourlist/api/<int:tourid>', methods = ['GET'])
def get_task(tourid):
	data =  mongocli.find_tour(tourid)
	if(data):
		data['_id'] = None
		return jsonify(data)
	else:
		return jsonify({"result":"none"})

@app.route('/tourlist/api/add', methods = ['POST'])
def add_task():
	max_tourid = mongocli.get_max_tourid()+1
	mongocli.insert_tour({"tourid":max_tourid})
	return jsonify({"result":"success"})

@app.route('/tourlist/api/<int:tourid>',methods=['PUT'])
def update_tour(tourid):
	if not request.json:
		abort(400)
	else:
		mongocli.update_tour(request.json)

@app.route('/tourlist/api/searchdpshop', methods=['GET'])
def get_search_dpshop():
	if not request.args.get('query'):
		return jsonify({"result":"badrequest"})
	else:
		query = json.loads(request.args.get('query'))
		return (json.dumps(dpapi.get_nearby_dpinfo(query)))

@app.route('/')
def index():
	# return url_for('static', filename='style.css')
	return  app.send_static_file('html/index.html')
	# return "aeqwe"
if __name__ == "__main__":
	app.run(debug = True)