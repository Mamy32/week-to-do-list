"use client";

import { useState } from "react";
import { auth } from "@/lib/firebase";
import {
  signInWithPopup,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import { toast } from "sonner";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [googleLoading, setGoogleLoading] = useState(false);
  const [emailLoading, setEmailLoading] = useState(false);

  // ✅ Create session (safe)
  const createSession = async (idToken: string) => {
    const res = await fetch("/api/session", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
    });

    if (!res.ok) {
      throw new Error("Session creation failed");
    }
  };

  // ✅ Google Login
  const handleGoogleLogin = async () => {
    try {
      setGoogleLoading(true);

      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);

      const idToken = await result.user.getIdToken();

      await createSession(idToken);

      toast.success("Welcome back 👋");

      router.push("/dashboard");
      router.refresh();
    } catch (error: any) {
      console.error(error);

      let message = "Google login failed";

      if (error.code === "auth/popup-closed-by-user") {
        message = "Popup closed before login";
      }

      toast.error(message);
    } finally {
      setGoogleLoading(false);
    }
  };

  // ✅ Email Login
  const handleEmailLogin = async () => {
    // 🔥 Validation FIRST
    if (!email || !password) {
      return toast.error("Please fill all fields");
    }

    if (!email.includes("@")) {
      return toast.error("Invalid email format");
    }

    try {
      setEmailLoading(true);

      const result = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      const idToken = await result.user.getIdToken();

      await createSession(idToken);

      toast.success("Login successful 🎉");

      router.push("/dashboard");
      router.refresh();
    } catch (error: any) {
      console.error(error);

      let message = "Login failed";

      switch (error.code) {
        case "auth/user-not-found":
          message = "User not found";
          break;
        case "auth/wrong-password":
          message = "Incorrect password";
          break;
        case "auth/invalid-email":
          message = "Invalid email format";
          break;
        case "auth/too-many-requests":
          message = "Too many attempts. Try later.";
          break;
      }

      toast.error(message);
    } finally {
      setEmailLoading(false);
    }
  };

  // ✅ Enter key support
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleEmailLogin();
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 px-4">
      <Card className="w-full max-w-md shadow-xl rounded-2xl">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-semibold">
            Sign in to your account
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* GOOGLE LOGIN */}
          <Button
            variant="outline"
            className="w-full"
            onClick={handleGoogleLogin}
            disabled={googleLoading || emailLoading}
          >
            {googleLoading ? "Connecting..." : "Continue with Google"}
          </Button>

          {/* DIVIDER */}
          <div className="flex items-center gap-2">
            <Separator className="flex-1" />
            <span className="text-xs text-muted-foreground">OR</span>
            <Separator className="flex-1" />
          </div>

          {/* EMAIL */}
          <Input
            placeholder="Email address"
            value={email}
            disabled={emailLoading}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={handleKeyDown}
          />

          {/* PASSWORD */}
          <Input
            type="password"
            placeholder="Password"
            value={password}
            disabled={emailLoading}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={handleKeyDown}
          />

          {/* EMAIL LOGIN */}
          <Button
            className="w-full"
            onClick={handleEmailLogin}
            disabled={emailLoading || googleLoading}
          >
            {emailLoading ? "Signing in..." : "Login with Email"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}