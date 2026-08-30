import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { ShoppingCart, Package, History as HistoryIcon, BookOpen, Settings, LogOut, Menu, Search, Sun, Moon } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function Layout() {
  const { user, logOut } = useAuth();
  const [isDark, setIsDark] = React.useState(true); // Default dark

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
  };

  React.useEffect(() => {
    if (isDark) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [isDark]);

  const navItems = [
    { to: "/list", icon: ShoppingCart, label: "Lista" },
    { to: "/inventory", icon: Package, label: "Inventario" },
    { to: "/history", icon: HistoryIcon, label: "Historial" },
    { to: "/catalog", icon: BookOpen, label: "Catálogo" },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-background text-on-background transition-colors duration-200">
      
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 border-r border-outline p-6 space-y-12 bg-background">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center text-on-surface font-bold text-2xl tracking-tighter shadow-lg shadow-primary/20">P</div>
          <div>
            <h1 className="text-2xl font-light tracking-tight text-on-surface">Pantry<span className="font-bold">Sync</span></h1>
            <p className="text-[10px] opacity-50 uppercase tracking-widest mt-1">Gestión Digital</p>
          </div>
        </div>

        <nav className="flex-1 space-y-4">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-4 px-4 py-3 rounded-2xl transition-all ${
                  isActive 
                    ? "bg-surface-container-high text-on-surface font-medium border border-outline" 
                    : "text-on-surface-variant hover:text-white/80 hover:bg-surface-container"
                }`
              }
            >
              <item.icon className="w-5 h-5" />
              <span className="text-sm uppercase tracking-widest">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto space-y-3 pt-6 border-t border-outline">
          <NavLink to="/settings" className={({ isActive }) => `w-full flex items-center gap-4 px-4 py-3 rounded-2xl transition-colors ${isActive ? 'text-on-surface bg-surface-container-high border border-outline' : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'}`}>
            <Settings className="w-5 h-5" />
            <span className="text-sm uppercase tracking-widest">Ajustes</span>
          </NavLink>
          <button onClick={logOut} className="w-full flex items-center gap-4 px-4 py-3 text-error/80 hover:text-error hover:bg-error/10 rounded-2xl transition-colors">
            <LogOut className="w-5 h-5" />
            <span className="text-sm uppercase tracking-widest">Salir</span>
          </button>
          
          {user && (
            <div className="flex items-center gap-3 mt-4 p-3 rounded-2xl bg-surface-container border border-outline">
              <img src={user.photoURL || ''} alt="Profile" className="w-8 h-8 rounded-full object-cover" />
              <span className="text-xs uppercase tracking-widest text-on-surface-variant truncate">{user.displayName || user.email}</span>
            </div>
          )}
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
        {/* Mobile Header */}
        <header className="lg:hidden flex items-center justify-between p-6 border-b border-outline-variant z-10 bg-background">
          <button onClick={logOut} className="text-on-surface-variant p-2 rounded-full hover:bg-surface-container active:scale-95 transition-all">
            <LogOut className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-light tracking-tight text-on-surface">Pantry<span className="font-bold">Sync</span></h1>
          <NavLink to="/settings" className={({ isActive }) => `p-2 rounded-full transition-all ${isActive ? 'text-on-surface bg-surface-container-high' : 'text-on-surface-variant hover:bg-surface-container'}`}>
            <Settings className="w-5 h-5" />
          </NavLink>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto pb-24 lg:pb-0">
          <Outlet />
        </main>

        {/* Mobile Navigation */}
        <nav className="lg:hidden fixed bottom-0 left-0 w-full bg-background/90 backdrop-blur-md border-t border-outline flex justify-around items-center px-4 py-4 pb-safe z-50">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center p-2 transition-all ${
                  isActive 
                    ? "text-primary" 
                    : "text-on-surface-variant"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon className={`w-6 h-6 mb-1 ${isActive ? "fill-current" : ""}`} />
                  <span className="text-[10px] uppercase tracking-widest">{item.label}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  );
}
