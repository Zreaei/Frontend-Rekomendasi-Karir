import { useRef } from 'react'
import { Link } from 'react-router-dom'

const LandingPage = () => {
  const solutionRef = useRef<HTMLDivElement>(null)

  const scrollToSolution = () => {
    solutionRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen relative overflow-hidden">

      {/* Animated Background */}
      <div className="fixed inset-0 -z-10 bg-[#eef3fc] overflow-hidden pointer-events-none">

        {/* Orbs */}
        <div className="absolute rounded-full -top-40 -left-28 orb-1"
          style={{ width: 480, height: 480, background: 'radial-gradient(circle at 40% 40%, #c8d9f8, #dce8fc 60%, transparent 100%)' }} />
        <div className="absolute rounded-full -top-12 left-80 orb-2"
          style={{ width: 180, height: 180, background: 'radial-gradient(circle at 40% 40%, #bdd0f7, #d4e4fb 60%, transparent 100%)' }} />
        <div className="absolute rounded-full -bottom-28 -right-24 orb-3"
          style={{ width: 420, height: 420, background: 'radial-gradient(circle at 60% 60%, #ccd9f6, #dde8fb 60%, transparent 100%)' }} />
        <div className="absolute rounded-full bottom-20 -left-14 orb-4"
          style={{ width: 260, height: 260, background: 'radial-gradient(circle at 50% 50%, #d4e2fa, #e4eefb 60%, transparent 100%)' }} />

        {/*
          Swirl lines — kunci seamless:
          Setiap path mulai dan berakhir di Y yang SAMA (misal y=300),
          dengan control point simetris. Tile ke-2 offset +1400 persis.
          Animasi geser -50% dari total width 2800 = geser tepat 1 tile.
        */}
        <svg
          className="absolute top-0 left-0 h-full swirl-line"
          style={{ width: '200%' }}
          viewBox="0 0 2800 900"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Line 1 — y start=300, y end=300, simetris */}
          <path d="M0 300 C175 220, 350 380, 700 300 C1050 220, 1225 380, 1400 300" fill="none" stroke="#a8c2e8" strokeWidth="1" opacity="0.5"/>
          <path d="M1400 300 C1575 220, 1750 380, 2100 300 C2450 220, 2625 380, 2800 300" fill="none" stroke="#a8c2e8" strokeWidth="1" opacity="0.5"/>

          {/* Line 2 — y start=400, y end=400 */}
          <path d="M0 400 C175 320, 350 480, 700 400 C1050 320, 1225 480, 1400 400" fill="none" stroke="#afc6ea" strokeWidth="0.8" opacity="0.4"/>
          <path d="M1400 400 C1575 320, 1750 480, 2100 400 C2450 320, 2625 480, 2800 400" fill="none" stroke="#afc6ea" strokeWidth="0.8" opacity="0.4"/>

          {/* Line 3 — y start=520, y end=520 */}
          <path d="M0 520 C175 450, 350 590, 700 520 C1050 450, 1225 590, 1400 520" fill="none" stroke="#b5cbed" strokeWidth="0.7" opacity="0.3"/>
          <path d="M1400 520 C1575 450, 1750 590, 2100 520 C2450 450, 2625 590, 2800 520" fill="none" stroke="#b5cbed" strokeWidth="0.7" opacity="0.3"/>

          {/* Line 4 — y start=620, y end=620, lebih lebar amplitudonya */}
          <path d="M0 620 C175 555, 350 685, 700 620 C1050 555, 1225 685, 1400 620" fill="none" stroke="#c0d2ef" strokeWidth="0.6" opacity="0.2"/>
          <path d="M1400 620 C1575 555, 1750 685, 2100 620 C2450 555, 2625 685, 2800 620" fill="none" stroke="#c0d2ef" strokeWidth="0.6" opacity="0.2"/>
        </svg>

        {/* Waves bottom — lebih pendek, tidak mepet ke konten */}
        <div className="absolute bottom-0 left-0 w-full h-16 overflow-hidden">
          <svg
            className="absolute bottom-0 left-0 h-full wave-1"
            style={{ width: '200%' }}
            viewBox="0 0 2800 64"
            preserveAspectRatio="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M0 40 C350 18,350 18,700 40 C1050 62,1050 62,1400 40 C1750 18,1750 18,2100 40 C2450 62,2450 62,2800 40 L2800 64 L0 64 Z" fill="#cdd9f5" opacity="0.7"/>
          </svg>
          <svg
            className="absolute bottom-0 left-0 h-full wave-2"
            style={{ width: '200%' }}
            viewBox="0 0 2800 64"
            preserveAspectRatio="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M0 46 C350 26,350 26,700 46 C1050 62,1050 62,1400 46 C1750 26,1750 26,2100 46 C2450 62,2450 62,2800 46 L2800 64 L0 64 Z" fill="#bfcff4" opacity="0.55"/>
          </svg>
          <svg
            className="absolute bottom-0 left-0 h-full wave-3"
            style={{ width: '200%' }}
            viewBox="0 0 2800 64"
            preserveAspectRatio="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M0 52 C350 36,350 36,700 52 C1050 64,1050 64,1400 52 C1750 36,1750 36,2100 52 C2450 64,2450 64,2800 52 L2800 64 L0 64 Z" fill="#b3c7f3" opacity="0.45"/>
          </svg>
        </div>
      </div>

      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-7xl w-full">

          {/* Left Content */}
          <div className="flex flex-col justify-center">
            <h1 className="text-[42px] sm:text-[52px] font-bold text-[#1a1a1a] leading-tight mb-6">
              Jembatan Karir Masa Depan Anda
            </h1>

            <p className="text-[16px] text-[#666666] mb-8 leading-relaxed">
              Platform terintegrasi untuk mahasiswa mencari peluang dan perusahaan menemukan talenta terbaik melalui analisis data cerdas.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/login"
                className="px-8 py-3 bg-[#031635] !text-white text-[14px] font-semibold rounded-[8px] hover:bg-[#021127] transition-all duration-300 ease-in-out hover:shadow-lg text-center flex items-center justify-center gap-2"
              >
                Mulai Sekarang
              </Link>

              <button
                onClick={scrollToSolution}
                className="px-8 py-3 border-2 border-black text-black text-[14px] font-semibold rounded-[8px] hover:bg-black hover:text-white transition-all duration-300 ease-in-out hover:shadow-lg"
              >
                Pelajari Selengkapnya
              </button>
            </div>
          </div>

          {/* Right Image */}
          <div className="flex items-center justify-center">
            <div className="w-full aspect-[4/3] rounded-[12px] overflow-hidden shadow-lg transition-all duration-500 ease-out hover:-translate-y-4 hover:shadow-2xl cursor-pointer group">
              <img
                src="/src/assets/landing/foto.png"
                alt="Career Bridge"
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section
        ref={solutionRef}
        className="py-20 px-4 sm:px-6 lg:px-8"
        style={{ background: 'linear-gradient(180deg, #eef3fc 0%, #dde8fb 40%, #d4e2f9 100%)' }}
      >
        <div className="max-w-7xl mx-auto">

          <div className="text-center mb-16">
            <h2 className="text-[36px] sm:text-[42px] font-bold text-[#1a1a1a] mb-4">
              Solusi Terpadu untuk Ekosistem Karir
            </h2>
            <p className="text-[16px] text-[#666666] max-w-2xl mx-auto">
              Menghubungkan potensi akademik dengan kebutuhan industri nyata dalam satu platform yang handal.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

            {/* Mahasiswa Card */}
            <div className="bg-white rounded-[12px] p-8 border border-[#eaeaea] shadow-md hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 ease-out flex flex-col">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-[#1a1a1a] rounded-[6px] flex items-center justify-center">
                  <span className="text-white text-[20px]">
                    <img src="/src/assets/landing/untuk.png" alt="Career Bridge" className="w-full h-full object-cover" />
                  </span>
                </div>
                <h3 className="text-[20px] font-bold text-[#1a1a1a]">Untuk Mahasiswa</h3>
              </div>

              <p className="text-[14px] text-[#666666] mb-5 leading-relaxed">
                Kembangkan karir Anda dengan bimbingan berbasis data. Temukan jalur yang tepat sesuai keahlian Anda.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-[#f4f7fb] rounded-[8px] p-4 transition-colors duration-300 hover:bg-[#eaf0f8]">
                  <div className="mb-5 h-6 w-6">
                    <img src="/src/assets/landing/career.png" alt="career" className="w-full h-full object-contain" />
                  </div>
                  <h4 className="text-[13px] font-bold text-[#1a1a1a] mb-1">Rekomendasi Karir</h4>
                  <p className="text-[11px] text-[#666666] leading-relaxed">Analisis skill untuk rekomendasi terbaik</p>
                </div>

                <div className="bg-[#f4f7fb] rounded-[8px] p-4 transition-colors duration-300 hover:bg-[#eaf0f8]">
                  <div className="mb-3 h-6 w-6">
                    <img src="/src/assets/landing/skill.png" alt="skill" className="w-full h-full object-contain" />
                  </div>
                  <h4 className="text-[13px] font-bold text-[#1a1a1a] mb-1">Skill Gap Analysis</h4>
                  <p className="text-[11px] text-[#666666] leading-relaxed">Identifikasi skill yang perlu dikembangkan</p>
                </div>
              </div>
            </div>

            {/* Perusahaan Card */}
            <div className="bg-[#031635] rounded-[12px] p-8 shadow-md hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 ease-out flex flex-col">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-[#1C2D49] rounded-[6px] flex items-center justify-center">
                  <span className="text-[#031635] text-[20px]">
                    <img src="/src/assets/landing/untukP.png" alt="partner" className="w-full h-full object-cover" />
                  </span>
                </div>
                <h3 className="text-[20px] font-bold text-white">Untuk Perusahaan</h3>
              </div>

              <p className="text-[14px] text-[#b0b0b0] mb-8 leading-relaxed">
                Dapatkan akses ke bibit talenta unggulan dengan data akademik yang terverifikasi.
              </p>

              <div className="space-y-5 mb-8 flex-grow">
                <div className="flex items-start gap-3">
                  <span className="text-[16px] mt-0.5 w-5 h-5 flex-shrink-0">
                    <img src="/src/assets/landing/talent.png" alt="talent" className="w-full h-full object-contain" />
                  </span>
                  <div>
                    <h4 className="text-[13px] font-semibold text-white mb-1">Talent Discovery</h4>
                    <p className="text-[12px] text-[#999999]">Temukan talenta terbaik untuk posisi Anda</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="text-[16px] mt-0.5 w-5 h-5 flex-shrink-0">
                    <img src="/src/assets/landing/legal.png" alt="legal" className="w-full h-full object-contain" />
                  </span>
                  <div>
                    <h4 className="text-[13px] font-semibold text-white mb-1">Talent Management</h4>
                    <p className="text-[12px] text-[#999999]">Kelola portfolio talenta secara efisien</p>
                  </div>
                </div>
              </div>

              <Link
                to="/register"
                className="block w-full bg-[#80e5d9] text-[#031635] text-[13px] font-bold py-3 rounded-[8px] hover:bg-[#68d8cb] hover:shadow-lg transition-all duration-300 ease-in-out text-center"
              >
                Daftar Sebagai Partner
              </Link>
            </div>

          </div>
        </div>
      </section>
    </div>
  )
}

export default LandingPage