import React, { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Save, Upload, Database, Shield, Globe } from "lucide-react";

const platformSettingsSchema = z.object({
  platformName: z
    .string()
    .min(2, "Platform name must be at least 2 characters"),
  platformDescription: z.string().optional(),
  supportEmail: z.string().email("Please enter a valid email"),
  allowResellerRegistration: z.boolean().default(true),
  requireEmailVerification: z.boolean().default(true),
  maintenanceMode: z.boolean().default(false),
});

const apiSettingsSchema = z.object({
  enablePublicApi: z.boolean().default(true),
  requireApiKey: z.boolean().default(true),
  rateLimitPerMinute: z.number().min(10).max(1000),
});

const AdminSettings = () => {
  const [logoUrl, setLogoUrl] = useState("/vite.svg");
  const [faviconUrl, setFaviconUrl] = useState("/vite.svg");
  const [primaryColor, setPrimaryColor] = useState("#4f46e5");
  const [secondaryColor, setSecondaryColor] = useState("#f97316");

  const platformForm = useForm<z.infer<typeof platformSettingsSchema>>({
    resolver: zodResolver(platformSettingsSchema),
    defaultValues: {
      platformName: "ShopHub",
      platformDescription:
        "Multi-tier e-commerce platform with reseller capabilities",
      supportEmail: "support@shophub.com",
      allowResellerRegistration: true,
      requireEmailVerification: true,
      maintenanceMode: false,
    },
  });

  const apiForm = useForm<z.infer<typeof apiSettingsSchema>>({
    resolver: zodResolver(apiSettingsSchema),
    defaultValues: {
      enablePublicApi: true,
      requireApiKey: true,
      rateLimitPerMinute: 60,
    },
  });

  const onPlatformSubmit = (data: z.infer<typeof platformSettingsSchema>) => {
    console.log("Platform settings updated:", data);
    // Here you would send the data to your backend
  };

  const onApiSubmit = (data: z.infer<typeof apiSettingsSchema>) => {
    console.log("API settings updated:", data);
    // Here you would send the data to your backend
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // In a real app, you would upload this to your server or cloud storage
      // For demo purposes, we'll just create a local URL
      const url = URL.createObjectURL(file);
      setLogoUrl(url);
    }
  };

  const handleFaviconUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setFaviconUrl(url);
    }
  };

  return (
    <div>
      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid grid-cols-3 w-full max-w-md mb-8">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="api">API</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>Platform Settings</CardTitle>
              <CardDescription>
                Configure general platform settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...platformForm}>
                <form
                  onSubmit={platformForm.handleSubmit(onPlatformSubmit)}
                  className="space-y-6"
                >
                  <FormField
                    control={platformForm.control}
                    name="platformName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Platform Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={platformForm.control}
                    name="platformDescription"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Platform Description</FormLabel>
                        <FormControl>
                          <Textarea {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={platformForm.control}
                    name="supportEmail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Support Email</FormLabel>
                        <FormControl>
                          <Input {...field} type="email" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Separator className="my-4" />

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Platform Features</h3>

                    <FormField
                      control={platformForm.control}
                      name="allowResellerRegistration"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">
                              Allow Reseller Registration
                            </FormLabel>
                            <FormDescription>
                              Allow users to register as resellers
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={platformForm.control}
                      name="requireEmailVerification"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">
                              Require Email Verification
                            </FormLabel>
                            <FormDescription>
                              Users must verify their email before accessing the
                              platform
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={platformForm.control}
                      name="maintenanceMode"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">
                              Maintenance Mode
                            </FormLabel>
                            <FormDescription>
                              Put the platform in maintenance mode (only admins
                              can access)
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>

                  <Button type="submit">
                    <Save className="h-4 w-4 mr-2" />
                    Save Settings
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance">
          <Card>
            <CardHeader>
              <CardTitle>Appearance Settings</CardTitle>
              <CardDescription>
                Customize your platform's look and feel
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-4">Logo & Favicon</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <Label>Platform Logo</Label>
                    <div className="flex items-center gap-4">
                      <div className="h-20 w-20 rounded-md border flex items-center justify-center bg-gray-50">
                        {logoUrl ? (
                          <img
                            src={logoUrl}
                            alt="Platform logo"
                            className="h-16 w-16 object-contain"
                          />
                        ) : (
                          <Upload className="h-8 w-8 text-gray-400" />
                        )}
                      </div>
                      <div className="flex-1">
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={handleLogoUpload}
                          className="mb-2"
                        />
                        <p className="text-xs text-gray-500">
                          Recommended size: 512x512px
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <Label>Favicon</Label>
                    <div className="flex items-center gap-4">
                      <div className="h-20 w-20 rounded-md border flex items-center justify-center bg-gray-50">
                        {faviconUrl ? (
                          <img
                            src={faviconUrl}
                            alt="Favicon"
                            className="h-8 w-8 object-contain"
                          />
                        ) : (
                          <Upload className="h-6 w-6 text-gray-400" />
                        )}
                      </div>
                      <div className="flex-1">
                        <Input
                          type="file"
                          accept="image/png,image/x-icon"
                          onChange={handleFaviconUpload}
                          className="mb-2"
                        />
                        <p className="text-xs text-gray-500">
                          Recommended size: 32x32px
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-medium mb-4">Colors</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <Label htmlFor="primaryColor">Primary Color</Label>
                    <div className="flex items-center gap-4">
                      <div
                        className="h-10 w-10 rounded-md border"
                        style={{ backgroundColor: primaryColor }}
                      />
                      <Input
                        id="primaryColor"
                        type="color"
                        value={primaryColor}
                        onChange={(e) => setPrimaryColor(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <Label htmlFor="secondaryColor">Secondary Color</Label>
                    <div className="flex items-center gap-4">
                      <div
                        className="h-10 w-10 rounded-md border"
                        style={{ backgroundColor: secondaryColor }}
                      />
                      <Input
                        id="secondaryColor"
                        type="color"
                        value={secondaryColor}
                        onChange={(e) => setSecondaryColor(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <Button>
                <Save className="h-4 w-4 mr-2" />
                Save Appearance
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="api">
          <Card>
            <CardHeader>
              <CardTitle>API Settings</CardTitle>
              <CardDescription>
                Configure API access and security settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...apiForm}>
                <form
                  onSubmit={apiForm.handleSubmit(onApiSubmit)}
                  className="space-y-6"
                >
                  <div className="space-y-4">
                    <FormField
                      control={apiForm.control}
                      name="enablePublicApi"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">
                              Enable Public API
                            </FormLabel>
                            <FormDescription>
                              Allow access to the platform's public API
                              endpoints
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={apiForm.control}
                      name="requireApiKey"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">
                              Require API Key
                            </FormLabel>
                            <FormDescription>
                              Require API key for all API requests
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              disabled={!apiForm.watch("enablePublicApi")}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={apiForm.control}
                      name="rateLimitPerMinute"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Rate Limit (requests per minute)
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              {...field}
                              onChange={(e) =>
                                field.onChange(parseInt(e.target.value))
                              }
                              disabled={!apiForm.watch("enablePublicApi")}
                            />
                          </FormControl>
                          <FormDescription>
                            Maximum number of API requests allowed per minute
                            per IP
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="p-4 bg-gray-50 rounded-md">
                    <div className="flex items-center mb-2">
                      <Database className="h-5 w-5 mr-2 text-gray-500" />
                      <h3 className="font-medium">API Documentation</h3>
                    </div>
                    <p className="text-sm text-gray-600 mb-4">
                      Your API documentation is available at:
                    </p>
                    <code className="bg-gray-100 p-2 rounded block text-sm">
                      https://api.shophub.com/docs
                    </code>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-md">
                    <div className="flex items-center mb-2">
                      <Shield className="h-5 w-5 mr-2 text-gray-500" />
                      <h3 className="font-medium">API Security</h3>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      Your API is protected with the following security
                      measures:
                    </p>
                    <ul className="text-sm text-gray-600 list-disc list-inside space-y-1">
                      <li>HTTPS encryption</li>
                      <li>API key authentication</li>
                      <li>Rate limiting</li>
                      <li>IP whitelisting (optional)</li>
                    </ul>
                  </div>

                  <Button type="submit">
                    <Save className="h-4 w-4 mr-2" />
                    Save API Settings
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminSettings;
