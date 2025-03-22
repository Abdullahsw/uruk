import React, { useState, useEffect } from "react";
import { Search, Filter, Download, Calendar, Clock, User, FileText } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { useToast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { getAdminActivityLogs } from "@/lib/admin/adminService";

const AdminActivityLogs = () => {
  const { toast } = useToast();
  const [logs, setLogs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [actionTypeFilter, setActionTypeFilter] = useState("all");
  const [entityTypeFilter, setEntityTypeFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalLogs, setTotalLogs] = useState(0);
  const [selectedLog, setSelectedLog] = useState<any>(null);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);

  const pageSize = 20;

  useEffect(() => {
    fetchLogs();
  }, [currentPage, actionTypeFilter, entityTypeFilter]);

  const fetchLogs = async () => {
    setIsLoading(true);
    try {
      // Calculate pagination
      const from = (currentPage - 1) * pageSize;

      // Build filters
      const filters: any = {};
      if (actionTypeFilter !== "all") {
        filters.actionType = actionTypeFilter;
      }
      if (entityTypeFilter !== "all") {
        filters.entityType = entityTypeFilter;
      }

      // Fetch logs
      const { success, logs: activityLogs, count, error } = await getAdminActivityLogs(
        pageSize,
        from,
        filters
      );

      if (!success) {
        throw new Error(error);
      }

      setLogs(activityLogs || []);
      
      if (count !== undefined) {
        setTotalLogs(count);
        setTotalPages(Math.ceil(count / pageSize));
      }
    } catch (error) {
      console.error("Error fetching activity logs:", error);
      toast({
        variant: "destructive",
        title: "Failed to load activity logs",
        description: "Please try again or contact support.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = () => {
    setCurrentPage(1); // Reset to first page on new search
    fetchLogs();
  };

  const viewLogDetails = (log: any) => {
    setSelectedLog(log);
    setIsDetailsDialogOpen(true);
  };

  const getActionBadge = (action: string) => {
    switch (action) {
      case "create":
        return (
          <Badge className="bg-green-100 text-green-800 border-green-200">
            Create
          </Badge>
        );
      case "update":
        return (
          <Badge className="bg-blue-100 text-blue-800 border-blue-200">
            Update
          </Badge>
        );
      case "delete":
        return (
          <Badge className="bg-red-100 text-red-800 border-red-200">
            Delete
          </Badge>
        );
      case "login":
        return (
          <Badge className="bg-purple-100 text-purple-800 border-purple-200">
            Login
          </Badge>
        );
      default:
        return (
          <Badge className="bg-gray-100 text-gray-800 border-gray-200">
            {action.charAt(0).toUpperCase() + action.slice(1)}
          </Badge>
        );
    }
  };

  const getEntityBadge = (entity: string) => {
    switch (entity) {
      case "user":
        return (
          <Badge className="bg-indigo-100 text-indigo-800 border-indigo-200">
            User
          </Badge>
        );
      case "product":
        return (
          <Badge className="bg-amber-100 text-amber-800 border-amber-200">
            Product
          </Badge>
        );
      case "order":
        return (
          <Badge className="bg-cyan-100 text-cyan-800 border-cyan-200">
            Order
          </Badge>
        );
      case "setting":
        return (
          <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200">
            Setting
          </Badge>
        );
      case "api_key":
        return (
          <Badge className="bg-rose-100 text-rose-800 border-rose-200">
            API Key
          </Badge>
        );
      default:
        return (
          <Badge className="bg-gray-100 text-gray-800 border-gray-200">
            {entity.charAt(0).toUpperCase() + entity.slice(1).replace("_", " ")}
          </Badge>
        );
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div className="relative w-full md:w-64">
          <Input
            placeholder="Search logs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="pl-10"
          />
          <Search 
            className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" 
            onClick={handleSearch}
          />
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                {actionTypeFilter === "all"
                  ? "All Actions"
                  : actionTypeFilter.charAt(0).toUpperCase() +
                    actionTypeFilter.slice(1)}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setActionTypeFilter("all")}>
                All Actions
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setActionTypeFilter("create")}>
                Create
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setActionTypeFilter("update")}>
                Update
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setActionTypeFilter("delete")}>
                Delete
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setActionTypeFilter("login")}>
                Login
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                {entityTypeFilter === "all"
                  ? "All Entities"
                  : entityTypeFilter.charAt(0).toUpperCase() +
                    entityTypeFilter.slice(1).replace("_", " ")}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setEntityTypeFilter("all")}>
                All Entities
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setEntityTypeFilter("user")}>
                User
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setEntityTypeFilter("product")}>
                Product
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setEntityTypeFilter("order")}>
                Order
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setEntityTypeFilter("setting")}>
                Setting
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setEntityTypeFilter("api_key")}>
                API Key
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
                <TableHead>Date & Time</TableHead>
                <TableHead>Admin</TableHead>
                <TableHead className="text-center">Action</TableHead>
                <TableHead className="text-center">Entity</TableHead>
                <TableHead>Entity ID</TableHead>
                <TableHead>IP Address</TableHead>
                <TableHead className="text-right">Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-10">
                    <div className="flex justify-center">
                      <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                    </div>
                    <p className="text-sm text-gray-500 mt-2">Loading activity logs...</p>
                  </TableCell>
                </TableRow>
              ) : logs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-10">
                    <p className="text-gray-500">No activity logs found</p>
                  </TableCell>
                </TableRow>
              ) : (
                logs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell>
                      <div className="flex flex-col">
                        <div className="flex items-center text-sm">
                          <Calendar className="h-3.5 w-3.5 mr-2 text-gray-500" />
                          {new Date(log.created_at).toLocaleDateString()}
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <Clock className="h-3.5 w-3.5 mr-2 text-gray-500" />
                          {new Date(log.created_at).toLocaleTimeString()}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <User className="h-3.5 w-3.5 mr-2 text-gray-500" />
                        {log.admin?.name || "Unknown"}
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      {getActionBadge(log.action_type)}
                    </TableCell>
                    <TableCell className="text-center">
                      {getEntityBadge(log.entity_type)}
                    </TableCell>
                    <TableCell className="font-mono text-xs">
                      {log.entity_id ? log.entity_id.substring(0, 8) + "..." : "N/