import React, { useState, useEffect } from 'react';
import { collection, query, onSnapshot, doc, updateDoc, deleteDoc, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import { ShoppingItem } from '../lib/types';
import { Plus, Minus, Check, Trash2, Store } from 'lucide-react';

export default function ShoppingList() {
  const { user } = useAuth();
  const [items, setItems] = useState<ShoppingItem[]>([]);
  const [newItemName, setNewItemName] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, `users/${user.uid}/shoppingList`));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetched = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ShoppingItem));
      setItems(fetched.sort((a, b) => (a.checked === b.checked ? 0 : a.checked ? 1 : -1)));
    }, (error) => {
      console.error('Error fetching shopping list:', error);
    });
    return unsubscribe;
  }, [user]);

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim() || !user) return;
    
    try {
      await addDoc(collection(db, `users/${user.uid}/shoppingList`), {
        userId: user.uid,
        name: newItemName.trim(),
        category: 'General',
        quantity: 1,
        checked: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      setNewItemName('');
      setIsAdding(false);
    } catch (error) {
      console.error('Error adding item:', error);
    }
  };

  const updateQuantity = async (id: string, delta: number, currentQuantity: number) => {
    if (!user) return;
    const newQuantity = currentQuantity + delta;
    if (newQuantity < 1) return;
    try {
      await updateDoc(doc(db, `users/${user.uid}/shoppingList/${id}`), {
        quantity: newQuantity,
        updatedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };

  const toggleChecked = async (id: string, currentChecked: boolean) => {
    if (!user) return;
    try {
      await updateDoc(doc(db, `users/${user.uid}/shoppingList/${id}`), {
        checked: !currentChecked,
        updatedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error toggling check:', error);
    }
  };

  const deleteItem = async (id: string) => {
    if (!user) return;
    try {
      await deleteDoc(doc(db, `users/${user.uid}/shoppingList/${id}`));
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  const activeItems = items.filter(i => !i.checked);
  const completedItems = items.filter(i => i.checked);

  return (
    <div className="p-6 lg:p-12 max-w-4xl mx-auto w-full h-full flex flex-col relative">
      <div className="mb-8 flex items-center justify-between">
        <h2 className="text-3xl lg:text-4xl font-light tracking-tight text-on-surface">Lista <span className="font-bold">Activa</span></h2>
        <div className="hidden sm:flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-primary"></div>
          <span className="text-xs opacity-50 uppercase tracking-widest">Sincronizado</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto hide-scrollbar space-y-4 pb-24">
        {activeItems.map((item) => (
          <div key={item.id} className="flex items-center justify-between p-5 lg:p-6 bg-surface-container rounded-3xl border border-outline shadow-lg transition-all hover:bg-surface-container-high">
            <div className="flex items-center gap-4 flex-1 min-w-0">
              <button 
                onClick={() => toggleChecked(item.id, item.checked)}
                className="w-6 h-6 rounded-md border border-outline flex items-center justify-center hover:bg-surface-container-high transition-colors flex-shrink-0"
              >
                {item.checked && <Check className="w-4 h-4 text-primary" />}
              </button>
              <div className="flex-1 min-w-0 pr-4">
                <h3 className="text-xl font-bold tracking-tight text-on-surface line-clamp-2 leading-tight">{item.name}</h3>
                <p className="text-xs opacity-50 uppercase tracking-widest truncate mt-1">{item.category}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 ml-4">
              <div className="flex items-center bg-surface-container rounded-full px-2 py-1 border border-outline">
                <button 
                  onClick={() => updateQuantity(item.id, -1, item.quantity)}
                  className="w-8 h-8 flex items-center justify-center text-on-surface-variant hover:text-on-surface transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="text-lg text-on-surface w-6 text-center font-light">{item.quantity}</span>
                <button 
                  onClick={() => updateQuantity(item.id, 1, item.quantity)}
                  className="w-8 h-8 flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <button onClick={() => deleteItem(item.id)} className="text-on-surface-variant hover:text-error transition-colors p-2">
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}

        {completedItems.length > 0 && (
          <div className="mt-12">
            <h3 className="text-xs text-on-surface-variant uppercase tracking-widest mb-4 pl-2">
              Completado ({completedItems.length})
            </h3>
            <div className="space-y-3">
              {completedItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-4 bg-surface-container rounded-2xl opacity-50 border border-outline-variant">
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <button 
                      onClick={() => toggleChecked(item.id, item.checked)}
                      className="w-6 h-6 rounded-md bg-primary/20 border border-primary/50 flex items-center justify-center transition-colors flex-shrink-0"
                    >
                      <Check className="w-4 h-4 text-primary" />
                    </button>
                    <div className="flex-1 min-w-0 pr-4">
                      <h3 className="text-lg font-light text-on-surface line-through line-clamp-2 leading-tight">{item.name}</h3>
                    </div>
                  </div>
                  <span className="text-sm font-light text-on-surface-variant whitespace-nowrap">x{item.quantity}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {isAdding ? (
        <form onSubmit={handleAddItem} className="absolute bottom-6 right-0 left-0 lg:left-auto lg:w-[400px] mx-4 lg:mx-0 p-6 bg-gradient-to-br from-neutral-800 to-neutral-900 rounded-3xl shadow-2xl border border-outline z-40 backdrop-blur-xl">
          <input
            autoFocus
            type="text"
            value={newItemName}
            onChange={(e) => setNewItemName(e.target.value)}
            placeholder="Añadir producto..."
            className="w-full bg-surface-container-lowest text-on-surface border border-outline rounded-2xl p-4 focus:outline-none focus:border-primary mb-4 text-lg font-light tracking-tight placeholder-on-surface-variant"
          />
          <div className="flex justify-end gap-3">
            <button type="button" onClick={() => setIsAdding(false)} className="px-5 py-3 text-xs uppercase tracking-widest text-on-surface-variant hover:bg-surface-container rounded-xl transition-colors">
              Cancelar
            </button>
            <button type="submit" disabled={!newItemName.trim()} className="px-5 py-3 text-xs uppercase font-bold tracking-widest bg-primary text-on-primary rounded-xl hover:bg-primary-container hover:text-on-primary-container disabled:opacity-50 transition-colors">
              Añadir
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
