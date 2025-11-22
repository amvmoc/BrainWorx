import { useState, useEffect } from 'react';
import { LogOut, Users, TrendingUp, FileText, DollarSign, LayoutDashboard, Eye, Search } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { InvoicesPage } from './InvoicesPage';
import { SelfAssessmentsPage } from './SelfAssessmentsPage';

interface SuperAdminDashboardProps {
  franchiseOwnerName: string;
  onLogout: () => void;
}

interface SalesLog {
  id: string;
  franchise_owner_id: string;
  customer_name: string;
  customer_email: string;
  assessment_type: string;
  amount: number;
  status: string;
  created_at: string;
  franchise_owner?: {
    name: string;
    unique_link_code: string;
  };
}

export function SuperAdminDashboard({ franchiseOwnerName, onLogout }: SuperAdminDashboardProps) {
  const [currentView, setCurrentView] = useState<'overview' | 'sales' | 'responses' | 'invoices' | 'self_assessments'>('overview');
  const [salesLogs, setSalesLogs] = useState<SalesLog[]>([]);
  const [responses, setResponses] = useState<any[]>([]);
  const [selfAssessments, setSelfAssessments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [salesData, responsesData, selfAssessmentsData] = await Promise.all([
        supabase
          .from('sales_log')
          .select(`
            *,
            franchise_owner:franchise_owners(name, unique_link_code)
          `)
          .order('created_at', { ascending: false }),
        supabase
          .from('responses')
          .select('*')
          .order('created_at', { ascending: false }),
        supabase
          .from('self_assessment_responses')
          .select('*')
          .order('created_at', { ascending: false })
      ]);

      setSalesLogs(salesData.data || []);
      setResponses(responsesData.data || []);
      setSelfAssessments(selfAssessmentsData.data || []);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const stats = {
    totalSales: salesLogs.length,
    totalRevenue: salesLogs
      .filter(log => log.status === 'paid')
      .reduce((sum, log) => sum + Number(log.amount), 0),
    completedAssessments: responses.filter(r => r.status === 'analyzed').length + selfAssessments.filter(s => s.status === 'completed').length,
    pendingAssessments: responses.filter(r => r.status === 'in_progress').length + selfAssessments.filter(s => s.status === 'in_progress').length
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredSalesLogs = salesLogs.filter(log => {
    const matchesSearch = searchTerm === '' ||
      log.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.customer_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.franchise_owner?.name.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || log.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A2A5E] to-[#3DB3E3]">
      <nav className="bg-white/10 backdrop-blur-md border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-white">BrainWorx Super Admin</h1>
              <p className="text-[#E6E9EF]">{franchiseOwnerName}</p>
            </div>
            <button
              onClick={onLogout}
              className="flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-all"
            >
              <LogOut size={20} />
              Logout
            </button>
          </div>

          <div className="flex gap-2 mt-4 overflow-x-auto">
            <button
              onClick={() => setCurrentView('overview')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-all ${
                currentView === 'overview'
                  ? 'bg-white text-[#0A2A5E] font-semibold'
                  : 'bg-white/20 text-white hover:bg-white/30'
              }`}
            >
              <LayoutDashboard size={20} />
              Overview
            </button>
            <button
              onClick={() => setCurrentView('sales')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-all ${
                currentView === 'sales'
                  ? 'bg-white text-[#0A2A5E] font-semibold'
                  : 'bg-white/20 text-white hover:bg-white/30'
              }`}
            >
              <DollarSign size={20} />
              All Sales
            </button>
            <button
              onClick={() => setCurrentView('responses')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-all ${
                currentView === 'responses'
                  ? 'bg-white text-[#0A2A5E] font-semibold'
                  : 'bg-white/20 text-white hover:bg-white/30'
              }`}
            >
              <Users size={20} />
              Full Assessments
            </button>
            <button
              onClick={() => setCurrentView('self_assessments')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-all ${
                currentView === 'self_assessments'
                  ? 'bg-white text-[#0A2A5E] font-semibold'
                  : 'bg-white/20 text-white hover:bg-white/30'
              }`}
            >
              <FileText size={20} />
              Self Assessments
            </button>
            <button
              onClick={() => setCurrentView('invoices')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-all ${
                currentView === 'invoices'
                  ? 'bg-white text-[#0A2A5E] font-semibold'
                  : 'bg-white/20 text-white hover:bg-white/30'
              }`}
            >
              <FileText size={20} />
              All Invoices
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentView === 'overview' && (
          <>
            <div className="grid md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-gray-600 font-medium">Total Sales</h3>
                  <DollarSign className="text-[#3DB3E3]" size={24} />
                </div>
                <p className="text-3xl font-bold text-[#0A2A5E]">{stats.totalSales}</p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-lg">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-gray-600 font-medium">Total Revenue</h3>
                  <TrendingUp className="text-[#1FAFA3]" size={24} />
                </div>
                <p className="text-3xl font-bold text-[#0A2A5E]">{formatCurrency(stats.totalRevenue)}</p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-lg">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-gray-600 font-medium">Completed</h3>
                  <Users className="text-green-500" size={24} />
                </div>
                <p className="text-3xl font-bold text-[#0A2A5E]">{stats.completedAssessments}</p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-lg">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-gray-600 font-medium">In Progress</h3>
                  <TrendingUp className="text-orange-500" size={24} />
                </div>
                <p className="text-3xl font-bold text-[#0A2A5E]">{stats.pendingAssessments}</p>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h2 className="text-xl font-bold text-[#0A2A5E] mb-6">Recent Sales Activity</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-[#E6E9EF] border-b-2 border-[#0A2A5E]">
                    <tr>
                      <th className="px-6 py-3 text-left font-semibold text-[#0A2A5E]">Franchise Holder</th>
                      <th className="px-6 py-3 text-left font-semibold text-[#0A2A5E]">Customer</th>
                      <th className="px-6 py-3 text-left font-semibold text-[#0A2A5E]">Assessment Type</th>
                      <th className="px-6 py-3 text-left font-semibold text-[#0A2A5E]">Status</th>
                      <th className="px-6 py-3 text-left font-semibold text-[#0A2A5E]">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {salesLogs.slice(0, 10).map((log) => (
                      <tr key={log.id} className="border-b hover:bg-gray-50">
                        <td className="px-6 py-4 font-medium text-[#0A2A5E]">
                          {log.franchise_owner?.name || 'Unknown'}
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-semibold text-gray-800">{log.customer_name}</p>
                            <p className="text-sm text-gray-500">{log.customer_email}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-gray-600">{log.assessment_type}</td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                            log.status === 'paid'
                              ? 'bg-green-100 text-green-800'
                              : log.status === 'completed'
                              ? 'bg-blue-100 text-blue-800'
                              : log.status === 'in_progress'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {log.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">{formatDate(log.created_at)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {currentView === 'sales' && (
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <h2 className="text-2xl font-bold text-[#0A2A5E] mb-6">All Sales Logs</h2>

            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search by customer, FH name, or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3DB3E3] focus:border-transparent"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3DB3E3] focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="lead">Lead</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="paid">Paid</option>
              </select>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#E6E9EF] border-b-2 border-[#0A2A5E]">
                  <tr>
                    <th className="px-6 py-3 text-left font-semibold text-[#0A2A5E]">Franchise Holder</th>
                    <th className="px-6 py-3 text-left font-semibold text-[#0A2A5E]">Customer</th>
                    <th className="px-6 py-3 text-left font-semibold text-[#0A2A5E]">Assessment Type</th>
                    <th className="px-6 py-3 text-left font-semibold text-[#0A2A5E]">Amount</th>
                    <th className="px-6 py-3 text-left font-semibold text-[#0A2A5E]">Status</th>
                    <th className="px-6 py-3 text-left font-semibold text-[#0A2A5E]">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSalesLogs.map((log) => (
                    <tr key={log.id} className="border-b hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-semibold text-[#0A2A5E]">{log.franchise_owner?.name || 'Unknown'}</p>
                          <p className="text-sm text-gray-500">{log.franchise_owner?.unique_link_code}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-semibold text-gray-800">{log.customer_name}</p>
                          <p className="text-sm text-gray-500">{log.customer_email}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-600">{log.assessment_type}</td>
                      <td className="px-6 py-4 font-semibold text-gray-800">
                        {formatCurrency(log.amount)}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          log.status === 'paid'
                            ? 'bg-green-100 text-green-800'
                            : log.status === 'completed'
                            ? 'bg-blue-100 text-blue-800'
                            : log.status === 'in_progress'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {log.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{formatDate(log.created_at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {currentView === 'invoices' && (
          <InvoicesPage franchiseOwnerId="super_admin_all" />
        )}

        {currentView === 'self_assessments' && (
          <SelfAssessmentsPage franchiseOwnerId="super_admin_all" />
        )}
      </div>
    </div>
  );
}
