import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { requestPasswordReset } from "@/lib/auth/passwordReset";

const formSchema = z.object({
  email: z.string().email("Invalid email address"),
});

type FormValues = z.infer<typeof formSchema>;

interface ForgotPasswordFormProps {
  onSuccess?: () => void;
  onLoginClick?: () => void;
}

const ForgotPasswordForm = ({
  onSuccess = () => {},
  onLoginClick = () => {},
}: ForgotPasswordFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);
    try {
      const result = await requestPasswordReset(data.email);

      if (result.success) {
        setEmailSent(true);
        toast({
          title: "Reset link sent",
          description: result.message,
        });
        onSuccess();

        // In development mode, show the token for testing
        if (import.meta.env.DEV && result.token) {
          console.log("Reset token for testing:", result.token);
          toast({
            title: "Development Mode",
            description: `Reset token: ${result.token.substring(0, 8)}...`,
          });
        }
      } else {
        toast({
          variant: "destructive",
          title: "Request failed",
          description: result.message,
        });
      }
    } catch (error: any) {
      console.error("Password reset request error:", error);
      toast({
        variant: "destructive",
        title: "Request failed",
        description: error.message || "An unexpected error occurred",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (emailSent) {
    return (
      <Card className="w-full max-w-md mx-auto bg-white">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Check Your Email
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center mb-6">
            We've sent a password reset link to your email address. Please check
            your inbox and follow the instructions to reset your password.
          </p>
          <p className="text-center text-sm text-gray-500 mb-4">
            If you don't receive an email within a few minutes, check your spam
            folder or try again.
          </p>
          <div className="flex flex-col space-y-2">
            <Button variant="outline" onClick={() => setEmailSent(false)}>
              Try Another Email
            </Button>
            <Button variant="link" onClick={onLoginClick}>
              Return to Login
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto bg-white">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">
          Forgot Password
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="your.email@example.com"
                      type="email"
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormDescription>
                    Enter the email address associated with your account
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
              isLoading={isLoading}
            >
              {isLoading ? "Sending Reset Link..." : "Send Reset Link"}
            </Button>

            <div className="text-center mt-4">
              <p className="text-sm text-gray-600">
                Remembered your password?{" "}
                <Button
                  variant="link"
                  className="p-0 h-auto font-semibold"
                  onClick={onLoginClick}
                >
                  Login
                </Button>
              </p>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default ForgotPasswordForm;
