import { useState } from "react";
import { Header } from "./Header";
import { Outlet } from "react-router-dom";

function App() {
  const [user, setUser] = useState({
    id: "",
    firstName: "",
    lastName: "",
    email: "",
    role: "",
  });
  return (
    <>
      <Header id={user.id} />
      <Outlet context={{setUser, user}} />
    </>
  );
}

export default App;
