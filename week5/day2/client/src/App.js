import { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [feedbackList, setFeedbackList] = useState([]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/feedback", form);
      if (res.data.success) {
        alert("Feedback Sent!");
        setForm({ name: "", email: "", message: "" });
        fetchFeedback(); // refresh list after submitting
      }
    } catch (err) {
      console.error("Error:", err);
      alert("Failed to send feedback");
    }
  };

  // Fetch feedback from backend
  const fetchFeedback = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/feedback");
      if (res.data.success) {
        console.log(res.data.data);
        setFeedbackList(res.data.data);
      }
    } catch (err) {
      console.error("Error fetching feedback:", err);
    }
  };

  useEffect(() => {
    fetchFeedback();
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h2>User Feedback Form</h2>

      <form onSubmit={handleSubmit}>
        <input
          name="name"
          placeholder="Your Name"
          value={form.name}
          onChange={handleChange}
          required
        /><br /><br />

        <input
          name="email"
          placeholder="Your Email"
          value={form.email}
          onChange={handleChange}
          required
        /><br /><br />

        <textarea
          name="message"
          placeholder="Your Feedback"
          value={form.message}
          onChange={handleChange}
          required
        /><br /><br />

        <button type="submit">Submit</button>
      </form>

      <h2>All Feedback</h2>
      <ul>
        {feedbackList.map((fb) => (
          <li key={fb._id} style={{ marginBottom: 10 }}>
            <strong>{fb.name}</strong> ({fb.email})<br />
            {fb.message}<br />
            <small>{new Date(fb.createdAt).toLocaleString()}</small>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
