import { NavLink } from "react-router-dom";

function Header({ user, setUser }) {
  const id = user.id;
  function handleLogout() {
    localStorage.removeItem("token");
    setUser((prev) => {
      return {
        ...prev,
        id: "",
        firstName: "",
        lastName: "",
        email: "",
        role: "",
      };
    });
  }
  return (
    <>
      <header className="p-3 flex justify-between items-center gap-5 bg-yellow-300 flex-col sm:flex-row">
        <h1 className="font-custom font-bold text-2xl">Blog Haven</h1>
        <nav>
          <ul className="flex items-center gap-3">
            <li>
              <NavLink
                className="font-custom hover:bg-white inline-block font-bold border-2 border-black p-2"
                to="/"
              >
                Home
              </NavLink>
            </li>
            {id === "" && (
              <li>
                <NavLink
                  className="font-custom hover:bg-white inline-block font-bold border-2 border-black p-2"
                  to="/login"
                >
                  Login
                </NavLink>
              </li>
            )}
            {id === "" && (
              <li>
                <NavLink
                  className="font-custom hover:bg-white inline-block font-bold border-2 border-black p-2"
                  to="/register"
                >
                  Register
                </NavLink>
              </li>
            )}

            {id !== "" && (
              <li>
                <button
                  onClick={handleLogout}
                  className="font-custom hover:bg-white inline-block font-bold border-2 border-black p-2"
                >
                  Log out
                </button>
              </li>
            )}
          </ul>
        </nav>
      </header>
    </>
  );
}

export { Header };
