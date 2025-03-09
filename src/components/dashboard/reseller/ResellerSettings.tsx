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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Globe, CreditCard, Upload, Save } from "lucide-react";

const storeFormSchema = z.object({
  storeName: z.string().min(2, "Store name must be at least 2 characters"),
  storeDescription: z.string().optional(),
  storeEmail: z.string().email("Please enter a valid email"),
  storePhone: z.string().min(5, "Please enter a valid phone number"),
  storeAddress: z.string().min(5, "Please enter a valid address"),
  storeCity: z.string().min(2, "Please enter a valid city"),
  storeState: z.string().min(2, "Please enter a valid state/province"),
  storeZip: z.string().min(3, "Please enter a valid postal code"),
  storeCountry: z.string().min(2, "Please select a country"),
});

const domainFormSchema = z.object({
  customDomain: z.string().optional(),
  useSsl: z.boolean().default(true),
});

interface ResellerSettingsProps {
  currentPlan?: string;
}

const ResellerSettings = ({
  currentPlan = "premium",
}: ResellerSettingsProps) => {
  const [logoUrl, setLogoUrl] = useState("");
  const [faviconUrl, setFaviconUrl] = useState("");
  const [primaryColor, setPrimaryColor] = useState("#4f46e5");
  const [secondaryColor, setSecondaryColor] = useState("#f97316");

  const storeForm = useForm<z.infer<typeof storeFormSchema>>({
    resolver: zodResolver(storeFormSchema),
    defaultValues: {
      storeName: "My Awesome Store",
      storeDescription: "The best products at the best prices",
      storeEmail: "contact@mystore.com",
      storePhone: "+1 (555) 123-4567",
      storeAddress: "123 Main Street",
      storeCity: "New York",
      storeState: "NY",
      storeZip: "10001",
      storeCountry: "US",
    },
  });

  const domainForm = useForm<z.infer<typeof domainFormSchema>>({
    resolver: zodResolver(domainFormSchema),
    defaultValues: {
      customDomain: "mystore.com",
      useSsl: true,
    },
  });

  const onStoreSubmit = (data: z.infer<typeof storeFormSchema>) => {
    console.log("Store settings updated:", data);
    // Here you would send the data to your backend
  };

  const onDomainSubmit = (data: z.infer<typeof domainFormSchema>) => {
    console.log("Domain settings updated:", data);
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
        <TabsList className="grid grid-cols-4 w-full max-w-md mb-8">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="domain">Domain</TabsTrigger>
          <TabsTrigger value="plan">Plan</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>Store Information</CardTitle>
              <CardDescription>
                Manage your store details and contact information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...storeForm}>
                <form
                  onSubmit={storeForm.handleSubmit(onStoreSubmit)}
                  className="space-y-6"
                >
                  <FormField
                    control={storeForm.control}
                    name="storeName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Store Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={storeForm.control}
                    name="storeDescription"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Store Description</FormLabel>
                        <FormControl>
                          <Textarea {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={storeForm.control}
                      name="storeEmail"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={storeForm.control}
                      name="storePhone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Store Address</h3>

                    <FormField
                      control={storeForm.control}
                      name="storeAddress"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Street Address</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={storeForm.control}
                        name="storeCity"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>City</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={storeForm.control}
                        name="storeState"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>State/Province</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={storeForm.control}
                        name="storeZip"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Postal Code</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={storeForm.control}
                        name="storeCountry"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Country</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a country" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="US">
                                  United States
                                </SelectItem>
                                <SelectItem value="CA">Canada</SelectItem>
                                <SelectItem value="UK">
                                  United Kingdom
                                </SelectItem>
                                <SelectItem value="AU">Australia</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <Button type="submit">
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance">
          <Card>
            <CardHeader>
              <CardTitle>Store Appearance</CardTitle>
              <CardDescription>
                Customize your store's look and feel
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-4">Logo & Favicon</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <Label>Store Logo</Label>
                    <div className="flex items-center gap-4">
                      <div className="h-20 w-20 rounded-md border flex items-center justify-center bg-gray-50">
                        {logoUrl ? (
                          <img
                            src={logoUrl}
                            alt="Store logo"
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

        <TabsContent value="domain">
          <Card>
            <CardHeader>
              <CardTitle>Domain Settings</CardTitle>
              <CardDescription>
                Configure your custom domain and SSL settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...domainForm}>
                <form
                  onSubmit={domainForm.handleSubmit(onDomainSubmit)}
                  className="space-y-6"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium">Your Store URL</h3>
                      {currentPlan === "premium" ? (
                        <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                          Premium Feature
                        </Badge>
                      ) : (
                        <Badge
                          variant="outline"
                          className="bg-amber-50 text-amber-800 border-amber-200"
                        >
                          Upgrade Required
                        </Badge>
                      )}
                    </div>

                    <div className="p-4 bg-gray-50 rounded-md">
                      <p className="text-sm text-gray-600 mb-2">
                        Your default store URL:
                      </p>
                      <div className="flex items-center">
                        <Globe className="h-4 w-4 mr-2 text-gray-500" />
                        <code className="bg-white px-2 py-1 rounded border text-sm">
                          my-awesome-store.reseller-platform.com
                        </code>
                      </div>
                    </div>

                    <FormField
                      control={domainForm.control}
                      name="customDomain"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Custom Domain</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="yourdomain.com"
                              disabled={currentPlan !== "premium"}
                            />
                          </FormControl>
                          <FormDescription>
                            Enter your domain without http:// or https://
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {currentPlan === "premium" && (
                      <div className="p-4 bg-blue-50 rounded-md">
                        <h4 className="font-medium text-blue-800 mb-2">
                          DNS Configuration
                        </h4>
                        <p className="text-sm text-blue-700 mb-4">
                          To connect your custom domain, add the following DNS
                          records at your domain registrar:
                        </p>
                        <div className="space-y-2">
                          <div className="grid grid-cols-3 gap-2 text-sm">
                            <div className="font-medium">Type</div>
                            <div className="font-medium">Name</div>
                            <div className="font-medium">Value</div>
                          </div>
                          <div className="grid grid-cols-3 gap-2 text-sm bg-white p-2 rounded">
                            <div>A</div>
                            <div>@</div>
                            <div>192.168.1.1</div>
                          </div>
                          <div className="grid grid-cols-3 gap-2 text-sm bg-white p-2 rounded">
                            <div>CNAME</div>
                            <div>www</div>
                            <div>my-awesome-store.reseller-platform.com</div>
                          </div>
                        </div>
                      </div>
                    )}

                    <FormField
                      control={domainForm.control}
                      name="useSsl"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">
                              SSL Certificate
                            </FormLabel>
                            <FormDescription>
                              Secure your store with HTTPS
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              disabled={currentPlan !== "premium"}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>

                  <Button type="submit" disabled={currentPlan !== "premium"}>
                    <Save className="h-4 w-4 mr-2" />
                    Save Domain Settings
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="plan">
          <Card>
            <CardHeader>
              <CardTitle>Subscription Plan</CardTitle>
              <CardDescription>
                Manage your reseller subscription plan
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="p-4 bg-green-50 rounded-md">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-medium text-green-800">
                        Premium Plan
                      </h3>
                      <p className="text-sm text-green-700">
                        Your current plan
                      </p>
                    </div>
                    <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                      Active
                    </Badge>
                  </div>
                  <div className="mt-4">
                    <div className="text-2xl font-bold text-green-800">
                      $49.99<span className="text-sm font-normal">/month</span>
                    </div>
                    <p className="text-sm text-green-700 mt-1">
                      Next billing date: July 15, 2023
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Plan Features</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-gray-50 rounded-md">
                      <h4 className="font-medium mb-2">Custom Domain</h4>
                      <p className="text-sm text-gray-600">
                        Use your own domain name for your store
                      </p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-md">
                      <h4 className="font-medium mb-2">SSL Certificate</h4>
                      <p className="text-sm text-gray-600">
                        Secure your store with HTTPS
                      </p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-md">
                      <h4 className="font-medium mb-2">Custom Categories</h4>
                      <p className="text-sm text-gray-600">
                        Create your own product categories
                      </p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-md">
                      <h4 className="font-medium mb-2">Custom Pricing</h4>
                      <p className="text-sm text-gray-600">
                        Set your own prices for products
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Payment Method</h3>
                  <div className="p-4 border rounded-md">
                    <div className="flex items-center">
                      <CreditCard className="h-5 w-5 mr-2 text-gray-500" />
                      <div>
                        <div className="font-medium">Visa ending in 4242</div>
                        <div className="text-sm text-gray-500">
                          Expires 12/2025
                        </div>
                      </div>
                    </div>
                  </div>
                  <Button variant="outline">Update Payment Method</Button>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-red-600">
                    Cancel Subscription
                  </h3>
                  <p className="text-sm text-gray-600">
                    If you cancel your subscription, you will lose access to
                    premium features at the end of your billing period.
                  </p>
                  <Button variant="destructive">Cancel Subscription</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ResellerSettings;
