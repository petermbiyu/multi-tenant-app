"use client";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import React, { useState } from "react";

const SignIn = () => {
  const [signup, setSignup] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<null | string>(null);
  const [isSending, setIsSending] = useState(false);

  const handleSubmit = async (e: React.SyntheticEvent<HTMLElement>) => {
    e.preventDefault();
    setIsSending(true);
    setMessage(null);
    if (signup) {
      if (
        !firstName.trim() ||
        !lastName.trim() ||
        !email.trim() ||
        !password.trim()
      ) {
        setMessage("All fields are required");
        setIsSending(false);
        return;
      }
      const name = `${firstName} ${lastName}`;
      const { error } = await authClient.signUp.email({
        name,
        email,
        password,
        callbackURL: "/",
      });
      if (error) {
        setMessage(error?.message ?? "Sign up failed");
      }
      setIsSending(false);
    } else {
      if (!email.trim() || !password.trim()) {
        setMessage("Email and password are required");
        setIsSending(false);
        return;
      }
      const { error } = await authClient.signIn.email({
        email,
        password,
        callbackURL: "/",
      });
      if (error) {
        setMessage(error?.message ?? "Log in failed");
      }

      setIsSending(false);
    }
  };

  return (
    <section className="container mx-auto my-5">
      <div className="w-full max-w-xl border mx-auto py-5 px-5 shadow-2xl">
        <div className="text-center mb-3">
          <h2 className="text-xl font-bold">
            {signup ? "Create your Account" : "Sign in to multi-tenant"}
          </h2>
          <p>
            {signup
              ? "Welcome! Please fill in the details to get started"
              : "Welcome back! Please enter your details"}
          </p>
        </div>

        <div className="flex items-center justify-center gap-2">
          <Button className="w-1/2 py-5" variant={"outline"}>
            Google
          </Button>
          <Button className="w-1/2 py-5" variant={"outline"}>
            Github
          </Button>
        </div>
        <div className="w-full flex items-center justify-center gap-2 px-4 mt-3">
          <span className="w-4/9 border-b-2 mt-1"></span>
          <span className="text-center w-1/9">OR</span>
          <span className="w-4/9 border-b-2 mt-1"></span>
        </div>

        <form onSubmit={handleSubmit}>
          {signup && (
            <div className="flex items-center flex-col sm:flex-row gap-2 ">
              <div className="w-full sm:w-1/2">
                <label htmlFor="firstName" className="font-semibold w-full ">
                  First Name
                </label>
                <br />
                <input
                  type="text"
                  placeholder="Enter first name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="outline-none border border-gray-300 py-1.5 px-3 rounded-sm w-full"
                />
              </div>
              <div className="w-full sm:w-1/2">
                <label htmlFor="firstName" className="font-semibold">
                  Last Name
                </label>
                <br />
                <input
                  type="text"
                  placeholder="Enter last name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="outline-none border border-gray-300 py-1.5 px-3 rounded-sm w-full"
                />
              </div>
            </div>
          )}
          <div className="my-3">
            <label htmlFor="email" className="font-semibold">
              Email Address
            </label>
            <input
              type="email"
              placeholder="Enter Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="outline-none border border-gray-300 py-1.5 px-3 rounded-sm w-full"
            />
          </div>
          <div className="my-3">
            <label htmlFor="password" className="font-semibold">
              Password
            </label>
            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="outline-none border border-gray-300 py-1.5 px-3 rounded-sm w-full"
            />
          </div>
          <input
            type="submit"
            disabled={isSending}
            value={isSending ? "Sending.." : "Continue"}
            className="outline-none border border-gray-300 py-1.5 px-3 rounded-sm w-full my-3 bg-gray-700 text-white font-semibold cursor-pointer"
          />
          <div>
            <div className="flex items-center flex-col sm:flex-row gap-3 justify-between px-5">
              <p>
                Already have an account:{" "}
                <button
                  type="button"
                  onClick={() => {
                    setSignup(!signup);
                    setMessage(null);
                  }}
                  className="text-blue-600"
                >
                  Sign In
                </button>
              </p>
              <p>
                Forgot your password:{" "}
                <button className="text-blue-600">Reset</button>
              </p>
            </div>
            {message !== null && (
              <div className="mt-2">
                <p className="px-5 py-1.5 border bg-red-400 rounded-sm text-white font-semibold">
                  {message}
                </p>
              </div>
            )}
          </div>
        </form>
      </div>
    </section>
  );
};

export default SignIn;
