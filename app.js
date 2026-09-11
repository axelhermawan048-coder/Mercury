// Variable Global State
let currentSlide = 0;
const totalSlides = 3;
let currentSymbol = 'BTC/USD';
let currentTimeframe = '1D';
let tempDepositAmount = 0;
let tradingChart = null;

const adminAccounts = {
  "Maybank (Malayan Banking Berhad)": "5123 4567 8901",
  "CIMB Bank": "8001 2345 6789",
  "Public Bank Berhad": "3198 7654 3210",
  "RHB Bank": "2141 5900 1234",
  "Hong Leong Bank": "0030 0112 2334",
  "AmBank Group": "8881 0123 4567",
  "UOB Malaysia": "1923 4567 8901",
  "Bank Islam Malaysia": "1201 8020 3456",
  "Affin Bank": "1002 3004 5006",
  "Alliance Bank": "1401 2003 4005"
};

const mockTransactions = [
  { type: 'Deposit', amount: 'RM 500.00', status: 'Berhasil', date: '2026-03-05 14:20', id: '#DEP-9921' },
  { type: 'Withdraw', amount: 'RM 200.00', status: 'Pending', date: '2026-03-06 09:15', id: '#WD-4412' },
  { type: 'Deposit', amount: 'RM 1,000.00', status: 'Ditolak', date: '2026-03-04 18:30', id: '#DEP-8810' }
];

