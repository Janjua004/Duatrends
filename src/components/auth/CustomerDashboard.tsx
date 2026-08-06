import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { 
  User as UserIcon, 
  ShoppingBag, 
  MapPin, 
  LogOut, 
  Clock, 
  Package, 
  CheckCircle2, 
  Phone, 
  Mail, 
  Building, 
  Edit, 
  Save, 
  Sparkles,
  ChevronRight
} from 'lucide-react';

export const CustomerDashboard: React.FC = () => {
  const { currentUser, orders, logoutCustomer, updateCustomerProfile, showToast, setActiveView } = useStore();

  const [activeTab, setActiveTab] = useState<'profile' | 'orders'>('profile');
  const [isEditing, setIsEditing] = useState(false);

  // Profile Edit State
  const [name, setName] = useState(currentUser?.name || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [city, setCity] = useState(currentUser?.city || '');
  const [address, setAddress] = useState(currentUser?.address || '');

  if (!currentUser) return null;

  // Filter orders associated with this user
  const customerOrders = orders.filter(o => 
    o.email?.toLowerCase() === currentUser.email.toLowerCase() ||
    o.customerName.toLowerCase() === currentUser.name.toLowerCase()
  );

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateCustomerProfile({
      name: name.trim(),
      phone: phone.trim(),
      city: city.trim(),
      address: address.trim()
    });
    setIsEditing(false);
    showToast('Account details updated successfully!');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      
      {/* Account Hero Banner */}
      <div className="bg-gradient-to-r from-gray-900 via-gray-950 to-brand-pink rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-xl">
        <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-amber-300 font-bold text-2xl font-serif">
              {currentUser.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 bg-amber-400/20 text-amber-300 px-3 py-1 rounded-full text-[10px] uppercase font-bold tracking-widest mb-1 border border-amber-300/30">
                <Sparkles className="w-3 h-3" />
                <span>DUA TRENDS PRIVILEGE MEMBER</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-serif font-bold">{currentUser.name}</h1>
              <p className="text-xs text-gray-300 flex items-center gap-2 mt-1">
                <Mail className="w-3.5 h-3.5" /> {currentUser.email}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {(currentUser.role === 'admin' || currentUser.email.endsWith('@duatrends.com')) && (
              <button
                onClick={() => setActiveView('admin')}
                className="bg-brand-pink hover:bg-brand-pink-hover text-white px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all shadow-md"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                Open Admin Dashboard
              </button>
            )}

            <button
              onClick={() => { logoutCustomer(); showToast('Logged out'); setActiveView('home'); }}
              className="bg-white/10 hover:bg-rose-600/80 backdrop-blur-md border border-white/20 text-white px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </div>
      </div>

      {/* Main Tabs Navigation */}
      <div className="flex gap-4 border-b border-gray-200 dark:border-gray-800 pb-2 font-bold text-sm uppercase tracking-wider">
        <button
          onClick={() => setActiveTab('profile')}
          className={`pb-3 px-2 flex items-center gap-2 transition-colors relative ${
            activeTab === 'profile' 
              ? 'text-brand-pink font-bold border-b-2 border-brand-pink' 
              : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          <UserIcon className="w-4 h-4" />
          My Profile & Address
        </button>
        <button
          onClick={() => setActiveTab('orders')}
          className={`pb-3 px-2 flex items-center gap-2 transition-colors relative ${
            activeTab === 'orders' 
              ? 'text-brand-pink font-bold border-b-2 border-brand-pink' 
              : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          My Orders ({customerOrders.length})
        </button>
      </div>

      {/* TAB 1: MY PROFILE */}
      {activeTab === 'profile' && (
        <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex justify-between items-center border-b border-gray-100 dark:border-gray-800 pb-4">
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <UserIcon className="w-5 h-5 text-brand-pink" />
                Account Information
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                Manage your profile details and saved shipping address for fast 1-click checkout.
              </p>
            </div>

            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
              >
                <Edit className="w-3.5 h-3.5 text-brand-pink" />
                Edit Profile
              </button>
            ) : (
              <button
                onClick={() => setIsEditing(false)}
                className="text-xs text-gray-400 hover:text-gray-600 font-bold"
              >
                Cancel
              </button>
            )}
          </div>

          {!isEditing ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-2xl space-y-1">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Full Name</span>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">{currentUser.name}</p>
              </div>

              <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-2xl space-y-1">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Email Address</span>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">{currentUser.email}</p>
              </div>

              <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-2xl space-y-1">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Phone Number</span>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">{currentUser.phone || 'Not provided'}</p>
              </div>

              <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-2xl space-y-1">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">City</span>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">{currentUser.city || 'Not provided'}</p>
              </div>

              <div className="sm:col-span-2 bg-gray-50 dark:bg-gray-800/50 p-4 rounded-2xl space-y-1">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Saved Delivery Address</span>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">{currentUser.address || 'No saved address'}</p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-3.5 py-2.5 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-brand-pink"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-3.5 py-2.5 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-brand-pink"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-3.5 py-2.5 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-brand-pink"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">
                    Delivery Address
                  </label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-3.5 py-2.5 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-brand-pink"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="submit"
                  className="bg-brand-pink hover:bg-brand-pink-hover text-white px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 shadow-md shadow-brand-pink/20"
                >
                  <Save className="w-4 h-4" />
                  Save Changes
                </button>
              </div>
            </form>
          )}

        </div>
      )}

      {/* TAB 2: MY ORDERS */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          {customerOrders.length === 0 ? (
            <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-12 text-center space-y-4">
              <Package className="w-16 h-16 text-gray-300 dark:text-gray-700 mx-auto" />
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">No Orders Placed Yet</h3>
              <p className="text-xs text-gray-500 max-w-md mx-auto">
                Explore our unstitched lawn, formal chiffons, and winter collections to place your first luxury order!
              </p>
              <button
                onClick={() => setActiveView('shop')}
                className="bg-brand-pink text-white px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-wider inline-flex items-center gap-2 shadow-md shadow-brand-pink/20"
              >
                Browse Shop Collection
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            customerOrders.map((order) => (
              <div 
                key={order.id}
                className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-6 shadow-sm space-y-4"
              >
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gray-100 dark:border-gray-800 pb-3 gap-2">
                  <div>
                    <div className="flex items-center gap-3">
                      <span className="font-mono font-bold text-brand-pink text-base">{order.orderNumber}</span>
                      <span className={`text-[10px] font-bold uppercase px-3 py-1 rounded-full ${
                        order.status === 'Delivered' 
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' 
                          : order.status === 'Shipped' 
                          ? 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300' 
                          : 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                    <span className="text-[11px] text-gray-400 mt-1 block">Placed on {new Date(order.createdAt).toLocaleDateString()}</span>
                  </div>

                  <div className="text-right">
                    <span className="text-xs text-gray-400 block uppercase tracking-wider font-bold">Total Amount</span>
                    <span className="font-serif text-lg font-bold text-gray-900 dark:text-white">
                      Rs. {order.grandTotal.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Items List */}
                <div className="divide-y divide-gray-50 dark:divide-gray-800/50">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="py-2.5 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <img 
                          src={item.image} 
                          alt={item.title}
                          className="w-12 h-12 rounded-lg object-cover bg-gray-100 dark:bg-gray-800"
                        />
                        <div>
                          <h4 className="text-xs font-bold text-gray-900 dark:text-white">{item.title}</h4>
                          <span className="text-[11px] text-gray-400">Qty: {item.quantity} | Size: {item.size}</span>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-gray-900 dark:text-white">
                        Rs. {(item.price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      )}

    </div>
  );
};
