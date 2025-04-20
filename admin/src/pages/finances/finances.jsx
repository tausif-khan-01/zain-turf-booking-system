"use client";

import React, { useState } from "react";
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Filter,
  Search,
  Wallet,
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
import useMediaQuery from "@/hooks/use-media-query";
import FinancialCard from "./components/FinancialCard";
import TransactionsTable from "./components/TransactionsTable";
import MobileTransactionsList from "./components/MobileTransactionsList";
import { financialData } from "./constants/financialData";

export default function FinancesPage() {
  const [timeframe, setTimeframe] = useState("month");
  const [transactionType, setTransactionType] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const isMobile = useMediaQuery("(max-width: 768px)");

  // Filter transactions based on type and search query
  const filteredTransactions = financialData.transactions.filter(
    (transaction) => {
      const matchesType =
        transactionType === "all" || transaction.type === transactionType;
      const matchesSearch =
        transaction.description
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        transaction.id.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesType && matchesSearch;
    }
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Finances</h1>
          <p className="text-muted-foreground">
            Manage your financial transactions and reports
          </p>
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

      {/* Financial Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <FinancialCard
          title="Total Revenue"
          value={`₹${financialData.totalRevenue.toLocaleString()}`}
          change={financialData.revenueChange}
          icon={<TrendingUp className="h-5 w-5" />}
          timeframe={timeframe}
          positive={true}
        />
        <FinancialCard
          title="Total Expenses"
          value={`₹${financialData.expenses.toLocaleString()}`}
          change={financialData.expensesChange}
          icon={<TrendingDown className="h-5 w-5" />}
          timeframe={timeframe}
          positive={false}
        />
        <FinancialCard
          title="Net Profit"
          value={`₹${financialData.profit.toLocaleString()}`}
          change={financialData.profitChange}
          icon={<DollarSign className="h-5 w-5" />}
          timeframe={timeframe}
          positive={true}
        />
        <FinancialCard
          title="Pending Payments"
          value={`₹${financialData.pendingPayments.toLocaleString()}`}
          change={financialData.pendingPaymentsChange}
          icon={<Wallet className="h-5 w-5" />}
          timeframe={timeframe}
          positive={false}
        />
      </div>

      {/* Transactions */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
            <div>
              <CardTitle>Transactions</CardTitle>
              <CardDescription>
                View and manage all financial transactions
              </CardDescription>
            </div>
            <div className="flex flex-wrap gap-2">
              <div className="relative w-full md:w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  type="search"
                  placeholder="Search transactions..."
                  className="w-full pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select
                value={transactionType}
                onValueChange={setTransactionType}
              >
                <SelectTrigger className="w-full md:w-[180px]">
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    <span>Type</span>
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Transactions</SelectItem>
                  <SelectItem value="income">Income</SelectItem>
                  <SelectItem value="expense">Expenses</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isMobile ? (
            <MobileTransactionsList transactions={filteredTransactions} />
          ) : (
            <TransactionsTable transactions={filteredTransactions} />
          )}
        </CardContent>
        <CardFooter className="flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Showing <strong>{filteredTransactions.length}</strong> of{" "}
            <strong>{financialData.transactions.length}</strong> transactions
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
    </div>
  );
}
