from http.server import BaseHTTPRequestHandler
import json
import sys
import os

# Use relative import for the utils file in the same directory
from ._utils import get_prompt_template, generate_gemini_note

class handler(BaseHTTPRequestHandler):
    def do_POST(self):
        content_length = int(self.headers.get('Content-Length', 0))
        post_data = self.rfile.read(content_length)
        
        try:
            data = json.loads(post_data.decode('utf-8'))
        except json.JSONDecodeError:
            self.send_response(400)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({"error": "Invalid JSON"}).encode('utf-8'))
            return
        
        feature = data.get('feature', '')
        if not feature or not isinstance(feature, str):
            self.send_response(400)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({"error": "feature is missing or empty string"}).encode('utf-8'))
            return
            
        if len(feature) > 500:
            self.send_response(400)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({"error": "feature exceeds 500 characters"}).encode('utf-8'))
            return
        
        heads_label = data.get('headsLabel', 'Heads')
        tails_label = data.get('tailsLabel', 'Tails')
        heads_score = data.get('headsScore', 0)
        tails_score = data.get('tailsScore', 0)
        total_tosses = data.get('totalTosses', 1)
        
        winner = heads_label if heads_score > tails_score else tails_label
        
        prompt_template = get_prompt_template()
        prompt = prompt_template.format(
            heads_label=heads_label,
            tails_label=tails_label,
            total_tosses=total_tosses,
            heads_score=heads_score,
            tails_score=tails_score,
            winner=winner
        )
        
        note = generate_gemini_note(prompt)
        
        response_data = {"note": note}
        self.send_response(200)
        self.send_header('Content-Type', 'application/json')
        self.end_headers()
        self.wfile.write(json.dumps(response_data).encode('utf-8'))
