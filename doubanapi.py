from douban_client import DoubanClient
import mongocli
import json

API_KEY = '0d0690ea685259262713b2bf38f70b72'
API_SECRET = 'bf6e552666db43a0'
SCOPE = 'event_basic_r'
ACCESS_TOKEN = 'd8f759aa3b25ece68ae60cfeb171c6b2'

client = DoubanClient(API_KEY, API_SECRET, 'http://soday.spud.in', SCOPE)

client.auth_with_password('x@x.com','xxxx')

def get_douban_eventlist(date):
	#find solidify event
	solidify_event = mongocli.find_douban_eventlist(date)
	if solidify_event is None:
		event =  client.event.list(108296, 'day', 'all', date, 15)
		mongocli.save_douban_eventlist({"date":date,"event":event})
		return event
	else:
		return solidify_event
