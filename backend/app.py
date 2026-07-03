from flask import Flask, request, jsonify
from flask_cors import CORS
from optimizer import optimize_python_code

app = Flask(__name__)
# Enable CORS for all routes so the React frontend can query it freely
CORS(app)

@app.route('/api/status', methods=['GET'])
def status():
    return jsonify({"status": "online", "message": "Python Optimizer Service is active."})

@app.route('/api/optimize', methods=['POST'])
def optimize():
    data = request.get_json()
    if not data or 'code' not in data:
        return jsonify({"error": "Missing 'code' in request body"}), 400

    code = data['code']
    try:
        result = optimize_python_code(code)
        return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    # Start server on port 5000
    app.run(host='0.0.0.0', port=5000, debug=True)
