"use client";

import React, { useState } from "react";
import { DollarSign, TrendingUp, TrendingDown, Wallet } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import useMediaQuery from "@/hooks/use-media-query";
import FinancialCard from "./components/financial-overview/FinancialCard";
import TransactionsTable from "./components/transactions/TransactionsTable";
import MobileTransactionsList from "./components/transactions/MobileTransactionsList";
import { Header } from "./components/layout/Header";
import { TimeframeSelector } from "./components/layout/TimeframeSelector";
import { TransactionsHeader } from "./components/layout/TransactionsHeader";
import { ErrorAlert } from "./components/error/ErrorAlert";
import { useFinancialSummary } from "./hooks/useFinancialSummary";
import { useTransactions } from "./hooks/useTransactions";
import { useSearchTransactions } from "./hooks/useSearchTransactions";

export default function FinancesPage() {
  const [timeframe, setTimeframe] = useState("month");
  const [transactionType, setTransactionType] = useState("all");
  const { searchQuery, setSearchQuery, debouncedSearchQuery, page, setPage } =
    useSearchTransactions();
  const isMobile = useMediaQuery("(max-width: 768px)");

  const {
    data: summaryData,
    isLoading: isSummaryLoading,
    error: summaryError,
  } = useFinancialSummary(timeframe);

  const {
    data: transactionsData,
    isLoading: isTransactionsLoading,
    error: transactionsError,
  } = useTransactions({
    page,
    type: transactionType,
    search: debouncedSearchQuery,
  });

  if (summaryError || transactionsError) {
    return <ErrorAlert error={summaryError || transactionsError} />;
  }

  const {
    totalRevenue = 0,
    totalExpenses = 0,
    netProfit = 0,
    pendingPayments = 0,
    revenueChange = 0,
    expensesChange = 0,
  } = summaryData?.data || {};

  return (
    <div className="space-y-6">
      <Header isLoading={isSummaryLoading}>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Finances</h1>
          <p className="text-muted-foreground">
            Manage your financial transactions and reports
          </p>
        </div>
      </Header>

      <TimeframeSelector
        value={timeframe}
        onChange={setTimeframe}
        isLoading={isSummaryLoading}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <FinancialCard
          title="Total Revenue"
          value={`₹${totalRevenue.toLocaleString()}`}
          change={revenueChange}
          icon={<TrendingUp className="h-5 w-5" />}
          timeframe={timeframe}
          positive={true}
          isLoading={isSummaryLoading}
        />
        <FinancialCard
          title="Total Expenses"
          value={`₹${totalExpenses.toLocaleString()}`}
          change={expensesChange}
          icon={<TrendingDown className="h-5 w-5" />}
          timeframe={timeframe}
          positive={false}
          isLoading={isSummaryLoading}
        />
        <FinancialCard
          title="Net Profit"
          value={`₹${netProfit.toLocaleString()}`}
          change={revenueChange - expensesChange}
          icon={<DollarSign className="h-5 w-5" />}
          timeframe={timeframe}
          positive={netProfit >= 0}
          isLoading={isSummaryLoading}
        />
        <FinancialCard
          title="Pending Payments"
          value={`₹${pendingPayments.toLocaleString()}`}
          change={0}
          icon={<Wallet className="h-5 w-5" />}
          timeframe={timeframe}
          positive={false}
          isLoading={isSummaryLoading}
        />
      </div>

      <Card>
        <TransactionsHeader
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          transactionType={transactionType}
          onTransactionTypeChange={setTransactionType}
        />
        <CardContent>
          {isTransactionsLoading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="h-16 w-full bg-muted animate-pulse rounded-md"
                />
              ))}
            </div>
          ) : isMobile ? (
            <MobileTransactionsList
              transactions={transactionsData?.data?.transactions}
            />
          ) : (
            <TransactionsTable
              transactions={transactionsData?.data?.transactions}
            />
          )}
        </CardContent>
        <CardFooter className="flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Showing{" "}
            <strong>{transactionsData?.data?.transactions?.length}</strong> of{" "}
            <strong>{transactionsData?.data?.pagination?.total}</strong>{" "}
            transactions
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page === 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= transactionsData?.data?.pagination?.pages}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
