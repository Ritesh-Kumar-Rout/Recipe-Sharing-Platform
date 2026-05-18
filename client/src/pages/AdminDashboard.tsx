import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import { FiHome, FiUsers, FiBookOpen, FiLogOut, FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi';
import toast, { Toaster } from 'react-hot-toast';
import { Avatar } from '../components/ui/Avatar';

const AdminDashboard = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [recipes, setRecipes] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'home' | 'users' | 'recipes'>('home');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin/login');
      return;
    }
    
    fetchUsers();
    fetchRecipes();
  }, [navigate]);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('adminToken');
      const res = await api.get('/admin/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(res.data.data);
    } catch (error) {
      toast.error("Failed to fetch users");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchRecipes = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('adminToken');
      const res = await api.get('/recipes', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRecipes(res.data.data);
    } catch (error) {
      toast.error("Failed to fetch recipes");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin/login');
  };

  const handleBlockToggle = async (userId: string) => {
    try {
      const token = localStorage.getItem('adminToken');
      const res = await api.put(`/admin/users/${userId}/block`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        setUsers(users.map(u => u._id === userId ? { ...u, isBlocked: !u.isBlocked } : u));
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error("Action failed");
    }
  };

  const handleDeleteRecipe = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this recipe?')) return;
    try {
      const token = localStorage.getItem('adminToken');
      const res = await api.delete(`/recipes/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        setRecipes(recipes.filter(r => r._id !== id));
        toast.success('Recipe deleted successfully');
      }
    } catch (error) {
      toast.error("Failed to delete recipe");
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col md:flex-row">
      <Toaster position="top-right" />
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-gray-900 p-6 flex flex-col border-r border-gray-800">
        <div className="flex items-center gap-3 mb-10 px-2">
          <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center font-bold text-xl">Y</div>
          <h1 className="text-xl font-bold tracking-tight">YumCircle <span className="text-xs block text-gray-500">ADMIN</span></h1>
        </div>
        
        <nav className="flex-1 space-y-2">
          <button 
            onClick={() => setActiveTab('home')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'home' ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}
          >
            <FiHome size={20} />
            <span className="font-medium">Home</span>
          </button>
          <button 
            onClick={() => setActiveTab('users')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'users' ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}
          >
            <FiUsers size={20} />
            <span className="font-medium">Users</span>
          </button>
          <button 
            onClick={() => setActiveTab('recipes')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'recipes' ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}
          >
            <FiBookOpen size={20} />
            <span className="font-medium">Recipes</span>
          </button>
        </nav>

        <button 
          onClick={handleLogout}
          className="mt-auto w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-xl transition-colors font-medium"
        >
          <FiLogOut size={20} />
          Sign Out
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          {activeTab === 'home' && (
            <div className="animate-fade-in space-y-6">
              <h2 className="text-3xl font-bold text-white mb-8">Dashboard Overview</h2>
              
              {/* Metrics Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-900 border border-gray-800 rounded-3xl p-6 shadow-xl flex items-center gap-6">
                  <div className="w-16 h-16 bg-blue-500/10 text-blue-500 rounded-2xl flex items-center justify-center">
                    <FiUsers size={32} />
                  </div>
                  <div>
                    <div className="text-4xl font-bold text-white mb-1">{users.length}</div>
                    <div className="text-gray-400 font-medium">Total Users</div>
                  </div>
                </div>
                
                <div className="bg-gray-900 border border-gray-800 rounded-3xl p-6 shadow-xl flex items-center gap-6">
                  <div className="w-16 h-16 bg-orange-500/10 text-orange-500 rounded-2xl flex items-center justify-center">
                    <FiBookOpen size={32} />
                  </div>
                  <div>
                    <div className="text-4xl font-bold text-white mb-1">{recipes.length}</div>
                    <div className="text-gray-400 font-medium">Total Recipes</div>
                  </div>
                </div>
              </div>

              {/* Latest Recipes */}
              <div className="bg-gray-900 border border-gray-800 rounded-3xl overflow-hidden shadow-2xl mt-8">
                <div className="p-6 border-b border-gray-800 bg-gray-900/50">
                  <h3 className="text-xl font-bold flex items-center gap-3">
                    <FiBookOpen className="text-orange-500" /> Latest Recipes
                  </h3>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {recipes.slice(0, 6).map(recipe => (
                      <div key={recipe._id} className="bg-gray-800/30 rounded-2xl p-4 border border-gray-700/50 hover:border-gray-600 transition-colors">
                        <img src={recipe.image} alt={recipe.title} className="w-full h-40 object-cover rounded-xl mb-4" />
                        <h4 className="font-bold text-white truncate mb-1">{recipe.title}</h4>
                        <div className="text-xs text-gray-400 flex gap-2">
                          <span>{recipe.categories?.[0] || 'Uncategorized'}</span>
                          <span>•</span>
                          <span>{recipe.cookTime || '0 mins'}</span>
                        </div>
                      </div>
                    ))}
                    {recipes.length === 0 && !isLoading && (
                      <div className="col-span-full py-10 text-center text-gray-500">No recipes yet.</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div className="bg-gray-900 border border-gray-800 rounded-3xl overflow-hidden shadow-2xl animate-fade-in">
              <div className="p-6 border-b border-gray-800 flex justify-between items-center bg-gray-900/50">
                <h2 className="text-xl font-bold flex items-center gap-3">
                  <FiUsers className="text-orange-500" /> Community Members
                </h2>
                <div className="text-sm text-gray-500">{users.length} total users</div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-gray-800/30 text-gray-400 text-xs uppercase tracking-widest">
                      <th className="py-4 px-6 font-bold">User Info</th>
                      <th className="py-4 px-6 font-bold text-center">Status</th>
                      <th className="py-4 px-6 font-bold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800">
                    {users.map(user => (
                      <tr key={user._id} className="hover:bg-gray-800/20 transition-colors">
                        <td className="py-5 px-6">
                          <div className="flex items-center gap-3">
                            <Avatar src={user.profileImage} name={user.username} size="sm" className="border border-gray-700" />
                            <div>
                              <div className="font-bold text-white">{user.username}</div>
                              <div className="text-xs text-gray-500">{user.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-5 px-6 text-center">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-tighter ${user.isBlocked ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 'bg-green-500/10 text-green-500 border border-green-500/20'}`}>
                            {user.isBlocked ? 'Blocked' : 'Active'}
                          </span>
                        </td>
                        <td className="py-5 px-6 text-right">
                          <button 
                            onClick={() => handleBlockToggle(user._id)}
                            className={`text-sm font-bold px-4 py-2 rounded-lg transition-all ${user.isBlocked ? 'bg-green-500/10 text-green-500 hover:bg-green-500 hover:text-white' : 'bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white'}`}
                          >
                            {user.isBlocked ? 'Restore' : 'Suspend'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'recipes' && (
            <div className="bg-gray-900 border border-gray-800 rounded-3xl overflow-hidden shadow-2xl animate-fade-in">
              <div className="p-6 border-b border-gray-800 flex justify-between items-center bg-gray-900/50">
                <h2 className="text-xl font-bold flex items-center gap-3">
                  <FiBookOpen className="text-orange-500" /> Recipe Inventory
                </h2>
                <Link to="/admin/add-recipe" className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-orange-500/30 active:scale-95">
                  <FiPlus /> New Recipe
                </Link>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-gray-800/30 text-gray-400 text-xs uppercase tracking-widest">
                      <th className="py-4 px-6 font-bold">Recipe Details</th>
                      <th className="py-4 px-6 font-bold">Category</th>
                      <th className="py-4 px-6 font-bold text-center">Time</th>
                      <th className="py-4 px-6 font-bold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800">
                    {recipes.map(recipe => (
                      <tr key={recipe._id} className="hover:bg-gray-800/20 transition-colors">
                        <td className="py-5 px-6">
                          <div className="flex items-center gap-4">
                            <img src={recipe.image} alt="" className="w-12 h-12 rounded-xl object-cover border border-gray-700 shadow-sm" />
                            <div className="font-bold text-white max-w-[200px] truncate">{recipe.title}</div>
                          </div>
                        </td>
                        <td className="py-5 px-6">
                          <div className="flex flex-wrap gap-1">
                            {recipe.categories?.slice(0, 2).map((c: string) => (
                              <span key={c} className="text-[10px] bg-gray-800 text-gray-400 px-2 py-0.5 rounded-md">{c}</span>
                            ))}
                          </div>
                        </td>
                        <td className="py-5 px-6 text-center text-sm text-gray-400 font-medium">
                          {recipe.cookTime}
                        </td>
                        <td className="py-5 px-6 text-right space-x-2">
                          <button className="text-gray-400 hover:text-white p-2 transition-colors"><FiEdit2 size={18} /></button>
                          <button onClick={() => handleDeleteRecipe(recipe._id)} className="text-red-500/70 hover:text-red-500 p-2 transition-colors"><FiTrash2 size={18} /></button>
                        </td>
                      </tr>
                    ))}
                    {recipes.length === 0 && !isLoading && (
                      <tr>
                        <td colSpan={4} className="py-20 text-center text-gray-500 italic">No recipes in database. Start by adding one!</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