// DATA TRANSLATION
const translations = {
  ms: {
    contactTitle: "Hubungi Kami", depTitle: "Deposit Saldo", wdTitle: "Pengeluaran Dana", btnDep: "Teruskan & Lihat Rekening Admin", btnWd: "Mohon Pengeluaran",
    phBank: "Nombor Akaun Bank & Nama Pemilik", totalBal: "Jumlah Saldo", wdBal: "Boleh Ditarik", trdBal: "Dalam Trading", profitBal: "Keuntungan", tabOrder: "Pusat Transaksi Dana",
    newsTitle: "Berita Pasaran Terkini", navHome: "Beranda", navChart: "Pasaran", navNews: "Berita", navOrder: "Transaksi", navProfile: "Profil",
    headLogin: "Log Masuk", headSub: "Portal Perdagangan Rasmi", watchlist: "Senarai Pantauan", profLogin: "Log Masuk", profReg: "Daftar",
    mTabLogin: "Log Masuk", mTabReg: "Daftar Akaun", mEmail: "E-mel / ID Pengguna", mPass: "Kata Laluan", mBtnLogin: "Masuk",
    mFullname: "Nama Penuh", mRegEmail: "E-mel", mRegPass: "Kata Laluan", mBtnReg: "Daftar Sekarang",
    depAmount: "Jumlah (MYR)", depMethod: "Pilih Bank Malaysia (10 Bank Aktif)", wdAmount: "Jumlah Pengeluaran (MYR)", wdInfo: "Nombor Akaun Bank & Nama Pemilik",
    catAll: "Semua", catMY: "Saham MY", catUS: "Saham US", catCrypto: "Kripto", catForex: "Forex",
    kycStatus: "KYC Terverifikasi", profDepBtn: "Deposit", profWdBtn: "Withdraw",
    userBankTitle: "Maklumat Akaun Bank Saya", userBankName: "Pilih Bank", userAccNum: "Nombor Akaun Bank", userHolder: "Nama Pemilik Akaun", btnSaveBank: "Simpan Akaun Bank",
    kycTitle: "Pengesahan Identiti (KYC)", uploadKtp: "Muat Naik Foto KTP / Pasport", uploadSelfie: "Muat Naik Foto Selfie Bersama KTP", btnSubmitKyc: "Hantar Dokumen KYC",
    banner1Tag: "KEUNTUNGAN MAKSIMAL", banner1Title: "Mencapai Kejayaan Kewangan Bersama Platform Terunggul",
    banner2Tag: "PASARAN GLOBAL", banner2Title: "Pelaburan Bijak dalam Saham Malaysia, US & Kripto",
    banner3Tag: "SECURITIES RESMI", banner3Title: "Buka Rekening Saham Mercury Securities & Nikmati Komisi Rendah",
    featTitle: "Keunggulan Platform", feat1Title: "Keselamatan Tinggi", feat1Desc: "Enkripsi data ketat & verifikasi KYC terjamin.",
    feat2Title: "Data Real-Time", feat2Desc: "Pantau harga saham & kripto secara langsung.",
    quickSystem: "Sistem Eksekusi Pantas", lowSpread: "Nisbah Spread Rendah & Transaksi Selamat", exploreMkt: "Terokai Pasaran", btnMercury: "Daftar Mercury Securities",
    news1Cat: "Forex", news1Time: "10 minit lepas", news1Title: "Dolar AS Mengukuh Menjelang Keputusan Kadar Faedah Fed",
    news2Cat: "Kripto", news2Time: "45 minit lepas", news2Title: "Bitcoin Menembusi $68,000 Susulan Pengumpulan ETF",
    popTitle: "Maklumat Akaun Admin", popSub: "Sila buat pemindahan dana mengikut maklumat di bawah:",
    popBankLbl: "Bank Sasaran", popOwnerLbl: "Nama Pemilik Akaun", popAccLbl: "Nombor Akaun", popAmtLbl: "Jumlah Deposit",
    popBtnCopy: "Salin", popBtnDone: "Saya Sudah Transfer", popBtnCancel: "Batal",
    txtBuy: "BELI / BUY", txtSell: "JUAL / SELL", txtCurPrice: "Harga Terkini", txtHigh: "Tertinggi 24j", txtLow: "Terendah 24j", txtHistory: "Sejarah & Status Transaksi", txtRecent: "Terkini"
  },
  id: {
    contactTitle: "Hubungi Kami", depTitle: "Deposit Saldo", wdTitle: "Penarikan Dana", btnDep: "Lanjutkan & Lihat Rekening Admin", btnWd: "Ajukan Penarikan",
    phBank: "Nomor Rekening Bank & Nama Pemilik", totalBal: "Total Saldo", wdBal: "Bisa Ditarik", trdBal: "Dalam Trading", profitBal: "Keuntungan", tabOrder: "Pusat Transaksi Dana",
    newsTitle: "Berita Pasar Terkini", navHome: "Beranda", navChart: "Pasar", navNews: "Berita", navOrder: "Transaksi", navProfile: "Profil",
    headLogin: "Masuk", headSub: "Portal Perdagangan Resmi", watchlist: "Daftar Pantauan", profLogin: "Masuk", profReg: "Daftar",
    mTabLogin: "Masuk", mTabReg: "Daftar Akun", mEmail: "Email / ID Pengguna", mPass: "Kata Sandi", mBtnLogin: "Masuk",
    mFullname: "Nama Lengkap", mRegEmail: "Email", mRegPass: "Kata Sandi", mBtnReg: "Daftar Sekarang",
    depAmount: "Jumlah (MYR)", depMethod: "Pilih Bank Malaysia (10 Bank Aktif)", wdAmount: "Jumlah Penarikan (MYR)", wdInfo: "Nomor Rekening Bank & Nama Pemilik",
    catAll: "Semua", catMY: "Saham MY", catUS: "Saham US", catCrypto: "Kripto", catForex: "Forex",
    kycStatus: "KYC Terverifikasi", profDepBtn: "Deposit", profWdBtn: "Penarikan",
    userBankTitle: "Informasi Rekening Bank Saya", userBankName: "Pilih Bank", userAccNum: "Nomor Rekening Bank", userHolder: "Nama Pemilik Rekening", btnSaveBank: "Simpan Rekening Bank",
    kycTitle: "Verifikasi Identitas (KYC)", uploadKtp: "Unggah Foto KTP / Paspor", uploadSelfie: "Unggah Foto Selfie Memegang KTP", btnSubmitKyc: "Kirim Dokumen KYC",
    banner1Tag: "KEUNTUNGAN MAKSIMAL", banner1Title: "Mencapai Keberhasilan Keuangan Bersama Platform Terunggul",
    banner2Tag: "PASAR GLOBAL", banner2Title: "Investasi Cerdas di Saham Malaysia, US & Kripto",
    banner3Tag: "SECURITIES RESMI", banner3Title: "Buka Rekening Saham Mercury Securities & Nikmati Komisi Rendah",
    featTitle: "Keunggulan Platform", feat1Title: "Keamanan Tinggi", feat1Desc: "Enkripsi data ketat & verifikasi KYC terjamin.",
    feat2Title: "Data Real-Time", feat2Desc: "Pantau harga saham & kripto secara langsung.",
    quickSystem: "Sistem Eksekusi Cepat", lowSpread: "Rasio Spread Rendah & Transaksi Aman", exploreMkt: "Jelajahi Pasar", btnMercury: "Daftar Mercury Securities",
    news1Cat: "Forex", news1Time: "10 menit lalu", news1Title: "Dolar AS Menguat Menjelang Keputusan Suku Bunga Fed",
    news2Cat: "Kripto", news2Time: "45 menit lalu", news2Title: "Bitcoin Tembus $68,000 Menyusul Akumulasi ETF",
    popTitle: "Informasi Rekening Admin", popSub: "Silakan lakukan transfer dana sesuai informasi di bawah ini:",
    popBankLbl: "Bank Tujuan", popOwnerLbl: "Nama Pemilik Rekening", popAccLbl: "Nomor Rekening", popAmtLbl: "Jumlah Deposit",
    popBtnCopy: "Salin", popBtnDone: "Saya Sudah Transfer", popBtnCancel: "Batal",
    txtBuy: "BELI / BUY", txtSell: "JUAL / SELL", txtCurPrice: "Harga Terkini", txtHigh: "Tertinggi 24j", txtLow: "Terendah 24j", txtHistory: "Riwayat & Status Transaksi", txtRecent: "Terkini"
  },
  en: {
    contactTitle: "Contact Us", depTitle: "Deposit Funds", wdTitle: "Withdraw Funds", btnDep: "Proceed & View Admin Account", btnWd: "Request Withdrawal",
    phBank: "Bank Account Number & Holder Name", totalBal: "Total Balance", wdBal: "Withdrawable", trdBal: "In Trading", profitBal: "Profit", tabOrder: "Fund Transaction Center",
    newsTitle: "Latest Market News", navHome: "Home", navChart: "Markets", navNews: "News", navOrder: "Transactions", navProfile: "Profile",
    headLogin: "Login", headSub: "Official Trading Portal", watchlist: "Watchlist", profLogin: "Login", profReg: "Register",
    mTabLogin: "Login", mTabReg: "Register Account", mEmail: "Email / User ID", mPass: "Password", mBtnLogin: "Sign In",
    mFullname: "Full Name", mRegEmail: "Email", mRegPass: "Password", mBtnReg: "Register Now",
    depAmount: "Amount (MYR)", depMethod: "Select Malaysia Bank (10 Active Banks)", wdAmount: "Withdrawal Amount (MYR)", wdInfo: "Bank Account Number & Holder Name",
    catAll: "All", catMY: "MY Stocks", catUS: "US Stocks", catCrypto: "Crypto", catForex: "Forex",
    kycStatus: "KYC Verified", profDepBtn: "Deposit", profWdBtn: "Withdraw",
    userBankTitle: "My Bank Account Information", userBankName: "Select Bank", userAccNum: "Bank Account Number", userHolder: "Account Holder Name", btnSaveBank: "Save Bank Account",
    kycTitle: "Identity Verification (KYC)", uploadKtp: "Upload ID Card / Passport", uploadSelfie: "Upload Selfie Holding ID Card", btnSubmitKyc: "Submit KYC Documents",
    banner1Tag: "MAXIMUM PROFIT", banner1Title: "Achieve Financial Success with the Leading Platform",
    banner2Tag: "GLOBAL MARKETS", banner2Title: "Smart Investment in Malaysia, US Stocks & Crypto",
    banner3Tag: "OFFICIAL SECURITIES", banner3Title: "Open Mercury Securities Stock Account & Enjoy Low Fees",
    featTitle: "Platform Features", feat1Title: "High Security", feat1Desc: "Strict data encryption & guaranteed KYC verification.",
    feat2Title: "Real-Time Data", feat2Desc: "Monitor stock & crypto prices in real-time.",
    quickSystem: "Fast Execution System", lowSpread: "Low Spread Ratio & Secure Transactions", exploreMkt: "Explore Markets", btnMercury: "Join Mercury Securities",
    news1Cat: "Forex", news1Time: "10 mins ago", news1Title: "US Dollar Strengthens Ahead of Fed Interest Rate Decision",
    news2Cat: "Crypto", news2Time: "45 mins ago", news2Title: "Bitcoin Surges Past $68,000 Following ETF Accumulation",
    popTitle: "Admin Account Information", popSub: "Please transfer funds according to the details below:",
    popBankLbl: "Target Bank", popOwnerLbl: "Account Holder Name", popAccLbl: "Account Number", popAmtLbl: "Deposit Amount",
    popBtnCopy: "Copy", popBtnDone: "I Have Transferred", popBtnCancel: "Cancel",
    txtBuy: "BUY", txtSell: "SELL", txtCurPrice: "Current Price", txtHigh: "24h High", txtLow: "24h Low", txtHistory: "Transaction History & Status", txtRecent: "Recent"
  },
  zh: {
    contactTitle: "联系我们", depTitle: "账户充值", wdTitle: "资金提现", btnDep: "继续并查看管理员账户", btnWd: "申请提现",
    phBank: "银行账号及户名", totalBal: "总余额", wdBal: "可提现", trdBal: "交易中", profitBal: "总盈利", tabOrder: "资金交易中心",
    newsTitle: "最新市场新闻", navHome: "首页", navChart: "市场", navNews: "新闻", navOrder: "交易", navProfile: "个人",
    headLogin: "登录", headSub: "官方交易门户", watchlist: "自选关注", profLogin: "登录", profReg: "注册",
    mTabLogin: "登录", mTabReg: "注册账户", mEmail: "电子邮件 / 用户ID", mPass: "密码", mBtnLogin: "登录",
    mFullname: "全名", mRegEmail: "电子邮件", mRegPass: "密码", mBtnReg: "立即注册",
    depAmount: "金额 (MYR)", depMethod: "选择马来西亚银行 (10家活跃银行)", wdAmount: "提现金额 (MYR)", wdInfo: "银行账号及户名",
    catAll: "全部", catMY: "大马股票", catUS: "美股", catCrypto: "加密货币", catForex: "外汇",
    kycStatus: "KYC 已认证", profDepBtn: "充值", profWdBtn: "提现",
    userBankTitle: "我的银行账户信息", userBankName: "选择银行", userAccNum: "银行账号", userHolder: "账户姓名", btnSaveBank: "保存银行账户",
    kycTitle: "身份认证 (KYC)", uploadKtp: "上传身份证 / 护照", uploadSelfie: "上传手持身份证自拍照", btnSubmitKyc: "提交 KYC 文件",
    banner1Tag: "最大利润", banner1Title: "与领先平台共创财务成功",
    banner2Tag: "全球市场", banner2Title: "明智投资马来西亚股票、美股及加密货币",
    banner3Tag: "官方证券", banner3Title: "开立 Mercury 证券股票账户，享受超低手续费",
    featTitle: "平台优势", feat1Title: "高度安全", feat1Desc: "严格的数据加密与KYC认证保障。",
    feat2Title: "实时数据", feat2Desc: "实时监控股票与加密货币价格。",
    quickSystem: "快速执行系统", lowSpread: "低点差与安全交易", exploreMkt: "探索市场", btnMercury: "注册 Mercury 证券",
    news1Cat: "外汇", news1Time: "10分钟前", news1Title: "美联储利率决议前夕，美元走强",
    news2Cat: "加密货币", news2Time: "45分钟前", news2Title: "在ETF持续积累下，比特币突破68,000美元",
    popTitle: "管理员账户信息", popSub: "请根据以下信息转账：",
    popBankLbl: "目标银行", popOwnerLbl: "账户姓名", popAccLbl: "银行账号", popAmtLbl: "充值金额",
    popBtnCopy: "复制", popBtnDone: "我已转账", popBtnCancel: "取消",
    txtBuy: "买入 / BUY", txtSell: "卖出 / SELL", txtCurPrice: "当前价格", txtHigh: "24小时最高", txtLow: "24小时最低", txtHistory: "交易历史与状态", txtRecent: "最新"
  }
};

