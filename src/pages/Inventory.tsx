import React, { useState, useEffect } from 'react';
import { collection, query, onSnapshot, doc, updateDoc, deleteDoc, addDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import { InventoryItem } from '../lib/types';
import { Plus, Minus, Trash2, Search, PackageOpen } from 'lucide-react';

export default function Inventory() {
  const { user } = useAuth();
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  const [newItemQty, setNewItemQty] = useState(1);
  const [newItemMinStock, setNewItemMinStock] = useState(0);

  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, `users/${user.uid}/inventory`));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetched = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as InventoryItem));
      setItems(fetched);
    });
    return unsubscribe;
  }, [user]);

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim() || !user) return;
    
    try {
      await addDoc(collection(db, `users/${user.uid}/inventory`), {
        userId: user.uid,
        name: newItemName.trim(),
        category: 'Despensa',
        quantity: newItemQty,
        minStock: newItemMinStock,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      setNewItemName('');
      setNewItemQty(1);
      setNewItemMinStock(0);
      setIsAdding(false);
    } catch (error) {
      console.error('Error adding item:', error);
    }
  };

  const updateQuantity = async (id: string, delta: number, currentQuantity: number) => {
    if (!user) return;
    const newQuantity = currentQuantity + delta;
    if (newQuantity < 0) return;
    try {
      await updateDoc(doc(db, `users/${user.uid}/inventory/${id}`), {
        quantity: newQuantity,
        updatedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };

  const deleteItem = async (id: string) => {
    if (!user) return;
    try {
      await deleteDoc(doc(db, `users/${user.uid}/inventory/${id}`));
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  const filteredItems = items.filter(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="p-6 lg:p-12 max-w-5xl mx-auto w-full h-full flex flex-col relative">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
        <div>
          <h2 className="text-3xl lg:text-4xl font-light tracking-tight text-on-surface">Inventario</h2>
          <p className="text-sm opacity-50 uppercase tracking-widest mt-1">Gestiona tus productos almacenados</p>
        </div>
        <div className="relative w-full md:w-64">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar producto..."
            className="w-full bg-surface-container border border-outline rounded-2xl py-3 pl-12 pr-4 text-on-surface focus:outline-none focus:border-primary focus:bg-surface-container-high font-light tracking-tight transition-colors"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 overflow-y-auto hide-scrollbar pb-24">
        {filteredItems.map(item => {
          const isLowStock = item.minStock !== undefined && item.quantity <= item.minStock;
          
          return (
            <div key={item.id} className={`bg-surface-container rounded-3xl p-6 border flex flex-col gap-4 relative transition-colors hover:bg-surface-container-high ${isLowStock ? 'border-error/50 bg-error/5' : 'border-outline'}`}>
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-2xl flex-shrink-0 flex items-center justify-center ${isLowStock ? 'bg-error text-on-error' : 'bg-surface-container-high text-on-surface-variant'}`}>
                  <PackageOpen className="w-6 h-6" />
                </div>
                <div className="flex-1 min-w-0 flex flex-col items-start">
                  <h3 className="text-xl font-bold tracking-tight text-on-surface leading-tight line-clamp-2">{item.name}</h3>
                  <p className="text-xs opacity-60 uppercase tracking-widest truncate mt-1">{item.category}</p>
                  {isLowStock && (
                    <div className="mt-3 bg-error/20 text-error px-2.5 py-1 rounded-lg text-[10px] uppercase tracking-widest font-bold border border-error/20 whitespace-nowrap">
                      Bajo Stock
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex items-center justify-between mt-auto pt-4 border-t border-outline">
                <div className="flex items-center gap-2 bg-surface-container rounded-full px-2 py-1 border border-outline-variant">
                  <button 
                    onClick={() => updateQuantity(item.id, -1, item.quantity)}
                    className="w-8 h-8 flex items-center justify-center text-on-surface-variant hover:text-on-surface transition-colors rounded-full"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className={`text-lg w-8 text-center font-light ${isLowStock ? 'text-error font-bold' : 'text-on-surface'}`}>
                    {item.quantity}
                  </span>
                  <button 
                    onClick={() => updateQuantity(item.id, 1, item.quantity)}
                    className="w-8 h-8 flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors rounded-full"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <button onClick={() => deleteItem(item.id)} className="p-2 text-on-surface-variant hover:text-error transition-colors">
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {isAdding ? (
        <form onSubmit={handleAddItem} className="absolute bottom-6 right-0 left-0 lg:left-auto lg:w-[420px] mx-4 lg:mx-0 p-6 bg-surface-container-highest rounded-3xl shadow-2xl border border-outline z-40 space-y-4 backdrop-blur-xl">
          <input
            autoFocus
            type="text"
            value={newItemName}
            onChange={(e) => setNewItemName(e.target.value)}
            placeholder="Nombre del producto"
            className="w-full bg-surface-container-lowest text-on-surface border border-outline rounded-2xl p-4 focus:outline-none focus:border-primary text-lg font-light tracking-tight placeholder-on-surface-variant"
          />
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-[10px] uppercase tracking-widest text-on-surface-variant mb-2 pl-2">Cantidad</label>
              <input
                type="number"
                min="0"
                value={newItemQty}
                onChange={(e) => setNewItemQty(Number(e.target.value))}
                className="w-full bg-surface-container-lowest text-on-surface border border-outline rounded-2xl p-4 focus:outline-none focus:border-primary text-lg font-light tracking-tight"
              />
            </div>
            <div className="flex-1">
              <label className="block text-[10px] uppercase tracking-widest text-on-surface-variant mb-2 pl-2">Stock Mínimo</label>
              <input
                type="number"
                min="0"
                value={newItemMinStock}
                onChange={(e) => setNewItemMinStock(Number(e.target.value))}
                className="w-full bg-surface-container-lowest text-on-surface border border-outline rounded-2xl p-4 focus:outline-none focus:border-primary text-lg font-light tracking-tight"
              />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={() => setIsAdding(false)} className="px-5 py-3 text-xs uppercase tracking-widest text-on-surface-variant hover:bg-surface-container rounded-xl transition-colors">
              Cancelar
            </button>
            <button type="submit" disabled={!newItemName.trim()} className="px-5 py-3 text-xs uppercase font-bold tracking-widest bg-primary text-on-primary rounded-xl hover:bg-primary-container hover:text-on-primary-container disabled:opacity-50 transition-colors">
              Registrar
            </button>
          </div>
        </form>
      ) : (
        <button 
          onClick={() => setIsAdding(true)}
          className="absolute bottom-6 right-6 lg:bottom-12 lg:right-12 w-16 h-16 bg-primary text-on-primary rounded-2xl flex items-center justify-center shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all z-40 rotate-3 hover:rotate-0"
        >
          <Plus className="w-8 h-8" />
        </button>
      )}
    </div>
  );
}
