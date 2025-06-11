from flask import Flask, request, jsonify
from flask_cors import CORS
import subprocess
import json

app = Flask(__name__)
CORS(app)  # Enable CORS for development

@app.route('/api/ai/chat', methods=['POST'])
def chat_with_ai():
    try:
        data = request.get_json()
        message = data.get('message')

        if not message:
            return jsonify({'error': 'No message provided'}), 400

        # ✅ Run Node.js script inside ai/ directly
        result = subprocess.run(
            ['node', 'flaskBridge.js', message],  # ✅ Corrected: removed "ai/"
            capture_output=True, text=True
        )

        if result.returncode != 0:
            return jsonify({
                'error': 'Gemini Node script failed',
                'details': result.stderr
            }), 500

        return jsonify({'reply': result.stdout.strip()})

    except Exception as e:
        return jsonify({'error': 'Server error', 'details': str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000, debug=True)
