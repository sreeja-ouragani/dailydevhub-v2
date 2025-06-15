# app.py
from flask import Flask, request, jsonify
from flask_cors import CORS
import subprocess
import traceback
from datetime import datetime

app = Flask(__name__)
CORS(app)

# --- User-specific chat limit logic ---
user_chat_counts = {}
DAILY_CHAT_LIMIT = 5

@app.route('/api/ai/chat', methods=['POST'])
def chat_with_ai():
    try:
        data = request.get_json()
        message = data.get('message')
        username = data.get('username')  # ✅ Get the username from the frontend

        if not message or not username:
            return jsonify({'error': 'Message or username not provided'}), 400

        current_date = datetime.now().strftime('%Y-%m-%d')

        # Initialize or reset user count
        if username not in user_chat_counts or user_chat_counts[username]['last_chat_date'] != current_date:
            user_chat_counts[username] = {'count': 0, 'last_chat_date': current_date}

        # Check limit
        if user_chat_counts[username]['count'] >= DAILY_CHAT_LIMIT:
            print(f"🚫 Limit reached for user: {username}")
            return jsonify({
                'reply': 'Sorry, your daily chat limit has been reached. Please come back tomorrow!'
            }), 200

        # Increment usage
        user_chat_counts[username]['count'] += 1
        print(f"📊 {username} used {user_chat_counts[username]['count']}/{DAILY_CHAT_LIMIT} chats today")

        # Run Node.js script
        result = subprocess.run(
            ['node', 'flaskBridge.js', message],
            capture_output=True, text=True
        )

        if result.returncode != 0:
            return jsonify({
                'error': 'Gemini Node script failed',
                'details': result.stderr
            }), 500

        return jsonify({'reply': result.stdout.strip()})

    except Exception as e:
        traceback.print_exc()
        return jsonify({'error': 'Server error', 'details': str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000, debug=True)
