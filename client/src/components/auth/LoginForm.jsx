import React, { useState } from "react";
import { Link } from "react-router-dom";

const LoginForm = ({ onSubmit, isLoading }) => {
  const [data, setData] = useState({ phone: "", password: "" });

  return (
    <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800">Welcome Back</h2>
      </div>
      
      <form
        className="space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit(data);
        }}
      >
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Phone Number
          </label>
          <input
            type="text"
            required
            placeholder="Phone Number"
            className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
            onChange={(e) => setData({ ...data, phone: e.target.value })}
          />
        </div>
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <Link to="/forgot-password" hidden={false} className="text-xs text-primary hover:underline">
              Forgot password?
            </Link>
          </div>
          <input
            type="password"
            required
            placeholder="Password"
            className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
            onChange={(e) => setData({ ...data, password: e.target.value })}
          />
        </div>
        <button
          disabled={isLoading}
          className="w-full py-2 text-white bg-primary rounded-md hover:bg-blue-700 transition shadow-sm disabled:bg-blue-300"
        >
          {isLoading ? "Logging in..." : "Login"}
        </button>
      </form>

      <div className="text-center text-sm text-gray-600">
        Don't have an account?{" "}
        <Link to="/register" className="text-primary font-semibold hover:underline">
          Sign Up 
        </Link>
      </div>
    </div>
  );
};

export default LoginForm;