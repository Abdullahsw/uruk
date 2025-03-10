import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

const AdminCredentials = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: "The credentials have been copied to your clipboard.",
    });
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Admin Credentials</CardTitle>
        <CardDescription>
          Use these credentials to access the admin dashboard
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="font-medium">Email:</span>
            <code className="bg-gray-100 px-2 py-1 rounded text-sm">
              admin@shophub.com
            </code>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => copyToClipboard("admin@shophub.com")}
            >
              Copy
            </Button>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-medium">Password:</span>
            <code className="bg-gray-100 px-2 py-1 rounded text-sm">
              Admin123!
            </code>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => copyToClipboard("Admin123!")}
            >
              Copy
            </Button>
          </div>
        </div>

        <div className="pt-4">
          <p className="text-sm text-gray-500 mb-4">
            After logging in with these credentials, you'll have access to the
            admin dashboard where you can manage users, resellers, products, and
            API requests.
          </p>
          <Button className="w-full" onClick={() => navigate("/login")}>
            Go to Login
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminCredentials;
