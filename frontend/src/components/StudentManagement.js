import React, { useState, useEffect } from "react";
import axios from "axios";
import "./StudentManagement.css";

const StudentManagement = ({ onLogout }) => {
  const [students, setStudents] = useState([]);
  const [formData, setFormData] = useState({ rollNo: "", name: "", age: "", grade: "" });
  const [editingRollNo, setEditingRollNo] = useState(null);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/students");
      setStudents(res.data);
    } catch (err) {
      console.error("Error fetching students:", err);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAdd = async () => {
    if (!formData.rollNo || !formData.name || !formData.age || !formData.grade) return;
    try {
      await axios.post("http://localhost:5000/api/students", formData);
      fetchStudents();
      setFormData({ rollNo: "", name: "", age: "", grade: "" });
    } catch (err) {
      console.error("Error adding student:", err);
    }
  };

  const handleDelete = async (rollNo) => {
    try {
      await axios.delete(`http://localhost:5000/api/students/${rollNo}`);
      fetchStudents();
    } catch (err) {
      console.error("Error deleting student:", err);
    }
  };

  const startEditing = (student) => {
    setEditingRollNo(student.rollNo);
    setFormData({ rollNo: student.rollNo, name: student.name, age: student.age, grade: student.grade });
  };

  const handleUpdate = async () => {
    try {
      await axios.put(`http://localhost:5000/api/students/${editingRollNo}`, {
        name: formData.name,
        age: formData.age,
        grade: formData.grade,
      });
      fetchStudents();
      setEditingRollNo(null);
      setFormData({ rollNo: "", name: "", age: "", grade: "" });
    } catch (err) {
      console.error("Error updating student:", err);
    }
  };

  const handleCancelEdit = () => {
    setEditingRollNo(null);
    setFormData({ rollNo: "", name: "", age: "", grade: "" });
  };

  return (
    <div className="student-container">
      <h2>Student Management</h2>
      <button onClick={onLogout}>Logout</button>

      <div className="student-form">
        <input name="rollNo" placeholder="Roll No" value={formData.rollNo} onChange={handleChange} disabled={editingRollNo !== null} />
        <input name="name" placeholder="Name" value={formData.name} onChange={handleChange} />
        <input name="age" placeholder="Age" value={formData.age} onChange={handleChange} />
        <input name="grade" placeholder="Grade" value={formData.grade} onChange={handleChange} />
        {editingRollNo ? (
          <>
            <button onClick={handleUpdate}>Update Student</button>
            <button onClick={handleCancelEdit}>Cancel</button>
          </>
        ) : (
          <button onClick={handleAdd}>Add Student</button>
        )}
      </div>

      <table>
        <thead>
          <tr>
            <th>Roll No</th>
            <th>Name</th>
            <th>Age</th>
            <th>Grade</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {students.map((s) => (
            <tr key={s.rollNo}>
              <td>{s.rollNo}</td>
              <td>{s.name}</td>
              <td>{s.age}</td>
              <td>{s.grade}</td>
              <td>
                <button onClick={() => startEditing(s)}>Edit</button>
                <button onClick={() => handleDelete(s.rollNo)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StudentManagement;
