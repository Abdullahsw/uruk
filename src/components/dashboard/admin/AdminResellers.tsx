import React, { useState } from "react";
import {
  Search,
  Filter,
  Mail,
  Phone,
  User,
  MoreHorizontal,
  Download,
  BadgeCheck,
  ShieldAlert,
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

// Mock reseller data
const mockResellers = [
  {
    id: "res-001",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    phone: "+1 (555) 987-6543",
    plan: "premium",
    status: "active",
    joinDate: "2023-02-10T14:45:00Z",
    revenue: 12450.75,
    customers: 48,
  },
  {
    id: "res-002",
    name: "Robert Johnson",
    email: "robert.j@example.com",
    phone: "+1 (555) 456-7890",
    plan: "standard",
    status: "active",
    joinDate: "2023-03-08T09:15:00Z",
    revenue: 8320.5,
    customers: 32,
  },
  {
    id: "res-003",
    name: "Emily Wilson",
    email: "emily.w@example.com",
    phone: "+1 (555) 234-5678",
    plan: "basic",
    status: "pending",
    joinDate: "2023-04-05T16:20:00Z",
    revenue: 0,
    customers: 0,
  },
  {
    id: "res-004",
    name: "Michael Brown",
    email: "michael.b@example.com",
    phone: "+1 (555) 876-5432",
    plan: "premium",
    status: "inactive",
    joinDate: "2023-05-01T11:10:00Z",
    revenue: 4250.25,
    customers: 15,
  },
  {
    id: "res-005",
    name: "Sarah Johnson",
    email: "sarah.j@example.com",
    phone: "+1 (555) 345-6789",
    plan: "standard",
    status: "active",
    joinDate: "2023-05-15T13:25:00Z",
    revenue: 6780.4,
    customers: 27,
  },
];

const AdminResellers = () => {
  const [resellers, setResellers] = useState(mockResellers);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [planFilter, setPlanFilter] = useState("all");

  const filteredResellers = resellers.filter((reseller) => {
    const matchesSearch =
      reseller.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      reseller.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      reseller.phone.includes(searchQuery);

    const matchesStatus =
      statusFilter === "all" || reseller.status === statusFilter;

    const matchesPlan = planFilter === "all" || reseller.plan === planFilter;

    return matchesSearch && matchesStatus && matchesPlan;
  });

  const getPlanBadge = (plan: string) => {
    switch (plan) {
      case "premium":
        return (
          <Badge className="bg-purple-100 text-purple-800 border-purple-200">
            Premium
          </Badge>
        );
      case "standard":
        return (
          <Badge className="bg-blue-100 text-blue-800 border-blue-200">
            Standard
          </Badge>
        );
      case "basic":
        return (
          <Badge className="bg-gray-100 text-gray-800 border-gray-200">
            Basic
          </Badge>
        );
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge
            variant="outline"
            className="bg-green-50 text-green-700 border-green-200"
          >
            Active
          </Badge>
        );
      case "pending":
        return (
          <Badge
            variant="outline"
            className="bg-yellow-50 text-yellow-700 border-yellow-200"
          >
            Pending
          </Badge>
        );
      case "inactive":
        return (
          <Badge
            variant="outline"
            className="bg-gray-50 text-gray-700 border-gray-200"
          >
            Inactive
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
            placeholder="Search resellers..."
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
                {statusFilter === "all"
                  ? "All Statuses"
                  : statusFilter.charAt(0).toUpperCase() +
                    statusFilter.slice(1)}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setStatusFilter("all")}>
                All Statuses
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter("active")}>
                Active
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter("pending")}>
                Pending
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter("inactive")}>
                Inactive
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                {planFilter === "all"
                  ? "All Plans"
                  : planFilter.charAt(0).toUpperCase() + planFilter.slice(1)}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setPlanFilter("all")}>
                All Plans
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setPlanFilter("premium")}>
                Premium
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setPlanFilter("standard")}>
                Standard
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setPlanFilter("basic")}>
                Basic
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Reseller</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead className="text-center">Plan</TableHead>
                <TableHead>Join Date</TableHead>
                <TableHead className="text-right">Revenue</TableHead>
                <TableHead className="text-center">Customers</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredResellers.map((reseller) => (
                <TableRow key={reseller.id}>
                  <TableCell className="font-medium">{reseller.name}</TableCell>
                  <TableCell>
                    <div className="flex flex-col space-y-1">
                      <div className="flex items-center text-sm">
                        <Mail className="h-3.5 w-3.5 mr-2 text-gray-500" />
                        {reseller.email}
                      </div>
                      <div className="flex items-center text-sm">
                        <Phone className="h-3.5 w-3.5 mr-2 text-gray-500" />
                        {reseller.phone}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    {getPlanBadge(reseller.plan)}
                  </TableCell>
                  <TableCell>
                    {new Date(reseller.joinDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    $
                    {reseller.revenue.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </TableCell>
                  <TableCell className="text-center">
                    {reseller.customers}
                  </TableCell>
                  <TableCell className="text-center">
                    {getStatusBadge(reseller.status)}
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
                        {reseller.status === "pending" && (
                          <DropdownMenuItem className="text-green-600">
                            <BadgeCheck className="h-4 w-4 mr-2" />
                            Approve Reseller
                          </DropdownMenuItem>
                        )}
                        {reseller.status === "active" && (
                          <DropdownMenuItem className="text-red-600">
                            <ShieldAlert className="h-4 w-4 mr-2" />
                            Suspend Reseller
                          </DropdownMenuItem>
                        )}
                        {reseller.status === "inactive" && (
                          <DropdownMenuItem className="text-green-600">
                            <BadgeCheck className="h-4 w-4 mr-2" />
                            Reactivate Reseller
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

export default AdminResellers;
