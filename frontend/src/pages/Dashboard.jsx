import { useEffect, useState, useMemo } from 'react';
import { api } from '../services/api';
import { Bar, Pie, Doughnut } from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  ChartDataLabels
);

export const CHURCHES = [
  'Suphan Buri',
  'Kanchanaburi',
  'Uthai Thani',
  'Sing Buri',
];

// Sample member data
export const sampleMembers = [
  {
    id: 1,
    first_name: 'Somchai',
    last_name: 'Sukjai',
    email: 'somchai@example.com',
    gender: 'Male',
    church: 'Suphan Buri',
    image_url: '',
    created_at: '2025-06-01',
    contributions: 5,
    age: 34,
  },
  {
    id: 2,
    first_name: 'Suda',
    last_name: 'Yimdee',
    email: 'suda@example.com',
    gender: 'Female',
    church: 'Kanchanaburi',
    image_url: '',
    created_at: '2025-06-15',
    contributions: 8,
    age: 28,
  },
  {
    id: 3,
    first_name: 'Anan',
    last_name: 'Chaiyo',
    email: 'anan@example.com',
    gender: 'Male',
    church: 'Uthai Thani',
    image_url: '',
    created_at: '2025-07-01',
    contributions: 2,
    age: 41,
  },
  {
    id: 4,
    first_name: 'Nok',
    last_name: 'Srisuk',
    email: 'nok@example.com',
    gender: 'Female',
    church: 'Sing Buri',
    image_url: '',
    created_at: '2025-07-10',
    contributions: 10,
    age: 36,
  },
  {
    id: 5,
    first_name: 'Prasit',
    last_name: 'Thongdee',
    email: 'prasit@example.com',
    gender: 'Male',
    church: 'Suphan Buri',
    image_url: '',
    created_at: '2025-07-15',
    contributions: 1,
    age: 22,
  },
];

