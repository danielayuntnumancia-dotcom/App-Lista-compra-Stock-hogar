/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import Layout from './components/Layout';
import ShoppingList from './pages/ShoppingList';
import Inventory from './pages/Inventory';
import History from './pages/History';
import Catalog from './pages/Catalog';
import Login from './pages/Login';
import Settings from './pages/Settings';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="h-screen flex items-center justify-center bg-background text-on-background">Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
              <Route index element={<Navigate to="/list" replace />} />
              <Route path="list" element={<ShoppingList />} />
              <Route path="inventory" element={<Inventory />} />
              <Route path="history" element={<History />} />
              <Route path="catalog" element={<Catalog />} />
              <Route path="settings" element={<Settings />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