// CHART DATA
const chartDataMap = {
  'BTC/USD': {
    name: 'Bitcoin / US Dollar', change: '+3.12%', price: '$68,400.00', high: '$69,150.00', low: '$66,200.00',
    labels: { '1D': ['10:00', '11:00', '12:00', '13:00', '14:00', '15:00'], '1W': ['SEN', 'SEL', 'RAB', 'KAM', 'JUM', 'SAB'], '1M': ['M1', 'M2', 'M3', 'M4'], '1Y': ['B1', 'B2', 'B3', 'B4'] },
    data: { '1D': [65000, 66200, 65800, 67400, 67100, 68400], '1W': [62000, 63500, 64000, 66000, 65500, 68400], '1M': [58000, 61000, 64000, 68400], '1Y': [35000, 48000, 52000, 68400] }
  },
  'ETH/USD': {
    name: 'Ethereum / US Dollar', change: '+2.45%', price: '$3,520.00', high: '$3,580.00', low: '$3,410.00',
    labels: { '1D': ['10:00', '11:00', '12:00', '13:00', '14:00', '15:00'], '1W': ['SEN', 'SEL', 'RAB', 'KAM', 'JUM', 'SAB'], '1M': ['M1', 'M2', 'M3', 'M4'], '1Y': ['B1', 'B2', 'B3', 'B4'] },
    data: { '1D': [3300, 3380, 3350, 3450, 3420, 3520], '1W': [3100, 3200, 3300, 3250, 3400, 3520], '1M': [2800, 3000, 3200, 3520], '1Y': [1800, 2400, 3000, 3520] }
  },
  'MAYBANK.KL': {
    name: 'Malayan Banking Bhd', change: '+1.80%', price: 'RM 10.20', high: 'RM 10.35', low: 'RM 9.90',
    labels: { '1D': ['10:00', '11:00', '12:00', '13:00', '14:00', '15:00'], '1W': ['SEN', 'SEL', 'RAB', 'KAM', 'JUM', 'SAB'], '1M': ['M1', 'M2', 'M3', 'M4'], '1Y': ['B1', 'B2', 'B3', 'B4'] },
    data: { '1D': [9.90, 10.00, 9.95, 10.10, 10.05, 10.20], '1W': [9.70, 9.80, 9.90, 10.00, 10.10, 10.20], '1M': [9.50, 9.80, 10.00, 10.20], '1Y': [8.80, 9.20, 9.70, 10.20] }
  },
  'TENAGA.KL': {
    name: 'Tenaga Nasional Bhd', change: '+0.90%', price: 'RM 13.90', high: 'RM 14.10', low: 'RM 13.50',
    labels: { '1D': ['10:00', '11:00', '12:00', '13:00', '14:00', '15:00'], '1W': ['SEN', 'SEL', 'RAB', 'KAM', 'JUM', 'SAB'], '1M': ['M1', 'M2', 'M3', 'M4'], '1Y': ['B1', 'B2', 'B3', 'B4'] },
    data: { '1D': [13.50, 13.60, 13.55, 13.80, 13.75, 13.90], '1W': [13.10, 13.30, 13.50, 13.70, 13.80, 13.90], '1M': [12.50, 13.00, 13.40, 13.90], '1Y': [10.50, 11.80, 12.90, 13.90] }
  },
  'AAPL': {
    name: 'Apple Inc.', change: '+2.50%', price: '$224.30', high: '$226.00', low: '$218.50',
    labels: { '1D': ['10:00', '11:00', '12:00', '13:00', '14:00', '15:00'], '1W': ['SEN', 'SEL', 'RAB', 'KAM', 'JUM', 'SAB'], '1M': ['M1', 'M2', 'M3', 'M4'], '1Y': ['B1', 'B2', 'B3', 'B4'] },
    data: { '1D': [215, 218, 216, 221, 220, 224.3], '1W': [208, 212, 215, 218, 220, 224.3], '1M': [195, 205, 215, 224.3], '1Y': [170, 185, 200, 224.3] }
  },
  'NVDA': {
    name: 'NVIDIA Corporation', change: '+4.20%', price: '$128.50', high: '$130.00', low: '$121.00',
    labels: { '1D': ['10:00', '11:00', '12:00', '13:00', '14:00', '15:00'], '1W': ['SEN', 'SEL', 'RAB', 'KAM', 'JUM', 'SAB'], '1M': ['M1', 'M2', 'M3', 'M4'], '1Y': ['B1', 'B2', 'B3', 'B4'] },
    data: { '1D': [118, 122, 120, 125, 124, 128.5], '1W': [110, 115, 120, 122, 125, 128.5], '1M': [95, 105, 115, 128.5], '1Y': [50, 75, 100, 128.5] }
  },
  'EUR/USD': {
    name: 'Euro / US Dollar', change: '+0.20%', price: '1.0850', high: '1.0890', low: '1.0810',
    labels: { '1D': ['10:00', '11:00', '12:00', '13:00', '14:00', '15:00'], '1W': ['SEN', 'SEL', 'RAB', 'KAM', 'JUM', 'SAB'], '1M': ['M1', 'M2', 'M3', 'M4'], '1Y': ['B1', 'B2', 'B3', 'B4'] },
    data: { '1D': [1.0810, 1.0825, 1.0820, 1.0840, 1.0835, 1.0850], '1W': [1.0750, 1.0780, 1.0800, 1.0820, 1.0830, 1.0850], '1M': [1.0650, 1.0720, 1.0800, 1.0850], '1Y': [1.0400, 1.0600, 1.0750, 1.0850] }
  }
};

