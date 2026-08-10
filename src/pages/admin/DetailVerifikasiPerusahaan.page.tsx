import { useState, useEffect } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { ChevronRight, CheckCircle2, Ban, Info, AlertTriangle, PencilLine, Building2, FileText, Eye, X } from 'lucide-react'
import { dummyCompanyDetails, updateCompanyData } from './AdminData'
import type { CompanyDetail } from './AdminData'
import Toast from './components/Toast'

const DetailVerifikasiPerusahaan = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [activeAction, setActiveAction] = useState<'verify' | 'reject'>('verify')
  
  const [data, setData] = useState<CompanyDetail | null>(null)
  const [editFormData, setEditFormData] = useState<CompanyDetail | null>(null)
  const [isEditAdminOpen, setIsEditAdminOpen] = useState(false)
  const [isEditCompanyOpen, setIsEditCompanyOpen] = useState(false)
  const [previewDoc, setPreviewDoc] = useState<{name: string, url: string} | null>(null)
  const [notification, setNotification] = useState<{message: string, type: 'success' | 'warning'} | null>(null)
  const [verifyMessage, setVerifyMessage] = useState('')
  const [rejectMessage, setRejectMessage] = useState('')
  const [errorMsg, setErrorMsg] = useState('')

  useEffect(() => {
    const company = dummyCompanyDetails[id || ''] || dummyCompanyDetails['default']
    setData({ ...company })
    setEditFormData({ ...company })
  }, [id])

  if (!data || !editFormData) return <div className="flex items-center justify-center h-64 text-[#7b8191] font-bold">Memuat data...</div>

  const showNotification = (msg: string, type: 'success' | 'warning') => {
    setNotification({ message: msg, type })
    setTimeout(() => setNotification(null), 4000)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleSaveEdit = () => {
    updateCompanyData(data.id, editFormData)
    setData({ ...editFormData })
    setIsEditAdminOpen(false)
    setIsEditCompanyOpen(false)
    showNotification('Informasi perusahaan berhasil diperbarui.', 'success')
  }

  const handleActionSubmit = (type: 'verify' | 'reject') => {
    if (type === 'verify' && !verifyMessage.trim()) return setErrorMsg('Pesan sambutan wajib diisi sebelum memverifikasi.')
    if (type === 'reject' && !rejectMessage.trim()) return setErrorMsg('Alasan penolakan wajib diisi agar perusahaan bisa merevisi.')
    setErrorMsg('')
    
    updateCompanyData(data.id, data, type === 'verify' ? 'terverifikasi' : 'ditolak')
    showNotification(`Perusahaan berhasil di${type === 'verify' ? 'verifikasi' : 'tolak'}!`, 'success')
    setTimeout(() => navigate('/admin/kelola-perusahaan'), 2000)
  }

  return (
    <div className="w-full pb-12 relative animate-in fade-in duration-300">
      <Toast notification={notification} onClose={() => setNotification(null)} />

      <div className="flex items-center gap-2 text-[13px] font-bold text-[#5b6170] mb-5">
        <Link to="/admin/kelola-perusahaan" className="hover:text-[#0f5ce0] transition-colors flex items-center gap-1">Kelola Perusahaan</Link>
        <ChevronRight size={16} strokeWidth={2.5} className="text-[#a0a6b5]" />
        <span className="text-[#111827]">Detail Verifikasi</span>
      </div>

      <div className="mb-6">
        <h1 className="text-[24px] font-bold text-[#111827]">
          Detail Verifikasi Perusahaan: <span className="text-[#0f5ce0]">{data.companyName}</span>
        </h1>
        <p className="text-[14px] text-[#7b8191] mt-1">Tinjau informasi pendaftaran dan dokumen pendukung untuk melanjutkan proses verifikasi.</p>
      </div>

      <div className="bg-white rounded-t-[16px] border border-[#e4e9f4] shadow-sm flex overflow-hidden">
        <button onClick={() => { setActiveAction('verify'); setErrorMsg(''); }} className={`flex-1 py-4 flex items-center justify-center gap-2 text-[14px] font-bold transition-colors border-b-[3px] ${activeAction === 'verify' ? 'border-[#10b981] text-[#10b981] bg-[#f8faff]' : 'border-transparent text-[#7b8191] hover:bg-[#f8faff]'}`}>
          <CheckCircle2 size={18} strokeWidth={2.5} /> Verifikasi Akun
        </button>
        <button onClick={() => { setActiveAction('reject'); setErrorMsg(''); }} className={`flex-1 py-4 flex items-center justify-center gap-2 text-[14px] font-bold transition-colors border-b-[3px] ${activeAction === 'reject' ? 'border-[#ef4444] text-[#ef4444] bg-[#fef2f2]' : 'border-transparent text-[#7b8191] hover:bg-[#f8faff]'}`}>
          <Ban size={18} strokeWidth={2.5} /> Tolak Pendaftaran
        </button>
      </div>

      <div className="bg-white border-x border-b border-[#e4e9f4] rounded-b-[16px] p-6 shadow-sm mb-6">
        {activeAction === 'verify' ? (
          <div className="animate-in fade-in duration-300">
            <div className="flex items-start gap-4 p-4 bg-[#f4f7ff] border border-[#eef2ff] rounded-xl mb-5">
              <div className="w-8 h-8 rounded-full bg-[#0f5ce0] text-white flex items-center justify-center shrink-0"><Info size={18} strokeWidth={2.5} /></div>
              <div>
                <h4 className="text-[14px] font-bold text-[#111827]">Konfirmasi Persetujuan</h4>
                <p className="text-[13px] text-[#5b6170] mt-1 leading-relaxed">Menyetujui pendaftaran ini akan memberikan akses penuh kepada admin perusahaan untuk memposting lowongan kerja dan magang.</p>
              </div>
            </div>
            <div className="mb-5">
              <label className="block text-[13px] font-bold text-[#111827] mb-2">Pesan Selamat Datang & Langkah Selanjutnya <span className="text-red-500">*</span></label>
              <textarea value={verifyMessage} onChange={(e) => setVerifyMessage(e.target.value)} placeholder="Ketik pesan sambutan yang akan dikirim via email di sini..." className={`w-full h-28 p-4 text-[13px] text-[#111827] bg-[#f8faff] border ${errorMsg ? 'border-red-400 focus:shadow-[0_0_0_3px_rgba(239,68,68,0.1)]' : 'border-[#e4e9f4] focus:border-[#0f5ce0]'} rounded-xl outline-none transition-all resize-none`}></textarea>
              {errorMsg && <p className="text-red-500 text-[12px] mt-1.5 font-bold">{errorMsg}</p>}
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-[#f1f4f9]">
              <p className="text-[13px] text-[#7b8191]">Email notifikasi akan dikirimkan ke: <span className="font-bold text-[#111827]">{data.adminEmail}</span></p>
              <button onClick={() => handleActionSubmit('verify')} className="w-full sm:w-auto px-6 py-2.5 bg-[#0f5ce0] hover:bg-[#0d4ebf] text-white text-[13px] font-bold rounded-lg transition-colors flex items-center justify-center gap-2 shadow-sm"><CheckCircle2 size={16} strokeWidth={2.5} /> Konfirmasi & Verifikasi</button>
            </div>
          </div>
        ) : (
          <div className="animate-in fade-in duration-300">
            <div className="flex items-start gap-4 p-4 bg-[#fef2f2] border border-[#fecaca] rounded-xl mb-5">
              <div className="w-8 h-8 rounded-full bg-[#ef4444] text-white flex items-center justify-center shrink-0"><AlertTriangle size={18} strokeWidth={2.5} /></div>
              <div>
                <h4 className="text-[14px] font-bold text-[#111827]">Konfirmasi Penolakan</h4>
                <p className="text-[13px] text-[#5b6170] mt-1 leading-relaxed">Pastikan alasan penolakan jelas agar perusahaan dapat melakukan perbaikan dokumen jika diperlukan.</p>
              </div>
            </div>
            <div className="mb-5">
              <label className="block text-[13px] font-bold text-[#111827] mb-2">Alasan Penolakan (Wajib) <span className="text-red-500">*</span></label>
              <textarea value={rejectMessage} onChange={(e) => setRejectMessage(e.target.value)} placeholder="Contoh: Dokumen SIUP tidak terbaca jelas atau sudah kadaluarsa..." className={`w-full h-28 p-4 text-[13px] text-[#111827] bg-[#f8faff] border ${errorMsg ? 'border-red-400 focus:shadow-[0_0_0_3px_rgba(239,68,68,0.1)]' : 'border-[#e4e9f4] focus:border-red-400'} rounded-xl outline-none transition-all resize-none`}></textarea>
              {errorMsg && <p className="text-red-500 text-[12px] mt-1.5 font-bold">{errorMsg}</p>}
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-[#f1f4f9]">
              <p className="text-[13px] text-[#7b8191]">Alasan ini akan dikirim ke <span className="font-bold text-[#111827]">{data.adminEmail}</span> untuk perbaikan.</p>
              <button onClick={() => handleActionSubmit('reject')} className="w-full sm:w-auto px-6 py-2.5 bg-[#ef4444] hover:bg-[#dc2626] text-white text-[13px] font-bold rounded-lg transition-colors flex items-center justify-center gap-2 shadow-sm"><Ban size={16} strokeWidth={2.5} /> Konfirmasi & Tolak</button>
            </div>
          </div>
        )}
      </div>

      <div className="bg-white rounded-[16px] border border-[#e4e9f4] shadow-sm mb-6 overflow-hidden">
        <div className="bg-[#f8faff] px-6 py-4 border-b border-[#e4e9f4] flex justify-between items-center">
          <h3 className="text-[15px] font-bold text-[#111827]">Informasi Akun Admin</h3>
          <button onClick={() => setIsEditAdminOpen(true)} className="text-[12px] font-bold text-[#0f5ce0] flex items-center gap-1.5 hover:bg-[#eef2ff] px-3 py-1.5 rounded-md transition-colors"><PencilLine size={14} strokeWidth={2.5} /> EDIT</button>
        </div>
        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div><p className="text-[12px] font-bold text-[#7b8191] uppercase tracking-widest mb-1.5">Nama Lengkap</p><p className="text-[14px] font-bold text-[#111827]">{data.adminName}</p></div>
          <div><p className="text-[12px] font-bold text-[#7b8191] uppercase tracking-widest mb-1.5">Email Kantor</p><p className="text-[14px] font-bold text-[#111827]">{data.adminEmail}</p></div>
        </div>
      </div>

      <div className="bg-white rounded-[16px] border border-[#e4e9f4] shadow-sm mb-6 overflow-hidden">
        <div className="bg-[#f8faff] px-6 py-4 border-b border-[#e4e9f4] flex justify-between items-center">
          <h3 className="text-[15px] font-bold text-[#111827]">Company Details</h3>
          <button onClick={() => setIsEditCompanyOpen(true)} className="text-[12px] font-bold text-[#0f5ce0] flex items-center gap-1.5 hover:bg-[#eef2ff] px-3 py-1.5 rounded-md transition-colors"><PencilLine size={14} strokeWidth={2.5} /> EDIT</button>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
            <div><p className="text-[12px] font-bold text-[#7b8191] uppercase tracking-widest mb-1.5">Nama Perusahaan</p><p className="text-[14px] font-bold text-[#111827]">{data.companyName}</p></div>
            <div><p className="text-[12px] font-bold text-[#7b8191] uppercase tracking-widest mb-1.5">Industri</p><p className="text-[14px] font-bold text-[#111827]">{data.industry}</p></div>
            <div><p className="text-[12px] font-bold text-[#7b8191] uppercase tracking-widest mb-1.5">Ukuran Perusahaan</p><p className="text-[14px] font-bold text-[#111827]">{data.companySize}</p></div>
            <div><p className="text-[12px] font-bold text-[#7b8191] uppercase tracking-widest mb-1.5">Website</p><a href={data.website} target="_blank" rel="noreferrer" className="text-[14px] font-bold text-[#0f5ce0] hover:underline">{data.website}</a></div>
            <div className="sm:col-span-2"><p className="text-[12px] font-bold text-[#7b8191] uppercase tracking-widest mb-1.5">Kantor Pusat</p><p className="text-[14px] font-bold text-[#111827]">{data.headquarters}</p></div>
          </div>
          <div><p className="text-[12px] font-bold text-[#7b8191] uppercase tracking-widest mb-1.5">Deskripsi Perusahaan</p><p className="text-[13px] text-[#5b6170] leading-relaxed">{data.description}</p></div>
        </div>
      </div>

      <div className="bg-white rounded-[16px] border border-[#e4e9f4] shadow-sm overflow-hidden">
        <div className="bg-[#f8faff] px-6 py-4 border-b border-[#e4e9f4]"><h3 className="text-[15px] font-bold text-[#111827]">Dokumen yang Diunggah</h3></div>
        <div className="p-6 flex flex-col gap-4">
          {data.documents.map((doc, idx) => (
            <div key={idx} className="flex items-center justify-between p-4 bg-[#f8faff] border border-[#eef2ff] rounded-[12px] hover:border-[#0f5ce0] transition-colors group">
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center bg-white border shadow-sm ${doc.type.includes('NIB') ? 'text-[#0f5ce0] border-[#eef2ff]' : 'text-[#7b8191] border-[#e4e9f4]'}`}>
                  {doc.type.includes('NIB') ? <Building2 size={20} strokeWidth={2.5} /> : <FileText size={20} strokeWidth={2.5} />}
                </div>
                <div><p className="text-[11px] font-bold text-[#7b8191] uppercase tracking-widest">{doc.type}</p><p className="text-[13px] font-bold text-[#111827] mt-0.5">{doc.name}</p></div>
              </div>
              <button onClick={() => setPreviewDoc({ name: doc.name, url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' })} className="w-8 h-8 rounded-full bg-white border border-[#e4e9f4] flex items-center justify-center text-[#a0a6b5] group-hover:text-[#0f5ce0] group-hover:border-[#0f5ce0] transition-colors shadow-sm"><Eye size={16} strokeWidth={2.5} /></button>
            </div>
          ))}
        </div>
      </div>

      {/* MODALS EDIT & PREVIEW */}
      {isEditAdminOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-[20px] w-full max-w-[500px] shadow-xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-[#e4e9f4] flex justify-between items-center bg-white"><h2 className="text-[18px] font-bold text-[#111827]">Edit Akun Admin</h2><button onClick={() => setIsEditAdminOpen(false)} className="text-[#a0a6b5] hover:text-[#111827] transition-colors p-1"><X size={20} strokeWidth={2.5} /></button></div>
            <div className="p-6 space-y-5">
              <div><label className="block text-[13px] font-bold text-[#111827] mb-2">Nama Lengkap</label><input type="text" value={editFormData.adminName} onChange={e => setEditFormData({...editFormData, adminName: e.target.value})} className="w-full h-11 px-4 bg-[#f8faff] border border-[#e4e9f4] rounded-lg text-[13px] font-medium text-[#111827] outline-none focus:border-[#0f5ce0] transition shadow-sm" /></div>
              <div><label className="block text-[13px] font-bold text-[#111827] mb-2">Email Kantor</label><input type="email" value={editFormData.adminEmail} onChange={e => setEditFormData({...editFormData, adminEmail: e.target.value})} className="w-full h-11 px-4 bg-[#f8faff] border border-[#e4e9f4] rounded-lg text-[13px] font-medium text-[#111827] outline-none focus:border-[#0f5ce0] transition shadow-sm" /></div>
            </div>
            <div className="p-5 border-t border-[#e4e9f4] bg-white flex justify-end gap-3"><button onClick={() => setIsEditAdminOpen(false)} className="px-5 py-2.5 text-[13px] font-bold text-[#5b6170] hover:bg-[#f1f4f9] rounded-lg transition-colors border border-[#e4e9f4]">Batal</button><button onClick={handleSaveEdit} className="px-5 py-2.5 bg-[#0f5ce0] hover:bg-[#0d4ebf] text-white text-[13px] font-bold rounded-lg transition-colors shadow-sm">Simpan</button></div>
          </div>
        </div>
      )}

      {isEditCompanyOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-[20px] w-full max-w-[700px] shadow-xl overflow-hidden animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
            <div className="p-6 border-b border-[#e4e9f4] flex justify-between items-center bg-white shrink-0"><h2 className="text-[18px] font-bold text-[#111827]">Edit Company Details</h2><button onClick={() => setIsEditCompanyOpen(false)} className="text-[#a0a6b5] hover:text-[#111827] transition-colors p-1"><X size={20} strokeWidth={2.5} /></button></div>
            <div className="p-6 space-y-5 overflow-y-auto">
              <div className="grid grid-cols-2 gap-5">
                <div><label className="block text-[13px] font-bold text-[#111827] mb-2">Nama Perusahaan</label><input type="text" value={editFormData.companyName} onChange={e => setEditFormData({...editFormData, companyName: e.target.value})} className="w-full h-11 px-4 bg-[#f8faff] border border-[#e4e9f4] rounded-lg text-[13px] font-medium text-[#111827] outline-none focus:border-[#0f5ce0] transition shadow-sm" /></div>
                <div><label className="block text-[13px] font-bold text-[#111827] mb-2">Industri</label><input type="text" value={editFormData.industry} onChange={e => setEditFormData({...editFormData, industry: e.target.value})} className="w-full h-11 px-4 bg-[#f8faff] border border-[#e4e9f4] rounded-lg text-[13px] font-medium text-[#111827] outline-none focus:border-[#0f5ce0] transition shadow-sm" /></div>
                <div><label className="block text-[13px] font-bold text-[#111827] mb-2">Ukuran Perusahaan</label><input type="text" value={editFormData.companySize} onChange={e => setEditFormData({...editFormData, companySize: e.target.value})} className="w-full h-11 px-4 bg-[#f8faff] border border-[#e4e9f4] rounded-lg text-[13px] font-medium text-[#111827] outline-none focus:border-[#0f5ce0] transition shadow-sm" /></div>
                <div><label className="block text-[13px] font-bold text-[#111827] mb-2">Website</label><input type="text" value={editFormData.website} onChange={e => setEditFormData({...editFormData, website: e.target.value})} className="w-full h-11 px-4 bg-[#f8faff] border border-[#e4e9f4] rounded-lg text-[13px] font-medium text-[#111827] outline-none focus:border-[#0f5ce0] transition shadow-sm" /></div>
              </div>
              <div><label className="block text-[13px] font-bold text-[#111827] mb-2">Kantor Pusat</label><input type="text" value={editFormData.headquarters} onChange={e => setEditFormData({...editFormData, headquarters: e.target.value})} className="w-full h-11 px-4 bg-[#f8faff] border border-[#e4e9f4] rounded-lg text-[13px] font-medium text-[#111827] outline-none focus:border-[#0f5ce0] transition shadow-sm" /></div>
              <div><label className="block text-[13px] font-bold text-[#111827] mb-2">Deskripsi Perusahaan</label><textarea value={editFormData.description} onChange={e => setEditFormData({...editFormData, description: e.target.value})} className="w-full h-28 p-4 bg-[#f8faff] border border-[#e4e9f4] rounded-lg text-[13px] font-medium text-[#111827] outline-none focus:border-[#0f5ce0] transition shadow-sm resize-none"></textarea></div>
            </div>
            <div className="p-5 border-t border-[#e4e9f4] bg-white flex justify-end gap-3 shrink-0"><button onClick={() => setIsEditCompanyOpen(false)} className="px-5 py-2.5 text-[13px] font-bold text-[#5b6170] hover:bg-[#f1f4f9] rounded-lg transition-colors border border-[#e4e9f4]">Batal</button><button onClick={handleSaveEdit} className="px-5 py-2.5 bg-[#0f5ce0] hover:bg-[#0d4ebf] text-white text-[13px] font-bold rounded-lg transition-colors shadow-sm">Simpan</button></div>
          </div>
        </div>
      )}

      {/* Modal Preview Document */}
      {previewDoc && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-[20px] w-full max-w-[1000px] h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200 shadow-2xl">
            <div className="p-5 border-b border-[#e4e9f4] flex justify-between items-center bg-white shrink-0">
              <div className="flex items-center gap-3"><FileText className="text-[#0f5ce0]" size={24} strokeWidth={2.5} /><h2 className="text-[18px] font-bold text-[#111827]">{previewDoc.name}</h2></div>
              <button onClick={() => setPreviewDoc(null)} className="text-[#a0a6b5] hover:text-[#111827] hover:bg-[#f1f4f9] p-1.5 rounded-lg transition-colors"><X size={20} strokeWidth={2.5} /></button>
            </div>
            <div className="flex-1 bg-[#f1f4f9] w-full relative"><iframe src={previewDoc.url} className="w-full h-full border-none" title="Document Preview" /></div>
          </div>
        </div>
      )}
    </div>
  )
}

export default DetailVerifikasiPerusahaan