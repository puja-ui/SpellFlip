import os
import json
import urllib.request
import urllib.error

def load_env(filepath=os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), '.env')):
    try:
        with open(filepath, 'r') as f:
            for line in f:
                line = line.strip()
                if not line or line.startswith('#'):
                    continue
                if '=' in line:
                    key, value = line.split('=', 1)
                    os.environ[key.strip()] = value.strip()
    except FileNotFoundError:
        print(f"Warning: {filepath} not found.")

def get_prompt_template(filepath=os.path.join(os.path.dirname(os.path.abspath(__file__)), 'prompt.txt')):
    try:
        with open(filepath, 'r') as f:
            return f.read().strip()
    except FileNotFoundError:
        return "I played a coin toss game and the winner was '{winner}'. Please write a medieval magician note about this."

def generate_gemini_note(prompt):
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        return "Alas! The Magician's crystal ball is dark. The GEMINI_API_KEY incantation was not provided in the mystical environment variables."

    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite:generateContent?key={api_key}"
    
    payload = {
        "contents": [{
            "parts": [{
                "text": prompt
            }]
        }],
        "generationConfig": {
            "temperature": 0.3,
            "maxOutputTokens": 1500
        }
    }
    
    req = urllib.request.Request(
        url, 
        data=json.dumps(payload).encode('utf-8'),
        headers={'Content-Type': 'application/json'},
        method='POST'
    )
    
    try:
        with urllib.request.urlopen(req) as response:
            result = json.loads(response.read().decode('utf-8'))
            text = result.get('candidates', [{}])[0].get('content', {}).get('parts', [{}])[0].get('text', '')
            return text if text else "The spirits whisper indistinctly..."
    except urllib.error.URLError as e:
        print(f"Error calling Gemini API: {e}")
        return f"The ethereal connection is severed. The Magician senses an error: {str(e)}"
