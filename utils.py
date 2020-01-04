import requests


def guess_lang(text):
    url = "http://dpaste.com/api/v2/guess-syntax/"
    response = requests.post(url, files={'content': (None, text)})
    if response.status_code != 200:
        # Something wrong
        return None
    return response.json()[1]