export default function Dashboard() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterChurch, setFilterChurch] = useState('All');
  const [filterGender, setFilterGender] = useState('All');

  useEffect(() => {
    api.get('members/').then(res => {
      if (res.data && res.data.length > 0) {
        setMembers(res.data);
      } else {
        setMembers(sampleMembers);
      }
      setLoading(false);
    }).catch(() => {
      // If API fails, show UI with sample data
      setMembers(sampleMembers);
      setLoading(false);
    });
  }, []);

  // Count members per church
  const churchCounts = CHURCHES.map(church => ({
    name: church,
    count: members.filter(m => m.church === church).length,
  }));

  // Dashboard stats
  const totalMembers = members.length;
  const maleCount = members.filter(m => m.gender === 'Male').length;
  const femaleCount = members.filter(m => m.gender === 'Female').length;

  // Gender ratio chart data
  const genderRatioChartData = {
    labels: ['Male', 'Female'],
    datasets: [
      {
        label: 'Gender Ratio',
        data: [maleCount, femaleCount],
        backgroundColor: ['#3b82f6', '#f59e42'], // Blue for Male, Orange for Female
      },
    ],
  };

  // Member age distribution chart data
  const ageGroups = ['18-25', '26-35', '36-45', '46+'];
  const ageGroupCounts = [
    members.filter(m => m.age >= 18 && m.age <= 25).length,
    members.filter(m => m.age >= 26 && m.age <= 35).length,
    members.filter(m => m.age >= 36 && m.age <= 45).length,
    members.filter(m => m.age >= 46).length,
  ];
  const ageDistributionChartData = {
    labels: ageGroups,
    datasets: [
      {
        label: 'Age Distribution',
        data: ageGroupCounts,
        backgroundColor: ['#3b82f6', '#6366f1', '#10b981', '#f59e42'],
      },
    ],
  };

  // Filtered members for table and stats
  const filteredMembers = useMemo(() => {
    return members.filter(m =>
      (filterChurch === 'All' || m.church === filterChurch) &&
      (filterGender === 'All' || m.gender === filterGender)
    );
  }, [members, filterChurch, filterGender]);

  // Member growth over time (simple monthly count)
  const growthData = useMemo(() => {
    const byMonth = {};
    members.forEach(m => {
      if (m.created_at) {
        const month = new Date(m.created_at).toLocaleString('default', { month: 'short', year: 'numeric' });
        byMonth[month] = (byMonth[month] || 0) + 1;
      }
    });
    return Object.entries(byMonth).sort((a, b) => new Date(a[0]) - new Date(b[0]));
  }, [members]);

  // Chart data for member growth
  const memberGrowthChartData = {
    labels: growthData.map(([month]) => month),
    datasets: [
      {
        label: 'New Members',
        data: growthData.map(([_, count]) => count),
        backgroundColor: '#3b82f6',
      },
    ],
  };

  // Chart data for members by church
  const membersByChurchChartData = {
    labels: churchCounts.map(d => d.name),
    datasets: [
      {
        label: 'Members',
        data: churchCounts.map(d => d.count),
        backgroundColor: [
          '#3b82f6', // Suphan Buri (Blue)
          '#f59e42', // Kanchanaburi (Orange)
          '#6366f1', // Uthai Thani (Indigo)
          '#10b981'  // Sing Buri (Green)
        ],
      },
    ],
  };

  // Top contributors (members with most activity, e.g., 'contributions' field)
  const topContributors = [...members]
    .filter(m => m.contributions)
    .sort((a, b) => b.contributions - a.contributions)
    .slice(0, 5);

  // Recent activity (last 5 members added)
  const recentActivity = [...members]
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 5);

  // Upcoming birthdays (next 30 days)
  const upcomingBirthdays = members.filter(m => {
    if (!m.birthday) return false;
    const today = new Date();
    const bday = new Date(m.birthday);
    bday.setFullYear(today.getFullYear());
    const diff = (bday - today) / (1000 * 60 * 60 * 24);
    return diff >= 0 && diff <= 30;
  });

  // New members this month
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const newMembersThisMonth = members.filter(m => {
    const d = new Date(m.created_at);
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
  });

  // Previous month for comparison
  const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
  const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;
  const newMembersLastMonth = members.filter(m => {
    const d = new Date(m.created_at);
    return d.getMonth() === lastMonth && d.getFullYear() === lastMonthYear;
  });

  // Growth calculation
  const monthlyGrowthRate = newMembersLastMonth.length > 0
    ? Math.round(((newMembersThisMonth.length - newMembersLastMonth.length) / newMembersLastMonth.length) * 100)
    : 0;

  // Member health metrics
  const now = new Date();
  const activeMembersCount = members.filter(m => m.contributions > 0).length;
  const inactiveMembers = members.filter(m => m.contributions === 0);
  const atRiskMembers = members.filter(m => {
    const joinDate = new Date(m.created_at);
    const daysSinceJoined = Math.floor((now - joinDate) / (1000 * 60 * 60 * 24));
    return daysSinceJoined > 30 && m.contributions === 0;
  });

  // Actionable items
  const incompleteProfiles = members.filter(m => !m.image_url || !m.email).length;
  const needsWelcome = newMembersThisMonth.filter(m => {
    const joinDate = new Date(m.created_at);
    const daysSinceJoined = Math.floor((now - joinDate) / (1000 * 60 * 60 * 24));
    return daysSinceJoined <= 7;
  }).length;

  // Engagement score (0-100)
  const engagementScore = members.length > 0
    ? Math.round((activeMembersCount / members.length) * 100)
    : 0;

  // Church performance metrics
  const churchPerformance = CHURCHES.map(church => {
    const churchMembers = members.filter(m => m.church === church);
    const activeInChurch = churchMembers.filter(m => m.contributions > 0).length;
    const newThisMonth = churchMembers.filter(m => {
      const d = new Date(m.created_at);
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    }).length;

    return {
      name: church,
      total: churchMembers.length,
      active: activeInChurch,
      newThisMonth,
      engagementRate: churchMembers.length > 0 ? Math.round((activeInChurch / churchMembers.length) * 100) : 0,
      growthRate: newThisMonth
    };
  }).sort((a, b) => b.engagementRate - a.engagementRate);

  // Upcoming events/birthdays (next 7 days for urgency)
  const urgentBirthdays = members.filter(m => {
    if (!m.birthday) return false;
    const today = new Date();
    const bday = new Date(m.birthday);
    bday.setFullYear(today.getFullYear());
    const diff = (bday - today) / (1000 * 60 * 60 * 24);
    return diff >= 0 && diff <= 7;
  });

  // Retention rate (placeholder: percent of members with contributions > 0)
  const retentionRate = members.length > 0 ? Math.round((members.filter(m => m.contributions > 0).length / members.length) * 100) : 0;

  // Most active churches (by total contributions)
  const churchActivity = CHURCHES.map(church => ({
    name: church,
    total: members.filter(m => m.church === church).reduce((sum, m) => sum + (m.contributions || 0), 0)
  }));
  const mostActiveChurches = [...churchActivity].sort((a, b) => b.total - a.total).slice(0, 3);

  // Notifications (sample)
  const notifications = [
    { id: 1, message: 'Member profile updated', date: '2025-07-16' },
    { id: 2, message: 'New member joined', date: '2025-07-15' },
    { id: 3, message: 'Church event scheduled', date: '2025-07-14' },
  ];

  // Admin notes (sample)
  const adminNotes = [
    { id: 1, note: 'Welcome new members!', date: '2025-07-01' },
    { id: 2, note: 'Please update your profiles.', date: '2025-07-10' },
  ];

  // Member map (placeholder: show church counts)
  // In real app, use a map library and member coordinates

  // Recent logins (sample)
  const recentLogins = [
    { id: 1, name: 'Somchai Sukjai', date: '2025-07-17 09:00' },
    { id: 2, name: 'Suda Yimdee', date: '2025-07-16 18:30' },
    { id: 3, name: 'Nok Srisuk', date: '2025-07-16 15:20' },
  ];

  // Custom member tags/groups (sample)
  const memberTags = [
    { id: 1, tag: 'Committee' },
    { id: 2, tag: 'Volunteer' },
    { id: 3, tag: 'Alumni' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Modern Professional Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
                <p className="mt-1 text-sm text-gray-600">
                  Monitor your community's growth and engagement
                </p>
              </div>
              {!loading && (
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => {
                      const csv = [
                        ['Name', 'Church', 'Gender', 'Email', 'Contributions'],
                        ...members.map(m => [
                          `${m.first_name} ${m.last_name}`,
                          m.church,
                          m.gender,
                          m.email,
                          m.contributions || 0
                        ])
                      ].map(row => row.join(',')).join('\n');
                      const blob = new Blob([csv], { type: 'text/csv' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = 'member-report.csv';
                      a.click();
                      URL.revokeObjectURL(url);
                    }}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span className="hidden sm:inline">Export</span>
                  </button>

                  <button className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-lg text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    <span className="hidden sm:inline">Add Member</span>
                    <span className="sm:hidden">Add</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full shadow-lg mb-4">
                <svg className="animate-spin w-8 h-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
              <p className="text-lg font-medium text-gray-900 mb-2">Loading Dashboard</p>
              <p className="text-sm text-gray-600">Gathering your latest member insights...</p>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-200">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Total Members</h3>
                    <div className="text-2xl font-bold text-gray-900 mb-2">{totalMembers}</div>
                    <div className="text-sm text-gray-600">
                      Registered community members
                    </div>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-200">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Active Members</h3>
                    <div className="text-2xl font-bold text-gray-900 mb-2">{activeMembersCount}</div>
                    <div className="flex items-center text-sm">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${engagementScore >= 70 ? 'bg-green-100 text-green-800' :
                        engagementScore >= 50 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                        }`}>
                        {engagementScore}% engaged
                      </span>
                    </div>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-200">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Monthly Growth</h3>
                    <div className="text-2xl font-bold text-gray-900 mb-2">
                      <span className={monthlyGrowthRate >= 0 ? 'text-green-600' : 'text-red-600'}>
                        {monthlyGrowthRate >= 0 ? '+' : ''}{monthlyGrowthRate}%
                      </span>
                    </div>
                    <div className="text-sm text-gray-600">
                      +{newMembersThisMonth.length} new members
                    </div>
                  </div>
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-200">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Retention Rate</h3>
                    <div className="text-2xl font-bold text-gray-900 mb-2">{retentionRate}%</div>
                    <div className="text-sm text-gray-600">
                      Member activity
                    </div>
                  </div>
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Insights and Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Priority Actions */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-semibold text-gray-900">Priority Actions</h2>
                    <span className="text-sm text-gray-500">Requires attention</span>
                  </div>

                  {(atRiskMembers.length > 0 || incompleteProfiles > 0 || needsWelcome > 0) ? (
                    <div className="space-y-4">
                      {atRiskMembers.length > 0 && (
                        <div className="flex items-start p-4 bg-red-50 rounded-lg border border-red-100">
                          <div className="flex-shrink-0 w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center mr-4">
                            <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                            </svg>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium text-red-900">At-Risk Members</h3>
                            <p className="text-sm text-red-700 mt-1">
                              {atRiskMembers.length} members joined 30+ days ago with no activity
                            </p>
                            <button className="mt-3 text-sm font-medium text-red-800 hover:text-red-900">
                              Review members →
                            </button>
                          </div>
                          <span className="flex-shrink-0 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                            {atRiskMembers.length}
                          </span>
                        </div>
                      )}

                      {incompleteProfiles > 0 && (
                        <div className="flex items-start p-4 bg-amber-50 rounded-lg border border-amber-100">
                          <div className="flex-shrink-0 w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center mr-4">
                            <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium text-amber-900">Incomplete Profiles</h3>
                            <p className="text-sm text-amber-700 mt-1">
                              Members missing profile photos or email addresses
                            </p>
                            <button className="mt-3 text-sm font-medium text-amber-800 hover:text-amber-900">
                              Send reminders →
                            </button>
                          </div>
                          <span className="flex-shrink-0 bg-amber-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                            {incompleteProfiles}
                          </span>
                        </div>
                      )}

                      {needsWelcome > 0 && (
                        <div className="flex items-start p-4 bg-blue-50 rounded-lg border border-blue-100">
                          <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                            <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                            </svg>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium text-blue-900">New Member Welcome</h3>
                            <p className="text-sm text-blue-700 mt-1">
                              Recent members who haven't received welcome follow-up
                            </p>
                            <button className="mt-3 text-sm font-medium text-blue-800 hover:text-blue-900">
                              Send welcome →
                            </button>
                          </div>
                          <span className="flex-shrink-0 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                            {needsWelcome}
                          </span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">All caught up!</h3>
                      <p className="text-gray-600">No urgent actions required at this time.</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Quick Stats */}
              <div className="space-y-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Quick Overview</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Male Members</span>
                      <span className="font-semibold text-gray-900">{maleCount}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Female Members</span>
                      <span className="font-semibold text-gray-900">{femaleCount}</span>
                    </div>
                    <hr className="border-gray-200" />
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">This Month</span>
                      <span className="font-semibold text-green-600">+{newMembersThisMonth.length}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Inactive</span>
                      <span className="font-semibold text-red-600">{inactiveMembers.length}</span>
                    </div>
                  </div>
                </div>

                {urgentBirthdays.length > 0 && (
                  <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white">
                    <h3 className="font-semibold mb-2">🎉 Upcoming Birthdays</h3>
                    <p className="text-purple-100 text-sm mb-4">
                      {urgentBirthdays.length} member{urgentBirthdays.length !== 1 ? 's' : ''} this week
                    </p>
                    <button className="text-sm font-medium text-white bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors">
                      View Details
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Analytics Section */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 hover:shadow-md transition-shadow duration-200">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">Church Performance</h2>
                  <div className="text-xs sm:text-sm text-gray-500">
                    Ranked by engagement
                  </div>
                </div>
                <div className="space-y-3 sm:space-y-4 max-h-64 sm:max-h-80 overflow-y-auto">
                  {churchPerformance.map((church, index) => (
                    <div key={church.name} className="border-b last:border-b-0 pb-3 last:pb-0">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm sm:text-base">{church.name}</span>
                          {index === 0 && (
                            <span className="text-yellow-500 text-lg" title="Top Performing Church">👑</span>
                          )}
                        </div>
                        <div className="flex items-center">
                          <span className={`px-2 py-1 rounded-full text-xs font-bold ${church.engagementRate >= 70 ? 'bg-green-100 text-green-800' :
                            church.engagementRate >= 50 ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                            {church.engagementRate}%
                          </span>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600">
                        <div className="text-center sm:text-left">
                          <span className="font-medium">{church.total}</span>
                          <span className="block sm:inline sm:ml-1">total</span>
                        </div>
                        <div className="text-center sm:text-left">
                          <span className="font-medium">{church.active}</span>
                          <span className="block sm:inline sm:ml-1">active</span>
                        </div>
                        <div className="text-center sm:text-left">
                          <span className="font-medium">{church.newThisMonth}</span>
                          <span className="block sm:inline sm:ml-1">new</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 hover:shadow-md transition-shadow duration-200">
                <h2 className="text-lg font-semibold mb-4 text-gray-900">Member Growth Trend</h2>
                <div className="h-48 sm:h-64">
                  <Bar data={memberGrowthChartData} options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: { display: false },
                      tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        titleColor: 'white',
                        bodyColor: 'white',
                        cornerRadius: 6
                      }
                    },
                    scales: {
                      x: {
                        title: { display: true, text: 'Month', font: { size: 12 } },
                        grid: { display: false },
                        ticks: { font: { size: 10 } }
                      },
                      y: {
                        title: { display: true, text: 'New Members', font: { size: 12 } },
                        beginAtZero: true,
                        ticks: { font: { size: 10 } }
                      }
                    }
                  }} />
                </div>
              </div>
            </div>

            {/* Analytics Dashboard */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
              {/* Demographics */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-gray-900">Member Demographics</h2>
                  <div className="flex items-center text-sm text-gray-500">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    Analytics
                  </div>
                </div>

                <div className="space-y-6">
                  {/* Gender Distribution */}
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-4">Gender Distribution</h3>
                    <div className="flex justify-center mb-4">
                      <div className="w-32 h-32">
                        <Doughnut
                          data={genderRatioChartData}
                          options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                              legend: { display: false },
                              datalabels: {
                                color: 'white',
                                font: { weight: 'bold', size: 12 },
                                formatter: (value) => value
                              },
                              tooltip: {
                                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                                titleColor: 'white',
                                bodyColor: 'white',
                                cornerRadius: 8
                              }
                            }
                          }}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <div className="w-3 h-3 bg-blue-500 rounded-full mx-auto mb-2"></div>
                        <div className="text-xl font-bold text-blue-600">{maleCount}</div>
                        <div className="text-sm text-blue-700">Male</div>
                        <div className="text-xs text-blue-600 mt-1">
                          {totalMembers > 0 ? Math.round((maleCount / totalMembers) * 100) : 0}%
                        </div>
                      </div>
                      <div className="text-center p-3 bg-orange-50 rounded-lg">
                        <div className="w-3 h-3 bg-orange-500 rounded-full mx-auto mb-2"></div>
                        <div className="text-xl font-bold text-orange-600">{femaleCount}</div>
                        <div className="text-sm text-orange-700">Female</div>
                        <div className="text-xs text-orange-600 mt-1">
                          {totalMembers > 0 ? Math.round((femaleCount / totalMembers) * 100) : 0}%
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Activity Status */}
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-3">Activity Status</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-green-50 rounded-lg border border-green-100">
                        <div className="text-xl font-bold text-green-600 mb-1">{activeMembersCount}</div>
                        <div className="text-sm text-green-700">Active</div>
                      </div>
                      <div className="text-center p-3 bg-gray-50 rounded-lg border border-gray-100">
                        <div className="text-xl font-bold text-gray-600 mb-1">{inactiveMembers.length}</div>
                        <div className="text-sm text-gray-700">Inactive</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Age Distribution & Recent Activity */}
              <div className="space-y-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Age Distribution</h3>
                  <div className="h-48">
                    <Bar data={ageDistributionChartData} options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: { display: false },
                        tooltip: {
                          backgroundColor: 'rgba(0, 0, 0, 0.8)',
                          titleColor: 'white',
                          bodyColor: 'white',
                          cornerRadius: 8
                        }
                      },
                      scales: {
                        x: {
                          title: { display: true, text: 'Age Group', font: { size: 11 } },
                          grid: { display: false },
                          ticks: { font: { size: 10 } }
                        },
                        y: {
                          title: { display: true, text: 'Members', font: { size: 11 } },
                          beginAtZero: true,
                          ticks: { font: { size: 10 } }
                        }
                      }
                    }} />
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                  <div className="space-y-3 max-h-48 overflow-y-auto">
                    {newMembersThisMonth.slice(0, 5).map(m => (
                      <div key={m.id} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                        {m.image_url ? (
                          <img src={m.image_url} alt="avatar" className="w-10 h-10 rounded-full border-2 border-gray-200" />
                        ) : (
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold ${m.gender === 'Male' ? 'bg-blue-500' : 'bg-pink-500'
                            }`}>
                            {m.first_name[0]}
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{m.first_name} {m.last_name}</p>
                          <p className="text-xs text-gray-500">{new Date(m.created_at).toLocaleDateString()}</p>
                        </div>
                        <div className="text-xs text-green-500 bg-green-50 px-2 py-1 rounded-full">
                          New
                        </div>
                      </div>
                    ))}
                    {newMembersThisMonth.length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        <div className="text-gray-400 text-3xl mb-2">📊</div>
                        <p className="text-sm">No recent activity</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Administrative Actions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Administrative Tools</h2>
                <div className="text-sm text-gray-500">
                  Management actions
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button className="group flex items-center p-4 rounded-lg border border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-all duration-200">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-4 group-hover:bg-purple-200 transition-colors">
                    <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM4 13v6a1 1 0 001 1h6M4 5v6a1 1 0 001 1h6M20 3a1 1 0 011 1v6M10 3h6a1 1 0 011 1v6" />
                    </svg>
                  </div>
                  <div className="text-left">
                    <h3 className="font-medium text-gray-900 group-hover:text-purple-900">Send Notifications</h3>
                    <p className="text-sm text-gray-500 mt-1">Bulk messaging to members</p>
                  </div>
                </button>

                <button className="group flex items-center p-4 rounded-lg border border-gray-200 hover:border-yellow-300 hover:bg-yellow-50 transition-all duration-200">
                  <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center mr-4 group-hover:bg-yellow-200 transition-colors">
                    <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="text-left">
                    <h3 className="font-medium text-gray-900 group-hover:text-yellow-900">Schedule Event</h3>
                    <p className="text-sm text-gray-500 mt-1">Plan community activities</p>
                  </div>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
