#encoding=utf-8
import oauthutil
import json
import mongocli

def login(code):
	user_info = json.loads(oauthutil.get_access_token(code))
	# user_info = {"access_token":"f96cb3eafeafb2fcec461bc0fc0f18f4","douban_user_name":"钱满","douban_user_id":"1645074","expires_in":604800,"refresh_token":"c0f559775cb7374c42e00c661625a5e4"}
	print user_info
	if "douban_user_id" in user_info:
		if mongocli.is_newbie(user_info.get("douban_user_id")) is True: 
			userdata = {
				"user_id":user_info["douban_user_id"],
				"douban_user_name":user_info["douban_user_name"],
				"douban_token":user_info["access_token"]
			}
			mongocli.add_user(userdata)
		return user_info.get("douban_user_id")
	else:
		return False
