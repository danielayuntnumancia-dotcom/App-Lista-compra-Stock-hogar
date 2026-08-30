import React, { useState, useEffect } from 'react';
import { collection, query, onSnapshot, orderBy, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import { PurchaseReceipt } from '../lib/types';
import { Receipt, Calendar, Trash2 } from 'lucide-react';

export default function History() {
  const { user } = useAuth();
  const [receipts, setReceipts] = useState<PurchaseReceipt[]>([]);

  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, `users/${user.uid}/history`), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetched = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as PurchaseReceipt));
      setReceipts(fetched);
    });
    return unsubscribe;
  }, [user]);

  const deleteReceipt = async (id: string) => {
    if (!user) return;
    try {
      await deleteDoc(doc(db, `users/${user.uid}/history/${id}`));
    } catch (error) {
      console.error('Error deleting receipt:', error);
    }
  };

  return (
    <div className="p-6 lg:p-12 max-w-4xl mx-auto w-full h-full flex flex-col">
      <div className="mb-8">
        <h2 className="text-3xl lg:text-4xl font-light tracking-tight text-on-surface">Historial de <span className="font-bold">Compras</span></h2>
        <p className="text-sm opacity-50 uppercase tracking-widest mt-2">Revisa tus compras anteriores</p>
      </div>

      <div className="flex-1 overflow-y-auto hide-scrollbar space-y-4 pb-24">
        {receipts.length === 0 ? (
          <div className="text-center py-20">
            <Receipt className="w-16 h-16 text-white/20 mx-auto mb-6" />
            <h3 className="text-xl font-bold tracking-tight text-on-surface">No hay historial</h3>
            <p className="text-sm opacity-50 uppercase tracking-widest mt-2">Tus compras archivadas aparecerán aquí.</p>
          </div>
        ) : (
          receipts.map(receipt => (
            <div key={receipt.id} className="bg-surface-container rounded-3xl p-6 border border-outline flex items-center justify-between hover:bg-surface-container-high transition-colors">
              <div className="flex items-center gap-6">
                <div className="w-14 h-14 rounded-2xl bg-primary/20 flex items-center justify-center text-primary">
                  <Receipt className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold tracking-tight text-on-surface">{receipt.storeName}</h3>
                  <div className="flex items-center gap-3 text-on-surface-variant mt-1">
                    <Calendar className="w-4 h-4" />
                    <span className="text-xs uppercase tracking-widest">{new Date(receipt.date).toLocaleDateString()}</span>
                    <span className="text-xs">•</span>
                    <span className="text-xs uppercase tracking-widest">{receipt.totalItems} items</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <span className="text-3xl font-light text-on-surface tracking-tighter">${receipt.totalPrice.toFixed(2)}</span>
                <button onClick={() => deleteReceipt(receipt.id)} className="p-3 text-on-surface-variant hover:text-error transition-colors rounded-xl hover:bg-surface-container">
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
