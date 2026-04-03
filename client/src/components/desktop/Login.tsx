import {
    Dialog,
    DialogContent,
} from "@/components/ui/dialog"
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useEffect, useState } from "react";

import { useSignInMutation, useSignUpMutation, useUserProfileQuery } from "@/store/authSlice";
import images from '../../assets/image.png'
import { useDispatch } from "react-redux";
import { setUser } from "@/store/userSlice";
import { BASE_URL } from "@/base_url/base_url";

interface LoginDialog {
    openLogin: boolean;
    setOpenLogin: (open: boolean) => void;
}

const Login = ({ openLogin, setOpenLogin }: LoginDialog) => {

    const [signUp] = useSignUpMutation();
    const [signIn] = useSignInMutation();

    // 🔥 IMPORTANT: add refetch
    const { data: profile, refetch } = useUserProfileQuery();
    console.log(profile)
    const [mode, setMode] = useState<"signup" | "signin">("signup");

    const dispatch = useDispatch()

    const [data, setData] = useState({
        name: "",
        email: "",
        password: "",
    });

    const [error, setError] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setData({
            ...data,
            [e.target.name]: e.target.value,
        });
    };

    // 🔥 FIXED LOGIN/SIGNUP
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");

        try {
            const res = mode === "signup"
                ? await signUp(data).unwrap()
                : await signIn(data).unwrap();

            // ✅ set user immediately
            dispatch(setUser(res.user));

            // 🔥 VERY IMPORTANT: profile refetch
            await refetch();

            setOpenLogin(false);

        } catch (err: any) {
            console.error(err);
            setError(err?.data?.message || "Something went wrong");
        }
    };

    // 🔥 GOOGLE LOGIN
    const handleGoogleLogin = () => {
        window.location.href = `${BASE_URL}/api/auth/google`;
    };

    // 🔥 PROFILE → REDUX SET
    useEffect(() => {
        if (profile) {
            console.log("PROFILE:", profile); // debug
            dispatch(setUser(profile));
        }
    }, [profile, dispatch]);

    return (
        <div>
            <Dialog open={openLogin} onOpenChange={setOpenLogin}>

                <DialogContent className="md:min-w-3xl">
                    <div className="grid grid-cols-1 md:grid-cols-2 divide">
                        <div className="border-r p-4 flex-col space-y-4 hidden md:block">
                            <h3 className="text-2xl leading-tight font-semibold text-blue-500">SignUp</h3>
                            <div className="flex items-center justify-center">
                                <img
                                    className="object-cover h-86 w-auto"
                                    src={images} alt="" />
                            </div>
                        </div>

                        <div>
                            <h3 className="text-center text-2xl font-bold">
                                {mode === "signup" ? "SignUp" : "SignIn"}
                            </h3>

                            <form className="p-6 flex-col space-y-4" onSubmit={handleSubmit}>

                                {mode === "signup" && (
                                    <div className="flex-col space-y-2">
                                        <Label htmlFor="name">Name</Label>
                                        <Input
                                            name="name"
                                            value={data.name}
                                            onChange={handleChange}
                                            placeholder="name.."
                                        />
                                    </div>
                                )}

                                <div className="flex-col space-y-2">
                                    <Label htmlFor="email">Your email address</Label>
                                    <Input
                                        name="email"
                                        value={data.email}
                                        onChange={handleChange}
                                        placeholder="email.."
                                    />
                                </div>

                                <div className="flex-col space-y-2">
                                    <Label htmlFor="password">Password</Label>
                                    <Input
                                        name="password"
                                        type="password"
                                        value={data.password}
                                        onChange={handleChange}
                                        placeholder="password"
                                    />
                                </div>

                                {error && <p className="text-red-500">{error}</p>}

                                <p>
                                    {mode === "signup"
                                        ? "Already have an account? "
                                        : "Don't have an account? "}
                                    <span
                                        className="text-blue-500 cursor-pointer"
                                        onClick={() => setMode(mode === "signup" ? "signin" : "signup")}
                                    >
                                        {mode === "signup" ? "Sign In" : "Sign Up"}
                                    </span>
                                </p>

                                <div className="flex-col space-y-2">
                                    <Button type="submit" className="w-full">
                                        {mode === "signup" ? "SignUp" : "SignIn"}
                                    </Button>

                                    <Button type="button" className="w-full" onClick={handleGoogleLogin}>
                                        {mode === "signup" ? "SignUp" : "SignIn"} with Google
                                    </Button>
                                </div>

                            </form>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default Login;