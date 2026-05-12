import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import { FiUsers, FiBookOpen, FiLogOut, FiPlus } from 'react-icons/fi';

const AdminDashboard = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'users' | 'recipes'>('users');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('adminToken');
        const res = await api.get('/admin/users', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUsers(res.data.data);
      } catch (error) {
        console.error("Failed to fetch users");
      }
    };
    if (activeTab === 'users') {
      fetchUsers();
    }
  }, [activeTab]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin/login');
  };

  const handleBlockToggle = async (userId: string) => {
    try {
      const token = localStorage.getItem('adminToken');
      await api.put(`/admin/users/${userId}/block`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Refresh local state roughly
      setUsers(users.map(u => u._id === userId ? { ...u, isBlocked: !u.isBlocked } : u));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-gray-800 p-6 flex flex-col">
        <h1 className="text-2xl font-bold text-orange-500 mb-8">Admin Panel</h1>
        
        <nav className="flex-1 space-y-2">
          <button 
            onClick={() => setActiveTab('users')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${activeTab === 'users' ? 'bg-orange-500/10 text-orange-500' : 'text-gray-400 hover:bg-gray-700/50'}`}
          >
            <FiUsers size={20} />
            <span className="font-medium">User Management</span>
          </button>
          <button 
            onClick={() => setActiveTab('recipes')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${activeTab === 'recipes' ? 'bg-orange-500/10 text-orange-500' : 'text-gray-400 hover:bg-gray-700/50'}`}
          >
            <FiBookOpen size={20} />
            <span className="font-medium">Recipe Management</span>
          </button>
        </nav>

        <button 
          onClick={handleLogout}
          className="mt-auto w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-xl transition-colors font-medium"
        >
          <FiLogOut size={20} />
          Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <div className="max-w-6xl mx-auto">
          {activeTab === 'users' && (
            <div className="bg-gray-800 p-6 rounded-2xl shadow-xl animate-fade-in">
              <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <FiUsers className="text-orange-500" /> All Users
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-gray-700 text-gray-400 text-sm">
                      <th className="py-3 px-4 font-medium">Username</th>
                      <th className="py-3 px-4 font-medium">Email</th>
                      <th className="py-3 px-4 font-medium">Status</th>
                      <th className="py-3 px-4 font-medium">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(user => (
                      <tr key={user._id} className="border-b border-gray-700/50 hover:bg-gray-750 transition-colors">
                        <td className="py-4 px-4 font-medium">{user.username}</td>
                        <td className="py-4 px-4 text-gray-300">{user.email}</td>
                        <td className="py-4 px-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${user.isBlocked ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'}`}>
                            {user.isBlocked ? 'Blocked' : 'Active'}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <button 
                            onClick={() => handleBlockToggle(user._id)}
                            className={`text-sm font-medium hover:underline ${user.isBlocked ? 'text-green-400 hover:text-green-300' : 'text-red-400 hover:text-red-300'}`}
                          >
                            {user.isBlocked ? 'Unblock User' : 'Block User'}
                          </button>
                        </td>
                      </tr>
                    ))}
                    {users.length === 0 && (
                      <tr>
                        <td colSpan={4} className="py-8 text-center text-gray-500">No users found.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'recipes' && (
            <div className="bg-gray-800 p-6 rounded-2xl shadow-xl animate-fade-in">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <FiBookOpen className="text-orange-500" /> Explore Page Recipes
                </h2>
                <Link to="/admin/add-recipe" className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-xl font-medium transition-colors shadow-lg shadow-orange-500/20">
                  <FiPlus /> Add New Recipe
                </Link>
              </div>
              
              <div className="text-center py-12 border-2 border-dashed border-gray-700 rounded-xl">
                <FiBookOpen className="mx-auto text-4xl text-gray-600 mb-4" />
                <h3 className="text-lg font-medium text-gray-300 mb-2">Recipe Management</h3>
                <p className="text-gray-500 max-w-md mx-auto mb-6">
                  Click "Add New Recipe" to upload high-quality, structured recipes that will appear on the public Explore page.
                </p>
                <Link to="/admin/add-recipe" className="inline-flex items-center gap-2 bg-gray-700 hover:bg-gray-600 text-white px-6 py-2.5 rounded-xl font-medium transition-colors">
                  <FiPlus /> Create First Recipe
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
