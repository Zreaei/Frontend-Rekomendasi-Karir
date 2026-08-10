import React, { useState, useEffect, useCallback } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, ZoomIn, Download, Share2, Info, CheckCircle2, XCircle, AlertTriangle, Plus, ExternalLink, FileText, X, Trash2, Loader2 } from 'lucide-react'
import { certificateApi } from '../../services/university.service'

type DisplayStatus = 'Verified' | 'Pending' | 'Rejected'

const STATUS_MAP: Record<string, DisplayStatus> = {
  pending: 'Pending',
  approved: 'Verified',
  verified: 'Verified',
  rejected: 'Rejected',
}

interface CertDetail {
  id: string
  title: string
  issuer: string
  date: string
  fileUrl: string | null
  studentName: string
  studentNim: string
}

const formatDate = (raw?: string | null): string => {
  if (!raw) return '-'
  const d = new Date(raw)
  if (isNaN(d.getTime())) return '-'
  return d.toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })
}

// Berkas bisa berupa PDF atau gambar; keduanya perlu cara tampil berbeda.
const isPdf = (url?: string | null) => !!url && url.split('?')[0].toLowerCase().endsWith('.pdf')
const isImage = (url?: string | null) =>
  !!url && /\.(png|jpe?g|webp|gif)$/i.test(url.split('?')[0])

