import React from "react"
import { CreditCard } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const MobileTransactionsList = ({ transactions }) => {
  return (
    <div className="space-y-4">
      {transactions.length === 0 ? (
        <div className="text-center py-8 text-gray-500">No transactions found</div>
      ) : (
        transactions.map((transaction) => (
          <Card key={transaction.id} className="hover:bg-gray-50 transition-colors">
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <div className="font-medium">{transaction.description}</div>
                  <div className="text-xs text-gray-500">
                    {transaction.id} • {transaction.date}
                  </div>
                </div>
                <Badge variant="outline" className="capitalize">
                  {transaction.category}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-gray-500" />
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
  )
}

export default MobileTransactionsList 