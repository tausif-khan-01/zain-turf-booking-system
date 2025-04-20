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

// Mock expense data
const expenseData = {
  totalExpenses: 45000,
  expensesChange: 5,
  maintenanceExpenses: 15000,
  maintenanceChange: 8,
  utilityExpenses: 12000,
  utilityChange: -3,
  expenses: [
    {
      id: "EXP-1001",
      date: "Jul 24, 2023",
      description: "Turf Maintenance",
      amount: 5000,
      category: "maintenance",
      status: "paid",
      paymentMethod: "cash",
      vendor: "Green Turf Services",
    },
    {
      id: "EXP-1002",
      date: "Jul 25, 2023",
      description: "Electricity Bill",
      amount: 8000,
      category: "utility",
      status: "paid",
      paymentMethod: "online",
      vendor: "State Electricity Board",
    },
    {
      id: "EXP-1003",
      date: "Jul 26, 2023",
      description: "Staff Salary",
      amount: 15000,
      category: "salary",
      status: "paid",
      paymentMethod: "bank",
      vendor: "Internal",
    },
    {
      id: "EXP-1004",
      date: "Jul 27, 2023",
      description: "Equipment Purchase",
      amount: 7000,
      category: "equipment",
      status: "paid",
      paymentMethod: "online",
      vendor: "Sports Gear Ltd",
    },
    {
      id: "EXP-1005",
      date: "Jul 28, 2023",
      description: "Water Bill",
      amount: 3000,
      category: "utility",
      status: "pending",
      paymentMethod: "online",
      vendor: "Municipal Water Supply",
    },
    {
      id: "EXP-1006",
      date: "Jul 29, 2023",
      description: "Cleaning Services",
      amount: 2000,
      category: "maintenance",
      status: "paid",
      paymentMethod: "cash",
      vendor: "CleanPro Services",
    },
  ],
};

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
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
  const isMobile = useMediaQuery("(max-width: 768px)");

  // Filter expenses based on category and search query
  const filteredExpenses = expenseData.expenses.filter((expense) => {
    const matchesCategory =
      categoryFilter === "all" || expense.category === categoryFilter;
    const matchesSearch =
      expense.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      expense.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      expense.vendor.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

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
        <ExpenseCard
          title="Total Expenses"
          value={`₹${expenseData.totalExpenses.toLocaleString()}`}
          change={expenseData.expensesChange}
          icon={<Receipt className="h-5 w-5" />}
          timeframe={timeframe}
        />
        <ExpenseCard
          title="Maintenance"
          value={`₹${expenseData.maintenanceExpenses.toLocaleString()}`}
          change={expenseData.maintenanceChange}
          icon={<Wrench className="h-5 w-5" />}
          timeframe={timeframe}
        />
        <ExpenseCard
          title="Utilities"
          value={`₹${expenseData.utilityExpenses.toLocaleString()}`}
          change={expenseData.utilityChange}
          icon={<Zap className="h-5 w-5" />}
          timeframe={timeframe}
        />
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
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                  <SelectItem value="utility">Utilities</SelectItem>
                  <SelectItem value="salary">Salaries</SelectItem>
                  <SelectItem value="equipment">Equipment</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isMobile ? (
            // Mobile card view
            <div className="space-y-4">
              {filteredExpenses.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No expenses found
                </div>
              ) : (
                filteredExpenses.map((expense) => (
                  <Card
                    key={expense.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <div className="font-medium">
                            {expense.description}
                          </div>
                          <div className="text-xs text-gray-500">
                            {expense.id} • {expense.date}
                          </div>
                        </div>
                        <Badge variant="outline" className="capitalize">
                          {expense.category}
                        </Badge>
                      </div>
                      <div className="text-sm text-gray-600 mb-2">
                        Vendor: {expense.vendor}
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <CreditCard className="h-4 w-4 text-gray-500" />
                          <span className="text-sm capitalize">
                            {expense.paymentMethod}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant={
                              expense.status === "paid"
                                ? "success"
                                : "secondary"
                            }
                            className="capitalize"
                          >
                            {expense.status}
                          </Badge>
                          <span className="font-medium text-red-600">
                            -₹{expense.amount.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          ) : (
            // Desktop table view
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Expense ID</TableHead>
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
                  {filteredExpenses.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={8}
                        className="text-center py-8 text-gray-500"
                      >
                        No expenses found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredExpenses.map((expense) => (
                      <TableRow key={expense.id}>
                        <TableCell className="font-medium">
                          {expense.id}
                        </TableCell>
                        <TableCell>{expense.date}</TableCell>
                        <TableCell>{expense.description}</TableCell>
                        <TableCell>{expense.vendor}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="capitalize">
                            {expense.category}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              expense.status === "paid"
                                ? "success"
                                : "secondary"
                            }
                            className="capitalize"
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
                                <span className="sr-only">Actions</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Eye className="mr-2 h-4 w-4" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit Expense
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-red-600">
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete Expense
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Showing <strong>{filteredExpenses.length}</strong> of{" "}
            <strong>{expenseData.expenses.length}</strong> expenses
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" disabled>
              Previous
            </Button>
            <Button variant="outline" size="sm">
              Next
            </Button>
          </div>
        </CardFooter>
      </Card>

      {/* Add Expense Dialog */}
      <Dialog open={isAddExpenseOpen} onOpenChange={setIsAddExpenseOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New Expense</DialogTitle>
            <DialogDescription>
              Enter the details of the new expense transaction.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 gap-3">
              <div>
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  placeholder="Enter expense description"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="amount">Amount (₹)</Label>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="Enter amount"
                    min="1"
                  />
                </div>
                <div>
                  <Label htmlFor="date">Date</Label>
                  <Input id="date" type="date" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select>
                    <SelectTrigger id="category">
                      <SelectContent>
                        <SelectItem value="maintenance">Maintenance</SelectItem>
                        <SelectItem value="utility">Utilities</SelectItem>
                        <SelectItem value="salary">Salaries</SelectItem>
                        <SelectItem value="equipment">Equipment</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </SelectTrigger>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="payment-method">Payment Method</Label>
                  <Select>
                    <SelectTrigger id="payment-method">
                      <SelectContent>
                        <SelectItem value="cash">Cash</SelectItem>
                        <SelectItem value="online">Online</SelectItem>
                        <SelectItem value="card">Card</SelectItem>
                        <SelectItem value="bank">Bank Transfer</SelectItem>
                      </SelectContent>
                    </SelectTrigger>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="vendor">Vendor/Payee</Label>
                <Input id="vendor" placeholder="Enter vendor or payee name" />
              </div>
              <div>
                <Label htmlFor="notes">Notes (Optional)</Label>
                <Input id="notes" placeholder="Add any additional notes" />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsAddExpenseOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={() => setIsAddExpenseOpen(false)}>
              Save Expense
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default ExpensesPage;
