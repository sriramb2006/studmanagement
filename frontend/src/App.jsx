import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Link, useParams } from "react-router-dom";
import "./App.css";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

function Home() {
  const [internships, setInternships] = useState([]);

  useEffect(() => {
    fetch(`${API}/internships`)
      .then(res => res.json())
      .then(data => setInternships(data))
      .catch(() => setInternships([]));
  }, []);

  return (
    <div className="container">
      <h1>Student Internship Portal</h1>
      <p>Explore available internship opportunities.</p>
      <div className="grid">
        {internships.map(item => (
          <div className="card" key={item.id}>
            <h2>{item.title}</h2>
            <p>{item.company}</p>
            <p>{item.duration} | {item.location}</p>
            <Link to={`/internship/${item.id}`}>View Details</Link>
          </div>
        ))}
      </div>
    </div>
  );
}

function Details() {
  const { id } = useParams();
  const [item, setItem] = useState(null);

  useEffect(() => {
    fetch(`${API}/internships/${id}`)
      .then(res => {
        if (!res.ok) throw new Error("Internship not found");
        return res.json();
      })
      .then(setItem)
      .catch(() => setItem(null));
  }, [id]);

  if (!item) return <div className="container">Loading or internship not found...</div>;

  return (
    <div className="container card">
      <h1>{item.title}</h1>
      <p>Company: {item.company}</p>
      <p>Duration: {item.duration}</p>
      <p>Location: {item.location}</p>
      <p>{item.description}</p>
      <Link to={`/apply/${item.id}`}>Apply Now</Link>
    </div>
  );
}

function Apply() {
  const { id } = useParams();
  const [form, setForm] = useState({
    name: "",
    email: "",
    rollNumber: "",
    internshipId: id
  });
  const [message, setMessage] = useState("");

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage("");

    try {
      const response = await fetch(`${API}/applications`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.message || "Application failed");

      setMessage("Application submitted successfully!");
      setForm({ name: "", email: "", rollNumber: "", internshipId: id });
    } catch (error) {
      setMessage(error.message || "Server error. Please try again.");
    }
  }

  return (
    <div className="container card">
      <h1>Internship Application</h1>
      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Student Name" value={form.name}
          onChange={handleChange} required minLength="2" />

        <input name="email" type="email" placeholder="Email ID"
          value={form.email} onChange={handleChange} required />

        <input name="rollNumber" placeholder="Roll Number"
          value={form.rollNumber} onChange={handleChange} required />

        <input name="internshipId" type="number" value={form.internshipId}
          onChange={handleChange} required />

        <button type="submit">Submit Application</button>
      </form>
      {message && <p>{message}</p>}
      <Link to="/">Back to Internships</Link>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <nav><Link to="/">Home</Link></nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/internship/:id" element={<Details />} />
        <Route path="/apply/:id" element={<Apply />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
