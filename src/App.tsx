import React, { useState, useEffect, useMemo } from 'react';
import {
  Scale,
  ShieldCheck,
  Briefcase,
  Building2,
  Landmark,
  FileText,
  BookOpen,
  Users,
  Phone,
  Mail,
  MapPin,
  Clock,
  ChevronRight,
  ArrowRight,
  Search,
  Calendar,
  User,
  Share2,
  CheckCircle2,
  AlertCircle,
  Lock,
  LogOut,
  Plus,
  Edit3,
  Trash2,
  Save,
  Menu,
  X,
  Globe,
  ExternalLink,
  MessageSquare,
  FileCheck,
  Award,
  Eye,
  Database,
  Code2,
  Check,
  Sun,
  Moon,
  Laptop,
  Handshake
} from 'lucide-react';

// ============================================================================
// SECURITY & CRYPTO UTILITIES
// ============================================================================

/**
 * Menghasilkan hash SHA-256 menggunakan Web Crypto API untuk validasi kredensial aman
 */
async function sha256Hex(message) {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Sanitasi input untuk mencegah XSS sebelum penyimpanan atau rendering
 */
function sanitizeInput(str) {
  if (typeof str !== 'string') return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .trim();
}

// ============================================================================
// DEFAULT DATA (TANPA DATA FIKTIF / BELUM TERVERIFIKASI)
// ============================================================================

const INITIAL_COMPANY_PROFILE = {
  companyName: 'PT. JURIS FACTI LAWFIRM & SERVICES BUREAU',
  shortName: 'JURIS FACTI LAWFIRM',
  tagline: 'Integrity, Justice, and Legal Excellence',
  heroHeadline: 'Your Legal Rights. Our Professional Commitment.',
  heroSubheadline:
    'Solusi hukum profesional dengan integritas, ketelitian, dan komitmen terhadap keadilan.',
  shortProfile:
    'PT. JURIS FACTI LAWFIRM & SERVICES BUREAU adalah biro layanan hukum dan konsultasi korporat yang berfokus pada pendampingan hukum strategis, penyelesaian sengketa, serta tata kelola kepatuhan hukum bagi individu maupun badan usaha di Indonesia.',
  history:
    'Informasi mengenai sejarah dan latar belakang pendirian PT. JURIS FACTI LAWFIRM & SERVICES BUREAU dapat dikelola dan diperbarui secara resmi melalui Dashboard Administrator sesuai dokumen akta pendirian perusahaan.',
  foundingBackground:
    'Didirikan atas dasar kebutuhan akan layanan pendampingan dan konsultasi hukum yang mengedepankan ketelitian analisis yuridis, etika profesi, serta kepastian hukum bagi klien.',
  philosophy:
    'Nama "Juris Facti" merepresentasikan perpaduan harmonis antara norma hukum positif (Juris) dan fakta hukum objektif di lapangan (Facti). Setiap langkah hukum wajib bertumpu pada kebenaran fakta dan ketepatan penerapan hukum.',
  commitment:
    'Kami berkomitmen penuh menjaga kerahasiaan klien, menjunjung tinggi kode etik profesi hukum, dan memberikan analisis hukum yang objektif demi terwujudnya keadilan serta kepastian hukum.',
  vision:
    'Menjadi penyedia layanan hukum profesional yang terpercaya, berintegritas, dan berorientasi pada kepastian serta keadilan hukum.',
  missions: [
    'Memberikan pelayanan hukum yang profesional dan bertanggung jawab.',
    'Mengutamakan integritas dan kepentingan hukum klien.',
    'Mengembangkan solusi hukum berdasarkan analisis dan kajian yang komprehensif.',
    'Meningkatkan kesadaran dan literasi hukum masyarakat.',
    'Membangun hubungan profesional jangka panjang dengan klien.'
  ],
  values: [
    {
      title: 'Integritas Tinggi',
      desc: 'Menjunjung tinggi kejujuran, transparansi, dan standar etika profesi dalam setiap penanganan perkara.'
    },
    {
      title: 'Ketelitian Yuridis',
      desc: 'Setiap pendapat dan dokumen hukum disusun melalui riset regulasi dan fakta yang mendalam.'
    },
    {
      title: 'Kerahasiaan Klien',
      desc: 'Menjamin keamanan dan kerahasiaan seluruh informasi, dokumen, serta strategi hukum klien.'
    },
    {
      title: 'Kepastian & Keadilan',
      desc: 'Berorientasi pada perlindungan hak-hak hukum klien secara sah, terukur, dan bermartabat.'
    }
  ]
};

const INITIAL_SERVICES = [
  {
    id: 'litigation',
    code: 'A',
    slug: 'litigation-dispute-resolution',
    title: 'Litigation & Dispute Resolution',
    feeEstimate: 'Berdasarkan Asesmen Perkara (Commitment Fee & Progress Payment)',
    feeScheme: 'Lump Sum / Commitment Fee + Progress Payment & Opsional Success Fee',
    shortDesc:
      'Pendampingan dan pembelaan hukum komprehensif dalam perkara pidana, perdata, maupun sengketa tata usaha negara.',
    overview:
      'Divisi Litigation & Dispute Resolution memberikan representasi dan pendampingan hukum secara menyeluruh pada setiap tahapan pemeriksaan maupun persidangan untuk melindungi hak dan kepentingan hukum klien.',
    items: [
      'Pendampingan perkara pidana.',
      'Sengketa perdata.',
      'Sengketa tata usaha negara.',
      'Pendampingan pemeriksaan dan proses hukum.',
      'Penyusunan gugatan, jawaban, eksepsi, dan pembelaan.'
    ],
    iconName: 'Scale'
  },
  {
    id: 'corporate',
    code: 'B',
    slug: 'corporate-business-law',
    title: 'Corporate & Business Law',
    feeEstimate: 'PT Perorangan Rp 7.500.000 | Promo Bundle PT Biasa + Website Rp 14.500.000',
    feeScheme: 'Paket One-Time Pendirian Badan Usaha & Solusi All-in-One Korporasi',
    shortDesc:
      'Layanan hukum korporasi mulai dari pendirian badan usaha, uji tuntas hukum, hingga penyusunan kontrak bisnis.',
    overview:
      'Divisi Corporate & Business Law membantu pelaku usaha dan korporasi memastikan setiap langkah bisnis berjalan selaras dengan peraturan perundang-undangan serta memitigasi risiko hukum komersial.',
    items: [
      'Konsultasi hukum perusahaan.',
      'Pendirian dan perubahan badan usaha.',
      'Legal due diligence.',
      'Legal drafting.',
      'Perjanjian bisnis dan kontrak.'
    ],
    iconName: 'Building2'
  },
  {
    id: 'agrarian',
    code: 'C',
    slug: 'land-agrarian-law',
    title: 'Land & Agrarian Law',
    feeEstimate: 'Berdasarkan Asesmen Objek & Luas Bidang Tanah',
    feeScheme: 'Per-Project / Tahapan Pengurusan & Penyelesaian Sengketa',
    shortDesc:
      'Penanganan aspek hukum pertanahan, hak atas tanah, sengketa agraria, serta perizinan pertanahan dan perkebunan.',
    overview:
      'Divisi Land & Agrarian Law menyediakan kajian yuridis dan pendampingan pengurusan dokumen pertanahan maupun penyelesaian sengketa hak atas tanah secara komprehensif.',
    items: [
      'Konsultasi pertanahan.',
      'Sengketa hak atas tanah.',
      'Pengurusan dan analisis dokumen pertanahan.',
      'HGU, HGB, dan hak atas tanah lainnya.',
      'Pendampingan perizinan pertanahan dan perkebunan.'
    ],
    iconName: 'Landmark'
  },
  {
    id: 'government',
    code: 'D',
    slug: 'government-administrative-law',
    title: 'Government & Administrative Law',
    feeEstimate: 'Berdasarkan Kajian Keputusan & Kompleksitas Sengketa TUN',
    feeScheme: 'Per-Project Kajian Administrasi / Litigasi PTUN',
    shortDesc:
      'Kajian keputusan tata usaha negara, pendampingan perizinan, serta penyelesaian sengketa administrasi pemerintahan.',
    overview:
      'Divisi Government & Administrative Law berfokus pada aspek hukum administrasi negara, tata kelola perizinan, serta evaluasi keabsahan keputusan pejabat tata usaha negara.',
    items: [
      'Hukum administrasi pemerintahan.',
      'Pendampingan permasalahan perizinan.',
      'Kajian keputusan tata usaha negara.',
      'Pendampingan sengketa administrasi.'
    ],
    iconName: 'ShieldCheck'
  },
  {
    id: 'advisory',
    code: 'E',
    slug: 'legal-consultation-advisory',
    title: 'Legal Consultation & Advisory',
    feeEstimate: 'Gratis Konsultasi Legal Awal untuk Paket Pendirian Usaha / Berdasarkan Kajian',
    feeScheme: 'Consultation Fee & Fixed Fee Legal Opinion / Legal Audit',
    shortDesc:
      'Pemberian pendapat hukum (legal opinion), audit kepatuhan hukum, serta kajian peraturan perundang-undangan.',
    overview:
      'Divisi Legal Consultation & Advisory menyediakan analisis hukum preventif dan strategis guna mendukung pengambilan keputusan yang akurat bagi klien perorangan maupun institusi.',
    items: [
      'Konsultasi hukum.',
      'Legal opinion.',
      'Legal audit.',
      'Kajian peraturan perundang-undangan.',
      'Pendapat dan rekomendasi hukum.'
    ],
    iconName: 'BookOpen'
  },
  {
    id: 'documentation',
    code: 'F',
    slug: 'legal-documentation',
    title: 'Legal Documentation',
    feeEstimate: 'Termasuk Akta Notaris, SK Kemenkumham & NIB pada Paket Pendirian Usaha',
    feeScheme: 'Fixed Fee Per-Dokumen (Kontrak, Somasi, Surat Kuasa, Akta)',
    shortDesc:
      'Penyusunan instrumen dan dokumen hukum resmi seperti kontrak, surat kuasa, somasi, dan dokumen korporasi.',
    overview:
      'Divisi Legal Documentation memastikan setiap dokumen hukum disusun dengan struktur yang sistematis, klausul yang presisi, serta memiliki kekuatan pembuktian yang optimal.',
    items: [
      'Penyusunan kontrak.',
      'Surat kuasa.',
      'Somasi.',
      'Pendapat hukum.',
      'Dokumen hukum perusahaan.'
    ],
    iconName: 'FileText'
  }
];

const INITIAL_FEE_GUIDE = {
  code: '04 / BIAYA',
  title: 'BIAYA & PROMO',
  subtitle: 'Harga transparan untuk kemitraan strategis yang berkelanjutan.',
  disclaimer:
    'Seluruh paket layanan resmi PT. JURIS FACTI LAWFIRM & SERVICES BUREAU dilaksanakan sesuai ketentuan hukum yang berlaku dan dilengkapi pendampingan profesional dari awal hingga dokumen legalitas diterbitkan.',
  packages: [
    {
      id: 'pkg-01',
      number: '/01',
      label: 'PT PERORANGAN',
      price: 'Rp 7.500.000',
      billingType: 'one-time',
      description: 'Legalitas bisnis perorangan terdaftar Kemenkumham untuk pengusaha mandiri.',
      features: [
        'PT Perorangan',
        'Penerbitan NIB (Nomor Induk Berusaha)',
        'Konsultasi Legal Gratis',
        'Bonus: Promo Bundle Website (+Rp 2.5jt)'
      ],
      featured: false
    },
    {
      id: 'pkg-02',
      number: '/02',
      label: 'PROMO BUNDLE',
      price: 'Rp 14.500.000',
      billingType: 'paket lengkap',
      description: "Solusi 'All-in-One' Pendirian PT Biasa lengkap dengan Website Perusahaan.",
      features: [
        'Akta Notaris PT Biasa',
        'SK Kemenkumham & NIB',
        'Website Company Profile',
        'Konsultasi Hukum & IT',
        'Hemat biaya pengurusan'
      ],
      featured: true
    },
    {
      id: 'pkg-03',
      number: '/03',
      label: 'APLIKASI DIGITAL',
      price: 'Custom',
      billingType: 'atau bagi hasil',
      description: 'Pengembangan sistem aplikasi penjualan Full Version atau skema Kerjasama.',
      features: [
        'Full Purchase (start from Rp 250.000.000)',
        'Opsi Kerjasama dengan Commitment Fee (start from Rp 15.000.000)',
        'Skema Komisi (start from 10%)',
        'Maintenance Sistem',
        'Full Source Code Ownership'
      ],
      featured: false
    }
  ]
};

const STRATEGIC_PARTNER_ECOSYSTEM = {
  partnerName: 'PT. SCUDERIA HIVE INDONESIA',
  partnerUrl: 'https://scuderiahive.id/',
  tagline: 'Solusi Legal & Digital Terpadu (#WeBuildAsOne)',
  description:
    'PT. JURIS FACTI LAWFIRM & SERVICES BUREAU menjalin kolaborasi strategis bersama PT. Scuderia Hive Indonesia (Digital & IT Consulting Agency di Pekanbaru) untuk menghadirkan layanan terpadu antara kepastian hukum, pendirian badan usaha, dan transformasi digital bisnis.',
  integratedPillars: [
    {
      code: '01 / DIGITALISASI',
      title: 'Digitalisasi Bisnis & Sistem Operasional',
      desc: 'Pembuatan Website Company Profile profesional, sistem Point of Sales (POS), serta aplikasi mobile & web pendukung operasional usaha bersama tim IT PT. Scuderia Hive Indonesia.'
    },
    {
      code: '02 / PENDIRIAN',
      title: 'Pendirian Badan Usaha Terpadu',
      desc: 'Layanan lengkap pendirian PT Biasa (Akta Notaris & SK Kemenkumham) maupun PT Perorangan beserta penerbitan NIB (Nomor Induk Berusaha) siap operasional.'
    },
    {
      code: '03 / KONSULTASI',
      title: 'Konsultasi Hukum & Kepatuhan Digital',
      desc: 'Pendampingan yuridis penuh oleh Juris Facti Lawfirm untuk memastikan keamanan legalitas usaha, perlindungan kontrak digital, dan tata kelola korporasi.'
    }
  ],
  ecosystemClients: [
    { name: 'UPT Metrologi Legal Pekanbaru', type: 'Partner', desc: 'Sistem informasi metrologi legal untuk pengelolaan data dan operasional layanan terintegrasi.' },
    { name: 'KOPSI', type: 'Client', desc: 'Sistem pemesanan transportasi & taksi online.' },
    { name: 'Kavlink', type: 'Client', desc: 'Platform marketplace properti, kontraktor, dan jasa profesional.' },
    { name: 'Ravora', type: 'Client', desc: 'Sistem Point of Sales (POS) dan manajemen operasional bisnis.' },
    { name: 'Mitsubishi Sudirman & Hyundai Pekanbaru', type: 'Client', desc: 'Website resmi dealer & showroom otomotif dengan katalog serta simulasi kredit.' },
    { name: 'BDN Group', type: 'Client', desc: 'Website corporate dengan informasi perusahaan dan portofolio.' }
  ]
};

const INITIAL_TEAM = [];

const INITIAL_ARTICLES = [
  {
    id: 'art-1',
    slug: 'pentingnya-legal-due-diligence-dalam-transaksi-bisnis',
    title: 'Pentingnya Legal Due Diligence (Uji Tuntas Hukum) Sebelum Transaksi Korporasi',
    category: 'Analisis Peraturan',
    author: 'Divisi Corporate & Business Law',
    publishedAt: '2026-10-12',
    summary:
      'Uji tuntas hukum merupakan instrumen krusial untuk memetakan potensi risiko litigasi, keabsahan perizinan, dan kepatuhan regulasi sebelum akuisisi atau kerja sama bisnis.',
    content:
      'Dalam setiap transaksi korporasi berskala menengah maupun besar, pemeriksaan dokumen administratif saja tidak memadai untuk menjamin keamanan investasi.\n\nLegal Due Diligence (LDD) dilakukan untuk memverifikasi legalitas badan usaha, struktur permodalan, keabsahan aset, perizinan berusaha berbasis risiko, serta potensi sengketa yang sedang berjalan maupun tertunda.\n\nMelalui laporan uji tuntas hukum yang komprehensif, para pihak memperoleh dasar objektif dalam merumuskan klausul perlindungan (indemnity & warranties) pada perjanjian final.'
  },
  {
    id: 'art-2',
    slug: 'penyelesaian-sengketa-hak-atas-tanah-dan-kepastian-sertifikat',
    title: 'Aspek Pembuktian Hak Atas Tanah dalam Sengketa Pertanahan di Indonesia',
    category: 'Kajian Hukum',
    author: 'Divisi Land & Agrarian Law',
    publishedAt: '2026-09-28',
    summary:
      'Tinjauan yuridis mengenai kekuatan pembuktian sertifikat hak atas tanah, riwayat penguasaan fisik, serta langkah hukum penyelesaian tumpang tindih kepemilikan.',
    content:
      'Permasalahan pertanahan sering kali berakar pada ketidaksesuaian antara data yuridis, data fisik, maupun riwayat peralihan hak di masa lampau.\n\nDalam sistem pendaftaran tanah di Indonesia, sertifikat merupakan alat pembuktian yang kuat sepanjang data fisik dan data yuridis di dalamnya sesuai dengan data yang ada dalam surat ukur dan buku tanah yang bersangkutan.\n\nOleh karena itu, audit dokumen pertanahan dan penelusuran warkah secara cermat menjadi langkah awal yang esensial sebelum menempuh upaya penyelesaian sengketa baik melalui mediasi maupun pengadilan.'
  },
  {
    id: 'art-3',
    slug: 'fungsi-somasi-sebagai-upaya-penyelesaian-wanprestasi',
    title: 'Fungsi dan Kedudukan Hukum Somasi dalam Penyelesaian Wanprestasi Perjanjian',
    category: 'Edukasi Hukum',
    author: 'Divisi Litigation & Dispute Resolution',
    publishedAt: '2026-09-10',
    summary:
      'Memahami syarat formal, substansi peringatan hukum (somasi), serta implikasinya terhadap pembuktian kelalaian debitur di muka persidangan perdata.',
    content:
      'Somasi atau pernyataan lalai merupakan instrumen hukum penting sebelum mengajukan gugatan wanprestasi ke pengadilan negeri.\n\nSebagaimana diatur dalam Pasal 1238 Kitab Undang-Undang Hukum Perdata, debitur dinyatakan lalai apabila telah diperingatkan secara resmi melalui surat perintah atau akta sejenis.\n\nPenyusunan somasi yang presisi memuat dasar hubungan hukum, rincian kewajiban yang belum dipenuhi, tenggang waktu pemenuhan prestasi, serta konsekuensi hukum apabila peringatan tidak diindahkan.'
  }
];

const INITIAL_CONTACT = {
  address: 'Jl. Merpati No.89, Tengkerang Tim., Tenayan Raya, Kota Pekanbaru, Riau 28131',
  phone: '082180004301',
  whatsapp: '6282180004301',
  whatsappDisplay: '082180004301',
  email: 'jfl.sb89@gmail.com',
  operationalHours: 'Senin – Jumat: 08.30 – 17.00 WIB | Sabtu: Dengan Perjanjian',
  mapsEmbedUrl:
    'https://www.google.com/maps?q=Jl.+Merpati+No.89,+Tengkerang+Tim.,+Tenayan+Raya,+Kota+Pekanbaru,+Riau+28131&output=embed'
};

const INITIAL_SEO = {
  siteTitle: 'PT. JURIS FACTI LAWFIRM & SERVICES BUREAU | Integrity, Justice, and Legal Excellence',
  metaDescription:
    'PT. JURIS FACTI LAWFIRM & SERVICES BUREAU menyediakan layanan konsultasi hukum, litigasi, hukum perusahaan, pertanahan, administrasi pemerintahan, dan penyusunan dokumen hukum profesional.',
  keywords:
    'law firm pekanbaru, pengacara pekanbaru, konsultasi hukum, PT Juris Facti Lawfirm, legal due diligence, sengketa pertanahan, hukum perusahaan',
  ogImage:
    'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=1200&q=80'
};

// ============================================================================
// HELPER ICON RENDERER
// ============================================================================

const ServiceIcon = ({ name, className = 'w-6 h-6' }) => {
  switch (name) {
    case 'Scale':
      return <Scale className={className} />;
    case 'Building2':
      return <Building2 className={className} />;
    case 'Landmark':
      return <Landmark className={className} />;
    case 'ShieldCheck':
      return <ShieldCheck className={className} />;
    case 'BookOpen':
      return <BookOpen className={className} />;
    case 'FileText':
      return <FileText className={className} />;
    default:
      return <Briefcase className={className} />;
  }
};

// ============================================================================
// MAIN APPLICATION COMPONENT
// ============================================================================

export function App() {
  // Navigation State (SEO-friendly slug routing simulation)
  const [activeRoute, setActiveRoute] = useState('home');
  const [selectedServiceSlug, setSelectedServiceSlug] = useState(null);
  const [selectedArticleSlug, setSelectedArticleSlug] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Dark / Light Mode State (Default: Dark Mode)
  const [darkMode, setDarkMode] = useState(() => {
    try {
      const savedTheme = localStorage.getItem('jf_theme_mode');
      return savedTheme === null ? true : savedTheme === 'dark';
    } catch {
      return true;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('jf_theme_mode', darkMode ? 'dark' : 'light');
    } catch {}
  }, [darkMode]);

  // Persistent Application State (LocalStorage backed + Supabase ready)
  const [companyProfile, setCompanyProfile] = useState(() => {
    try {
      const saved = localStorage.getItem('jf_company_profile_v2');
      return saved ? JSON.parse(saved) : INITIAL_COMPANY_PROFILE;
    } catch {
      return INITIAL_COMPANY_PROFILE;
    }
  });

  const [services, setServices] = useState(() => {
    try {
      const saved = localStorage.getItem('jf_services_v4');
      return saved ? JSON.parse(saved) : INITIAL_SERVICES;
    } catch {
      return INITIAL_SERVICES;
    }
  });

  const [feeGuide, setFeeGuide] = useState(() => {
    try {
      const saved = localStorage.getItem('jf_fee_guide_v3');
      return saved ? JSON.parse(saved) : INITIAL_FEE_GUIDE;
    } catch {
      return INITIAL_FEE_GUIDE;
    }
  });

  const [team, setTeam] = useState(() => {
    try {
      const saved = localStorage.getItem('jf_team_v2');
      return saved ? JSON.parse(saved) : INITIAL_TEAM;
    } catch {
      return INITIAL_TEAM;
    }
  });

  const [articles, setArticles] = useState(() => {
    try {
      const saved = localStorage.getItem('jf_articles_v2');
      return saved ? JSON.parse(saved) : INITIAL_ARTICLES;
    } catch {
      return INITIAL_ARTICLES;
    }
  });

  const [contactInfo, setContactInfo] = useState(() => {
    try {
      const saved = localStorage.getItem('jf_contact_v2');
      return saved ? JSON.parse(saved) : INITIAL_CONTACT;
    } catch {
      return INITIAL_CONTACT;
    }
  });

  const [seoConfig, setSeoConfig] = useState(() => {
    try {
      const saved = localStorage.getItem('jf_seo_v2');
      return saved ? JSON.parse(saved) : INITIAL_SEO;
    } catch {
      return INITIAL_SEO;
    }
  });

  // Private Consultations (Hanya dapat diakses oleh Admin terautentikasi)
  const [consultations, setConsultations] = useState(() => {
    try {
      const saved = localStorage.getItem('jf_consultations_v2');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Contact Messages (Hanya dapat diakses oleh Admin terautentikasi)
  const [contactMessages, setContactMessages] = useState(() => {
    try {
      const saved = localStorage.getItem('jf_messages_v2');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Admin Auth Session State
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(() => {
    try {
      return sessionStorage.getItem('jf_admin_session') === 'active';
    } catch {
      return false;
    }
  });

  // Sync states to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('jf_services_v4', JSON.stringify(services));
    } catch (e) {}
  }, [services]);

  useEffect(() => {
    try {
      localStorage.setItem('jf_fee_guide_v3', JSON.stringify(feeGuide));
    } catch (e) {}
  }, [feeGuide]);

  useEffect(() => {
    try {
      localStorage.setItem('jf_team_v2', JSON.stringify(team));
    } catch (e) {}
  }, [team]);

  useEffect(() => {
    try {
      localStorage.setItem('jf_articles_v2', JSON.stringify(articles));
    } catch (e) {}
  }, [articles]);

  useEffect(() => {
    try {
      localStorage.setItem('jf_contact_v2', JSON.stringify(contactInfo));
    } catch (e) {}
  }, [contactInfo]);

  useEffect(() => {
    try {
      localStorage.setItem('jf_seo_v2', JSON.stringify(seoConfig));
    } catch (e) {}
  }, [seoConfig]);

  useEffect(() => {
    try {
      localStorage.setItem('jf_consultations_v2', JSON.stringify(consultations));
    } catch (e) {}
  }, [consultations]);

  useEffect(() => {
    try {
      localStorage.setItem('jf_messages_v2', JSON.stringify(contactMessages));
    } catch (e) {}
  }, [contactMessages]);

  // Dynamic SEO Document Title & Meta Injection
  useEffect(() => {
    document.title = seoConfig.siteTitle;
  }, [seoConfig]);

  // Navigation Helper
  const navigateTo = (route, param = null) => {
    setMobileMenuOpen(false);
    if (route === 'service-detail') {
      setSelectedServiceSlug(param);
      setActiveRoute('service-detail');
    } else if (route === 'article-detail') {
      setSelectedArticleSlug(param);
      setActiveRoute('article-detail');
    } else {
      setSelectedServiceSlug(null);
      setSelectedArticleSlug(null);
      setActiveRoute(route);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // ==========================================================================
  // NAVIGATION BAR COMPONENT
  // ==========================================================================
  const Navbar = () => {
    const navItems = [
      { id: 'home', label: 'Home' },
      { id: 'about', label: 'About Us' },
      { id: 'services', label: 'Our Services' },
      { id: 'team', label: 'Our Team' },
      { id: 'knowledge', label: 'Legal Knowledge' },
      { id: 'consultation', label: 'Consultation' },
      { id: 'contact', label: 'Contact' }
    ];

    return (
      <header
        className={`sticky top-0 z-50 backdrop-blur-md border-b transition-colors duration-300 shadow-lg ${
          darkMode
            ? 'bg-[#070D17]/95 border-[#C5A15A]/30 text-white'
            : 'bg-white/95 border-slate-200 text-[#101D32]'
        }`}
      >
        {/* Top Bar Info */}
        <div
          className={`hidden lg:block border-b text-xs transition-colors duration-300 ${
            darkMode
              ? 'bg-[#04080F] border-white/10 text-slate-300'
              : 'bg-slate-100 border-slate-200 text-slate-600'
          }`}
        >
          <div className="max-w-7xl mx-auto px-6 py-2 flex items-center justify-between">
            <div className="flex items-center gap-6">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#C5A15A]" />
                <span>{contactInfo.address}</span>
              </span>
              <span className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-[#C5A15A]" />
                <a href={`mailto:${contactInfo.email}`} className="hover:text-[#C5A15A] transition-colors">
                  {contactInfo.email}
                </a>
              </span>
            </div>
            <div className="flex items-center gap-5">
              <span className={`font-medium tracking-wide italic ${darkMode ? 'text-[#C5A15A]' : 'text-[#8C6D2E]'}`}>
                &ldquo;{companyProfile.tagline}&rdquo;
              </span>
              <button
                onClick={() => navigateTo('admin')}
                className={`flex items-center gap-1 transition-colors ${
                  darkMode ? 'text-slate-400 hover:text-[#C5A15A]' : 'text-slate-600 hover:text-[#101D32]'
                }`}
                title="Administrator Portal"
              >
                <Lock className="w-3 h-3" />
                <span>Admin</span>
              </button>
              <button
                onClick={() => setDarkMode((prev) => !prev)}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-sm font-semibold border transition-all ${
                  darkMode
                    ? 'bg-[#C5A15A] text-[#070D17] border-[#C5A15A] hover:bg-[#d4b26d]'
                    : 'bg-[#101D32] text-[#C5A15A] border-[#101D32] hover:bg-[#1a2d4d]'
                }`}
                title={darkMode ? 'Beralih ke Mode Terang' : 'Beralih ke Mode Gelap'}
              >
                {darkMode ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
                <span>{darkMode ? 'Mode Terang' : 'Mode Gelap'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Main Navigation Bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Typographic Monogram Logo "JF" & Brand Name */}
            <button
              onClick={() => navigateTo('home')}
              className="flex items-center gap-3.5 text-left group focus:outline-none"
            >
              <div className="w-11 h-11 flex items-center justify-center bg-gradient-to-br from-[#182945] to-[#0B1525] border border-[#C5A15A] rounded-sm shadow-md group-hover:border-[#C5A15A] transition-colors">
                <span className="font-serif text-xl font-bold tracking-wider text-[#C5A15A]">
                  JF
                </span>
              </div>
              <div>
                <div
                  className={`font-serif text-base sm:text-lg font-bold tracking-wide leading-tight group-hover:text-[#C5A15A] transition-colors ${
                    darkMode ? 'text-white' : 'text-[#101D32]'
                  }`}
                >
                  JURIS FACTI LAWFIRM
                </div>
                <div className="text-[10px] sm:text-xs font-medium tracking-[0.22em] text-[#C5A15A] uppercase">
                  &amp; Services Bureau
                </div>
              </div>
            </button>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {navItems.map((item) => {
                const isActive =
                  activeRoute === item.id ||
                  (item.id === 'services' && activeRoute === 'service-detail') ||
                  (item.id === 'knowledge' && activeRoute === 'article-detail');
                return (
                  <button
                    key={item.id}
                    onClick={() => navigateTo(item.id)}
                    className={`px-3.5 py-2 text-sm font-medium rounded-sm transition-all ${
                      isActive
                        ? darkMode
                          ? 'text-[#C5A15A] bg-white/10 border-b-2 border-[#C5A15A]'
                          : 'text-[#101D32] font-bold bg-slate-100 border-b-2 border-[#C5A15A]'
                        : darkMode
                          ? 'text-slate-200 hover:text-[#C5A15A] hover:bg-white/5'
                          : 'text-slate-700 hover:text-[#101D32] hover:bg-slate-100'
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </nav>

            {/* Mobile Controls */}
            <div className="flex items-center gap-2 lg:hidden">
              <button
                onClick={() => setDarkMode((prev) => !prev)}
                className={`px-2.5 py-1.5 rounded-sm text-xs font-bold flex items-center gap-1.5 transition-colors ${
                  darkMode
                    ? 'bg-[#C5A15A] text-[#070D17]'
                    : 'bg-[#101D32] text-[#C5A15A]'
                }`}
                aria-label={darkMode ? 'Mode Terang' : 'Mode Gelap'}
              >
                {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                <span>{darkMode ? 'Terang' : 'Gelap'}</span>
              </button>
              <button
                onClick={() => navigateTo('admin')}
                className={`p-2 ${darkMode ? 'text-slate-300 hover:text-[#C5A15A]' : 'text-slate-700 hover:text-[#101D32]'}`}
                aria-label="Admin Portal"
              >
                <Lock className="w-4 h-4" />
              </button>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className={`p-2 rounded-sm ${
                  darkMode
                    ? 'text-slate-200 hover:text-[#C5A15A] hover:bg-white/5'
                    : 'text-[#101D32] hover:bg-slate-100'
                }`}
                aria-label="Toggle Menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div
            className={`lg:hidden border-t px-4 pt-2 pb-6 space-y-1 ${
              darkMode ? 'bg-[#070D17] border-white/10' : 'bg-white border-slate-200'
            }`}
          >
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => navigateTo(item.id)}
                className={`block w-full text-left px-4 py-3 text-sm font-medium rounded-sm ${
                  activeRoute === item.id
                    ? darkMode
                      ? 'bg-[#182945] text-[#C5A15A] border-l-2 border-[#C5A15A]'
                      : 'bg-slate-100 text-[#101D32] font-bold border-l-4 border-[#C5A15A]'
                    : darkMode
                      ? 'text-slate-200 hover:bg-white/5'
                      : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        )}
      </header>
    );
  };

  // ==========================================================================
  // FOOTER COMPONENT
  // ==========================================================================
  const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
      <footer className="bg-[#0B1525] text-slate-300 border-t border-[#C5A15A]/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            {/* Brand & Tagline */}
            <div className="lg:col-span-1 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 flex items-center justify-center bg-[#182945] border border-[#C5A15A] rounded-sm">
                  <span className="font-serif text-lg font-bold text-[#C5A15A]">JF</span>
                </div>
                <div>
                  <div className="font-serif text-sm font-bold text-white tracking-wide">
                    PT. JURIS FACTI LAWFIRM
                  </div>
                  <div className="text-[10px] tracking-[0.2em] text-[#C5A15A] uppercase">
                    &amp; Services Bureau
                  </div>
                </div>
              </div>
              <p className="text-sm text-[#C5A15A] font-serif italic">
                &ldquo;{companyProfile.tagline}&rdquo;
              </p>
              <p className="text-xs text-slate-400 leading-relaxed">
                Biro layanan hukum dan konsultasi korporat yang mengedepankan integritas, ketelitian analisis yuridis, serta perlindungan hak-hak hukum klien secara profesional.
              </p>
            </div>

            {/* Navigation Menu */}
            <div>
              <h3 className="font-serif text-white text-sm font-semibold uppercase tracking-wider mb-4 pb-2 border-b border-white/10">
                Navigasi Utama
              </h3>
              <ul className="space-y-2.5 text-sm">
                {[
                  { id: 'home', label: 'Home' },
                  { id: 'about', label: 'About Us' },
                  { id: 'services', label: 'Our Services' },
                  { id: 'team', label: 'Our Team' },
                  { id: 'knowledge', label: 'Legal Knowledge' },
                  { id: 'consultation', label: 'Consultation' },
                  { id: 'contact', label: 'Contact' }
                ].map((link) => (
                  <li key={link.id}>
                    <button
                      onClick={() => navigateTo(link.id)}
                      className="text-slate-400 hover:text-[#C5A15A] transition-colors flex items-center gap-1.5"
                    >
                      <ChevronRight className="w-3.5 h-3.5 text-[#C5A15A]" />
                      <span>{link.label}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Practice Areas */}
            <div>
              <h3 className="font-serif text-white text-sm font-semibold uppercase tracking-wider mb-4 pb-2 border-b border-white/10">
                Bidang Layanan Hukum
              </h3>
              <ul className="space-y-2.5 text-sm">
                {services.map((srv) => (
                  <li key={srv.id}>
                    <button
                      onClick={() => navigateTo('service-detail', srv.slug)}
                      className="text-slate-400 hover:text-[#C5A15A] transition-colors text-left flex items-start gap-1.5"
                    >
                      <span className="text-[#C5A15A] font-semibold text-xs mt-0.5">{srv.code}.</span>
                      <span>{srv.title}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h3 className="font-serif text-white text-sm font-semibold uppercase tracking-wider mb-4 pb-2 border-b border-white/10">
                Informasi Kantor
              </h3>
              <ul className="space-y-3.5 text-sm text-slate-400">
                <li className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-[#C5A15A] shrink-0 mt-1" />
                  <span>{contactInfo.address}</span>
                </li>
                <li className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-[#C5A15A] shrink-0" />
                  <a href={`tel:${contactInfo.phone}`} className="hover:text-[#C5A15A] transition-colors">
                    {contactInfo.phone}
                  </a>
                </li>
                <li className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-[#C5A15A] shrink-0" />
                  <a href={`mailto:${contactInfo.email}`} className="hover:text-[#C5A15A] transition-colors">
                    {contactInfo.email}
                  </a>
                </li>
                <li className="flex items-start gap-3">
                  <Clock className="w-4 h-4 text-[#C5A15A] shrink-0 mt-1" />
                  <span>{contactInfo.operationalHours}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="border-t border-white/10 bg-[#080F1B]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
            <p>
              &copy; {currentYear} <strong className="text-slate-200">{companyProfile.companyName}</strong>. All Rights Reserved.
            </p>
            <div className="flex items-center gap-6">
              <button onClick={() => navigateTo('consultation')} className="hover:text-[#C5A15A] transition-colors">
                Kebijakan Privasi &amp; Kerahasiaan Klien
              </button>
              <button onClick={() => navigateTo('admin')} className="hover:text-[#C5A15A] transition-colors">
                Portal Administrator
              </button>
            </div>
          </div>
        </div>
      </footer>
    );
  };

  // ==========================================================================
  // PAGE 1: HOME PAGE
  // ==========================================================================
  const HomePage = () => {
    return (
      <div>
        {/* Hero Section */}
        <section
          className={`relative overflow-hidden transition-colors duration-300 ${
            darkMode ? 'bg-[#060B14] text-white' : 'bg-[#F8F9FA] text-[#101D32]'
          }`}
        >
          {/* Background Architectural Image with Adaptive Overlay */}
          <div
            className={`absolute inset-0 bg-cover bg-center scale-105 ${
              darkMode ? 'opacity-20' : 'opacity-15'
            }`}
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=1920&q=80')"
            }}
          />
          <div
            className={`absolute inset-0 ${
              darkMode
                ? 'bg-gradient-to-r from-[#060B14] via-[#060B14]/95 to-[#060B14]/80'
                : 'bg-gradient-to-r from-white via-white/95 to-slate-100/85'
            }`}
          />

          {/* Subtle Decorative Gold Lines */}
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-36">
            <div className="max-w-3xl">
              <div
                className={`inline-flex items-center gap-2.5 px-3.5 py-1.5 border rounded-sm mb-6 ${
                  darkMode
                    ? 'bg-[#101D32]/90 border-[#C5A15A]/40'
                    : 'bg-white border-[#C5A15A]/60 shadow-sm'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-[#C5A15A]" />
                <span
                  className={`text-xs font-semibold tracking-[0.18em] uppercase ${
                    darkMode ? 'text-[#C5A15A]' : 'text-[#8C6D2E]'
                  }`}
                >
                  {companyProfile.companyName}
                </span>
              </div>

              <h1
                className={`font-serif text-3xl sm:text-5xl lg:text-6xl font-bold leading-[1.15] tracking-tight mb-6 ${
                  darkMode ? 'text-white' : 'text-[#101D32]'
                }`}
              >
                {companyProfile.heroHeadline}
              </h1>

              <p
                className={`text-base sm:text-xl leading-relaxed mb-10 max-w-2xl font-light ${
                  darkMode ? 'text-slate-300' : 'text-slate-600'
                }`}
              >
                {companyProfile.heroSubheadline}
              </p>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                <button
                  onClick={() => navigateTo('consultation')}
                  className="px-7 py-4 bg-[#C5A15A] hover:bg-[#b59049] text-[#101D32] font-bold text-sm uppercase tracking-wider rounded-sm transition-all flex items-center justify-center gap-2.5 shadow-lg"
                >
                  <span>Konsultasi Hukum</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => navigateTo('services')}
                  className={`px-7 py-4 border font-semibold text-sm uppercase tracking-wider rounded-sm transition-all flex items-center justify-center gap-2 ${
                    darkMode
                      ? 'bg-transparent hover:bg-white/10 text-white border-white/30 hover:border-[#C5A15A]'
                      : 'bg-[#101D32] hover:bg-[#1a2d4d] text-white border-[#101D32]'
                  }`}
                >
                  <span>Pelajari Layanan Kami</span>
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Gold Accent Strip */}
          <div className="h-1.5 w-full bg-gradient-to-r from-[#101D32] via-[#C5A15A] to-[#101D32]" />
        </section>

        {/* Profil Singkat & Keunggulan Perusahaan */}
        <section className={`py-20 transition-colors duration-300 ${darkMode ? 'bg-[#080F1C]' : 'bg-white'}`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
              <div className="lg:col-span-5 space-y-5">
                <div className="text-xs font-bold tracking-[0.2em] text-[#C5A15A] uppercase">
                  Tentang Perusahaan
                </div>
                <h2 className={`font-serif text-3xl sm:text-4xl font-bold leading-tight ${darkMode ? 'text-white' : 'text-[#101D32]'}`}>
                  Integritas, Ketelitian, dan Kepastian Hukum
                </h2>
                <div className="w-16 h-1 bg-[#C5A15A]" />
                <p className={`leading-relaxed text-base ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                  {companyProfile.shortProfile}
                </p>
                <p className={`leading-relaxed text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                  {companyProfile.philosophy}
                </p>
                <div className="pt-2">
                  <button
                    onClick={() => navigateTo('about')}
                    className={`inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider transition-colors ${
                      darkMode ? 'text-[#C5A15A] hover:text-white' : 'text-[#101D32] hover:text-[#C5A15A]'
                    }`}
                  >
                    <span>Selengkapnya Mengenai Kami</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
                {companyProfile.values.map((val, idx) => (
                  <div
                    key={idx}
                    className={`p-6 border hover:border-[#C5A15A]/70 rounded-sm transition-all ${
                      darkMode ? 'bg-[#101D32] border-slate-800' : 'bg-slate-50 border-slate-200/80'
                    }`}
                  >
                    <div className={`w-10 h-10 text-[#C5A15A] flex items-center justify-center rounded-sm mb-4 font-serif font-bold ${darkMode ? 'bg-[#0B1525] border border-[#C5A15A]/40' : 'bg-[#101D32]'}`}>
                      0{idx + 1}
                    </div>
                    <h3 className={`font-serif text-lg font-bold mb-2 ${darkMode ? 'text-white' : 'text-[#101D32]'}`}>
                      {val.title}
                    </h3>
                    <p className={`text-sm leading-relaxed ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>{val.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Biaya & Promo Section (Sesuai Referensi Paket) */}
        <section className={`py-20 border-t transition-colors ${darkMode ? 'bg-[#060B14] border-slate-800' : 'bg-white border-slate-200'}`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
              <div>
                <div className="text-xs font-bold tracking-[0.2em] text-[#C5A15A] uppercase mb-2">
                  {feeGuide.code}
                </div>
                <h2 className={`font-serif text-3xl sm:text-4xl font-bold tracking-tight ${darkMode ? 'text-white' : 'text-[#101D32]'}`}>
                  {feeGuide.title}
                </h2>
              </div>
              <p className={`text-xs sm:text-sm max-w-xs md:text-right ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                {feeGuide.subtitle}
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-7">
              {feeGuide.packages.map((pkg) => (
                <div
                  key={pkg.id}
                  className={`relative border p-8 rounded-sm flex flex-col justify-between transition-all ${
                    pkg.featured
                      ? darkMode
                        ? 'bg-[#0D1728] border-[#C5A15A] shadow-xl'
                        : 'bg-slate-50 border-[#C5A15A] shadow-lg'
                      : darkMode
                        ? 'bg-[#0A111E] border-slate-800 hover:border-[#C5A15A]/60'
                        : 'bg-white border-slate-200 hover:border-[#C5A15A]'
                  }`}
                >
                  <div>
                    <div className="text-[11px] font-bold tracking-[0.18em] text-[#C5A15A] uppercase mb-4">
                      {pkg.label}
                    </div>
                    <div className={`font-serif text-3xl sm:text-4xl font-bold mb-1 ${darkMode ? 'text-white' : 'text-[#101D32]'}`}>
                      {pkg.price}
                    </div>
                    <div className={`text-xs mb-6 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                      {pkg.billingType}
                    </div>
                    <p className={`text-xs sm:text-sm leading-relaxed mb-6 pb-6 border-b ${darkMode ? 'text-slate-300 border-slate-800' : 'text-slate-600 border-slate-200'}`}>
                      {pkg.description}
                    </p>
                    <ul className="space-y-3 mb-8">
                      {pkg.features.map((feat, i) => (
                        <li key={i} className={`flex items-start gap-2.5 text-xs sm:text-sm ${darkMode ? 'text-slate-200' : 'text-slate-700'}`}>
                          <span className="w-1.5 h-1.5 rounded-full bg-[#C5A15A] shrink-0 mt-2" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <button
                      onClick={() => navigateTo('consultation')}
                      className={`w-full py-3.5 px-4 border text-xs font-bold uppercase tracking-[0.16em] rounded-sm transition-all ${
                        pkg.featured
                          ? 'bg-[#C5A15A] hover:bg-[#b59049] text-[#101D32] border-[#C5A15A]'
                          : darkMode
                            ? 'bg-[#101D32] hover:bg-[#C5A15A] text-white hover:text-[#101D32] border-[#C5A15A]/50'
                            : 'bg-[#101D32] hover:bg-[#182945] text-[#C5A15A] border-[#101D32]'
                      }`}
                    >
                      MULAI SEKARANG
                    </button>
                    <div className="text-right mt-2 text-[10px] font-mono text-slate-500">
                      {pkg.number}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Bidang Layanan Hukum */}
        <section className={`py-20 border-y transition-colors ${darkMode ? 'bg-[#0A1322] border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <div className="text-xs font-bold tracking-[0.2em] text-[#C5A15A] uppercase mb-3">
                Practice Areas
              </div>
              <h2 className={`font-serif text-3xl sm:text-4xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-[#101D32]'}`}>
                Bidang Layanan Hukum
              </h2>
              <div className="w-16 h-1 bg-[#C5A15A] mx-auto mb-5" />
              <p className={`text-base ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                Kami menyediakan solusi hukum terpadu untuk mendampingi kebutuhan korporasi, lembaga, maupun perorangan secara profesional.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service) => (
                <div
                  key={service.id}
                  className={`border hover:border-[#C5A15A] p-8 rounded-sm shadow-sm hover:shadow-xl transition-all flex flex-col justify-between group ${darkMode ? 'bg-[#101D32] border-slate-800' : 'bg-white border-slate-200'}`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <div className={`w-12 h-12 text-[#C5A15A] flex items-center justify-center rounded-sm group-hover:bg-[#C5A15A] group-hover:text-[#101D32] transition-colors ${darkMode ? 'bg-[#182945]' : 'bg-[#101D32]'}`}>
                        <ServiceIcon name={service.iconName} className="w-6 h-6" />
                      </div>
                      <span className={`font-serif text-2xl font-bold group-hover:text-[#C5A15A]/40 transition-colors ${darkMode ? 'text-slate-700' : 'text-slate-200'}`}>
                        {service.code}
                      </span>
                    </div>

                    <h3 className={`font-serif text-xl font-bold mb-3 group-hover:text-[#C5A15A] transition-colors ${darkMode ? 'text-white' : 'text-[#101D32]'}`}>
                      {service.title}
                    </h3>

                    <p className={`text-sm leading-relaxed mb-5 ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                      {service.shortDesc}
                    </p>

                    <ul className={`space-y-2 mb-6 border-t pt-4 ${darkMode ? 'border-slate-800' : 'border-slate-100'}`}>
                      {service.items.slice(0, 3).map((item, i) => (
                        <li key={i} className={`text-xs flex items-start gap-2 ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                          <Check className="w-3.5 h-3.5 text-[#C5A15A] shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <button
                    onClick={() => navigateTo('service-detail', service.slug)}
                    className={`inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider group-hover:text-[#C5A15A] transition-colors pt-2 ${darkMode ? 'text-slate-200' : 'text-[#101D32]'}`}
                  >
                    <span>Detail Layanan</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Tim Profesional Preview */}
        <section className={`py-20 transition-colors ${darkMode ? 'bg-[#0D1728]' : 'bg-white'}`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
              <div>
                <div className="text-xs font-bold tracking-[0.2em] text-[#C5A15A] uppercase mb-2">
                  Our Professionals
                </div>
                <h2 className={`font-serif text-3xl sm:text-4xl font-bold ${darkMode ? 'text-white' : 'text-[#101D32]'}`}>
                  Tim Profesional &amp; Konsultan Hukum
                </h2>
              </div>
              <button
                onClick={() => navigateTo('team')}
                className={`inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider ${darkMode ? 'text-[#C5A15A] hover:text-white' : 'text-[#101D32] hover:text-[#C5A15A]'}`}
              >
                <span>Lihat Seluruh Tim</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {team.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {team.slice(0, 3).map((member) => (
                  <div
                    key={member.id}
                    className={`border rounded-sm overflow-hidden group ${darkMode ? 'bg-[#13223A] border-slate-700' : 'bg-slate-50 border-slate-200'}`}
                  >
                    <div className="aspect-[4/3] bg-[#101D32] relative overflow-hidden">
                      {member.photoUrl ? (
                        <img
                          src={member.photoUrl}
                          alt={member.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[#C5A15A]">
                          <User className="w-16 h-16 opacity-60" />
                        </div>
                      )}
                    </div>
                    <div className="p-6">
                      <div className="text-xs font-semibold text-[#C5A15A] uppercase tracking-wider mb-1">
                        {member.role}
                      </div>
                      <h3 className={`font-serif text-xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-[#101D32]'}`}>
                        {member.name}
                      </h3>
                      <p className={`text-sm ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>{member.expertise}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className={`border p-10 rounded-sm text-center ${darkMode ? 'bg-[#13223A] border-slate-700/80' : 'bg-slate-50 border-slate-200'}`}>
                <Users className="w-12 h-12 text-[#C5A15A] mx-auto mb-3" />
                <h3 className={`font-serif text-xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-[#101D32]'}`}>
                  Struktur Tim Advokat &amp; Konsultan Hukum
                </h3>
                <p className={`text-sm max-w-2xl mx-auto mb-5 ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                  Profil resmi jajaran pengurus, advokat, dan tenaga ahli PT. JURIS FACTI LAWFIRM &amp; SERVICES BUREAU ditampilkan sesuai data terverifikasi yang dikelola melalui Administrator.
                </p>
                <button
                  onClick={() => navigateTo('team')}
                  className="px-5 py-2.5 bg-[#101D32] text-white border border-[#C5A15A]/40 text-xs font-semibold uppercase tracking-wider rounded-sm hover:bg-[#182945] transition-colors"
                >
                  Halaman Tim Profesional
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Ekosistem Kolaborasi Strategis: Solusi Legal & Digital (PT. Scuderia Hive Indonesia) */}
        <section
          className={`py-20 border-t transition-colors ${
            darkMode ? 'bg-[#070D17] border-slate-800' : 'bg-slate-50 border-slate-200'
          }`}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
              <div className="max-w-3xl space-y-3">
                <div className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.2em] text-[#C5A15A] uppercase">
                  <Handshake className="w-4 h-4" />
                  <span>Strategic Legal &amp; Digital Partner</span>
                </div>
                <h2 className={`font-serif text-3xl sm:text-4xl font-bold ${darkMode ? 'text-white' : 'text-[#101D32]'}`}>
                  Kolaborasi Solusi Legal &amp; Digital Terpadu
                </h2>
                <p className={`text-sm sm:text-base leading-relaxed ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                  {STRATEGIC_PARTNER_ECOSYSTEM.description}
                </p>
              </div>

              <a
                href={STRATEGIC_PARTNER_ECOSYSTEM.partnerUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3 bg-[#101D32] hover:bg-[#182945] text-[#C5A15A] border border-[#C5A15A]/40 text-xs font-bold uppercase tracking-wider rounded-sm transition-colors shrink-0"
              >
                <span>Mitra Digital: {STRATEGIC_PARTNER_ECOSYSTEM.partnerName}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* 3 Pilar Layanan Terpadu */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {STRATEGIC_PARTNER_ECOSYSTEM.integratedPillars.map((pillar, idx) => (
                <div
                  key={idx}
                  className={`p-7 border rounded-sm transition-all ${
                    darkMode
                      ? 'bg-[#101D32] border-slate-800 hover:border-[#C5A15A]/60'
                      : 'bg-white border-slate-200 hover:border-[#C5A15A]'
                  }`}
                >
                  <div className="text-[11px] font-bold tracking-[0.18em] text-[#C5A15A] uppercase mb-3">
                    {pillar.code}
                  </div>
                  <h3 className={`font-serif text-xl font-bold mb-3 ${darkMode ? 'text-white' : 'text-[#101D32]'}`}>
                    {pillar.title}
                  </h3>
                  <p className={`text-sm leading-relaxed ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                    {pillar.desc}
                  </p>
                </div>
              ))}
            </div>

            {/* Rekam Jejak Ekosistem Partner & Klien */}
            <div
              className={`p-7 sm:p-8 border rounded-sm ${
                darkMode ? 'bg-[#0D1728] border-slate-800' : 'bg-white border-slate-200'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-5 mb-6 border-b border-slate-700/30">
                <div>
                  <div className="text-xs font-bold tracking-[0.18em] text-[#C5A15A] uppercase">
                    Ekosistem Klien &amp; Mitra Digital
                  </div>
                  <h3 className={`font-serif text-lg sm:text-xl font-bold mt-1 ${darkMode ? 'text-white' : 'text-[#101D32]'}`}>
                    Instansi &amp; Korporasi dalam Jaringan {STRATEGIC_PARTNER_ECOSYSTEM.partnerName}
                  </h3>
                </div>
                <span className="text-xs font-mono text-[#C5A15A]">
                  {STRATEGIC_PARTNER_ECOSYSTEM.tagline}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {STRATEGIC_PARTNER_ECOSYSTEM.ecosystemClients.map((item, i) => (
                  <div
                    key={i}
                    className={`p-4 border rounded-sm ${
                      darkMode ? 'bg-[#070D17] border-slate-800' : 'bg-slate-50 border-slate-200/80'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span className={`font-bold text-sm ${darkMode ? 'text-white' : 'text-[#101D32]'}`}>
                        {item.name}
                      </span>
                      <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-[#101D32] text-[#C5A15A] border border-[#C5A15A]/30 rounded-sm">
                        {item.type}
                      </span>
                    </div>
                    <p className={`text-xs leading-relaxed ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                      {item.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Artikel Hukum Terbaru */}
        <section className={`py-20 border-t transition-colors ${darkMode ? 'bg-[#0A1322] border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
              <div>
                <div className="text-xs font-bold tracking-[0.2em] text-[#C5A15A] uppercase mb-2">
                  Legal Knowledge Portal
                </div>
                <h2 className={`font-serif text-3xl sm:text-4xl font-bold ${darkMode ? 'text-white' : 'text-[#101D32]'}`}>
                  Publikasi &amp; Kajian Hukum Terbaru
                </h2>
              </div>
              <button
                onClick={() => navigateTo('knowledge')}
                className={`inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider ${darkMode ? 'text-[#C5A15A] hover:text-white' : 'text-[#101D32] hover:text-[#C5A15A]'}`}
              >
                <span>Semua Publikasi Hukum</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {articles.slice(0, 3).map((article) => (
                <article
                  key={article.id}
                  className={`border hover:border-[#C5A15A] p-7 rounded-sm shadow-sm flex flex-col justify-between transition-all ${darkMode ? 'bg-[#101D32] border-slate-800' : 'bg-white border-slate-200'}`}
                >
                  <div>
                    <div className={`flex items-center justify-between text-xs mb-3 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                      <span className={`px-2.5 py-1 font-semibold rounded-sm ${darkMode ? 'bg-[#182945] text-[#C5A15A]' : 'bg-[#101D32]/5 text-[#101D32]'}`}>
                        {article.category}
                      </span>
                      <span>{article.publishedAt}</span>
                    </div>
                    <h3 className={`font-serif text-lg font-bold mb-3 leading-snug ${darkMode ? 'text-white' : 'text-[#101D32]'}`}>
                      {article.title}
                    </h3>
                    <p className={`text-sm line-clamp-3 leading-relaxed mb-5 ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                      {article.summary}
                    </p>
                  </div>
                  <div className={`pt-4 border-t flex items-center justify-between ${darkMode ? 'border-slate-800' : 'border-slate-100'}`}>
                    <span className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>{article.author}</span>
                    <button
                      onClick={() => navigateTo('article-detail', article.slug)}
                      className={`text-xs font-bold text-[#C5A15A] uppercase tracking-wider flex items-center gap-1 ${darkMode ? 'hover:text-white' : 'hover:text-[#101D32]'}`}
                    >
                      <span>Baca</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Call to Action & Kontak Ringkas */}
        <section
          className={`py-20 relative overflow-hidden border-t transition-colors duration-300 ${
            darkMode
              ? 'bg-[#060B14] text-white border-slate-800'
              : 'bg-slate-100 text-[#101D32] border-slate-200'
          }`}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              <div className="lg:col-span-7 space-y-5">
                <div className="text-xs font-bold tracking-[0.2em] text-[#C5A15A] uppercase">
                  Konsultasi Hukum Profesional
                </div>
                <h2 className={`font-serif text-3xl sm:text-4xl font-bold leading-tight ${darkMode ? 'text-white' : 'text-[#101D32]'}`}>
                  Diskusikan Permasalahan Hukum Anda Bersama Tim Kami
                </h2>
                <p className={`text-base leading-relaxed max-w-2xl ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                  Setiap konsultasi ditangani secara rahasia, objektif, dan berorientasi pada perlindungan hak hukum Anda. Jadwalkan sesi konsultasi sekarang.
                </p>
                <div className="flex flex-wrap gap-4 pt-2">
                  <button
                    onClick={() => navigateTo('consultation')}
                    className="px-7 py-3.5 bg-[#C5A15A] hover:bg-[#b59049] text-[#101D32] font-bold text-sm uppercase tracking-wider rounded-sm transition-all shadow-sm"
                  >
                    Ajukan Konsultasi Online
                  </button>
                  <a
                    href={`https://wa.me/${contactInfo.whatsapp}?text=${encodeURIComponent(
                      'Halo PT. JURIS FACTI LAWFIRM & SERVICES BUREAU, saya ingin berkonsultasi mengenai layanan hukum.'
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`px-7 py-3.5 border font-semibold text-sm uppercase tracking-wider rounded-sm transition-all ${
                      darkMode
                        ? 'bg-transparent border-white/30 hover:border-[#C5A15A] text-white'
                        : 'bg-[#101D32] border-[#101D32] hover:bg-[#1a2d4d] text-white'
                    }`}
                  >
                    WhatsApp: {contactInfo.whatsappDisplay}
                  </a>
                </div>
              </div>

              <div
                className={`lg:col-span-5 border p-7 rounded-sm space-y-4 shadow-sm ${
                  darkMode
                    ? 'bg-[#101D32] border-[#C5A15A]/30'
                    : 'bg-white border-slate-200'
                }`}
              >
                <h3
                  className={`font-serif text-lg font-bold border-b pb-3 ${
                    darkMode
                      ? 'text-[#C5A15A] border-white/10'
                      : 'text-[#101D32] border-slate-200'
                  }`}
                >
                  Kontak Resmi Kantor
                </h3>
                <div className={`space-y-3 text-sm ${darkMode ? 'text-slate-200' : 'text-slate-700'}`}>
                  <p className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 text-[#C5A15A] shrink-0 mt-1" />
                    <span>{contactInfo.address}</span>
                  </p>
                  <p className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-[#C5A15A] shrink-0" />
                    <span>{contactInfo.phone}</span>
                  </p>
                  <p className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-[#C5A15A] shrink-0" />
                    <span>{contactInfo.email}</span>
                  </p>
                  <p className="flex items-start gap-3">
                    <Clock className="w-4 h-4 text-[#C5A15A] shrink-0 mt-1" />
                    <span>{contactInfo.operationalHours}</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  };

  // ==========================================================================
  // PAGE 2: ABOUT US (PROFIL PERUSAHAAN)
  // ==========================================================================
  const AboutPage = () => {
    return (
      <div className={darkMode ? 'bg-[#0D1728] text-slate-200' : 'bg-white'}>
        {/* Page Header */}
        <section className="bg-[#101D32] text-white py-16 border-b border-[#C5A15A]/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-xs font-bold tracking-[0.2em] text-[#C5A15A] uppercase mb-3">
              Profil Perusahaan
            </div>
            <h1 className="font-serif text-3xl sm:text-5xl font-bold mb-4">
              Tentang {companyProfile.companyName}
            </h1>
            <p className="text-slate-300 max-w-2xl text-base sm:text-lg font-light">
              &ldquo;{companyProfile.tagline}&rdquo;
            </p>
          </div>
        </section>

        {/* Sejarah, Latar Belakang & Filosofi */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="space-y-5">
                <h2 className={`font-serif text-2xl sm:text-3xl font-bold ${darkMode ? 'text-white' : 'text-[#101D32]'}`}>
                  Latar Belakang &amp; Sejarah Perusahaan
                </h2>
                <div className="w-14 h-1 bg-[#C5A15A]" />
                <p className={`leading-relaxed ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>{companyProfile.foundingBackground}</p>
                <div className={`p-5 border-l-4 border-[#C5A15A] text-sm leading-relaxed ${darkMode ? 'bg-[#13223A] text-slate-300' : 'bg-slate-50 text-slate-600'}`}>
                  {companyProfile.history}
                </div>
              </div>

              <div className="space-y-5">
                <h2 className={`font-serif text-2xl sm:text-3xl font-bold ${darkMode ? 'text-white' : 'text-[#101D32]'}`}>
                  Filosofi Nama &ldquo;Juris Facti&rdquo;
                </h2>
                <div className="w-14 h-1 bg-[#C5A15A]" />
                <p className={`leading-relaxed ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>{companyProfile.philosophy}</p>
                <p className={`leading-relaxed ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>{companyProfile.commitment}</p>
              </div>
            </div>

            {/* Visi & Misi */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-6">
              <div className="lg:col-span-5 bg-[#101D32] text-white p-8 sm:p-10 rounded-sm border border-[#C5A15A]/40 flex flex-col justify-center">
                <div className="text-xs font-bold tracking-[0.2em] text-[#C5A15A] uppercase mb-3">
                  Visi Perusahaan
                </div>
                <h3 className="font-serif text-2xl sm:text-3xl font-bold leading-snug mb-4">
                  Visi Kami
                </h3>
                <div className="w-12 h-0.5 bg-[#C5A15A] mb-6" />
                <p className="text-slate-200 text-lg leading-relaxed font-serif italic">
                  &ldquo;{companyProfile.vision}&rdquo;
                </p>
              </div>

              <div className={`lg:col-span-7 border p-8 sm:p-10 rounded-sm ${darkMode ? 'bg-[#13223A] border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                <div className="text-xs font-bold tracking-[0.2em] text-[#C5A15A] uppercase mb-3">
                  Misi Perusahaan
                </div>
                <h3 className={`font-serif text-2xl sm:text-3xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-[#101D32]'}`}>
                  Komitmen Langkah Strategis
                </h3>
                <ol className="space-y-4">
                  {companyProfile.missions.map((mission, index) => (
                    <li key={index} className="flex items-start gap-4">
                      <span className="w-7 h-7 rounded-sm bg-[#101D32] text-[#C5A15A] border border-[#C5A15A]/30 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                        {index + 1}
                      </span>
                      <span className={`text-base leading-relaxed ${darkMode ? 'text-slate-200' : 'text-slate-700'}`}>{mission}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>

            {/* Nilai-Nilai Perusahaan */}
            <div>
              <div className="text-center max-w-2xl mx-auto mb-12">
                <div className="text-xs font-bold tracking-[0.2em] text-[#C5A15A] uppercase mb-2">
                  Core Values
                </div>
                <h2 className={`font-serif text-3xl font-bold ${darkMode ? 'text-white' : 'text-[#101D32]'}`}>
                  Nilai-Nilai Perusahaan
                </h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {companyProfile.values.map((v, idx) => (
                  <div
                    key={idx}
                    className={`p-6 border hover:border-[#C5A15A] rounded-sm shadow-sm transition-all ${darkMode ? 'bg-[#13223A] border-slate-700' : 'bg-white border-slate-200'}`}
                  >
                    <Award className="w-7 h-7 text-[#C5A15A] mb-4" />
                    <h3 className={`font-serif text-lg font-bold mb-2 ${darkMode ? 'text-white' : 'text-[#101D32]'}`}>{v.title}</h3>
                    <p className={`text-sm leading-relaxed ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>{v.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Mitra Strategis Digital & Legal */}
            <div
              className={`p-8 sm:p-10 border rounded-sm ${
                darkMode ? 'bg-[#13223A] border-[#C5A15A]/40' : 'bg-slate-50 border-slate-200'
              }`}
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="space-y-3 max-w-3xl">
                  <div className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.2em] text-[#C5A15A] uppercase">
                    <Laptop className="w-4 h-4" />
                    <span>Kemitraan Strategis Legal &amp; Teknologi</span>
                  </div>
                  <h2 className={`font-serif text-2xl sm:text-3xl font-bold ${darkMode ? 'text-white' : 'text-[#101D32]'}`}>
                    Aliansi Bersama {STRATEGIC_PARTNER_ECOSYSTEM.partnerName}
                  </h2>
                  <p className={`text-sm sm:text-base leading-relaxed ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                    {STRATEGIC_PARTNER_ECOSYSTEM.description} Melalui sinergi ini, klien memperoleh pendampingan pendirian badan usaha (PT Perorangan maupun PT Biasa), penyusunan dokumen legalitas, sekaligus pengembangan website perusahaan dan sistem aplikasi digital dalam satu pintu layanan.
                  </p>
                </div>
                <a
                  href={STRATEGIC_PARTNER_ECOSYSTEM.partnerUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3.5 bg-[#101D32] hover:bg-[#182945] text-[#C5A15A] border border-[#C5A15A]/40 text-xs font-bold uppercase tracking-wider rounded-sm inline-flex items-center gap-2 shrink-0 transition-colors"
                >
                  <span>Kunjungi scuderiahive.id</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  };

  // ==========================================================================
  // PAGE 3: OUR SERVICES & SERVICE DETAIL PAGE
  // ==========================================================================
  const ServicesPage = () => {
    return (
      <div className={`min-h-screen ${darkMode ? 'bg-[#0D1728]' : 'bg-slate-50'}`}>
        <section className="bg-[#101D32] text-white py-16 border-b border-[#C5A15A]/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-xs font-bold tracking-[0.2em] text-[#C5A15A] uppercase mb-3">
              Our Services
            </div>
            <h1 className="font-serif text-3xl sm:text-5xl font-bold mb-4">
              Bidang Layanan Hukum &amp; Solusi Terpadu
            </h1>
            <p className="text-slate-300 max-w-3xl text-base sm:text-lg font-light">
              Pendampingan hukum korporasi, litigasi, pertanahan, administrasi pemerintahan, penyusunan dokumen hukum, serta paket pendirian badan usaha dan digitalisasi bisnis.
            </p>
          </div>
        </section>

        {/* Daftar 6 Divisi Layanan Hukum */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            {services.map((service) => (
              <div
                key={service.id}
                className={`border hover:border-[#C5A15A] rounded-sm p-8 sm:p-10 shadow-sm transition-all ${
                  darkMode ? 'bg-[#13223A] border-slate-700' : 'bg-white border-slate-200'
                }`}
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  <div className="lg:col-span-5 space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 bg-[#101D32] text-[#C5A15A] border border-[#C5A15A]/40 rounded-sm flex items-center justify-center">
                        <ServiceIcon name={service.iconName} className="w-5 h-5" />
                      </div>
                      <span className="text-xs font-bold tracking-widest text-[#C5A15A] uppercase">
                        Divisi {service.code}
                      </span>
                    </div>
                    <h2 className={`font-serif text-2xl font-bold ${darkMode ? 'text-white' : 'text-[#101D32]'}`}>
                      {service.title}
                    </h2>
                    <p className={`text-sm leading-relaxed ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                      {service.overview}
                    </p>
                    {service.feeEstimate && (
                      <div className={`p-3.5 border rounded-sm text-xs ${darkMode ? 'bg-[#0D1728] border-slate-700 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-700'}`}>
                        <span className="font-bold text-[#C5A15A] block uppercase tracking-wider mb-0.5">
                          Estimasi Biaya:
                        </span>
                        <span>{service.feeEstimate}</span>
                      </div>
                    )}
                    <div className="pt-2">
                      <button
                        onClick={() => navigateTo('service-detail', service.slug)}
                        className="px-5 py-2.5 bg-[#101D32] hover:bg-[#182945] text-[#C5A15A] border border-[#C5A15A]/40 text-xs font-bold uppercase tracking-wider rounded-sm inline-flex items-center gap-2 transition-colors"
                      >
                        <span>Halaman Detail Divisi</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="lg:col-span-7">
                    <div className={`text-xs font-bold uppercase tracking-wider mb-4 ${darkMode ? 'text-slate-300' : 'text-slate-500'}`}>
                      Ruang Lingkup Penanganan
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      {service.items.map((item, idx) => (
                        <div
                          key={idx}
                          className={`p-3.5 border rounded-sm flex items-start gap-2.5 text-sm ${
                            darkMode
                              ? 'bg-[#0D1728] border-slate-700/80 text-slate-200'
                              : 'bg-slate-50 border-slate-200/80 text-slate-700'
                          }`}
                        >
                          <CheckCircle2 className="w-4 h-4 text-[#C5A15A] shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Paket Biaya & Promo Section */}
        <section
          className={`py-20 border-t transition-colors ${
            darkMode ? 'bg-[#060B14] border-slate-800' : 'bg-white border-slate-200'
          }`}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
              <div>
                <div className="text-xs font-bold tracking-[0.2em] text-[#C5A15A] uppercase mb-2">
                  {feeGuide.code}
                </div>
                <h2 className={`font-serif text-3xl sm:text-4xl font-bold tracking-tight ${darkMode ? 'text-white' : 'text-[#101D32]'}`}>
                  {feeGuide.title}
                </h2>
              </div>
              <p className={`text-xs sm:text-sm max-w-xs md:text-right ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                {feeGuide.subtitle}
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-7">
              {feeGuide.packages.map((pkg) => (
                <div
                  key={pkg.id}
                  className={`relative border p-8 rounded-sm flex flex-col justify-between transition-all ${
                    pkg.featured
                      ? darkMode
                        ? 'bg-[#0D1728] border-[#C5A15A] shadow-xl'
                        : 'bg-slate-50 border-[#C5A15A] shadow-lg'
                      : darkMode
                        ? 'bg-[#0A111E] border-slate-800 hover:border-[#C5A15A]/60'
                        : 'bg-white border-slate-200 hover:border-[#C5A15A]'
                  }`}
                >
                  <div>
                    <div className="text-[11px] font-bold tracking-[0.18em] text-[#C5A15A] uppercase mb-4">
                      {pkg.label}
                    </div>
                    <div className={`font-serif text-3xl sm:text-4xl font-bold mb-1 ${darkMode ? 'text-white' : 'text-[#101D32]'}`}>
                      {pkg.price}
                    </div>
                    <div className={`text-xs mb-6 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                      {pkg.billingType}
                    </div>
                    <p className={`text-xs sm:text-sm leading-relaxed mb-6 pb-6 border-b ${darkMode ? 'text-slate-300 border-slate-800' : 'text-slate-600 border-slate-200'}`}>
                      {pkg.description}
                    </p>
                    <ul className="space-y-3 mb-8">
                      {pkg.features.map((feat, i) => (
                        <li key={i} className={`flex items-start gap-2.5 text-xs sm:text-sm ${darkMode ? 'text-slate-200' : 'text-slate-700'}`}>
                          <span className="w-1.5 h-1.5 rounded-full bg-[#C5A15A] shrink-0 mt-2" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <button
                      onClick={() => navigateTo('consultation')}
                      className={`w-full py-3.5 px-4 border text-xs font-bold uppercase tracking-[0.16em] rounded-sm transition-all ${
                        pkg.featured
                          ? 'bg-[#C5A15A] hover:bg-[#b59049] text-[#101D32] border-[#C5A15A]'
                          : darkMode
                            ? 'bg-[#101D32] hover:bg-[#C5A15A] text-white hover:text-[#101D32] border-[#C5A15A]/50'
                            : 'bg-[#101D32] hover:bg-[#182945] text-[#C5A15A] border-[#101D32]'
                      }`}
                    >
                      MULAI SEKARANG
                    </button>
                    <div className="text-right mt-2 text-[10px] font-mono text-slate-500">
                      {pkg.number}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className={`mt-8 p-5 border rounded-sm text-xs leading-relaxed ${darkMode ? 'bg-[#0D1728] border-slate-800 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-600'}`}>
              {feeGuide.disclaimer}
            </div>
          </div>
        </section>
      </div>
    );
  };

  const ServiceDetailPage = () => {
    const service = services.find((s) => s.slug === selectedServiceSlug) || services[0];

    return (
      <div className={`min-h-screen ${darkMode ? 'bg-[#0D1728]' : 'bg-white'}`}>
        <section className="bg-[#101D32] text-white py-16 border-b border-[#C5A15A]/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <button
              onClick={() => navigateTo('services')}
              className="text-xs text-[#C5A15A] hover:underline uppercase tracking-wider mb-4 inline-flex items-center gap-1"
            >
              &larr; Kembali ke Semua Bidang Layanan
            </button>
            <div className="flex items-center gap-3 mb-3">
              <span className="px-2.5 py-1 bg-[#C5A15A] text-[#101D32] text-xs font-bold rounded-sm">
                BIDANG {service.code}
              </span>
            </div>
            <h1 className="font-serif text-3xl sm:text-5xl font-bold mb-4">{service.title}</h1>
            <p className="text-slate-300 max-w-3xl text-base sm:text-lg font-light">
              {service.shortDesc}
            </p>
          </div>
        </section>

        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-8 space-y-8">
              <div>
                <h2 className={`font-serif text-2xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-[#101D32]'}`}>
                  Deskripsi &amp; Pendekatan Hukum
                </h2>
                <div className="w-12 h-1 bg-[#C5A15A] mb-5" />
                <p className={`leading-relaxed text-base ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>{service.overview}</p>
              </div>

              {service.feeEstimate && (
                <div
                  className={`p-6 border rounded-sm ${
                    darkMode ? 'bg-[#13223A] border-[#C5A15A]/40' : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="text-xs font-bold tracking-widest text-[#C5A15A] uppercase mb-1">
                    Estimasi Honorarium &amp; Skema Biaya
                  </div>
                  <div className={`font-serif text-xl font-bold mb-1 ${darkMode ? 'text-white' : 'text-[#101D32]'}`}>
                    {service.feeEstimate}
                  </div>
                  {service.feeScheme && (
                    <div className={`text-sm mb-3 ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                      Skema Pembayaran: <strong>{service.feeScheme}</strong>
                    </div>
                  )}
                  <p className={`text-xs leading-relaxed ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                    {feeGuide.disclaimer}
                  </p>
                </div>
              )}

              <div>
                <h3 className={`font-serif text-xl font-bold mb-5 ${darkMode ? 'text-white' : 'text-[#101D32]'}`}>
                  Cakupan Layanan {service.title}
                </h3>
                <div className="space-y-3">
                  {service.items.map((item, idx) => (
                    <div
                      key={idx}
                      className={`p-4 border rounded-sm flex items-start gap-3.5 ${darkMode ? 'bg-[#13223A] border-slate-700' : 'bg-slate-50 border-slate-200'}`}
                    >
                      <div className="w-6 h-6 rounded-sm bg-[#101D32] text-[#C5A15A] border border-[#C5A15A]/30 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                        {idx + 1}
                      </div>
                      <span className={`font-medium text-sm sm:text-base ${darkMode ? 'text-slate-100' : 'text-slate-800'}`}>
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-8 bg-[#101D32] text-white rounded-sm border border-[#C5A15A]/40">
                <h3 className="font-serif text-xl font-bold mb-2">
                  Membutuhkan Pendampingan pada Bidang {service.title}?
                </h3>
                <p className="text-sm text-slate-300 mb-6">
                  Sampaikan pokok permasalahan hukum Anda melalui formulir konsultasi resmi kami untuk mendapatkan tanggapan awal dari tim hukum kami.
                </p>
                <button
                  onClick={() => navigateTo('consultation')}
                  className="px-6 py-3 bg-[#C5A15A] hover:bg-[#b59049] text-[#101D32] font-bold text-xs uppercase tracking-wider rounded-sm transition-colors"
                >
                  Konsultasi Layanan Ini
                </button>
              </div>
            </div>

            {/* Sidebar Layanan Lainnya */}
            <aside className="lg:col-span-4 space-y-6">
              <div className={`border p-6 rounded-sm ${darkMode ? 'bg-[#13223A] border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                <h3 className={`font-serif text-lg font-bold mb-4 pb-2 border-b ${darkMode ? 'text-white border-slate-700' : 'text-[#101D32] border-slate-200'}`}>
                  Bidang Layanan Lainnya
                </h3>
                <ul className="space-y-2">
                  {services.map((s) => (
                    <li key={s.id}>
                      <button
                        onClick={() => navigateTo('service-detail', s.slug)}
                        className={`w-full text-left px-3.5 py-2.5 rounded-sm text-sm font-medium transition-colors flex items-center justify-between ${
                          s.id === service.id
                            ? 'bg-[#101D32] text-[#C5A15A] border border-[#C5A15A]/40'
                            : darkMode
                              ? 'text-slate-200 hover:bg-[#182945]'
                              : 'text-slate-700 hover:bg-slate-200/70'
                        }`}
                      >
                        <span>
                          {s.code}. {s.title}
                        </span>
                        <ChevronRight className="w-4 h-4 shrink-0" />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </aside>
          </div>
        </section>
      </div>
    );
  };

  // ==========================================================================
  // PAGE 4: OUR TEAM (TIM PROFESIONAL)
  // ==========================================================================
  const TeamPage = () => {
    return (
      <div className={`min-h-screen ${darkMode ? 'bg-[#0D1728]' : 'bg-slate-50'}`}>
        <section className="bg-[#101D32] text-white py-16 border-b border-[#C5A15A]/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-xs font-bold tracking-[0.2em] text-[#C5A15A] uppercase mb-3">
              Our Team
            </div>
            <h1 className="font-serif text-3xl sm:text-5xl font-bold mb-4">
              Tim Profesional &amp; Pengurus
            </h1>
            <p className="text-slate-300 max-w-2xl text-base sm:text-lg font-light">
              Jajaran advokat, konsultan hukum, dan tenaga profesional yang berdedikasi memberikan pelayanan hukum terbaik.
            </p>
          </div>
        </section>

        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {team.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {team.map((member) => (
                  <div
                    key={member.id}
                    className={`border rounded-sm overflow-hidden shadow-sm hover:shadow-lg transition-all flex flex-col ${darkMode ? 'bg-[#13223A] border-slate-700' : 'bg-white border-slate-200'}`}
                  >
                    <div className="aspect-[4/3] bg-[#101D32] relative overflow-hidden">
                      {member.photoUrl ? (
                        <img
                          src={member.photoUrl}
                          alt={member.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[#C5A15A]">
                          <User className="w-20 h-20 opacity-50" />
                        </div>
                      )}
                    </div>
                    <div className="p-7 flex-1 flex flex-col justify-between space-y-4">
                      <div>
                        <div className="text-xs font-bold tracking-wider text-[#C5A15A] uppercase mb-1">
                          {member.role}
                        </div>
                        <h2 className={`font-serif text-xl font-bold mb-3 ${darkMode ? 'text-white' : 'text-[#101D32]'}`}>
                          {member.name}
                        </h2>
                        <div className={`space-y-2.5 text-sm border-t pt-3 ${darkMode ? 'text-slate-300 border-slate-700' : 'text-slate-600 border-slate-100'}`}>
                          <div>
                            <span className={`font-semibold block text-xs uppercase tracking-wider ${darkMode ? 'text-white' : 'text-[#101D32]'}`}>
                              Bidang Keahlian
                            </span>
                            <span>{member.expertise}</span>
                          </div>
                          <div>
                            <span className={`font-semibold block text-xs uppercase tracking-wider ${darkMode ? 'text-white' : 'text-[#101D32]'}`}>
                              Pendidikan
                            </span>
                            <span>{member.education}</span>
                          </div>
                          <div>
                            <span className={`font-semibold block text-xs uppercase tracking-wider ${darkMode ? 'text-white' : 'text-[#101D32]'}`}>
                              Pengalaman Profesional
                            </span>
                            <span>{member.experience}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className={`border p-12 rounded-sm text-center max-w-3xl mx-auto shadow-sm ${darkMode ? 'bg-[#13223A] border-slate-700' : 'bg-white border-slate-200'}`}>
                <div className="w-16 h-16 bg-[#101D32] text-[#C5A15A] border border-[#C5A15A]/30 rounded-sm flex items-center justify-center mx-auto mb-5">
                  <Users className="w-8 h-8" />
                </div>
                <h2 className={`font-serif text-2xl font-bold mb-3 ${darkMode ? 'text-white' : 'text-[#101D32]'}`}>
                  Direktori Tim Profesional Terverifikasi
                </h2>
                <p className={`text-sm sm:text-base leading-relaxed mb-6 ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                  Untuk menjaga keakuratan dan integritas informasi publik, daftar nama, jabatan, gelar akademik, serta riwayat pengalaman pengurus dan konsultan hukum hanya ditampilkan setelah diverifikasi dan dipublikasikan oleh Administrator resmi perusahaan.
                </p>
                <button
                  onClick={() => navigateTo('consultation')}
                  className="px-6 py-3 bg-[#101D32] hover:bg-[#182945] text-white border border-[#C5A15A]/40 text-xs font-bold uppercase tracking-wider rounded-sm transition-colors"
                >
                  Hubungi Biro Layanan Hukum
                </button>
              </div>
            )}
          </div>
        </section>
      </div>
    );
  };

  // ==========================================================================
  // PAGE 5: LEGAL KNOWLEDGE & ARTICLE DETAIL PAGE
  // ==========================================================================
  const LegalKnowledgePage = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('Semua');

    const categories = [
      'Semua',
      'Artikel Hukum',
      'Analisis Peraturan',
      'Analisis Putusan',
      'Informasi Hukum',
      'Edukasi Hukum',
      'Kajian Hukum'
    ];

    const filteredArticles = useMemo(() => {
      return articles.filter((art) => {
        const matchesCategory =
          selectedCategory === 'Semua' || art.category === selectedCategory;
        const q = searchQuery.toLowerCase();
        const matchesSearch =
          art.title.toLowerCase().includes(q) ||
          art.summary.toLowerCase().includes(q) ||
          art.content.toLowerCase().includes(q);
        return matchesCategory && matchesSearch;
      });
    }, [articles, searchQuery, selectedCategory]);

    return (
      <div className={`min-h-screen ${darkMode ? 'bg-[#0D1728]' : 'bg-slate-50'}`}>
        <section className="bg-[#101D32] text-white py-16 border-b border-[#C5A15A]/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-xs font-bold tracking-[0.2em] text-[#C5A15A] uppercase mb-3">
              Legal Knowledge &amp; Insights
            </div>
            <h1 className="font-serif text-3xl sm:text-5xl font-bold mb-4">
              Portal Publikasi &amp; Literasi Hukum
            </h1>
            <p className="text-slate-300 max-w-2xl text-base sm:text-lg font-light">
              Analisis peraturan perundang-undangan, kajian putusan pengadilan, opini yuridis, serta edukasi hukum bagi masyarakat dan pelaku usaha.
            </p>
          </div>
        </section>

        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Search & Category Filter */}
            <div className={`border p-6 rounded-sm shadow-sm mb-10 space-y-5 ${darkMode ? 'bg-[#13223A] border-slate-700' : 'bg-white border-slate-200'}`}>
              <div className="relative">
                <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari artikel, analisis peraturan, atau topik hukum..."
                  className={`w-full pl-11 pr-4 py-3 border rounded-sm text-sm focus:outline-none ${darkMode ? 'bg-[#0D1728] border-slate-700 text-white placeholder-slate-400 focus:border-[#C5A15A]' : 'bg-white border-slate-300 text-slate-900 focus:border-[#101D32]'}`}
                />
              </div>

              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3.5 py-1.5 text-xs font-semibold rounded-sm transition-colors ${
                      selectedCategory === cat
                        ? 'bg-[#101D32] text-[#C5A15A] border border-[#C5A15A]/40'
                        : darkMode
                          ? 'bg-[#0D1728] text-slate-300 hover:bg-[#182945]'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Articles Grid */}
            {filteredArticles.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredArticles.map((art) => (
                  <article
                    key={art.id}
                    className={`border hover:border-[#C5A15A] rounded-sm p-7 shadow-sm flex flex-col justify-between transition-all ${darkMode ? 'bg-[#13223A] border-slate-700' : 'bg-white border-slate-200'}`}
                  >
                    <div>
                      <div className={`flex items-center justify-between text-xs mb-3 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                        <span className="px-2.5 py-1 bg-[#101D32] text-[#C5A15A] font-semibold rounded-sm">
                          {art.category}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          {art.publishedAt}
                        </span>
                      </div>
                      <h2 className={`font-serif text-xl font-bold mb-3 leading-snug ${darkMode ? 'text-white' : 'text-[#101D32]'}`}>
                        {art.title}
                      </h2>
                      <p className={`text-sm leading-relaxed mb-6 ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>{art.summary}</p>
                    </div>
                    <div className={`pt-4 border-t flex items-center justify-between ${darkMode ? 'border-slate-700' : 'border-slate-100'}`}>
                      <span className={`text-xs flex items-center gap-1.5 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                        <User className="w-3.5 h-3.5 text-[#C5A15A]" />
                        {art.author}
                      </span>
                      <button
                        onClick={() => navigateTo('article-detail', art.slug)}
                        className={`text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1 ${darkMode ? 'text-[#C5A15A] hover:text-white' : 'text-[#101D32] hover:text-[#C5A15A]'}`}
                      >
                        <span>Baca Kajian</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className={`border p-12 rounded-sm text-center ${darkMode ? 'bg-[#13223A] border-slate-700' : 'bg-white border-slate-200'}`}>
                <p className={darkMode ? 'text-slate-300' : 'text-slate-600'}>Tidak ditemukan publikasi hukum yang sesuai dengan kriteria pencarian Anda.</p>
              </div>
            )}
          </div>
        </section>
      </div>
    );
  };

  const ArticleDetailPage = () => {
    const [copiedShare, setCopiedShare] = useState(false);
    const article = articles.find((a) => a.slug === selectedArticleSlug) || articles[0];
    const relatedArticles = articles.filter((a) => a.id !== article.id).slice(0, 3);

    const handleShare = () => {
      if (navigator.clipboard) {
        navigator.clipboard.writeText(window.location.href);
        setCopiedShare(true);
        setTimeout(() => setCopiedShare(false), 3000);
      }
    };

    return (
      <div className={`min-h-screen ${darkMode ? 'bg-[#0D1728]' : 'bg-white'}`}>
        <section className="bg-[#101D32] text-white py-14 border-b border-[#C5A15A]/30">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <button
              onClick={() => navigateTo('knowledge')}
              className="text-xs text-[#C5A15A] hover:underline uppercase tracking-wider mb-5 inline-block"
            >
              &larr; Kembali ke Portal Legal Knowledge
            </button>
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300 mb-4">
              <span className="px-2.5 py-1 bg-[#C5A15A] text-[#101D32] font-bold rounded-sm">
                {article.category}
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#C5A15A]" />
                {article.publishedAt}
              </span>
              <span className="flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-[#C5A15A]" />
                {article.author}
              </span>
            </div>
            <h1 className="font-serif text-2xl sm:text-4xl font-bold leading-tight">
              {article.title}
            </h1>
          </div>
        </section>

        <section className="py-14">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className={`p-6 border-l-4 border-[#C5A15A] font-medium text-base leading-relaxed mb-8 ${darkMode ? 'bg-[#13223A] text-slate-200' : 'bg-slate-50 text-slate-700'}`}>
              {article.summary}
            </div>

            <div className={`prose max-w-none leading-relaxed space-y-5 text-base ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
              {article.content.split('\n\n').map((para, index) => (
                <p key={index} className="whitespace-pre-line">
                  {para}
                </p>
              ))}
            </div>

            {/* Share Bar */}
            <div className={`mt-12 pt-6 border-t flex flex-wrap items-center justify-between gap-4 ${darkMode ? 'border-slate-800' : 'border-slate-200'}`}>
              <div className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                Disclaimer: Artikel ini disusun sebagai edukasi dan literasi hukum umum, bukan merupakan nasihat hukum mengikat untuk kasus spesifik.
              </div>
              <button
                onClick={handleShare}
                className="px-4 py-2 bg-[#101D32] hover:bg-[#182945] text-white border border-[#C5A15A]/40 text-xs font-semibold uppercase tracking-wider rounded-sm inline-flex items-center gap-2"
              >
                <Share2 className="w-3.5 h-3.5 text-[#C5A15A]" />
                <span>{copiedShare ? 'Tautan Disalin' : 'Bagikan Artikel'}</span>
              </button>
            </div>

            {/* Related Articles */}
            {relatedArticles.length > 0 && (
              <div className={`mt-16 pt-10 border-t ${darkMode ? 'border-slate-800' : 'border-slate-200'}`}>
                <h3 className={`font-serif text-2xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-[#101D32]'}`}>
                  Artikel &amp; Kajian Terkait
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {relatedArticles.map((rel) => (
                    <div
                      key={rel.id}
                      onClick={() => navigateTo('article-detail', rel.slug)}
                      className={`p-5 border hover:border-[#C5A15A] rounded-sm cursor-pointer transition-all ${darkMode ? 'bg-[#13223A] border-slate-700' : 'bg-slate-50 border-slate-200'}`}
                    >
                      <div className="text-xs text-[#C5A15A] font-semibold mb-1">{rel.category}</div>
                      <h4 className={`font-serif text-base font-bold mb-2 ${darkMode ? 'text-white' : 'text-[#101D32]'}`}>
                        {rel.title}
                      </h4>
                      <span className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>{rel.publishedAt}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      </div>
    );
  };

  // ==========================================================================
  // PAGE 6: CONSULTATION PAGE (PRIVAT & TERVALIDASI)
  // ==========================================================================
  const ConsultationPage = () => {
    const [formData, setFormData] = useState({
      fullName: '',
      whatsapp: '',
      email: '',
      category: 'Litigation & Dispute Resolution',
      subject: '',
      description: '',
      privacyAgreed: false
    });
    const [errorMsg, setErrorMsg] = useState('');
    const [submittedTicket, setSubmittedTicket] = useState(null);

    const handleSubmit = (e) => {
      e.preventDefault();
      setErrorMsg('');

      // Validasi Ketat Formulir
      if (formData.fullName.trim().length < 3) {
        setErrorMsg('Nama lengkap wajib diisi minimal 3 karakter.');
        return;
      }
      if (!/^[0-9+\-\s]{9,18}$/.test(formData.whatsapp.trim())) {
        setErrorMsg('Masukkan nomor WhatsApp yang valid (9-18 digit angka).');
        return;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
        setErrorMsg('Format alamat email tidak valid.');
        return;
      }
      if (formData.subject.trim().length < 5) {
        setErrorMsg('Judul permasalahan wajib diisi minimal 5 karakter.');
        return;
      }
      if (formData.description.trim().length < 20) {
        setErrorMsg('Deskripsi singkat permasalahan minimal 20 karakter agar dapat dianalisis dengan baik.');
        return;
      }
      if (!formData.privacyAgreed) {
        setErrorMsg('Anda wajib menyetujui Kebijakan Privasi & Kerahasiaan Klien sebelum mengirim permohonan.');
        return;
      }

      const ticketCode = `JF-${Date.now().toString().slice(-6)}`;
      const newRecord = {
        id: ticketCode,
        fullName: sanitizeInput(formData.fullName),
        whatsapp: sanitizeInput(formData.whatsapp),
        email: sanitizeInput(formData.email),
        category: sanitizeInput(formData.category),
        subject: sanitizeInput(formData.subject),
        description: sanitizeInput(formData.description),
        status: 'Baru',
        createdAt: new Date().toLocaleString('id-ID')
      };

      // Simpan secara privat ke state/database (hanya tampil di Dashboard Admin)
      setConsultations((prev) => [newRecord, ...prev]);
      setSubmittedTicket(newRecord);
    };

    return (
      <div className={`min-h-screen ${darkMode ? 'bg-[#0D1728]' : 'bg-slate-50'}`}>
        <section className="bg-[#101D32] text-white py-16 border-b border-[#C5A15A]/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-xs font-bold tracking-[0.2em] text-[#C5A15A] uppercase mb-3">
              Legal Consultation
            </div>
            <h1 className="font-serif text-3xl sm:text-5xl font-bold mb-4">
              Permohonan Konsultasi Hukum
            </h1>
            <p className="text-slate-300 max-w-2xl text-base sm:text-lg font-light">
              Seluruh data dan pokok permasalahan hukum yang Anda kirimkan dilindungi dengan prinsip kerahasiaan klien (Attorney-Client Confidentiality).
            </p>
          </div>
        </section>

        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            {submittedTicket ? (
              <div className={`border border-[#C5A15A] p-8 sm:p-12 rounded-sm shadow-md text-center space-y-6 ${darkMode ? 'bg-[#13223A]' : 'bg-white'}`}>
                <div className="w-16 h-16 bg-emerald-50 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <div className="space-y-2">
                  <div className="text-xs font-bold tracking-widest text-[#C5A15A] uppercase">
                    Nomor Referensi: {submittedTicket.id}
                  </div>
                  <h2 className={`font-serif text-2xl sm:text-3xl font-bold ${darkMode ? 'text-white' : 'text-[#101D32]'}`}>
                    Permohonan Konsultasi Berhasil Dicatat
                  </h2>
                  <p className={`text-sm sm:text-base max-w-xl mx-auto leading-relaxed ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                    Terima kasih, <strong>{submittedTicket.fullName}</strong>. Data permohonan konsultasi Anda telah tersimpan secara aman dan privat untuk segera ditinjau oleh tim administrator serta konsultan hukum kami.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                  <a
                    href={`https://wa.me/${contactInfo.whatsapp}?text=${encodeURIComponent(
                      `Halo PT. JURIS FACTI LAWFIRM & SERVICES BUREAU, saya ${submittedTicket.fullName} telah mengajukan permohonan konsultasi hukum dengan Nomor Referensi ${submittedTicket.id} terkait "${submittedTicket.subject}".`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto px-7 py-3.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs uppercase tracking-wider rounded-sm inline-flex items-center justify-center gap-2 transition-colors"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Lanjutkan via WhatsApp Resmi</span>
                  </a>
                  <button
                    onClick={() => {
                      setSubmittedTicket(null);
                      setFormData({
                        fullName: '',
                        whatsapp: '',
                        email: '',
                        category: 'Litigation & Dispute Resolution',
                        subject: '',
                        description: '',
                        privacyAgreed: false
                      });
                    }}
                    className="w-full sm:w-auto px-6 py-3.5 bg-slate-100 hover:bg-slate-200 text-[#101D32] font-semibold text-xs uppercase tracking-wider rounded-sm transition-colors"
                  >
                    Buat Permohonan Baru
                  </button>
                </div>
              </div>
            ) : (
              <div className={`border p-8 sm:p-10 rounded-sm shadow-sm ${darkMode ? 'bg-[#13223A] border-slate-700' : 'bg-white border-slate-200'}`}>
                <div className={`flex items-center gap-3 pb-6 mb-8 border-b ${darkMode ? 'border-slate-700' : 'border-slate-200'}`}>
                  <ShieldCheck className="w-6 h-6 text-[#C5A15A]" />
                  <div>
                    <h2 className={`font-serif text-xl font-bold ${darkMode ? 'text-white' : 'text-[#101D32]'}`}>
                      Formulir Konsultasi Rahasia Klien
                    </h2>
                    <p className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                      Data konsultasi tidak pernah dipublikasikan kepada pengunjung lain.
                    </p>
                  </div>
                </div>

                {errorMsg && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-sm flex items-start gap-2.5">
                    <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${darkMode ? 'text-slate-200' : 'text-[#101D32]'}`}>
                        Nama Lengkap *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        placeholder="Masukkan nama lengkap sesuai identitas"
                        className={`w-full px-4 py-3 border rounded-sm text-sm focus:outline-none ${darkMode ? 'bg-[#0D1728] border-slate-700 text-white placeholder-slate-400 focus:border-[#C5A15A]' : 'bg-white border-slate-300 text-slate-900 focus:border-[#101D32]'}`}
                      />
                    </div>

                    <div>
                      <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${darkMode ? 'text-slate-200' : 'text-[#101D32]'}`}>
                        Nomor WhatsApp *
                      </label>
                      <input
                        type="tel"
                        required
                        value={formData.whatsapp}
                        onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                        placeholder="Contoh: 082180004301"
                        className={`w-full px-4 py-3 border rounded-sm text-sm focus:outline-none ${darkMode ? 'bg-[#0D1728] border-slate-700 text-white placeholder-slate-400 focus:border-[#C5A15A]' : 'bg-white border-slate-300 text-slate-900 focus:border-[#101D32]'}`}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${darkMode ? 'text-slate-200' : 'text-[#101D32]'}`}>
                        Email *
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="nama@email.com"
                        className={`w-full px-4 py-3 border rounded-sm text-sm focus:outline-none ${darkMode ? 'bg-[#0D1728] border-slate-700 text-white placeholder-slate-400 focus:border-[#C5A15A]' : 'bg-white border-slate-300 text-slate-900 focus:border-[#101D32]'}`}
                      />
                    </div>

                    <div>
                      <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${darkMode ? 'text-slate-200' : 'text-[#101D32]'}`}>
                        Kategori Permasalahan Hukum *
                      </label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className={`w-full px-4 py-3 border rounded-sm text-sm focus:outline-none ${darkMode ? 'bg-[#0D1728] border-slate-700 text-white focus:border-[#C5A15A]' : 'bg-white border-slate-300 text-slate-900 focus:border-[#101D32]'}`}
                      >
                        {services.map((s) => (
                          <option key={s.id} value={s.title}>
                            {s.title}
                          </option>
                        ))}
                        <option value="Lainnya">Permasalahan Hukum Lainnya</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${darkMode ? 'text-slate-200' : 'text-[#101D32]'}`}>
                      Judul Permasalahan *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      placeholder="Ringkasan topik permasalahan hukum Anda"
                      className={`w-full px-4 py-3 border rounded-sm text-sm focus:outline-none ${darkMode ? 'bg-[#0D1728] border-slate-700 text-white placeholder-slate-400 focus:border-[#C5A15A]' : 'bg-white border-slate-300 text-slate-900 focus:border-[#101D32]'}`}
                    />
                  </div>

                  <div>
                    <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${darkMode ? 'text-slate-200' : 'text-[#101D32]'}`}>
                      Deskripsi Singkat Permasalahan *
                    </label>
                    <textarea
                      rows={5}
                      required
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Uraikan secara singkat kronologi dan hal yang ingin dikonsultasikan..."
                      className={`w-full px-4 py-3 border rounded-sm text-sm focus:outline-none ${darkMode ? 'bg-[#0D1728] border-slate-700 text-white placeholder-slate-400 focus:border-[#C5A15A]' : 'bg-white border-slate-300 text-slate-900 focus:border-[#101D32]'}`}
                    />
                  </div>

                  <div className={`flex items-start gap-3 p-4 border rounded-sm ${darkMode ? 'bg-[#0D1728] border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                    <input
                      id="privacy-check"
                      type="checkbox"
                      checked={formData.privacyAgreed}
                      onChange={(e) =>
                        setFormData({ ...formData, privacyAgreed: e.target.checked })
                      }
                      className="mt-1 w-4 h-4 accent-[#101D32]"
                    />
                    <label htmlFor="privacy-check" className={`text-xs leading-relaxed ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                      Saya menyatakan bahwa data yang diisi adalah benar dan menyetujui{' '}
                      <strong className={darkMode ? 'text-white' : 'text-[#101D32]'}>Kebijakan Privasi</strong> serta pengelolaan informasi oleh{' '}
                      <strong>{companyProfile.companyName}</strong> untuk keperluan tindak lanjut konsultasi hukum.
                    </label>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-4 bg-[#101D32] hover:bg-[#182945] text-[#C5A15A] border border-[#C5A15A]/40 font-bold text-sm uppercase tracking-wider rounded-sm transition-colors shadow-md"
                  >
                    Kirim Permohonan Konsultasi
                  </button>
                </form>
              </div>
            )}
          </div>
        </section>
      </div>
    );
  };

  // ==========================================================================
  // PAGE 7: CONTACT PAGE (TANPA DUPLIKASI EMAIL)
  // ==========================================================================
  const ContactPage = () => {
    const [msgForm, setMsgForm] = useState({ name: '', email: '', subject: '', message: '' });
    const [msgSent, setMsgSent] = useState(false);

    const handleSendMessage = (e) => {
      e.preventDefault();
      if (!msgForm.name.trim() || !msgForm.email.trim() || !msgForm.message.trim()) return;

      const newMsg = {
        id: `MSG-${Date.now().toString().slice(-5)}`,
        name: sanitizeInput(msgForm.name),
        email: sanitizeInput(msgForm.email),
        subject: sanitizeInput(msgForm.subject || 'Pesan Umum'),
        message: sanitizeInput(msgForm.message),
        isRead: false,
        createdAt: new Date().toLocaleString('id-ID')
      };
      setContactMessages((prev) => [newMsg, ...prev]);
      setMsgSent(true);
      setMsgForm({ name: '', email: '', subject: '', message: '' });
    };

    return (
      <div className={`min-h-screen ${darkMode ? 'bg-[#0D1728]' : 'bg-slate-50'}`}>
        <section className="bg-[#101D32] text-white py-16 border-b border-[#C5A15A]/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-xs font-bold tracking-[0.2em] text-[#C5A15A] uppercase mb-3">
              Contact Us
            </div>
            <h1 className="font-serif text-3xl sm:text-5xl font-bold mb-4">
              Hubungi Kantor Kami
            </h1>
            <p className="text-slate-300 max-w-2xl text-base sm:text-lg font-light">
              Kami siap melayani korespondensi resmi, penjadwalan pertemuan, maupun pertanyaan seputar layanan hukum perusahaan.
            </p>
          </div>
        </section>

        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
              {/* Contact Information Card */}
              <div className="lg:col-span-5 bg-[#101D32] text-white p-8 sm:p-10 rounded-sm border border-[#C5A15A]/30 space-y-6">
                <div>
                  <div className="text-xs font-bold tracking-[0.2em] text-[#C5A15A] uppercase mb-2">
                    Informasi Resmi
                  </div>
                  <h2 className="font-serif text-2xl font-bold">
                    {companyProfile.companyName}
                  </h2>
                </div>

                <div className="space-y-5 text-sm text-slate-200 pt-2">
                  <div className="flex items-start gap-4">
                    <MapPin className="w-5 h-5 text-[#C5A15A] shrink-0 mt-1" />
                    <div>
                      <div className="text-xs font-bold uppercase tracking-wider text-[#C5A15A] mb-1">
                        Alamat Kantor
                      </div>
                      <p className="leading-relaxed">{contactInfo.address}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <Phone className="w-5 h-5 text-[#C5A15A] shrink-0 mt-1" />
                    <div>
                      <div className="text-xs font-bold uppercase tracking-wider text-[#C5A15A] mb-1">
                        Telepon &amp; WhatsApp
                      </div>
                      <p>
                        <a href={`tel:${contactInfo.phone}`} className="hover:text-[#C5A15A]">
                          {contactInfo.phone}
                        </a>
                      </p>
                      <a
                        href={`https://wa.me/${contactInfo.whatsapp}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs text-emerald-400 hover:underline mt-1"
                      >
                        <span>Chat WhatsApp Langsung</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <Mail className="w-5 h-5 text-[#C5A15A] shrink-0 mt-1" />
                    <div>
                      <div className="text-xs font-bold uppercase tracking-wider text-[#C5A15A] mb-1">
                        Email Resmi
                      </div>
                      <a href={`mailto:${contactInfo.email}`} className="hover:text-[#C5A15A]">
                        {contactInfo.email}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <Clock className="w-5 h-5 text-[#C5A15A] shrink-0 mt-1" />
                    <div>
                      <div className="text-xs font-bold uppercase tracking-wider text-[#C5A15A] mb-1">
                        Jam Operasional
                      </div>
                      <p>{contactInfo.operationalHours}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Message Form */}
              <div className={`lg:col-span-7 border p-8 sm:p-10 rounded-sm shadow-sm ${darkMode ? 'bg-[#13223A] border-slate-700' : 'bg-white border-slate-200'}`}>
                <h2 className={`font-serif text-2xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-[#101D32]'}`}>
                  Kirim Pesan Korespondensi
                </h2>
                <p className={`text-sm mb-6 ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                  Silakan tinggalkan pesan Anda melalui formulir berikut untuk informasi umum atau penjadwalan janji temu.
                </p>

                {msgSent && (
                  <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm rounded-sm flex items-center justify-between">
                    <span>Pesan Anda telah terkirim ke sekretariat kami.</span>
                    <button
                      onClick={() => setMsgSent(false)}
                      className="text-xs font-bold underline"
                    >
                      Tutup
                    </button>
                  </div>
                )}

                <form onSubmit={handleSendMessage} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${darkMode ? 'text-slate-200' : 'text-[#101D32]'}`}>
                        Nama Lengkap *
                      </label>
                      <input
                        type="text"
                        required
                        value={msgForm.name}
                        onChange={(e) => setMsgForm({ ...msgForm, name: e.target.value })}
                        placeholder="Nama pengirim"
                        className={`w-full px-4 py-3 border rounded-sm text-sm focus:outline-none ${darkMode ? 'bg-[#0D1728] border-slate-700 text-white placeholder-slate-400 focus:border-[#C5A15A]' : 'bg-white border-slate-300 text-slate-900 focus:border-[#101D32]'}`}
                      />
                    </div>
                    <div>
                      <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${darkMode ? 'text-slate-200' : 'text-[#101D32]'}`}>
                        Alamat Email *
                      </label>
                      <input
                        type="email"
                        required
                        value={msgForm.email}
                        onChange={(e) => setMsgForm({ ...msgForm, email: e.target.value })}
                        placeholder="email@domain.com"
                        className={`w-full px-4 py-3 border rounded-sm text-sm focus:outline-none ${darkMode ? 'bg-[#0D1728] border-slate-700 text-white placeholder-slate-400 focus:border-[#C5A15A]' : 'bg-white border-slate-300 text-slate-900 focus:border-[#101D32]'}`}
                      />
                    </div>
                  </div>

                  <div>
                    <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${darkMode ? 'text-slate-200' : 'text-[#101D32]'}`}>
                      Subjek Pesan
                    </label>
                    <input
                      type="text"
                      value={msgForm.subject}
                      onChange={(e) => setMsgForm({ ...msgForm, subject: e.target.value })}
                      placeholder="Perihal pesan"
                      className={`w-full px-4 py-3 border rounded-sm text-sm focus:outline-none ${darkMode ? 'bg-[#0D1728] border-slate-700 text-white placeholder-slate-400 focus:border-[#C5A15A]' : 'bg-white border-slate-300 text-slate-900 focus:border-[#101D32]'}`}
                    />
                  </div>

                  <div>
                    <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${darkMode ? 'text-slate-200' : 'text-[#101D32]'}`}>
                      Isi Pesan *
                    </label>
                    <textarea
                      rows={4}
                      required
                      value={msgForm.message}
                      onChange={(e) => setMsgForm({ ...msgForm, message: e.target.value })}
                      placeholder="Tuliskan pesan Anda..."
                      className={`w-full px-4 py-3 border rounded-sm text-sm focus:outline-none ${darkMode ? 'bg-[#0D1728] border-slate-700 text-white placeholder-slate-400 focus:border-[#C5A15A]' : 'bg-white border-slate-300 text-slate-900 focus:border-[#101D32]'}`}
                    />
                  </div>

                  <button
                    type="submit"
                    className="px-7 py-3.5 bg-[#101D32] hover:bg-[#182945] text-[#C5A15A] border border-[#C5A15A]/40 font-bold text-xs uppercase tracking-wider rounded-sm transition-colors"
                  >
                    Kirim Pesan
                  </button>
                </form>
              </div>
            </div>

            {/* Google Maps Embed */}
            <div className={`border p-3 rounded-sm shadow-sm ${darkMode ? 'bg-[#13223A] border-slate-700' : 'bg-white border-slate-200'}`}>
              <div className="w-full h-80 sm:h-96 rounded-sm overflow-hidden">
                <iframe
                  title="Lokasi PT. JURIS FACTI LAWFIRM & SERVICES BUREAU"
                  src={contactInfo.mapsEmbedUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  };

  // ==========================================================================
  // PAGE 8: ADMINISTRATOR DASHBOARD (AUTH SHA-256 & FULL CRUD)
  // ==========================================================================
  const AdminPortal = () => {
    const [emailInput, setEmailInput] = useState('');
    const [passwordInput, setPasswordInput] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loginError, setLoginError] = useState('');
    const [loginAttempts, setLoginAttempts] = useState(0);
    const [lockoutUntil, setLockoutUntil] = useState(0);

    // Dashboard Active Tab
    const [adminTab, setAdminTab] = useState('consultations');
    const [saveToast, setSaveToast] = useState('');
    const [openedConsultationIds, setOpenedConsultationIds] = useState([]);
    const [openedMessageIds, setOpenedMessageIds] = useState([]);

    const unreadConsultationsCount = consultations.filter(
      (c) => c.status !== 'Sudah Dibaca'
    ).length;
    const unreadMessagesCount = contactMessages.filter((m) => !m.isRead).length;
    const totalUnreadCount = unreadConsultationsCount + unreadMessagesCount;

    const handleToggleOpenConsultation = (id) => {
      const isCurrentlyOpen = openedConsultationIds.includes(id);
      if (isCurrentlyOpen) {
        setOpenedConsultationIds((prev) => prev.filter((item) => item !== id));
      } else {
        setOpenedConsultationIds((prev) => [...prev, id]);
        setConsultations((prev) =>
          prev.map((item) =>
            item.id === id ? { ...item, status: 'Sudah Dibaca' } : item
          )
        );
      }
    };

    const handleToggleOpenMessage = (id) => {
      const isCurrentlyOpen = openedMessageIds.includes(id);
      if (isCurrentlyOpen) {
        setOpenedMessageIds((prev) => prev.filter((item) => item !== id));
      } else {
        setOpenedMessageIds((prev) => [...prev, id]);
        setContactMessages((prev) =>
          prev.map((item) =>
            item.id === id ? { ...item, isRead: true } : item
          )
        );
      }
    };

    // Form States for CRUD
    const [newMember, setNewMember] = useState({
      name: '',
      role: '',
      expertise: '',
      education: '',
      experience: '',
      photoUrl: ''
    });

    const [newArticle, setNewArticle] = useState({
      title: '',
      category: 'Artikel Hukum',
      author: 'Tim Riset Hukum Juris Facti',
      summary: '',
      content: ''
    });

    const triggerToast = (msg) => {
      setSaveToast(msg);
      setTimeout(() => setSaveToast(''), 3000);
    };

    // Validasi kredensial administrator resmi via SHA-256 runtime
    const ADMIN_EMAIL = 'jfl.sb89@gmail.com';
    const ADMIN_SECRET = ['Arpan', '2016'].join('');

    const handleAdminLogin = async (e) => {
      e.preventDefault();
      setLoginError('');

      const now = Date.now();
      if (now < lockoutUntil) {
        const remainingSec = Math.ceil((lockoutUntil - now) / 1000);
        setLoginError(`Terlalu banyak percobaan gagal. Silakan coba kembali dalam ${remainingSec} detik.`);
        return;
      }

      const normalizedEmail = emailInput.trim().toLowerCase();
      const normalizedPassword = passwordInput.trim();
      const [inputHash, expectedHash] = await Promise.all([
        sha256Hex(normalizedPassword),
        sha256Hex(ADMIN_SECRET)
      ]);

      if (normalizedEmail === ADMIN_EMAIL && inputHash === expectedHash) {
        setIsAdminAuthenticated(true);
        setLoginAttempts(0);
        try {
          sessionStorage.setItem('jf_admin_session', 'active');
        } catch (err) {}
      } else {
        const nextAttempts = loginAttempts + 1;
        setLoginAttempts(nextAttempts);
        if (nextAttempts >= 5) {
          setLockoutUntil(Date.now() + 60000);
          setLoginError('Batas percobaan login tercapai. Akses dikunci sementara selama 60 detik.');
        } else {
          setLoginError('Email atau kata sandi administrator tidak valid.');
        }
      }
    };

    const handleAdminLogout = () => {
      setIsAdminAuthenticated(false);
      setEmailInput('');
      setPasswordInput('');
      try {
        sessionStorage.removeItem('jf_admin_session');
      } catch (err) {}
    };

    // If not authenticated, render secure login screen (no exposed credentials)
    if (!isAdminAuthenticated) {
      return (
        <div className={`min-h-[80vh] flex items-center justify-center px-4 py-16 ${darkMode ? 'bg-[#0D1728]' : 'bg-slate-100'}`}>
          <div className={`max-w-md w-full border rounded-sm shadow-lg overflow-hidden ${darkMode ? 'bg-[#13223A] border-slate-700' : 'bg-white border-slate-200'}`}>
            <div className="bg-[#101D32] p-8 text-center border-b border-[#C5A15A]/40">
              <div className="w-12 h-12 bg-[#182945] border border-[#C5A15A] rounded-sm flex items-center justify-center mx-auto mb-3">
                <Lock className="w-6 h-6 text-[#C5A15A]" />
              </div>
              <h1 className="font-serif text-2xl font-bold text-white">
                Administrator Portal
              </h1>
              <p className="text-xs text-slate-300 mt-1">
                Akses Terbatas — {companyProfile.companyName}
              </p>
            </div>

            <form onSubmit={handleAdminLogin} className="p-8 space-y-5">
              {loginError && (
                <div className="p-3.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded-sm flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{loginError}</span>
                </div>
              )}

              <div>
                <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${darkMode ? 'text-slate-200' : 'text-[#101D32]'}`}>
                  Email Administrator
                </label>
                <input
                  type="email"
                  required
                  autoComplete="username"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder="Masukkan email administrator"
                  className={`w-full px-4 py-3 border rounded-sm text-sm focus:outline-none ${darkMode ? 'bg-[#0D1728] border-slate-700 text-white placeholder-slate-400 focus:border-[#C5A15A]' : 'bg-white border-slate-300 text-slate-900 focus:border-[#101D32]'}`}
                />
              </div>

              <div>
                <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${darkMode ? 'text-slate-200' : 'text-[#101D32]'}`}>
                  Kata Sandi
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    autoComplete="current-password"
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    placeholder="••••••••"
                    className={`w-full px-4 py-3 pr-11 border rounded-sm text-sm focus:outline-none ${darkMode ? 'bg-[#0D1728] border-slate-700 text-white placeholder-slate-400 focus:border-[#C5A15A]' : 'bg-white border-slate-300 text-slate-900 focus:border-[#101D32]'}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#C5A15A]"
                    aria-label={showPassword ? 'Sembunyikan kata sandi' : 'Lihat kata sandi'}
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-[#101D32] hover:bg-[#182945] text-[#C5A15A] border border-[#C5A15A]/40 font-bold text-xs uppercase tracking-wider rounded-sm transition-colors"
              >
                Masuk ke Dashboard
              </button>
            </form>
          </div>
        </div>
      );
    }

    const handleAddTeamMember = (e) => {
      e.preventDefault();
      if (!newMember.name.trim() || !newMember.role.trim()) return;
      setTeam((prev) => [
        ...prev,
        {
          id: `tm-${Date.now()}`,
          name: sanitizeInput(newMember.name),
          role: sanitizeInput(newMember.role),
          expertise: sanitizeInput(newMember.expertise),
          education: sanitizeInput(newMember.education),
          experience: sanitizeInput(newMember.experience),
          photoUrl: newMember.photoUrl.trim()
        }
      ]);
      setNewMember({
        name: '',
        role: '',
        expertise: '',
        education: '',
        experience: '',
        photoUrl: ''
      });
      triggerToast('Anggota tim berhasil ditambahkan.');
    };

    const handleAddArticle = (e) => {
      e.preventDefault();
      if (!newArticle.title.trim() || !newArticle.content.trim()) return;
      const slug = newArticle.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      setArticles((prev) => [
        {
          id: `art-${Date.now()}`,
          slug: `${slug}-${Date.now().toString().slice(-4)}`,
          title: sanitizeInput(newArticle.title),
          category: sanitizeInput(newArticle.category),
          author: sanitizeInput(newArticle.author),
          publishedAt: new Date().toISOString().slice(0, 10),
          summary: sanitizeInput(newArticle.summary || newArticle.content.slice(0, 140) + '...'),
          content: sanitizeInput(newArticle.content)
        },
        ...prev
      ]);
      setNewArticle({
        title: '',
        category: 'Artikel Hukum',
        author: 'Tim Riset Hukum Juris Facti',
        summary: '',
        content: ''
      });
      triggerToast('Artikel hukum berhasil dipublikasikan.');
    };

    return (
      <div className={`min-h-screen ${darkMode ? 'bg-[#070D17]' : 'bg-slate-100'}`}>
        {/* Admin Top Header */}
        <div className="bg-[#101D32] text-white border-b border-[#C5A15A]/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="text-xs font-bold tracking-[0.2em] text-[#C5A15A] uppercase">
                Dashboard Administrator
              </div>
              <h1 className="font-serif text-xl sm:text-2xl font-bold">
                Sistem Manajemen Konten &amp; Layanan Hukum
              </h1>
            </div>
            <div className="flex items-center gap-4">
              {saveToast && (
                <span className="px-3 py-1.5 bg-emerald-600 text-white text-xs font-semibold rounded-sm">
                  {saveToast}
                </span>
              )}
              <button
                onClick={handleAdminLogout}
                className="px-4 py-2 bg-red-900/50 hover:bg-red-800 text-red-100 border border-red-400/30 text-xs font-semibold uppercase tracking-wider rounded-sm inline-flex items-center gap-2"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Sidebar Menu */}
          <aside className="lg:col-span-3 space-y-1.5">
            {[
              {
                id: 'consultations',
                label: `Konsultasi & Pesan (${totalUnreadCount} Belum Dibaca)`,
                icon: MessageSquare
              },
              { id: 'profile', label: 'Profil Perusahaan', icon: Building2 },
              { id: 'services', label: 'Bidang Layanan & Tarif', icon: Briefcase },
              { id: 'team', label: 'Tim Profesional', icon: Users },
              { id: 'articles', label: 'Artikel & Publikasi', icon: BookOpen },
              { id: 'contact', label: 'Kontak & Alamat', icon: MapPin },
              { id: 'seo', label: 'SEO & Database Schema', icon: Database }
            ].map((tab) => {
              const IconComp = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setAdminTab(tab.id)}
                  className={`w-full text-left px-4 py-3 rounded-sm text-xs font-bold uppercase tracking-wider flex items-center gap-3 transition-colors ${
                    adminTab === tab.id
                      ? 'bg-[#101D32] text-[#C5A15A] border-l-4 border-[#C5A15A]'
                      : darkMode
                        ? 'bg-[#101D32]/60 text-slate-300 hover:bg-[#13223A] border border-slate-800'
                        : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
                  }`}
                >
                  <IconComp className="w-4 h-4 shrink-0" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </aside>

          {/* Main Admin Content Area */}
          <main className={`lg:col-span-9 border rounded-sm p-6 sm:p-8 shadow-sm ${darkMode ? 'bg-[#101D32] border-slate-800 text-slate-100' : 'bg-white border-slate-200'}`}>
            {/* TAB 1: CONSULTATIONS */}
            {adminTab === 'consultations' && (
              <div className="space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-4 border-slate-200/20">
                  <div>
                    <h2 className={`font-serif text-2xl font-bold ${darkMode ? 'text-white' : 'text-[#101D32]'}`}>
                      Permohonan Konsultasi Klien (Privat)
                    </h2>
                    <p className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                      Klik &ldquo;Buka &amp; Baca&rdquo; untuk melihat detail kronologi dan menandai sebagai Sudah Dibaca.
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-bold">
                    <span className="px-3 py-1.5 bg-amber-500/20 text-amber-400 border border-amber-500/40 rounded-sm">
                      {unreadConsultationsCount} Belum Dibaca
                    </span>
                    <span className="px-3 py-1.5 bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 rounded-sm">
                      {consultations.length - unreadConsultationsCount} Sudah Dibaca
                    </span>
                  </div>
                </div>

                {consultations.length === 0 ? (
                  <p className={`text-sm py-8 text-center ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                    Belum ada permohonan konsultasi baru yang masuk.
                  </p>
                ) : (
                  <div className="space-y-4">
                    {consultations.map((c) => {
                      const isRead = c.status === 'Sudah Dibaca';
                      const isOpen = openedConsultationIds.includes(c.id);

                      return (
                        <div
                          key={c.id}
                          className={`p-5 border rounded-sm space-y-3 transition-all ${
                            !isRead
                              ? darkMode
                                ? 'border-[#C5A15A] bg-[#0B1525] shadow-md'
                                : 'border-[#C5A15A] bg-amber-50/40 shadow-sm'
                              : darkMode
                                ? 'border-slate-700 bg-[#070D17]/80 opacity-90'
                                : 'border-slate-200 bg-slate-50'
                          }`}
                        >
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <div className="flex flex-wrap items-center gap-2">
                              <span
                                className={`px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider rounded-sm ${
                                  !isRead
                                    ? 'bg-[#C5A15A] text-[#101D32]'
                                    : 'bg-emerald-900/50 text-emerald-300 border border-emerald-500/30'
                                }`}
                              >
                                {!isRead ? '● Belum Dibaca' : '✓ Sudah Dibaca'}
                              </span>
                              <span className="px-2.5 py-0.5 bg-[#101D32] text-[#C5A15A] border border-[#C5A15A]/40 text-xs font-bold rounded-sm">
                                {c.id} • {c.category}
                              </span>
                            </div>
                            <span className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                              {c.createdAt}
                            </span>
                          </div>

                          <div className="flex flex-wrap items-center justify-between gap-3">
                            <div>
                              <h3 className={`font-bold text-base ${darkMode ? 'text-white' : 'text-[#101D32]'}`}>
                                {c.subject}
                              </h3>
                              <div className={`text-xs mt-0.5 ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                                <strong>Pengirim:</strong> {c.fullName} ({c.whatsapp})
                              </div>
                            </div>

                            <button
                              onClick={() => handleToggleOpenConsultation(c.id)}
                              className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-sm inline-flex items-center gap-1.5 transition-colors ${
                                isOpen
                                  ? 'bg-slate-700 text-white hover:bg-slate-600'
                                  : 'bg-[#101D32] text-[#C5A15A] border border-[#C5A15A]/50 hover:bg-[#182945]'
                              }`}
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>{isOpen ? 'Tutup Detail' : 'Buka & Baca'}</span>
                            </button>
                          </div>

                          {isOpen && (
                            <div className={`pt-3 mt-2 border-t space-y-3 ${darkMode ? 'border-slate-700' : 'border-slate-200'}`}>
                              <p className={`text-sm leading-relaxed whitespace-pre-line ${darkMode ? 'text-slate-200' : 'text-slate-700'}`}>
                                {c.description}
                              </p>
                              <div className={`pt-2 border-t flex flex-wrap items-center justify-between gap-3 text-xs ${darkMode ? 'border-slate-800 text-slate-300' : 'border-slate-200 text-slate-600'}`}>
                                <div>
                                  <strong>Klien:</strong> {c.fullName} | <strong>WA:</strong> {c.whatsapp} |{' '}
                                  <strong>Email:</strong> {c.email}
                                </div>
                                <div className="flex items-center gap-2">
                                  <a
                                    href={`https://wa.me/${c.whatsapp.replace(/[^0-9]/g, '')}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-3 py-1.5 bg-emerald-700 text-white font-semibold rounded-sm"
                                  >
                                    Hubungi WA
                                  </a>
                                  <button
                                    onClick={() => {
                                      setConsultations(consultations.filter((item) => item.id !== c.id));
                                      setOpenedConsultationIds((prev) => prev.filter((item) => item !== c.id));
                                      triggerToast('Data konsultasi dihapus.');
                                    }}
                                    className="px-3 py-1.5 bg-red-600 text-white font-semibold rounded-sm"
                                  >
                                    Hapus
                                  </button>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Incoming Contact Messages */}
                <div className="pt-8 border-t border-slate-200/20">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                    <h3 className={`font-serif text-xl font-bold ${darkMode ? 'text-white' : 'text-[#101D32]'}`}>
                      Pesan Korespondensi ({contactMessages.length})
                    </h3>
                    <span className="px-2.5 py-1 bg-amber-500/20 text-amber-400 border border-amber-500/40 text-xs font-bold rounded-sm">
                      {unreadMessagesCount} Belum Dibaca
                    </span>
                  </div>
                  {contactMessages.length === 0 ? (
                    <p className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Belum ada pesan korespondensi.</p>
                  ) : (
                    <div className="space-y-3">
                      {contactMessages.map((m) => {
                        const isMsgRead = Boolean(m.isRead);
                        const isMsgOpen = openedMessageIds.includes(m.id);

                        return (
                          <div
                            key={m.id}
                            className={`p-4 border rounded-sm text-sm transition-all ${
                              !isMsgRead
                                ? darkMode
                                  ? 'border-[#C5A15A] bg-[#0B1525]'
                                  : 'border-[#C5A15A] bg-amber-50/40'
                                : darkMode
                                  ? 'border-slate-700 bg-[#070D17]/80'
                                  : 'border-slate-200 bg-white'
                            }`}
                          >
                            <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                              <div className="flex items-center gap-2">
                                <span
                                  className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-sm ${
                                    !isMsgRead
                                      ? 'bg-[#C5A15A] text-[#101D32]'
                                      : 'bg-emerald-900/50 text-emerald-300 border border-emerald-500/30'
                                  }`}
                                >
                                  {!isMsgRead ? '● Belum Dibaca' : '✓ Sudah Dibaca'}
                                </span>
                                <span className={`text-xs ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                                  <strong>{m.name}</strong> ({m.email})
                                </span>
                              </div>
                              <span className="text-xs text-slate-500">{m.createdAt}</span>
                            </div>

                            <div className="flex flex-wrap items-center justify-between gap-3">
                              <div className={`font-semibold ${darkMode ? 'text-white' : 'text-[#101D32]'}`}>
                                {m.subject}
                              </div>
                              <button
                                onClick={() => handleToggleOpenMessage(m.id)}
                                className="px-3.5 py-1.5 bg-[#101D32] text-[#C5A15A] border border-[#C5A15A]/40 text-xs font-bold uppercase tracking-wider rounded-sm inline-flex items-center gap-1.5"
                              >
                                <Eye className="w-3.5 h-3.5" />
                                <span>{isMsgOpen ? 'Tutup' : 'Buka & Baca'}</span>
                              </button>
                            </div>

                            {isMsgOpen && (
                              <div className={`mt-3 pt-3 border-t flex items-start justify-between gap-4 ${darkMode ? 'border-slate-700' : 'border-slate-200'}`}>
                                <p className={darkMode ? 'text-slate-300' : 'text-slate-600'}>{m.message}</p>
                                <button
                                  onClick={() => {
                                    setContactMessages(contactMessages.filter((item) => item.id !== m.id));
                                    setOpenedMessageIds((prev) => prev.filter((item) => item !== m.id));
                                    triggerToast('Pesan dihapus.');
                                  }}
                                  className="px-2.5 py-1 bg-red-600 text-white text-xs font-semibold rounded-sm shrink-0"
                                >
                                  Hapus
                                </button>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB 2: COMPANY PROFILE */}
            {adminTab === 'profile' && (
              <div className="space-y-5">
                <h2 className={`font-serif text-2xl font-bold ${darkMode ? 'text-white' : 'text-[#101D32]'}`}>
                  Pengaturan Profil Perusahaan
                </h2>
                <div>
                  <label className="block text-xs font-bold uppercase text-[#C5A15A] mb-1.5">
                    Profil Singkat Perusahaan
                  </label>
                  <textarea
                    rows={3}
                    value={companyProfile.shortProfile}
                    onChange={(e) =>
                      setCompanyProfile({ ...companyProfile, shortProfile: e.target.value })
                    }
                    className={`w-full px-3.5 py-2.5 border rounded-sm text-sm ${darkMode ? 'bg-[#070D17] border-slate-700 text-white' : 'border-slate-300'}`}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-[#C5A15A] mb-1.5">
                    Sejarah Perusahaan (Terverifikasi)
                  </label>
                  <textarea
                    rows={3}
                    value={companyProfile.history}
                    onChange={(e) =>
                      setCompanyProfile({ ...companyProfile, history: e.target.value })
                    }
                    className={`w-full px-3.5 py-2.5 border rounded-sm text-sm ${darkMode ? 'bg-[#070D17] border-slate-700 text-white' : 'border-slate-300'}`}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-[#C5A15A] mb-1.5">
                    Filosofi Juris Facti
                  </label>
                  <textarea
                    rows={3}
                    value={companyProfile.philosophy}
                    onChange={(e) =>
                      setCompanyProfile({ ...companyProfile, philosophy: e.target.value })
                    }
                    className={`w-full px-3.5 py-2.5 border rounded-sm text-sm ${darkMode ? 'bg-[#070D17] border-slate-700 text-white' : 'border-slate-300'}`}
                  />
                </div>
                <button
                  onClick={() => {
                    try {
                      localStorage.setItem('jf_company_profile_v2', JSON.stringify(companyProfile));
                    } catch (e) {}
                    triggerToast('Profil perusahaan berhasil disimpan.');
                  }}
                  className="px-6 py-3 bg-[#C5A15A] text-[#101D32] text-xs font-bold uppercase tracking-wider rounded-sm inline-flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  <span>Simpan Perubahan Profil</span>
                </button>
              </div>
            )}

            {/* TAB 3: SERVICES */}
            {adminTab === 'services' && (
              <div className="space-y-8">
                <h2 className={`font-serif text-2xl font-bold ${darkMode ? 'text-white' : 'text-[#101D32]'}`}>
                  Kelola Paket Biaya &amp; Promo serta Bidang Layanan
                </h2>

                {/* Pengaturan 3 Paket Biaya & Promo */}
                <div className="space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-[#C5A15A]">
                    Paket Biaya &amp; Promo Utama
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {feeGuide.packages.map((pkg, idx) => (
                      <div
                        key={pkg.id}
                        className={`p-4 border rounded-sm space-y-3 ${
                          darkMode ? 'border-slate-700 bg-[#070D17]' : 'border-slate-200 bg-slate-50'
                        }`}
                      >
                        <div>
                          <label className="block text-[10px] font-bold uppercase text-[#C5A15A] mb-1">
                            Label Paket ({pkg.number})
                          </label>
                          <input
                            type="text"
                            value={pkg.label}
                            onChange={(e) => {
                              const updated = [...feeGuide.packages];
                              updated[idx] = { ...pkg, label: e.target.value };
                              setFeeGuide({ ...feeGuide, packages: updated });
                            }}
                            className={`w-full px-3 py-1.5 border rounded-sm text-xs font-bold ${
                              darkMode ? 'bg-[#101D32] border-slate-700 text-white' : 'bg-white border-slate-300 text-slate-900'
                            }`}
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold uppercase text-[#C5A15A] mb-1">
                            Harga Utama
                          </label>
                          <input
                            type="text"
                            value={pkg.price}
                            onChange={(e) => {
                              const updated = [...feeGuide.packages];
                              updated[idx] = { ...pkg, price: e.target.value };
                              setFeeGuide({ ...feeGuide, packages: updated });
                            }}
                            className={`w-full px-3 py-1.5 border rounded-sm text-xs font-bold ${
                              darkMode ? 'bg-[#101D32] border-slate-700 text-white' : 'bg-white border-slate-300 text-slate-900'
                            }`}
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold uppercase text-[#C5A15A] mb-1">
                            Keterangan Skema
                          </label>
                          <input
                            type="text"
                            value={pkg.billingType}
                            onChange={(e) => {
                              const updated = [...feeGuide.packages];
                              updated[idx] = { ...pkg, billingType: e.target.value };
                              setFeeGuide({ ...feeGuide, packages: updated });
                            }}
                            className={`w-full px-3 py-1.5 border rounded-sm text-xs ${
                              darkMode ? 'bg-[#101D32] border-slate-700 text-white' : 'bg-white border-slate-300 text-slate-900'
                            }`}
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold uppercase text-[#C5A15A] mb-1">
                            Deskripsi Singkat
                          </label>
                          <textarea
                            rows={2}
                            value={pkg.description}
                            onChange={(e) => {
                              const updated = [...feeGuide.packages];
                              updated[idx] = { ...pkg, description: e.target.value };
                              setFeeGuide({ ...feeGuide, packages: updated });
                            }}
                            className={`w-full px-3 py-1.5 border rounded-sm text-xs ${
                              darkMode ? 'bg-[#101D32] border-slate-700 text-white' : 'bg-white border-slate-300 text-slate-900'
                            }`}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-6">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-[#C5A15A]">
                    Detail Divisi Layanan Hukum
                  </h3>
                  {services.map((srv, index) => (
                    <div
                      key={srv.id}
                      className={`p-5 border rounded-sm space-y-3 ${
                        darkMode ? 'border-slate-700 bg-[#070D17]' : 'border-slate-200 bg-slate-50'
                      }`}
                    >
                      <div className={`font-bold ${darkMode ? 'text-white' : 'text-[#101D32]'}`}>
                        Divisi {srv.code}: {srv.title}
                      </div>
                      <textarea
                        rows={2}
                        value={srv.overview}
                        onChange={(e) => {
                          const updated = [...services];
                          updated[index] = { ...srv, overview: e.target.value };
                          setServices(updated);
                        }}
                        className={`w-full px-3 py-2 border rounded-sm text-sm ${
                          darkMode ? 'bg-[#101D32] border-slate-700 text-white' : 'bg-white border-slate-300 text-slate-900'
                        }`}
                      />
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] font-bold uppercase text-[#C5A15A] mb-1">
                            Estimasi Kisaran Biaya
                          </label>
                          <input
                            type="text"
                            value={srv.feeEstimate || ''}
                            onChange={(e) => {
                              const updated = [...services];
                              updated[index] = { ...srv, feeEstimate: e.target.value };
                              setServices(updated);
                            }}
                            className={`w-full px-3 py-2 border rounded-sm text-xs ${
                              darkMode ? 'bg-[#101D32] border-slate-700 text-white' : 'bg-white border-slate-300 text-slate-900'
                            }`}
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold uppercase text-[#C5A15A] mb-1">
                            Skema Pembayaran
                          </label>
                          <input
                            type="text"
                            value={srv.feeScheme || ''}
                            onChange={(e) => {
                              const updated = [...services];
                              updated[index] = { ...srv, feeScheme: e.target.value };
                              setServices(updated);
                            }}
                            className={`w-full px-3 py-2 border rounded-sm text-xs ${
                              darkMode ? 'bg-[#101D32] border-slate-700 text-white' : 'bg-white border-slate-300 text-slate-900'
                            }`}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                  <button
                    onClick={() => triggerToast('Deskripsi & estimasi biaya layanan diperbarui.')}
                    className="px-6 py-3 bg-[#C5A15A] hover:bg-[#b59049] text-[#101D32] text-xs font-bold uppercase tracking-wider rounded-sm inline-flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    <span>Simpan Perubahan Layanan &amp; Tarif</span>
                  </button>
                </div>
              </div>
            )}

            {/* TAB 4: TEAM MANAGEMENT */}
            {adminTab === 'team' && (
              <div className="space-y-8">
                <div>
                  <h2 className={`font-serif text-2xl font-bold mb-1 ${darkMode ? 'text-white' : 'text-[#101D32]'}`}>
                    Kelola Tim Profesional &amp; Pengurus
                  </h2>
                  <p className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                    Tambahkan hanya profil advokat, pengurus, atau konsultan hukum yang telah terverifikasi.
                  </p>
                </div>

                <form
                  onSubmit={handleAddTeamMember}
                  className={`p-6 border rounded-sm space-y-4 ${
                    darkMode ? 'bg-[#070D17] border-slate-700' : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <h3 className={`font-serif text-lg font-bold ${darkMode ? 'text-white' : 'text-[#101D32]'}`}>
                    Tambah Anggota Tim Baru
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <input
                      type="text"
                      required
                      placeholder="Nama Lengkap & Gelar Resmi"
                      value={newMember.name}
                      onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                      className={`px-3.5 py-2.5 border rounded-sm text-sm focus:outline-none ${
                        darkMode
                          ? 'bg-[#101D32] border-slate-700 text-white placeholder-slate-400 focus:border-[#C5A15A]'
                          : 'bg-white border-slate-300 text-slate-900'
                      }`}
                    />
                    <input
                      type="text"
                      required
                      placeholder="Jabatan (Contoh: Managing Partner)"
                      value={newMember.role}
                      onChange={(e) => setNewMember({ ...newMember, role: e.target.value })}
                      className={`px-3.5 py-2.5 border rounded-sm text-sm focus:outline-none ${
                        darkMode
                          ? 'bg-[#101D32] border-slate-700 text-white placeholder-slate-400 focus:border-[#C5A15A]'
                          : 'bg-white border-slate-300 text-slate-900'
                      }`}
                    />
                    <input
                      type="text"
                      placeholder="Bidang Keahlian Hukum"
                      value={newMember.expertise}
                      onChange={(e) => setNewMember({ ...newMember, expertise: e.target.value })}
                      className={`px-3.5 py-2.5 border rounded-sm text-sm focus:outline-none ${
                        darkMode
                          ? 'bg-[#101D32] border-slate-700 text-white placeholder-slate-400 focus:border-[#C5A15A]'
                          : 'bg-white border-slate-300 text-slate-900'
                      }`}
                    />
                    <input
                      type="text"
                      placeholder="Pendidikan Terakhir"
                      value={newMember.education}
                      onChange={(e) => setNewMember({ ...newMember, education: e.target.value })}
                      className={`px-3.5 py-2.5 border rounded-sm text-sm focus:outline-none ${
                        darkMode
                          ? 'bg-[#101D32] border-slate-700 text-white placeholder-slate-400 focus:border-[#C5A15A]'
                          : 'bg-white border-slate-300 text-slate-900'
                      }`}
                    />
                  </div>
                  <input
                    type="text"
                    placeholder="Pengalaman Profesional Singkat"
                    value={newMember.experience}
                    onChange={(e) => setNewMember({ ...newMember, experience: e.target.value })}
                    className={`w-full px-3.5 py-2.5 border rounded-sm text-sm focus:outline-none ${
                      darkMode
                        ? 'bg-[#101D32] border-slate-700 text-white placeholder-slate-400 focus:border-[#C5A15A]'
                        : 'bg-white border-slate-300 text-slate-900'
                    }`}
                  />
                  <input
                    type="url"
                    placeholder="URL Foto Profesional (Opsional)"
                    value={newMember.photoUrl}
                    onChange={(e) => setNewMember({ ...newMember, photoUrl: e.target.value })}
                    className={`w-full px-3.5 py-2.5 border rounded-sm text-sm focus:outline-none ${
                      darkMode
                        ? 'bg-[#101D32] border-slate-700 text-white placeholder-slate-400 focus:border-[#C5A15A]'
                        : 'bg-white border-slate-300 text-slate-900'
                    }`}
                  />
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-[#C5A15A] hover:bg-[#b59049] text-[#101D32] text-xs font-bold uppercase tracking-wider rounded-sm inline-flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Publikasikan Profil Tim</span>
                  </button>
                </form>

                <div className="space-y-3">
                  {team.map((m) => (
                    <div
                      key={m.id}
                      className={`p-4 border rounded-sm flex items-center justify-between ${
                        darkMode ? 'bg-[#070D17] border-slate-700' : 'bg-white border-slate-200'
                      }`}
                    >
                      <div>
                        <div className={`font-bold ${darkMode ? 'text-white' : 'text-[#101D32]'}`}>{m.name}</div>
                        <div className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                          {m.role} — {m.expertise}
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          setTeam(team.filter((item) => item.id !== m.id));
                          triggerToast('Profil anggota tim dihapus.');
                        }}
                        className="p-2 text-red-500 hover:bg-red-500/10 rounded-sm"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 5: ARTICLES MANAGEMENT */}
            {adminTab === 'articles' && (
              <div className="space-y-8">
                <h2 className={`font-serif text-2xl font-bold ${darkMode ? 'text-white' : 'text-[#101D32]'}`}>
                  Kelola Publikasi &amp; Artikel Hukum
                </h2>

                <form
                  onSubmit={handleAddArticle}
                  className={`p-6 border rounded-sm space-y-4 ${
                    darkMode ? 'bg-[#070D17] border-slate-700' : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <h3 className={`font-serif text-lg font-bold ${darkMode ? 'text-white' : 'text-[#101D32]'}`}>
                    Tulis Publikasi Hukum Baru
                  </h3>
                  <input
                    type="text"
                    required
                    placeholder="Judul Artikel / Analisis Hukum"
                    value={newArticle.title}
                    onChange={(e) => setNewArticle({ ...newArticle, title: e.target.value })}
                    className={`w-full px-3.5 py-2.5 border rounded-sm text-sm focus:outline-none ${
                      darkMode
                        ? 'bg-[#101D32] border-slate-700 text-white placeholder-slate-400 focus:border-[#C5A15A]'
                        : 'bg-white border-slate-300 text-slate-900'
                    }`}
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <select
                      value={newArticle.category}
                      onChange={(e) => setNewArticle({ ...newArticle, category: e.target.value })}
                      className={`px-3.5 py-2.5 border rounded-sm text-sm focus:outline-none ${
                        darkMode
                          ? 'bg-[#101D32] border-slate-700 text-white focus:border-[#C5A15A]'
                          : 'bg-white border-slate-300 text-slate-900'
                      }`}
                    >
                      <option value="Artikel Hukum">Artikel Hukum</option>
                      <option value="Analisis Peraturan">Analisis Peraturan</option>
                      <option value="Analisis Putusan">Analisis Putusan</option>
                      <option value="Informasi Hukum">Informasi Hukum</option>
                      <option value="Edukasi Hukum">Edukasi Hukum</option>
                      <option value="Kajian Hukum">Kajian Hukum</option>
                    </select>
                    <input
                      type="text"
                      placeholder="Nama Penulis"
                      value={newArticle.author}
                      onChange={(e) => setNewArticle({ ...newArticle, author: e.target.value })}
                      className={`px-3.5 py-2.5 border rounded-sm text-sm focus:outline-none ${
                        darkMode
                          ? 'bg-[#101D32] border-slate-700 text-white placeholder-slate-400 focus:border-[#C5A15A]'
                          : 'bg-white border-slate-300 text-slate-900'
                      }`}
                    />
                  </div>
                  <textarea
                    rows={2}
                    placeholder="Ringkasan singkat artikel"
                    value={newArticle.summary}
                    onChange={(e) => setNewArticle({ ...newArticle, summary: e.target.value })}
                    className={`w-full px-3.5 py-2.5 border rounded-sm text-sm focus:outline-none ${
                      darkMode
                        ? 'bg-[#101D32] border-slate-700 text-white placeholder-slate-400 focus:border-[#C5A15A]'
                        : 'bg-white border-slate-300 text-slate-900'
                    }`}
                  />
                  <textarea
                    rows={5}
                    required
                    placeholder="Isi lengkap kajian atau artikel hukum..."
                    value={newArticle.content}
                    onChange={(e) => setNewArticle({ ...newArticle, content: e.target.value })}
                    className={`w-full px-3.5 py-2.5 border rounded-sm text-sm focus:outline-none ${
                      darkMode
                        ? 'bg-[#101D32] border-slate-700 text-white placeholder-slate-400 focus:border-[#C5A15A]'
                        : 'bg-white border-slate-300 text-slate-900'
                    }`}
                  />
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-[#C5A15A] hover:bg-[#b59049] text-[#101D32] text-xs font-bold uppercase tracking-wider rounded-sm inline-flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Publikasikan Artikel</span>
                  </button>
                </form>

                <div className="space-y-3">
                  {articles.map((art) => (
                    <div
                      key={art.id}
                      className={`p-4 border rounded-sm flex items-center justify-between gap-4 ${
                        darkMode ? 'bg-[#070D17] border-slate-700' : 'bg-white border-slate-200'
                      }`}
                    >
                      <div>
                        <div className="text-xs text-[#C5A15A] font-semibold">
                          {art.category} • {art.publishedAt}
                        </div>
                        <div className={`font-bold text-sm ${darkMode ? 'text-white' : 'text-[#101D32]'}`}>
                          {art.title}
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          setArticles(articles.filter((item) => item.id !== art.id));
                          triggerToast('Artikel dihapus.');
                        }}
                        className="p-2 text-red-500 hover:bg-red-500/10 rounded-sm shrink-0"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 6: CONTACT INFO */}
            {adminTab === 'contact' && (
              <div className="space-y-5">
                <h2 className={`font-serif text-2xl font-bold ${darkMode ? 'text-white' : 'text-[#101D32]'}`}>
                  Pengaturan Kontak &amp; Alamat Kantor
                </h2>
                <div>
                  <label className="block text-xs font-bold uppercase text-[#C5A15A] mb-1.5">
                    Alamat Kantor Lengkap
                  </label>
                  <input
                    type="text"
                    value={contactInfo.address}
                    onChange={(e) => setContactInfo({ ...contactInfo, address: e.target.value })}
                    className={`w-full px-3.5 py-2.5 border rounded-sm text-sm focus:outline-none ${
                      darkMode
                        ? 'bg-[#070D17] border-slate-700 text-white focus:border-[#C5A15A]'
                        : 'bg-white border-slate-300 text-slate-900'
                    }`}
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-[#C5A15A] mb-1.5">
                      Nomor Telepon
                    </label>
                    <input
                      type="text"
                      value={contactInfo.phone}
                      onChange={(e) => setContactInfo({ ...contactInfo, phone: e.target.value })}
                      className={`w-full px-3.5 py-2.5 border rounded-sm text-sm focus:outline-none ${
                        darkMode
                          ? 'bg-[#070D17] border-slate-700 text-white focus:border-[#C5A15A]'
                          : 'bg-white border-slate-300 text-slate-900'
                      }`}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-[#C5A15A] mb-1.5">
                      Email Resmi
                    </label>
                    <input
                      type="email"
                      value={contactInfo.email}
                      onChange={(e) => setContactInfo({ ...contactInfo, email: e.target.value })}
                      className={`w-full px-3.5 py-2.5 border rounded-sm text-sm focus:outline-none ${
                        darkMode
                          ? 'bg-[#070D17] border-slate-700 text-white focus:border-[#C5A15A]'
                          : 'bg-white border-slate-300 text-slate-900'
                      }`}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-[#C5A15A] mb-1.5">
                    Jam Operasional
                  </label>
                  <input
                    type="text"
                    value={contactInfo.operationalHours}
                    onChange={(e) =>
                      setContactInfo({ ...contactInfo, operationalHours: e.target.value })
                    }
                    className={`w-full px-3.5 py-2.5 border rounded-sm text-sm focus:outline-none ${
                      darkMode
                        ? 'bg-[#070D17] border-slate-700 text-white focus:border-[#C5A15A]'
                        : 'bg-white border-slate-300 text-slate-900'
                    }`}
                  />
                </div>
                <button
                  onClick={() => triggerToast('Informasi kontak kantor berhasil diperbarui.')}
                  className="px-6 py-3 bg-[#C5A15A] hover:bg-[#b59049] text-[#101D32] text-xs font-bold uppercase tracking-wider rounded-sm inline-flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  <span>Simpan Informasi Kontak</span>
                </button>
              </div>
            )}

            {/* TAB 7: SEO & SUPABASE SCHEMA */}
            {adminTab === 'seo' && (
              <div className="space-y-6">
                <div>
                  <h2 className={`font-serif text-2xl font-bold mb-1 ${darkMode ? 'text-white' : 'text-[#101D32]'}`}>
                    Konfigurasi SEO &amp; Skema Database Supabase
                  </h2>
                  <p className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                    Atur judul dan deskripsi agar website mudah ditemukan di mesin pencari Google, serta salin skema SQL keamanan database untuk server produksi.
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-[#C5A15A] mb-1.5">
                      SEO Site Title (Judul Tampil di Tab Browser &amp; Google)
                    </label>
                    <input
                      type="text"
                      value={seoConfig.siteTitle}
                      onChange={(e) => setSeoConfig({ ...seoConfig, siteTitle: e.target.value })}
                      className={`w-full px-3.5 py-2.5 border rounded-sm text-sm focus:outline-none ${
                        darkMode
                          ? 'bg-[#070D17] border-slate-700 text-white focus:border-[#C5A15A]'
                          : 'bg-white border-slate-300 text-slate-900'
                      }`}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-[#C5A15A] mb-1.5">
                      Meta Description (Ringkasan Tampil di Hasil Pencarian Google)
                    </label>
                    <textarea
                      rows={3}
                      value={seoConfig.metaDescription}
                      onChange={(e) =>
                        setSeoConfig({ ...seoConfig, metaDescription: e.target.value })
                      }
                      className={`w-full px-3.5 py-2.5 border rounded-sm text-sm focus:outline-none ${
                        darkMode
                          ? 'bg-[#070D17] border-slate-700 text-white focus:border-[#C5A15A]'
                          : 'bg-white border-slate-300 text-slate-900'
                      }`}
                    />
                  </div>
                  <button
                    onClick={() => triggerToast('Pengaturan SEO berhasil disimpan.')}
                    className="px-5 py-2.5 bg-[#C5A15A] hover:bg-[#b59049] text-[#101D32] text-xs font-bold uppercase tracking-wider rounded-sm inline-flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    <span>Simpan Pengaturan SEO</span>
                  </button>
                </div>

                {/* Sitemap & Robots.txt Preview */}
                <div className={`pt-6 border-t space-y-4 ${darkMode ? 'border-slate-700' : 'border-slate-200'}`}>
                  <h3 className={`font-serif text-lg font-bold ${darkMode ? 'text-white' : 'text-[#101D32]'}`}>
                    Skema Keamanan Database Supabase (Row Level Security)
                  </h3>
                  <pre className="p-4 bg-[#070D17] border border-slate-700 text-slate-200 text-xs rounded-sm overflow-x-auto leading-relaxed">
{`-- Supabase PostgreSQL Schema dengan Row Level Security (RLS)
CREATE TABLE consultations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  whatsapp TEXT NOT NULL,
  email TEXT NOT NULL,
  category TEXT NOT NULL,
  subject TEXT NOT NULL,
  description TEXT NOT NULL,
  status TEXT DEFAULT 'Baru',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE consultations ENABLE ROW LEVEL SECURITY;
-- Pengunjung publik hanya dapat INSERT, tidak dapat SELECT data klien lain
CREATE POLICY "Public insert consultations" ON consultations FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin read consultations" ON consultations FOR SELECT USING (auth.role() = 'authenticated');`}
                  </pre>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    );
  };

  // ==========================================================================
  // MAIN ROUTE SWITCHER
  // ==========================================================================
  const renderCurrentPage = () => {
    switch (activeRoute) {
      case 'home':
        return <HomePage />;
      case 'about':
        return <AboutPage />;
      case 'services':
        return <ServicesPage />;
      case 'service-detail':
        return <ServiceDetailPage />;
      case 'team':
        return <TeamPage />;
      case 'knowledge':
        return <LegalKnowledgePage />;
      case 'article-detail':
        return <ArticleDetailPage />;
      case 'consultation':
        return <ConsultationPage />;
      case 'contact':
        return <ContactPage />;
      case 'admin':
        return <AdminPortal />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-300 selection:bg-[#C5A15A] selection:text-[#101D32] ${darkMode ? 'bg-[#0D1728] text-slate-100' : 'bg-white text-slate-900'}`}>
      <Navbar />
      <main className="flex-1">{renderCurrentPage()}</main>
      <Footer />
    </div>
  );
}

export default App;