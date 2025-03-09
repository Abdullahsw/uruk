import React, { useState } from "react";
import {
  Search,
  Filter,
  Check,
  X,
  MoreHorizontal,
  ExternalLink,
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

// Mock API request data
const mockApiRequests = [
  {
    id: "req-001",
    resellerId: "res-001",
    resellerName: "Jane Smith",
    email: "jane.smith@example.com",
    plan: "premium",
    requestDate: "2023-06-15T10:30:00Z",
    status: "pending",
    notes: "Requesting API access for product integration",
  },
  {
    id: "req-002",
    resellerId: "res-003",
    resellerName: "Robert Johnson",
    email: "robert.j@example.com",
    plan: "standard",
    requestDate: "2023-06-10T14:45:00Z",
    status: "approved",
    notes: "Limited access granted for testing",
  },
  {
    id: "req-003",
    resellerId: "res-005",
    resellerName: "Emily Wilson",
    email: "emily.w@example.com",
    plan: "basic",
    requestDate: "2023-06-08T09:15:00Z",
    status: "rejected",
    notes: "Basic plan does not include API access",
  },
  {
    id: "req-004",
    resellerId: "res-007",
    resellerName: "Michael Brown",
    email: "michael.b@example.com",
    plan: "premium",
    requestDate: "2023-06-05T16:20:00Z",
    status: "approved",
    notes: "Full access granted",
  },
  {
    id: "req-005",
    resellerId: "res-009",
    resellerName: "Sarah Johnson",
    email: "sarah.j@example.com",
    plan: "standard",
    requestDate: "2023-06-01T11:10:00Z",
    status: "pending",
    notes: "Requesting access to order management API",
  },
];

const AdminApiRequests = () => {
  const [apiRequests, setApiRequests] = useState(mockApiRequests);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredRequests = apiRequests.filter((request) => {
    const matchesSearch =
      request.resellerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || request.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleApprove = (id: string) => {
    setApiRequests(
      apiRequests.map((request) =>
        request.id === id ? { ...request, status: "approved" } : request,
      ),
    );
  };

  const handleReject = (id: string) => {
    setApiRequests(
      apiRequests.map((request) =>
        request.id === id ? { ...request, status: "rejected" } : request,
      ),
    );
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge
            variant="outline"
            className="bg-yellow-50 text-yellow-700 border-yellow-200"
          >
            Pending
          </Badge>
        );
      case "approved":
        return (
          <Badge
            variant="outline"
            className="bg-green-50 text-green-700 border-green-200"
          >
            Approved
          </Badge>
        );
      case "rejected":
        return (
          <Badge
            variant="outline"
            className="bg-red-50 text-red-700 border-red-200"
          >
            Rejected
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
            placeholder="Search requests..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
        </div>

        <div className="flex items-center gap-4">
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
              <DropdownMenuItem onClick={() => setStatusFilter("pending")}>
                Pending
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter("approved")}>
                Approved
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter("rejected")}>
                Rejected
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Reseller</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead>Request Date</TableHead>
                <TableHead>Notes</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRequests.map((request) => (
                <TableRow key={request.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{request.resellerName}</div>
                      <div className="text-sm text-gray-500">
                        {request.email}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={
                        request.plan === "premium"
                          ? "bg-purple-50 text-purple-700 border-purple-200"
                          : request.plan === "standard"
                            ? "bg-blue-50 text-blue-700 border-blue-200"
                            : "bg-gray-50 text-gray-700 border-gray-200"
                      }
                    >
                      {request.plan.charAt(0).toUpperCase() +
                        request.plan.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(request.requestDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="max-w-xs truncate">
                    {request.notes}
                  </TableCell>
                  <TableCell className="text-center">
                    {getStatusBadge(request.status)}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      {request.status === "pending" && (
                        <>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleApprove(request.id)}
                            className="text-green-600 hover:text-green-700 hover:bg-green-50"
                          >
                            <Check className="h-4 w-4 mr-1" />
                            Approve
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleReject(request.id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <X className="h-4 w-4 mr-1" />
                            Reject
                          </Button>
                        </>
                      )}
                      {request.status === "approved" && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                        >
                          <ExternalLink className="h-4 w-4 mr-1" />
                          View Keys
                        </Button>
                      )}
                      {request.status === "rejected" && (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => handleApprove(request.id)}
                            >
                              Reconsider & Approve
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
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

export default AdminApiRequests;