const watchlistData = [
  { symbol: 'BTC/USD', name: 'Bitcoin', category: 'crypto', price: '$68,400.00', change: '+3.12%', vol: '$1.2B', icon: '₿', bg: 'bg-amber-500/20', text: 'text-amber-400' },
  { symbol: 'ETH/USD', name: 'Ethereum', category: 'crypto', price: '$3,520.00', change: '+2.45%', vol: '$800M', icon: 'Ξ', bg: 'bg-purple-500/20', text: 'text-purple-400' },
  { symbol: 'MAYBANK.KL', name: 'Maybank', category: 'saham-my', price: 'RM 10.20', change: '+1.80%', vol: 'RM 45M', icon: 'M', bg: 'bg-yellow-500/20', text: 'text-yellow-400' },
  { symbol: 'TENAGA.KL', name: 'Tenaga Nasional', category: 'saham-my', price: 'RM 13.90', change: '+0.90%', vol: 'RM 28M', icon: 'T', bg: 'bg-blue-500/20', text: 'text-blue-400' },
  { symbol: 'AAPL', name: 'Apple Inc.', category: 'saham-us', price: '$224.30', change: '+2.50%', vol: '$3.5B', icon: '', bg: 'bg-slate-500/20', text: 'text-slate-300' },
  { symbol: 'NVDA', name: 'Nvidia Corp', category: 'saham-us', price: '$128.50', change: '+4.20%', vol: '$5.1B', icon: 'N', bg: 'bg-emerald-500/20', text: 'text-emerald-400' },
  { symbol: 'EUR/USD', name: 'Euro / USD', category: 'forex', price: '1.0850', change: '+0.20%', vol: '$12B', icon: '€', bg: 'bg-indigo-500/20', text: 'text-indigo-400' }
];

