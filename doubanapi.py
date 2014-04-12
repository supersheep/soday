from douban_client import DoubanClient
import json

API_KEY = '0edf141a4222a0f22c9d3c4ec667e2d6'
API_SECRET = '4d8dde0c68325e53'
SCOPE = 'event_basic_r'
ACCESS_TOKEN = 'd8f759aa3b25ece68ae60cfeb171c6b2'

client = DoubanClient(API_KEY, API_SECRET, 'http://soday.spud.in', SCOPE)



client.auth_with_token(ACCESS_TOKEN)

print client.event.list(108296, 'week', 'all', '2014-04-10', 1)