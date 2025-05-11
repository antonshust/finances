"use client";

import React, { useState } from "react";
import { TransactionWithCategory } from "../transactions/table";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface IncomeByMonthProps {
  transactions: TransactionWithCategory[];
}

export default function IncomeByMonth({ transactions }: IncomeByMonthProps) {
  const now = new Date();
  const [selectedYear, setSelectedYear] = useState<number>(now.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState<number>(now.getMonth()); // 0-11
  const [showAllTime, setShowAllTime] = useState<boolean>(false);

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

  const totalIncomeAllTime = transactions.filter(t => t.type === "INCOME").reduce(
    (sum, transaction) => sum + Number(transaction.amount),
    0
  );

  const incomeThisMonth = transactions.filter((transaction) => {
    if (transaction.type !== "INCOME") return false;
    const transactionDate = new Date(transaction.date);
    return (
      transactionDate.getFullYear() === selectedYear &&
      transactionDate.getMonth() === selectedMonth
    );
  });

  const displayedIncome = showAllTime
    ? totalIncomeAllTime
    : incomeThisMonth.reduce((sum, t) => sum + Number(t.amount), 0);

  const incomeByCategory = React.useMemo(() => {
    const grouped: Record<string, number> = {};

    const relevantTransactions = transactions.filter(t => t.type === "INCOME");

    const filteredTransactions = showAllTime ? relevantTransactions : incomeThisMonth;

    filteredTransactions.forEach((t) => {
      const categoryName = t.category?.name || "Не указана";
      grouped[categoryName] = (grouped[categoryName] || 0) + Number(t.amount);
    });
    return grouped;
  }, [transactions, incomeThisMonth, showAllTime]);

  const chartData = {
    labels: Object.keys(incomeByCategory),
    datasets: [
      {
        label: "Доходы по категориям",
        data: Object.values(incomeByCategory),
        backgroundColor: "rgba(34, 197, 94, 0.7)", 
        borderColor: "rgba(34, 197, 94, 1)",
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="mb-4 p-4 rounded-lg shadow-md bg-green-100 dark:bg-green-200">
      <h2 className="text-xl font-semibold text-green-700 dark:text-green-800 mb-2">
        {showAllTime ? "Общий доход за всё время" : `Доход за ${monthNames[selectedMonth]} ${selectedYear}`}
      </h2>

      {!showAllTime && (
        <div className="flex items-center space-x-2 mb-4">
          <button
            onClick={() => handleMonthChange(-1)}
            className="px-3 py-1 bg-green-300 hover:bg-green-400 rounded text-green-700"
          >
            Предыдущий месяц
          </button>
          <button
            onClick={() => handleMonthChange(1)}
            className="px-3 py-1 bg-green-300 hover:bg-green-400 rounded text-green-700"
          >
            Следующий месяц
          </button>
        </div>
      )}

      {showAllTime ? (
        <button
          onClick={() => setShowAllTime(false)}
          className="mb-4 px-4 py-2 bg-green-400 hover:bg-green-500 text-white rounded font-semibold"
        >
          Назад к просмотру по месяцам
        </button>
      ) : (
        <div className="mb-2">
          <button
            onClick={() => setShowAllTime(true)}
            className="px-4 py-2 bg-green-400 hover:bg-green-500 text-white rounded font-semibold"
          >
            Посмотреть за всё время
          </button>
        </div>
      )}

      {!showAllTime && (
        <div className="mb-2">
          <label htmlFor="year" className="mr-2 font-semibold text-green-700">
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

      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-2 text-green-700">Распределение по категориям</h3>
        <Bar
          data={chartData}
          options={{
            responsive: true,
            plugins: {
              legend: {
                position: "top",
              },
              title: {
                display: false,
              },
            },
          }}
        />
      </div>

      <p className="text-2xl font-bold text-green-800 dark:text-green-900 mt-4">
        {displayedIncome.toLocaleString("ru-RU", { style: "currency", currency: "RUB" })}
      </p>
    </div>
  );
}