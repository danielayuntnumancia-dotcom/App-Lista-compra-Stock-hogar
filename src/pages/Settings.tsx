import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { User, Bell, Shield, Palette } from 'lucide-react';

export default function Settings() {
  const { user } = useAuth();
  const { isDark, toggleTheme } = useTheme();

  const SETTINGS_SECTIONS = [
    {
      title: 'Perfil',
      icon: User,
      description: 'Gestiona tu información personal y cuenta',
      action: user?.email || 'No disponible',
    },
    {
      title: 'Notificaciones',
      icon: Bell,
      description: 'Configura las alertas de stock bajo y compras',
      action: 'Configurar',
    },
    {
      title: 'Apariencia',
      icon: Palette,
      description: 'Cambia el tema visual de la aplicación',
      action: isDark ? 'Modo Oscuro' : 'Modo Claro',
      onClick: toggleTheme
    },
    {
      title: 'Privacidad',
      icon: Shield,
      description: 'Controla quién puede ver tus listas e inventario',
      action: 'Privado',
    }
  ];

  return (
    <div className="p-6 lg:p-12 max-w-4xl mx-auto w-full h-full flex flex-col">
      <div className="mb-8">
        <h2 className="text-3xl lg:text-4xl font-light tracking-tight text-on-surface">Configuración <span className="font-bold">Ajustes</span></h2>
        <p className="text-sm opacity-50 uppercase tracking-widest mt-2">Personaliza tu experiencia en PantrySync</p>
      </div>

      <div className="flex-1 overflow-y-auto hide-scrollbar space-y-4 pb-24">
        {SETTINGS_SECTIONS.map((section, idx) => (
          <div 
            key={idx} 
            onClick={section.onClick}
            className="bg-surface-container rounded-3xl p-6 border border-outline flex items-center justify-between hover:bg-surface-container-high transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-6">
              <div className="w-14 h-14 rounded-2xl bg-primary-container flex items-center justify-center text-on-primary-container">
                <section.icon className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold tracking-tight text-on-surface">{section.title}</h3>
                <p className="text-xs text-on-surface-variant mt-1">{section.description}</p>
              </div>
            </div>
            <div className="hidden sm:block">
              <span className="text-xs uppercase tracking-widest font-bold text-on-surface-variant">{section.action}</span>
            </div>
          </div>
        ))}
        
        <div className="mt-8 p-6 bg-primary/10 border border-primary/30 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-bold tracking-tight text-on-surface">Sincronización Premium</h3>
            <p className="text-xs text-on-surface-variant mt-1">Obtén almacenamiento ilimitado y listas compartidas.</p>
          </div>
          <button className="px-6 py-3 bg-primary text-on-primary rounded-xl text-xs uppercase tracking-widest font-bold hover:bg-blue-500 transition-colors whitespace-nowrap">
            Mejorar Plan
          </button>
        </div>
      </div>
    </div>
  );
}
