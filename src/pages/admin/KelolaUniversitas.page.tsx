import { useState, useMemo, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, GraduationCap, Users, Plus, CheckCircle2, Clock, Trash2, Edit, X } from 'lucide-react'
import { adminUniversityApi, getInitialsOf, formatDateID } from '../../services/admin.service'
import type { AdminUniversity } from '../../services/admin.service'
import Toast from './components/Toast'
import ConfirmModal from './components/ConfirmModal'
import StatusBadge from './components/StatusBadge'

// baris tabel: bentuk turunan dari AdminUniversity agar mudah dirender
interface UniversityRow {
  id: string
  name: string
  location: string
  adminName: string
  adminEmail: string
  status: 'AKTIF' | 'PENDING'
  lastActive: string
}

const universityStatusFilterOptions = [
  { label: 'Semua Status', value: 'all' },
  { label: 'Aktif', value: 'AKTIF' },
  { label: 'Pending', value: 'PENDING' },
]

const universityStatusFormOptions = [
  { label: 'Aktif', value: 'AKTIF' },
  { label: 'Pending', value: 'PENDING' },
]

const toRow = (u: AdminUniversity): UniversityRow => ({
  id: u.id,
  name: u.name,
  location: u.city ?? '-',
  adminName: u.admin?.name ?? '-',
  adminEmail: u.admin?.email ?? '-',
  status: u.admin?.status === 'active' ? 'AKTIF' : 'PENDING',
  lastActive: u.admin?.lastLoginAt ? formatDateID(u.admin.lastLoginAt, true) : '-',
})

