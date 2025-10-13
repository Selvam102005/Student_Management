import React, { useState } from "react";
import Login from "./components/Login";
import StudentManagement from "./components/StudentManagement";

function App() {
  const [user, setUser] = useState(null);

  const handleLogin = (username) => {
    setUser(username); 
    localStorage.setItem("user", username); 
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <div className="App">
      {!user ? (
        <Login onLogin={handleLogin} />
      ) : (
        <StudentManagement onLogout={handleLogout} />
      )}
    </div>
  );
}

export default App;
