import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Order } from '../../types';
import { Printer, Eye, MessageCircle, CheckCircle2, Clock, XCircle, Truck, Package } from 'lucide-react';

export const OrderManager: React.FC = () => {
  const { orders, updateOrderStatus, whatsappNumber } = useStore();
  const [selectedOrderForInvoice, setSelectedOrderForInvoice] = useState<Order | null>(null);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl font-bold text-white">Order Pipeline & WhatsApp Invoices</h2>
          <p className="text-xs text-gray-400">Total {orders.length} orders received via WhatsApp checkout</p>
        </div>
      </div>

      <div className="bg-gray-950 rounded-3xl border border-gray-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-300">
            <thead className="bg-gray-900 text-gray-400 uppercase tracking-wider font-semibold border-b border-gray-800">
              <tr>
                <th className="px-5 py-4">Order #</th>
                <th className="px-4 py-4">Customer Details</th>
                <th className="px-4 py-4">Delivery Address</th>
                <th className="px-4 py-4">Payment & Reference</th>
                <th className="px-4 py-4">Grand Total</th>
                <th className="px-4 py-4">Order Status</th>
                <th className="px-5 py-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-800">
              {orders.map(order => (
                <tr key={order.id} className="hover:bg-gray-900/50 transition-colors">
                  <td className="px-5 py-4 font-mono font-bold text-brand-pink">
                    {order.orderNumber}
                    <span className="block text-[10px] text-gray-500 font-sans font-normal mt-0.5">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <span className="font-semibold text-white block">{order.customerName}</span>
                    <span className="text-gray-400 block">{order.phone}</span>
                    {order.email && <span className="text-[11px] text-gray-500 block truncate max-w-[150px]">{order.email}</span>}
                  </td>
                  <td className="px-4 py-4 max-w-[200px]">
                    <span className="text-white block font-medium truncate" title={order.address}>{order.address}</span>
                    <span className="text-gray-400 text-[11px] block">{order.city}, {order.province}</span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="space-y-1">
                      <span className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                        order.paymentStatus === 'Paid (Safepay)' || order.paymentMethod.includes('Safepay')
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                          : order.paymentMethod.includes('25%')
                          ? 'bg-blue-950 text-blue-400 border border-blue-800'
                          : 'bg-amber-950 text-amber-400 border border-amber-800'
                      }`}>
                        {order.paymentStatus || (order.paymentMethod.includes('Safepay') ? 'Paid (Safepay)' : order.paymentMethod)}
                      </span>

                      {(order.paymentReference || order.safepayTracker) && (
                        <span className="block font-mono text-[10px] text-gray-400">
                          Ref: {order.paymentReference || order.safepayTracker}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-4 font-bold text-emerald-400">Rs {order.grandTotal.toLocaleString()}</td>
                  <td className="px-4 py-4">
                    <select
                      value={order.status}
                      onChange={(e) => updateOrderStatus(order.id, e.target.value as Order['status'])}
                      className={`px-2.5 py-1 rounded-xl text-xs font-bold border bg-gray-900 focus:outline-none ${
                        order.status === 'Delivered' ? 'border-emerald-500 text-emerald-400' :
                        order.status === 'Pending' ? 'border-amber-500 text-amber-400' :
                        order.status === 'Shipped' ? 'border-blue-500 text-blue-400' : 'border-rose-500 text-rose-400'
                      }`}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Confirmed">Confirmed</option>
                      <option value="Packed">Packed</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td className="px-5 py-4 text-right space-x-2">
                    <button
                      onClick={() => setSelectedOrderForInvoice(order)}
                      className="p-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-200 inline-flex items-center gap-1 text-xs font-semibold"
                      title="Print Official Invoice"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>Invoice</span>
                    </button>

                    <a
                      href={`https://wa.me/${order.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hello ${order.customerName}! Update regarding your order ${order.orderNumber} at Dua Trends...`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-xl bg-emerald-950 text-emerald-400 hover:bg-emerald-900 inline-flex items-center gap-1 text-xs font-semibold"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>Chat</span>
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Printable Invoice Modal */}
      {selectedOrderForInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm print:p-0 print:bg-white print:static">
          <div className="bg-white text-gray-900 rounded-3xl max-w-2xl w-full p-8 space-y-6 shadow-2xl print:shadow-none print:w-full print:rounded-none">
            
            {/* Header / Brand logo */}
            <div className="flex items-center justify-between border-b pb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gray-900 flex items-center justify-center text-brand-pink font-bold">
                  SW
                </div>
                <div>
                  <h2 className="font-serif text-2xl font-bold tracking-tight text-gray-900">StyleWing</h2>
                  <p className="text-xs text-gray-500 uppercase tracking-widest">Official Sales Invoice</p>
                </div>
              </div>

              <div className="text-right text-xs text-gray-500 space-y-0.5">
                <p className="font-mono font-bold text-base text-brand-pink">{selectedOrderForInvoice.orderNumber}</p>
                <p>Date: {new Date(selectedOrderForInvoice.createdAt).toLocaleDateString()}</p>
                <p>Payment: <span className="font-semibold text-gray-900">{selectedOrderForInvoice.paymentMethod}</span></p>
              </div>
            </div>

            {/* Customer Details */}
            <div className="grid grid-cols-2 gap-6 text-xs bg-gray-50 p-4 rounded-2xl border">
              <div>
                <h4 className="font-bold text-gray-700 uppercase tracking-wider mb-1">Customer Details:</h4>
                <p className="font-semibold text-gray-900 text-sm">{selectedOrderForInvoice.customerName}</p>
                <p>Phone: {selectedOrderForInvoice.phone}</p>
                <p>WhatsApp: {selectedOrderForInvoice.whatsapp}</p>
                {selectedOrderForInvoice.email && <p>Email: {selectedOrderForInvoice.email}</p>}
              </div>

              <div>
                <h4 className="font-bold text-gray-700 uppercase tracking-wider mb-1">Shipping Destination:</h4>
                <p className="text-gray-900">{selectedOrderForInvoice.address}</p>
                <p className="text-gray-900">{selectedOrderForInvoice.city}, {selectedOrderForInvoice.province}</p>
                <p className="text-gray-900">{selectedOrderForInvoice.country} {selectedOrderForInvoice.postalCode}</p>
                {selectedOrderForInvoice.specialNotes && (
                  <p className="italic text-brand-pink mt-1">Note: {selectedOrderForInvoice.specialNotes}</p>
                )}
              </div>
            </div>

            {/* Itemized Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-100 font-semibold text-gray-600 uppercase border-y">
                  <tr>
                    <th className="py-2.5 px-3">Item Description</th>
                    <th className="py-2.5 px-3">Variant</th>
                    <th className="py-2.5 px-3">Qty</th>
                    <th className="py-2.5 px-3">Unit Price</th>
                    <th className="py-2.5 px-3 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y text-gray-800">
                  {selectedOrderForInvoice.items.map((item, idx) => (
                    <tr key={idx}>
                      <td className="py-2.5 px-3 font-semibold">{item.title}</td>
                      <td className="py-2.5 px-3 text-gray-500">{item.color} / {item.size}</td>
                      <td className="py-2.5 px-3">{item.quantity}</td>
                      <td className="py-2.5 px-3">Rs {item.price.toLocaleString()}</td>
                      <td className="py-2.5 px-3 text-right font-bold">Rs {(item.price * item.quantity).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Total Breakdown */}
            <div className="flex justify-end pt-2 border-t">
              <div className="w-64 space-y-1.5 text-xs text-gray-600">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span className="font-semibold text-gray-900">Rs {selectedOrderForInvoice.subtotal.toLocaleString()}</span>
                </div>
                {selectedOrderForInvoice.discount > 0 && (
                  <div className="flex justify-between text-emerald-600">
                    <span>Discount:</span>
                    <span>- Rs {selectedOrderForInvoice.discount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Shipping Fee:</span>
                  <span>{selectedOrderForInvoice.shipping === 0 ? 'FREE' : `Rs ${selectedOrderForInvoice.shipping}`}</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-gray-900 border-t pt-2">
                  <span>Grand Total:</span>
                  <span className="text-brand-pink">Rs {selectedOrderForInvoice.grandTotal.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Print action bar */}
            <div className="flex items-center justify-between pt-4 border-t print:hidden">
              <button 
                onClick={() => setSelectedOrderForInvoice(null)}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-xl text-xs font-semibold"
              >
                Close Preview
              </button>

              <button 
                onClick={handlePrint}
                className="btn-pink-gradient px-6 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2"
              >
                <Printer className="w-4 h-4" />
                Print Official Invoice
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
