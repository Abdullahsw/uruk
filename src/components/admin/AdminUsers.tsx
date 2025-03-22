import React, { useState, useEffect } from "react";
import {
  Search,
  Filter,
  UserPlus,
  Download,
  Edit,
  Trash2,
  Shield,
  Mail,
  Phone,
  MoreHorizontal,
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
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/lib/supabase";
import { logAdminActivity } from "@/lib/admin/adminService";

const AdminUsers = () => {
  const { toast } = useToast();
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [accountTypeFilter, setAccountTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [isUserDialogOpen, setIsUserDialogOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<any>(null);

  const pageSize = 10;

  useEffect(() => {
    fetchUsers();
  }, [currentPage, accountTypeFilter, statusFilter]);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      // Calculate pagination
      const from = (currentPage - 1) * pageSize;
      const to = from + pageSize - 1;

      // Build query
      let query = supabase
        .from("users")
        .select("*", { count: "exact" })
        .order("created_at", { ascending: false })
        .range(from, to);

      // Apply filters
      if (accountTypeFilter !== "all") {
        query = query.eq("account_type", accountTypeFilter);
      }

      if (statusFilter === "active") {
        query = query.eq("is_active", true);
      } else if (statusFilter === "inactive") {
        query = query.eq("is_active", false);
      }

      if (searchQuery) {
        query = query.or(
          `name.ilike.%${searchQuery}%,email.ilike.%${searchQuery}%,username.ilike.%${searchQuery}%`,
        );
      }

      const { data, error, count } = await query;

      if (error) throw error;

      setUsers(data || []);

      if (count !== null) {
        setTotalUsers(count);
        setTotalPages(Math.ceil(count / pageSize));
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      toast({
        variant: "destructive",
        title: "Failed to load users",
        description: "Please try again or contact support.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = () => {
    setCurrentPage(1); // Reset to first page on new search
    fetchUsers();
  };

  const handleToggleUserStatus = async (
    userId: string,
    currentStatus: boolean,
  ) => {
    try {
      const { error } = await supabase
        .from("users")
        .update({
          is_active: !currentStatus,
          updated_at: new Date().toISOString(),
        })
        .eq("id", userId);

      if (error) throw error;

      // Update local state
      setUsers(
        users.map((user) =>
          user.id === userId ? { ...user, is_active: !currentStatus } : user,
        ),
      );

      // Log the activity
      await logAdminActivity("update", "user", userId, {
        field: "status",
        value: !currentStatus ? "activated" : "deactivated",
      });

      toast({
        title: "User status updated",
        description: `User has been ${!currentStatus ? "activated" : "deactivated"}.`,
      });
    } catch (error) {
      console.error("Error updating user status:", error);
      toast({
        variant: "destructive",
        title: "Failed to update user status",
        description: "Please try again or contact support.",
      });
    }
  };

  const handleEditUser = (user: any) => {
    setCurrentUser(user);
    setIsUserDialogOpen(true);
  };

  const handleSaveUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase
        .from("users")
        .update({
          name: currentUser.name,
          username: currentUser.username,
          account_type: currentUser.account_type,
          admin_permissions: currentUser.admin_permissions,
          updated_at: new Date().toISOString(),
        })
        .eq("id", currentUser.id);

      if (error) throw error;

      // Update user metadata in auth.users if needed
      await supabase.auth.updateUser({
        data: {
          name: currentUser.name,
          account_type: currentUser.account_type,
          admin_permissions:
            currentUser.account_type === "admin"
              ? currentUser.admin_permissions
              : undefined,
        },
      });

      // Log the activity
      await logAdminActivity("update", "user", currentUser.id, {
        name: currentUser.name,
      });

      // Update local state
      setUsers(
        users.map((user) =>
          user.id === currentUser.id ? { ...user, ...currentUser } : user,
        ),
      );

      setIsUserDialogOpen(false);
      toast({
        title: "User updated",
        description: "User information has been updated successfully.",
      });
    } catch (error) {
      console.error("Error updating user:", error);
      toast({
        variant: "destructive",
        title: "Failed to update user",
        description: "Please try again or contact support.",
      });
    }
  };

  const handleDeleteUser = async () => {
    if (!userToDelete) return;

    try {
      const { error } = await supabase
        .from("users")
        .delete()
        .eq("id", userToDelete.id);

      if (error) throw error;

      // Log the activity
      await logAdminActivity("delete", "user", userToDelete.id, {
        email: userToDelete.email,
      });

      // Update local state
      setUsers(users.filter((user) => user.id !== userToDelete.id));
      setIsDeleteDialogOpen(false);
      setUserToDelete(null);

      toast({
        title: "User deleted",
        description: "User has been deleted successfully.",
      });
    } catch (error) {
      console.error("Error deleting user:", error);
      toast({
        variant: "destructive",
        title: "Failed to delete user",
        description: "Please try again or contact support.",
      });
    }
  };

  const confirmDeleteUser = (user: any) => {
    setUserToDelete(user);
    setIsDeleteDialogOpen(true);
  };

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
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-10">
                    <div className="flex justify-center">
                      <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                    </div>
                    <p className="text-sm text-gray-500 mt-2">
                      Loading users...
                    </p>
                  </TableCell>
                </TableRow>
              ) : users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-10">
                    <p className="text-gray-500">No users found</p>
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">
                      {user.name || "(No name)"}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col space-y-1">
                        <div className="flex items-center text-sm">
                          <Mail className="h-3.5 w-3.5 mr-2 text-gray-500" />
                          {user.email}
                        </div>
                        {user.phone && (
                          <div className="flex items-center text-sm">
                            <Phone className="h-3.5 w-3.5 mr-2 text-gray-500" />
                            {user.phone}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      {getAccountTypeBadge(user.account_type)}
                    </TableCell>
                    <TableCell>
                      {new Date(user.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-center">
                      <Switch
                        checked={user.is_active !== false} // Default to true if undefined
                        onCheckedChange={() =>
                          handleToggleUserStatus(
                            user.id,
                            user.is_active !== false,
                          )
                        }
                      />
                    </TableCell>
                    <TableCell className="text-right">
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
                            onClick={() => handleEditUser(user)}
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Edit User
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => confirmDeleteUser(user)}
                            className="text-red-600"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete User
                          </DropdownMenuItem>
                          {user.account_type === "admin" && (
                            <DropdownMenuItem>
                              <Shield className="h-4 w-4 mr-2" />
                              Manage Permissions
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          {totalPages > 1 && (
            <div className="py-4 flex items-center justify-between px-4">
              <div className="text-sm text-gray-500">
                Showing {(currentPage - 1) * pageSize + 1}-
                {Math.min(currentPage * pageSize, totalUsers)} of {totalUsers}{" "}
                users
              </div>
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                    />
                  </PaginationItem>

                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    // Show pages around current page
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }

                    return (
                      <PaginationItem key={pageNum}>
                        <PaginationLink
                          isActive={currentPage === pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                        >
                          {pageNum}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  })}

                  <PaginationItem>
                    <PaginationNext
                      onClick={() =>
                        setCurrentPage((p) => Math.min(totalPages, p + 1))
                      }
                      disabled={currentPage === totalPages}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit User Dialog */}
      {currentUser && (
        <Dialog open={isUserDialogOpen} onOpenChange={setIsUserDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit User</DialogTitle>
              <DialogDescription>
                Update user information and permissions.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSaveUser}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Name
                  </Label>
                  <Input
                    id="name"
                    value={currentUser.name || ""}
                    onChange={(e) =>
                      setCurrentUser({ ...currentUser, name: e.target.value })
                    }
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="username" className="text-right">
                    Username
                  </Label>
                  <Input
                    id="username"
                    value={currentUser.username || ""}
                    onChange={(e) =>
                      setCurrentUser({
                        ...currentUser,
                        username: e.target.value,
                      })
                    }
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="email" className="text-right">
                    Email
                  </Label>
                  <Input
                    id="email"
                    value={currentUser.email}
                    disabled
                    className="col-span-3 bg-gray-100"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="account_type" className="text-right">
                    Account Type
                  </Label>
                  <select
                    id="account_type"
                    value={currentUser.account_type}
                    onChange={(e) =>
                      setCurrentUser({
                        ...currentUser,
                        account_type: e.target.value,
                      })
                    }
                    className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="customer">Customer</option>
                    <option value="reseller">Reseller</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                {currentUser.account_type === "admin" && (
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right">Full Access</Label>
                    <div className="col-span-3">
                      <Switch
                        checked={
                          currentUser.admin_permissions?.full_access === true
                        }
                        onCheckedChange={(checked) => {
                          setCurrentUser({
                            ...currentUser,
                            admin_permissions: {
                              ...currentUser.admin_permissions,
                              full_access: checked,
                            },
                          });
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
              <DialogFooter>
                <Button type="submit">Save changes</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the user{" "}
              {userToDelete?.name || userToDelete?.email}? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteUser}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminUsers;
