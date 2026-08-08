import React, { useState, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import { User } from '../../types';
import { fetchRegisteredUsersFromCloud, deleteUserFromCloud, subscribeToUsersRealtime } from '../../services/cloudStore';
import { Users, Trash2, Mail, Phone, MapPin, Calendar, RefreshCw, UserX } from 'lucide-react';

export const UserManager: React.FC = () => {
  const { showToast } = useStore();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [searchFilter, setSearchFilter] = useState<string>('');

  const loadUsers = async () => {
    setLoading(true);
    const cloudUsers = await fetchRegisteredUsersFromCloud();
    if (cloudUsers) {
      setUsers(cloudUsers);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadUsers();

    // Subscribe to realtime updates for users
    const unsubscribe = subscribeToUsersRealtime((latestUsers) => {
      if (latestUsers) {
        setUsers(latestUsers);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const handleDeleteUser = async (userId: string, userName: string) => {
    if (!window.confirm(`Are you sure you want to delete customer account "${userName}" (${userId}) from the cloud database?`)) {
      return;
    }

    setDeletingId(userId);
    const success = await deleteUserFromCloud(userId);
    if (success) {
      setUsers(prev => prev.filter(u => u.id !== userId));
      showToast(`User "${userName}" deleted successfully!`);
    } else {
      showToast('Failed to delete user account. Check cloud permissions.');
    }
    setDeletingId(null);
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
    u.email.toLowerCase().includes(searchFilter.toLowerCase()) ||
    (u.phone && u.phone.includes(searchFilter)) ||
    (u.city && u.city.toLowerCase().includes(searchFilter.toLowerCase()))
  );

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-gray-950 p-6 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-brand-pink" />
            <h2 className="font-serif text-xl font-bold text-gray-900 dark:text-white">
              Registered Users & Customer Accounts
            </h2>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Real-time customer registration database synced across all devices.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={loadUsers}
            disabled={loading}
            className="px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-xs font-semibold text-gray-700 dark:text-gray-200 transition-colors flex items-center gap-1.5"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh Users</span>
          </button>

          <div className="px-4 py-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-brand-pink font-bold text-xs">
            Total Users: {users.length}
          </div>
        </div>
      </div>

      {/* Search Input */}
      <div className="bg-white dark:bg-gray-950 p-4 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
        <input 
          type="text" 
          placeholder="Search by customer name, email, phone or city..." 
          value={searchFilter}
          onChange={(e) => setSearchFilter(e.target.value)}
          className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 px-4 py-2.5 rounded-xl text-xs text-gray-900 dark:text-white focus:outline-none focus:border-brand-pink"
        />
      </div>

      {/* Users Table */}
      <div className="bg-white dark:bg-gray-950 rounded-3xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm">
        {loading && users.length === 0 ? (
          <div className="p-12 text-center text-xs text-gray-400 space-y-2">
            <RefreshCw className="w-6 h-6 animate-spin mx-auto text-brand-pink" />
            <p>Fetching registered accounts directly from Supabase...</p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="p-12 text-center text-xs text-gray-400 space-y-2">
            <UserX className="w-8 h-8 mx-auto text-gray-400" />
            <p className="font-semibold text-gray-700 dark:text-gray-300">No registered users found.</p>
            <p className="text-[11px]">When customers register, their accounts will appear here automatically.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 text-gray-500 font-bold uppercase tracking-wider">
                <tr>
                  <th className="p-4">Customer</th>
                  <th className="p-4">Contact & Location</th>
                  <th className="p-4">Role</th>
                  <th className="p-4">Registered Date</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800/60 text-gray-700 dark:text-gray-300 font-medium">
                {filteredUsers.map(user => (
                  <tr key={user.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-900/50 transition-colors">
                    
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-brand-pink/10 text-brand-pink font-bold flex items-center justify-center text-sm border border-brand-pink/20">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 dark:text-white">{user.name}</p>
                          <div className="flex items-center gap-1 text-[11px] text-gray-400 mt-0.5">
                            <Mail className="w-3 h-3 text-gray-400" />
                            <span>{user.email}</span>
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="p-4 space-y-1">
                      <div className="flex items-center gap-1.5 text-xs text-gray-900 dark:text-white font-semibold">
                        <Phone className="w-3 h-3 text-emerald-500" />
                        <span>{user.phone || 'N/A'}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-[11px] text-gray-400">
                        <MapPin className="w-3 h-3 text-rose-400" />
                        <span>{user.city ? `${user.city}, ${user.province || 'Pakistan'}` : 'Location N/A'}</span>
                      </div>
                    </td>

                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        user.role === 'admin' 
                          ? 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300 border border-purple-300' 
                          : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300'
                      }`}>
                        {user.role}
                      </span>
                    </td>

                    <td className="p-4">
                      <div className="flex items-center gap-1.5 text-gray-500">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{new Date(user.createdAt || Date.now()).toLocaleDateString()}</span>
                      </div>
                    </td>

                    <td className="p-4 text-right">
                      <button
                        onClick={() => handleDeleteUser(user.id, user.name)}
                        disabled={deletingId === user.id}
                        className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/60 dark:hover:bg-rose-900 text-rose-600 dark:text-rose-300 font-semibold text-xs transition-colors flex items-center gap-1.5 ml-auto border border-rose-200 dark:border-rose-800"
                        title="Delete User Account from Supabase"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>{deletingId === user.id ? 'Deleting...' : 'Delete Account'}</span>
                      </button>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
