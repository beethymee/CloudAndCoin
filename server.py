#!/usr/bin/env python3
"""
FinTrack AI - Pure Python Web Server
Serves the full web application, static client assets, and Python /api/ endpoints.
Run with: python3 server.py
"""

import os
import sys
import json
import mimetypes
from http.server import HTTPServer, SimpleHTTPRequestHandler
from urllib.parse import urlparse

# Add current directory to path so api.chat can be imported
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from api.chat import process_chat_request

PORT = int(os.environ.get("PORT", 3000))
DIST_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "dist")
ROOT_DIR = os.path.dirname(os.path.abspath(__file__))

class FinTrackPythonHandler(SimpleHTTPRequestHandler):
    def end_headers(self):
        # Enable CORS
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type, Authorization")
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(200)
        self.end_headers()

    def do_GET(self):
        parsed = urlparse(self.path)
        path = parsed.path

        if path == "/api" or path == "/api/":
            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.end_headers()
            data = {
                "status": "online",
                "runtime": "Python 3.10",
                "app": "FinTrack AI",
                "server": "server.py",
                "endpoints": ["/api/chat", "/api"]
            }
            self.wfile.write(json.dumps(data).encode("utf-8"))
            return

        # Serve static assets from dist if built, otherwise root
        base_dir = DIST_DIR if os.path.exists(DIST_DIR) else ROOT_DIR
        file_path = os.path.join(base_dir, path.lstrip("/"))

        if os.path.isfile(file_path):
            mime_type, _ = mimetypes.guess_type(file_path)
            self.send_response(200)
            self.send_header("Content-Type", mime_type or "application/octet-stream")
            self.end_headers()
            with open(file_path, "rb") as f:
                self.wfile.write(f.read())
            return

        # Fallback to index.html for SPA routing
        index_path = os.path.join(base_dir, "index.html")
        if os.path.isfile(index_path):
            self.send_response(200)
            self.send_header("Content-Type", "text/html")
            self.end_headers()
            with open(index_path, "rb") as f:
                self.wfile.write(f.read())
            return

        self.send_response(404)
        self.end_headers()

    def do_POST(self):
        parsed = urlparse(self.path)
        if parsed.path == "/api/chat":
            content_length = int(self.headers.get("Content-Length", 0))
            post_data = self.rfile.read(content_length)
            try:
                body = json.loads(post_data.decode("utf-8")) if post_data else {}
            except Exception:
                body = {}

            try:
                result = process_chat_request(body)
                response_json = json.dumps(result).encode("utf-8")
                self.send_response(200)
                self.send_header("Content-Type", "application/json")
                self.end_headers()
                self.wfile.write(response_json)
            except Exception as e:
                err = json.dumps({"error": str(e)}).encode("utf-8")
                self.send_response(500)
                self.send_header("Content-Type", "application/json")
                self.end_headers()
                self.wfile.write(err)
            return

        self.send_response(404)
        self.end_headers()

def run(host="0.0.0.0", port=PORT):
    server_address = (host, port)
    httpd = HTTPServer(server_address, FinTrackPythonHandler)
    print(f"🐍 FinTrack AI Python Server running on http://{host}:{port}")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nShutting down server.")
        httpd.server_close()

if __name__ == "__main__":
    port = int(sys.argv[1]) if len(sys.argv) > 1 else PORT
    run(port=port)
