import React from "react";
import Link from "next/link";
import { SignOutButton } from "./signlink";
import { type Session } from "next-auth";
import { UserCircleIcon } from "@heroicons/react/24/solid";

export async function Navbar({ session }: { session: Session | null }) {
  const isLoggedIn = !!session?.user;

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-md">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="text-2xl font-semibold text-gray-800 dark:text-white hover:text-blue-600">
          Мои финансы
        </Link>

        <div className="flex items-center space-x-4">
          {isLoggedIn ? (
            <>
              <div className="dropdown dropdown-end">
                <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
                  <UserCircleIcon className="h-8 w-8 text-gray-600 dark:text-gray-300" />
                </div>
                <ul
                  tabIndex={0}
                  className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52 mt-3 z-50" // Added z-50
                >
                  <li>
                    <Link href="/profile">Профиль</Link>
                  </li>
                  <li>
                    <Link href="/transactions">Транзакции</Link>
                  </li>
                  <li>
                    <Link href="/categories">Категории</Link>
                  </li>
                  <li>
                    <Link href="/budgets">Бюджеты</Link>
                  </li>
                  <li>
                    <Link href="/reports">Отчеты</Link>
                  </li>
                  <li>
                    <SignOutButton />
                  </li>
                </ul>
              </div>
            </>
          ) : (
            <Link href="../api/auth/signin" className="btn btn-primary">
              Войти
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}