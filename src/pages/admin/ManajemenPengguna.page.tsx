import { useState, useMemo, useEffect, useRef } from 'react'
import { Search, Users, UserX, GraduationCap, Building2, ChevronDown, CheckCircle2, X, Eye, Edit, Trash2, User, RotateCcw } from 'lucide-react'
import { adminUserApi, getInitialsOf, USER_STATUS_LABEL } from '../../services/admin.service'
import type { AdminUser } from '../../services/admin.service'
import Toast from './components/Toast'
import ConfirmModal from '../../components/common/ConfirmModal'
import StatusBadge from './components/StatusBadge'

type TabKey = 'mahasiswa' | 'universitas' | 'perusahaan'

// tab UI -> role di backend
const TAB_ROLE: Record<TabKey, string> = {
  mahasiswa: 'student',
  universitas: 'university',
  perusahaan: 'company',
}

// opsi filter status memakai nilai backend, label bahasa Indonesia
const userStatusFilterOptions = [
  { label: 'Semua Status', value: 'all' },
  { label: 'Aktif', value: 'active' },
  { label: 'Ditangguhkan', value: 'suspended' },
  { label: 'Dihapus', value: 'deleted' },
]

const userStatusFormOptions = [
  { label: 'Aktif', value: 'active' },
  { label: 'Ditangguhkan', value: 'suspended' },
  { label: 'Dihapus', value: 'deleted' },
]

// baris tampilan yang sudah dipipihkan dari AdminUser
interface UserRow {
  id: string
  name: string
  email: string
  orgName: string   // universitas / perusahaan
  extra: string     // jurusan (mahasiswa) atau NIP (admin)
  status: string    // nilai backend
}

const toRow = (u: AdminUser, tab: TabKey): UserRow => {
  if (tab === 'mahasiswa') {
    return {
      id: u.id,
      name: u.name ?? '-',
      email: u.email,
      orgName: u.student?.university?.name ?? '-',
      extra: u.student?.major ?? '-',
      status: u.status,
    }
  }
  if (tab === 'universitas') {
    return {
      id: u.id,
      name: u.name ?? '-',
      email: u.email,
      orgName: u.universityMember?.university?.name ?? '-',
      extra: u.universityMember?.nip ?? '-',
      status: u.status,
    }
  }
  return {
    id: u.id,
    name: u.name ?? '-',
    email: u.email,
    orgName: u.companyMember?.company?.name ?? '-',
    extra: u.companyMember?.nip ?? '-',
    status: u.status,
  }
}

