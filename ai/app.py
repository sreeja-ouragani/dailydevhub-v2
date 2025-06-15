from flask import Flask, request, jsonify
from flask_cors import CORS
import subprocess
import json
import traceback  # for full error logs

app = Flask(__name__)  # ✅ Corrected: __name__ (with double underscores)
CORS(app)  # Enable CORS for development

@app.route('/api/ai/chat', methods=['POST'])
def chat_with_ai():
    try:
        data = request.get_json()
        message = data.get('message')

        if not message:
            return jsonify({'error': 'No message provided'}), 400

        # ✅ Run Node.js script
        result = subprocess.run(
            ['node', 'flaskBridge.js', message],
            capture_output=True, text=True
        )

        print("🔁 STDOUT:", result.stdout)
        print("⚠️ STDERR:", result.stderr)

        if result.returncode != 0:
            return jsonify({
                'error': 'Gemini Node script failed',
                'details': result.stderr
            }), 500

        return jsonify({'reply': result.stdout.strip()})

    except Exception as e:
        traceback.print_exc()  # prints full traceback in terminal
        return jsonify({'error': 'Server error', 'details': str(e)}), 500

if __name__ == '__main__':  # ✅ Corrected: __main__ (double underscores)
    app.run(host='0.0.0.0', port=8000, debug=True)