// FUNGSI SLIDER & TABS
function moveSlide(direction) {
  currentSlide = (currentSlide + direction + totalSlides) % totalSlides;
  updateSlider();
}

function updateSlider() {
  const container = document.getElementById('slider-container');
  if (container) {
    container.style.transform = `translateX(-${(currentSlide * 100) / totalSlides}%)`;
    const dot0 = document.getElementById('dot-0');
    const dot1 = document.getElementById('dot-1');
    const dot2 = document.getElementById('dot-2');
    if (dot0) dot0.className = currentSlide === 0 ? "w-2 h-2 rounded-full bg-emerald-400" : "w-2 h-2 rounded-full bg-slate-500";
    if (dot1) dot1.className = currentSlide === 1 ? "w-2 h-2 rounded-full bg-emerald-400" : "w-2 h-2 rounded-full bg-slate-500";
    if (dot2) dot2.className = currentSlide === 2 ? "w-2 h-2 rounded-full bg-emerald-400" : "w-2 h-2 rounded-full bg-slate-500";
  }
}

function switchTab(tabName) {
  document.querySelectorAll('.tab-content').forEach(el => el.classList.add('hidden'));
  document.querySelectorAll('.nav-btn').forEach(el => {
    el.classList.remove('text-emerald-400');
    el.classList.add('text-slate-400');
  });

  const targetTab = document.getElementById('tab-' + tabName);
  const targetNav = document.getElementById('nav-' + tabName);
  if (targetTab) targetTab.classList.remove('hidden');
  if (targetNav) {
    targetNav.classList.remove('text-slate-400');
    targetNav.classList.add('text-emerald-400');
  }
}

function goToTransaction(type) {
  switchTab('order');
  switchSubTab(type);
}

function switchSubTab(subTab) {
  const depTab = document.getElementById('subtab-deposit');
  const wdTab = document.getElementById('subtab-withdraw');
  const statusTab = document.getElementById('subtab-status');

  if (depTab) depTab.classList.add('hidden');
  if (wdTab) wdTab.classList.add('hidden');
  if (statusTab) statusTab.classList.add('hidden');

  ['dep', 'wd', 'status'].forEach(btn => {
    const el = document.getElementById('subtab-btn-' + btn);
    if (el) el.className = "w-1/3 py-2 rounded-lg text-slate-400 hover:text-white transition";
  });

  if (subTab === 'deposit') {
    if (depTab) depTab.classList.remove('hidden');
    const btnDep = document.getElementById('subtab-btn-dep');
    if (btnDep) btnDep.className = "w-1/3 py-2 rounded-lg bg-emerald-500 text-white font-bold transition";
  } else if (subTab === 'withdraw') {
    if (wdTab) wdTab.classList.remove('hidden');
    const btnWd = document.getElementById('subtab-btn-wd');
    if (btnWd) btnWd.className = "w-1/3 py-2 rounded-lg bg-rose-500 text-white font-bold transition";
  } else {
    if (statusTab) statusTab.classList.remove('hidden');
    const btnStatus = document.getElementById('subtab-btn-status');
    if (btnStatus) btnStatus.className = "w-1/3 py-2 rounded-lg bg-blue-500 text-white font-bold transition";
    renderTransactionHistory();
  }
}

// FUNGSI MODAL POPUP (KYC)
function openKycModal() {
  const modal = document.getElementById('kycModal');
  if (modal) {
    modal.classList.remove('hidden');
    modal.classList.add('active');
  }
}

function closeKycModal() {
  const modal = document.getElementById('kycModal');
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('active');
  }
}

// FUNGSI MODAL DEPOSIT & TRANSACTION
function handleDepositSubmit(e) {
  e.preventDefault();
  const amountInput = document.getElementById('dep-amount-input');
  const bankSelect = document.getElementById('dep-bank-select');
  
  const amount = amountInput ? amountInput.value : 0;
  const selectedBank = bankSelect ? bankSelect.value : "Maybank (Malayan Banking Berhad)";
  
  tempDepositAmount = amount;
  const popBank = document.getElementById('pop-bank-name');
  const popAcc = document.getElementById('pop-acc-num');
  const popAmt = document.getElementById('pop-dep-amount');

  if (popBank) popBank.innerText = selectedBank;
  if (popAcc) popAcc.innerText = adminAccounts[selectedBank] || "5123 4567 8901";
  if (popAmt) popAmt.innerText = `RM ${parseFloat(amount || 0).toFixed(2)}`;

  const modal = document.getElementById('depositModal');
  if (modal) {
    modal.classList.remove('hidden');
    modal.classList.add('active');
  }
}

function closeDepositModal() {
  const modal = document.getElementById('depositModal');
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('active');
  }
}

function copyAccNumber() {
  const accNumEl = document.getElementById('pop-acc-num');
  const accNum = accNumEl ? accNumEl.innerText.replace(/\s/g, '') : "";
  
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(accNum).then(() => {
      alert('Nomor rekening berhasil disalin: ' + accNum);
    }).catch(() => {
      fallbackCopyText(accNum);
    });
  } else {
    fallbackCopyText(accNum);
  }
}

function fallbackCopyText(text) {
  const textArea = document.createElement("textarea");
  textArea.value = text;
  document.body.appendChild(textArea);
  textArea.select();
  try {
    document.execCommand('copy');
    alert('Nomor rekening berhasil disalin: ' + text);
  } catch (err) {
    alert('Gagal menyalin nomor rekening.');
  }
  document.body.removeChild(textArea);
}

