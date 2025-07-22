import React, { useState, useMemo, useCallback } from 'react';
import { sampleMembers, CHURCHES } from '../pages/Dashboard';

/**
 * Members Component
 * Comprehensive member management interface with responsive design
 * Features: search, filter, sort, pagination, CRUD operations
 */
const Members = () => {
  // Transform the sample members data to match expected format
  const transformedMembers = useMemo(() => 
    sampleMembers.map(member => ({
      id: member.id,
      name: `${member.first_name} ${member.last_name}`,
      email: member.email,
      phone: `+66-${Math.floor(Math.random() * 900000000) + 100000000}`,
      church: member.church,
      status: 'Active',
      joinDate: member.created_at,
      ministry: '',
      address: '',
      emergencyContact: '',
      notes: '',
      avatar: member.image_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(member.first_name + ' ' + member.last_name)}&background=3b82f6&color=ffffff&size=128`
    })), []);

  // State management
  const [members, setMembers] = useState(transformedMembers);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedChurch, setSelectedChurch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('view'); // 'view', 'edit', 'add'
  const [selectedMember, setSelectedMember] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    church: '',
    status: 'Active',
    joinDate: '',
    ministry: '',
    address: '',
    emergencyContact: '',
    notes: ''
  });

  const itemsPerPage = 10;

  // Status configuration
  const statusConfig = {
    Active: { bg: 'bg-green-100', text: 'text-green-800' },
    Inactive: { bg: 'bg-red-100', text: 'text-red-800' },
    Visitor: { bg: 'bg-yellow-100', text: 'text-yellow-800' }
  };

  /**
   * Filtered and sorted members with optimized performance
   */
  const filteredMembers = useMemo(() => {
    let filtered = members.filter(member => {
      const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           member.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesChurch = !selectedChurch || member.church === selectedChurch;
      const matchesStatus = !selectedStatus || member.status === selectedStatus;
      
      return matchesSearch && matchesChurch && matchesStatus;
    });

    // Sort members
    filtered.sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];
      
      if (sortBy === 'joinDate') {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }
      
      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [members, searchTerm, selectedChurch, selectedStatus, sortBy, sortOrder]);

  /**
   * Paginated members
   */
  const paginatedMembers = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredMembers.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredMembers, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredMembers.length / itemsPerPage);

  /**
   * Handle sorting with optimized state updates
   */
  const handleSort = useCallback((field) => {
    if (sortBy === field) {
      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  }, [sortBy]);

  /**
   * Handle modal operations
   */
  const handleModalOpen = useCallback((type, member = null) => {
    setModalType(type);
    setSelectedMember(member);
    if (type === 'add') {
      setFormData({
        name: '',
        email: '',
        phone: '',
        church: '',
        status: 'Active',
        joinDate: '',
        ministry: '',
        address: '',
        emergencyContact: '',
        notes: ''
      });
    } else if (type === 'edit' && member) {
      setFormData(member);
    }
    setShowModal(true);
  }, []);

  /**
   * Handle form submission
   */
  const handleFormSubmit = useCallback((e) => {
    e.preventDefault();
    if (modalType === 'add') {
      const newMember = {
        ...formData,
        id: Math.max(...members.map(m => m.id)) + 1,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name)}&background=3b82f6&color=ffffff&size=128`
      };
      setMembers(prev => [...prev, newMember]);
    } else if (modalType === 'edit') {
      setMembers(prev => prev.map(m => m.id === selectedMember.id ? { ...m, ...formData } : m));
    }
    setShowModal(false);
  }, [modalType, formData, members, selectedMember]);

  /**
   * Handle member deletion
   */
  const handleDelete = useCallback((id) => {
    if (window.confirm('Are you sure you want to delete this member?')) {
      setMembers(prev => prev.filter(m => m.id !== id));
    }
  }, []);

  /**
   * Clear all filters
   */
  const handleClearFilters = useCallback(() => {
    setSearchTerm('');
    setSelectedChurch('');
    setSelectedStatus('');
    setCurrentPage(1);
  }, []);

  /**
   * Handle image loading error
   */
  const handleImageError = useCallback((e, memberName) => {
    e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(memberName)}&background=3b82f6&color=ffffff&size=128`;
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Church Members</h1>
              <p className="text-gray-600 text-sm sm:text-base">Manage your church community members</p>
            </div>
            <button
              onClick={() => handleModalOpen('add')}
              className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 min-h-[44px] text-sm sm:text-base"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Member
            </button>
          </div>
        </div>

        {/* Filters Section - Enhanced Responsive Design */}
        <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search Input */}
            <div className="lg:col-span-2">
              <label 
                htmlFor="search-input"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Search Members
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg 
                    className="h-5 w-5 text-gray-400" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
                    />
                  </svg>
                </div>
                <input
                  id="search-input"
                  type="text"
                  placeholder="Search by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="
                    w-full 
                    pl-10 
                    pr-3 
                    py-2.5 
                    border 
                    border-gray-300 
                    rounded-lg 
                    focus:outline-none 
                    focus:ring-2 
                    focus:ring-blue-500 
                    focus:border-blue-500 
                    text-sm
                    transition-colors
                    duration-200
                  "
                  aria-describedby="search-description"
                />
              </div>
              <p id="search-description" className="sr-only">
                Search members by name or email address
              </p>
            </div>

            {/* Church Filter */}
            <div>
              <label 
                htmlFor="church-filter"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Filter by Church
              </label>
              <select
                id="church-filter"
                value={selectedChurch}
                onChange={(e) => setSelectedChurch(e.target.value)}
                className="
                  w-full 
                  px-3 
                  py-2.5 
                  border 
                  border-gray-300 
                  rounded-lg 
                  focus:outline-none 
                  focus:ring-2 
                  focus:ring-blue-500 
                  focus:border-blue-500 
                  text-sm
                  bg-white
                  transition-colors
                  duration-200
                "
                aria-describedby="church-description"
              >
                <option value="">All Churches</option>
                {CHURCHES.map(church => (
                  <option key={church} value={church}>{church}</option>
                ))}
              </select>
              <p id="church-description" className="sr-only">
                Filter members by their church location
              </p>
            </div>

            {/* Status Filter */}
            <div>
              <label 
                htmlFor="status-filter"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Filter by Status
              </label>
              <select
                id="status-filter"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="
                  w-full 
                  px-3 
                  py-2.5 
                  border 
                  border-gray-300 
                  rounded-lg 
                  focus:outline-none 
                  focus:ring-2 
                  focus:ring-blue-500 
                  focus:border-blue-500 
                  text-sm
                  bg-white
                  transition-colors
                  duration-200
                "
                aria-describedby="status-description"
              >
                <option value="">All Status</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="Visitor">Visitor</option>
              </select>
              <p id="status-description" className="sr-only">
                Filter members by their current status
              </p>
            </div>
          </div>

          {/* Filter Actions */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-6 pt-4 border-t border-gray-200">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              {(searchTerm || selectedChurch || selectedStatus) && (
                <>
                  <span>Active filters:</span>
                  {searchTerm && (
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                      Search: "{searchTerm}"
                    </span>
                  )}
                  {selectedChurch && (
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                      Church: {selectedChurch}
                    </span>
                  )}
                  {selectedStatus && (
                    <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs">
                      Status: {selectedStatus}
                    </span>
                  )}
                </>
              )}
            </div>
            
            <button
              onClick={handleClearFilters}
              className="
                px-4 
                py-2 
                bg-gray-100 
                text-gray-700 
                rounded-lg 
                hover:bg-gray-200 
                focus:outline-none 
                focus:ring-2 
                focus:ring-gray-500 
                focus:ring-offset-2 
                transition-colors 
                duration-200 
                min-h-[40px] 
                text-sm
                font-medium
                self-start
                sm:self-auto
              "
              type="button"
            >
              <svg 
                className="w-4 h-4 inline mr-2" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M6 18L18 6M6 6l12 12" 
                />
              </svg>
              Clear Filters
            </button>
          </div>
        </div>

        {/* Results Summary */}
        <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="text-sm text-gray-600">
              Showing {paginatedMembers.length} of {filteredMembers.length} members
              {searchTerm || selectedChurch || selectedStatus ? ` (filtered from ${members.length} total)` : ''}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="name">Name</option>
                <option value="church">Church</option>
                <option value="status">Status</option>
                <option value="joinDate">Join Date</option>
              </select>
              <button
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="p-1 rounded hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[32px] min-w-[32px] flex items-center justify-center"
              >
                <svg className={`w-4 h-4 transform transition-transform ${sortOrder === 'desc' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Card View - Enhanced */}
        <div className="block md:hidden space-y-4 mb-6">
          {paginatedMembers.length > 0 ? (
            paginatedMembers.map((member) => (
              <article 
                key={member.id} 
                className="
                  bg-white 
                  rounded-xl 
                  shadow-sm 
                  p-4 
                  border 
                  border-gray-200
                  hover:shadow-md
                  transition-shadow
                  duration-200
                "
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <img
                      src={member.avatar}
                      alt={`${member.name} avatar`}
                      className="w-12 h-12 rounded-full object-cover ring-2 ring-gray-100"
                      onError={(e) => handleImageError(e, member.name)}
                      loading="lazy"
                    />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    {/* Header with name and status */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="min-w-0 flex-1">
                        <h3 className="font-semibold text-gray-900 truncate text-lg">
                          {member.name}
                        </h3>
                        <p className="text-sm text-gray-600 truncate mt-0.5">
                          {member.email}
                        </p>
                      </div>
                      <span 
                        className={`
                          px-2.5 
                          py-1 
                          rounded-full 
                          text-xs 
                          font-medium 
                          flex-shrink-0 
                          ml-3
                          ${statusConfig[member.status]?.bg || 'bg-gray-100'} 
                          ${statusConfig[member.status]?.text || 'text-gray-800'}
                        `}
                        aria-label={`Member status: ${member.status}`}
                      >
                        {member.status}
                      </span>
                    </div>
                    
                    {/* Member details */}
                    <div className="space-y-2 text-sm text-gray-600 mb-4">
                      <div className="flex items-center gap-2">
                        <svg 
                          className="w-4 h-4 text-gray-400 flex-shrink-0" 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                        >
                          <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth={2} 
                            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0v2a2 2 0 01-2 2H7a2 2 0 01-2-2v-2m14 0V9a2 2 0 00-2-2H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2z" 
                          />
                        </svg>
                        <span className="font-medium min-w-0">Church:</span>
                        <span className="truncate">{member.church}</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <svg 
                          className="w-4 h-4 text-gray-400 flex-shrink-0" 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                        >
                          <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth={2} 
                            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" 
                          />
                        </svg>
                        <span className="font-medium min-w-0">Phone:</span>
                        <span className="truncate">{member.phone}</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <svg 
                          className="w-4 h-4 text-gray-400 flex-shrink-0" 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                        >
                          <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth={2} 
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" 
                          />
                        </svg>
                        <span className="font-medium min-w-0">Joined:</span>
                        <span className="truncate">
                          {new Date(member.joinDate).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    
                    {/* Action buttons */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleModalOpen('view', member)}
                        className="
                          flex-1 
                          px-3 
                          py-2.5 
                          bg-blue-50 
                          text-blue-600 
                          rounded-lg 
                          hover:bg-blue-100 
                          focus:outline-none 
                          focus:ring-2 
                          focus:ring-blue-500 
                          focus:ring-offset-2
                          transition-colors 
                          duration-200 
                          text-sm 
                          font-medium 
                          min-h-[42px]
                          flex
                          items-center
                          justify-center
                          gap-2
                        "
                        aria-label={`View ${member.name}'s profile`}
                      >
                        <svg 
                          className="w-4 h-4" 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                        >
                          <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth={2} 
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" 
                          />
                          <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth={2} 
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" 
                          />
                        </svg>
                        View
                      </button>
                      
                      <button
                        onClick={() => handleModalOpen('edit', member)}
                        className="
                          flex-1 
                          px-3 
                          py-2.5 
                          bg-gray-50 
                          text-gray-600 
                          rounded-lg 
                          hover:bg-gray-100 
                          focus:outline-none 
                          focus:ring-2 
                          focus:ring-gray-500 
                          focus:ring-offset-2
                          transition-colors 
                          duration-200 
                          text-sm 
                          font-medium 
                          min-h-[42px]
                          flex
                          items-center
                          justify-center
                          gap-2
                        "
                        aria-label={`Edit ${member.name}'s information`}
                      >
                        <svg 
                          className="w-4 h-4" 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                        >
                          <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth={2} 
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" 
                          />
                        </svg>
                        Edit
                      </button>
                      
                      <button
                        onClick={() => handleDelete(member.id)}
                        className="
                          px-3 
                          py-2.5 
                          bg-red-50 
                          text-red-600 
                          rounded-lg 
                          hover:bg-red-100 
                          focus:outline-none 
                          focus:ring-2 
                          focus:ring-red-500 
                          focus:ring-offset-2
                          transition-colors 
                          duration-200 
                          min-h-[42px] 
                          min-w-[42px] 
                          flex 
                          items-center 
                          justify-center
                        "
                        aria-label={`Delete ${member.name}`}
                      >
                        <svg 
                          className="w-4 h-4" 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                        >
                          <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth={2} 
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" 
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            ))
          ) : (
            <div className="bg-white rounded-xl shadow-sm p-8 text-center">
              <svg 
                className="mx-auto h-12 w-12 text-gray-400 mb-4" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" 
                />
              </svg>
              <h3 className="text-sm font-medium text-gray-900 mb-1">No members found</h3>
              <p className="text-sm text-gray-500">
                {searchTerm || selectedChurch || selectedStatus
                  ? 'Try adjusting your filters to see more results.'
                  : 'Get started by adding your first member.'}
              </p>
              {!searchTerm && !selectedChurch && !selectedStatus && (
                <button
                  onClick={() => handleModalOpen('add')}
                  className="
                    mt-4 
                    inline-flex 
                    items-center 
                    px-4 
                    py-2 
                    bg-blue-600 
                    text-white 
                    rounded-lg 
                    hover:bg-blue-700 
                    focus:outline-none 
                    focus:ring-2 
                    focus:ring-blue-500 
                    focus:ring-offset-2 
                    transition-colors 
                    duration-200 
                    text-sm 
                    font-medium
                  "
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Add First Member
                </button>
              )}
            </div>
          )}
        </div>

        {/* Desktop Table View */}
        <div className="hidden md:block bg-white rounded-xl shadow-sm overflow-hidden mb-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <button
                      onClick={() => handleSort('name')}
                      className="flex items-center gap-1 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
                    >
                      Member
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                      </svg>
                    </button>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <button
                      onClick={() => handleSort('church')}
                      className="flex items-center gap-1 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
                    >
                      Church
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                      </svg>
                    </button>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <button
                      onClick={() => handleSort('status')}
                      className="flex items-center gap-1 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
                    >
                      Status
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                      </svg>
                    </button>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <button
                      onClick={() => handleSort('joinDate')}
                      className="flex items-center gap-1 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
                    >
                      Join Date
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                      </svg>
                    </button>
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedMembers.map((member) => (
                  <tr key={member.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <img
                          src={member.avatar}
                          alt={member.name}
                          className="w-10 h-10 rounded-full object-cover mr-4"
                          onError={(e) => {
                            e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=3b82f6&color=ffffff&size=128`;
                          }}
                        />
                        <div>
                          <div className="text-sm font-medium text-gray-900">{member.name}</div>
                          <div className="text-sm text-gray-500">{member.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{member.church}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{member.phone}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        member.status === 'Active' ? 'bg-green-100 text-green-800' :
                        member.status === 'Inactive' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {member.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(member.joinDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleModalOpen('view', member)}
                          className="text-blue-600 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded p-1"
                          title="View member"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleModalOpen('edit', member)}
                          className="text-gray-600 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 rounded p-1"
                          title="Edit member"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDelete(member.id)}
                          className="text-red-600 hover:text-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 rounded p-1"
                          title="Delete member"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="text-sm text-gray-600">
              Page {currentPage} of {totalPages} ({filteredMembers.length} total members)
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 min-h-[40px] text-sm"
              >
                Previous
              </button>
              <div className="hidden sm:flex items-center gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const page = i + 1;
                  return (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 min-h-[40px] min-w-[40px] text-sm ${
                        currentPage === page
                          ? 'bg-blue-600 text-white'
                          : 'border border-gray-300 hover:bg-gray-50 text-gray-700'
                      }`}
                    >
                      {page}
                    </button>
                  );
                })}
              </div>
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 min-h-[40px] text-sm"
              >
                Next
              </button>
            </div>
          </div>
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white px-6 py-4 border-b border-gray-200 rounded-t-xl">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">
                    {modalType === 'view' ? 'Member Profile' :
                     modalType === 'edit' ? 'Edit Member' : 'Add New Member'}
                  </h2>
                  <button
                    onClick={() => setShowModal(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 min-h-[44px] min-w-[44px] flex items-center justify-center"
                  >
                    <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
              
              <div className="p-6">
                {modalType === 'view' && selectedMember ? (
                  <div className="space-y-6">
                    <div className="text-center">
                      <img
                        src={selectedMember.avatar}
                        alt={selectedMember.name}
                        className="w-24 h-24 rounded-full object-cover mx-auto mb-4"
                        onError={(e) => {
                          e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedMember.name)}&background=3b82f6&color=ffffff&size=128`;
                        }}
                      />
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">{selectedMember.name}</h3>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        selectedMember.status === 'Active' ? 'bg-green-100 text-green-800' :
                        selectedMember.status === 'Inactive' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {selectedMember.status}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-3">Contact Information</h4>
                        <div className="space-y-2 text-sm">
                          <p><span className="font-medium">Email:</span> {selectedMember.email}</p>
                          <p><span className="font-medium">Phone:</span> {selectedMember.phone}</p>
                          <p><span className="font-medium">Address:</span> {selectedMember.address || 'Not provided'}</p>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 mb-3">Church Information</h4>
                        <div className="space-y-2 text-sm">
                          <p><span className="font-medium">Church:</span> {selectedMember.church}</p>
                          <p><span className="font-medium">Join Date:</span> {new Date(selectedMember.joinDate).toLocaleDateString()}</p>
                          <p><span className="font-medium">Ministry:</span> {selectedMember.ministry || 'Not specified'}</p>
                        </div>
                      </div>
                    </div>
                    
                    {selectedMember.notes && (
                      <div>
                        <h4 className="font-medium text-gray-900 mb-3">Notes</h4>
                        <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">{selectedMember.notes}</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <form onSubmit={handleFormSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({...formData, phone: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Church *</label>
                        <select
                          required
                          value={formData.church}
                          onChange={(e) => setFormData({...formData, church: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="">Select Church</option>
                          {CHURCHES.map(church => (
                            <option key={church} value={church}>{church}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                        <select
                          value={formData.status}
                          onChange={(e) => setFormData({...formData, status: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="Active">Active</option>
                          <option value="Inactive">Inactive</option>
                          <option value="Visitor">Visitor</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Join Date</label>
                        <input
                          type="date"
                          value={formData.joinDate}
                          onChange={(e) => setFormData({...formData, joinDate: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                      <input
                        type="text"
                        value={formData.address}
                        onChange={(e) => setFormData({...formData, address: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Ministry</label>
                      <input
                        type="text"
                        value={formData.ministry}
                        onChange={(e) => setFormData({...formData, ministry: e.target.value})}
                        placeholder="e.g., Youth Ministry, Worship Team, etc."
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                      <textarea
                        rows={3}
                        value={formData.notes}
                        onChange={(e) => setFormData({...formData, notes: e.target.value})}
                        placeholder="Additional notes about the member..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                      />
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-3 pt-4">
                      <button
                        type="submit"
                        className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 min-h-[44px] font-medium"
                      >
                        {modalType === 'edit' ? 'Update Member' : 'Add Member'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowModal(false)}
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors duration-200 min-h-[44px] font-medium"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Members;
