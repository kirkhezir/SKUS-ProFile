import React, { useState, useMemo } from 'react';
import { DISTRICTS, sampleMembers } from './Dashboard';

// Add custom scrollbar styles
const customScrollbarStyles = `
  .custom-scrollbar::-webkit-scrollbar {
    width: 6px;
  }
  .custom-scrollbar::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 3px;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 3px;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: #a1a1a1;
  }
`;

// Add styles to head
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = customScrollbarStyles;
  document.head.appendChild(style);
}

const TAGS = ['Committee', 'Volunteer', 'Alumni'];

function exportCSV(members) {
  const csv = [
    ['Name', 'District', 'Gender', 'Email', 'Tags'],
    ...members.map(m => [
      m.first_name + ' ' + m.last_name,
      m.district,
      m.gender,
      m.email,
      (m.tags || []).join('; ')
    ])
  ].map(row => row.join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'members.csv';
  a.click();
  URL.revokeObjectURL(url);
}

export default function Members() {
  const [members, setMembers] = useState(sampleMembers.map(m => ({ ...m, tags: [] })));
  const [search, setSearch] = useState('');
  const [filterDistrict, setFilterDistrict] = useState('All');
  const [filterGender, setFilterGender] = useState('All');
  const [filterTag, setFilterTag] = useState('All');
  const [selected, setSelected] = useState([]);
  const [showProfile, setShowProfile] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(null);
  const [newMember, setNewMember] = useState({ first_name: '', last_name: '', email: '', gender: 'Male', district: DISTRICTS[0], tags: [] });
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Filtered and searched members
  const filteredMembers = useMemo(() => {
    return members.filter(m =>
      (filterDistrict === 'All' || m.district === filterDistrict) &&
      (filterGender === 'All' || m.gender === filterGender) &&
      (filterTag === 'All' || (m.tags || []).includes(filterTag)) &&
      (`${m.first_name} ${m.last_name}`.toLowerCase().includes(search.toLowerCase()) || m.email.toLowerCase().includes(search.toLowerCase()))
    );
  }, [members, filterDistrict, filterGender, filterTag, search]);

  // Pagination
  const totalPages = Math.ceil(filteredMembers.length / pageSize);
  const pagedMembers = filteredMembers.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  // Bulk select
  const toggleSelect = id => {
    setSelected(selected.includes(id) ? selected.filter(s => s !== id) : [...selected, id]);
  };
  const selectAll = () => {
    setSelected(pagedMembers.map(m => m.id));
  };
  const clearSelected = () => setSelected([]);

  // Add member
  const handleAdd = () => {
    setMembers([...members, { ...newMember, id: members.length + 1 }]);
    setShowAdd(false);
    setNewMember({ first_name: '', last_name: '', email: '', gender: 'Male', district: DISTRICTS[0], tags: [] });
  };

  // Edit member (UI only)
  const handleEdit = (id, updated) => {
    setMembers(members.map(m => m.id === id ? { ...m, ...updated } : m));
    setShowProfile(null);
  };

  // Delete member
  const handleDelete = id => {
    setMembers(members.filter(m => m.id !== id));
    setShowProfile(null);
  };
  const handleBulkDelete = () => {
    setMembers(members.filter(m => !selected.includes(m.id)));
    clearSelected();
  };

  // Tag assignment
  const assignTag = (id, tag) => {
    setMembers(members.map(m => m.id === id ? { ...m, tags: [...(m.tags || []), tag] } : m));
  };
  const removeTag = (id, tag) => {
    setMembers(members.map(m => m.id === id ? { ...m, tags: (m.tags || []).filter(t => t !== tag) } : m));
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-8 text-gray-900">Members</h1>
      <div className="mb-6 flex flex-wrap gap-3 items-center bg-white p-4 rounded-lg shadow border border-gray-200">
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search name or email" className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" />
        <select value={filterDistrict} onChange={e => setFilterDistrict(e.target.value)} className="border border-gray-300 rounded-lg px-3 py-2">
          <option value="All">All Districts</option>
          {DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
        </select>
        <select value={filterGender} onChange={e => setFilterGender(e.target.value)} className="border border-gray-300 rounded-lg px-3 py-2">
          <option value="All">All Genders</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>
        <select value={filterTag} onChange={e => setFilterTag(e.target.value)} className="border border-gray-300 rounded-lg px-3 py-2">
          <option value="All">All Tags</option>
          {TAGS.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition" onClick={() => setShowAdd(true)}>Add Member</button>
        <button className="bg-green-500 text-white px-4 py-2 rounded-lg shadow hover:bg-green-600 transition" onClick={() => exportCSV(filteredMembers)}>Export CSV</button>
        <button className={`bg-red-500 text-white px-4 py-2 rounded-lg shadow hover:bg-red-600 transition ${selected.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`} onClick={handleBulkDelete} disabled={selected.length === 0}>Delete Selected</button>
      </div>
      <div className="overflow-x-auto rounded-lg shadow border border-gray-200 bg-white">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50 sticky top-0 z-10">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Select</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Avatar</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">District</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Gender</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Tags</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {pagedMembers.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-6 px-6 text-center text-gray-400">No members found</td>
              </tr>
            ) : (
              pagedMembers.map(m => (
                <tr key={m.id} className={`hover:bg-blue-50 transition ${selected.includes(m.id) ? 'bg-blue-100' : ''}`}>
                  <td className="px-6 py-4">
                    <input type="checkbox" checked={selected.includes(m.id)} onChange={() => toggleSelect(m.id)} className="form-checkbox h-4 w-4 text-blue-600" />
                  </td>
                  <td className="px-6 py-4">
                    <img src={m.image_url || '/default-avatar.png'} alt="avatar" className="w-10 h-10 rounded-full border border-gray-300 shadow-sm" />
                  </td>
                  <td className="px-6 py-4 font-semibold text-gray-900">{m.first_name} {m.last_name}</td>
                  <td className="px-6 py-4">
                    <span className="inline-block bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-medium">{m.district}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${m.gender === 'Male' ? 'bg-blue-200 text-blue-800' : 'bg-orange-100 text-orange-800'}`}>{m.gender}</span>
                  </td>
                  <td className="px-6 py-4 text-gray-700">{m.email}</td>
                  <td className="px-6 py-4">
                    {(m.tags || []).length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {m.tags.map(tag => (
                          <span key={tag} className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full text-xs">{tag}</span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-gray-400 text-xs">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {/* View Icon */}
                    <button title="View" className="p-1 mr-2" style={{ color: '#2563eb', background: '#eff6ff', borderRadius: '6px' }} onClick={() => setShowProfile(m)}>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                    </button>
                    {/* Edit Icon */}
                    <button title="Edit" className="p-1 mr-2" style={{ color: '#059669', background: '#ecfdf5', borderRadius: '6px' }} onClick={() => setShowEdit(m)}>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 20h9" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16.5 3.5a2.121 2.121 0 113 3L7 19l-4 1 1-4 12.5-12.5z" /></svg>
                    </button>
                    {/* Delete Icon (Trash) */}
                    <button title="Delete" className="p-1" style={{ color: '#dc2626', background: '#fef2f2', borderRadius: '6px' }} onClick={() => handleDelete(m.id)}>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 7V4a1 1 0 011-1h4a1 1 0 011 1v3m-7 0h10" /></svg>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {/* Pagination */}
      <div className="flex gap-2 mt-4">
        <button onClick={() => setCurrentPage(1)} disabled={currentPage === 1}>First</button>
        <button onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}>Prev</button>
        <span>Page {currentPage} of {totalPages}</span>
        <button onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages}>Next</button>
        <button onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages}>Last</button>
      </div>
      {/* Member Profile Modal */}
      {showProfile && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-2">Member Profile</h2>
            <div className="mb-2">Name: {showProfile.first_name} {showProfile.last_name}</div>
            <div className="mb-2">Email: {showProfile.email}</div>
            <div className="mb-2">District: {showProfile.district}</div>
            <div className="mb-2">Gender: {showProfile.gender}</div>
            <div className="mb-2">Tags: {(showProfile.tags || []).join(', ')}</div>
            <div className="mb-2">Contributions: {showProfile.contributions || 0}</div>
            <div className="mb-2">Joined: {showProfile.created_at}</div>
            <div className="mb-2">Age: {showProfile.age}</div>
            <div className="mb-2 flex gap-2">
              {TAGS.map(tag => (
                showProfile.tags && showProfile.tags.includes(tag) ? (
                  <button key={tag} className="bg-red-100 text-red-700 px-2 py-1 rounded" onClick={() => removeTag(showProfile.id, tag)}>Remove {tag}</button>
                ) : (
                  <button key={tag} className="bg-blue-100 text-blue-700 px-2 py-1 rounded" onClick={() => assignTag(showProfile.id, tag)}>Add {tag}</button>
                )
              ))}
            </div>
            <button className="mt-4 bg-gray-300 px-4 py-1 rounded" onClick={() => setShowProfile(null)}>Close</button>
          </div>
        </div>
      )}
      {/* Edit Member Modal */}
      {showEdit && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md transform transition-all max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-center mb-6 flex-shrink-0">
              <h2 className="text-2xl font-bold text-gray-800">Edit Member</h2>
              <button onClick={() => setShowEdit(null)} className="text-gray-500 hover:text-gray-700 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="space-y-4 overflow-y-auto flex-grow pr-2 custom-scrollbar">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                <input 
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors" 
                  placeholder="Enter first name" 
                  value={showEdit.first_name} 
                  onChange={e => setShowEdit({ ...showEdit, first_name: e.target.value })} 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                <input 
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors" 
                  placeholder="Enter last name" 
                  value={showEdit.last_name} 
                  onChange={e => setShowEdit({ ...showEdit, last_name: e.target.value })} 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input 
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors" 
                  placeholder="Enter email address" 
                  value={showEdit.email} 
                  onChange={e => setShowEdit({ ...showEdit, email: e.target.value })} 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                <select 
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors" 
                  value={showEdit.gender} 
                  onChange={e => setShowEdit({ ...showEdit, gender: e.target.value })}
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">District</label>
                <select 
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors" 
                  value={showEdit.district} 
                  onChange={e => setShowEdit({ ...showEdit, district: e.target.value })}
                >
                  {DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
                <div className="flex flex-wrap gap-2">
                  {TAGS.map(tag => (
                    <label key={tag} className="inline-flex items-center">
                      <input 
                        type="checkbox" 
                        className="form-checkbox h-4 w-4 text-blue-600 transition duration-150 ease-in-out" 
                        checked={(showEdit.tags || []).includes(tag)} 
                        onChange={e => {
                          if (e.target.checked) setShowEdit({ ...showEdit, tags: [...(showEdit.tags || []), tag] });
                          else setShowEdit({ ...showEdit, tags: (showEdit.tags || []).filter(t => t !== tag) });
                        }} 
                      />
                      <span className="ml-2 text-sm text-gray-700">{tag}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-8 flex-shrink-0 pt-4 border-t border-gray-100">
              <button 
                className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors" 
                onClick={() => setShowEdit(null)}
              >
                Cancel
              </button>
              <button 
                className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors" 
                onClick={() => {
                  handleEdit(showEdit.id, showEdit);
                  setShowEdit(null);
                }}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Add Member Modal */}
      {showAdd && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md transform transition-all max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-center mb-6 flex-shrink-0">
              <h2 className="text-2xl font-bold text-gray-800">Add New Member</h2>
              <button onClick={() => setShowAdd(false)} className="text-gray-500 hover:text-gray-700 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="space-y-4 overflow-y-auto flex-grow pr-2 custom-scrollbar">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                <input 
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors" 
                  placeholder="Enter first name" 
                  value={newMember.first_name} 
                  onChange={e => setNewMember({ ...newMember, first_name: e.target.value })} 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                <input 
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors" 
                  placeholder="Enter last name" 
                  value={newMember.last_name} 
                  onChange={e => setNewMember({ ...newMember, last_name: e.target.value })} 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input 
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors" 
                  placeholder="Enter email address" 
                  value={newMember.email} 
                  onChange={e => setNewMember({ ...newMember, email: e.target.value })} 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                <select 
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors" 
                  value={newMember.gender} 
                  onChange={e => setNewMember({ ...newMember, gender: e.target.value })}
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">District</label>
                <select 
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors" 
                  value={newMember.district} 
                  onChange={e => setNewMember({ ...newMember, district: e.target.value })}
                >
                  {DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
                <div className="flex flex-wrap gap-2">
                  {TAGS.map(tag => (
                    <label key={tag} className="inline-flex items-center">
                      <input 
                        type="checkbox" 
                        className="form-checkbox h-4 w-4 text-blue-600 transition duration-150 ease-in-out" 
                        checked={newMember.tags.includes(tag)} 
                        onChange={e => {
                          if (e.target.checked) setNewMember({ ...newMember, tags: [...newMember.tags, tag] });
                          else setNewMember({ ...newMember, tags: newMember.tags.filter(t => t !== tag) });
                        }} 
                      />
                      <span className="ml-2 text-sm text-gray-700">{tag}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-8 flex-shrink-0 pt-4 border-t border-gray-100">
              <button 
                className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors" 
                onClick={() => setShowAdd(false)}
              >
                Cancel
              </button>
              <button 
                className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors" 
                onClick={handleAdd}
              >
                Add Member
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
