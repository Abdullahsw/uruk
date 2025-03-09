import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";

type AuthMode = "login" | "register";

interface AuthModalProps {
  trigger: React.ReactNode;
  defaultMode?: AuthMode;
  onAuthSuccess?: () => void;
}

const AuthModal = ({
  trigger,
  defaultMode = "login",
  onAuthSuccess = () => {},
}: AuthModalProps) => {
  const [mode, setMode] = useState<AuthMode>(defaultMode);
  const [open, setOpen] = useState(false);

  const handleSuccess = () => {
    setOpen(false);
    onAuthSuccess();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">
            {mode === "login" ? "Welcome Back" : "Create Account"}
          </DialogTitle>
          <DialogDescription className="text-center">
            {mode === "login"
              ? "Sign in to your account to continue"
              : "Join our platform to start shopping"}
          </DialogDescription>
        </DialogHeader>

        {mode === "login" ? (
          <LoginForm
            onSuccess={handleSuccess}
            onRegisterClick={() => setMode("register")}
          />
        ) : (
          <RegisterForm
            onSuccess={handleSuccess}
            onLoginClick={() => setMode("login")}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
