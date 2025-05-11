"use client";

import React, { useState } from "react";
import { TransactionWithCategory } from "../transactions/table";
import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  Title,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend, Title);

interface ExpenseRingChartProps {
  transactions: TransactionWithCategory[];
}

export default function ExpenseRingChart({ transactions }: ExpenseRingChartProps) {
  const now = new Date();

  const [showAllTime, setShowAllTime] = useState<boolean>(false);
  const [selectedYear, setSelectedYear] = useState<number>(now.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState<number>(now.getMonth()); // 0-11

  const years = Array.from({ length: 5 }, (_, i) => now.getFullYear() - i);
  const monthNames = [
    "Январь", "Февраль", "Март", "Апрель", "Май", "Июнь",
    "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"
  ];

  const handleMonthChange = (delta: number) => {
    let newMonth = selectedMonth + delta;
    let newYear = selectedYear;

    if (newMonth > 11) {
      newMonth = 0;
      newYear += 1;
    } else if (newMonth < 0) {
      newMonth = 11;
      newYear -= 1;
    }

    setSelectedMonth(newMonth);
    setSelectedYear(newYear);
    setShowAllTime(false);
  };

  const totalExpenseAllTime = transactions.filter(t => t.type === "EXPENSE").reduce(
    (sum, transaction) => sum + Number(transaction.amount),
    0
  );

  const expenseThisMonth = transactions.filter((transaction) => {
    if (transaction.type !== "EXPENSE") return false;
    const transactionDate = new Date(transaction.date);
    return (
      transactionDate.getFullYear() === selectedYear &&
      transactionDate.getMonth() === selectedMonth
    );
  });

  const displayedExpense = showAllTime
    ? totalExpenseAllTime
    : expenseThisMonth.reduce((sum, t) => sum + Number(t.amount), 0);

  const expenseByCategory = React.useMemo(() => {
    const grouped: Record<string, number> = {};
    const relevantTransactions = transactions.filter(t => t.type === "EXPENSE");
    const filteredTransactions = showAllTime ? relevantTransactions : expenseThisMonth;

    filteredTransactions.forEach((t) => {
      const categoryName = t.category?.name || "Не указана";
      grouped[categoryName] = (grouped[categoryName] || 0) + Number(t.amount);
    });
    return grouped;
  }, [transactions, expenseThisMonth, showAllTime]);

  const backgroundColors = Object.keys(expenseByCategory).map((_, i) => 
    `hsl(${(i * 360) / Object.keys(expenseByCategory).length}, 70%, 50%)`
  );

  const chartData = {
    labels: Object.keys(expenseByCategory),
    datasets: [
      {
        label: "Расходы по категориям",
        data: Object.values(expenseByCategory),
        backgroundColor: backgroundColors,
        borderColor: "#fff",
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 max-w-2xl mx-auto">
      {/* Заголовок */}
      <h2 className="text-xl font-semibold text-violet-700 dark:text-violet-300 mb-2 text-center">
        {showAllTime
          ? "Общий расход за всё время"
          : `Расходы за ${monthNames[selectedMonth]} ${selectedYear}`}
      </h2>

      {!showAllTime && (
        <div className="flex items-center justify-center space-x-2 mb-4">
          <button
            onClick={() => handleMonthChange(-1)}
            className="px-3 py-1 bg-violet-300 hover:bg-violet-400 rounded text-violet-700"
          >
            Предыдущий месяц
          </button>
          <button
            onClick={() => handleMonthChange(1)}
            className="px-3 py-1 bg-violet-300 hover:bg-violet-400 rounded text-violet-700"
          >
            Следующий месяц
          </button>
        </div>
      )}

      {showAllTime ? (
        <button
          onClick={() => setShowAllTime(false)}
          className="mb-4 px-4 py-2 bg-violet-400 hover:bg-violet-500 text-white rounded font-semibold block mx-auto"
        >
          Назад к просмотру по месяцам
        </button>
      ) : (
        <div className="mb-2 flex justify-center">
          <button
            onClick={() => setShowAllTime(true)}
            className="px-4 py-2 bg-violet-400 hover:bg-violet-500 text-white rounded font-semibold"
          >
            Посмотреть за всё время
          </button>
        </div>
      )}

      {!showAllTime && (
        <div className="mb-4 flex justify-center items-center">
          <label htmlFor="year" className="mr-2 font-semibold text-violet-700">
            Год:
          </label>
          <select
            id="year"
            value={selectedYear}
            onChange={(e) => {
              setSelectedYear(parseInt(e.target.value));
              setShowAllTime(false);
            }}
            className="border border-gray-300 rounded p-1"
          >
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="mt-4">
        <Doughnut
          data={chartData}
          options={{
            responsive: true,
            plugins: {
              legend: {
                position: "bottom",
              },
            },
          }}
        />
      </div>

      <p className="mt-4 text-2xl font-bold text-violet-700 dark:text-violet-300 text-center">
        {displayedExpense.toLocaleString("ru-RU", { style: "currency", currency: "RUB" })}
      </p>

      <div className="mt-4 flex justify-center">
        <a
          href="http://localhost:3000/transactions"
          className="px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded font-semibold"
        >
          Подробнее
        </a>
      </div>
    </div>
  );
}