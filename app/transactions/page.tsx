"use client";

import { useInventoryStore } from "@/lib/store";
import { format } from "date-fns";
import { History } from "lucide-react";

export default function TransactionsPage() {
  const { transactions, inventory, products, hydrated, resetToSeed } = useInventoryStore();

  if (!hydrated) return <div className="text-slate-500">Loading\u2026</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Transactions</h1>
          <p className="mt-1 text-slate-500">Stock receipts, issues, and adjustments</p>
        </div>
        <button className="btn-secondary text-xs" onClick={resetToSeed}>
          Reset to seed data
        </button>
      </div>

      <div className="card overflow-hidden">
        {transactions.length === 0 ? (
          <div className="py-16 text-center text-slate-400">
            <History className="h-10 w-10 mx-auto mb-3 opacity-40" />
            <p>No transactions recorded yet.</p>
            <p className="text-sm mt-1">Use the Adjust button on the Inventory page to create stock movements.</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-500 bg-slate-50 border-b border-slate-200">
                <th className="px-5 py-3 font-medium">Date</th>
                <th className="px-5 py-3 font-medium">Type</th>
                <th className="px-5 py-3 font-medium">Product / Lot</th>
                <th className="px-5 py-3 font-medium">Qty Change</th>
                <th className="px-5 py-3 font-medium">Notes</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx) => {
                const entry = tx.entries[0];
                const item = inventory.find((i) => i.id === entry?.inventoryItemId);
                const product = products.find((p) => p.id === item?.productId);
                return (
                  <tr key={tx.id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="px-5 py-3 text-slate-600 whitespace-nowrap">
                      {format(new Date(tx.date), "dd MMM yyyy HH:mm")}
                    </td>
                    <td className="px-5 py-3">
                      <span className={tx.type === "RECEIPT" ? "badge-green" : "badge-red"}>{tx.type}</span>
                    </td>
                    <td className="px-5 py-3">
                      <div className="font-medium text-slate-800 max-w-xs truncate">{product?.name ?? "\u2014"}</div>
                      <div className="text-xs text-slate-400 font-mono">{item?.lotNumber}</div>
                    </td>
                    <td className="px-5 py-3 font-semibold">
                      <span className={entry?.quantity >= 0 ? "text-green-600" : "text-red-600"}>
                        {entry?.quantity >= 0 ? "+" : ""}
                        {entry?.quantity.toLocaleString()}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-slate-500">{tx.notes || "\u2014"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
