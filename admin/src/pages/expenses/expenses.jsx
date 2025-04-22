import React, { useState } from "react";
import {
  Receipt,
  Search,
  Filter,
  MoreHorizontal,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  CreditCard,
  Eye,
  Edit,
  Trash2,
  Wrench,
  Zap,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import useMediaQuery from "@/hooks/use-media-query";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useExpenseSummary } from "./hooks/useExpenseSummary";
import { useExpenses } from "./hooks/useExpenses";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { AddExpenseForm } from "./components/AddExpenseForm";
import { useExpenseMutations } from "./hooks/useExpenseMutations";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

function ExpenseCard({ title, value, change, icon, timeframe }) {
  const isPositive = change >= 0;
  const timeframeText =
    timeframe === "week" ? "week" : timeframe === "month" ? "month" : "year";

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <div className="flex items-center mt-1">
          <div
            className={`flex items-center text-xs ${
              !isPositive ? "text-green-500" : "text-red-500"
            }`}
          >
            {isPositive ? (
              <ArrowUpRight className="h-3 w-3 mr-1" />
            ) : (
              <ArrowDownRight className="h-3 w-3 mr-1" />
            )}
            <span>{Math.abs(change)}%</span>
          </div>
          <span className="text-xs text-gray-500 ml-1">
            vs last {timeframeText}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

function ExpensesPage() {
  const [timeframe, setTimeframe] = useState("month");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
  const [page, setPage] = useState(1);
  const limit = 10;
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const { deleteExpense } = useExpenseMutations();

  //  ["Maintenance", "Utility", "Salary", "Other"]
  const categories = [
    { id: "all", name: "All Categories" },
    { id: "maintenance", name: "Maintenance" },
    { id: "utility", name: "Utility" },
    { id: "salary", name: "Salary" },
    { id: "other", name: "Other" },
  ];

  const { data: summary, isLoading: isLoadingSummary } =
    useExpenseSummary(timeframe);
  const { data: expensesData, isLoading: isLoadingExpenses } = useExpenses({
    page,
    limit,
    category: categoryFilter !== "all" ? categoryFilter : undefined,
    status: statusFilter !== "all" ? statusFilter : undefined,
    search: searchQuery,
  });

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleEdit = (expense) => {
    setSelectedExpense(expense);
    setIsAddExpenseOpen(true);
  };

  const handleDelete = (expense) => {
    setSelectedExpense(expense);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (selectedExpense) {
      deleteExpense.mutate(selectedExpense.expenseId);
      setIsDeleteDialogOpen(false);
      setSelectedExpense(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Expenses</h1>
          <p className="text-muted-foreground">
            Manage your expense transactions
          </p>
        </div>
        <div>
          <Button size="sm" onClick={() => setIsAddExpenseOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Expense
          </Button>
        </div>
      </div>

      {/* Timeframe Selector */}
      <div className="flex justify-end">
        <Tabs
          value={timeframe}
          onValueChange={setTimeframe}
          className="w-full md:w-[400px]"
        >
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="week">This Week</TabsTrigger>
            <TabsTrigger value="month">This Month</TabsTrigger>
            <TabsTrigger value="year">This Year</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Expense Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {isLoadingSummary ? (
          <>
            <Skeleton className="h-[120px]" />
            <Skeleton className="h-[120px]" />
            <Skeleton className="h-[120px]" />
          </>
        ) : (
          <>
            <ExpenseCard
              title="Total Expenses"
              value={`₹${summary?.totalExpenses?.toLocaleString()}`}
              change={summary?.expensesChange || 0}
              icon={<Receipt className="h-5 w-5" />}
              timeframe={timeframe}
            />
            <ExpenseCard
              title="Maintenance"
              value={`₹${summary?.categories?.maintenance?.toLocaleString()}`}
              change={summary?.maintenanceChange || 0}
              icon={<Wrench className="h-5 w-5" />}
              timeframe={timeframe}
            />
            <ExpenseCard
              title="Utilities"
              value={`₹${summary?.categories?.utility?.toLocaleString()}`}
              change={summary?.utilityChange || 0}
              icon={<Zap className="h-5 w-5" />}
              timeframe={timeframe}
            />
          </>
        )}
      </div>

      {/* Expenses List */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
            <div>
              <CardTitle>Expense Transactions</CardTitle>
              <CardDescription>
                View and manage all expense transactions
              </CardDescription>
            </div>
            <div className="flex flex-wrap gap-2">
              <div className="relative w-full md:w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  type="search"
                  placeholder="Search expenses..."
                  className="w-full pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    <span>Category</span>
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    <span>Status</span>
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="Paid">Paid</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Failed">Failed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoadingExpenses ? (
            <div className="space-y-4">
              <Skeleton className="h-[60px]" />
              <Skeleton className="h-[60px]" />
              <Skeleton className="h-[60px]" />
            </div>
          ) : (
            <>
              {isMobile ? (
                <div className="space-y-4">
                  {expensesData?.expenses?.map((expense) => (
                    <Card key={expense.expenseId}>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="font-medium">
                              {expense.description}
                            </div>
                            <div className="text-sm text-gray-500">
                              {format(
                                new Date(expense.createdAt),
                                "MMM d, yyyy"
                              )}
                            </div>
                          </div>
                          <Badge
                            variant={
                              expense.status === "Paid"
                                ? "success"
                                : "secondary"
                            }
                          >
                            {expense.status}
                          </Badge>
                        </div>
                        <div className="mt-2 flex justify-between items-center">
                          <div className="text-sm text-gray-500">
                            {expense.vendor}
                          </div>
                          <div className="font-medium text-red-600">
                            -₹{expense.amount.toLocaleString()}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Vendor</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {expensesData?.expenses?.map((expense) => (
                      <TableRow key={expense.expenseId}>
                        <TableCell>
                          {format(new Date(expense.createdAt), "MMM d, yyyy")}
                        </TableCell>
                        <TableCell>{expense.description}</TableCell>
                        <TableCell>{expense.vendor}</TableCell>
                        <TableCell>{expense.category}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              expense.status === "Paid"
                                ? "success"
                                : "secondary"
                            }
                          >
                            {expense.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right font-medium text-red-600">
                          -₹{expense.amount.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleEdit(expense)}>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="text-red-600"
                                onClick={() => handleDelete(expense)}
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </>
          )}
        </CardContent>
        <CardFooter className="flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Showing {expensesData?.expenses?.length || 0} of{" "}
            {expensesData?.pagination?.total || 0} expenses
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(page + 1)}
              disabled={!expensesData?.pagination?.hasNext}
            >
              Next
            </Button>
          </div>
        </CardFooter>
      </Card>

      {/* Add/Edit Expense Dialog */}
      <Dialog open={isAddExpenseOpen} onOpenChange={setIsAddExpenseOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {selectedExpense ? "Edit Expense" : "Add New Expense"}
            </DialogTitle>
            <DialogDescription>
              {selectedExpense
                ? "Update the expense details below."
                : "Enter the details of the new expense transaction."}
            </DialogDescription>
          </DialogHeader>
          <AddExpenseForm
            expenseId={selectedExpense?.expenseId}
            onSuccess={() => {
              setIsAddExpenseOpen(false);
              setSelectedExpense(null);
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              expense record.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default ExpensesPage;