const DetailSertifikat = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const [certData, setCertData] = useState<CertDetail | null>(null)
  const [currentStatus, setCurrentStatus] = useState<DisplayStatus>('Pending')
  const [adminNote, setAdminNote] = useState('')
  const [skills, setSkills] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [busy, setBusy] = useState(false)

  const [notification, setNotification] = useState<{message: string, type: 'success'|'warning'|'error'} | null>(null)
  const [isZoomed, setIsZoomed] = useState(false)
  const [isEditingSkills, setIsEditingSkills] = useState(false)
  const [draftSkills, setDraftSkills] = useState<string[]>([])
  const [newSkillInput, setNewSkillInput] = useState('')

  const showNotification = (msg: string, type: 'success' | 'warning' | 'error') => {
    setNotification({ message: msg, type })
    setTimeout(() => setNotification(null), 3500)
  }

  const loadCertificate = useCallback(async () => {
    if (!id) {
      navigate('/university/verifikasi-sertifikat')
      return
    }
    setLoading(true)
    setLoadError('')
    try {
      const c: any = await certificateApi.getById(id)
      setCertData({
        id: c.id,
        title: c.title ?? '-',
        issuer: c.issuer ?? '-',
        date: formatDate(c.created_at ?? c.createdAt),
        fileUrl: c.fileUrl ?? null,
        studentName: c?.student?.user?.name ?? 'Tanpa Nama',
        studentNim: c?.student?.nim ?? '-',
      })
      setCurrentStatus(STATUS_MAP[String(c.status ?? '').toLowerCase()] ?? 'Pending')
      setAdminNote(c.note ?? c.adminNote ?? '')
      setSkills((c.skills ?? []).map((s: any) => s?.skill?.name ?? s?.name).filter(Boolean))
    } catch (err: any) {
      setLoadError(err?.response?.data?.message ?? 'Gagal memuat detail sertifikat.')
    } finally {
      setLoading(false)
    }
  }, [id, navigate])

  useEffect(() => {
    loadCertificate()
  }, [loadCertificate])

  const handleZoom = () => setIsZoomed(true)

  const handleDownload = () => {
    if (!certData?.fileUrl) {
      showNotification('Berkas sertifikat tidak tersedia.', 'warning')
      return
    }
    window.open(certData.fileUrl, '_blank', 'noopener,noreferrer')
  }

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      showNotification('Tautan halaman berhasil disalin ke clipboard!', 'success')
    } catch {
      showNotification('Gagal menyalin tautan.', 'error')
    }
  }

  // --- KELOLA KEAHLIAN ---
  const handleOpenSkillModal = () => {
    setDraftSkills([...skills])
    setNewSkillInput('')
    setIsEditingSkills(true)
  }

  const handleAddDraftSkill = (e: React.FormEvent) => {
    e.preventDefault()
    const val = newSkillInput.trim()
    if (val && !draftSkills.includes(val)) {
      setDraftSkills([...draftSkills, val])
      setNewSkillInput('')
    }
  }

  const handleRemoveDraftSkill = (skillToRemove: string) => {
    setDraftSkills(draftSkills.filter(s => s !== skillToRemove))
  }

  const handleSaveSkills = async () => {
    if (!certData) return
    if (JSON.stringify(draftSkills) === JSON.stringify(skills)) {
      showNotification('Tidak ada perubahan keahlian yang dilakukan.', 'warning')
      setIsEditingSkills(false)
      return
    }
    setBusy(true)
    try {
      await certificateApi.updateSkills(certData.id, draftSkills)
      setSkills(draftSkills)
      setIsEditingSkills(false)
      showNotification(
        currentStatus === 'Verified'
          ? 'Keahlian diperbarui. Perubahan ini berlaku bila sertifikat diverifikasi ulang.'
          : 'Keahlian terkait berhasil diperbarui.',
        'success',
      )
    } catch (err: any) {
      showNotification(err?.response?.data?.message ?? 'Gagal menyimpan keahlian.', 'error')
    } finally {
      setBusy(false)
    }
  }

  // --- AKSI VERIFIKASI ---
  const handleUpdateStatus = async (newStatus: DisplayStatus) => {
    if (!certData) return
    if (newStatus === 'Rejected' && !adminNote.trim()) {
      showNotification('Catatan penolakan harus diisi.', 'error')
      return
    }

    setBusy(true)
    try {
      if (newStatus === 'Verified') {
        await certificateApi.approve(certData.id)
        showNotification(
          `Sertifikat diverifikasi. ${skills.length} keahlian ditambahkan ke kompetensi mahasiswa.`,
          'success',
        )
      } else if (newStatus === 'Rejected') {
        await certificateApi.reject(certData.id, adminNote.trim())
        showNotification('Sertifikat telah ditolak.', 'success')
      } else {
        await certificateApi.setPending(certData.id)
        showNotification('Status dikembalikan ke menunggu verifikasi.', 'success')
      }
      setCurrentStatus(newStatus)
      await loadCertificate()
    } catch (err: any) {
      showNotification(err?.response?.data?.message ?? 'Gagal memperbarui status sertifikat.', 'error')
    } finally {
      setBusy(false)
    }
  }

  // Panel pratinjau berkas asli dari Supabase.
  const renderPreview = (tinggi: string) => {
    if (!certData?.fileUrl) {
      return (
        <div className={`w-full ${tinggi} bg-white border border-[#e4e9f4] rounded-xl flex flex-col items-center justify-center gap-3 text-center px-6`}>
          <FileText size={40} className="text-[#c0c5d0]" />
          <p className="text-[13px] font-bold text-[#5b6170]">Berkas tidak tersedia</p>
          <p className="text-[12px] text-[#a0a6b5] max-w-[320px]">
            Mahasiswa tidak melampirkan dokumen, atau berkasnya gagal diunggah.
          </p>
        </div>
      )
    }

    if (isPdf(certData.fileUrl)) {
      return (
        <iframe
          src={certData.fileUrl}
          title={certData.title}
          className={`w-full ${tinggi} bg-white border border-[#e4e9f4] rounded-xl`}
        />
      )
    }

    if (isImage(certData.fileUrl)) {
      return (
        <div className={`w-full ${tinggi} bg-white border border-[#e4e9f4] rounded-xl flex items-center justify-center overflow-auto p-4`}>
          <img src={certData.fileUrl} alt={certData.title} className="max-w-full max-h-full object-contain" />
        </div>
      )
    }

    return (
      <div className={`w-full ${tinggi} bg-white border border-[#e4e9f4] rounded-xl flex flex-col items-center justify-center gap-3 text-center px-6`}>
        <FileText size={40} className="text-[#0f5ce0]" />
        <p className="text-[13px] font-bold text-[#111827]">Format berkas tidak dapat dipratinjau</p>
        <a
          href={certData.fileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-[13px] font-bold text-[#0f5ce0] hover:underline"
        >
          Buka di tab baru <ExternalLink size={14} />
        </a>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3 text-[#5b6170]">
        <Loader2 size={28} className="animate-spin text-[#0f5ce0]" />
        <p className="text-sm font-medium">Memuat detail sertifikat...</p>
      </div>
    )
  }

  if (!certData) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <p className="text-[#7b8191]">{loadError || 'Sertifikat tidak ditemukan.'}</p>
        <button onClick={() => navigate('/university/verifikasi-sertifikat')} className="px-4 py-2 bg-[#0f5ce0] text-white rounded-xl text-sm font-bold">
          Kembali
        </button>
      </div>
    )
  }

  return (
    <div className="w-full flex flex-col gap-6 animate-in fade-in duration-300 pb-12 relative max-w-[1200px] mx-auto">
      {notification && (
        <div className="fixed top-8 right-8 z-[100] flex items-start gap-4 p-4 bg-white border border-[#e4e9f4] rounded-xl w-full max-w-[420px] transform transition-all animate-in slide-in-from-top-10 fade-in duration-500 ease-out overflow-hidden shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)]">
          <div className="flex-1 pt-0.5 flex gap-3 items-start">
            <div className={`mt-0.5 rounded-full flex items-center justify-center shrink-0 ${
              notification.type === 'success' ? 'text-[#10b981]' 
              : notification.type === 'warning' ? 'text-[#f59e0b]'
              : 'text-red-500'
            }`}>
              {notification.type === 'success' ? <CheckCircle2 size={20} /> : <AlertTriangle size={20} />}
            </div>
            <div>
              <h3 className="text-[14px] font-bold text-[#111827]">
                {notification.type === 'success' ? 'Berhasil!' : 'Perhatian'}
              </h3>
              <p className="text-[13px] text-[#5b6170] mt-0.5 leading-relaxed">{notification.message}</p>
            </div>
          </div>
          <button onClick={() => setNotification(null)} className="text-[#a0a6b5] hover:text-[#111827] transition-colors p-1 shrink-0">
            <X size={16} />
          </button>
        </div>
      )}

      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate('/university/verifikasi-sertifikat')}
          className="w-10 h-10 flex items-center justify-center rounded-[12px] bg-[#E3F0FF] hover:bg-[#d0e4ff] transition"
        >
          <ArrowLeft size={18} strokeWidth={2.5} className="text-[#3B82F6]" />
        </button>
        <h1 className="text-[22px] font-bold text-[#0f5ce0] tracking-tight">Verifikasi Sertifikat</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 flex flex-col gap-6">
          
          <div className="bg-white border border-[#e4e9f4] rounded-[16px] overflow-hidden shadow-sm flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-[#e4e9f4] bg-[#f8faff]">
              <h2 className="text-[12px] font-black text-[#5b6170] uppercase tracking-widest">Pratinjau Dokumen</h2>
              <div className="flex items-center gap-4 text-[#7b8191]">
                <button onClick={handleZoom} title="Perbesar Dokumen" className="hover:text-[#0f5ce0] transition"><ZoomIn size={18} strokeWidth={2} /></button>
                <button onClick={handleDownload} title="Buka / Unduh Dokumen" className="hover:text-[#0f5ce0] transition"><Download size={18} strokeWidth={2} /></button>
                <button onClick={handleShare} title="Bagikan Tautan" className="hover:text-[#0f5ce0] transition"><Share2 size={18} strokeWidth={2} /></button>
              </div>
            </div>
            
            <div className="p-6 bg-[#f8faff]">
              {renderPreview('h-[520px]')}
            </div>
          </div>

          <div className="bg-white border border-[#e4e9f4] rounded-[16px] shadow-sm overflow-hidden">
            <div className="p-4 border-b border-[#e4e9f4] bg-[#f8faff]">
              <h2 className="text-[12px] font-black text-[#5b6170] uppercase tracking-widest">Informasi Sertifikat</h2>
            </div>
            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-8">
              <div>
                <p className="text-[12px] text-[#7b8191] font-bold mb-1.5">Nama Sertifikat</p>
                <p className="text-[14px] font-bold text-[#111827]">{certData.title}</p>
              </div>
              <div>
                <p className="text-[12px] text-[#7b8191] font-bold mb-1.5">Organisasi/Lembaga Penerbit</p>
                <p className="text-[14px] font-bold text-[#111827]">{certData.issuer}</p>
              </div>
              <div>
                <p className="text-[12px] text-[#7b8191] font-bold mb-1.5">Tanggal Unggah</p>
                <p className="text-[14px] font-bold text-[#111827]">{certData.date}</p>
              </div>
              <div>
                <p className="text-[12px] text-[#7b8191] font-bold mb-1.5">Berkas Dokumen</p>
                {certData.fileUrl ? (
                  <a href={certData.fileUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-[14px] font-bold text-[#0f5ce0] hover:text-[#0d4ebf] hover:underline transition">
                    Buka Berkas <ExternalLink size={14} />
                  </a>
                ) : (
                  <span className="text-[14px] font-bold text-[#a0a6b5]">Tidak ada berkas</span>
                )}
              </div>
            </div>
          </div>

          <div className="bg-white border border-[#e4e9f4] rounded-[16px] shadow-sm overflow-hidden">
            <div className="p-4 border-b border-[#e4e9f4] bg-[#f8faff] flex justify-between items-center">
              <h2 className="text-[12px] font-black text-[#5b6170] uppercase tracking-widest">Keahlian Terkait</h2>
              <span className="text-[11px] text-[#7b8191] font-medium normal-case">
                Diberikan ke mahasiswa saat sertifikat diverifikasi
              </span>
            </div>
            <div className="p-6 flex flex-wrap items-center gap-3">
              {skills.map((skill, index) => (
                <button 
                  key={index} 
                  onClick={handleOpenSkillModal}
                  title="Klik untuk mengedit keahlian"
                  className="inline-flex items-center px-4 py-2 bg-[#f4f7ff] text-[#0f5ce0] text-[13px] font-bold rounded-lg border border-[#eef2ff] hover:border-[#0f5ce0] hover:shadow-sm transition-all cursor-pointer"
                >
                  {skill}
                </button>
              ))}
              {skills.length === 0 && <span className="text-[13px] text-[#a0a6b5] italic">Belum ada keahlian terkait.</span>}
              <button 
                onClick={handleOpenSkillModal}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-white text-[#7b8191] text-[13px] font-bold rounded-lg border border-[#e4e9f4] hover:bg-gray-50 hover:text-[#0f5ce0] hover:border-[#0f5ce0] transition border-dashed"
              >
                <Plus size={14} strokeWidth={2.5} /> Tambah Skill
              </button>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1 flex flex-col gap-6">
          
          <div className="bg-white border border-[#e4e9f4] rounded-[16px] shadow-sm p-5 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className="text-[12px] font-black text-[#7b8191] uppercase tracking-widest">Status Saat Ini</span>
              
              {currentStatus === 'Pending' && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#eef4ff] text-[#0f5ce0] text-[11px] font-bold rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0f5ce0]"></span> Menunggu Verifikasi
                </span>
              )}
              {currentStatus === 'Verified' && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#e6f9f0] text-[#10b981] text-[11px] font-bold rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#10b981]"></span> Terverifikasi
                </span>
              )}
              {currentStatus === 'Rejected' && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#fef2f2] text-red-500 text-[11px] font-bold rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span> Ditolak
                </span>
              )}
            </div>
            <div className="bg-[#f8faff] rounded-xl p-4 flex gap-3 border border-[#eef2ff]">
              <Info size={18} className="text-[#0f5ce0] shrink-0 mt-0.5" />
              <p className="text-[13px] text-[#5b6170] leading-relaxed">
                Diajukan oleh <span className="font-bold text-[#111827]">{certData.studentName}</span> ({certData.studentNim}) pada <span className="font-medium text-[#111827]">{certData.date}</span>.
              </p>
            </div>
          </div>

          <div className="bg-white border border-[#e4e9f4] rounded-[16px] shadow-sm overflow-hidden flex flex-col">
            <div className={`p-4 border-b border-[#e4e9f4] ${currentStatus === 'Pending' ? 'bg-[#f4f7ff]' : currentStatus === 'Verified' ? 'bg-[#f0fdf4]' : 'bg-[#fef2f2]'}`}>
              <h2 className="text-[13px] font-black text-[#111827]">Aksi Verifikasi</h2>
            </div>
            
            <div className="p-5 flex flex-col gap-5">
              {currentStatus === 'Pending' && (
                <>
                  <div className="flex flex-col gap-2">
                    <label className="text-[13px] font-bold text-[#111827]">Catatan Admin</label>
                    <textarea 
                      rows={4}
                      value={adminNote}
                      onChange={(e) => setAdminNote(e.target.value)}
                      placeholder="Wajib diisi jika menolak. Catatan ini akan dibaca mahasiswa."
                      className="w-full border border-[#e4e9f4] rounded-xl p-3 text-[13px] focus:outline-none focus:border-[#0f5ce0] transition resize-none placeholder:text-[#a0a6b5]"
                    />
                  </div>
                  <div className="flex flex-col gap-2.5">
                    <button 
                      onClick={() => handleUpdateStatus('Verified')}
                      disabled={busy}
                      className="w-full flex items-center justify-center gap-2 py-3 bg-[#0f5ce0] text-white text-[13px] font-bold rounded-xl hover:bg-[#0d4ebf] transition shadow-sm disabled:opacity-60"
                    >
                      {busy ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle2 size={16} strokeWidth={2.5} />} Terima Sertifikat
                    </button>
                    <button 
                      onClick={() => handleUpdateStatus('Rejected')}
                      disabled={busy}
                      className="w-full flex items-center justify-center gap-2 py-3 bg-white border border-red-200 text-red-500 text-[13px] font-bold rounded-xl hover:bg-red-50 transition disabled:opacity-60"
                    >
                      <XCircle size={16} strokeWidth={2.5} /> Tolak Sertifikat
                    </button>
                  </div>
                  <p className="text-[10px] text-center text-[#a0a6b5] mt-1">
                    Menerima sertifikat akan menambahkan {skills.length} keahlian di atas ke kompetensi mahasiswa.
                  </p>
                </>
              )}

              {currentStatus === 'Verified' && (
                <>
                  <div className="bg-[#e6f9f0] border border-[#10b981]/20 rounded-xl p-6 flex flex-col items-center justify-center text-center gap-2">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm">
                      <CheckCircle2 size={24} className="text-[#10b981]" strokeWidth={2.5} />
                    </div>
                    <h3 className="text-[15px] font-bold text-[#10b981] mt-2">Sertifikat Terverifikasi</h3>
                    <p className="text-[12px] text-[#5b6170]">
                      Keahlian terkait sudah masuk ke kompetensi mahasiswa.
                    </p>
                  </div>
                  <p className="text-[10px] text-center text-[#a0a6b5]">
                    Mengembalikan status akan mencabut keahlian yang berasal dari sertifikat ini.
                  </p>
                  <button 
                    onClick={() => handleUpdateStatus('Pending')}
                    disabled={busy}
                    className="w-full mt-2 flex items-center justify-center gap-2 py-3 bg-white border border-[#e4e9f4] text-[#5b6170] text-[13px] font-bold rounded-xl hover:bg-gray-50 transition disabled:opacity-60"
                  >
                    {busy && <Loader2 size={14} className="animate-spin" />}
                    Kembalikan ke Menunggu
                  </button>
                </>
              )}

              {currentStatus === 'Rejected' && (
                <>
                  <div className="flex flex-col gap-2">
                    <label className="text-[13px] font-bold text-[#111827]">Catatan Admin</label>
                    <div className="w-full bg-[#f8faff] border border-[#e4e9f4] rounded-xl p-4 text-[13px] text-[#5b6170] leading-relaxed">
                      {adminNote || 'Sertifikat ini ditolak oleh tim akademik.'}
                    </div>
                  </div>
                  <div className="bg-[#fef2f2] border border-red-200 rounded-xl py-3 px-4 flex items-center justify-center gap-2 mt-1">
                    <AlertTriangle size={16} className="text-red-500" strokeWidth={2.5} />
                    <span className="text-[13px] font-bold text-red-500">Sertifikat Telah Ditolak</span>
                  </div>
                  <button 
                    onClick={() => handleUpdateStatus('Pending')}
                    disabled={busy}
                    className="w-full mt-2 flex items-center justify-center gap-2 py-3 bg-white border border-[#0f5ce0] text-[#0f5ce0] text-[13px] font-bold rounded-xl hover:bg-[#f4f7ff] transition disabled:opacity-60"
                  >
                    {busy && <Loader2 size={14} className="animate-spin" />}
                    Tinjau Ulang
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {isZoomed && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-6 animate-in fade-in duration-200">
          <div className="relative w-full max-w-5xl h-full max-h-[85vh] bg-white rounded-[24px] overflow-hidden shadow-2xl flex flex-col animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center px-6 py-4 border-b border-[#e4e9f4]">
              <h3 className="text-[16px] font-bold text-[#111827]">{certData.title}</h3>
              <button onClick={() => setIsZoomed(false)} className="text-[#a0a6b5] hover:text-red-500 transition p-1 bg-gray-100 rounded-full">
                <X size={20} />
              </button>
            </div>
            <div className="flex-1 overflow-auto p-6 bg-[#f4f7ff]">
              {renderPreview('h-full min-h-[60vh]')}
            </div>
          </div>
        </div>
      )}

      {isEditingSkills && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in duration-200 px-4">
          <div className="bg-white rounded-[20px] p-6 w-full max-w-md shadow-xl flex flex-col gap-5 animate-in zoom-in-95 duration-200">
            
            <div className="flex justify-between items-center border-b border-[#e4e9f4] pb-4">
              <div>
                <h3 className="text-[18px] font-bold text-[#111827]">Kelola Keahlian Terkait</h3>
                <p className="text-[13px] text-[#5b6170] mt-1">Keahlian ini diberikan ke mahasiswa saat sertifikat diverifikasi.</p>
              </div>
              <button onClick={() => setIsEditingSkills(false)} className="text-[#a0a6b5] hover:text-[#111827] transition p-1 shrink-0">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAddDraftSkill} className="flex gap-2">
              <input 
                type="text"
                value={newSkillInput}
                onChange={(e) => setNewSkillInput(e.target.value)}
                placeholder="Ketik keahlian baru..."
                className="flex-1 border border-[#e4e9f4] rounded-xl px-4 py-2.5 text-[13px] focus:outline-none focus:border-[#0f5ce0] transition"
              />
              <button 
                type="submit"
                disabled={!newSkillInput.trim()}
                className="px-4 py-2.5 bg-[#0f5ce0] text-white rounded-xl disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-[#0d4ebf] transition shrink-0"
              >
                <Plus size={18} strokeWidth={2.5} />
              </button>
            </form>

            <div className="min-h-[150px] max-h-[250px] overflow-y-auto bg-[#f8faff] rounded-xl border border-[#e4e9f4] p-4 flex flex-wrap gap-2 content-start">
              {draftSkills.map((skill, index) => (
                <div key={index} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#e4e9f4] text-[#111827] text-[13px] font-bold rounded-lg shadow-sm">
                  {skill}
                  <button onClick={() => handleRemoveDraftSkill(skill)} className="text-[#a0a6b5] hover:text-red-500 transition ml-1">
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
              {draftSkills.length === 0 && (
                <p className="text-[13px] text-[#a0a6b5] italic w-full text-center mt-10">Belum ada keahlian terkait.</p>
              )}
            </div>
            
            <div className="flex items-center justify-end gap-3 pt-2">
              <button 
                onClick={() => setIsEditingSkills(false)} 
                disabled={busy}
                className="px-5 py-2.5 text-[13px] font-bold text-[#5b6170] bg-white border border-[#e4e9f4] hover:bg-gray-50 rounded-xl transition disabled:opacity-50"
              >
                Batal
              </button>
              <button 
                onClick={handleSaveSkills}
                disabled={busy}
                className="flex items-center gap-2 px-5 py-2.5 text-[13px] font-bold text-white bg-[#0f5ce0] hover:bg-[#0d4ebf] rounded-xl transition shadow-sm disabled:opacity-60"
              >
                {busy && <Loader2 size={14} className="animate-spin" />}
                Simpan Perubahan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default DetailSertifikat