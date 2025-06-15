from flask import Flask, request, jsonify
from flask_cors import CORS
import subprocess
import json
import traceback
from datetime import datetime # Added for date tracking

app = Flask(__name__)
CORS(app)

# --- Start of new chat limit feature ---
# In-memory storage for chat counts.
# This will reset if the Flask server restarts.
# For persistent storage, a database would be needed.
user_chat_counts = {}
DAILY_CHAT_LIMIT = 5 # Set your desired daily chat limit here
# --- End of new chat limit feature ---

@app.route('/api/ai/chat', methods=['POST'])
def chat_with_ai():
    # --- Start of new chat limit logic ---
    user_ip = request.remote_addr  # Get the user's IP address
    current_date = datetime.now().strftime('%Y-%m-%d') # Get today's date

    # Initialize or reset the user's chat count for the current day
    if user_ip not in user_chat_counts or user_chat_counts[user_ip]['last_chat_date'] != current_date:
        user_chat_counts[user_ip] = {'count': 0, 'last_chat_date': current_date}

    # Check if the user has reached their daily chat limit
    if user_chat_counts[user_ip]['count'] >= DAILY_CHAT_LIMIT:
        print(f"🚫 Chat limit exceeded for IP: {user_ip}")
        return jsonify({
            'reply': 'Sorry, your daily chat limit has been reached. Please come back tomorrow for more chances!'
        }), 200 # Return 200 OK with the message so the frontend displays it as a bot reply
    # --- End of new chat limit logic ---

    try:
        data = request.get_json()
        message = data.get('message')

        if not message:
            return jsonify({'error': 'No message provided'}), 400

        # --- New: Increment chat count after a valid message is received, before AI call ---
        user_chat_counts[user_ip]['count'] += 1
        print(f"📊 IP: {user_ip} | Chat Count: {user_chat_counts[user_ip]['count']}/{DAILY_CHAT_LIMIT}")
        # --- End of new logic ---

        # ✅ Run Node.js script
        result = subprocess.run(
            ['node', 'flaskBridge.js', message],
            capture_output=True, text=True
        )

        print("🔁 STDOUT:", result.stdout)
        print("⚠️ STDERR:", result.stderr)

        if result.returncode != 0:
            # Note: If the Node.js script fails here, this chat still counts against the limit.
            # You might choose to decrement the count in a real app if you only want to count successful AI responses.
            return jsonify({
                'error': 'Gemini Node script failed',
                'details': result.stderr
            }), 500

        return jsonify({'reply': result.stdout.strip()})

    except Exception as e:
        traceback.print_exc()
        # Note: If an unhandled error occurs in the Flask route, this chat might still count.
        return jsonify({'error': 'Server error', 'details': str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000, debug=True)