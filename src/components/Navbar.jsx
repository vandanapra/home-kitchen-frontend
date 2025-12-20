import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="w-full bg-white shadow-md px-6 py-4 flex justify-between items-center">
      <h1 className="text-xl font-bold text-orange-600">
        🍛 Home Kitchen
      </h1>

      <div className="space-x-4">
        <Link
          to="/login"
          className="text-gray-700 hover:text-orange-600"
        >
          Login
        </Link>
        <Link
          to="/signup"
          className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
        >
          Signup
        </Link>
      </div>
    </nav>
  );
}
