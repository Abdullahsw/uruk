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
import { Label } from "@/components/ui/label";

// Mock product data
const mockProducts = [
  {
    id: "prod-001",
    image:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100&q=80",
    name: "Premium Wireless Headphones",
    category: "Electronics",
    basePrice: 129.99,
    yourPrice: 149.99,
    stock: 24,
    active: true,
  },
  {
    id: "prod-002",
    image:
      "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=100&q=80",
    name: "Smart Watch Series 5",
    category: "Electronics",
    basePrice: 249.99,
    yourPrice: 279.99,
    stock: 12,
    active: true,
  },
  {
    id: "prod-003",
    image:
      "https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=100&q=80",
    name: "Portable Bluetooth Speaker",
    category: "Electronics",
    basePrice: 79.99,
    yourPrice: 89.99,
    stock: 36,
    active: true,
  },
  {
    id: "prod-004",
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&q=80",
    name: "Noise Cancelling Earbuds",
    category: "Electronics",
    basePrice: 89.99,
    yourPrice: 99.99,
    stock: 18,
    active: false,
  },
  {
    id: "prod-005",
    image:
      "https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=100&q=80",
    name: "Smartphone Stabilizer Gimbal",
    category: "Electronics",
    basePrice: 119.99,
    yourPrice: 139.99,
    stock: 8,
    active: true,
  },
];

const ResellerProducts = () => {
  const [products, setProducts] = useState(mockProducts);
  const [searchQuery, setSearchQuery] = useState("");
  const [showOnlyActive, setShowOnlyActive] = useState(false);

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesActiveFilter = showOnlyActive ? product.active : true;
    return matchesSearch && matchesActiveFilter;
  });

  const toggleProductStatus = (id: string) => {
    setProducts(
      products.map((product) =>
        product.id === id ? { ...product, active: !product.active } : product,
      ),
    );
  };

  const updateProductPrice = (id: string, newPrice: number) => {
    setProducts(
      products.map((product) =>
        product.id === id ? { ...product, yourPrice: newPrice } : product,
      ),
    );
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

        <div className="flex items-center gap-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="active-filter"
              checked={showOnlyActive}
              onCheckedChange={setShowOnlyActive}
            />
            <Label htmlFor="active-filter">Show only active</Label>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>All Categories</DropdownMenuItem>
              <DropdownMenuItem>Electronics</DropdownMenuItem>
              <DropdownMenuItem>Fashion</DropdownMenuItem>
              <DropdownMenuItem>Home & Kitchen</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

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
                <TableHead className="text-right">Base Price</TableHead>
                <TableHead className="text-right">Your Price</TableHead>
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
                    ${product.basePrice.toFixed(2)}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end">
                      <span className="font-medium">
                        ${product.yourPrice.toFixed(2)}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 ml-2"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
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

export default ResellerProducts;
