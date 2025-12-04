from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import json
import os
app = Flask(__name__)
CORS(app)
DATA_FILE = 'timetable_data.json'
def init_data_file():
    if not os.path.exists(DATA_FILE):
        with open(DATA_FILE, 'w') as f:
            json.dump({}, f)
def load_timetable():
    try:
        with open(DATA_FILE, 'r') as f:
            return json.load(f)
    except:
        return {}
def save_timetable(data):
    with open(DATA_FILE, 'w') as f:
        json.dump(data, f, indent=2)
@app.route('/')
def index():
    return send_from_directory('.', 'index.html')
@app.route('/<path:path>')
def serve_static(path):
    return send_from_directory('.', path)
@app.route('/api/timetable', methods=['GET'])
def get_timetable():
    timetable = load_timetable()
    return jsonify(timetable)
@app.route('/api/timetable/class', methods=['POST'])
def add_class():
    data = request.get_json()
    if not data.get('subject') or not data.get('day') or not data.get('slot'):
        return jsonify({'error': 'Missing required fields: subject, day, slot'}), 400
    slot_key = f"{data['day']}-{data['slot']}"
    timetable = load_timetable()    
    timetable[slot_key] = {
        'subject': data['subject'],
        'teacher': data.get('teacher', ''),
        'room': data.get('room', ''),
        'day': data['day'],
        'slot': data['slot']
    }
    save_timetable(timetable)
    return jsonify({
        'message': 'Class added/updated successfully',
        'data': timetable[slot_key]
    })
@app.route('/api/timetable/class/<day>/<slot>', methods=['DELETE'])
def delete_class(day, slot):
    slot_key = f"{day}-{slot}"
    timetable = load_timetable()
    if slot_key in timetable:
        del timetable[slot_key]
        save_timetable(timetable)
        return jsonify({'message': 'Class deleted successfully'})
    else:
        return jsonify({'error': 'Class not found'}), 404
@app.route('/api/timetable', methods=['DELETE'])
def clear_timetable():
    save_timetable({})
    return jsonify({'message': 'Timetable cleared successfully'})
if __name__ == '__main__':
    init_data_file()
    app.run(debug=True, host='0.0.0.0', port=5000)
