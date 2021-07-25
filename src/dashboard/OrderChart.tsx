import React, { FC } from "react";
import { Card, CardHeader, CardContent } from "@material-ui/core";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { useTranslate } from "react-admin";
import { format, subDays, addDays } from "date-fns";

import { Invoice, Receive, CreditNote } from "../types";
import { toFixedNumber } from "../utils";

const lastDay = new Date();
const lastMonthDays = Array.from({ length: 30 }, (_, i) => subDays(lastDay, i));
const aMonthAgo = subDays(new Date(), 30);
const dateFormatter = (date: number): string =>
  new Date(date).toLocaleDateString();

interface TotalByDay {
  date: number;
  total: number;
}

const aggregateInvoicesByDay = (
  invoices: Invoice[],
  initialValue: { [key: string]: number }
): { [key: string]: number } => {
  return invoices
    .filter((invoice) => invoice.status !== "DFT")
    .reduce((acc, curr) => {
      // const day = format(curr.date, 'YYYY-MM-DD');
      const day = curr.date;
      if (!acc[day]) {
        acc[day] = 0;
      }

      acc[day] += toFixedNumber(curr.grand_total, 2);

      return acc;
    }, initialValue);
};

const aggregateCreditNotesByDay = (
  credit_notes: CreditNote[],
  initialValue: { [key: string]: number }
): { [key: string]: number } => {
  return credit_notes
    .filter((credit_note) => credit_note.status !== "DFT")
    .reduce((acc, curr) => {
      // const day = format(curr.date, 'YYYY-MM-DD');
      const day = curr.date;
      if (!acc[day]) {
        acc[day] = 0;
      }

      acc[day] -= toFixedNumber(curr.refund, 2);

      return acc;
    }, initialValue);
};

const aggregateReceivesByDay = (
  receives: Receive[],
  initialValue: { [key: string]: number }
): { [key: string]: number } => {
  return receives
    .filter((receive) => receive.status !== "DFT")
    .reduce((acc, curr) => {
      // const day = format(curr.date, 'YYYY-MM-DD');
      const day = curr.date;
      if (!acc[day]) {
        acc[day] = 0;
      }

      acc[day] -= toFixedNumber(curr.grand_total, 2);

      return acc;
    }, initialValue);
};

const getRevenuePerDay = (
  invoices: Invoice[],
  credit_notes: CreditNote[],
  receives: Receive[]
): TotalByDay[] => {
  let daysWithRevenue = aggregateInvoicesByDay(invoices, {});
  daysWithRevenue = aggregateCreditNotesByDay(credit_notes, daysWithRevenue);
  daysWithRevenue = aggregateReceivesByDay(receives, daysWithRevenue);

  return lastMonthDays.map((date) => ({
    date: date.getTime(),
    total: daysWithRevenue[format(date, "YYYY-MM-DD")] || 0,
  }));
};

export const OrderChart: FC<{
  invoices?: Invoice[];
  credit_notes?: CreditNote[];
  receives?: Receive[];
}> = ({ invoices, credit_notes, receives }) => {
  const translate = useTranslate();
  if (!invoices || !credit_notes || !receives) return null;

  return (
    <Card>
      <CardHeader title={translate("pos.dashboard.month_history")} />
      <CardContent>
        <div style={{ width: "100%", height: 300 }}>
          <ResponsiveContainer>
            <AreaChart
              data={getRevenuePerDay(invoices, credit_notes, receives)}
            >
              <defs>
                <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#aa4b6b" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#aa4b6b" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="date"
                name="Date"
                type="number"
                scale="time"
                domain={[addDays(aMonthAgo, 1).getTime(), new Date().getTime()]}
                tickFormatter={dateFormatter}
              />
              <YAxis dataKey="total" name="Revenue" unit="S$" />
              <CartesianGrid strokeDasharray="3 3" />
              <Tooltip
                cursor={{ strokeDasharray: "3 3" }}
                formatter={(value: any) =>
                  new Intl.NumberFormat(undefined, {
                    style: "currency",
                    currency: "SGD",
                  }).format(value)
                }
                labelFormatter={(label: any) => dateFormatter(label)}
              />
              <Area
                type="monotone"
                dataKey="total"
                stroke="#aa4b6b"
                strokeWidth={2}
                fill="url(#colorUv)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
