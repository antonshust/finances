import React from "react";
import { PlusCircleIcon } from "@heroicons/react/24/outline";
import { createCategory } from "~/app/api/action/category";

export function AddCategory() {
  return (
    <div className="mb-8">
      <details className="collapse bg-white rounded-lg shadow-md dark:bg-gray-800 dark:border dark:border-gray-700">
        <summary className="collapse-title text-lg font-semibold text-gray-800 dark:text-gray-200 flex items-center px-6 py-4 cursor-pointer">
          <PlusCircleIcon className="w-5 h-5 mr-2 text-blue-500" />
          Добавить категорию
        </summary>
        <form
          action={createCategory}
          className="collapse-content form-control p-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2"
                htmlFor="name"
              >
                Название
              </label>
              <input
                type="text"
                name="name"
                id="name"
                required
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-300 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-700 dark:border-gray-600 dark:focus:border-blue-500"
              />
            </div>
            <div>
              <label
                className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2"
                htmlFor="description"
              >
                Описание
              </label>
              <input
                type="text"
                name="description"
                id="description"
                required
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-300 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-700 dark:border-gray-600 dark:focus:border-blue-500"
              />
            </div>
            <div>
              <label
                className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2"
                htmlFor="type"
              >
                Тип
              </label>
              <select
                name="type"
                id="type"
                required
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-300 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-700 dark:border-gray-600 dark:focus:border-blue-500"
              >
                <option value="INCOME">Доход</option>
                <option value="EXPENSE">Расход</option>
              </select>
            </div>
          </div>
          <div className="mt-6">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Добавить
            </button>
          </div>
        </form>
      </details>
    </div>
  );
}