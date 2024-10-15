import { useState } from "react";
import { Link } from "react-router-dom";

function Register() {
  const [registerForm, setRegisterForm] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    confirmpassword: "",
    role: "",
  });

  function handleChange(e) {
    const { name, value, type, checked } = e.target;

    setRegisterForm((prev) => {
      const data = {
        ...prev,
        [name]: type === "checkbox" ? (checked ? "AUTHOR" : "USER") : value,
      };
      console.log("register form data", data);
      return data;
    });
  }

  function clearFormFields() {
    setRegisterForm({
      firstname: "",
      lastname: "",
      email: "",
      password: "",
      confirmpassword: "",
      role: "",
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
          Register an account
        </h1>
        <div className="flex flex-col">
          <label htmlFor="firstname">
            First Name <span className="text-red-800">*</span>
          </label>
          <input
            onChange={(e) => handleChange(e)}
            className="border border-black p-1"
            type="text"
            placeholder="Mohammad"
            id="firstname"
            name="firstname"
            value={registerForm.firstname}
            required
          />
          <span></span>
        </div>

        <div className="flex flex-col">
          <label htmlFor="lastname">
            Last Name <span className="text-red-800">*</span>
          </label>
          <input
            onChange={(e) => handleChange(e)}
            className="border border-black p-1"
            type="text"
            id="lastname"
            name="lastname"
            placeholder="Ahnaf"
            value={registerForm.lastname}
            required
          />
          <span></span>
        </div>

        <div className="flex flex-col">
          <label htmlFor="email">
            Email <span className="text-red-800">*</span>
          </label>
          <input
            onChange={(e) => handleChange(e)}
            className="border border-black p-1"
            type="email"
            id="email"
            name="email"
            placeholder="ahnaf@example.com"
            value={registerForm.email}
            required
          />
          <span></span>
        </div>

        <div className="flex flex-col">
          <label htmlFor="password">
            Password <span className="text-red-800">*</span>{" "}
          </label>
          <input
            onChange={(e) => handleChange(e)}
            className="border border-black p-1"
            type="password"
            id="password"
            name="password"
            placeholder="*****"
            value={registerForm.password}
            required
          />
          <span></span>
        </div>

        <div className="flex flex-col">
          <label htmlFor="confirmpassword">
            Confirm Password <span className="text-red-800">*</span>
          </label>
          <input
            onChange={(e) => handleChange(e)}
            className="border border-black p-1"
            type="password"
            id="confirmpassword"
            name="confirmpassword"
            placeholder="*****"
            value={registerForm.confirmpassword}
            required
          />
          <span></span>
        </div>

        <div className="flex items-center">
          <label className="flex-1" htmlFor="author">
            Are you an author?
          </label>
          <input
            onChange={(e) => handleChange(e)}
            className="border border-black p-1 w-6 h-6"
            type="checkbox"
            id="author"
            name="role"
            checked={registerForm.role === "AUTHOR"}
          />
        </div>

        <div className="mt-4 flex justify-between gap-3 items-center">
          Have an account?
          <Link
            className="border-2 font-custom font-bold hover:bg-white rounded-full px-3 py-2 bg-blue-400 border-blue-400"
            to="/login"
          >
            Log In
          </Link>
        </div>

        <div className="flex gap-8 justify-between items-center">
          <button
            className="border-2 font-custom font-bold hover:bg-white rounded-full flex-1 py-2 bg-green-400 border-green-400"
            type="submit"
          >
            Register
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

export { Register };
