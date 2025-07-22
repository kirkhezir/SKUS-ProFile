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
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Church Member Dashboard</h1>
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-gray-600">Loading dashboard...</div>
        </div>
      ) : (
        <>
          {/* Executive Summary - Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
              <h3 className="text-sm font-medium text-gray-600 mb-2">Total Members</h3>
              <div className="text-3xl font-bold text-gray-900">{totalMembers}</div>
              <div className="text-sm text-gray-500 mt-1">
                {newMembersThisMonth.length} new this month
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
              <h3 className="text-sm font-medium text-gray-600 mb-2">Monthly Growth</h3>
              <div className="text-3xl font-bold text-gray-900">
                {monthlyGrowthRate >= 0 ? '+' : ''}{monthlyGrowthRate}%
              </div>
              <div className="text-sm text-gray-500 mt-1">
                vs. last month
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow p-6 border-l-4 border-yellow-500">
              <h3 className="text-sm font-medium text-gray-600 mb-2">Active Members</h3>
              <div className="text-3xl font-bold text-gray-900">{activeMembersCount}</div>
              <div className="text-sm text-gray-500 mt-1">
                {inactiveMembers.length} inactive
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow p-6 border-l-4 border-purple-500">
              <h3 className="text-sm font-medium text-gray-600 mb-2">Engagement Score</h3>
              <div className="text-3xl font-bold text-gray-900">{engagementScore}%</div>
              <div className="text-sm text-gray-500 mt-1">
                Overall health
              </div>
            </div>
          </div>

          {/* Action Required Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center mb-4">
                <div className="w-2 h-8 bg-red-500 rounded mr-3"></div>
                <h2 className="text-lg font-semibold text-gray-900">Requires Attention</h2>
              </div>
              <div className="space-y-3">
                {atRiskMembers.length > 0 && (
                  <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                    <div>
                      <span className="font-medium text-red-900">At-Risk Members</span>
                      <p className="text-sm text-red-700">Joined 30+ days ago, no contributions</p>
                    </div>
                    <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                      {atRiskMembers.length}
                    </span>
                  </div>
                )}
                
                {incompleteProfiles > 0 && (
                  <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                    <div>
                      <span className="font-medium text-yellow-900">Incomplete Profiles</span>
                      <p className="text-sm text-yellow-700">Missing photo or email</p>
                    </div>
                    <span className="bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                      {incompleteProfiles}
                    </span>
                  </div>
                )}
                
                {needsWelcome > 0 && (
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div>
                      <span className="font-medium text-blue-900">New Members</span>
                      <p className="text-sm text-blue-700">Need welcome follow-up</p>
                    </div>
                    <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                      {needsWelcome}
                    </span>
                  </div>
                )}

                {atRiskMembers.length === 0 && incompleteProfiles === 0 && needsWelcome === 0 && (
                  <div className="text-center py-4 text-gray-500">
                    <div className="text-green-500 text-2xl mb-2">✓</div>
                    All members are up to date!
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center mb-4">
                <div className="w-2 h-8 bg-green-500 rounded mr-3"></div>
                <h2 className="text-lg font-semibold text-gray-900">Opportunities</h2>
              </div>
              <div className="space-y-3">
                {urgentBirthdays.length > 0 && (
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div>
                      <span className="font-medium text-green-900">Birthdays This Week</span>
                      <p className="text-sm text-green-700">Send birthday wishes</p>
                    </div>
                    <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                      {urgentBirthdays.length}
                    </span>
                  </div>
                )}
                
                {topContributors.length > 0 && (
                  <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                    <div>
                      <span className="font-medium text-purple-900">Top Contributors</span>
                      <p className="text-sm text-purple-700">Recognize their efforts</p>
                    </div>
                    <span className="bg-purple-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                      {topContributors.length}
                    </span>
                  </div>
                )}

                <div className="flex items-center justify-between p-3 bg-indigo-50 rounded-lg">
                  <div>
                    <span className="font-medium text-indigo-900">Volunteer Potential</span>
                    <p className="text-sm text-indigo-700">Active members without roles</p>
                  </div>
                  <span className="bg-indigo-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                    {Math.max(0, activeMembersCount - topContributors.length)}
                  </span>
                </div>
              </div>
            </div>
          </div>
          {/* Operational Analytics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-4">Church Performance</h2>
              <div className="space-y-4">
                {churchPerformance.map((church, index) => (
                  <div key={church.name} className="border-b last:border-b-0 pb-3 last:pb-0">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{church.name}</span>
                        {index === 0 && (
                          <span className="text-yellow-500 text-sm" title="Top Performing Church">👑</span>
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
                    <div className="grid grid-cols-3 gap-4 text-sm text-gray-600">
                      <div>
                        <span className="font-medium">{church.total}</span> total
                      </div>
                      <div>
                        <span className="font-medium">{church.active}</span> active
                      </div>
                      <div>
                        <span className="font-medium">{church.newThisMonth}</span> new
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-4">Member Growth Trend</h2>
              <Bar data={memberGrowthChartData} options={{
                responsive: true,
                plugins: { legend: { display: false } },
                scales: { 
                  x: { title: { display: true, text: 'Month' } }, 
                  y: { title: { display: true, text: 'New Members' }, beginAtZero: true } 
                }
              }} />
            </div>
          </div>

          {/* Demographics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-4">Gender Split</h2>
              <div className="flex justify-center mb-4">
                <div style={{ maxWidth: 180, width: '100%' }}>
                  <Doughnut 
                    data={genderRatioChartData} 
                    options={{ 
                      plugins: { 
                        legend: { display: false },
                        datalabels: {
                          color: 'white',
                          font: { weight: 'bold' },
                          formatter: (value) => value
                        }
                      } 
                    }} 
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="w-3 h-3 bg-blue-500 rounded-full mx-auto mb-1"></div>
                  <div className="text-lg font-bold">{maleCount}</div>
                  <div className="text-sm text-gray-600">Male</div>
                </div>
                <div>
                  <div className="w-3 h-3 bg-orange-500 rounded-full mx-auto mb-1"></div>
                  <div className="text-lg font-bold">{femaleCount}</div>
                  <div className="text-sm text-gray-600">Female</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-4">Age Groups</h2>
              <div className="h-48">
                <Bar data={ageDistributionChartData} options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: { legend: { display: false } },
                  scales: { 
                    x: { title: { display: true, text: 'Age Group' } }, 
                    y: { title: { display: true, text: 'Members' }, beginAtZero: true } 
                  }
                }} />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
              <div className="space-y-3">
                {newMembersThisMonth.slice(0, 4).map(m => (
                  <div key={m.id} className="flex items-center space-x-3">
                    {m.image_url ? (
                      <img src={m.image_url} alt="avatar" className="w-8 h-8 rounded-full" />
                    ) : (
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold ${
                        m.gender === 'Male' ? 'bg-blue-500' : 'bg-pink-500'
                      }`}>
                        {m.first_name[0]}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{m.first_name} {m.last_name}</p>
                      <p className="text-xs text-gray-500">{new Date(m.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))}
                {newMembersThisMonth.length === 0 && (
                  <p className="text-sm text-gray-500 text-center py-4">No recent activity</p>
                )}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
            <div className="flex flex-wrap gap-3">
              <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition duration-200">
                Add Member
              </button>
              <button 
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition duration-200"
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
                Export Report
              </button>
              <button className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg transition duration-200">
                Send Notifications
              </button>
              <button className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg transition duration-200">
                Schedule Event
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
