import React from 'react';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import { ShoppingCart, PackagePlus, Apple, Coffee, Milk, Carrot, Fish } from 'lucide-react';

const COMMON_ITEMS = [
  { id: '1', name: 'Leche Entera', category: 'Lácteos', icon: Milk },
  { id: '2', name: 'Manzanas', category: 'Frutas', icon: Apple },
  { id: '3', name: 'Café Molido', category: 'Bebidas', icon: Coffee },
  { id: '4', name: 'Zanahorias', category: 'Verduras', icon: Carrot },
  { id: '5', name: 'Salmón', category: 'Pescados', icon: Fish },
  { id: '6', name: 'Pan de Molde', category: 'Panadería', icon: PackagePlus },
  { id: '7', name: 'Huevos', category: 'Lácteos', icon: PackagePlus },
  { id: '8', name: 'Arroz', category: 'Despensa', icon: PackagePlus },
];

export default function Catalog() {
  const { user } = useAuth();

  const addToShoppingList = async (item: typeof COMMON_ITEMS[0]) => {
    if (!user) return;
    try {
      await addDoc(collection(db, `users/${user.uid}/shoppingList`), {
        userId: user.uid,
        name: item.name,
        category: item.category,
        quantity: 1,
        checked: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error adding to list:', error);
    }
  };

  const addToInventory = async (item: typeof COMMON_ITEMS[0]) => {
    if (!user) return;
    try {
      await addDoc(collection(db, `users/${user.uid}/inventory`), {
        userId: user.uid,
        name: item.name,
        category: item.category,
        quantity: 1,
        minStock: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error adding to inventory:', error);
    }
  };

  return (
    <div className="p-6 lg:p-12 max-w-5xl mx-auto w-full h-full flex flex-col">
      <div className="mb-8">
        <h2 className="text-3xl lg:text-4xl font-light tracking-tight text-on-surface">Catálogo <span className="font-bold">Destacado</span></h2>
        <p className="text-sm opacity-50 uppercase tracking-widest mt-2">Productos comunes para añadir rápidamente</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 overflow-y-auto hide-scrollbar pb-24">
        {COMMON_ITEMS.map((item) => (
          <div key={item.id} className="bg-surface-container rounded-3xl p-6 border border-outline flex flex-col items-center text-center hover:bg-surface-container-high transition-colors">
            <div className="w-20 h-20 rounded-2xl bg-surface-container flex items-center justify-center text-on-surface mb-6 border border-outline-variant">
              <item.icon className="w-10 h-10 opacity-80" />
            </div>
            <h3 className="text-xl font-bold tracking-tight text-on-surface mb-1">{item.name}</h3>
            <p className="text-xs opacity-50 uppercase tracking-widest mb-8">{item.category}</p>
            
            <div className="flex flex-col w-full gap-3 mt-auto">
              <button 
                onClick={() => addToShoppingList(item)}
                className="w-full bg-surface-container-high hover:bg-surface-container-highest text-on-surface py-3 rounded-xl text-xs uppercase tracking-widest font-bold flex items-center justify-center gap-2 transition-colors"
              >
                <ShoppingCart className="w-4 h-4" />
                Lista
              </button>
              <button 
                onClick={() => addToInventory(item)}
                className="w-full bg-white text-primary hover:bg-gray-100 py-3 rounded-xl text-xs uppercase tracking-widest font-bold flex items-center justify-center gap-2 transition-colors"
              >
                <PackagePlus className="w-4 h-4" />
                Despensa
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