const AdminKelolaUniversitas = () => {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [universities, setUniversities] = useState<UniversityRow[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState('')

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1)
  const ITEMS_PER_PAGE = 10

  // Edit Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editData, setEditData] = useState<UniversityRow | null>(null)

  // Delete Modal State
  const [deleteId, setDeleteId] = useState<string | null>(null)

  // Notification State
  const [notification, setNotification] = useState<{message: string, type: 'success' | 'warning'} | null>(null)

  const loadUniversities = async () => {
    try {
      const { universities: list } = await adminUniversityApi.list({ limit: 100 })
      setUniversities(list.map(toRow))
      setLoadError('')
    } catch {
      setLoadError('Gagal memuat daftar universitas.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadUniversities()
  }, [])

  const universityMetrics = useMemo(() => ({
    total: universities.length,
    activeAdmin: universities.filter(u => u.status === 'AKTIF').length,
  }), [universities])

  const filteredData = useMemo(() => {
    return universities.filter((univ) => {
      const matchSearch = univ.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          univ.adminName.toLowerCase().includes(searchQuery.toLowerCase())
      const matchStatus = filterStatus === 'all' || univ.status === filterStatus
      return matchSearch && matchStatus
    })
  }, [searchQuery, filterStatus, universities])

  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, filterStatus])

  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const paginatedData = filteredData.slice(startIndex, startIndex + ITEMS_PER_PAGE)

  const getPaginationGroup = () => {
    if (totalPages <= 0) return [1]
    const start = currentPage
    const end = Math.min(currentPage + 1, totalPages)
    let pages = []
    for (let i = start; i <= end; i++) pages.push(i)
    return pages
  }

  const showNotification = (msg: string, type: 'success' | 'warning') => {
    setNotification({ message: msg, type })
    window.scrollTo({ top: 0, behavior: 'smooth' })
    setTimeout(() => setNotification(null), 4000)
  }

  // --- CRUD Logic ---
  const handleDeleteConfirm = async () => {
    if (!deleteId) return
    try {
      await adminUniversityApi.remove(deleteId)
      setDeleteId(null)
      await loadUniversities()
      showNotification('Universitas berhasil dihapus.', 'success')

      // Handle edge case where deleting the last item on a page leaves the page empty
      if (paginatedData.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1)
      }
    } catch {
      setDeleteId(null)
      showNotification('Gagal menghapus universitas.', 'warning')
    }
  }

  const handleOpenEdit = (univ: UniversityRow) => {
    setEditData({ ...univ })
    setIsEditModalOpen(true)
  }

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editData) return

    // Cek apakah ada perubahan
    const originalData = universities.find(u => u.id === editData.id)
    const isChanged = originalData && (
      originalData.name !== editData.name ||
      originalData.location !== editData.location ||
      originalData.adminName !== editData.adminName ||
      originalData.status !== editData.status
    )

    if (!isChanged) {
      setIsEditModalOpen(false)
      showNotification('Tidak ada perubahan data yang dilakukan.', 'warning')
      return
    }

    try {
      await adminUniversityApi.update(editData.id, {
        name: editData.name,
        city: editData.location,
        adminName: editData.adminName !== '-' ? editData.adminName : undefined,
        adminStatus: editData.status === 'AKTIF' ? 'active' : 'pending',
      })
      setIsEditModalOpen(false)
      await loadUniversities()
      showNotification('Perubahan data universitas berhasil disimpan.', 'success')
    } catch {
      showNotification('Gagal menyimpan perubahan.', 'warning')
    }
  }

  const formatLastActive = (dateString: string) => {
    if (!dateString || dateString === '-') return { date: '-', time: '' }
    const parts = dateString.split(', ')
    if (parts.length === 2) {
      return { date: parts[0], time: parts[1] }
    }
    return { date: dateString, time: '' }
  }

  return (
    <div className="w-full pb-10 animate-in fade-in duration-300">

      <Toast notification={notification} onClose={() => setNotification(null)} />

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-[24px] font-bold text-[#111827]">Kelola Admin Universitas</h1>
          <p className="text-[14px] text-[#5b6170] mt-1">Manajemen akun administrator dan status integrasi data universitas.</p>
        </div>
        <button
          onClick={() => navigate('/admin/kelola-universitas/tambah')}
          className="flex items-center gap-2 px-6 py-3 bg-[#0f5ce0] rounded-xl text-[14px] font-bold text-white hover:bg-[#0d4ebf] transition-all duration-200 active:scale-95 shadow-sm w-full sm:w-auto justify-center"
        >
          <Plus size={18} strokeWidth={2.5} />
          Tambah Universitas / Admin
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
        <div className="bg-white p-6 rounded-[16px] border border-[#e4e9f4] shadow-sm flex items-start gap-5">
          <div className="w-14 h-14 rounded-[12px] bg-[#eef4ff] text-[#0f5ce0] border border-[#d0e0ff] flex items-center justify-center shrink-0">
            <GraduationCap size={28} strokeWidth={2} />
          </div>
          <div>
            <p className="text-[12px] font-extrabold text-[#7b8191] uppercase tracking-widest mb-1.5">Total Universitas</p>
            <p className="text-[32px] font-black text-[#111827] leading-none">{universityMetrics.total}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-[16px] border border-[#e4e9f4] shadow-sm flex items-start gap-5">
          <div className="w-14 h-14 rounded-[12px] bg-[#f8faff] text-[#7b8191] border border-[#e4e9f4] flex items-center justify-center shrink-0">
            <Users size={28} strokeWidth={2} />
          </div>
          <div>
            <p className="text-[12px] font-extrabold text-[#7b8191] uppercase tracking-widest mb-1.5">Admin Aktif</p>
            <p className="text-[32px] font-black text-[#111827] leading-none">{universityMetrics.activeAdmin}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[16px] border border-[#e4e9f4] shadow-sm flex flex-col overflow-hidden">

        <div className="p-5 border-b border-[#e4e9f4] flex flex-col lg:flex-row justify-between items-center gap-4 relative z-10">
          <div className="flex items-center gap-3 w-full lg:w-auto relative">
             <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2.5 bg-[#f8faff] border border-[#e4e9f4] rounded-lg text-[13px] font-medium text-[#111827] focus:outline-none focus:border-[#0f5ce0] transition shadow-sm w-full sm:w-[150px] appearance-none"
              style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%235b6170' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center' }}
            >
              {universityStatusFilterOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          <div className="relative w-full lg:w-[350px]">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#a0a6b5]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nama universitas atau admin..."
              className="w-full pl-10 pr-4 py-2.5 bg-[#f8faff] border border-[#e4e9f4] rounded-lg text-[13px] focus:outline-none focus:border-[#0f5ce0] transition shadow-sm"
            />
          </div>
        </div>

        <div className="overflow-x-auto min-h-[300px]">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 text-[#7b8191]">
              <p className="text-[14px] font-bold">Memuat daftar universitas...</p>
            </div>
          ) : loadError ? (
            <div className="flex flex-col items-center justify-center py-20 text-[#ef4444]">
              <p className="text-[14px] font-bold">{loadError}</p>
            </div>
          ) : paginatedData.length > 0 ? (
            <table className="w-full text-left border-collapse min-w-[900px]">
              <thead>
                <tr className="bg-[#f8faff] border-y border-[#e4e9f4] text-[10px] font-extrabold text-[#7b8191] tracking-widest uppercase">
                  <th className="px-6 py-4 whitespace-nowrap w-[30%]">Universitas</th>
                  <th className="px-6 py-4 whitespace-nowrap w-[25%]">Admin Utama</th>
                  <th className="px-4 py-4 whitespace-nowrap w-[15%] text-center">Status Akun</th>
                  <th className="px-4 py-4 whitespace-nowrap w-[15%] text-center">Terakhir Aktif</th>
                  <th className="px-6 py-4 whitespace-nowrap w-[15%] text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f1f4f9]">
                {paginatedData.map((univ) => {
                  const lastActive = formatLastActive(univ.lastActive)
                  return (
                    <tr key={univ.id} className="hover:bg-[#fafbfe] transition-colors group">
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-[10px] bg-[#f8faff] text-[#a0a6b5] border border-[#e4e9f4] flex items-center justify-center font-black text-[13px] shrink-0">
                            {getInitialsOf(univ.name)}
                          </div>
                          <div>
                            <h4 className="text-[14px] font-bold text-[#111827] group-hover:text-[#0f5ce0] transition-colors">{univ.name}</h4>
                            <p className="text-[12px] text-[#7b8191] mt-0.5">{univ.location}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div>
                          <p className="text-[14px] font-bold text-[#111827]">{univ.adminName}</p>
                          <p className="text-[12px] text-[#7b8191] mt-0.5">{univ.adminEmail}</p>
                        </div>
                      </td>
                      <td className="px-4 py-5 text-center">
                        {univ.status === 'AKTIF' ? (
                          <StatusBadge label="Aktif" tone="success" width={100} icon={<CheckCircle2 size={12} strokeWidth={3} />} />
                        ) : (
                          <StatusBadge label="Pending" tone="warning" width={100} icon={<Clock size={12} strokeWidth={3} />} />
                        )}
                      </td>
                      <td className="px-4 py-5 text-center">
                        <p className="text-[12px] font-bold text-[#5b6170] leading-tight">
                          {lastActive.date}
                          {lastActive.time && (
                            <>
                              <br/>
                              <span className="text-[#a0a6b5] font-semibold text-[11px]">{lastActive.time}</span>
                            </>
                          )}
                        </p>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleOpenEdit(univ)}
                            className="w-8 h-8 flex items-center justify-center text-[#7b8191] hover:text-[#0f5ce0] hover:bg-[#eef4ff] rounded-[8px] transition"
                            title="Edit"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => setDeleteId(univ.id)}
                            className="w-8 h-8 flex items-center justify-center text-[#7b8191] hover:text-[#ef4444] hover:bg-[#fee2e2] rounded-[8px] transition"
                            title="Hapus"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-[#7b8191]">
              <Search size={40} className="mb-4 text-[#e4e9f4]" />
              <p className="text-[14px] font-bold">Tidak ada universitas yang ditemukan</p>
            </div>
          )}
        </div>

        {/* Paginasi Footer */}
        {!isLoading && !loadError && filteredData.length > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-4 border-t border-[#f1f4f9] bg-white text-sm gap-4">
            <div className="text-[13px] text-[#7b8191] font-medium text-center sm:text-left">
              Menampilkan <span className="text-[#111827] font-bold">{startIndex + 1}-{Math.min(startIndex + ITEMS_PER_PAGE, filteredData.length)}</span> dari <span className="text-[#111827] font-bold">{filteredData.length}</span>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="text-[13px] font-bold text-[#0f5ce0] hover:text-[#0d4ebf] disabled:text-[#a0a6b5] disabled:opacity-50 transition mr-2"
              >
                Sebelumnya
              </button>

              {getPaginationGroup().map((pageNum) => (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`w-8 h-8 rounded-lg font-bold text-xs flex items-center justify-center transition ${
                    currentPage === pageNum
                      ? 'bg-[#0f5ce0] text-white shadow-sm'
                      : 'text-[#5b6170] hover:bg-[#f8faff] border border-transparent'
                  }`}
                >
                  {pageNum}
                </button>
              ))}

              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages || totalPages === 0}
                className="text-[13px] font-bold text-[#0f5ce0] hover:text-[#0d4ebf] disabled:text-[#a0a6b5] disabled:opacity-50 transition ml-2"
              >
                Selanjutnya
              </button>
            </div>
          </div>
        )}
      </div>

      {/* MODAL EDIT UNIVERSITAS */}
      {isEditModalOpen && editData && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-[24px] w-full max-w-[600px] shadow-xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-[#e4e9f4] flex justify-between items-center bg-white">
              <h2 className="text-[18px] font-bold text-[#111827]">Edit Data Universitas</h2>
              <button onClick={() => setIsEditModalOpen(false)} className="text-[#a0a6b5] hover:text-[#111827] transition-colors p-1">
                <X size={20} strokeWidth={2.5} />
              </button>
            </div>
            <form onSubmit={handleSaveEdit}>
              <div className="p-6 space-y-5">
                <div>
                  <label className="block text-[13px] font-bold text-[#111827] mb-2">Nama Universitas</label>
                  <input type="text" value={editData.name} onChange={e => setEditData({...editData, name: e.target.value})} className="w-full h-11 px-4 bg-[#f8faff] border border-[#e4e9f4] rounded-lg text-[13px] font-medium text-[#111827] outline-none focus:border-[#0f5ce0] transition shadow-sm" required />
                </div>
                <div>
                  <label className="block text-[13px] font-bold text-[#111827] mb-2">Kota Domisili</label>
                  <input type="text" value={editData.location} onChange={e => setEditData({...editData, location: e.target.value})} className="w-full h-11 px-4 bg-[#f8faff] border border-[#e4e9f4] rounded-lg text-[13px] font-medium text-[#111827] outline-none focus:border-[#0f5ce0] transition shadow-sm" required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[13px] font-bold text-[#111827] mb-2">Nama Admin Utama</label>
                    <input type="text" value={editData.adminName} onChange={e => setEditData({...editData, adminName: e.target.value})} className="w-full h-11 px-4 bg-[#f8faff] border border-[#e4e9f4] rounded-lg text-[13px] font-medium text-[#111827] outline-none focus:border-[#0f5ce0] transition shadow-sm" required />
                  </div>
                  <div>
                    <label className="block text-[13px] font-bold text-[#111827] mb-2">Status Akun</label>
                    <select
                      value={editData.status}
                      onChange={e => setEditData({...editData, status: e.target.value as 'AKTIF'|'PENDING'})}
                      className="w-full h-11 px-4 bg-[#f8faff] border border-[#e4e9f4] rounded-lg text-[13px] font-medium text-[#111827] outline-none focus:border-[#0f5ce0] transition shadow-sm cursor-pointer appearance-none"
                      style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%235b6170' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center' }}
                    >
                      {universityStatusFormOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              <div className="p-5 border-t border-[#e4e9f4] bg-white flex justify-end gap-3">
                <button type="button" onClick={() => setIsEditModalOpen(false)} className="px-5 py-2.5 text-[13px] font-bold text-[#5b6170] hover:bg-[#f1f4f9] rounded-lg transition-colors border border-[#e4e9f4]">
                  Batal
                </button>
                <button type="submit" className="px-5 py-2.5 bg-[#0f5ce0] hover:bg-[#0d4ebf] text-white text-[13px] font-bold rounded-lg transition-colors shadow-sm">
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Custom Konfirmasi Hapus Modal */}
      <ConfirmModal
        isOpen={!!deleteId}
        icon={Trash2}
        title="Hapus Data Universitas?"
        message="Tindakan ini tidak dapat dibatalkan. Data admin dan universitas terkait akan dihapus dari sistem."
        confirmLabel="Hapus Data"
        tone="danger"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  )
}

export default AdminKelolaUniversitas
