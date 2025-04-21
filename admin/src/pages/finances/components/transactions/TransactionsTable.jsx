import React from "react";
import { CreditCard, Clock, CheckCircle2, XCircle } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

const getStatusBadge = (status) => {
  switch (status) {
    case "Paid":
      return (
        <Badge variant="success" className="flex items-center gap-1">
          <CheckCircle2 className="h-3 w-3" />
          Paid
        </Badge>
      );
    case "Pending":
      return (
        <Badge variant="warning" className="flex items-center gap-1">
          <Clock className="h-3 w-3" />
          Pending
        </Badge>
      );
    case "Failed":
      return (
        <Badge variant="destructive" className="flex items-center gap-1">
          <XCircle className="h-3 w-3" />
          Failed
        </Badge>
      );
    default:
      return null;
  }
};

const getPaymentMethodIcon = (method) => {
  switch (method) {
    case "Cash":
      return "💵";
    case "Online":
      return "💳";
    case "Razorpay":
      return "🔄";
    default:
      return "💳";
  }
};

const TransactionsTable = ({ transactions }) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Transaction ID</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Payment Method</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                No transactions found
              </TableCell>
            </TableRow>
          ) : (
            transactions.map((transaction) => (
              <TableRow key={transaction.txnId}>
                <TableCell className="font-medium">
                  <span className="text-muted-foreground">#</span>
                  {transaction.txnId}
                </TableCell>
                <TableCell>
                  {format(new Date(transaction.date), "MMM dd, yyyy")}
                </TableCell>
                <TableCell>{transaction.description}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="capitalize">
                    {transaction.category}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span className="text-lg">
                      {getPaymentMethodIcon(transaction.paymentMethod)}
                    </span>
                    <span className="capitalize">
                      {transaction.paymentMethod}
                    </span>
                  </div>
                </TableCell>
                <TableCell>{getStatusBadge(transaction.status)}</TableCell>
                <TableCell className="text-right">
                  <span
                    className={
                      transaction.type === "income"
                        ? "text-green-600 font-medium"
                        : "text-red-600 font-medium"
                    }
                  >
                    {transaction.type === "income" ? "+" : "-"}₹
                    {transaction.amount.toLocaleString()}
                  </span>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default TransactionsTable; 