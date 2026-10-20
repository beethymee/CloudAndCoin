#!/usr/bin/env python3
"""
FinTrack AI - Vercel Python API entry point
"""
from http.server import BaseHTTPRequestHandler
import json

class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        self.send_response(200)
        self.send_header("Content-Type", "application/json")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.end_headers()
        response = {
            "status": "online",
            "runtime": "Python 3.10",
            "app": "FinTrack AI",
            "endpoints": ["/api/chat", "/api"]
        }
        self.wfile.write(json.dumps(response).encode("utf-8"))

def app(environ, start_response):
    status = "200 OK"
    headers = [("Content-Type", "application/json"), ("Access-Control-Allow-Origin", "*")]
    start_response(status, headers)
    return [json.dumps({"status": "online", "runtime": "Python 3.10"}).encode("utf-8")]

if __name__ == "__main__":
    print(json.dumps({"status": "online", "runtime": "Python 3.10"}))
