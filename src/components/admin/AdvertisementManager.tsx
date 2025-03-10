import React, { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";
import { Trash2, Edit, Plus, Image } from "lucide-react";

interface Advertisement {
  id: string;
  title: string;
  imageUrl: string;
  redirectUrl: string;
  duration: number;
  active: boolean;
}

const formSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),
  imageUrl: z.string().url("Please enter a valid URL"),
  redirectUrl: z.string().url("Please enter a valid URL"),
  duration: z.coerce
    .number()
    .min(1, "Duration must be at least 1 second")
    .max(60, "Duration cannot exceed 60 seconds"),
});

type FormValues = z.infer<typeof formSchema>;

const AdvertisementManager = () => {
  const { toast } = useToast();
  const [advertisements, setAdvertisements] = useState<Advertisement[]>([
    {
      id: "ad1",
      title: "Summer Sale - Up to 50% Off",
      imageUrl:
        "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1400&q=80",
      redirectUrl: "/offers/summer-sale",
      duration: 5,
      active: true,
    },
    {
      id: "ad2",
      title: "New Arrivals - Shop Now",
      imageUrl:
        "https://images.unsplash.com/photo-1607083206968-13611e3d76db?w=1400&q=80",
      redirectUrl: "/offers/new-arrivals",
      duration: 5,
      active: true,
    },
    {
      id: "ad3",
      title: "Electronics Sale - Limited Time",
      imageUrl:
        "https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?w=1400&q=80",
      redirectUrl: "/offers/electronics",
      duration: 5,
      active: true,
    },
  ]);

  const [editingId, setEditingId] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      imageUrl: "",
      redirectUrl: "",
      duration: 5,
    },
  });

  const onSubmit = (data: FormValues) => {
    if (editingId) {
      // Update existing advertisement
      setAdvertisements(
        advertisements.map((ad) =>
          ad.id === editingId ? { ...ad, ...data } : ad,
        ),
      );
      toast({
        title: "Advertisement updated",
        description: "The advertisement has been updated successfully.",
      });
    } else {
      // Add new advertisement
      const newAd: Advertisement = {
        id: `ad${Date.now()}`,
        ...data,
        active: true,
      };
      setAdvertisements([...advertisements, newAd]);
      toast({
        title: "Advertisement added",
        description: "The advertisement has been added successfully.",
      });
    }

    // Reset form
    form.reset();
    setEditingId(null);
  };

  const handleEdit = (ad: Advertisement) => {
    setEditingId(ad.id);
    form.reset({
      title: ad.title,
      imageUrl: ad.imageUrl,
      redirectUrl: ad.redirectUrl,
      duration: ad.duration,
    });
  };

  const handleDelete = (id: string) => {
    setAdvertisements(advertisements.filter((ad) => ad.id !== id));
    toast({
      title: "Advertisement deleted",
      description: "The advertisement has been deleted successfully.",
    });
  };

  const toggleActive = (id: string) => {
    setAdvertisements(
      advertisements.map((ad) =>
        ad.id === id ? { ...ad, active: !ad.active } : ad,
      ),
    );
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>
            {editingId ? "Edit Advertisement" : "Add New Advertisement"}
          </CardTitle>
          <CardDescription>
            {editingId
              ? "Update the advertisement details"
              : "Create a new advertisement for the homepage carousel"}
          </CardDescription>
          <p className="text-sm text-gray-500 mt-2">
            Advertisements will appear in the Featured Offers section on the
            homepage.
          </p>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Summer Sale - Up to 50% Off"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      A descriptive title for the advertisement
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="imageUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Image URL</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://example.com/image.jpg"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      URL of the advertisement image (recommended size:
                      1400x400px). For best results, use high-quality images
                      with a 3.5:1 aspect ratio.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="redirectUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Redirect URL</FormLabel>
                    <FormControl>
                      <Input placeholder="/offers/summer-sale" {...field} />
                    </FormControl>
                    <FormDescription>
                      Where users will be directed when they click on the
                      advertisement. Use relative paths (e.g., /products/123) or
                      full URLs.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="duration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Duration (seconds)</FormLabel>
                    <FormControl>
                      <Input type="number" min="1" max="60" {...field} />
                    </FormControl>
                    <FormDescription>
                      How long the advertisement will be displayed in the
                      carousel
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex space-x-2">
                <Button type="submit">
                  {editingId ? "Update Advertisement" : "Add Advertisement"}
                </Button>
                {editingId && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setEditingId(null);
                      form.reset();
                    }}
                  >
                    Cancel
                  </Button>
                )}
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Manage Advertisements</CardTitle>
          <CardDescription>
            View, edit, and delete advertisements for the homepage carousel
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">Image</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Redirect URL</TableHead>
                <TableHead className="text-center">Duration</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {advertisements.map((ad) => (
                <TableRow key={ad.id}>
                  <TableCell>
                    <div className="w-16 h-10 bg-gray-100 rounded overflow-hidden">
                      {ad.imageUrl ? (
                        <img
                          src={ad.imageUrl}
                          alt={ad.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Image className="h-5 w-5 text-gray-400" />
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{ad.title}</TableCell>
                  <TableCell className="text-sm text-gray-500">
                    {ad.redirectUrl}
                  </TableCell>
                  <TableCell className="text-center">{ad.duration}s</TableCell>
                  <TableCell className="text-center">
                    <Button
                      variant={ad.active ? "default" : "outline"}
                      size="sm"
                      onClick={() => toggleActive(ad.id)}
                    >
                      {ad.active ? "Active" : "Inactive"}
                    </Button>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(ad)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive"
                        onClick={() => handleDelete(ad.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdvertisementManager;
