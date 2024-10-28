import { useState, useEffect } from "react";
import { Header } from "./Header";
import { Outlet } from "react-router-dom";
import  {jwtDecode} from "jwt-decode";

function App() {
  const [user, setUser] = useState({
    id: "",
    firstName: "",
    lastName: "",
    email: "",
    role: "",
  });
  const [displayPublished, setDisplayPublished] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token"); // Assuming you stored the token as 'token'
    if (token) {
      try {
        const decodedToken = jwtDecode(token); // Decode the token to get user info
        setUser((prev) => {
          return {
            ...prev,
            ...decodedToken,
          };
        });
      } catch (error) {
        console.error("Invalid token", error);
        // Handle invalid token case
        localStorage.removeItem("token"); // Remove invalid token if any issue
      }
    }
  }, []);

  return (
    <>
      <Header user={user} setUser={setUser} displayPublished={displayPublished} setDisplayPublished={setDisplayPublished} />
      <Outlet context={{ setUser, user, displayPublished, setDisplayPublished }} />
    </>
  );
}

export default App;
