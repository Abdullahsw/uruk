import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";

interface AuthModalProps {
  trigger: React.ReactNode;
  defaultTab?: "login" | "register";
}

const AuthModal = ({ trigger, defaultTab = "login" }: AuthModalProps) => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleSuccess = () => {
    setOpen(false);
  };

  const handleLoginClick = () => {
    setOpen(false);
    navigate("/login");
  };

  const handleRegisterClick = () => {
    setOpen(false);
    navigate("/register");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <Tabs defaultValue={defaultTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="login" id="login-tab">
              Login
            </TabsTrigger>
            <TabsTrigger value="register" id="register-tab">
              Register
            </TabsTrigger>
          </TabsList>
          <TabsContent value="login">
            <LoginForm
              onSuccess={handleSuccess}
              onRegisterClick={handleRegisterClick}
            />
            <div className="mt-4 text-center">
              <button
                onClick={handleLoginClick}
                className="text-sm text-primary hover:underline"
              >
                Go to full login page
              </button>
            </div>
          </TabsContent>
          <TabsContent value="register">
            <RegisterForm
              onSuccess={handleSuccess}
              onLoginClick={() => document.getElementById("login-tab")?.click()}
            />
            <div className="mt-4 text-center">
              <button
                onClick={handleRegisterClick}
                className="text-sm text-primary hover:underline"
              >
                Go to full registration page
              </button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
