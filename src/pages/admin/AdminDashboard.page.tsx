const AdminDashboard = () => {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-[#111827]">Dashboard Admin</h1>
        <p className="mt-1 text-sm text-[#5b6170]">Ringkasan aktivitas platform.</p>
      </div>

      <div className="rounded-xl border border-[#e5e9f2] bg-white p-6">
        {/* TODO: isi konten Dashboard Admin (statistik universitas, perusahaan, pengguna, dsb) */}
      </div>
    </div>
  )
}

export default AdminDashboard