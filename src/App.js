import React, { useEffect, useState } from "react";

function App() {
  const [topics, setTopics] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  // ✅ Primary + Fallback APIs
  const PRIMARY_API = "https://skilltrackerbackend-dphge2g7epbycsbf.southeastasia-01.azurewebsites.net/topics";
  const FALLBACK_API = "http://localhost:8080/topics";

  const getAPI = async () => {
    try {
      const res = await fetch(PRIMARY_API);
      if (!res.ok) throw new Error("Primary failed");
      return PRIMARY_API;
    } catch (err) {
      console.log("Using fallback API");
      return FALLBACK_API;
    }
  };

  useEffect(() => {
    loadTopics();
  }, []);

  const loadTopics = async () => {
    const api = await getAPI();
    const res = await fetch(api);
    const data = await res.json();
    setTopics(data);
  };

  const addTopic = async () => {
    const api = await getAPI();

    await fetch(api, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: name, description: description }),
    });

    setName("");
    setDescription("");
    loadTopics();
  };

  const deleteTopic = async (id) => {
    const api = await getAPI();

    await fetch(api + "/" + id, {
      method: "DELETE",
    });

    loadTopics();
  };

  return (
    <div style={{ padding: "40px" }}>
      <h2>Skills Tracker</h2>

      <input
        placeholder="Topic Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <button onClick={addTopic}>Add Topic</button>

      <h3>Topics</h3>

      <table border="1">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Description</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {topics.map((t) => (
            <tr key={t.id}>
              <td>{t.id}</td>
              <td>{t.name}</td>
              <td>{t.description}</td>
              <td>
                <button onClick={() => deleteTopic(t.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
