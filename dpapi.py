#coding=utf-8

import hashlib
import urllib
import json

#请替换appkey和secret
appkey = "99363573"
secret = "ed0bd10ced81469e8ec54e27f951e5bd"
apiUrl = "http://api.dianping.com/v1/business/find_businesses"

def get_nearby_dpinfo(query_data):
	paramSet = []
	paramSet.append(("format", "json"))
	paramSet.append(("city", "上海"))
	if("latitude" in query_data):
		paramSet.append(("latitude", query_data["latitude"].encode("utf-8")))
		paramSet.append(("offset_type", "0"))
	if("longitude" in query_data):
		paramSet.append(("longitude", query_data["longitude"].encode("utf-8")))
	paramSet.append(("category", query_data["category"].encode("utf-8")))
	paramSet.append(("limit", "20"))

	if("keyword" in query_data):
		paramSet.append(("sort", "1"))
	else:
		paramSet.append(("sort","7"))
	if("keyword" in query_data):
		paramSet.append(("keyword",query_data["keyword"].encode("utf-8")))

	#参数排序与拼接
	paramMap = {}
	for pair in paramSet:
		paramMap[pair[0]] = pair[1]

	codec = appkey
	for key in sorted(paramMap.iterkeys()):
		codec += key + paramMap[key]

	codec += secret

	#签名计算
	sign = (hashlib.sha1(codec).hexdigest()).upper()

	#拼接访问的URL
	url_trail = "appkey=" + appkey + "&sign=" + sign
	for pair in paramSet:
		url_trail += "&" + pair[0] + "=" + pair[1]

	requestUrl = apiUrl + "?" + url_trail

	#模拟请求
	print requestUrl
	response = urllib.urlopen(requestUrl)

	return json.loads(response.read())["businesses"]