from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
from datetime import datetime
import traceback  # Optional but helpful for debugging

app = Flask(__name__)
CORS(app)

user_chat_counts = {}
DAILY_CHAT_LIMIT = 5
NODE_API_URL = "https://dailydevhub-v2.onrender.com/api/ai/chat"

@app.route('/api/ai/chat', methods=['POST'])
def chat_with_ai():
    try:
        data = request.get_json()
        message = data.get('message')
        username = data.get('username')

        if not message or not username:
            return jsonify({'error': 'Message or username not provided'}), 400

        current_date = datetime.now().strftime('%Y-%m-%d')

        # Reset chat count if it's a new day
        if username not in user_chat_counts or user_chat_counts[username]['last_chat_date'] != current_date:
            user_chat_counts[username] = {'count': 0, 'last_chat_date': current_date}

        if user_chat_counts[username]['count'] >= DAILY_CHAT_LIMIT:
            print(f"🚫 Limit reached for user: {username}")
            return jsonify({
                'reply': 'Sorry, your daily chat limit has been reached. Please come back tomorrow!'
            }), 200

        user_chat_counts[username]['count'] += 1
        print(f"📊 {username} used {user_chat_counts[username]['count']}/{DAILY_CHAT_LIMIT} chats today")

        # 🔁 Call the Node.js AI backend via HTTP
        response = requests.post(NODE_API_URL, json={"message": message, "username": username})
        if response.status_code != 200:
            return jsonify({'error': 'Node.js server error', 'details': response.text}), 500

        return jsonify(response.json())

    except Exception as e:
        traceback.print_exc()
        return jsonify({'error': 'Server error', 'details': str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000, debug=True)