function confirmDepositPayment() {
  mockTransactions.unshift({
    type: 'Deposit',
    amount: `RM ${parseFloat(tempDepositAmount || 0).toFixed(2)}`,
    status: 'Pending',
    date: new Date().toISOString().replace('T', ' ').substring(0, 16),
    id: '#DEP-' + Math.floor(1000 + Math.random() * 9000)
  });
  closeDepositModal();
  alert('Permintaan deposit telah dikirim! Status transaksi Anda saat ini "Pending".');
  switchSubTab('status');
}

function handleWithdrawSubmit(e) {
  e.preventDefault();
  const amountInput = e.target.querySelector('input[type="number"]');
  const val = amountInput ? amountInput.value : 0;
  mockTransactions.unshift({
    type: 'Withdraw',
    amount: 'RM ' + parseFloat(val || 0).toFixed(2),
    status: 'Pending',
    date: new Date().toISOString().replace('T', ' ').substring(0, 16),
    id: '#WD-' + Math.floor(1000 + Math.random() * 9000)
  });
  alert('Permintaan penarikan berhasil dikirim!');
  switchSubTab('status');
}

// HANDLER FORM INFORMASI BANK USER & KYC
function handleBankInfoSubmit(e) {
  e.preventDefault();
  const bankName = document.getElementById('user-bank-select').value;
  const accNum = document.getElementById('user-acc-input').value;
  const holderName = document.getElementById('user-holder-input').value;

  alert(`Informasi Rekening Bank Berhasil Disimpan!\n\nBank: ${bankName}\nNo. Rekening: ${accNum}\nPemilik: ${holderName}`);
}

function handleKYCSubmit(e) {
  e.preventDefault();
  const ktpInput = document.getElementById('input-ktp');
  const selfieInput = document.getElementById('input-selfie');

  const ktpFile = ktpInput ? ktpInput.files[0] : null;
  const selfieFile = selfieInput ? selfieInput.files[0] : null;

  if (!ktpFile || !selfieFile) {
    alert('Sila unggah foto KTP dan Selfie!');
    return;
  }

  alert('Dokumen KYC Anda telah berhasil diunggah dan sedang dalam proses verifikasi oleh tim Admin.');
}

function handlePopupKycSubmit(e) {
  e.preventDefault();
  alert('Data Rekening Bank dan Dokumen KYC Berhasil Dikirim untuk Verifikasi!');
  closeKycModal();
}

function renderTransactionHistory() {
  const container = document.getElementById('transaction-history-list');
  if (!container) return;
  container.innerHTML = '';

  mockTransactions.forEach(item => {
    let badge = '';
    let csButton = '';

    if (item.status === 'Berhasil') {
      badge = `<span class="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[9px] px-2 py-0.5 rounded font-bold">Berhasil</span>`;
    } else if (item.status === 'Pending') {
      badge = `<span class="bg-amber-500/20 text-amber-400 border border-amber-500/30 text-[9px] px-2 py-0.5 rounded font-bold">Pending</span>`;
    } else {
      badge = `<span class="bg-rose-500/20 text-rose-400 border border-rose-500/30 text-[9px] px-2 py-0.5 rounded font-bold">Ditolak</span>`;
      csButton = `
        <a href="https://wa.me/60123456789?text=Halo%20CS,%20transaksi%20saya%20${item.id}%20ditolak" target="_blank" class="mt-2 block w-full text-center bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 text-[10px] py-1 rounded font-semibold transition">
          <i data-feather="help-circle" class="w-3 h-3 inline mr-1"></i> Hubungi Customer Service
        </a>
      `;
    }

    const div = document.createElement('div');
    div.className = "bg-slate-800 p-3 rounded-xl border border-slate-700/80 space-y-1";
    div.innerHTML = `
      <div class="flex justify-between items-center">
        <div class="flex items-center space-x-2">
          <span class="font-bold text-xs text-white">${item.type}</span>
          <span class="text-[10px] text-slate-400">${item.id}</span>
        </div>
        ${badge}
      </div>
      <div class="flex justify-between items-center text-xs pt-1">
        <span class="font-bold ${item.type === 'Deposit' ? 'text-emerald-400' : 'text-rose-400'}">${item.amount}</span>
        <span class="text-[10px] text-slate-400">${item.date}</span>
      </div>
      ${csButton}
    `;
    container.appendChild(div);
  });
  if (window.feather) feather.replace();
}

function openAuthModal(type) {
  const modal = document.getElementById('authModal');
  if (modal) {
    modal.classList.remove('hidden');
    modal.classList.add('active');
  }
  toggleAuthForm(type);
}

function closeAuthModal() {
  const modal = document.getElementById('authModal');
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('active');
  }
}

function toggleAuthForm(type) {
  const fLogin = document.getElementById('form-login');
  const fReg = document.getElementById('form-register');
  const tLogin = document.getElementById('modal-tab-login');
  const tReg = document.getElementById('modal-tab-reg');

  if (type === 'login') {
    if (fLogin) fLogin.classList.remove('hidden');
    if (fReg) fReg.classList.add('hidden');
    if (tLogin) tLogin.className = "w-1/2 text-center font-bold text-emerald-400 border-b-2 border-emerald-400 pb-1 text-xs";
    if (tReg) tReg.className = "w-1/2 text-center font-bold text-slate-400 pb-1 text-xs";
  } else {
    if (fLogin) fLogin.classList.add('hidden');
    if (fReg) fReg.classList.remove('hidden');
    if (tReg) tReg.className = "w-1/2 text-center font-bold text-emerald-400 border-b-2 border-emerald-400 pb-1 text-xs";
    if (tLogin) tLogin.className = "w-1/2 text-center font-bold text-slate-400 pb-1 text-xs";
  }
}

