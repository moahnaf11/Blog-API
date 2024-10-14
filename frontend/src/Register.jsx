import { useState } from "react";
import { Link } from "react-router-dom";

function Register() {
  const [registerForm, setRegisterForm] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    confirmpassword: "",
  });

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
            className="border border-black p-1"
            type="text"
            placeholder="Mohammad"
            id="firstname"
            name="firstname"
            required
          />
          <span></span>
        </div>

        <div className="flex flex-col">
          <label htmlFor="lastname">
            Last Name <span className="text-red-800">*</span>
          </label>
          <input
            className="border border-black p-1"
            type="text"
            id="lastname"
            name="lastname"
            placeholder="Ahnaf"
            required
          />
          <span></span>
        </div>

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
            required
          />
          <span></span>
        </div>

        <div className="flex flex-col">
          <label htmlFor="confirmpassword">
            Confirm Password <span className="text-red-800">*</span>
          </label>
          <input
            className="border border-black p-1"
            type="password"
            id="confirmpassword"
            name="confirmpassword"
            placeholder="*****"
            required
          />
          <span></span>
        </div>

        <div className="mt-4 flex justify-between gap-8 items-center">
          Have an account?
          <Link
            className="border-2 font-custom font-bold hover:bg-white rounded-full px-10 py-2 bg-blue-400 border-blue-400"
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
          >
            Clear
          </button>
        </div>
      </form>
    </main>
  );
}

export { Register };
