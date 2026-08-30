import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';

export default function Login() {
  const { user, signIn } = useAuth();

  if (user) {
    return <Navigate to="/list" replace />;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="bg-surface-container/50 backdrop-blur-md rounded-3xl p-10 max-w-md w-full shadow-2xl border border-outline text-center">
        <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-lg shadow-primary/20">
          <ShoppingCart className="text-on-primary w-8 h-8" />
        </div>
        <h1 className="text-4xl font-light tracking-tight text-on-surface mb-2">
          Pantry<span className="font-bold">Sync</span>
        </h1>
        <p className="text-sm text-on-surface-variant uppercase tracking-widest mb-10">
          Gestión Digital de Compra e Inventario
        </p>
        
        <button
          onClick={signIn}
          className="w-full bg-primary text-on-primary hover:bg-primary-container hover:text-on-primary-container py-4 rounded-2xl font-bold uppercase tracking-widest text-sm shadow-xl transition-colors flex items-center justify-center gap-2"
        >
          Iniciar Sesión
        </button>
      </div>
    </div>
  );
}
