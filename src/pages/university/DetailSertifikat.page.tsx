import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, ZoomIn, Download, Share2, Info, CheckCircle2, XCircle, AlertTriangle, Plus, ExternalLink, Image as ImageIcon, X, Trash2 } from 'lucide-react'
import { UniversityService, type SertifikatMahasiswa } from './UniversityData'

interface MergedCertificate extends SertifikatMahasiswa {
  studentName: string
  studentNim: string
}

const DetailSertifikat = () => {
  const { id } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  
  const certDataParams = location.state?.certData as MergedCertificate | undefined
  const [certData, setCertData] = useState<MergedCertificate | null>(certDataParams || null)
  
  const [currentStatus, setCurrentStatus] = useState<'Verified' | 'Pending' | 'Rejected'>('Pending')
  const [adminNote, setAdminNote] = useState('')
  const [skills, setSkills] = useState<string[]>([])
  const [notification, setNotification] = useState<{message: string, type: 'success'|'warning'|'error'} | null>(null)

  const [isZoomed, setIsZoomed] = useState(false)

  const [isEditingSkills, setIsEditingSkills] = useState(false)
  const [draftSkills, setDraftSkills] = useState<string[]>([])
  const [newSkillInput, setNewSkillInput] = useState('')

  useEffect(() => {
    loadCertificate()
  }, [id])

  const loadCertificate = async () => {
    const certs = await UniversityService.getAllSertifikat()
    const students = await UniversityService.getStudents()
    
    const targetId = id || certDataParams?.id
    if (!targetId) {
      navigate('/university/verifikasi-sertifikat')
      return
    }

    const foundCert = certs.find(c => c.id === targetId)
    if (foundCert) {
      const student = students.find(s => s.id === foundCert.studentId)
      setCertData({
        ...foundCert,
        studentName: student ? student.name : 'Unknown',
        studentNim: student ? student.nim : '-'
      })
      setCurrentStatus(foundCert.status)
      setAdminNote(foundCert.adminNote || '')
      setSkills(foundCert.skills || [])
    }
  }

  if (!certData) return null

  const handleZoom = () => setIsZoomed(true)
  
  const handleDownload = () => {
    const link = document.createElement('a')
    link.href = '#' 
    link.download = `${certData.title.replace(/\s+/g, '_')}_Certificate.pdf`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    showNotification('Dokumen berhasil diunduh.', 'success')
  }

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      showNotification('Tautan dokumen berhasil disalin ke clipboard!', 'success')
    } catch (err) {
      showNotification('Gagal menyalin tautan.', 'error')
    }
  }

  // --- FUNGSI CRUD SKILL ---
  const handleOpenSkillModal = () => {
    setDraftSkills([...skills])
    setNewSkillInput('')
    setIsEditingSkills(true)
  }

  const handleAddDraftSkill = (e: React.FormEvent) => {
    e.preventDefault()
    if (newSkillInput.trim() && !draftSkills.includes(newSkillInput.trim())) {
      setDraftSkills([...draftSkills, newSkillInput.trim()])
      setNewSkillInput('')
    }
  }

  const handleRemoveDraftSkill = (skillToRemove: string) => {
    setDraftSkills(draftSkills.filter(s => s !== skillToRemove))
  }

  const handleSaveSkills = async () => {
    if (JSON.stringify(draftSkills) === JSON.stringify(skills)) {
      showNotification('Tidak ada perubahan skill yang dilakukan.', 'warning')
      setIsEditingSkills(false)
      return
    }
    
    await UniversityService.updateSertifikat(certData.id, { skills: draftSkills })
    setSkills(draftSkills)
    setIsEditingSkills(false)
    showNotification('Keahlian terkait berhasil diperbarui.', 'success')
  }

  const handleUpdateStatus = async (newStatus: 'Verified' | 'Pending' | 'Rejected') => {
    if (newStatus === 'Rejected' && !adminNote.trim()) {
      showNotification('Catatan penolakan harus diisi.', 'error')
      return
    }

    await UniversityService.updateSertifikat(certData.id, { 
      status: newStatus,
      adminNote: adminNote
    })
    setCurrentStatus(newStatus)
    
    if (newStatus === 'Verified') showNotification('Sertifikat berhasil diverifikasi.', 'success')
    if (newStatus === 'Rejected') showNotification('Sertifikat telah ditolak.', 'success')
  }

  const showNotification = (msg: string, type: 'success' | 'warning' | 'error') => {
    setNotification({ message: msg, type })
    setTimeout(() => setNotification(null), 3000)
  }

  return (
    <div className="w-full flex flex-col gap-6 animate-in fade-in duration-300 pb-12 relative max-w-[1200px] mx-auto">
      {notification && (
        <div className={`fixed top-8 right-8 z-[100] flex items-start gap-4 p-4 bg-white border border-[#e4e9f4] rounded-xl w-full max-w-[420px] transform transition-all animate-in slide-in-from-top-10 fade-in duration-500 ease-out overflow-hidden shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)]`}>
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
          <ArrowLeft
            size={18}
            strokeWidth={2.5}
            className="text-[#3B82F6]"
          />
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
                <button onClick={handleDownload} title="Unduh Dokumen" className="hover:text-[#0f5ce0] transition"><Download size={18} strokeWidth={2} /></button>
                <button onClick={handleShare} title="Bagikan Tautan" className="hover:text-[#0f5ce0] transition"><Share2 size={18} strokeWidth={2} /></button>
              </div>
            </div>
            
            <div className="p-8 bg-[#f8faff] flex justify-center items-center">
              <div className="w-full max-w-[650px] aspect-[1.414/1] bg-white border border-[#e4e9f4] shadow-[0_10px_30px_-10px_rgba(0,0,0,0.1)] rounded-sm flex flex-col items-center justify-center p-8 relative overflow-hidden group">
                <div className="absolute inset-2 border-2 border-double border-[#d1d5db] opacity-30"></div>
                <div className="z-10 flex flex-col items-center text-center">
                  <ImageIcon size={48} className="text-[#c0c5d0] mb-4 opacity-50" />
                  <h3 className="text-2xl font-serif font-bold text-[#111827] mb-2">{certData.title}</h3>
                  <p className="text-[#7b8191] font-medium mb-6">diberikan kepada</p>
                  <p className="text-3xl font-serif text-[#0f5ce0] italic mb-6">{certData.studentName}</p>
                  <div className="w-32 h-32 rounded-full border-[6px] border-[#f59e0b] opacity-20 absolute bottom-8 right-8"></div>
                </div>
              </div>
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
                <p className="text-[12px] text-[#7b8191] font-bold mb-1.5">Tanggal Terbit</p>
                <p className="text-[14px] font-bold text-[#111827]">{certData.date}</p>
              </div>
              <div>
                <p className="text-[12px] text-[#7b8191] font-bold mb-1.5">ID Kredensial / Tautan</p>
                <a href={certData.url || '#'} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-[14px] font-bold text-[#0f5ce0] hover:text-[#0d4ebf] hover:underline transition">
                  {certData.url ? 'Lihat Kredensial' : 'Tidak Ada Tautan'} <ExternalLink size={14} />
                </a>
              </div>
            </div>
          </div>

          <div className="bg-white border border-[#e4e9f4] rounded-[16px] shadow-sm overflow-hidden">
            <div className="p-4 border-b border-[#e4e9f4] bg-[#f8faff] flex justify-between items-center">
              <h2 className="text-[12px] font-black text-[#5b6170] uppercase tracking-widest">Keahlian Terkait</h2>
            </div>
            <div className="p-6 flex flex-wrap items-center gap-3">
              {skills.map((skill, index) => (
                <button 
                  key={index} 
                  onClick={handleOpenSkillModal}
                  title="Klik untuk mengedit keahlian"
                  className="inline-flex items-center px-4 py-2 bg-[#f4f7ff] text-[#0f5ce0] text-[13px] font-bold rounded-lg border border-[#eef2ff] hover:border-[#0f5ce0] hover:shadow-sm transition-all cursor-pointer group"
                >
                  {skill}
                </button>
              ))}
              {skills.length === 0 && <span className="text-[13px] text-[#a0a6b5] italic">Belum ada skill terkait.</span>}
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

          {/* aksi verifikasi */}
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
                      placeholder="Berikan alasan jika menolak, atau catatan tambahan untuk mahasiswa..."
                      className="w-full border border-[#e4e9f4] rounded-xl p-3 text-[13px] focus:outline-none focus:border-[#0f5ce0] transition resize-none placeholder:text-[#a0a6b5]"
                    />
                  </div>
                  <div className="flex flex-col gap-2.5">
                    <button 
                      onClick={() => handleUpdateStatus('Verified')}
                      className="w-full flex items-center justify-center gap-2 py-3 bg-[#0f5ce0] text-white text-[13px] font-bold rounded-xl hover:bg-[#0d4ebf] transition shadow-sm"
                    >
                      <CheckCircle2 size={16} strokeWidth={2.5} /> Terima Sertifikat
                    </button>
                    <button 
                      onClick={() => handleUpdateStatus('Rejected')}
                      className="w-full flex items-center justify-center gap-2 py-3 bg-white border border-red-200 text-red-500 text-[13px] font-bold rounded-xl hover:bg-red-50 transition"
                    >
                      <XCircle size={16} strokeWidth={2.5} /> Tolak Sertifikat
                    </button>
                  </div>
                  <p className="text-[10px] text-center text-[#a0a6b5] mt-1">
                    *Aksi ini akan mengirimkan notifikasi instan kepada mahasiswa dan memperbarui profil publik mereka.
                  </p>
                </>
              )}

              {/* tampilan jika di ACC */}
              {currentStatus === 'Verified' && (
                <>
                  <div className="bg-[#e6f9f0] border border-[#10b981]/20 rounded-xl p-6 flex flex-col items-center justify-center text-center gap-2">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm">
                      <CheckCircle2 size={24} className="text-[#10b981]" strokeWidth={2.5} />
                    </div>
                    <h3 className="text-[15px] font-bold text-[#10b981] mt-2">Sertifikat Terverifikasi</h3>
                    <p className="text-[12px] text-[#5b6170]">
                      Diverifikasi oleh Admin.
                    </p>
                  </div>
                  <p className="text-[10px] text-center text-[#a0a6b5]">
                    Sertifikat ini telah divalidasi dan ditambahkan ke profil publik mahasiswa.
                  </p>
                  <button 
                    onClick={() => handleUpdateStatus('Pending')}
                    className="w-full mt-2 flex items-center justify-center gap-2 py-3 bg-white border border-[#e4e9f4] text-[#5b6170] text-[13px] font-bold rounded-xl hover:bg-gray-50 transition"
                  >
                    Ubah Status
                  </button>
                </>
              )}

              {/* tampilan jika ditolak */}
              {currentStatus === 'Rejected' && (
                <>
                  <div className="flex flex-col gap-2">
                    <label className="text-[13px] font-bold text-[#111827]">Catatan Admin</label>
                    <div className="w-full bg-[#f8faff] border border-[#e4e9f4] rounded-xl p-4 text-[13px] text-[#5b6170] leading-relaxed">
                      {adminNote || "Sertifikat ini ditolak oleh tim akademik. Harap periksa kembali validitas dokumen Anda."}
                    </div>
                  </div>

                  <div className="bg-[#fef2f2] border border-red-200 rounded-xl py-3 px-4 flex items-center justify-center gap-2 mt-1">
                    <AlertTriangle size={16} className="text-red-500" strokeWidth={2.5} />
                    <span className="text-[13px] font-bold text-red-500">Sertifikat Telah Ditolak</span>
                  </div>

                  <button 
                    onClick={() => handleUpdateStatus('Verified')}
                    className="w-full mt-2 flex items-center justify-center gap-2 py-3 bg-white border border-[#0f5ce0] text-[#0f5ce0] text-[13px] font-bold rounded-xl hover:bg-[#f4f7ff] transition"
                  >
                    Ubah Status ke Terverifikasi
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
            <div className="flex-1 overflow-auto p-8 flex items-center justify-center bg-[#f4f7ff]">
               <div className="w-full max-w-[800px] aspect-[1.414/1] bg-white border border-[#e4e9f4] shadow-lg rounded-sm flex flex-col items-center justify-center p-8 relative">
                <div className="absolute inset-2 border-2 border-double border-[#d1d5db] opacity-30"></div>
                <div className="z-10 flex flex-col items-center text-center">
                  <ImageIcon size={64} className="text-[#c0c5d0] mb-4 opacity-50" />
                  <h3 className="text-4xl font-serif font-bold text-[#111827] mb-2">{certData.title}</h3>
                  <p className="text-xl text-[#7b8191] font-medium mb-6">diberikan kepada</p>
                  <p className="text-5xl font-serif text-[#0f5ce0] italic mb-6">{certData.studentName}</p>
                </div>
              </div>
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
                <p className="text-[13px] text-[#5b6170] mt-1">Tambah atau hapus keahlian dari sertifikat ini.</p>
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
                <p className="text-[13px] text-[#a0a6b5] italic w-full text-center mt-10">Belum ada skill terkait.</p>
              )}
            </div>
            
            <div className="flex items-center justify-end gap-3 pt-2">
              <button 
                onClick={() => setIsEditingSkills(false)} 
                className="px-5 py-2.5 text-[13px] font-bold text-[#5b6170] bg-white border border-[#e4e9f4] hover:bg-gray-50 rounded-xl transition"
              >
                Batal
              </button>
              <button 
                onClick={handleSaveSkills}
                className="px-5 py-2.5 text-[13px] font-bold text-white bg-[#0f5ce0] hover:bg-[#0d4ebf] rounded-xl transition shadow-sm"
              >
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