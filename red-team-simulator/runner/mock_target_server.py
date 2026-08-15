"""
OPTIONAL: A tiny fake guard API so you can test attack_runner.py end-to-end
RIGHT NOW, before your teammate's real firewall/proxy endpoint is ready.

It randomly "blocks" prompts containing a few obvious red flags, and lets
everything else through — just enough to prove the runner + report pipeline
works. Delete/ignore this once you're pointed at the real API.

Run:
  pip install flask
  python runner/mock_target_server.py
Then in another terminal:
  python runner/attack_runner.py
"""

from flask import Flask, request, jsonify

app = Flask(__name__)

SUSPICIOUS_WORDS = ["ignore all previous", "system prompt", "dan", "override", "api key", "secrets"]


@app.route("/api/chat", methods=["POST"])
def chat():
    data = request.get_json(force=True)
    message = data.get("message", "").lower()

    if any(word in message for word in SUSPICIOUS_WORDS):
        return jsonify({"status": "blocked", "reason": "matched suspicious pattern"}), 403

    return jsonify({"status": "ok", "reply": "This is a normal simulated response."}), 200


if __name__ == "__main__":
    app.run(port=8000)
