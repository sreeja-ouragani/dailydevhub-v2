from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
from datetime import datetime
import traceback
import os

app = Flask(__name__)
CORS(app)

user_chat_counts = {}
DAILY_CHAT_LIMIT = 5
NODE_API_URL = os.getenv("NODE_API_URL")  # 👀 Should be defined in Render as env var

@app.route('/')
def index():
    return "Flask AI backend is running! ✨", 200

@app.route('/api/ai/chat', methods=['POST'])
def chat_with_ai():
    try:
        # Step 1: Log incoming request
        data = request.get_json()
        print("📥 Incoming JSON:", data)

        message = data.get('message')
        username = data.get('username')
        print("🔍 Message:", message)
        print("👤 Username:", username)

        if not message or not username:
            print("❗ Missing message or username")
            return jsonify({'error': 'Message or username not provided'}), 400

        current_date = datetime.now().strftime('%Y-%m-%d')

        # Step 2: Handle user chat count
        if username not in user_chat_counts or user_chat_counts[username]['last_chat_date'] != current_date:
            user_chat_counts[username] = {'count': 0, 'last_chat_date': current_date}

        if user_chat_counts[username]['count'] >= DAILY_CHAT_LIMIT:
            print(f"🚫 Limit reached for user: {username}")
            return jsonify({
                'reply': 'Sorry, your daily chat limit has been reached. Please come back tomorrow!'
            }), 200

        user_chat_counts[username]['count'] += 1
        print(f"📊 {username} used {user_chat_counts[username]['count']}/{DAILY_CHAT_LIMIT} chats today")

        # Step 3: Verify NODE_API_URL
        print("🌐 NODE_API_URL:", NODE_API_URL)
        if not NODE_API_URL:
            print("❌ NODE_API_URL is not set. Check environment variables.")
            return jsonify({'error': 'NODE_API_URL is not set on the server'}), 500

        # Step 4: Send request to Node backend
        response = requests.post(NODE_API_URL, json={"message": message, "username": username})
        print("🔁 Node server response:", response.status_code, response.text)

        if response.status_code != 200:
            return jsonify({'error': 'Node.js server error', 'details': response.text}), 500

        return jsonify(response.json())

    except Exception as e:
        print("❌ Exception occurred in chat_with_ai():", str(e))
        traceback.print_exc()
        return jsonify({'error': 'Server error', 'details': str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000, debug=True)
