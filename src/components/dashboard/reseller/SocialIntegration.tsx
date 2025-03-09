import React, { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  MessageSquare,
  Phone,
  Globe,
  Save,
  BrandTelegram,
  BrandWhatsapp,
} from "lucide-react";

const socialFormSchema = z.object({
  enableTelegram: z.boolean().default(false),
  telegramUsername: z.string().optional(),
  telegramBotToken: z.string().optional(),
  enableWhatsapp: z.boolean().default(false),
  whatsappNumber: z.string().optional(),
  whatsappBusinessId: z.string().optional(),
  enableOrderProcessing: z.boolean().default(false),
  enableCustomerSupport: z.boolean().default(false),
});

interface SocialIntegrationProps {
  currentPlan?: string;
}

const SocialIntegration = ({
  currentPlan = "premium",
}: SocialIntegrationProps) => {
  const form = useForm<z.infer<typeof socialFormSchema>>({
    resolver: zodResolver(socialFormSchema),
    defaultValues: {
      enableTelegram: false,
      telegramUsername: "",
      telegramBotToken: "",
      enableWhatsapp: false,
      whatsappNumber: "",
      whatsappBusinessId: "",
      enableOrderProcessing: false,
      enableCustomerSupport: false,
    },
  });

  const onSubmit = (data: z.infer<typeof socialFormSchema>) => {
    console.log("Social integration settings updated:", data);
    // Here you would send the data to your backend
  };

  const watchTelegram = form.watch("enableTelegram");
  const watchWhatsapp = form.watch("enableWhatsapp");

  return (
    <div>
      <Tabs defaultValue="social" className="w-full">
        <TabsList className="grid grid-cols-2 w-full max-w-md mb-8">
          <TabsTrigger value="social">Social Media</TabsTrigger>
          <TabsTrigger value="api">API Integration</TabsTrigger>
        </TabsList>

        <TabsContent value="social">
          <Card>
            <CardHeader>
              <CardTitle>Social Media Integration</CardTitle>
              <CardDescription>
                Connect your store to social media platforms for customer
                support and order processing
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-8"
                >
                  {/* Telegram Integration */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="text-blue-500"
                        >
                          <path d="m22 2-7 20-4-9-9-4Z" />
                          <path d="M22 2 11 13" />
                        </svg>
                        <h3 className="text-lg font-medium">
                          Telegram Integration
                        </h3>
                      </div>
                      <FormField
                        control={form.control}
                        name="enableTelegram"
                        render={({ field }) => (
                          <FormItem className="flex items-center space-x-2">
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <FormLabel className="!mt-0">
                              {field.value ? "Enabled" : "Disabled"}
                            </FormLabel>
                          </FormItem>
                        )}
                      />
                    </div>

                    {watchTelegram && (
                      <div className="space-y-4 pl-6 border-l-2 border-blue-200">
                        <FormField
                          control={form.control}
                          name="telegramUsername"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Telegram Username</FormLabel>
                              <FormControl>
                                <Input placeholder="@yourusername" {...field} />
                              </FormControl>
                              <FormDescription>
                                Your public Telegram username that customers can
                                contact
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="telegramBotToken"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Bot Token (Optional)</FormLabel>
                              <FormControl>
                                <Input
                                  type="password"
                                  placeholder="1234567890:ABCDEFGHIJKLMNOPQRSTUVWXYZ"
                                  {...field}
                                />
                              </FormControl>
                              <FormDescription>
                                For automated responses. Create a bot with
                                @BotFather
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    )}
                  </div>

                  <Separator />

                  {/* WhatsApp Integration */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="text-green-500"
                        >
                          <path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21" />
                          <path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1Z" />
                          <path d="M14 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1Z" />
                          <path d="M9.5 13.5c.5 1 1.5 1 2.5 1s2-.5 2.5-1" />
                        </svg>
                        <h3 className="text-lg font-medium">
                          WhatsApp Integration
                        </h3>
                      </div>
                      <FormField
                        control={form.control}
                        name="enableWhatsapp"
                        render={({ field }) => (
                          <FormItem className="flex items-center space-x-2">
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <FormLabel className="!mt-0">
                              {field.value ? "Enabled" : "Disabled"}
                            </FormLabel>
                          </FormItem>
                        )}
                      />
                    </div>

                    {watchWhatsapp && (
                      <div className="space-y-4 pl-6 border-l-2 border-green-200">
                        <FormField
                          control={form.control}
                          name="whatsappNumber"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>WhatsApp Number</FormLabel>
                              <FormControl>
                                <Input placeholder="+1234567890" {...field} />
                              </FormControl>
                              <FormDescription>
                                Your WhatsApp number with country code
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="whatsappBusinessId"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>
                                Business Account ID (Optional)
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="123456789012345"
                                  {...field}
                                />
                              </FormControl>
                              <FormDescription>
                                For WhatsApp Business API integration
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    )}
                  </div>

                  <Separator />

                  {/* Features */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Features</h3>

                    <FormField
                      control={form.control}
                      name="enableOrderProcessing"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">
                              Order Processing
                            </FormLabel>
                            <FormDescription>
                              Allow customers to place orders via Telegram and
                              WhatsApp
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              disabled={!watchTelegram && !watchWhatsapp}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="enableCustomerSupport"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">
                              Customer Support
                            </FormLabel>
                            <FormDescription>
                              Provide customer support through Telegram and
                              WhatsApp
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              disabled={!watchTelegram && !watchWhatsapp}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>

                  <Button type="submit">
                    <Save className="h-4 w-4 mr-2" />
                    Save Integration Settings
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="api">
          <Card>
            <CardHeader>
              <CardTitle>API Integration</CardTitle>
              <CardDescription>
                Connect to the main platform API to retrieve products and
                services
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">API Access</h3>
                  {currentPlan === "premium" ? (
                    <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                      Active
                    </Badge>
                  ) : (
                    <Badge
                      variant="outline"
                      className="bg-amber-50 text-amber-800 border-amber-200"
                    >
                      Pending Approval
                    </Badge>
                  )}
                </div>

                {currentPlan === "premium" ? (
                  <div className="space-y-4">
                    <div className="p-4 bg-gray-50 rounded-md">
                      <h4 className="font-medium mb-2">Your API Credentials</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">API Key:</span>
                          <code className="bg-gray-100 px-2 py-1 rounded text-sm">
                            sk_live_51NzQpLDJ7bPGsU8eMXNERLqYzVxYl
                          </code>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">
                            API Secret:
                          </span>
                          <code className="bg-gray-100 px-2 py-1 rounded text-sm">
                            ••••••••••••••••••••••••
                          </code>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-blue-50 rounded-md">
                      <h4 className="font-medium text-blue-800 mb-2">
                        API Documentation
                      </h4>
                      <p className="text-sm text-blue-700 mb-4">
                        Use our API to retrieve products, manage orders, and
                        more.
                      </p>
                      <Button variant="outline" size="sm" className="bg-white">
                        <Globe className="h-4 w-4 mr-2" />
                        View Documentation
                      </Button>
                    </div>

                    <div className="p-4 bg-gray-50 rounded-md">
                      <h4 className="font-medium mb-2">API Usage</h4>
                      <div className="space-y-2">
                        <div>
                          <div className="flex justify-between text-sm">
                            <span>Requests this month:</span>
                            <span className="font-medium">
                              12,456 / 100,000
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                            <div
                              className="bg-primary h-2 rounded-full"
                              style={{ width: "12.5%" }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 border rounded-md">
                      <h4 className="font-medium mb-2">Example API Request</h4>
                      <pre className="bg-gray-900 text-gray-100 p-4 rounded-md text-xs overflow-x-auto">
                        {`curl -X GET "https://api.platform.com/v1/products" \
  -H "Authorization: Bearer sk_live_51NzQpLDJ7bPGsU8eMXNERLqYzVxYl" \
  -H "Content-Type: application/json"`}
                      </pre>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="p-4 bg-amber-50 rounded-md">
                      <h4 className="font-medium text-amber-800 mb-2">
                        API Access Pending
                      </h4>
                      <p className="text-sm text-amber-700 mb-4">
                        Your API access request is currently under review by our
                        admin team. This process typically takes 1-2 business
                        days.
                      </p>
                      <div className="flex items-center text-sm text-amber-700">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="mr-2"
                        >
                          <circle cx="12" cy="12" r="10" />
                          <path d="M12 6v6l4 2" />
                        </svg>
                        <span>Request submitted on June 15, 2023</span>
                      </div>
                    </div>

                    <div className="p-4 bg-gray-50 rounded-md">
                      <h4 className="font-medium mb-2">API Features</h4>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="text-green-500 mr-2"
                          >
                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                            <path d="m9 11 3 3L22 4" />
                          </svg>
                          <span>Access to product catalog</span>
                        </li>
                        <li className="flex items-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="text-green-500 mr-2"
                          >
                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                            <path d="m9 11 3 3L22 4" />
                          </svg>
                          <span>Real-time inventory sync</span>
                        </li>
                        <li className="flex items-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="text-green-500 mr-2"
                          >
                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                            <path d="m9 11 3 3L22 4" />
                          </svg>
                          <span>Order management</span>
                        </li>
                        <li className="flex items-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="text-green-500 mr-2"
                          >
                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                            <path d="m9 11 3 3L22 4" />
                          </svg>
                          <span>Customer data access</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                )}

                <Button disabled={currentPlan === "premium"}>
                  {currentPlan === "premium"
                    ? "API Access Granted"
                    : "Request API Access"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SocialIntegration;
