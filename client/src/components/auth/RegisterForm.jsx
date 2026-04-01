import React, { useState } from "react";
import { Link } from "react-router-dom";

const RegisterForm = ({ onSubmit, isLoading }) => {
  const [data, setData] = useState({
    phone: "",
    password: "",
    confirmPassword: "",
    role: "user",
  });

  // Regex: 8+ chars, 1 uppercase, 1 lowercase, 1 digit, 1 special character
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  const handleSubmit = (e) => {
    e.preventDefault();

    if (data.phone.length !== 10) {
      alert("Phone number must be exactly 10 digits.");
      return;
    }

    // 1. Complexity Validation
    if (!passwordRegex.test(data.password)) {
      alert(
        "Password must contain at least 8 characters, including uppercase, lowercase, a digit, and a special character.",
      );
      return;
    }

    // 2. Match Validation
    if (data.password !== data.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    const { confirmPassword, ...submitData } = data;
    onSubmit(submitData);
  };

  return (
    <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
        Create Account
      </h2>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Phone Number
          </label>
          <input
            type="text"
            placeholder="10-digit Phone Number"
            required
            maxLength="10"
            pattern="\d{10}"
            className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, "");
              setData({ ...data, phone: value });
            }}
            value={data.phone}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <input
            type="password"
            placeholder="Password"
            required
            className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
            onChange={(e) => setData({ ...data, password: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Confirm Password
          </label>
          <input
            type="password"
            placeholder="Confirm Password"
            required
            className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
            onChange={(e) =>
              setData({ ...data, confirmPassword: e.target.value })
            }
          />
        </div>

        <button
          disabled={isLoading}
          className="w-full py-2 bg-primary text-white rounded-md hover:bg-blue-700 transition-colors shadow-sm disabled:bg-blue-300 mt-2"
        >
          {isLoading ? "Creating Account..." : "Register"}
        </button>
      </form>

      <div className="mt-6 text-center text-sm text-gray-600">
        Already have an account?{" "}
        <Link
          to="/login"
          className="text-primary font-semibold hover:underline"
        >
          Login here
        </Link>
      </div>
    </div>
  );
};

export default RegisterForm;
