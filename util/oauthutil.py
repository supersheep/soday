import requests

consumer_key           = "0d0690ea685259262713b2bf38f70b72"
consumer_secret        = "bf6e552666db43a0"
ACCESS_URL = 'https://www.douban.com/service/auth2/token'


def get_access_token(code):
	data = {
		"client_id":consumer_key,
		"client_secret":consumer_secret,
		"redirect_uri":"http://localhost:5000",
		"grant_type":"authorization_code",
		"code":code
	}
	r = requests.post('https://www.douban.com/service/auth2/token',data = data)
	return  r.content
	

