#coding=utf-8

from flask import request,abort, redirect, url_for,Flask, jsonify, url_for
from util import mongocli,loginutil
from api import doubanapi,dpapi
import json

app = Flask(__name__, static_url_path='')

@app.route('/tourlist/api/all')
def get_all_plan():
	data = [{
		"title": "title" in data and data["title"] or None,
		"id": data["planid"],
		"date": "date" in data and data["date"] or None,
		"cards": "cards" in data and data["cards"] or []
	} for data in mongocli.tours.find({
		"title":{
			"$exists": True
		}
	})]
	if(data):
		return jsonify({"plans":data})
	else:
		return jsonify({"plans":[]})


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
		request.json["planid"]=planid
		mongocli.update_tour(request.json)
		return jsonify({"result":"success"})

@app.route('/tourlist/api/searchdpshop', methods=['GET'])
def get_search_dpshop():
	if not request.args.get('category'):
		abort(400)
	else:
		query = request.args
		return (json.dumps(dpapi.get_nearby_dpinfo(query)))

@app.route('/tourlist/api/searchdoubanevent',methods=['GET'])
def get_douban_events():
	if not request.args.get('date'):
		return abort(400)
	else:
		query = request.args.get('date')
		return json.dumps(doubanapi.get_douban_eventlist(query))

@app.route('/')
def index():
	# return url_for('static', filename='style.css')
	return app.send_static_file('html/index.html')
	# return "aeqwe"


@app.route('/plans/<int:planid>/edit')
def edit(planid):
	return app.send_static_file('html/edit.html')

@app.route('/plans/<int:planid>')
def view(planid):
	return app.send_static_file('html/preview.html')

#auth page
@app.route('/oauth/douban')
def cookie_insertion():
	code = request.args.get("code")
	login = loginutil.login(code)
	if login is False:
		abort(401)
	else:
		app.logger.debug(login)
		redirect_to_index = redirect('/plans/1')
		response = app.make_response(redirect_to_index)  
		response.set_cookie('user',value=login)
 	return response

#error_page
@app.errorhandler(400)
def bad_request(error):
    return app.send_static_file('html/error.html')

@app.errorhandler(401)
def not_auth(error):
    return app.send_static_file('html/error.html')


if __name__ == "__main__":
	app.run(port=80)
