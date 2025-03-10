import React, { useState } from "react";
import { Search, Plus, Edit, Trash2, Filter, ArrowUpDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";

// Mock product data
const mockProducts = [
  {
    id: "prod-001",
    image:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100&q=80",
    name: "Premium Wireless Headphones",
    category: "Electronics",
    price: 129.99,
    stock: 24,
    active: true,
  },
  {
    id: "prod-002",
    image:
      "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=100&q=80",
    name: "Smart Watch Series 5",
    category: "Electronics",
    price: 249.99,
    stock: 12,
    active: true,
  },
  {
    id: "prod-003",
    image:
      "https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=100&q=80",
    name: "Portable Bluetooth Speaker",
    category: "Electronics",
    price: 79.99,
    stock: 36,
    active: true,
  },
  {
    id: "prod-004",
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&q=80",
    name: "Noise Cancelling Earbuds",
    category: "Electronics",
    price: 89.99,
    stock: 18,
    active: false,
  },
  {
    id: "prod-005",
    image:
      "https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=100&q=80",
    name: "Smartphone Stabilizer Gimbal",
    category: "Electronics",
    price: 119.99,
    stock: 8,
    active: true,
  },
];

const AdminProducts = () => {
  const [products, setProducts] = useState(mockProducts);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [showOnlyActive, setShowOnlyActive] = useState(false);

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory =
      categoryFilter === "all" || product.category === categoryFilter;
    const matchesActiveFilter = showOnlyActive ? product.active : true;
    return matchesSearch && matchesCategory && matchesActiveFilter;
  });

  const toggleProductStatus = (id: string) => {
    setProducts(
      products.map((product) =>
        product.id === id ? { ...product, active: !product.active } : product,
      ),
    );
  };

  const deleteProduct = (id: string) => {
    setProducts(products.filter((product) => product.id !== id));
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div className="relative w-full md:w-64">
          <Input
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                {categoryFilter === "all" ? "All Categories" : categoryFilter}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setCategoryFilter("all")}>
                All Categories
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setCategoryFilter("Electronics")}
              >
                Electronics
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setCategoryFilter("Fashion")}>
                Fashion
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setCategoryFilter("Home & Kitchen")}
              >
                Home & Kitchen
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="flex items-center space-x-2">
            <Switch
              id="active-filter"
              checked={showOnlyActive}
              onCheckedChange={setShowOnlyActive}
            />
            <label htmlFor="active-filter" className="text-sm">
              Show only active
            </label>
          </div>

          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Product
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">Image</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Price</TableHead>
                <TableHead className="text-center">Stock</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-10 h-10 rounded-md object-cover"
                    />
                  </TableCell>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell className="text-right">
                    ${product.price.toFixed(2)}
                  </TableCell>
                  <TableCell className="text-center">
                    {product.stock < 10 ? (
                      <Badge variant="destructive">{product.stock}</Badge>
                    ) : (
                      product.stock
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    <Switch
                      checked={product.active}
                      onCheckedChange={() => toggleProductStatus(product.id)}
                    />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive"
                        onClick={() => deleteProduct(product.id)}
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

export default AdminProducts;
