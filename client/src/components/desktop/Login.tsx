import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
  useSignInMutation,
  useSignUpMutation,
  useUserProfileQuery,
} from "@/store/authSlice";
import { setUser } from "@/store/userSlice";
import { BASE_URL } from "@/base_url/base_url";

const Login = () => {
  const dispatch = useDispatch();

  const [signIn] = useSignInMutation();
  const [signUp] = useSignUpMutation();

  const { data: profile, refetch } = useUserProfileQuery();

  const [mode, setMode] = useState<"signup" | "signin">("signin");
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  // 🔥 profile আসলে Redux এ set হবে
  useEffect(() => {
    if (profile) {
      dispatch(setUser(profile));
    }
  }, [profile, dispatch]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      if (mode === "signin") {
        await signIn(form).unwrap();
      } else {
        await signUp(form).unwrap();
      }

      await refetch(); // 🔥 important

    } catch (err) {
      console.log(err);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = `${BASE_URL}/api/auth/google`;
  };

  return (
    <div>
      <h2>{mode === "signin" ? "Login" : "Register"}</h2>

      <form onSubmit={handleSubmit}>
        {mode === "signup" && (
          <input
            placeholder="name"
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        )}

        <input
          placeholder="email"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <input
          placeholder="password"
          type="password"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        <button type="submit">
          {mode === "signin" ? "Login" : "Signup"}
        </button>
      </form>

      <button onClick={handleGoogleLogin}>
        Continue with Google
      </button>

      <p onClick={() => setMode(mode === "signin" ? "signup" : "signin")}>
        Switch Mode
      </p>
    </div>
  );
};

export default Login;