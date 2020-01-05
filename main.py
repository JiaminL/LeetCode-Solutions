import sys
import os
import getpass
import sqlite3
import requests
from requests.exceptions import HTTPError


class LeetCodeDatabase:
    def __init__(self, filename):
        self.db = sqlite3.connect(filename)

    def __del__(self):
        self.db.close()

    def create_all(self):
        self.db.execute("""CREATE TABLE IF NOT EXISTS
        `questions` (
            id INTEGER PRIMARY KEY,
            titleSlug TEXT
        )""")
        self.db.execute("""CREATE TABLE IF NOT EXISTS
        `solutions` (
            id INTEGER PRIMARY KEY,
            questionId INTEGER,
            language TEXT,
            code TEXT,
            source TEXT
        )""")
        self.db.commit()


class LeetCodeClient:
    DATA_FILE = "data.json"

    def __init__(self):
        self.client = requests.Session()

        self.db = LeetCodeDatabase("data.db")
        self.db.create_all()

    def prepare_data(self):
        if os.path.exists(self.DATA_FILE):
            return
        # Fetch problems list from iBug/LeetCode-Problems
        response = requests.get("https://github.com/iBug/LeetCode-Problems/releases/download/data/data.json")
        if response.status_code != 200:
            raise HTTPError(f"Failed to download data.json, response: {response.status_code}")
        with open(self.DATA_FILE, "wb") as f:
            f.write(response.content)

    def login(self, username, password):
        login_url = 'https://leetcode.com/accounts/login/'
        self.client.get(login_url)
        data = {'login': username, 'password': password, 'csrfmiddlewaretoken': self.client.cookies['csrftoken']}
        headers = {
            'Referer': login_url,
            'X-CSRFToken': self.client.cookies['csrftoken'],
        }
        response = self.client.post(login_url, json=data, headers=headers)
        if response.status_code != 200:
            raise HTTPError(f"Login failed, code: {response.status_code}")

    def fetch_code(uuid: str):
        payload = {
            "operationName": "fetchPlayground",
            "variables": {},
            "query": 'query fetchPlayground { playground(uuid: "CLZq9vzU") { testcaseInput name isUserOwner isLive showRunCode showOpenInPlayground selectedLangSlug isShared __typename } allPlaygroundCodes(uuid: "CLZq9vzU") { code langSlug __typename }}'
        }
