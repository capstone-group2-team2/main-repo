import { useState } from "react";

import { loginEmployee } from "../services/auth";

function LoginEmployee() {
  const [employeeId, setEmployeeId] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const user = await loginEmployee(
        employeeId,
        password
      );
  
      console.log("Logged in!");
  
      console.log(user);
  
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h2>Employee Login</h2>

      <input
        type="text"
        placeholder="Employee ID"
        value={employeeId}
        onChange={(e) => setEmployeeId(e.target.value)}
      />

      <br />
      <br />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <br />
      <br />

      <button onClick={handleLogin}>
        Login
      </button>
    </div>
  );
}

export default LoginEmployee;