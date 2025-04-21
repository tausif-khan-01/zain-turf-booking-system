import React from "react";
import { Clock, CheckCircle2, XCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
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

const MobileTransactionsList = ({ transactions }) => {
  return (
    <div className="space-y-4">
      {transactions.length === 0 ? (
        <div className="text-center py-8 text-gray-500">No transactions found</div>
      ) : (
        transactions.map((transaction) => (
          <Card key={transaction.txnId} className="hover:bg-gray-50 transition-colors">
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <div className="font-medium">{transaction.description}</div>
                  <div className="text-xs text-gray-500">
                    <span className="text-muted-foreground">#</span>
                    {transaction.txnId} • {format(new Date(transaction.date), "MMM dd, yyyy")}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <Badge variant="outline" className="capitalize">
                    {transaction.category}
                  </Badge>
                  {getStatusBadge(transaction.status)}
                </div>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="text-lg">
                    {getPaymentMethodIcon(transaction.paymentMethod)}
                  </span>
                  <span className="text-sm capitalize">{transaction.paymentMethod}</span>
                </div>
                <span
                  className={
                    transaction.type === "income" ? "text-green-600 font-medium" : "text-red-600 font-medium"
                  }
                >
                  {transaction.type === "income" ? "+" : "-"}₹{transaction.amount.toLocaleString()}
                </span>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
};

export default MobileTransactionsList; 