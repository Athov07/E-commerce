import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Package, 
  MapPin, 
  ShoppingCart, 
  CreditCard, 
  UserCircle, 
  Boxes,
  LogOut 
} from 'lucide-react'; 

const AdminLayout = () => {
  const navigate = useNavigate();

  const menuItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'User Manager', path: '/admin/users', icon: <Users size={20} /> },
    { name: 'Product Manager', path: '/admin/products', icon: <Package size={20} /> },
    { name: 'Category Manager', path: '/admin/category', icon: <Package size={20} /> },
    { name: 'Address Manager', path: '/admin/addresses', icon: <MapPin size={20} /> },
    { name: 'Order Manager', path: '/admin/orders', icon: <ShoppingCart size={20} /> },
    { name: 'Payment Manager', path: '/admin/payments', icon: <CreditCard size={20} /> },
    { name: 'Profile Manager', path: '/admin/profile', icon: <UserCircle size={20} /> },
    { name: 'Inventory', path: '/admin/inventory', icon: <Boxes size={20} /> },
  ];

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <aside className="fixed left-0 top-0 h-screen w-64 bg-slate-900 text-slate-300 flex flex-col shadow-xl z-50">
        <div className="p-6 flex items-center gap-3 border-b border-slate-800">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold">
            A
          </div>
          <span className="text-xl font-bold text-white tracking-tight">AdminPanel</span>
        </div>

        <nav className="flex-grow p-4 space-y-1 mt-4 overflow-y-auto custom-scrollbar">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
                  isActive 
                    ? 'bg-primary text-white shadow-lg shadow-blue-900/20' 
                    : 'hover:bg-slate-800 hover:text-white'
                }`
              }
            >
              <span className="transition-transform group-hover:scale-110">
                {item.icon}
              </span>
              <span className="font-medium">{item.name}</span>
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
          >
            <LogOut size={20} />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      <div className="flex-grow ml-64 flex flex-col">
        <header className="fixed top-0 right-0 left-64 h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 z-40 shadow-sm">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span>Pages</span>
            <span>/</span>
            <span className="text-gray-900 font-medium capitalize">
              {window.location.pathname.split('/').pop().replace('-', ' ')}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold text-gray-900">System Admin</p>
              <p className="text-xs text-gray-500">admin@ecommerce.com</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-blue-400 border-2 border-white shadow-sm"></div>
          </div>
        </header>

        <main className="mt-16 p-8 min-h-[calc(100vh-64px)]">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;