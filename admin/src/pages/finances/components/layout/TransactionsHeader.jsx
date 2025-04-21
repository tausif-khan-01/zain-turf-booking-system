import React from "react";
import { CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select";
import { Search, Filter } from "lucide-react";

export const TransactionsHeader = ({
  searchQuery,
  onSearchChange,
  transactionType,
  onTransactionTypeChange,
}) => {
  return (
    <CardHeader className="pb-3">
      <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
        <div>
          <CardTitle>Transactions</CardTitle>
          <CardDescription>View and manage all financial transactions</CardDescription>
        </div>
        <div className="flex flex-wrap gap-2">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="search"
              placeholder="Search transactions..."
              className="w-full pl-9"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
          <Select value={transactionType} onValueChange={onTransactionTypeChange}>
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
  );
}; 