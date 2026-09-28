import { useState, useMemo } from 'react';
import { Header } from './components/Header';
import { BottomNav, NavTab } from './components/BottomNav';
import { DashboardScreen } from './components/screens/DashboardScreen';
import { UnitsScreen } from './components/screens/UnitsScreen';
import { TenantsScreen } from './components/screens/TenantsScreen';
import { OperationsScreen } from './components/screens/OperationsScreen';
import { PaymentModal } from './components/modals/PaymentModal';
import { NoticeModal } from './components/modals/NoticeModal';
import { TicketModal } from './components/modals/TicketModal';
import { PayoutModal } from './components/modals/PayoutModal';
import { AddTenantModal } from './components/modals/AddTenantModal';
import { AddUnitModal } from './components/modals/AddUnitModal';
import { DocumentModal } from './components/modals/DocumentModal';
import { NotificationsDrawer } from './components/modals/NotificationsDrawer';
import {
  INITIAL_TENANTS,
  INITIAL_UNITS,
  INITIAL_ACTIVITIES,
  INITIAL_TICKETS,
} from './data/mockData';
import { Tenant, Unit, ActivityItem, MaintenanceTicket, TenantDocument } from './types';
import { Smartphone, LayoutGrid, Maximize2, Sparkles, CheckCircle2 } from 'lucide-react';

