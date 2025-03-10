import React, { useState, useEffect } from "react";
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
import { useAuth } from "@/lib/auth";
import { getUserProfile, updateUserProfile } from "@/lib/auth/userOperations";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface ProfileFormProps {
  onSuccess?: () => void;
}

const ProfileForm = ({ onSuccess = () => {} }: ProfileFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      username: "",
    },
  });

  // Load user profile data
  useEffect(() => {
    const loadUserProfile = async () => {
      if (!user) return;

      setIsLoadingProfile(true);
      try {
        const { success, profile, error } = await getUserProfile(user.id);

        if (success && profile) {
          form.reset({
            name: profile.name || "",
            username: profile.username || "",
          });
        } else if (error) {
          toast({
            variant: "destructive",
            title: "Failed to load profile",
            description: error,
          });
        }
      } catch (error) {
        console.error("Error loading profile:", error);
      } finally {
        setIsLoadingProfile(false);
      }
    };

    loadUserProfile();
  }, [user, form, toast]);

  const onSubmit = async (data: FormValues) => {
    if (!user) return;

    setIsLoading(true);
    try {
      const { success, error } = await updateUserProfile(user.id, {
        name: data.name,
        username: data.username,
      });

      if (success) {
        toast({
          title: "Profile updated",
          description: "Your profile has been updated successfully.",
        });
        onSuccess();
      } else {
        toast({
          variant: "destructive",
          title: "Update failed",
          description: error || "Failed to update profile",
        });
      }
    } catch (error: any) {
      console.error("Profile update error:", error);
      toast({
        variant: "destructive",
        title: "Update failed",
        description: error.message || "An unexpected error occurred",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoadingProfile) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center py-6">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Information</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="John Doe"
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormDescription>
                    Your name as it will appear on your profile
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="johndoe"
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormDescription>
                    Choose a unique username for your account
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={isLoading} isLoading={isLoading}>
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default ProfileForm;
