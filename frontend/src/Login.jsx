import { useState } from "react";
import { Link, useNavigate, useOutletContext } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

function Login() {
  const { setUser } = useOutletContext();
  const navigate = useNavigate();
  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  function handleChange(e) {
    setLoginForm((prev) => {
      const data = {
        ...prev,
        [e.target.name]: e.target.value,
      };
      console.log("login form data", data);
      return data;
    });
  }

  function clearFormFields() {
    setLoginForm({
      email: "",
      password: "",
    });
    setError("");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const response = await fetch("http://localhost:3000/users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(loginForm),
    });

    if (!response.ok) {
      let message = await response.json();
      setError(message.error);
    } else {
      let token = await response.json();
      localStorage.setItem("token", token.token);
      console.log("token stored", localStorage.getItem("token"));
      const decodedToken = jwtDecode(token.token);
      console.log("payload", decodedToken);
      setUser((prev) => {
        const updateduser = {
          ...prev,
          ...decodedToken,
        };
        console.log("updated user", updateduser);
        return updateduser;
      });
      navigate("/");
    }
  }

  return (
    <main className="p-3 text-black min-h-screen flex justify-center items-center bg-gray-700">
      <form
        onSubmit={(e) => handleSubmit(e)}
        className="w-[90%] md:w-[50%] flex flex-col bg-white gap-3 p-3 rounded-lg shadow-md shadow-white"
        action="#"
        method="post"
      >
        <h1 className="font-custom font-bold text-xl border-b-2 border-black max-w-max">
          Log In
        </h1>

        <div className="flex flex-col">
          <label htmlFor="email">
            Email <span className="text-red-800">*</span>
          </label>
          <input
            className="border border-black p-1"
            type="email"
            id="email"
            name="email"
            placeholder="ahnaf@example.com"
            value={loginForm.email}
            onChange={(e) => handleChange(e)}
            required
          />
          <span className="text-red-600">
            {error === "user not found" ? error : ""}
          </span>
        </div>

        <div className="flex flex-col">
          <label htmlFor="password">
            Password <span className="text-red-800">*</span>{" "}
          </label>
          <input
            className="border border-black p-1"
            type="password"
            id="password"
            name="password"
            placeholder="*****"
            value={loginForm.password}
            onChange={(e) => handleChange(e)}
            required
          />
          <span className="text-red-600">
            {error === "user not found" ? "" : error}
          </span>
        </div>

        <div className="mt-4 flex justify-between gap-8 items-center">
          Don't have an account?
          <Link
            className="border-2 font-custom font-bold hover:bg-white rounded-full px-2 py-2 bg-blue-400 border-blue-400"
            to="/register"
          >
            Register
          </Link>
        </div>

        <div className="flex gap-8 justify-between items-center">
          <button
            className="border-2 font-custom font-bold hover:bg-white rounded-full flex-1 py-2 bg-green-400 border-green-400"
            type="submit"
          >
            Log In
          </button>
          <button
            className="border-2 font-custom font-bold hover:bg-white rounded-full flex-1 py-2 bg-gray-400 border-gray-400"
            type="reset"
            onClick={clearFormFields}
          >
            Clear
          </button>
        </div>
      </form>
    </main>
  );
}

export { Login };
