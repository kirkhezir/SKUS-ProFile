import { useEffect, useState, useMemo } from 'react';
import { api } from '../services/api';
import { Bar, Pie, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const DISTRICTS = [
  'Suphan Buri',
  'Kanchanaburi',
  'Uthai Thani',
  'Sing Buri',
];

// Sample member data
const sampleMembers = [
  {
    id: 1,
    first_name: 'Somchai',
    last_name: 'Sukjai',
    email: 'somchai@example.com',
    gender: 'Male',
    district: 'Suphan Buri',
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
    district: 'Kanchanaburi',
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
    district: 'Uthai Thani',
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
    district: 'Sing Buri',
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
    district: 'Suphan Buri',
    image_url: '',
    created_at: '2025-07-15',
    contributions: 1,
    age: 22,
  },
];

export default function Dashboard() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterDistrict, setFilterDistrict] = useState('All');
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

  // Count members per district
  const districtCounts = DISTRICTS.map(district => ({
    name: district,
    count: members.filter(m => m.district === district).length,
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
        backgroundColor: ['#3b82f6', '#f59e42'],
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
      (filterDistrict === 'All' || m.district === filterDistrict) &&
      (filterGender === 'All' || m.gender === filterGender)
    );
  }, [members, filterDistrict, filterGender]);

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

  // Chart data for members by district
  const membersByDistrictChartData = {
    labels: districtCounts.map(d => d.name),
    datasets: [
      {
        label: 'Members',
        data: districtCounts.map(d => d.count),
        backgroundColor: [
          '#3b82f6', '#6366f1', '#10b981', '#f59e42'
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

  // Retention rate (placeholder: percent of members with contributions > 0)
  const retentionRate = members.length > 0 ? Math.round((members.filter(m => m.contributions > 0).length / members.length) * 100) : 0;

  // Most active districts (by total contributions)
  const districtActivity = DISTRICTS.map(district => ({
    name: district,
    total: members.filter(m => m.district === district).reduce((sum, m) => sum + (m.contributions || 0), 0)
  }));
  const mostActiveDistricts = [...districtActivity].sort((a, b) => b.total - a.total).slice(0, 3);

  // Notifications (sample)
  const notifications = [
    { id: 1, message: 'Member profile updated', date: '2025-07-16' },
    { id: 2, message: 'New member joined', date: '2025-07-15' },
    { id: 3, message: 'District event scheduled', date: '2025-07-14' },
  ];

  // Admin notes (sample)
  const adminNotes = [
    { id: 1, note: 'Welcome new members!', date: '2025-07-01' },
    { id: 2, note: 'Please update your profiles.', date: '2025-07-10' },
  ];

  // Member map (placeholder: show district counts)
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
      <h1 className="text-2xl font-bold mb-6">SKUS ProFile Dashboard</h1>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Quick Stats + Gender Ratio */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-4">Quick Stats</h2>
              <ul>
                <li className="flex justify-between py-2 border-b last:border-b-0">
                  <span>Total Members</span>
                  <span className="font-bold">{totalMembers || 0}</span>
                </li>
                <li className="flex justify-between py-2 border-b last:border-b-0">
                  <span>Male</span>
                  <span className="font-bold">{maleCount || 0}</span>
                </li>
                <li className="flex justify-between py-2 border-b last:border-b-0">
                  <span>Female</span>
                  <span className="font-bold">{femaleCount || 0}</span>
                </li>
              </ul>
              {/* Gender Ratio Chart */}
              <div className="mt-6">
                <h3 className="text-md font-semibold mb-2">Gender Ratio</h3>
                <div className="flex justify-center">
                  <div style={{ maxWidth: 150, width: '100%' }}>
                    <Doughnut data={genderRatioChartData} />
                  </div>
                </div>
              </div>
            </div>
            {/* New Members & Upcoming Birthdays (merged) */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-4">New Members & Upcoming Birthdays</h2>
              <div className="mb-2">
                <h3 className="text-md font-semibold mb-1">New Members This Month</h3>
                <ul>
                  {newMembersThisMonth.length === 0 ? (
                    <li className="text-gray-400">No new members this month.</li>
                  ) : (
                    newMembersThisMonth.map(m => (
                      <li key={m.id} className="flex items-center py-2 border-b last:border-b-0">
                        <span>{m.first_name} {m.last_name}</span>
                        <span className="ml-auto text-xs text-gray-500">{new Date(m.created_at).toLocaleDateString()}</span>
                      </li>
                    ))
                  )}
                </ul>
              </div>
              <div>
                <h3 className="text-md font-semibold mb-1">Upcoming Birthdays</h3>
                <ul>
                  {upcomingBirthdays.length === 0 ? (
                    <li className="text-gray-400">No upcoming birthdays.</li>
                  ) : (
                    upcomingBirthdays.map(m => (
                      <li key={m.id} className="flex items-center py-2 border-b last:border-b-0">
                        <span>{m.first_name} {m.last_name}</span>
                        <span className="ml-auto text-xs text-gray-500">{new Date(m.birthday).toLocaleDateString()}</span>
                      </li>
                    ))
                  )}
                </ul>
              </div>
            </div>
            {/* Engagement Overview (Retention Rate + Most Active Districts merged) */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-4">Engagement Overview</h2>
              <div className="mb-4">
                <div className="text-3xl font-bold text-blue-600 mb-2">{retentionRate}%</div>
                <div className="text-gray-500 mb-2">Member Retention Rate (Members with contributions &gt; 0)</div>
              </div>
              <div>
                <h3 className="text-md font-semibold mb-2">Most Active Districts</h3>
                <ul>
                  {mostActiveDistricts.map(d => (
                    <li key={d.name} className="flex justify-between py-2 border-b last:border-b-0">
                      <span>{d.name}</span>
                      <span className="font-bold">{d.total}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            {/* Member Age Distribution */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-4">Member Age Distribution</h2>
              <div className="mb-4 flex justify-center">
                <div style={{ maxWidth: 300, width: '100%' }}>
                  <Bar data={ageDistributionChartData} options={{
                    responsive: true,
                    plugins: { legend: { display: false } },
                    scales: { x: { title: { display: true, text: 'Age Group' } }, y: { title: { display: true, text: 'Members' }, beginAtZero: true } }
                  }} />
                </div>
              </div>
            </div>
            {/* ...existing code... */}
            {/* Members by District & Map (merged) */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-4">Members by District & Map</h2>
              <div className="mb-4 flex justify-center">
                <div style={{ maxWidth: 300, width: '100%' }}>
                  <Pie data={membersByDistrictChartData} />
                </div>
              </div>
              <ul>
                {districtCounts.map(d => (
                  <li key={d.name} className="flex justify-between py-2 border-b last:border-b-0">
                    <span>{d.name}</span>
                    <span className="font-bold">{d.count || 0}</span>
                  </li>
                ))}
              </ul>
              <div className="text-xs text-gray-500 mt-2">(Map visualization coming soon)</div>
            </div>
            {/* Updates & Announcements (Notifications + Admin Notes merged) */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-4">Updates & Announcements</h2>
              <div className="mb-2">
                <h3 className="text-md font-semibold mb-1">Notifications</h3>
                <ul>
                  {notifications.map(n => (
                    <li key={n.id} className="flex justify-between py-2 border-b last:border-b-0">
                      <span>{n.message}</span>
                      <span className="text-xs text-gray-500">{n.date}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-md font-semibold mb-1">Admin Notes & Announcements</h3>
                <ul>
                  {adminNotes.map(n => (
                    <li key={n.id} className="flex justify-between py-2 border-b last:border-b-0">
                      <span>{n.note}</span>
                      <span className="text-xs text-gray-500">{n.date}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            {/* ...existing code... */}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-4">Member Growth Over Time</h2>
              <div className="mb-4">
                <Bar data={memberGrowthChartData} options={{
                  responsive: true,
                  plugins: { legend: { display: false } },
                  scales: { x: { title: { display: true, text: 'Month' } }, y: { title: { display: true, text: 'New Members' }, beginAtZero: true } }
                }} />
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr>
                      <th className="text-left py-2 px-2">Month</th>
                      <th className="text-left py-2 px-2">New Members</th>
                    </tr>
                  </thead>
                  <tbody>
                    {growthData.length === 0 ? (
                      <tr><td colSpan={2} className="py-2 px-2 text-gray-400">No data yet</td></tr>
                    ) : (
                      growthData.map(([month, count]) => (
                        <tr key={month}>
                          <td className="py-1 px-2">{month}</td>
                          <td className="py-1 px-2 font-bold">{count}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-4">Top Contributors</h2>
              <ul>
                {topContributors.length === 0 ? (
                  <li className="text-gray-400">No contributor data available.</li>
                ) : (
                  topContributors.map(m => (
                    <li key={m.id} className="flex items-center py-2 border-b last:border-b-0">
                      <img src={m.image_url || '/default-avatar.png'} alt="avatar" className="w-8 h-8 rounded-full mr-3" />
                      <span>{m.first_name} {m.last_name}</span>
                      <span className="ml-auto font-bold">{m.contributions}</span>
                    </li>
                  ))
                )}
              </ul>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Recent Activity & Logins (merged) */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-4">Recent Activity & Logins</h2>
              <div className="mb-2">
                <h3 className="text-md font-semibold mb-1">Recent Activity</h3>
                <ul>
                  {recentActivity.length === 0 ? (
                    <li className="text-gray-400">No recent activity yet.</li>
                  ) : (
                    recentActivity.map(m => (
                      <li key={m.id} className="flex items-center py-2 border-b last:border-b-0">
                        <img src={m.image_url || '/default-avatar.png'} alt="avatar" className="w-8 h-8 rounded-full mr-3" />
                        <span>{m.first_name} {m.last_name}</span>
                        <span className="ml-auto text-xs text-gray-500">{new Date(m.created_at).toLocaleDateString()}</span>
                      </li>
                    ))
                  )}
                </ul>
              </div>
              <div>
                <h3 className="text-md font-semibold mb-1">Recent Logins</h3>
                <ul>
                  {recentLogins.map(l => (
                    <li key={l.id} className="flex justify-between py-2 border-b last:border-b-0">
                      <span>{l.name}</span>
                      <span className="text-xs text-gray-500">{l.date}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            {/* Filter Members + Tags (merged) */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-4">Filter Members & Tags</h2>
              <div className="mb-4 flex gap-2">
                <select value={filterDistrict} onChange={e => setFilterDistrict(e.target.value)} className="border rounded px-2 py-1">
                  <option value="All">All Districts</option>
                  {DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
                <select value={filterGender} onChange={e => setFilterGender(e.target.value)} className="border rounded px-2 py-1">
                  <option value="All">All Genders</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
              <div className="mb-4">
                <h3 className="text-md font-semibold mb-1">Member Tags / Groups</h3>
                <ul className="flex flex-wrap gap-2">
                  {memberTags.map(t => (
                    <li key={t.id} className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">{t.tag}</li>
                  ))}
                </ul>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr>
                      <th className="text-left py-2 px-2">Name</th>
                      <th className="text-left py-2 px-2">District</th>
                      <th className="text-left py-2 px-2">Gender</th>
                      <th className="text-left py-2 px-2">Email</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredMembers.length === 0 ? (
                      <tr><td colSpan={4} className="py-2 px-2 text-gray-400">No members yet</td></tr>
                    ) : (
                      filteredMembers.map(m => (
                        <tr key={m.id}>
                          <td className="py-1 px-2">{m.first_name} {m.last_name}</td>
                          <td className="py-1 px-2">{m.district}</td>
                          <td className="py-1 px-2">{m.gender}</td>
                          <td className="py-1 px-2">{m.email}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6 mt-8">
            <h2 className="text-lg font-semibold mb-4">Export Member Data</h2>
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              onClick={() => {
                const csv = [
                  ['Name', 'District', 'Gender', 'Email'],
                  ...members.map(m => [m.first_name + ' ' + m.last_name, m.district, m.gender, m.email])
                ].map(row => row.join(',')).join('\n');
                const blob = new Blob([csv], { type: 'text/csv' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'members.csv';
                a.click();
                URL.revokeObjectURL(url);
              }}
            >
              Export CSV
            </button>
          </div>
          <div className="bg-white rounded-lg shadow p-6 mt-8">
            <h2 className="text-lg font-semibold mb-4">More Dashboard Suggestions</h2>
            <ul className="list-disc ml-6">
              <li>Show member age distribution (add a chart)</li>
              <li>Display upcoming birthdays or anniversaries</li>
              <li>Highlight new members this month</li>
              <li>Show member retention rate</li>
              <li>Display most active districts</li>
              <li>Show average contributions per member</li>
              <li>Integrate notifications for important updates</li>
              <li>Allow admins to add notes or announcements</li>
              <li>Show a leaderboard for member engagement</li>
              <li>Display a map of member locations</li>
              <li>Show recent logins or activity timestamps</li>
              <li>Enable custom member tags or groups</li>
              <li>Show gender ratio as a chart</li>
              <li>Display member contact statistics</li>
              <li>Integrate with external data sources (e.g., Google Sheets)</li>
            </ul>
          </div>
        </>
      )}
    </div>
  );
}
