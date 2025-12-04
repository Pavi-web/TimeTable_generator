# College Timetable Generator - Flask Backend

A simple web application for creating and managing college timetables with a Flask backend for data persistence.

## Features

- Add classes with subject, teacher, room, day, and time slot information
- Visual weekly timetable display
- Persistent data storage using Flask backend
- Clear timetable functionality
- Simple and clean user interface

## Project Structure

```
TimeTable_generator/
├── app.py              # Flask backend application
├── index.html          # Frontend HTML
├── style.css           # CSS styling
├── script.js           # JavaScript frontend logic
├── requirements.txt    # Python dependencies
├── timetable_data.json # Auto-generated data storage (created on first run)
└── README.md          # This file
```

## Setup Instructions

### Prerequisites

- Python 3.7 or higher
- pip (Python package installer)

### Installation

1. **Install Python dependencies:**

```bash
pip install -r requirements.txt
```

2. **Run the Flask server:**

```bash
python app.py
```

The server will start on `http://localhost:5000`

3. **Access the application:**

Open your web browser and navigate to:
```
http://localhost:5000
```

## API Endpoints

The Flask backend provides the following REST API endpoints:

### Get All Timetable Data
- **URL:** `/api/timetable`
- **Method:** `GET`
- **Response:** JSON object containing all scheduled classes

### Add/Update a Class
- **URL:** `/api/timetable/class`
- **Method:** `POST`
- **Body:**
  ```json
  {
    "subject": "Data Structures",
    "teacher": "Prof. Rahul",
    "room": "CS-104",
    "day": "Mon",
    "slot": "9-10"
  }
  ```
- **Response:** Success message with saved data

### Delete a Specific Class
- **URL:** `/api/timetable/class/<day>/<slot>`
- **Method:** `DELETE`
- **Response:** Success or error message

### Clear Entire Timetable
- **URL:** `/api/timetable`
- **Method:** `DELETE`
- **Response:** Success message

## Usage

1. **Adding a Class:**
   - Fill in the subject name (required)
   - Optionally add teacher name and room number
   - Select the day and time slot
   - Click "Add to Timetable"

2. **Updating a Class:**
   - Fill in new information for the same day and time slot
   - Confirm replacement when prompted
   - Click "Add to Timetable"

3. **Clearing the Timetable:**
   - Click "Clear Timetable" button
   - Confirm the action

## Data Persistence

- Timetable data is automatically saved to `timetable_data.json`
- Data persists across server restarts
- The application loads saved data automatically when the page loads

## Configuration

To change the server port or host, edit the last line in `app.py`:

```python
app.run(debug=True, host='0.0.0.0', port=5000)
```

## Troubleshooting

**Issue:** "Error connecting to server" message appears
- **Solution:** Make sure the Flask server is running (`python app.py`)

**Issue:** CORS errors in browser console
- **Solution:** The flask-cors package should handle this. Ensure it's installed via requirements.txt

**Issue:** Changes not persisting
- **Solution:** Check that `timetable_data.json` is writable and the Flask server has permission to create/modify it

## Technologies Used

- **Frontend:** HTML5, CSS3, Vanilla JavaScript
- **Backend:** Python Flask
- **Data Storage:** JSON file
- **CORS:** flask-cors for cross-origin requests

## License

Free to use for educational purposes.