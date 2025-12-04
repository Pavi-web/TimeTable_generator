const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const SLOTS = ["9-10", "10-11", "11-12", "12-1", "1-2", "2-3", "3-4"];
const API_BASE_URL = 'http://localhost:5000/api';
const timetableTable = document.getElementById("timetable");
const classForm = document.getElementById("classForm");
const clearBtn = document.getElementById("clearBtn");
const messageP = document.getElementById("message");
buildEmptyTimetable();
loadTimetableFromBackend();
classForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const subject = document.getElementById("subject").value.trim();
    const teacher = document.getElementById("teacher").value.trim();
    const room = document.getElementById("room").value.trim();
    const day = document.getElementById("day").value;
    const slot = document.getElementById("slot").value;
    if (!subject || !day || !slot) {
        showMessage("Please fill subject, day and time slot.", "error");
        return;
    }
    const cellId = `cell-${day}-${slot}`;
    const cell = document.getElementById(cellId);
    if (!cell) {
        showMessage("Invalid day or slot selected.", "error");
        return;
    }
    if (cell.dataset.occupied === "true") {
        if (!confirm("This slot already has a class. Replace it?")) {
            return;
        }
    }
    try {
        const response = await fetch(`${API_BASE_URL}/timetable/class`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                subject,
                teacher,
                room,
                day,
                slot
            })
        });
        const result = await response.json();
        if (response.ok) {
            updateCellUI(cell, subject, teacher, room);
            showMessage("Class added/updated successfully.", "success");
        } else {
            showMessage(result.error || "Failed to save class.", "error");
        }
    } catch (error) {
        console.error('Error:', error);
        showMessage("Error connecting to server. Using local mode.", "error");
        updateCellUI(cell, subject, teacher, room);
    }
});
clearBtn.addEventListener("click", async function () {
    if (!confirm("Clear entire timetable?")) return;

    try {
        const response = await fetch(`${API_BASE_URL}/timetable`, {
            method: 'DELETE'
        });

        const result = await response.json();
        if (response.ok) {
            clearTimetableUI();
            showMessage("Timetable cleared successfully.", "success");
        } else {
            showMessage(result.error || "Failed to clear timetable.", "error");
        }
    } catch (error) {
        console.error('Error:', error);
        showMessage("Error connecting to server. Clearing locally.", "error");
        clearTimetableUI();
    }
});
function buildEmptyTimetable() {
    timetableTable.innerHTML = "";
    const theadRow = document.createElement("tr");
    const cornerTh = document.createElement("th");
    cornerTh.textContent = "Time / Day";
    theadRow.appendChild(cornerTh);
    DAYS.forEach((day) => {
        const th = document.createElement("th");
        th.textContent = day;
        theadRow.appendChild(th);
    });
    timetableTable.appendChild(theadRow);
    SLOTS.forEach((slot) => {
        const row = document.createElement("tr");
        const timeCell = document.createElement("th");
        timeCell.textContent = slot;
        row.appendChild(timeCell);
        DAYS.forEach((day) => {
            const cell = document.createElement("td");
            const cellId = `cell-${day}-${slot}`;
            cell.id = cellId;
            cell.dataset.cell = "true";
            cell.dataset.occupied = "false";
            row.appendChild(cell);
        });
        timetableTable.appendChild(row);
    });
}
async function loadTimetableFromBackend() {
    try {
        const response = await fetch(`${API_BASE_URL}/timetable`);
        const timetable = await response.json();
        for (const [key, classData] of Object.entries(timetable)) {
            const cellId = `cell-${classData.day}-${classData.slot}`;
            const cell = document.getElementById(cellId);
            if (cell) {
                updateCellUI(cell, classData.subject, classData.teacher, classData.room);
            }
        }
    } catch (error) {
        console.error('Error loading timetable:', error);
        showMessage("Could not load saved timetable from server.", "error");
    }
}
function updateCellUI(cell, subject, teacher, room) {
    cell.innerHTML = "";
    const subjectSpan = document.createElement("span");
    subjectSpan.className = "timetable-subject";
    subjectSpan.textContent = subject;
    cell.appendChild(subjectSpan);
    if (teacher) {
        const teacherSpan = document.createElement("span");
        teacherSpan.className = "timetable-teacher";
        teacherSpan.textContent = teacher;
        cell.appendChild(teacherSpan);
    }
    if (room) {
        const roomSpan = document.createElement("span");
        roomSpan.className = "timetable-room";
        roomSpan.textContent = room;
        cell.appendChild(roomSpan);
    }
    cell.dataset.occupied = "true";
    cell.classList.add("timetable-cell");
}
function clearTimetableUI() {
    const cells = document.querySelectorAll("[data-cell='true']");
    cells.forEach((cell) => {
        cell.innerHTML = "";
        cell.dataset.occupied = "false";
        cell.classList.remove("timetable-cell");
    });
}
function showMessage(text, type) {
    messageP.textContent = text;
    messageP.classList.remove("error", "success");
    if (type === "error") {
        messageP.classList.add("error");
    } else if (type === "success") {
        messageP.classList.add("success");
    }
}