const AdminManajemenPengguna = () => {
  const [activeTab, setActiveTab] = useState<TabKey>('mahasiswa')
  const [searchQuery, setSearchQuery] = useState('')

  const [users, setUsers] = useState<UserRow[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState('')

  // Custom Filter Dropdown State
  const [filterStatus, setFilterStatus] = useState('all')
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const filterDropdownRef = useRef<HTMLDivElement>(null)

  const [currentPage, setCurrentPage] = useState(1)
  const ITEMS_PER_PAGE = 10

  const [notification, setNotification] = useState<{ message: string, type: 'success' | 'warning' } | null>(null)

  // Modal State untuk Edit Status & Data
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<UserRow | null>(null)

  // Form State untuk menampung data yang sedang diedit
  const [editFormData, setEditFormData] = useState({ name: '', email: '', status: 'active', extra: '' })

  const loadUsers = async (tab: TabKey) => {
    setIsLoading(true)
    try {
      const { users: list } = await adminUserApi.list({ role: TAB_ROLE[tab], limit: 100 })
      setUsers(list.map((u) => toRow(u, tab)))
      setLoadError('')
    } catch {
      setLoadError('Gagal memuat daftar pengguna.')
    } finally {
      setIsLoading(false)
    }
  }

  // Muat data + reset filter saat pindah tab
  useEffect(() => {
    setCurrentPage(1)
    setSearchQuery('')
    setFilterStatus('all')
    setIsFilterOpen(false)
    loadUsers(activeTab)
  }, [activeTab])

  // Reset page ke 1 saat pencarian atau filter diubah
  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, filterStatus])

  // Deteksi klik di luar dropdown filter
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filterDropdownRef.current && !filterDropdownRef.current.contains(event.target as Node)) {
        setIsFilterOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Logic Filtering Data
  const filteredData = useMemo(() => {
    const query = searchQuery.toLowerCase()
    return users.filter(user =>
      (user.name.toLowerCase().includes(query) ||
        user.orgName.toLowerCase().includes(query) ||
        user.extra.toLowerCase().includes(query)) &&
      (filterStatus === 'all' || user.status === filterStatus)
    )
  }, [users, searchQuery, filterStatus])

  // Pagination
  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const paginatedData = filteredData.slice(startIndex, startIndex + ITEMS_PER_PAGE)

  const getPaginationGroup = () => {
    if (totalPages <= 0) return [1]
    const start = currentPage
    const end = Math.min(currentPage + 1, totalPages)
    const pages = []
    for (let i = start; i <= end; i++) pages.push(i)
    return pages
  }

  // Helpers Notifikasi
  const showNotification = (msg: string, type: 'success' | 'warning') => {
    setNotification({ message: msg, type })
    setTimeout(() => setNotification(null), 4000)
  }

  const resetFilter = () => {
    setSearchQuery('')
    setFilterStatus('all')
  }

  // Badge status entitas (label dipetakan dari istilah backend)
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active': return <StatusBadge label="Aktif" tone="success" width={120} />
      case 'suspended': return <StatusBadge label="Ditangguhkan" tone="warning" width={120} />
      case 'deleted': return <StatusBadge label="Dihapus" tone="danger" width={120} />
      default: return <StatusBadge label={USER_STATUS_LABEL[status] ?? status} tone="neutral" width={120} />
    }
  }

  // Avatar Style Helper
  const getAvatarStyle = (status: string) => {
    switch (status) {
      case 'active': return 'bg-[#f8faff] text-[#0f5ce0] border border-[#e4e9f4]'
      case 'suspended': return 'bg-[#fffbeb] text-[#f59e0b] border border-[#fde68a]'
      case 'deleted': return 'bg-[#fef2f2] text-[#ef4444] border border-[#fecaca]'
      default: return 'bg-[#f1f4f9] text-[#7b8191] border border-[#e4e9f4]'
    }
  }

  const currentMetrics = useMemo(() => ({
    totalUser: users.length,
    userAktif: users.filter(u => u.status === 'active').length,
    akunDitangguhkan: users.filter(u => u.status === 'suspended').length,
  }), [users])

  const activeFilterLabel = userStatusFilterOptions.find(opt => opt.value === filterStatus)?.label || 'Semua Status'

  // Modal Actions
  const handleOpenDetail = (user: UserRow) => {
    setSelectedUser(user)
    setEditFormData({
      name: user.name === '-' ? '' : user.name,
      email: user.email,
      status: user.status,
      extra: user.extra === '-' ? '' : user.extra,
    })
    setIsDetailOpen(true)
  }

  const handleSimpanEdit = async () => {
    if (!selectedUser) return
    try {
      await adminUserApi.update(selectedUser.id, {
        name: editFormData.name || undefined,
        email: editFormData.email || undefined,
        status: editFormData.status as 'active' | 'suspended' | 'deleted',
        ...(activeTab === 'mahasiswa'
          ? { major: editFormData.extra || undefined }
          : { nip: editFormData.extra || undefined }),
      })
      setIsDetailOpen(false)
      await loadUsers(activeTab)
      showNotification('Data pengguna berhasil diperbarui.', 'success')
    } catch (err: any) {
      showNotification(err?.response?.data?.message || 'Gagal menyimpan perubahan.', 'warning')
    }
  }

  const triggerDeleteConfirm = () => {
    setIsDetailOpen(false)
    setIsDeleteConfirmOpen(true)
  }

  const executeDeleteUser = async () => {
    if (!selectedUser) return
    try {
      await adminUserApi.remove(selectedUser.id)
      setIsDeleteConfirmOpen(false)
      await loadUsers(activeTab)
      showNotification('Pengguna berhasil dihapus dari sistem.', 'success')
    } catch (err: any) {
      setIsDeleteConfirmOpen(false)
      showNotification(err?.response?.data?.message || 'Gagal menghapus pengguna.', 'warning')
    }
  }

  const handleInputChange = (field: 'name' | 'email' | 'status' | 'extra', value: string) => {
    setEditFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div className="w-full pb-10 animate-in fade-in duration-300">

      <Toast notification={notification} onClose={() => setNotification(null)} />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-[24px] font-bold text-[#111827]">Manajemen Pengguna</h1>
          <p className="text-[14px] text-[#5b6170] mt-1 leading-relaxed">
            Kelola dan monitor seluruh basis pengguna dalam ekosistem Talentry.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#e4e9f4] mb-6 overflow-x-auto hide-scrollbar">
        <button
          onClick={() => setActiveTab('mahasiswa')}
          className={`flex items-center gap-2 px-6 py-3.5 text-[14px] font-bold border-b-[3px] whitespace-nowrap transition-colors ${activeTab === 'mahasiswa' ? 'border-[#0f5ce0] text-[#0f5ce0]' : 'border-transparent text-[#7b8191] hover:text-[#111827]'}`}
        >
          <GraduationCap size={18} strokeWidth={2.5} /> Mahasiswa
        </button>
        <button
          onClick={() => setActiveTab('universitas')}
          className={`flex items-center gap-2 px-6 py-3.5 text-[14px] font-bold border-b-[3px] whitespace-nowrap transition-colors ${activeTab === 'universitas' ? 'border-[#0f5ce0] text-[#0f5ce0]' : 'border-transparent text-[#7b8191] hover:text-[#111827]'}`}
        >
          <Building2 size={18} strokeWidth={2.5} /> Universitas
        </button>
        <button
          onClick={() => setActiveTab('perusahaan')}
          className={`flex items-center gap-2 px-6 py-3.5 text-[14px] font-bold border-b-[3px] whitespace-nowrap transition-colors ${activeTab === 'perusahaan' ? 'border-[#0f5ce0] text-[#0f5ce0]' : 'border-transparent text-[#7b8191] hover:text-[#111827]'}`}
        >
          <Building2 size={18} strokeWidth={2.5} /> Perusahaan
        </button>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-6">
        <div className="bg-white p-5 rounded-[16px] border border-[#e4e9f4] shadow-sm flex flex-col gap-3">
          <div className="w-10 h-10 rounded-[10px] bg-[#eef4ff] text-[#0f5ce0] flex items-center justify-center">
            <Users size={20} />
          </div>
          <div>
            <p className="text-[11px] font-extrabold text-[#7b8191] uppercase tracking-widest mb-1">Total User</p>
            <p className="text-[28px] font-black text-[#111827] leading-none">{currentMetrics.totalUser.toLocaleString('id-ID')}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-[16px] border border-[#e4e9f4] shadow-sm flex flex-col gap-3">
          <div className="w-10 h-10 rounded-[10px] bg-[#e6f9f0] text-[#10b981] flex items-center justify-center border border-[#d1f4e0]">
            <CheckCircle2 size={20} />
          </div>
          <div>
            <p className="text-[11px] font-extrabold text-[#7b8191] uppercase tracking-widest mb-1">User Aktif</p>
            <p className="text-[28px] font-black text-[#111827] leading-none">{currentMetrics.userAktif.toLocaleString('id-ID')}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-[16px] border border-[#e4e9f4] shadow-sm flex flex-col gap-3">
          <div className="w-10 h-10 rounded-[10px] bg-[#fffbeb] text-[#f59e0b] flex items-center justify-center border border-[#fde68a]">
            <UserX size={20} />
          </div>
          <div>
            <p className="text-[11px] font-extrabold text-[#7b8191] uppercase tracking-widest mb-1">Akun Ditangguhkan</p>
            <p className="text-[28px] font-black text-[#111827] leading-none">{currentMetrics.akunDitangguhkan.toLocaleString('id-ID')}</p>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="bg-white rounded-[16px] border border-[#e4e9f4] shadow-sm flex flex-col overflow-visible">

        {/* Search & Filter Bar */}
        <div className="p-5 border-b border-[#e4e9f4] flex flex-col md:flex-row justify-between items-center gap-4 bg-white rounded-t-[16px]">

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
            {/* Custom Dropdown Filter Status */}
            <div className="relative w-full sm:w-[190px]" ref={filterDropdownRef}>
              <button
                type="button"
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="w-full flex items-center justify-between px-4 py-2.5 bg-[#f8faff] border border-[#e4e9f4] rounded-lg text-[13px] font-semibold text-[#111827] hover:bg-[#f1f4f9] focus:outline-none transition-all shadow-sm"
              >
                <span className="truncate">{activeFilterLabel}</span>
                <ChevronDown size={16} className={`text-[#a0a6b5] transition-transform ${isFilterOpen ? 'rotate-180' : ''}`} />
              </button>

              {isFilterOpen && (
                <div className="absolute top-full left-0 mt-2 w-full bg-white border border-[#e4e9f4] rounded-xl shadow-lg z-50 py-1.5 animate-in fade-in slide-in-from-top-2">
                  {userStatusFilterOptions.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => {
                        setFilterStatus(opt.value)
                        setIsFilterOpen(false)
                        setCurrentPage(1)
                      }}
                      className={`w-full text-left px-4 py-2.5 text-[13px] transition-colors ${
                        filterStatus === opt.value
                          ? 'bg-[#eef4ff] text-[#0f5ce0] font-bold'
                          : 'text-[#5b6170] hover:bg-[#f8faff] hover:text-[#111827] font-medium'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {(filterStatus !== 'all' || searchQuery !== '') && (
              <button
                onClick={resetFilter}
                className="flex items-center gap-1.5 px-3 py-2.5 text-[13px] font-bold text-[#7b8191] hover:text-[#111827] hover:bg-[#f1f4f9] rounded-lg transition-colors border border-transparent w-full sm:w-auto justify-center"
              >
                <RotateCcw size={16} strokeWidth={2.5} /> Reset
              </button>
            )}
          </div>

          <div className="relative w-full md:w-[350px]">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#a0a6b5]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`Cari nama${activeTab === 'mahasiswa' ? ', atau universitas..' : activeTab === 'universitas' ? ', universitas, atau NIP..' : ' admin perusahaan..'}`}
              className="w-full pl-10 pr-4 py-2.5 bg-[#f8faff] border border-[#e4e9f4] rounded-lg text-[13px] focus:outline-none focus:border-[#0f5ce0] transition shadow-sm placeholder:text-[#a0a6b5]"
            />
          </div>
        </div>

        {/* Tabel Data */}
        <div className="overflow-x-auto min-h-[400px]">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-24 text-[#7b8191]">
              <p className="text-[15px] font-bold text-[#5b6170]">Memuat data pengguna...</p>
            </div>
          ) : loadError ? (
            <div className="flex flex-col items-center justify-center py-24 text-[#ef4444]">
              <p className="text-[15px] font-bold">{loadError}</p>
            </div>
          ) : paginatedData.length > 0 ? (
            <table className="w-full text-left border-collapse min-w-[900px]">
              <thead>
                <tr className="bg-[#f8faff] border-y border-[#e4e9f4] text-[10px] font-extrabold text-[#7b8191] tracking-widest uppercase">
                  <th className="px-6 py-4 w-[30%]">{activeTab === 'mahasiswa' ? 'Mahasiswa' : 'Admin'}</th>
                  <th className="px-6 py-4 w-[25%]">{activeTab === 'perusahaan' ? 'Perusahaan' : 'Universitas'}</th>
                  <th className="px-6 py-4 w-[20%]">{activeTab === 'mahasiswa' ? 'Jurusan' : 'NIP / ID Pegawai'}</th>
                  <th className="px-6 py-4 w-[15%]">Status</th>
                  <th className="px-6 py-4 w-[10%] text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f1f4f9]">
                {paginatedData.map((user) => (
                  <tr key={user.id} className="hover:bg-[#fafbfe] transition-colors group align-middle">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-[10px] flex items-center justify-center font-black text-[13px] shrink-0 ${getAvatarStyle(user.status)}`}>
                          {getInitialsOf(user.name)}
                        </div>
                        <div>
                          <p className="text-[14px] font-bold text-[#111827] group-hover:text-[#0f5ce0] transition-colors">{user.name}</p>
                          <p className="text-[12px] text-[#7b8191] mt-0.5">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <p className="text-[13.5px] text-[#5b6170] font-medium">{user.orgName}</p>
                    </td>
                    <td className="px-6 py-5">
                      <p className="text-[13.5px] text-[#5b6170] font-medium">{user.extra}</p>
                    </td>
                    <td className="px-6 py-5">
                      {getStatusBadge(user.status)}
                    </td>
                    <td className="px-6 py-5 text-right">
                      <button
                        onClick={() => handleOpenDetail(user)}
                        className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-[#0f5ce0] hover:text-[#0d4ebf] hover:bg-[#eef4ff] rounded-lg transition text-[13px] font-bold"
                      >
                        <Eye size={16} /> Detail
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="flex flex-col items-center justify-center py-24 text-[#7b8191]">
              <Search size={48} className="mb-4 text-[#e4e9f4]" />
              <p className="text-[15px] font-bold text-[#5b6170]">Tidak ada pengguna yang cocok</p>
              <p className="text-[13px] mt-1">Coba sesuaikan kata kunci pencarian atau filter status Anda.</p>
            </div>
          )}
        </div>

        {/* Paginasi Footer */}
        {!isLoading && !loadError && filteredData.length > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-4 border-t border-[#f1f4f9] bg-white gap-4 rounded-b-[16px]">
            <div className="text-[13px] text-[#7b8191] font-medium text-center sm:text-left">
              Menampilkan <span className="font-bold text-[#111827]">{startIndex + 1}-{Math.min(startIndex + ITEMS_PER_PAGE, filteredData.length)}</span> dari <span className="font-bold text-[#111827]">{filteredData.length}</span> {activeTab === 'mahasiswa' ? 'mahasiswa' : 'admin'}
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="text-[13px] font-bold text-[#0f5ce0] hover:text-[#0d4ebf] disabled:text-[#a0a6b5] disabled:hover:text-[#a0a6b5] transition-colors mr-2 px-2 py-1"
              >
                Sebelumnya
              </button>

              {getPaginationGroup().map((pageNum) => (
                <button
                  key={pageNum}
                  type="button"
                  onClick={() => setCurrentPage(pageNum)}
                  className={`w-8 h-8 rounded-lg font-bold text-[13px] flex items-center justify-center transition-all ${
                    currentPage === pageNum
                      ? 'bg-[#0f5ce0] text-white shadow-sm'
                      : 'text-[#5b6170] hover:bg-[#f8faff] border border-transparent'
                  }`}
                >
                  {pageNum}
                </button>
              ))}

              <button
                type="button"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages || totalPages === 0}
                className="text-[13px] font-bold text-[#0f5ce0] hover:text-[#0d4ebf] disabled:text-[#a0a6b5] disabled:hover:text-[#a0a6b5] transition-colors ml-2 px-2 py-1"
              >
                Selanjutnya
              </button>
            </div>
          </div>
        )}
      </div>

      {/* --- MODAL EDIT FULL FORM --- */}
      {isDetailOpen && selectedUser && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-[20px] w-full max-w-[500px] shadow-xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-[#e4e9f4] flex justify-between items-center bg-white">
              <h2 className="text-[18px] font-bold text-[#111827] flex items-center gap-2">
                <User size={18} className="text-[#0f5ce0]" /> Detail & Ubah Status
              </h2>
              <button onClick={() => setIsDetailOpen(false)} className="text-[#a0a6b5] hover:text-[#111827] transition-colors p-1">
                <X size={20} strokeWidth={2.5} />
              </button>
            </div>

            <div className="p-6">
              {/* Header Info Singkat (Avatar) */}
              <div className="flex items-center gap-4 mb-6 pb-6 border-b border-[#f1f4f9]">
                <div className={`w-14 h-14 rounded-full flex items-center justify-center font-black text-[20px] shrink-0 ${getAvatarStyle(editFormData.status)}`}>
                  {getInitialsOf(editFormData.name)}
                </div>
                <div>
                  <h3 className="text-[16px] font-bold text-[#111827]">{editFormData.name}</h3>
                  <p className="text-[13px] text-[#7b8191] mt-0.5">{editFormData.email}</p>
                </div>
              </div>

              {/* Form Fields */}
              <div className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[13px] font-bold text-[#111827] mb-2">Nama Lengkap</label>
                    <input
                      type="text"
                      value={editFormData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="w-full h-11 px-4 bg-[#f8faff] border border-[#e4e9f4] rounded-lg text-[13px] font-medium text-[#111827] outline-none focus:border-[#0f5ce0] transition shadow-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-[13px] font-bold text-[#111827] mb-2">Email</label>
                    <input
                      type="email"
                      value={editFormData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="w-full h-11 px-4 bg-[#f8faff] border border-[#e4e9f4] rounded-lg text-[13px] font-medium text-[#111827] outline-none focus:border-[#0f5ce0] transition shadow-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[13px] font-bold text-[#111827] mb-2">Status Akun</label>
                    <select
                      value={editFormData.status}
                      onChange={(e) => handleInputChange('status', e.target.value)}
                      className="w-full h-11 px-4 bg-[#f8faff] border border-[#e4e9f4] rounded-lg text-[13px] font-medium text-[#111827] outline-none focus:border-[#0f5ce0] transition shadow-sm cursor-pointer appearance-none"
                      style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%235b6170' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center' }}
                    >
                      {userStatusFormOptions.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[13px] font-bold text-[#111827] mb-2">
                      {activeTab === 'perusahaan' ? 'Nama Perusahaan' : 'Universitas'}
                    </label>
                    {/* keanggotaan organisasi tidak diedit dari sini */}
                    <input
                      type="text"
                      value={selectedUser.orgName}
                      disabled
                      className="w-full h-11 px-4 bg-[#f1f4f9] border border-[#e4e9f4] rounded-lg text-[13px] font-medium text-[#7b8191] outline-none shadow-sm cursor-not-allowed"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[13px] font-bold text-[#111827] mb-2">
                    {activeTab === 'mahasiswa' ? 'Program Studi / Jurusan' : 'NIP / ID Pegawai'}
                  </label>
                  <input
                    type="text"
                    value={editFormData.extra}
                    onChange={(e) => handleInputChange('extra', e.target.value)}
                    className="w-full h-11 px-4 bg-[#f8faff] border border-[#e4e9f4] rounded-lg text-[13px] font-medium text-[#111827] outline-none focus:border-[#0f5ce0] transition shadow-sm"
                  />
                </div>
              </div>
            </div>

            <div className="p-5 border-t border-[#e4e9f4] bg-white flex justify-between gap-3">
              <button
                onClick={triggerDeleteConfirm}
                className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white text-[#ef4444] text-[13px] font-bold rounded-lg border border-[#fecaca] hover:bg-[#fef2f2] transition-colors shadow-sm"
              >
                <Trash2 size={16} /> Hapus Akun
              </button>
              <button
                onClick={handleSimpanEdit}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-2.5 bg-[#0f5ce0] hover:bg-[#0d4ebf] text-white text-[13px] font-bold rounded-lg transition-colors shadow-sm"
              >
                <Edit size={16} /> Simpan Perubahan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL KONFIRMASI HAPUS (CUSTOM) --- */}
      <ConfirmModal
        isOpen={isDeleteConfirmOpen}
        icon={Trash2}
        title="Hapus Data Pengguna?"
        message={<>Akun <strong className="text-[#111827]">{selectedUser?.name}</strong> akan dinonaktifkan (soft-delete) dan tidak bisa lagi masuk ke sistem.</>}
        confirmLabel="Ya, Hapus Akun"
        tone="danger"
        onConfirm={executeDeleteUser}
        onCancel={() => {
          setIsDeleteConfirmOpen(false)
          setIsDetailOpen(true)
        }}
      />

    </div>
  )
}

export default AdminManajemenPengguna
