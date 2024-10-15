import { useState } from "react";
import { Link } from "react-router-dom";

function Login() {
  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  });

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
  }

  return (
    <main className="p-3 text-black min-h-screen flex justify-center items-center bg-gray-700">
      <form
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
          <span></span>
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
          <span></span>
        </div>

        <div className="mt-4 flex justify-between gap-8 items-center">
          Don't have an account?
          <Link
            className="border-2 font-custom font-bold hover:bg-white rounded-full px-10 py-2 bg-blue-400 border-blue-400"
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
