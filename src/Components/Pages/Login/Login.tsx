import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../../../slices/authSlice";
import { RootState } from "../../../store/store";
import { useNavigate } from "react-router-dom";
import { useLoginUserMutation } from "../../../services/authApi";

const Login: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isAuthenticated = useSelector(
    (state: RootState) => (state as any).auth?.isAuthenticated
  );

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [tried, setTried] = useState(false);

  console.log("login", email, password);

  const [loginUser, { isLoading }] = useLoginUserMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTried(true);
    setError("");
    try {
      const result = await loginUser({ email, password }).unwrap();
      console.log("result", result);
      localStorage.setItem("access_token", result.access_token);
      dispatch(login({ user: result.user, token: result.access_token }));
      navigate("/dashboard");
    } catch (err: any) {
      setError(err?.data?.message || "Invalid email or password");
    }
  };

  React.useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    } else if (tried && email && password) {
      setError("Invalid email or password");
    }
    // eslint-disable-next-line
  }, [isAuthenticated]);

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-6 text-center">Sign In</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block mb-2 font-medium">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError("");
            }}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2 font-medium">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError("");
            }}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>
        {error && <div className="text-red-500 mb-2">{error}</div>}
        <button
          type="submit"
          className="w-full py-2 bg-green-600 text-white rounded font-semibold"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
