import { useState, useEffect } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { ChevronRight, CheckCircle2, Ban, Info, AlertTriangle, PencilLine, Building2, FileText, Eye, X } from 'lucide-react'
import { adminCompanyApi, adminUserApi } from '../../services/admin.service'
import type { AdminCompany } from '../../services/admin.service'
import Toast from './components/Toast'

const DetailVerifikasiPerusahaan = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [activeAction, setActiveAction] = useState<'verify' | 'reject'>('verify')

  const [data, setData] = useState<AdminCompany | null>(null)
  const [loadError, setLoadError] = useState('')

  // form edit (modal)
  const [companyForm, setCompanyForm] = useState({ name: '', industry: '', size: '', website: '', address: '', description: '' })
  const [adminForm, setAdminForm] = useState({ name: '', email: '' })
  const [isEditAdminOpen, setIsEditAdminOpen] = useState(false)
  const [isEditCompanyOpen, setIsEditCompanyOpen] = useState(false)
  const [previewDoc, setPreviewDoc] = useState<{name: string, url: string} | null>(null)
  const [notification, setNotification] = useState<{message: string, type: 'success' | 'warning'} | null>(null)
  const [verifyMessage, setVerifyMessage] = useState('')
  const [rejectMessage, setRejectMessage] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const adminContact = data?.members?.[0]?.user ?? null

  const loadCompany = async (companyId: string) => {
    try {
      const company = await adminCompanyApi.getForReview(companyId)
      // halaman ini khusus antrean pending; status lain punya halaman sendiri
      if (company.status !== 'pending') {
        navigate(`/admin/kelola-perusahaan/status/${companyId}`, { replace: true })
        return
      }
      setData(company)
      setCompanyForm({
        name: company.name ?? '',
        industry: company.industry ?? '',
        size: company.size ?? '',
        website: company.website ?? '',
        address: company.address ?? '',
        description: company.description ?? '',
      })
      const contact = company.members?.[0]?.user
      setAdminForm({ name: contact?.name ?? '', email: contact?.email ?? '' })
    } catch {
      setLoadError('Gagal memuat data perusahaan.')
    }
  }

  useEffect(() => {
    if (id) loadCompany(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  if (loadError) return <div className="flex items-center justify-center h-64 text-[#ef4444] font-bold">{loadError}</div>
  if (!data) return <div className="flex items-center justify-center h-64 text-[#7b8191] font-bold">Memuat data...</div>

  const showNotification = (msg: string, type: 'success' | 'warning') => {
    setNotification({ message: msg, type })
    setTimeout(() => setNotification(null), 4000)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleSaveCompanyEdit = async () => {
    try {
      await adminCompanyApi.update(data.id, {
        name: companyForm.name,
        industry: companyForm.industry || undefined,
        size: companyForm.size || undefined,
        website: companyForm.website || undefined,
        address: companyForm.address || undefined,
        description: companyForm.description || undefined,
      })
      setIsEditCompanyOpen(false)
      await loadCompany(data.id)
      showNotification('Informasi perusahaan berhasil diperbarui.', 'success')
    } catch {
      showNotification('Gagal menyimpan perubahan perusahaan.', 'warning')
    }
  }

  const handleSaveAdminEdit = async () => {
    if (!adminContact) return
    try {
      await adminUserApi.update(adminContact.id, { name: adminForm.name, email: adminForm.email })
      setIsEditAdminOpen(false)
      await loadCompany(data.id)
      showNotification('Informasi akun admin berhasil diperbarui.', 'success')
    } catch {
      showNotification('Gagal menyimpan perubahan akun admin.', 'warning')
    }
  }

  const handleActionSubmit = async (type: 'verify' | 'reject') => {
    if (type === 'verify' && !verifyMessage.trim()) return setErrorMsg('Pesan sambutan wajib diisi sebelum memverifikasi.')
    if (type === 'reject' && !rejectMessage.trim()) return setErrorMsg('Alasan penolakan wajib diisi agar perusahaan bisa merevisi.')
    if (type === 'reject' && rejectMessage.trim().length < 10) return setErrorMsg('Alasan penolakan minimal 10 karakter.')
    setErrorMsg('')
    setIsSubmitting(true)

    try {
      if (type === 'verify') {
        await adminCompanyApi.verify(data.id, verifyMessage.trim())
      } else {
        await adminCompanyApi.reject(data.id, rejectMessage.trim())
      }
      showNotification(`Perusahaan berhasil di${type === 'verify' ? 'verifikasi' : 'tolak'}! Email pemberitahuan telah dikirim.`, 'success')
      setTimeout(() => navigate('/admin/kelola-perusahaan'), 2000)
    } catch (err: any) {
      const apiMsg = err?.response?.data?.message
      showNotification(apiMsg || 'Aksi gagal diproses. Coba lagi.', 'warning')
      setIsSubmitting(false)
    }
  }

  // dokumen legal dari kolom database
  const documents: { type: string; name: string; url?: string }[] = []
  if (data.nib) documents.push({ type: 'Nomor NIB', name: data.nib })
  if (data.izinUsahaUrl) documents.push({ type: 'Izin Usaha', name: 'Dokumen Izin Usaha (PDF)', url: data.izinUsahaUrl })
  if (data.suratResmiUrl) documents.push({ type: 'Surat Resmi', name: 'Surat Resmi Perusahaan (PDF)', url: data.suratResmiUrl })

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
          Detail Verifikasi Perusahaan: <span className="text-[#0f5ce0]">{data.name}</span>
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
              <p className="text-[13px] text-[#7b8191]">Email notifikasi akan dikirimkan ke: <span className="font-bold text-[#111827]">{adminContact?.email ?? '-'}</span></p>
              <button disabled={isSubmitting} onClick={() => handleActionSubmit('verify')} className="w-full sm:w-auto px-6 py-2.5 bg-[#0f5ce0] hover:bg-[#0d4ebf] disabled:opacity-60 text-white text-[13px] font-bold rounded-lg transition-colors flex items-center justify-center gap-2 shadow-sm"><CheckCircle2 size={16} strokeWidth={2.5} /> {isSubmitting ? 'Memproses...' : 'Konfirmasi & Verifikasi'}</button>
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
              <p className="text-[13px] text-[#7b8191]">Alasan ini akan dikirim ke <span className="font-bold text-[#111827]">{adminContact?.email ?? '-'}</span> untuk perbaikan.</p>
              <button disabled={isSubmitting} onClick={() => handleActionSubmit('reject')} className="w-full sm:w-auto px-6 py-2.5 bg-[#ef4444] hover:bg-[#dc2626] disabled:opacity-60 text-white text-[13px] font-bold rounded-lg transition-colors flex items-center justify-center gap-2 shadow-sm"><Ban size={16} strokeWidth={2.5} /> {isSubmitting ? 'Memproses...' : 'Konfirmasi & Tolak'}</button>
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
          <div><p className="text-[12px] font-bold text-[#7b8191] uppercase tracking-widest mb-1.5">Nama Lengkap</p><p className="text-[14px] font-bold text-[#111827]">{adminContact?.name ?? '-'}</p></div>
          <div><p className="text-[12px] font-bold text-[#7b8191] uppercase tracking-widest mb-1.5">Email Kantor</p><p className="text-[14px] font-bold text-[#111827]">{adminContact?.email ?? '-'}</p></div>
        </div>
      </div>

      <div className="bg-white rounded-[16px] border border-[#e4e9f4] shadow-sm mb-6 overflow-hidden">
        <div className="bg-[#f8faff] px-6 py-4 border-b border-[#e4e9f4] flex justify-between items-center">
          <h3 className="text-[15px] font-bold text-[#111827]">Company Details</h3>
          <button onClick={() => setIsEditCompanyOpen(true)} className="text-[12px] font-bold text-[#0f5ce0] flex items-center gap-1.5 hover:bg-[#eef2ff] px-3 py-1.5 rounded-md transition-colors"><PencilLine size={14} strokeWidth={2.5} /> EDIT</button>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
            <div><p className="text-[12px] font-bold text-[#7b8191] uppercase tracking-widest mb-1.5">Nama Perusahaan</p><p className="text-[14px] font-bold text-[#111827]">{data.name}</p></div>
            <div><p className="text-[12px] font-bold text-[#7b8191] uppercase tracking-widest mb-1.5">Industri</p><p className="text-[14px] font-bold text-[#111827]">{data.industry ?? '-'}</p></div>
            <div><p className="text-[12px] font-bold text-[#7b8191] uppercase tracking-widest mb-1.5">Ukuran Perusahaan</p><p className="text-[14px] font-bold text-[#111827]">{data.size ?? '-'}</p></div>
            <div><p className="text-[12px] font-bold text-[#7b8191] uppercase tracking-widest mb-1.5">Website</p>{data.website ? <a href={data.website.startsWith('http') ? data.website : `https://${data.website}`} target="_blank" rel="noreferrer" className="text-[14px] font-bold text-[#0f5ce0] hover:underline">{data.website}</a> : <p className="text-[14px] font-bold text-[#111827]">-</p>}</div>
            <div className="sm:col-span-2"><p className="text-[12px] font-bold text-[#7b8191] uppercase tracking-widest mb-1.5">Kantor Pusat</p><p className="text-[14px] font-bold text-[#111827]">{data.address ?? '-'}</p></div>
          </div>
          <div><p className="text-[12px] font-bold text-[#7b8191] uppercase tracking-widest mb-1.5">Deskripsi Perusahaan</p><p className="text-[13px] text-[#5b6170] leading-relaxed">{data.description ?? '-'}</p></div>
        </div>
      </div>

      <div className="bg-white rounded-[16px] border border-[#e4e9f4] shadow-sm overflow-hidden">
        <div className="bg-[#f8faff] px-6 py-4 border-b border-[#e4e9f4]"><h3 className="text-[15px] font-bold text-[#111827]">Dokumen yang Diunggah</h3></div>
        <div className="p-6 flex flex-col gap-4">
          {documents.length === 0 && (
            <p className="text-[13px] text-[#7b8191]">Perusahaan belum mengunggah dokumen legal.</p>
          )}
          {documents.map((doc, idx) => (
            <div key={idx} className="flex items-center justify-between p-4 bg-[#f8faff] border border-[#eef2ff] rounded-[12px] hover:border-[#0f5ce0] transition-colors group">
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center bg-white border shadow-sm ${doc.type.includes('NIB') ? 'text-[#0f5ce0] border-[#eef2ff]' : 'text-[#7b8191] border-[#e4e9f4]'}`}>
                  {doc.type.includes('NIB') ? <Building2 size={20} strokeWidth={2.5} /> : <FileText size={20} strokeWidth={2.5} />}
                </div>
                <div><p className="text-[11px] font-bold text-[#7b8191] uppercase tracking-widest">{doc.type}</p><p className="text-[13px] font-bold text-[#111827] mt-0.5">{doc.name}</p></div>
              </div>
              {doc.url && (
                <button onClick={() => setPreviewDoc({ name: doc.name, url: doc.url! })} className="w-8 h-8 rounded-full bg-white border border-[#e4e9f4] flex items-center justify-center text-[#a0a6b5] group-hover:text-[#0f5ce0] group-hover:border-[#0f5ce0] transition-colors shadow-sm"><Eye size={16} strokeWidth={2.5} /></button>
              )}
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
              <div><label className="block text-[13px] font-bold text-[#111827] mb-2">Nama Lengkap</label><input type="text" value={adminForm.name} onChange={e => setAdminForm({...adminForm, name: e.target.value})} className="w-full h-11 px-4 bg-[#f8faff] border border-[#e4e9f4] rounded-lg text-[13px] font-medium text-[#111827] outline-none focus:border-[#0f5ce0] transition shadow-sm" /></div>
              <div><label className="block text-[13px] font-bold text-[#111827] mb-2">Email Kantor</label><input type="email" value={adminForm.email} onChange={e => setAdminForm({...adminForm, email: e.target.value})} className="w-full h-11 px-4 bg-[#f8faff] border border-[#e4e9f4] rounded-lg text-[13px] font-medium text-[#111827] outline-none focus:border-[#0f5ce0] transition shadow-sm" /></div>
            </div>
            <div className="p-5 border-t border-[#e4e9f4] bg-white flex justify-end gap-3"><button onClick={() => setIsEditAdminOpen(false)} className="px-5 py-2.5 text-[13px] font-bold text-[#5b6170] hover:bg-[#f1f4f9] rounded-lg transition-colors border border-[#e4e9f4]">Batal</button><button onClick={handleSaveAdminEdit} className="px-5 py-2.5 bg-[#0f5ce0] hover:bg-[#0d4ebf] text-white text-[13px] font-bold rounded-lg transition-colors shadow-sm">Simpan</button></div>
          </div>
        </div>
      )}

      {isEditCompanyOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-[20px] w-full max-w-[700px] shadow-xl overflow-hidden animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
            <div className="p-6 border-b border-[#e4e9f4] flex justify-between items-center bg-white shrink-0"><h2 className="text-[18px] font-bold text-[#111827]">Edit Company Details</h2><button onClick={() => setIsEditCompanyOpen(false)} className="text-[#a0a6b5] hover:text-[#111827] transition-colors p-1"><X size={20} strokeWidth={2.5} /></button></div>
            <div className="p-6 space-y-5 overflow-y-auto">
              <div className="grid grid-cols-2 gap-5">
                <div><label className="block text-[13px] font-bold text-[#111827] mb-2">Nama Perusahaan</label><input type="text" value={companyForm.name} onChange={e => setCompanyForm({...companyForm, name: e.target.value})} className="w-full h-11 px-4 bg-[#f8faff] border border-[#e4e9f4] rounded-lg text-[13px] font-medium text-[#111827] outline-none focus:border-[#0f5ce0] transition shadow-sm" /></div>
                <div><label className="block text-[13px] font-bold text-[#111827] mb-2">Industri</label><input type="text" value={companyForm.industry} onChange={e => setCompanyForm({...companyForm, industry: e.target.value})} className="w-full h-11 px-4 bg-[#f8faff] border border-[#e4e9f4] rounded-lg text-[13px] font-medium text-[#111827] outline-none focus:border-[#0f5ce0] transition shadow-sm" /></div>
                <div><label className="block text-[13px] font-bold text-[#111827] mb-2">Ukuran Perusahaan</label><input type="text" value={companyForm.size} onChange={e => setCompanyForm({...companyForm, size: e.target.value})} className="w-full h-11 px-4 bg-[#f8faff] border border-[#e4e9f4] rounded-lg text-[13px] font-medium text-[#111827] outline-none focus:border-[#0f5ce0] transition shadow-sm" /></div>
                <div><label className="block text-[13px] font-bold text-[#111827] mb-2">Website</label><input type="text" value={companyForm.website} onChange={e => setCompanyForm({...companyForm, website: e.target.value})} className="w-full h-11 px-4 bg-[#f8faff] border border-[#e4e9f4] rounded-lg text-[13px] font-medium text-[#111827] outline-none focus:border-[#0f5ce0] transition shadow-sm" /></div>
              </div>
              <div><label className="block text-[13px] font-bold text-[#111827] mb-2">Kantor Pusat</label><input type="text" value={companyForm.address} onChange={e => setCompanyForm({...companyForm, address: e.target.value})} className="w-full h-11 px-4 bg-[#f8faff] border border-[#e4e9f4] rounded-lg text-[13px] font-medium text-[#111827] outline-none focus:border-[#0f5ce0] transition shadow-sm" /></div>
              <div><label className="block text-[13px] font-bold text-[#111827] mb-2">Deskripsi Perusahaan</label><textarea value={companyForm.description} onChange={e => setCompanyForm({...companyForm, description: e.target.value})} className="w-full h-28 p-4 bg-[#f8faff] border border-[#e4e9f4] rounded-lg text-[13px] font-medium text-[#111827] outline-none focus:border-[#0f5ce0] transition shadow-sm resize-none"></textarea></div>
            </div>
            <div className="p-5 border-t border-[#e4e9f4] bg-white flex justify-end gap-3 shrink-0"><button onClick={() => setIsEditCompanyOpen(false)} className="px-5 py-2.5 text-[13px] font-bold text-[#5b6170] hover:bg-[#f1f4f9] rounded-lg transition-colors border border-[#e4e9f4]">Batal</button><button onClick={handleSaveCompanyEdit} className="px-5 py-2.5 bg-[#0f5ce0] hover:bg-[#0d4ebf] text-white text-[13px] font-bold rounded-lg transition-colors shadow-sm">Simpan</button></div>
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
