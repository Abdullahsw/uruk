import React, { useState } from "react";
import {
  Search,
  Filter,
  Mail,
  Phone,
  User,
  MoreHorizontal,
  UserPlus,
  Download,
} from "lucide-react";
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

// Mock user data
const mockUsers = [
  {
    id: "user-001",
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    accountType: "customer",
    status: "active",
    joinDate: "2023-01-15T10:30:00Z",
    orders: 5,
  },
  {
    id: "user-002",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    phone: "+1 (555) 987-6543",
    accountType: "reseller",
    status: "active",
    joinDate: "2023-02-10T14:45:00Z",
    orders: 12,
  },
  {
    id: "user-003",
    name: "Robert Johnson",
    email: "robert.j@example.com",
    phone: "+1 (555) 456-7890",
    accountType: "customer",
    status: "inactive",
    joinDate: "2023-03-08T09:15:00Z",
    orders: 0,
  },
  {
    id: "user-004",
    name: "Emily Wilson",
    email: "emily.w@example.com",
    phone: "+1 (555) 234-5678",
    accountType: "customer",
    status: "active",
    joinDate: "2023-04-05T16:20:00Z",
    orders: 3,
  },
  {
    id: "user-005",
    name: "Michael Brown",
    email: "michael.b@example.com",
    phone: "+1 (555) 876-5432",
    accountType: "admin",
    status: "active",
    joinDate: "2023-05-01T11:10:00Z",
    orders: 0,
  },
];

const AdminUsers = () => {
  const [users, setUsers] = useState(mockUsers);
  const [searchQuery, setSearchQuery] = useState("");
  const [accountTypeFilter, setAccountTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.phone.includes(searchQuery);

    const matchesAccountType =
      accountTypeFilter === "all" || user.accountType === accountTypeFilter;
    const matchesStatus =
      statusFilter === "all" || user.status === statusFilter;

    return matchesSearch && matchesAccountType && matchesStatus;
  });

  const getAccountTypeBadge = (type: string) => {
    switch (type) {
      case "admin":
        return (
          <Badge className="bg-purple-100 text-purple-800 border-purple-200">
            Admin
          </Badge>
        );
      case "reseller":
        return (
          <Badge className="bg-blue-100 text-blue-800 border-blue-200">
            Reseller
          </Badge>
        );
      case "customer":
        return (
          <Badge className="bg-gray-100 text-gray-800 border-gray-200">
            Customer
          </Badge>
        );
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div className="relative w-full md:w-64">
          <Input
            placeholder="Search users..."
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
                {accountTypeFilter === "all"
                  ? "All Types"
                  : accountTypeFilter.charAt(0).toUpperCase() +
                    accountTypeFilter.slice(1)}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setAccountTypeFilter("all")}>
                All Types
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setAccountTypeFilter("admin")}>
                Admin
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setAccountTypeFilter("reseller")}
              >
                Reseller
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setAccountTypeFilter("customer")}
              >
                Customer
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                {statusFilter === "all"
                  ? "All Status"
                  : statusFilter.charAt(0).toUpperCase() +
                    statusFilter.slice(1)}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setStatusFilter("all")}>
                All Status
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter("active")}>
                Active
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter("inactive")}>
                Inactive
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>

          <Button>
            <UserPlus className="h-4 w-4 mr-2" />
            Add User
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead className="text-center">Type</TableHead>
                <TableHead>Join Date</TableHead>
                <TableHead className="text-center">Orders</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>
                    <div className="flex flex-col space-y-1">
                      <div className="flex items-center text-sm">
                        <Mail className="h-3.5 w-3.5 mr-2 text-gray-500" />
                        {user.email}
                      </div>
                      <div className="flex items-center text-sm">
                        <Phone className="h-3.5 w-3.5 mr-2 text-gray-500" />
                        {user.phone}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    {getAccountTypeBadge(user.accountType)}
                  </TableCell>
                  <TableCell>
                    {new Date(user.joinDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-center">{user.orders}</TableCell>
                  <TableCell className="text-center">
                    {user.status === "active" ? (
                      <Badge
                        variant="outline"
                        className="bg-green-50 text-green-700 border-green-200"
                      >
                        Active
                      </Badge>
                    ) : (
                      <Badge
                        variant="outline"
                        className="bg-gray-50 text-gray-700 border-gray-200"
                      >
                        Inactive
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <User className="h-4 w-4 mr-2" />
                          View Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Mail className="h-4 w-4 mr-2" />
                          Send Email
                        </DropdownMenuItem>
                        {user.status === "active" ? (
                          <DropdownMenuItem className="text-red-600">
                            Deactivate User
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem className="text-green-600">
                            Activate User
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
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

export default AdminUsers;