// MULTI-LANGUAGE SYSTEM
function changeLanguage(lang) {
  const t = translations[lang];
  if (!t) return;

  const setHtml = (id, html) => {
    const el = document.getElementById(id);
    if (el) el.innerHTML = html;
  };

  const setTxt = (id, txt) => {
    const el = document.getElementById(id);
    if (el) el.innerText = txt;
  };

  setTxt('lbl-contact-title', t.contactTitle);
  setTxt('lbl-dep-title', t.depTitle);
  setTxt('lbl-wd-title', t.wdTitle);
  setTxt('btn-deposit', t.btnDep);
  setTxt('btn-withdraw', t.btnWd);
  
  const phBank = document.getElementById('ph-bank');
  if (phBank) phBank.placeholder = t.phBank;

  setTxt('lbl-total-balance', t.totalBal);
  setTxt('lbl-withdraw-balance', t.wdBal);
  setTxt('lbl-trading-balance', t.trdBal);
  setTxt('lbl-profit-balance', t.profitBal);
  setTxt('lbl-tab-order', t.tabOrder);
  setTxt('lbl-news-title', t.newsTitle);
  setTxt('btn-head-login', t.headLogin);
  setTxt('lbl-head-sub', t.headSub);
  setTxt('lbl-watchlist', t.watchlist);
  
  setTxt('btn-prof-login', t.profLogin);
  setTxt('btn-prof-reg', t.profReg);

  setTxt('modal-tab-login', t.mTabLogin);
  setTxt('modal-tab-reg', t.mTabReg);
  setTxt('lbl-modal-email', t.mEmail);
  setTxt('lbl-modal-pass', t.mPass);
  setTxt('btn-modal-login', t.mBtnLogin);
  setTxt('lbl-modal-fullname', t.mFullname);
  setTxt('lbl-modal-reg-email', t.mRegEmail);
  setTxt('lbl-modal-reg-pass', t.mRegPass);
  setTxt('btn-modal-reg', t.mBtnReg);

  setTxt('lbl-dep-amount', t.depAmount);
  setTxt('lbl-dep-method', t.depMethod);
  setTxt('lbl-wd-amount', t.wdAmount);
  setTxt('lbl-wd-info', t.wdInfo);

  setTxt('cat-all', t.catAll);
  setTxt('cat-saham-my', t.catMY);
  setTxt('cat-saham-us', t.catUS);
  setTxt('cat-crypto', t.catCrypto);
  setTxt('cat-forex', t.catForex);

  setTxt('nav-lbl-home', t.navHome);
  setTxt('nav-lbl-chart', t.navChart);
  setTxt('nav-lbl-news', t.navNews);
  setTxt('nav-lbl-order', t.navOrder);
  setTxt('nav-lbl-profile', t.navProfile);

  setTxt('lbl-kyc-status', t.kycStatus);
  setTxt('btn-prof-dep', t.profDepBtn);
  setTxt('btn-prof-wd', t.profWdBtn);

  setHtml('lbl-user-bank-title', `<i data-feather="credit-card" class="w-4 h-4 mr-1.5 text-emerald-400"></i> ${t.userBankTitle}`);
  setTxt('lbl-user-bank-name', t.userBankName);
  setTxt('lbl-user-acc-num', t.userAccNum);
  setTxt('lbl-user-acc-holder', t.userHolder);
  setTxt('btn-save-bank', t.btnSaveBank);

  setHtml('lbl-kyc-verify-title', `<i data-feather="shield-check" class="w-4 h-4 mr-1.5 text-emerald-400"></i> ${t.kycTitle}`);
  setTxt('lbl-upload-ktp', t.uploadKtp);
  setTxt('lbl-upload-selfie', t.uploadSelfie);
  setTxt('btn-submit-kyc', t.btnSubmitKyc);

  setTxt('lbl-banner1-tag', t.banner1Tag);
  setTxt('lbl-banner1-title', t.banner1Title);
  setTxt('lbl-banner2-tag', t.banner2Tag);
  setTxt('lbl-banner2-title', t.banner2Title);
  setTxt('lbl-banner3-tag', t.banner3Tag);
  setTxt('lbl-banner3-title', t.banner3Title);
  setTxt('lbl-feat-title', t.featTitle);
  setTxt('lbl-feat1-title', t.feat1Title);
  setTxt('lbl-feat1-desc', t.feat1Desc);
  setTxt('lbl-feat2-title', t.feat2Title);
  setTxt('lbl-feat2-desc', t.feat2Desc);
  setTxt('lbl-quick-sys', t.quickSystem);
  setTxt('lbl-low-spread', t.lowSpread);
  setTxt('btn-explore-mkt', t.exploreMkt);
  setTxt('btn-mercury-sec', t.btnMercury);

  setTxt('lbl-news1-cat', t.news1Cat);
  setTxt('lbl-news1-time', t.news1Time);
  setTxt('lbl-news1-title', t.news1Title);
  setTxt('lbl-news2-cat', t.news2Cat);
  setTxt('lbl-news2-time', t.news2Time);
  setTxt('lbl-news2-title', t.news2Title);

  setTxt('lbl-pop-title', t.popTitle);
  setTxt('lbl-pop-sub', t.popSub);
  setTxt('lbl-pop-bank', t.popBankLbl);
  setTxt('lbl-pop-owner', t.popOwnerLbl);
  setTxt('lbl-pop-acc', t.popAccLbl);
  setTxt('lbl-pop-amt', t.popAmtLbl);
  setTxt('btn-pop-copy', t.popBtnCopy);
  setTxt('btn-pop-done', t.popBtnDone);
  setTxt('btn-pop-cancel', t.popBtnCancel);

  setTxt('lbl-txt-curprice', t.txtCurPrice);
  setTxt('lbl-txt-high', t.txtHigh);
  setTxt('lbl-txt-low', t.txtLow);
  setTxt('lbl-txt-history', t.txtHistory);
  setTxt('lbl-txt-recent', t.txtRecent);
  setHtml('btn-action-buy', `<i data-feather="trending-up" class="w-3.5 h-3.5 mr-1"></i> ${t.txtBuy}`);
  setHtml('btn-action-sell', `<i data-feather="trending-down" class="w-3.5 h-3.5 mr-1"></i> ${t.txtSell}`);

  if (window.feather) feather.replace();
}

