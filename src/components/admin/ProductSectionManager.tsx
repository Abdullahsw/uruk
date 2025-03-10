import React, { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import {
  Trash2,
  Edit,
  Plus,
  GripVertical,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import { Switch } from "@/components/ui/switch";

interface ProductSection {
  id: string;
  title: string;
  type: "bestsellers" | "offers" | "new-arrivals" | "custom";
  layout: "vertical" | "horizontal";
  active: boolean;
  order: number;
  productIds: string[];
}

const formSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),
  type: z.enum(["bestsellers", "offers", "new-arrivals", "custom"]),
  layout: z.enum(["vertical", "horizontal"]),
});

type FormValues = z.infer<typeof formSchema>;

const ProductSectionManager = () => {
  const { toast } = useToast();
  const [sections, setSections] = useState<ProductSection[]>([
    {
      id: "section1",
      title: "Bestsellers",
      type: "bestsellers",
      layout: "vertical",
      active: true,
      order: 1,
      productIds: ["prod-001", "prod-002", "prod-003", "prod-004"],
    },
    {
      id: "section2",
      title: "Special Offers",
      type: "offers",
      layout: "vertical",
      active: true,
      order: 2,
      productIds: ["prod-002", "prod-005", "prod-006"],
    },
    {
      id: "section3",
      title: "New Arrivals",
      type: "new-arrivals",
      layout: "horizontal",
      active: true,
      order: 3,
      productIds: ["prod-007", "prod-008", "prod-009", "prod-010"],
    },
  ]);

  const [editingId, setEditingId] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      type: "custom",
      layout: "vertical",
    },
  });

  const onSubmit = (data: FormValues) => {
    if (editingId) {
      // Update existing section
      setSections(
        sections.map((section) =>
          section.id === editingId ? { ...section, ...data } : section,
        ),
      );
      toast({
        title: "Section updated",
        description: "The product section has been updated successfully.",
      });
    } else {
      // Add new section
      const newSection: ProductSection = {
        id: `section${Date.now()}`,
        ...data,
        active: true,
        order: sections.length + 1,
        productIds: [],
      };
      setSections([...sections, newSection]);
      toast({
        title: "Section added",
        description: "The product section has been added successfully.",
      });
    }

    // Reset form
    form.reset();
    setEditingId(null);
  };

  const handleEdit = (section: ProductSection) => {
    setEditingId(section.id);
    form.reset({
      title: section.title,
      type: section.type,
      layout: section.layout,
    });
  };

  const handleDelete = (id: string) => {
    setSections(sections.filter((section) => section.id !== id));
    toast({
      title: "Section deleted",
      description: "The product section has been deleted successfully.",
    });
  };

  const toggleActive = (id: string) => {
    setSections(
      sections.map((section) =>
        section.id === id ? { ...section, active: !section.active } : section,
      ),
    );
  };

  const moveUp = (id: string) => {
    const index = sections.findIndex((section) => section.id === id);
    if (index <= 0) return;

    const newSections = [...sections];
    const temp = newSections[index].order;
    newSections[index].order = newSections[index - 1].order;
    newSections[index - 1].order = temp;

    // Sort by order
    newSections.sort((a, b) => a.order - b.order);

    setSections(newSections);
  };

  const moveDown = (id: string) => {
    const index = sections.findIndex((section) => section.id === id);
    if (index >= sections.length - 1) return;

    const newSections = [...sections];
    const temp = newSections[index].order;
    newSections[index].order = newSections[index + 1].order;
    newSections[index + 1].order = temp;

    // Sort by order
    newSections.sort((a, b) => a.order - b.order);

    setSections(newSections);
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>
            {editingId ? "Edit Section" : "Add New Product Section"}
          </CardTitle>
          <CardDescription>
            {editingId
              ? "Update the product section details"
              : "Create a new product section for the homepage"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Section Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Bestsellers" {...field} />
                    </FormControl>
                    <FormDescription>
                      The title displayed above the product section
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Section Type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select section type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="bestsellers">Bestsellers</SelectItem>
                        <SelectItem value="offers">Special Offers</SelectItem>
                        <SelectItem value="new-arrivals">
                          New Arrivals
                        </SelectItem>
                        <SelectItem value="custom">Custom Selection</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      The type determines which products are displayed in this
                      section
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="layout"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Layout</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select layout" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="vertical">Vertical Grid</SelectItem>
                        <SelectItem value="horizontal">
                          Horizontal Scroll
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      How products are displayed in this section. Vertical grid
                      is recommended for better mobile compatibility.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex space-x-2">
                <Button type="submit">
                  {editingId ? "Update Section" : "Add Section"}
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
          <CardTitle>Manage Product Sections</CardTitle>
          <CardDescription>
            View, edit, and reorder product sections on the homepage
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">Order</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Layout</TableHead>
                <TableHead className="text-center">Products</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sections
                .sort((a, b) => a.order - b.order)
                .map((section) => (
                  <TableRow key={section.id}>
                    <TableCell>
                      <div className="flex flex-col items-center">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => moveUp(section.id)}
                          disabled={section.order === 1}
                        >
                          <ArrowUp className="h-4 w-4" />
                        </Button>
                        <span className="mx-2">{section.order}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => moveDown(section.id)}
                          disabled={section.order === sections.length}
                        >
                          <ArrowDown className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">
                      {section.title}
                    </TableCell>
                    <TableCell>
                      {section.type === "bestsellers" && "Bestsellers"}
                      {section.type === "offers" && "Special Offers"}
                      {section.type === "new-arrivals" && "New Arrivals"}
                      {section.type === "custom" && "Custom Selection"}
                    </TableCell>
                    <TableCell>
                      {section.layout === "vertical"
                        ? "Vertical Grid"
                        : "Horizontal Scroll"}
                    </TableCell>
                    <TableCell className="text-center">
                      {section.productIds.length}
                    </TableCell>
                    <TableCell className="text-center">
                      <Switch
                        checked={section.active}
                        onCheckedChange={() => toggleActive(section.id)}
                      />
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            // This would open a product selection modal in a real app
                            toast({
                              title: "Manage Products",
                              description:
                                "This would open a product selection interface.",
                            });
                          }}
                        >
                          Manage Products
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(section)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive"
                          onClick={() => handleDelete(section.id)}
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

export default ProductSectionManager;
