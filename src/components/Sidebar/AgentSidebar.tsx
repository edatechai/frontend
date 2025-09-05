import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Home, 
  TrendingUp, 
  Activity, 
  School, 
  Users, 
  Settings,
  LogOut,
  Calculator,
  BarChart3
} from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { apiSlice } from '@/features/api/apiSlice';

const AgentSidebar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userInfo = useSelector((state: any) => state.user.userInfo);

  const navigationItems = [
    {
      name: 'Dashboard',
      href: '/agent',
      icon: Home,
      description: 'Overview and quick actions'
    },
    {
      name: 'Earnings',
      href: '/agent/earnings',
      icon: TrendingUp,
      description: 'Track income and payments'
    },
    {
      name: 'Active Users',
      href: '/agent/analytics',
      icon: Activity,
      description: 'User engagement analytics'
    },
    {
      name: 'Schools',
      href: '/agent/schools',
      icon: School,
      description: 'Manage your schools'
    },
    {
      name: 'Calculator',
      href: '/agent/calculator',
      icon: Calculator,
      description: 'Earnings calculator'
    }
  ];

  const isActive = (href: string) => {
    return location.pathname === href;
  };

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-screen flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
            <Users className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="font-semibold text-gray-900">Agent Portal</h2>
            <p className="text-sm text-gray-600">{userInfo?.fullName}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <div className="space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`
                  flex items-center gap-3 px-3 py-3 rounded-lg transition-colors group
                  ${active 
                    ? 'bg-blue-50 text-blue-700 border-blue-200' 
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  }
                `}
              >
                <Icon className={`h-5 w-5 ${active ? 'text-blue-600' : 'text-gray-500 group-hover:text-gray-700'}`} />
                <div className="flex-1">
                  <div className={`font-medium ${active ? 'text-blue-700' : 'text-gray-900'}`}>
                    {item.name}
                  </div>
                  <div className={`text-xs ${active ? 'text-blue-600' : 'text-gray-500'}`}>
                    {item.description}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Quick Stats */}
      <div className="p-4 border-t border-gray-200">
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-2">
            <BarChart3 className="h-4 w-4 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">Quick Stats</span>
          </div>
          <div className="space-y-1 text-xs text-gray-600">
            <div className="flex justify-between">
              <span>Active Schools:</span>
              <span className="font-medium">-</span>
            </div>
            <div className="flex justify-between">
              <span>Active Users:</span>
              <span className="font-medium">-</span>
            </div>
            <div className="flex justify-between">
              <span>This Month:</span>
              <span className="font-medium text-green-600">₦-</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <div className="space-y-2">
          <Link
            to="/agent/settings"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <Settings className="h-4 w-4" />
            <span className="text-sm">Settings</span>
          </Link>
          <button
            onClick={() => {
              // Handle logout - same pattern as Header component
              localStorage.removeItem("Token");
              dispatch(apiSlice.util.resetApiState());
              navigate("/");
            }}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut className="h-4 w-4" />
            <span className="text-sm">Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AgentSidebar;