// CHART & WATCHLIST MANAGEMENT
function updateChartSymbol(symbol) {
  currentSymbol = symbol;
  const dataObj = chartDataMap[symbol];
  if (dataObj && tradingChart) {
    const elSym = document.getElementById('lbl-symbol');
    const elSub = document.getElementById('lbl-subname');
    const elChg = document.getElementById('lbl-change');
    const elPrc = document.getElementById('lbl-price');
    const elHgh = document.getElementById('lbl-high');
    const elLow = document.getElementById('lbl-low');

    if (elSym) elSym.innerText = symbol;
    if (elSub) elSub.innerText = dataObj.name;
    if (elChg) elChg.innerText = dataObj.change;
    if (elPrc) elPrc.innerText = dataObj.price;
    if (elHgh) elHgh.innerText = dataObj.high;
    if (elLow) elLow.innerText = dataObj.low;

    tradingChart.data.labels = dataObj.labels[currentTimeframe];
    tradingChart.data.datasets[0].data = dataObj.data[currentTimeframe];
    tradingChart.update();
  }
}

function changeTimeframe(tf) {
  currentTimeframe = tf;
  ['1D', '1W', '1M', '1Y'].forEach(item => {
    const btn = document.getElementById('tf-' + item);
    if (btn) {
      if (item === tf) {
        btn.className = "bg-emerald-500 text-white font-bold px-2 py-0.5 rounded transition";
      } else {
        btn.className = "bg-slate-700 text-slate-300 hover:text-white px-2 py-0.5 rounded transition";
      }
    }
  });

  const dataObj = chartDataMap[currentSymbol];
  if (dataObj && dataObj.data[tf] && tradingChart) {
    tradingChart.data.labels = dataObj.labels[tf];
    tradingChart.data.datasets[0].data = dataObj.data[tf];
    tradingChart.update();
  }
}

function filterCategory(cat) {
  ['all', 'saham-my', 'saham-us', 'crypto', 'forex'].forEach(c => {
    const btn = document.getElementById('cat-' + c);
    if (btn) {
      if (c === cat) {
        btn.className = "bg-emerald-500 text-white font-bold px-2.5 py-1 rounded-full whitespace-nowrap transition";
      } else {
        btn.className = "bg-slate-800 border border-slate-700 text-slate-300 px-2.5 py-1 rounded-full whitespace-nowrap transition";
      }
    }
  });

  renderWatchlist(cat);
}

function renderWatchlist(category) {
  const container = document.getElementById('watchlist-container');
  if (!container) return;
  container.innerHTML = '';

  const filtered = category === 'all' ? watchlistData : watchlistData.filter(item => item.category === category);

  filtered.forEach(item => {
    const div = document.createElement('div');
    div.className = "bg-slate-800 p-2.5 rounded-xl border border-slate-700/80 flex justify-between items-center cursor-pointer hover:border-slate-600 transition";
    div.onclick = () => {
      const select = document.getElementById('symbolSelect');
      if (select) select.value = item.symbol;
      updateChartSymbol(item.symbol);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    div.innerHTML = `
      <div class="flex items-center space-x-2.5">
        <div class="w-8 h-8 ${item.bg} ${item.text} rounded-full flex items-center justify-center font-bold text-xs">${item.icon}</div>
        <div>
          <p class="font-bold text-xs text-white">${item.symbol}</p>
          <p class="text-[10px] text-slate-400">Vol: ${item.vol}</p>
        </div>
      </div>
      <div class="text-right">
        <p class="font-bold text-xs text-white">${item.price}</p>
        <p class="text-[10px] text-emerald-400 font-semibold">${item.change} ▲</p>
      </div>
    `;
    container.appendChild(div);
  });
}

function initLanguage() {
  const select = document.getElementById('langSelect');
  const initialLang = select ? select.value : 'ms';
  changeLanguage(initialLang);
}

// INISIALISASI UTAMA (DOM READY)
document.addEventListener('DOMContentLoaded', () => {
  if (window.feather) feather.replace();

  // Inisialisasi ChartJS
  const chartCanvas = document.getElementById('tradingChart');
  if (chartCanvas) {
    const ctx = chartCanvas.getContext('2d');
    tradingChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: chartDataMap['BTC/USD'].labels['1D'],
        datasets: [{
          data: chartDataMap['BTC/USD'].data['1D'],
          borderColor: '#10b981',
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          borderWidth: 2,
          fill: true,
          tension: 0.3,
          pointRadius: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: { grid: { color: 'rgba(51, 65, 85, 0.3)' }, ticks: { color: '#94a3b8', font: { size: 10 } } },
          y: { grid: { color: 'rgba(51, 65, 85, 0.3)' }, ticks: { color: '#94a3b8', font: { size: 10 } } }
        }
      }
    });
  }

  // Auto Slider
  setInterval(() => { moveSlide(1); }, 5000);

  // Render awal UI
  renderWatchlist('all');
  initLanguage();
});

// EKSPOR FUNGSI KE GLOBAL WINDOW
window.moveSlide = moveSlide;
window.switchTab = switchTab;
window.goToTransaction = goToTransaction;
window.switchSubTab = switchSubTab;
window.handleDepositSubmit = handleDepositSubmit;
window.closeDepositModal = closeDepositModal;
window.copyAccNumber = copyAccNumber;
window.confirmDepositPayment = confirmDepositPayment;
window.handleWithdrawSubmit = handleWithdrawSubmit;
window.openKycModal = openKycModal;
window.closeKycModal = closeKycModal;
window.handleBankInfoSubmit = handleBankInfoSubmit;
window.handleKYCSubmit = handleKYCSubmit;
window.handlePopupKycSubmit = handlePopupKycSubmit;
window.openAuthModal = openAuthModal;
window.closeAuthModal = closeAuthModal;
window.toggleAuthForm = toggleAuthForm;
window.changeLanguage = changeLanguage;
window.updateChartSymbol = updateChartSymbol;
window.changeTimeframe = changeTimeframe;
window.filterCategory = filterCategory;
