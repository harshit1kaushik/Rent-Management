import { LayoutDashboard, Building2, Users2, ReceiptText } from 'lucide-react';

export type NavTab = 'dashboard' | 'units' | 'tenants' | 'operations';

interface BottomNavProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  urgentCount?: number;
}

export function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  const tabs = [
    {
      id: 'dashboard' as NavTab,
      label: 'Dashboard',
      icon: LayoutDashboard,
    },
    {
      id: 'units' as NavTab,
      label: 'Units',
      icon: Building2,
    },
    {
      id: 'tenants' as NavTab,
      label: 'Tenants',
      icon: Users2,
    },
    {
      id: 'operations' as NavTab,
      label: 'Operations',
      icon: ReceiptText,
    },
  ];

  return (
    <nav
      className="sticky bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-100 px-3 py-2 z-40"
      role="navigation"
      aria-label="Bottom Navigation"
    >
      <div className="flex items-center justify-around max-w-md mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all cursor-pointer ${
                isActive
                  ? 'text-blue-600 font-bold scale-105'
                  : 'text-slate-500 hover:text-slate-800 font-medium'
              }`}
            >
              <div className="relative">
                <Icon
                  className={`w-5 h-5 transition-transform ${
                    isActive ? 'stroke-[2.4px] text-blue-600' : 'stroke-[1.8px]'
                  }`}
                />
              </div>
              <span className="text-[11px] mt-1 tracking-tight leading-tight">
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