export default function App() {
  // Global interactive states
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');
  const [viewMode, setViewMode] = useState<'mobile' | 'showcase' | 'expanded'>('mobile');
  const [tenants, setTenants] = useState<Tenant[]>(INITIAL_TENANTS);
  const [units, setUnits] = useState<Unit[]>(INITIAL_UNITS);
  const [activities, setActivities] = useState<ActivityItem[]>(INITIAL_ACTIVITIES);
  const [tickets, setTickets] = useState<MaintenanceTicket[]>(INITIAL_TICKETS);
  const [selectedTenantId, setSelectedTenantId] = useState<string>('t-8821'); // Marcus Vance default

  // Toast feedback state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // Modals state
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentPreselectedUnitId, setPaymentPreselectedUnitId] = useState<string | undefined>();
  const [paymentPreselectedAmount, setPaymentPreselectedAmount] = useState<number | undefined>();

  const [isNoticeModalOpen, setIsNoticeModalOpen] = useState(false);
  const [noticeTenantName, setNoticeTenantName] = useState('Marcus Vance');
  const [noticeUnitNumber, setNoticeUnitNumber] = useState('402');
  const [noticeAmount, setNoticeAmount] = useState(1850);
  const [noticeDaysLate, setNoticeDaysLate] = useState(6);

  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);
  const [activeTicketId, setActiveTicketId] = useState<string | undefined>();

  const [isPayoutModalOpen, setIsPayoutModalOpen] = useState(false);
  const [isAddTenantModalOpen, setIsAddTenantModalOpen] = useState(false);
  const [isAddUnitModalOpen, setIsAddUnitModalOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  const [selectedDocument, setSelectedDocument] = useState<TenantDocument | null>(null);
  const [documentTenantName, setDocumentTenantName] = useState('Marcus Vance');

  // Interactive Actions
  const handleConfirmPayment = (unitId: string, amount: number, method: string) => {
    const unit = units.find((u) => u.id === unitId);
    if (!unit) return;

    // Update unit
    setUnits((prev) =>
      prev.map((u) => {
        if (u.id === unitId) {
          return {
            ...u,
            rentStatus: 'Rent Paid',
            overdueAmount: undefined,
          };
        }
        return u;
      })
    );

    // Update tenant ledger
    setTenants((prev) =>
      prev.map((t) => {
        if (t.unitId === unitId) {
          const updatedHistory = t.paymentHistory.map((p) => {
            if (p.status === 'OVERDUE' || p.status === 'PENDING') {
              return {
                ...p,
                status: 'PAID' as const,
                balance: 0,
                paidDate: 'Just now',
                receiptNumber: `INV-${Math.floor(1000 + Math.random() * 9000)}`,
              };
            }
            return p;
          });
          return {
            ...t,
            daysLate: 0,
            paymentHistory: updatedHistory,
          };
        }
        return t;
      })
    );

    // Append to activities
    const newAct: ActivityItem = {
      id: `act-${Date.now()}`,
      tenantName: unit.tenantName || 'Resident',
      flat: `Unit ${unit.flatNumber}`,
      type: 'payment',
      title: `${unit.tenantName || 'Resident'} Unit ${unit.flatNumber}`,
      detail: `${method} • Today ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
      timestamp: 'Just now',
      amount: `+$${amount.toLocaleString()}.00`,
      status: 'Paid',
      avatar: unit.tenantAvatar,
    };
    setActivities((prev) => [newAct, ...prev]);

    showToast(`Payment of $${amount.toLocaleString()} posted to Unit ${unit.flatNumber}!`);
  };

  const handleWaiveLateFee = (tenantId: string) => {
    setTenants((prev) =>
      prev.map((t) => {
        if (t.id === tenantId) {
          return {
            ...t,
            latePenalty: 0,
          };
        }
        return t;
      })
    );
    showToast('Late fee of $50 waived for Marcus Vance.');
  };

  const handleAddLandlordNote = (tenantId: string, content: string, tags: string[]) => {
    setTenants((prev) =>
      prev.map((t) => {
        if (t.id === tenantId) {
          const newNote = {
            id: `note-${Date.now()}`,
            author: 'Sarah Jenkins',
            authorRole: 'Property Mgr',
            date: 'Today',
            content,
            tags,
          };
          return {
            ...t,
            notes: [newNote, ...t.notes],
          };
        }
        return t;
      })
    );
    showToast('Private landlord note recorded.');
  };

  const handleAddTenant = (data: {
    name: string;
    unitId: string;
    role: string;
    phone: string;
    email: string;
    monthlyRent: number;
    depositAmount: number;
  }) => {
    const newTenant: Tenant = {
      id: `t-${Date.now()}`,
      unitId: data.unitId,
      name: data.name,
      code: `TN-${Math.floor(1000 + Math.random() * 9000)}`,
      role: data.role,
      location: 'Austin, TX',
      phone: data.phone,
      email: data.email,
      emergencyContact: {
        name: 'Family Contact',
        relationship: 'Kin',
        phone: '+1 555-019-2831',
      },
      occupancyCount: 1,
      occupancyDescription: '1 Occupant',
      leaseStart: 'Nov 01, 2024',
      leaseEnd: 'Oct 31, 2025',
      tier: 'Standard Lease',
      status: 'active',
      initials: data.name
        .split(' ')
        .map((p) => p[0])
        .join('')
        .slice(0, 2)
        .toUpperCase(),
      monthlyRent: data.monthlyRent,
      latePenalty: 0,
      depositAmount: data.depositAmount,
      escrowProtected: true,
      fdicInsured: true,
      notes: [],
      documents: [
        {
          id: `doc-${Date.now()}`,
          title: 'Digital Lease Agreement',
          subtitle: 'Valid till Oct 31, 2025',
          isValidated: true,
          type: 'lease',
        },
      ],
      paymentHistory: [
        {
          id: `p-${Date.now()}`,
          monthYear: 'Nov 2024',
          status: 'PAID',
          amount: data.monthlyRent,
          balance: 0,
          dueDate: 'Nov 01, 2024',
          paidDate: 'Today',
          receiptNumber: `INV-${Math.floor(1000 + Math.random() * 9000)}`,
        },
      ],
    };

    setTenants((prev) => [newTenant, ...prev]);

    // Update unit
    setUnits((prev) =>
      prev.map((u) => {
        if (u.id === data.unitId) {
          return {
            ...u,
            status: 'Occupied',
            rentStatus: 'Rent Paid',
            tenantId: newTenant.id,
            tenantName: newTenant.name,
            tenantCode: newTenant.code,
            moveInDate: 'Nov 01, 2024',
          };
        }
        return u;
      })
    );

    setSelectedTenantId(newTenant.id);
    showToast(`Tenant ${data.name} onboarded successfully!`);
  };

  const handleAddUnit = (unitData: Partial<Unit>) => {
    const newUnit: Unit = {
      id: `u-${Date.now()}`,
      flatNumber: unitData.flatNumber || '601',
      buildingName: unitData.buildingName || 'Highland Towers',
      shortBuilding: unitData.shortBuilding || 'Highland Tow...',
      floor: unitData.floor || '6th Floor',
      bhk: unitData.bhk || '2 BHK',
      sqft: unitData.sqft || 900,
      status: 'Vacant',
      rentStatus: 'Ready for Move-in',
      monthlyRent: unitData.monthlyRent || 1800,
      depositAmount: (unitData.monthlyRent || 1800) * 2,
      ownerInfo: 'Sarah M. (90%)',
      features: ['Balcony', 'City View'],
    };

    setUnits((prev) => [newUnit, ...prev]);
    showToast(`Flat ${newUnit.flatNumber} added to portfolio!`);
  };

  const handleAddTicket = (ticketData: Partial<MaintenanceTicket>) => {
    const newTicket: MaintenanceTicket = {
      id: `tk-${Date.now()}`,
      flatNumber: ticketData.flatNumber || '101',
      buildingName: ticketData.buildingName || 'Highland Towers',
      title: ticketData.title || 'General Maintenance',
      tenantName: ticketData.tenantName || 'Resident',
      severity: ticketData.severity || 'NORMAL',
      status: ticketData.status || 'Vendor Dispatched',
      vendorName: ticketData.vendorName || "Joe's Emergency Rooter",
      eta: ticketData.eta || '30 mins',
      reportedAt: 'Just now',
    };
    setTickets((prev) => [newTicket, ...prev]);
    showToast(`Maintenance ticket logged for Unit ${newTicket.flatNumber}!`);
  };

  const handleUpdateTicketStatus = (ticketId: string, status: MaintenanceTicket['status']) => {
    setTickets((prev) =>
      prev.map((t) => (t.id === ticketId ? { ...t, status } : t))
    );
    showToast('Work order status updated to ' + status);
  };

  const activeTicket = useMemo(() => {
    return tickets.find((t) => t.id === activeTicketId);
  }, [tickets, activeTicketId]);

  // Screen Title helper
  const screenTitle = useMemo(() => {
    switch (activeTab) {
      case 'dashboard':
        return 'DASHBOARD';
      case 'units':
        return 'UNITS';
      case 'tenants':
        return 'TENANTS';
      case 'operations':
        return 'OPERATIONS';
    }
  }, [activeTab]);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-900 flex flex-col items-center justify-start antialiased font-sans">
      {/* Top Universal Control Bar */}
      <nav className="w-full bg-[#0a0f1d] border-b border-slate-800 text-white px-4 py-2.5 z-40">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          {/* Brand & Tagline */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="font-extrabold text-sm tracking-tight text-white">
                TenancyHQ
              </span>
            </div>
            <span className="text-slate-500 text-xs hidden sm:inline">|</span>
            <span className="text-xs text-slate-300 font-medium hidden sm:inline">
              Smart Property & Tenancy Operations Engine
            </span>
          </div>

          {/* Screen Tab Navigation */}
          <div className="flex items-center bg-slate-800/80 p-1 rounded-xl border border-slate-700/60 text-xs">
            {(['dashboard', 'units', 'tenants', 'operations'] as NavTab[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1.5 rounded-lg font-bold capitalize transition-all cursor-pointer ${
                  activeTab === tab
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* View Mode Switcher */}
          <div className="flex items-center gap-1.5 bg-slate-800/80 p-1 rounded-xl border border-slate-700/60 text-xs">
            <button
              onClick={() => setViewMode('mobile')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                viewMode === 'mobile'
                  ? 'bg-slate-700 text-white shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Device Phone Frame"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Mobile Frame</span>
            </button>

            <button
              onClick={() => setViewMode('showcase')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                viewMode === 'showcase'
                  ? 'bg-slate-700 text-white shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Inspect All 4 Screens Side-by-Side"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span className="hidden md:inline">All 4 Screens</span>
            </button>

            <button
              onClick={() => setViewMode('expanded')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                viewMode === 'expanded'
                  ? 'bg-slate-700 text-white shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Expanded Full-Width Responsive View"
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Expanded</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Floating interactive Toast */}
      {toastMessage && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-2xl shadow-2xl border border-slate-700 text-xs font-bold flex items-center gap-2 animate-in fade-in slide-in-from-top-3">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Content Area */}
      <main className="w-full flex-1 flex flex-col items-center justify-start p-2 sm:p-6 overflow-x-hidden">
        {/* VIEW MODE 1: MOBILE DEVICE FRAME (Exact 1:1 screen matching the screenshots) */}
        {viewMode === 'mobile' && (
          <div className="relative my-2 sm:my-4">
            {/* Phone Bezel */}
            <div className="w-[390px] max-w-[96vw] h-[844px] bg-[#f8fafc] rounded-[48px] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7),0_0_0_12px_#1e293b,0_0_0_14px_#334155] border-4 border-slate-950 overflow-hidden flex flex-col relative">
              {/* Dynamic Island / Status Bar */}
              <div className="bg-white pt-2 px-6 pb-1 flex items-center justify-between text-[11px] font-bold text-slate-800 z-30 select-none">
                <span>9:41</span>
                {/* Dynamic island pill */}
                <div className="w-24 h-4 bg-black rounded-full flex items-center justify-center">
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-900 border border-slate-800 mr-2"></div>
                </div>
                <div className="flex items-center gap-1.5 text-[10px]">
                  <span>5G</span>
                  <div className="w-5 h-2.5 border border-slate-800 rounded-xs p-0.5 flex items-center">
                    <div className="w-3 h-1.5 bg-slate-800 rounded-2xs"></div>
                  </div>
                </div>
              </div>

              {/* App Screen Header */}
              <Header
                title={screenTitle}
                unreadCount={3}
                onOpenNotifications={() => setIsNotificationsOpen(true)}
              />

              {/* Scrollable Screen Content */}
              <div className="flex-1 overflow-y-auto custom-scrollbar bg-[#f8fafc]">
                {activeTab === 'dashboard' && (
                  <DashboardScreen
                    units={units}
                    tenants={tenants}
                    activities={activities}
                    onNavigateToTab={setActiveTab}
                    onOpenPaymentModal={(uId, amt) => {
                      setPaymentPreselectedUnitId(uId);
                      setPaymentPreselectedAmount(amt);
                      setIsPaymentModalOpen(true);
                    }}
                    onOpenNoticeModal={(name, flat, amt, late) => {
                      setNoticeTenantName(name);
                      setNoticeUnitNumber(flat);
                      setNoticeAmount(amt || 1850);
                      setNoticeDaysLate(late || 6);
                      setIsNoticeModalOpen(true);
                    }}
                    onOpenAddTenantModal={() => setIsAddTenantModalOpen(true)}
                    onOpenTicketModal={(tId) => {
                      setActiveTicketId(tId || 'tk-1');
                      setIsTicketModalOpen(true);
                    }}
                    onOpenPayoutModal={() => setIsPayoutModalOpen(true)}
                    onSelectTenant={(tId) => setSelectedTenantId(tId)}
                  />
                )}

                {activeTab === 'units' && (
                  <UnitsScreen
                    units={units}
                    onOpenNoticeModal={(name, flat, amt, late) => {
                      setNoticeTenantName(name);
                      setNoticeUnitNumber(flat);
                      setNoticeAmount(amt || 1850);
                      setNoticeDaysLate(late || 6);
                      setIsNoticeModalOpen(true);
                    }}
                    onOpenAddUnitModal={() => setIsAddUnitModalOpen(true)}
                    onOpenAddTenantModal={() => setIsAddTenantModalOpen(true)}
                    onSelectUnit={() => {
                      setActiveTab('tenants');
                    }}
                    onSelectTenant={(tId) => {
                      setSelectedTenantId(tId);
                      setActiveTab('tenants');
                    }}
                    onNavigateToTab={setActiveTab}
                  />
                )}

                {activeTab === 'tenants' && (
                  <TenantsScreen
                    tenants={tenants}
                    units={units}
                    selectedTenantId={selectedTenantId}
                    onSelectTenant={setSelectedTenantId}
                    onOpenPaymentModal={(uId, amt) => {
                      setPaymentPreselectedUnitId(uId);
                      setPaymentPreselectedAmount(amt);
                      setIsPaymentModalOpen(true);
                    }}
                    onOpenNoticeModal={(name, flat, amt, late) => {
                      setNoticeTenantName(name);
                      setNoticeUnitNumber(flat);
                      setNoticeAmount(amt || 1850);
                      setNoticeDaysLate(late || 6);
                      setIsNoticeModalOpen(true);
                    }}
                    onOpenDocumentModal={(doc, tName) => {
                      setSelectedDocument(doc);
                      setDocumentTenantName(tName);
                    }}
                    onWaiveLateFee={handleWaiveLateFee}
                    onAddLandlordNote={handleAddLandlordNote}
                  />
                )}

                {activeTab === 'operations' && (
                  <OperationsScreen
                    units={units}
                    tickets={tickets}
                    onOpenPaymentModal={(uId, amt) => {
                      setPaymentPreselectedUnitId(uId);
                      setPaymentPreselectedAmount(amt);
                      setIsPaymentModalOpen(true);
                    }}
                    onOpenNoticeModal={(name, flat, amt, late) => {
                      setNoticeTenantName(name);
                      setNoticeUnitNumber(flat);
                      setNoticeAmount(amt || 1850);
                      setNoticeDaysLate(late || 6);
                      setIsNoticeModalOpen(true);
                    }}
                    onOpenTicketModal={(tId) => {
                      setActiveTicketId(tId);
                      setIsTicketModalOpen(true);
                    }}
                    onSettleInvoice={(flatNum, amount) => {
                      const u = units.find((x) => x.flatNumber === flatNum);
                      if (u) {
                        handleConfirmPayment(u.id, amount, 'Direct Settlement');
                      }
                    }}
                  />
                )}
              </div>

              {/* Bottom Nav */}
              <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
            </div>
          </div>
        )}

        {/* VIEW MODE 2: ALL 4 SCREENS SHOWCASE (Simultaneous interactive multi-screen layout) */}
        {viewMode === 'showcase' && (
          <div className="w-full max-w-[1600px] py-4">
            <div className="text-center mb-6">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-400 bg-blue-950/80 border border-blue-800/80 px-3 py-1 rounded-full">
                <Sparkles className="w-3.5 h-3.5" /> All 4 Screens Live Synchronized Showcase
              </span>
              <h2 className="text-2xl font-black text-white mt-2">
                TenancyHQ Mobile Interface Suite
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Interact with any screen in real-time. Actions and state updates reflect immediately across the platform.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 justify-center">
              {/* Screen 1: Dashboard */}
              <div className="flex flex-col items-center">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">
                  Screen 1: Dashboard
                </span>
                <div className="w-[360px] h-[780px] bg-[#f8fafc] rounded-[36px] shadow-2xl border-4 border-slate-800 overflow-hidden flex flex-col relative">
                  <Header
                    title="DASHBOARD"
                    onOpenNotifications={() => setIsNotificationsOpen(true)}
                  />
                  <div className="flex-1 overflow-y-auto custom-scrollbar">
                    <DashboardScreen
                      units={units}
                      tenants={tenants}
                      activities={activities}
                      onNavigateToTab={setActiveTab}
                      onOpenPaymentModal={(uId, amt) => {
                        setPaymentPreselectedUnitId(uId);
                        setPaymentPreselectedAmount(amt);
                        setIsPaymentModalOpen(true);
                      }}
                      onOpenNoticeModal={(name, flat, amt, late) => {
                        setNoticeTenantName(name);
                        setNoticeUnitNumber(flat);
                        setNoticeAmount(amt || 1850);
                        setNoticeDaysLate(late || 6);
                        setIsNoticeModalOpen(true);
                      }}
                      onOpenAddTenantModal={() => setIsAddTenantModalOpen(true)}
                      onOpenTicketModal={(tId) => {
                        setActiveTicketId(tId || 'tk-1');
                        setIsTicketModalOpen(true);
                      }}
                      onOpenPayoutModal={() => setIsPayoutModalOpen(true)}
                      onSelectTenant={(tId) => setSelectedTenantId(tId)}
                    />
                  </div>
                  <BottomNav activeTab="dashboard" onTabChange={setActiveTab} />
                </div>
              </div>

              {/* Screen 2: Units */}
              <div className="flex flex-col items-center">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">
                  Screen 2: Units
                </span>
                <div className="w-[360px] h-[780px] bg-[#f8fafc] rounded-[36px] shadow-2xl border-4 border-slate-800 overflow-hidden flex flex-col relative">
                  <Header
                    title="UNITS"
                    onOpenNotifications={() => setIsNotificationsOpen(true)}
                  />
                  <div className="flex-1 overflow-y-auto custom-scrollbar">
                    <UnitsScreen
                      units={units}
                      onOpenNoticeModal={(name, flat, amt, late) => {
                        setNoticeTenantName(name);
                        setNoticeUnitNumber(flat);
                        setNoticeAmount(amt || 1850);
                        setNoticeDaysLate(late || 6);
                        setIsNoticeModalOpen(true);
                      }}
                      onOpenAddUnitModal={() => setIsAddUnitModalOpen(true)}
                      onOpenAddTenantModal={() => setIsAddTenantModalOpen(true)}
                      onSelectUnit={() => setActiveTab('tenants')}
                      onSelectTenant={(tId) => {
                        setSelectedTenantId(tId);
                        setActiveTab('tenants');
                      }}
                      onNavigateToTab={setActiveTab}
                    />
                  </div>
                  <BottomNav activeTab="units" onTabChange={setActiveTab} />
                </div>
              </div>

              {/* Screen 3: Tenants (Marcus Vance profile) */}
              <div className="flex flex-col items-center">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">
                  Screen 3: Tenants (Unit 402)
                </span>
                <div className="w-[360px] h-[780px] bg-[#f8fafc] rounded-[36px] shadow-2xl border-4 border-slate-800 overflow-hidden flex flex-col relative">
                  <Header
                    title="TENANTS"
                    onOpenNotifications={() => setIsNotificationsOpen(true)}
                  />
                  <div className="flex-1 overflow-y-auto custom-scrollbar">
                    <TenantsScreen
                      tenants={tenants}
                      units={units}
                      selectedTenantId={selectedTenantId}
                      onSelectTenant={setSelectedTenantId}
                      onOpenPaymentModal={(uId, amt) => {
                        setPaymentPreselectedUnitId(uId);
                        setPaymentPreselectedAmount(amt);
                        setIsPaymentModalOpen(true);
                      }}
                      onOpenNoticeModal={(name, flat, amt, late) => {
                        setNoticeTenantName(name);
                        setNoticeUnitNumber(flat);
                        setNoticeAmount(amt || 1850);
                        setNoticeDaysLate(late || 6);
                        setIsNoticeModalOpen(true);
                      }}
                      onOpenDocumentModal={(doc, tName) => {
                        setSelectedDocument(doc);
                        setDocumentTenantName(tName);
                      }}
                      onWaiveLateFee={handleWaiveLateFee}
                      onAddLandlordNote={handleAddLandlordNote}
                    />
                  </div>
                  <BottomNav activeTab="tenants" onTabChange={setActiveTab} />
                </div>
              </div>

              {/* Screen 4: Operations */}
              <div className="flex flex-col items-center">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">
                  Screen 4: Operations
                </span>
                <div className="w-[360px] h-[780px] bg-[#f8fafc] rounded-[36px] shadow-2xl border-4 border-slate-800 overflow-hidden flex flex-col relative">
                  <Header
                    title="OPERATIONS"
                    onOpenNotifications={() => setIsNotificationsOpen(true)}
                  />
                  <div className="flex-1 overflow-y-auto custom-scrollbar">
                    <OperationsScreen
                      units={units}
                      tickets={tickets}
                      onOpenPaymentModal={(uId, amt) => {
                        setPaymentPreselectedUnitId(uId);
                        setPaymentPreselectedAmount(amt);
                        setIsPaymentModalOpen(true);
                      }}
                      onOpenNoticeModal={(name, flat, amt, late) => {
                        setNoticeTenantName(name);
                        setNoticeUnitNumber(flat);
                        setNoticeAmount(amt || 1850);
                        setNoticeDaysLate(late || 6);
                        setIsNoticeModalOpen(true);
                      }}
                      onOpenTicketModal={(tId) => {
                        setActiveTicketId(tId);
                        setIsTicketModalOpen(true);
                      }}
                      onSettleInvoice={(flatNum, amount) => {
                        const u = units.find((x) => x.flatNumber === flatNum);
                        if (u) {
                          handleConfirmPayment(u.id, amount, 'Direct Settlement');
                        }
                      }}
                    />
                  </div>
                  <BottomNav activeTab="operations" onTabChange={setActiveTab} />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VIEW MODE 3: EXPANDED TABLET/DESKTOP VIEW */}
        {viewMode === 'expanded' && (
          <div className="w-full max-w-2xl bg-[#f8fafc] rounded-3xl shadow-2xl border border-slate-700/50 overflow-hidden my-4 flex flex-col">
            <Header
              title={screenTitle}
              unreadCount={3}
              onOpenNotifications={() => setIsNotificationsOpen(true)}
            />

            <div className="p-2 sm:p-4">
              {activeTab === 'dashboard' && (
                <DashboardScreen
                  units={units}
                  tenants={tenants}
                  activities={activities}
                  onNavigateToTab={setActiveTab}
                  onOpenPaymentModal={(uId, amt) => {
                    setPaymentPreselectedUnitId(uId);
                    setPaymentPreselectedAmount(amt);
                    setIsPaymentModalOpen(true);
                  }}
                  onOpenNoticeModal={(name, flat, amt, late) => {
                    setNoticeTenantName(name);
                    setNoticeUnitNumber(flat);
                    setNoticeAmount(amt || 1850);
                    setNoticeDaysLate(late || 6);
                    setIsNoticeModalOpen(true);
                  }}
                  onOpenAddTenantModal={() => setIsAddTenantModalOpen(true)}
                  onOpenTicketModal={(tId) => {
                    setActiveTicketId(tId || 'tk-1');
                    setIsTicketModalOpen(true);
                  }}
                  onOpenPayoutModal={() => setIsPayoutModalOpen(true)}
                  onSelectTenant={(tId) => setSelectedTenantId(tId)}
                />
              )}

              {activeTab === 'units' && (
                <UnitsScreen
                  units={units}
                  onOpenNoticeModal={(name, flat, amt, late) => {
                    setNoticeTenantName(name);
                    setNoticeUnitNumber(flat);
                    setNoticeAmount(amt || 1850);
                    setNoticeDaysLate(late || 6);
                    setIsNoticeModalOpen(true);
                  }}
                  onOpenAddUnitModal={() => setIsAddUnitModalOpen(true)}
                  onOpenAddTenantModal={() => setIsAddTenantModalOpen(true)}
                  onSelectUnit={() => setActiveTab('tenants')}
                  onSelectTenant={(tId) => {
                    setSelectedTenantId(tId);
                    setActiveTab('tenants');
                  }}
                  onNavigateToTab={setActiveTab}
                />
              )}

              {activeTab === 'tenants' && (
                <TenantsScreen
                  tenants={tenants}
                  units={units}
                  selectedTenantId={selectedTenantId}
                  onSelectTenant={setSelectedTenantId}
                  onOpenPaymentModal={(uId, amt) => {
                    setPaymentPreselectedUnitId(uId);
                    setPaymentPreselectedAmount(amt);
                    setIsPaymentModalOpen(true);
                  }}
                  onOpenNoticeModal={(name, flat, amt, late) => {
                    setNoticeTenantName(name);
                    setNoticeUnitNumber(flat);
                    setNoticeAmount(amt || 1850);
                    setNoticeDaysLate(late || 6);
                    setIsNoticeModalOpen(true);
                  }}
                  onOpenDocumentModal={(doc, tName) => {
                    setSelectedDocument(doc);
                    setDocumentTenantName(tName);
                  }}
                  onWaiveLateFee={handleWaiveLateFee}
                  onAddLandlordNote={handleAddLandlordNote}
                />
              )}

              {activeTab === 'operations' && (
                <OperationsScreen
                  units={units}
                  tickets={tickets}
                  onOpenPaymentModal={(uId, amt) => {
                    setPaymentPreselectedUnitId(uId);
                    setPaymentPreselectedAmount(amt);
                    setIsPaymentModalOpen(true);
                  }}
                  onOpenNoticeModal={(name, flat, amt, late) => {
                    setNoticeTenantName(name);
                    setNoticeUnitNumber(flat);
                    setNoticeAmount(amt || 1850);
                    setNoticeDaysLate(late || 6);
                    setIsNoticeModalOpen(true);
                  }}
                  onOpenTicketModal={(tId) => {
                    setActiveTicketId(tId);
                    setIsTicketModalOpen(true);
                  }}
                  onSettleInvoice={(flatNum, amount) => {
                    const u = units.find((x) => x.flatNumber === flatNum);
                    if (u) {
                      handleConfirmPayment(u.id, amount, 'Direct Settlement');
                    }
                  }}
                />
              )}
            </div>

            <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
          </div>
        )}
      </main>

      {/* MODALS */}
      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        units={units}
        preselectedUnitId={paymentPreselectedUnitId}
        preselectedAmount={paymentPreselectedAmount}
        onConfirmPayment={handleConfirmPayment}
      />

      <NoticeModal
        isOpen={isNoticeModalOpen}
        onClose={() => setIsNoticeModalOpen(false)}
        tenantName={noticeTenantName}
        unitNumber={noticeUnitNumber}
        amountDue={noticeAmount}
        daysLate={noticeDaysLate}
        onSent={() => showToast(`Notice successfully dispatched to ${noticeTenantName}!`)}
      />

      <TicketModal
        isOpen={isTicketModalOpen}
        onClose={() => setIsTicketModalOpen(false)}
        activeTicket={activeTicket}
        onAddTicket={handleAddTicket}
        onUpdateStatus={handleUpdateTicketStatus}
      />

      <PayoutModal
        isOpen={isPayoutModalOpen}
        onClose={() => setIsPayoutModalOpen(false)}
      />

      <AddTenantModal
        isOpen={isAddTenantModalOpen}
        onClose={() => setIsAddTenantModalOpen(false)}
        units={units}
        onAddTenant={handleAddTenant}
      />

      <AddUnitModal
        isOpen={isAddUnitModalOpen}
        onClose={() => setIsAddUnitModalOpen(false)}
        onAddUnit={handleAddUnit}
      />

      <DocumentModal
        isOpen={Boolean(selectedDocument)}
        onClose={() => setSelectedDocument(null)}
        document={selectedDocument}
        tenantName={documentTenantName}
      />

      <NotificationsDrawer
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        onActionClick={(target) => {
          if (target === 'overdue') {
            setActiveTab('operations');
          } else if (target === 'lease') {
            setSelectedTenantId('t-9014');
            setActiveTab('tenants');
          } else if (target === 'plumbing') {
            setActiveTicketId('tk-1');
            setIsTicketModalOpen(true);
          }
        }}
      />
    </div>
  );
}
