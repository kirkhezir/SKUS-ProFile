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
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-sm text-gray-500 mt-1 hidden sm:block">
                {new Date().toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
            {!loading && (
              <div className="flex items-center space-x-2 sm:space-x-4">
                <div className="text-right hidden sm:block">
                  <div className="text-sm font-medium text-gray-900">{totalMembers} Members</div>
                  <div className="text-xs text-gray-500">
                    {activeMembersCount} active ({engagementScore}%)
                  </div>
                </div>
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z"/>
                  </svg>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 sm:px-6 lg:px-8 py-6">
        {loading ? (
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="inline-flex items-center px-4 py-2 border border-transparent text-sm leading-5 font-medium rounded-md text-gray-500 bg-white">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Loading dashboard...
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Executive Summary - Key Metrics */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 hover:shadow-md transition-shadow duration-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xs sm:text-sm font-medium text-gray-600 mb-1 sm:mb-2">Total Members</h3>
                    <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">{totalMembers}</div>
                    <div className="text-xs sm:text-sm text-gray-500 mt-1">
                      <span className="inline-flex items-center text-green-600">
                        +{newMembersThisMonth.length} this month
                      </span>
                    </div>
                  </div>
                  <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z"/>
                    </svg>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 hover:shadow-md transition-shadow duration-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xs sm:text-sm font-medium text-gray-600 mb-1 sm:mb-2">Monthly Growth</h3>
                    <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
                      <span className={monthlyGrowthRate >= 0 ? 'text-green-600' : 'text-red-600'}>
                        {monthlyGrowthRate >= 0 ? '+' : ''}{monthlyGrowthRate}%
                      </span>
                    </div>
                    <div className="text-xs sm:text-sm text-gray-500 mt-1">
                      vs. last month
                    </div>
                  </div>
                  <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 hover:shadow-md transition-shadow duration-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xs sm:text-sm font-medium text-gray-600 mb-1 sm:mb-2">Active Members</h3>
                    <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">{activeMembersCount}</div>
                    <div className="text-xs sm:text-sm text-gray-500 mt-1">
                      {inactiveMembers.length} inactive
                    </div>
                  </div>
                  <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                    </svg>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 hover:shadow-md transition-shadow duration-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xs sm:text-sm font-medium text-gray-600 mb-1 sm:mb-2">Engagement Score</h3>
                    <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
                      <span className={`${
                        engagementScore >= 70 ? 'text-green-600' : 
                        engagementScore >= 50 ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        {engagementScore}%
                      </span>
                    </div>
                    <div className="text-xs sm:text-sm text-gray-500 mt-1">
                      Overall health
                    </div>
                  </div>
                  <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Required Section */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 hover:shadow-md transition-shadow duration-200">
                <div className="flex items-center mb-4">
                  <div className="w-2 h-8 bg-red-500 rounded mr-3"></div>
                  <h2 className="text-lg font-semibold text-gray-900">Requires Attention</h2>
                </div>
                <div className="space-y-3">
                  {atRiskMembers.length > 0 && (
                    <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg hover:bg-red-100 transition-colors duration-150">
                      <div className="flex-1 min-w-0">
                        <span className="font-medium text-red-900 text-sm sm:text-base">At-Risk Members</span>
                        <p className="text-xs sm:text-sm text-red-700 mt-1">Joined 30+ days ago, no contributions</p>
                      </div>
                      <span className="bg-red-500 text-white px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-bold ml-3 flex-shrink-0">
                        {atRiskMembers.length}
                      </span>
                    </div>
                  )}
                  
                  {incompleteProfiles > 0 && (
                    <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg hover:bg-yellow-100 transition-colors duration-150">
                      <div className="flex-1 min-w-0">
                        <span className="font-medium text-yellow-900 text-sm sm:text-base">Incomplete Profiles</span>
                        <p className="text-xs sm:text-sm text-yellow-700 mt-1">Missing photo or email</p>
                      </div>
                      <span className="bg-yellow-500 text-white px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-bold ml-3 flex-shrink-0">
                        {incompleteProfiles}
                      </span>
                    </div>
                  )}
                  
                  {needsWelcome > 0 && (
                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors duration-150">
                      <div className="flex-1 min-w-0">
                        <span className="font-medium text-blue-900 text-sm sm:text-base">New Members</span>
                        <p className="text-xs sm:text-sm text-blue-700 mt-1">Need welcome follow-up</p>
                      </div>
                      <span className="bg-blue-500 text-white px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-bold ml-3 flex-shrink-0">
                        {needsWelcome}
                      </span>
                    </div>
                  )}

                  {atRiskMembers.length === 0 && incompleteProfiles === 0 && needsWelcome === 0 && (
                    <div className="text-center py-6 sm:py-8 text-gray-500">
                      <div className="text-green-500 text-3xl sm:text-4xl mb-3">✓</div>
                      <p className="text-sm sm:text-base">All members are up to date!</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 hover:shadow-md transition-shadow duration-200">
                <div className="flex items-center mb-4">
                  <div className="w-2 h-8 bg-green-500 rounded mr-3"></div>
                  <h2 className="text-lg font-semibold text-gray-900">Opportunities</h2>
                </div>
                <div className="space-y-3">
                  {urgentBirthdays.length > 0 && (
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors duration-150">
                      <div className="flex-1 min-w-0">
                        <span className="font-medium text-green-900 text-sm sm:text-base">Birthdays This Week</span>
                        <p className="text-xs sm:text-sm text-green-700 mt-1">Send birthday wishes</p>
                      </div>
                      <span className="bg-green-500 text-white px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-bold ml-3 flex-shrink-0">
                        {urgentBirthdays.length}
                      </span>
                    </div>
                  )}
                  
                  {topContributors.length > 0 && (
                    <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors duration-150">
                      <div className="flex-1 min-w-0">
                        <span className="font-medium text-purple-900 text-sm sm:text-base">Top Contributors</span>
                        <p className="text-xs sm:text-sm text-purple-700 mt-1">Recognize their efforts</p>
                      </div>
                      <span className="bg-purple-500 text-white px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-bold ml-3 flex-shrink-0">
                        {topContributors.length}
                      </span>
                    </div>
                  )}

                  <div className="flex items-center justify-between p-3 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors duration-150">
                    <div className="flex-1 min-w-0">
                      <span className="font-medium text-indigo-900 text-sm sm:text-base">Volunteer Potential</span>
                      <p className="text-xs sm:text-sm text-indigo-700 mt-1">Active members without roles</p>
                    </div>
                    <span className="bg-indigo-500 text-white px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-bold ml-3 flex-shrink-0">
                      {Math.max(0, activeMembersCount - topContributors.length)}
                    </span>
                  </div>
                </div>
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
                          <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                            church.engagementRate >= 70 ? 'bg-green-100 text-green-800' :
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

            {/* Demographics */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 hover:shadow-md transition-shadow duration-200">
                <h2 className="text-lg font-semibold mb-4 text-gray-900">Gender Split</h2>
                <div className="flex justify-center mb-4">
                  <div className="w-36 h-36 sm:w-44 sm:h-44">
                    <Doughnut 
                      data={genderRatioChartData} 
                      options={{ 
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: { 
                          legend: { display: false },
                          datalabels: {
                            color: 'white',
                            font: { weight: 'bold', size: 14 },
                            formatter: (value) => value
                          },
                          tooltip: {
                            backgroundColor: 'rgba(0, 0, 0, 0.8)',
                            titleColor: 'white',
                            bodyColor: 'white',
                            cornerRadius: 6
                          }
                        } 
                      }} 
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="w-3 h-3 bg-blue-500 rounded-full mx-auto mb-2"></div>
                    <div className="text-lg sm:text-xl font-bold">{maleCount}</div>
                    <div className="text-xs sm:text-sm text-gray-600">Male</div>
                  </div>
                  <div>
                    <div className="w-3 h-3 bg-orange-500 rounded-full mx-auto mb-2"></div>
                    <div className="text-lg sm:text-xl font-bold">{femaleCount}</div>
                    <div className="text-xs sm:text-sm text-gray-600">Female</div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 hover:shadow-md transition-shadow duration-200">
                <h2 className="text-lg font-semibold mb-4 text-gray-900">Age Groups</h2>
                <div className="h-44 sm:h-48">
                  <Bar data={ageDistributionChartData} options={{
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
                        title: { display: true, text: 'Age Group', font: { size: 10 } },
                        grid: { display: false },
                        ticks: { font: { size: 9 } }
                      }, 
                      y: { 
                        title: { display: true, text: 'Members', font: { size: 10 } }, 
                        beginAtZero: true,
                        ticks: { font: { size: 9 } }
                      } 
                    }
                  }} />
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 hover:shadow-md transition-shadow duration-200 md:col-span-2 xl:col-span-1">
                <h2 className="text-lg font-semibold mb-4 text-gray-900">Recent Activity</h2>
                <div className="space-y-3 max-h-44 sm:max-h-48 overflow-y-auto">
                  {newMembersThisMonth.slice(0, 5).map(m => (
                    <div key={m.id} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors duration-150">
                      {m.image_url ? (
                        <img src={m.image_url} alt="avatar" className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-gray-200" />
                      ) : (
                        <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-white text-xs sm:text-sm font-bold border-2 border-opacity-20 ${
                          m.gender === 'Male' ? 'bg-blue-500 border-blue-300' : 'bg-pink-500 border-pink-300'
                        }`}>
                          {m.first_name[0]}
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{m.first_name} {m.last_name}</p>
                        <p className="text-xs text-gray-500">{new Date(m.created_at).toLocaleDateString()}</p>
                      </div>
                      <div className="text-xs text-gray-400">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                  ))}
                  {newMembersThisMonth.length === 0 && (
                    <div className="text-center py-6 sm:py-8 text-gray-500">
                      <div className="text-gray-400 text-2xl sm:text-3xl mb-2">📊</div>
                      <p className="text-xs sm:text-sm">No recent activity</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 hover:shadow-md transition-shadow duration-200">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
                <div className="text-xs sm:text-sm text-gray-500">
                  Choose an action to get started
                </div>
              </div>
              <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2 sm:gap-3">
                <button className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 sm:px-4 sm:py-2 rounded-lg transition duration-200 text-xs sm:text-sm font-medium shadow-sm hover:shadow focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                  <span className="flex items-center justify-center sm:justify-start">
                    <svg className="w-4 h-4 sm:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    <span className="hidden sm:inline">Add Member</span>
                  </span>
                </button>
                <button 
                  className="bg-green-500 hover:bg-green-600 text-white px-3 py-2 sm:px-4 sm:py-2 rounded-lg transition duration-200 text-xs sm:text-sm font-medium shadow-sm hover:shadow focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
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
                >
                  <span className="flex items-center justify-center sm:justify-start">
                    <svg className="w-4 h-4 sm:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span className="hidden sm:inline">Export Report</span>
                  </span>
                </button>
                <button className="bg-purple-500 hover:bg-purple-600 text-white px-3 py-2 sm:px-4 sm:py-2 rounded-lg transition duration-200 text-xs sm:text-sm font-medium shadow-sm hover:shadow focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2">
                  <span className="flex items-center justify-center sm:justify-start">
                    <svg className="w-4 h-4 sm:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM4 13v6a1 1 0 001 1h6M4 5v6a1 1 0 001 1h6M20 3a1 1 0 011 1v6M10 3h6a1 1 0 011 1v6" />
                    </svg>
                    <span className="hidden sm:inline">Send Notifications</span>
                  </span>
                </button>
                <button className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-2 sm:px-4 sm:py-2 rounded-lg transition duration-200 text-xs sm:text-sm font-medium shadow-sm hover:shadow focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2">
                  <span className="flex items-center justify-center sm:justify-start">
                    <svg className="w-4 h-4 sm:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="hidden sm:inline">Schedule Event</span>
                  </span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
