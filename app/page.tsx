'use client';
import { useState, useEffect, FormEvent } from 'react';

interface UserData {
  userId?: string;
  _id?: string;
  name: string;
  email: string;
  balance?: number;
  kycStatus?: string;
  bankInfo?: {
    bankName: string;
    accNumber: string;
    holderName: string;
  };
}

interface Transaction {
  trxId: string;
  type: string;
  amount: number;
  status: string;
  createdAt: string;
}

const watchlistData = [
  { symbol: 'BTC/USD', name: 'Bitcoin', price: '$68,400.00', change: '+3.12%', positive: true, cat: 'crypto' },
  { symbol: 'ETH/USD', name: 'Ethereum', price: '$3,520.50', change: '+1.85%', positive: true, cat: 'crypto' },
  { symbol: 'MAYBANK.KL', name: 'Malayan Banking', price: 'RM 9.92', change: '-0.20%', positive: false, cat: 'saham-my' },
  { symbol: 'TENAGA.KL', name: 'Tenaga Nasional', price: 'RM 13.80', change: '+0.44%', positive: true, cat: 'saham-my' },
  { symbol: 'NVDA', name: 'Nvidia Corporation', price: '$128.20', change: '+4.15%', positive: true, cat: 'saham-us' },
  { symbol: 'EUR/USD', name: 'Euro / US Dollar', price: '1.0892', change: '-0.05%', positive: false, cat: 'forex' }
];

export default function Home() {
  const API_BASE_URL = "https://backendmercury.vercel.app";

  const [currentUser, setCurrentUser] = useState<UserData | null>(null);
  const [activeTab, setActiveTab] = useState<'home' | 'chart' | 'news' | 'order' | 'profile'>('home');
  const [subTab, setSubTab] = useState<'deposit' | 'withdraw' | 'status'>('deposit');
  
  // Modal states
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [depositModalOpen, setDepositModalOpen] = useState(false);
  const [depositAmountPop, setDepositAmountPop] = useState(0);
  const [alertModal, setAlertModal] = useState<{ open: boolean; title: string; message: string }>({ open: false, title: '', message: '' });

  // Slider state
  const [currentSlide, setCurrentSlide] = useState(0);

  // Form inputs
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [regFullname, setRegFullname] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  
  const [depAmountInput, setDepAmountInput] = useState('');
  const [wdAmountInput, setWdAmountInput] = useState('');
  const [bankInfoInput, setBankInfoInput] = useState('');

  // Profile Bank Form
  const [userBankName, setUserBankName] = useState('Maybank');
  const [userAccInput, setUserAccInput] = useState('');
  const [userHolderInput, setUserHolderInput] = useState('');

  // Transactions list
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  // Watchlist filter, Chart, & Timeframe states
  const [watchlistCategory, setWatchlistCategory] = useState('all');
  const [selectedSymbol, setSelectedSymbol] = useState('BTC/USD');
  const [chartTimeframe, setChartTimeframe] = useState<'1H' | '1D' | '1W' | '1M'>('1D');

  // Load User & Scripts on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('tradex_user');
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        setCurrentUser(parsed);
        refreshUserData(parsed.userId || parsed._id);
      } catch (e) {
        localStorage.removeItem('tradex_user');
      }
    }

    const sliderInterval = setInterval(() => {
      setCurrentSlide((prev) => (prev === 0 ? 1 : 0));
    }, 4000);

    loadExternalScripts();

    return () => clearInterval(sliderInterval);
  }, []);

  // Re-trigger feather icons and chart initialization whenever activeTab, symbol, or timeframe changes
  useEffect(() => {
    setTimeout(() => {
      // @ts-expect-error window.feather declaration
      if (window.feather) window.feather.replace();
      if (activeTab === 'chart') {
        initChart(chartTimeframe, selectedSymbol);
      }
    }, 100);
  }, [activeTab, selectedSymbol, chartTimeframe]);

  const loadExternalScripts = () => {
    if (!document.getElementById('chartjs-script')) {
      const script = document.createElement('script');
      script.id = 'chartjs-script';
      script.src = 'https://cdn.jsdelivr.net/npm/chart.js';
      script.async = true;
      script.onload = () => initChart(chartTimeframe, selectedSymbol);
      document.body.appendChild(script);
    } else {
      setTimeout(() => initChart(chartTimeframe, selectedSymbol), 500);
    }

    if (!document.getElementById('feather-script')) {
      const fScript = document.createElement('script');
      fScript.id = 'feather-script';
      fScript.src = 'https://unpkg.com/feather-icons';
      fScript.async = true;
      fScript.onload = () => {
        // @ts-expect-error window.feather declaration
        if (window.feather) window.feather.replace();
      };
      document.body.appendChild(fScript);
    } else {
      // @ts-expect-error window.feather declaration
      if (window.feather) window.feather.replace();
    }
  };

  const initChart = (timeframe: '1H' | '1D' | '1W' | '1M', symbol: string) => {
    // @ts-expect-error Chart declaration from CDN
    const Chart = window.Chart;
    const ctx = document.getElementById('tradingChart') as HTMLCanvasElement;
    if (!ctx || !Chart) return;

    // @ts-expect-error stored instance
    if (window.myChartInstance) {
      // @ts-expect-error stored instance
      window.myChartInstance.destroy();
    }

    // Dynamic labels and datasets based on selected timeframe
    let labels = ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', '24:00'];
    let baseValues = [66200, 66800, 67400, 67100, 68000, 67900, 68400];

    if (timeframe === '1H') {
      labels = ['10m', '20m', '30m', '40m', '50m', '60m'];
      baseValues = [68200, 68250, 68180, 68300, 68350, 68400];
    } else if (timeframe === '1W') {
      labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
      baseValues = [65000, 66200, 65800, 67100, 67900, 68100, 68400];
    } else if (timeframe === '1M') {
      labels = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
      baseValues = [62000, 64500, 66000, 68400];
    }

    // Sesuaikan nilai dataPoints secara dinamik mengikut simbol yang dipilih agar tidak sama semua
    let dataPoints = [...baseValues];
    let borderColor = '#2563eb';
    let backgroundColor = 'rgba(37, 99, 235, 0.1)';

    if (symbol === 'ETH/USD') {
      dataPoints = baseValues.map(v => Number((v * 0.051).toFixed(2)));
      borderColor = '#8b5cf6';
      backgroundColor = 'rgba(139, 92, 246, 0.1)';
    } else if (symbol.includes('.KL')) {
      dataPoints = baseValues.map(v => Number((v * 0.00014 + (symbol.includes('MAYBANK') ? 9.5 : 13.2)).toFixed(2)));
      borderColor = '#10b981';
      backgroundColor = 'rgba(16, 185, 129, 0.1)';
    } else if (symbol === 'NVDA' || symbol === 'AAPL') {
      dataPoints = baseValues.map(v => Number((v * 0.0019).toFixed(2)));
      borderColor = '#f59e0b';
      backgroundColor = 'rgba(245, 158, 11, 0.1)';
    } else if (symbol === 'EUR/USD') {
      dataPoints = baseValues.map(v => Number((1.07 + (v % 200) * 0.0001).toFixed(4)));
      borderColor = '#ec4899';
      backgroundColor = 'rgba(236, 72, 153, 0.1)';
    }

    // @ts-expect-error stored instance
    window.myChartInstance = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: symbol,
          data: dataPoints,
          borderColor: borderColor,
          backgroundColor: backgroundColor,
          fill: true,
          tension: 0.3,
          borderWidth: 2,
          pointRadius: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: { grid: { display: false }, ticks: { color: '#64748b', font: { size: 9 } } },
          y: { grid: { color: 'rgba(226, 232, 240, 0.8)' }, ticks: { color: '#64748b', font: { size: 9 } } }
        }
      }
    });
  };

  const refreshUserData = async (id: string) => {
    if (!id) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/users/${encodeURIComponent(id)}`);
      if (res.ok) {
        const data = await res.json();
        setCurrentUser((prev) => {
          const updated = { ...prev, ...data };
          localStorage.setItem('tradex_user', JSON.stringify(updated));
          return updated;
        });
        if (data.bankInfo) {
          setUserBankName(data.bankInfo.bankName || 'Maybank');
          setUserAccInput(data.bankInfo.accNumber || '');
          setUserHolderInput(data.bankInfo.holderName || '');
          if (data.bankInfo.accNumber) {
            setBankInfoInput(`${data.bankInfo.bankName} - ${data.bankInfo.accNumber} (${data.bankInfo.holderName})`);
          }
        }
      } else if (res.status === 404) {
        localStorage.removeItem('tradex_user');
        setCurrentUser(null);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleLoginSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail, password: loginPassword })
      });
      const data = await res.json();
      if (res.ok) {
        setCurrentUser(data.user);
        localStorage.setItem('tradex_user', JSON.stringify(data.user));
        setAuthModalOpen(false);
        showAlert('Berjaya', 'Log masuk berjaya!');
      } else {
        showAlert('Ralat', data.message || 'Log masuk gagal');
      }
    } catch (err) {
      showAlert('Ralat', 'Gagal berhubung dengan pelayan');
    }
  };

  const handleRegisterSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: regFullname, email: regEmail, password: regPassword })
      });
      const data = await res.json();
      if (res.ok) {
        setCurrentUser(data.user);
        localStorage.setItem('tradex_user', JSON.stringify(data.user));
        setAuthModalOpen(false);
        showAlert('Berjaya', 'Pendaftaran berjaya!');
      } else {
        showAlert('Ralat', data.message || 'Pendaftaran gagal');
      }
    } catch (err) {
      showAlert('Ralat', 'Gagal berhubung dengan pelayan');
    }
  };

  const handleDepositAction = async (e: FormEvent) => {
    e.preventDefault();
    if (!currentUser) return setAuthModalOpen(true);

    const amount = parseFloat(depAmountInput);
    try {
      const res = await fetch(`${API_BASE_URL}/api/transactions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: currentUser.userId || currentUser._id,
          userName: currentUser.name,
          type: 'Deposit',
          amount,
          bankDetails: 'Deposit via Gateway/Manual'
        })
      });

      if (res.ok) {
        setDepositAmountPop(amount);
        setDepositModalOpen(true);
        setDepAmountInput('');
      } else {
        const data = await res.json();
        showAlert('Ralat', data.message || 'Pengajuan deposit gagal');
      }
    } catch (err) {
      showAlert('Ralat', 'Gagal membuat transaksi');
    }
  };

  const handleWithdrawAction = async (e: FormEvent) => {
    e.preventDefault();
    if (!currentUser) return setAuthModalOpen(true);

    const amount = parseFloat(wdAmountInput);
    try {
      const res = await fetch(`${API_BASE_URL}/api/transactions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: currentUser.userId || currentUser._id,
          userName: currentUser.name,
          type: 'Withdraw',
          amount,
          bankDetails: bankInfoInput || 'Maybank - 1234567890'
        })
      });

      if (res.ok) {
        showAlert('Berjaya', 'Permohonan pengeluaran berjaya dihantar');
        setWdAmountInput('');
        setSubTab('status');
        fetchTransactions();
      } else {
        const data = await res.json();
        showAlert('Ralat', data.message || 'Pengeluaran gagal');
      }
    } catch (err) {
      showAlert('Ralat', 'Gagal membuat transaksi pengeluaran');
    }
  };

  const fetchTransactions = async () => {
    if (!currentUser) return;
    try {
      const userId = currentUser.userId || currentUser._id;
      const res = await fetch(`${API_BASE_URL}/api/transactions/user/${encodeURIComponent(userId || '')}`);
      const data = await res.json();
      if (Array.isArray(data)) setTransactions(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleBankSave = async (e: FormEvent) => {
    e.preventDefault();
    if (!currentUser) return setAuthModalOpen(true);

    const userId = currentUser.userId || currentUser._id;
    try {
      const res = await fetch(`${API_BASE_URL}/api/users/${encodeURIComponent(userId || '')}/bank`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bankName: userBankName, accNumber: userAccInput, holderName: userHolderInput })
      });

      if (res.ok) {
        const updated = await res.json();
        setCurrentUser(updated);
        localStorage.setItem('tradex_user', JSON.stringify(updated));
        showAlert('Berjaya', 'Akaun bank berjaya disimpan!');
      } else {
        showAlert('Ralat', 'Gagal menyimpan maklumat bank.');
      }
    } catch (err) {
      showAlert('Ralat', 'Gagal menyimpan maklumat bank');
    }
  };

  const showAlert = (title: string, message: string) => {
    setAlertModal({ open: true, title, message });
  };

  const handleLogoutLoginBtn = () => {
    if (currentUser) {
      localStorage.removeItem('tradex_user');
      setCurrentUser(null);
      showAlert('Maklumat', 'Anda telah log keluar.');
    } else {
      setAuthMode('login');
      setAuthModalOpen(true);
    }
  };

  const updateChartSymbol = (symbol: string) => {
    setSelectedSymbol(symbol);
    initChart(chartTimeframe, symbol);
  };

  const formattedBalance = currentUser?.balance ? `RM ${currentUser.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}` : 'RM 0.00';

  return (
    <div className="bg-slate-50 text-slate-800 font-sans min-h-screen pb-24">
      
      {/* TOP HEADER */}
      <header className="bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-sm sticky top-0 z-40 px-4 py-3 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <img src="./myylogo.png" alt="Logo Mercury" className="h-8 w-auto object-contain" />
          <div>
            <h1 className="font-bold text-sm tracking-wide text-blue-900 leading-none">MERCURY</h1>
            <p className="text-[10px] text-slate-500">Portal Akaun</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <select onChange={(e) => console.log(e.target.value)} className="bg-slate-100 border border-slate-300 text-xs text-slate-700 rounded-lg px-2 py-1 outline-none focus:border-blue-500">
            <option value="ms">🇲🇾 MY</option>
            <option value="id">🇮🇩 ID</option>
            <option value="en">🇬🇧 EN</option>
            <option value="zh">🇨🇳 ZH</option>
          </select>

          <button 
            onClick={() => currentUser ? setActiveTab('profile') : setAuthModalOpen(true)} 
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-3 py-1.5 rounded-lg transition shadow-md shadow-blue-600/20"
          >
            {currentUser ? (currentUser.name ? currentUser.name.split(' ')[0] : 'User') : 'Log Masuk'}
          </button>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main className="max-w-md mx-auto p-4 space-y-5">

        {/* TAB 1: BERANDA / HOME */}
        {activeTab === 'home' && (
          <div className="space-y-4">
            
            {/* HERO BANNER SLIDER */}
            <div className="relative overflow-hidden rounded-2xl bg-white text-slate-900 border border-slate-200 shadow-md">
              <div className="flex transition-transform duration-500 ease-in-out w-[200%]" style={{ transform: `translateX(-${currentSlide * 50}%)` }}>
                <div className="w-1/2 p-5 bg-cover bg-center flex flex-col justify-between space-y-3 min-h-[160px]" style={{ backgroundImage: "url('./Mybanner1.jpeg')" }}>
                  <span className="text-[10px] font-bold text-blue-700 tracking-wider bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full w-max border border-blue-200 shadow-sm">
                    KEUNTUNGAN MAKSIMAL
                  </span>
                  <h2 className="text-lg font-extrabold text-slate-900 leading-tight bg-white/60 p-1.5 rounded-lg backdrop-blur-[2px]">
                    Mencapai Kejayaan Kewangan Bersama Mercury
                  </h2>
                  <button onClick={() => setActiveTab('chart')} className="text-xs bg-blue-600 hover:bg-blue-700 text-white font-bold px-3 py-2 rounded-xl w-max transition shadow-sm">
                    Sistem Eksekusi Pantas &rarr;
                  </button>
                </div>

                <div className="w-1/2 p-5 bg-cover bg-center flex flex-col justify-between space-y-3 min-h-[160px]" style={{ backgroundImage: "url('./Mybanner2.jpeg')" }}>
                  <span className="text-[10px] font-bold text-blue-700 tracking-wider bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full w-max border border-blue-200 shadow-sm">
                    PASARAN GLOBAL
                  </span>
                  <h2 className="text-lg font-extrabold text-slate-900 leading-tight bg-white/60 p-1.5 rounded-lg backdrop-blur-[2px]">
                    Pelaburan Bijak dalam Saham
                  </h2>
                  <button onClick={() => setActiveTab('chart')} className="text-xs bg-blue-600 hover:bg-blue-700 text-white font-bold px-3 py-2 rounded-xl w-max transition shadow-sm">
                    Terokai Pasaran &rarr;
                  </button>
                </div>
              </div>

              <div className="absolute bottom-2 right-4 flex space-x-1.5">
                <div className={`w-2 h-2 rounded-full ${currentSlide === 0 ? 'bg-blue-600' : 'bg-slate-300'}`}></div>
                <div className={`w-2 h-2 rounded-full ${currentSlide === 1 ? 'bg-blue-600' : 'bg-slate-300'}`}></div>
              </div>
            </div>

            {/* RINGKASAN SALDO REAL */}
            <div className="bg-white p-4 rounded-2xl border border-blue-100 shadow-md space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-500 font-medium">Jumlah Saldo</span>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${currentUser ? 'text-blue-700 bg-blue-500/10 border-blue-500/20' : 'text-amber-700 bg-amber-500/10 border-amber-500/20'}`}>
                  {currentUser ? 'Aktif' : 'Belum Log Masuk'}
                </span>
              </div>
              <p className="text-2xl font-black text-blue-950">{formattedBalance}</p>
              
              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100 text-center">
                <div>
                  <p className="text-[10px] text-slate-500">Boleh Ditarik</p>
                  <p className="text-xs font-bold text-slate-800">{formattedBalance}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-500">Dalam Trading</p>
                  <p className="text-xs font-bold text-slate-800">RM 0.00</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-500">Keuntungan</p>
                  <p className="text-xs font-bold text-blue-600">RM 0.00</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <button onClick={() => { setActiveTab('order'); setSubTab('deposit'); }} className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-2 rounded-xl flex items-center justify-center transition shadow-md shadow-blue-600/20">
                  Deposit Saldo
                </button>
                <button onClick={() => { setActiveTab('order'); setSubTab('withdraw'); }} className="bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs py-2 rounded-xl flex items-center justify-center transition shadow-md shadow-rose-500/20">
                  Pengeluaran Dana
                </button>
              </div>
            </div>

            {/* KEUNGGULAN PLATFORM */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-blue-900 tracking-wider uppercase">Keunggulan Platform</h3>
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm space-y-1">
                  <p className="font-bold text-xs text-slate-900">Keselamatan Tinggi</p>
                  <p className="text-[10px] text-slate-500">Enkripsi ketat & terjamin.</p>
                </div>
                <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm space-y-1">
                  <p className="font-bold text-xs text-slate-900">Data Real-Time</p>
                  <p className="text-[10px] text-slate-500">Pantau harga secara langsung.</p>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* TAB 2: PASAR / CHART */}
        {activeTab === 'chart' && (
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-md space-y-3">
              <div className="flex justify-between items-center">
                <div>
                  <div className="flex items-center space-x-2">
                    <h2 className="text-lg font-bold text-slate-900">{selectedSymbol}</h2>
                    <span className="text-xs font-bold text-blue-700 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">+3.12%</span>
                  </div>
                  <p className="text-[11px] text-slate-500">Market Watch & Analytics</p>
                </div>
                
                <select onChange={(e) => updateChartSymbol(e.target.value)} className="bg-slate-50 border border-slate-200 text-xs text-slate-800 rounded-lg px-2.5 py-1.5 outline-none focus:border-blue-500" value={selectedSymbol}>
                  <option value="BTC/USD">Bitcoin (BTC/USD)</option>
                  <option value="ETH/USD">Ethereum (ETH/USD)</option>
                  <option value="MAYBANK.KL">Maybank (KLSE)</option>
                  <option value="TENAGA.KL">Tenaga Nasional (KLSE)</option>
                  <option value="AAPL">Apple Inc. (AAPL)</option>
                  <option value="NVDA">Nvidia Corp (NVDA)</option>
                  <option value="EUR/USD">EUR / USD (Forex)</option>
                </select>
              </div>

              {/* TIMEFRAME SELECTOR BUTTONS */}
              <div className="flex space-x-1 bg-slate-100 p-1 rounded-xl border border-slate-200 text-[11px]">
                {(['1H', '1D', '1W', '1M'] as const).map((tf) => (
                  <button
                    key={tf}
                    onClick={() => setChartTimeframe(tf)}
                    className={`flex-1 py-1 rounded-lg font-bold transition ${chartTimeframe === tf ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
                  >
                    {tf}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-3 gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-center">
                <div>
                  <p className="text-[9px] text-slate-500">Harga Terkini</p>
                  <p className="text-xs font-bold text-slate-900">
                    {watchlistData.find(w => w.symbol === selectedSymbol)?.price || '$68,400.00'}
                  </p>
                </div>
                <div>
                  <p className="text-[9px] text-slate-500">Tertinggi ({chartTimeframe})</p>
                  <p className="text-xs font-bold text-blue-600">
                    {selectedSymbol === 'BTC/USD' ? '$69,150.00' : selectedSymbol === 'ETH/USD' ? '$3,620.00' : 'Normal'}
                  </p>
                </div>
                <div>
                  <p className="text-[9px] text-slate-500">Terendah ({chartTimeframe})</p>
                  <p className="text-xs font-bold text-rose-600">
                    {selectedSymbol === 'BTC/USD' ? '$66,200.00' : selectedSymbol === 'ETH/USD' ? '$3,410.00' : 'Normal'}
                  </p>
                </div>
              </div>

              <div className="h-48 w-full pt-2">
                <canvas id="tradingChart"></canvas>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2">
                <button onClick={() => { setActiveTab('order'); setSubTab('deposit'); }} className="bg-blue-600 hover:bg-blue-700 text-white font-black py-2.5 rounded-xl text-xs flex items-center justify-center transition shadow-md shadow-blue-600/20">
                  BELI / BUY
                </button>
                <button onClick={() => { setActiveTab('order'); setSubTab('withdraw'); }} className="bg-rose-500 hover:bg-rose-600 text-white font-black py-2.5 rounded-xl text-xs flex items-center justify-center transition shadow-md shadow-rose-500/20">
                  JUAL / SELL
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <h3 className="text-xs font-bold text-blue-900 tracking-wider uppercase">Senarai Pantauan</h3>
                <div className="flex space-x-1 text-[10px] overflow-x-auto pb-1">
                  {['all', 'saham-my', 'saham-us', 'crypto', 'forex'].map((cat) => (
                    <button 
                      key={cat} 
                      onClick={() => setWatchlistCategory(cat)} 
                      className={`px-2.5 py-1 rounded-full whitespace-nowrap transition ${watchlistCategory === cat ? 'bg-blue-600 text-white font-bold' : 'bg-white border border-slate-200 text-slate-700'}`}
                    >
                      {cat.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                {watchlistData
                  .filter((item) => watchlistCategory === 'all' || item.cat === watchlistCategory)
                  .map((item) => (
                    <div key={item.symbol} onClick={() => updateChartSymbol(item.symbol)} className="bg-white p-3 rounded-xl border border-slate-200 flex justify-between items-center shadow-md cursor-pointer transition">
                      <div>
                        <p className="font-bold text-xs text-slate-900">{item.symbol}</p>
                        <p className="text-[10px] text-slate-500">{item.name}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-xs text-slate-900">{item.price}</p>
                        <p className={`text-[10px] font-bold ${item.positive ? 'text-blue-600' : 'text-rose-600'}`}>{item.change}</p>
                      </div>
                    </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: BERITA / NEWS */}
        {activeTab === 'news' && (
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-blue-900 tracking-wider uppercase">Berita Pasaran Terkini</h3>
            <div className="space-y-2.5">
              <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm space-y-1.5">
                <div className="flex justify-between items-center text-[10px]">
                  <span className="text-blue-700 font-bold bg-blue-50 px-2 py-0.5 rounded border border-blue-200">Forex</span>
                  <span className="text-slate-400">10 minit lepas</span>
                </div>
                <h4 className="font-bold text-xs text-slate-900 leading-snug">Dolar AS Mengukuh Menjelang Keputusan Kadar Faedah Fed</h4>
                <p className="text-[11px] text-slate-500 line-clamp-2">Pasaran mata wang global menyaksikan pergerakan pesat susulan spekulasi pengumuman polisi kewangan terbaru daripada Rizab Persekutuan.</p>
              </div>
              <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm space-y-1.5">
                <div className="flex justify-between items-center text-[10px]">
                  <span className="text-purple-700 font-bold bg-purple-50 px-2 py-0.5 rounded border border-purple-200">Kripto</span>
                  <span className="text-slate-400">45 minit lepas</span>
                </div>
                <h4 className="font-bold text-xs text-slate-900 leading-snug">Bitcoin Menembusi $68,000 Susulan Pengumpulan ETF</h4>
                <p className="text-[11px] text-slate-500 line-clamp-2">Aliran masuk dana institusi ke dalam ETF Bitcoin spot terus mendorong melonjaknya harga ke paras tertinggi baharu tahun ini.</p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: TRANSAKSI / ORDER */}
        {activeTab === 'order' && (
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-md space-y-4">
            <h2 className="text-base font-bold text-slate-900 text-center">Pusat Transaksi Dana</h2>

            <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
              <button onClick={() => setSubTab('deposit')} className={`w-1/3 py-2 rounded-lg font-bold transition ${subTab === 'deposit' ? 'bg-blue-600 text-white' : 'text-slate-600'}`}>Deposit</button>
              <button onClick={() => setSubTab('withdraw')} className={`w-1/3 py-2 rounded-lg font-bold transition ${subTab === 'withdraw' ? 'bg-blue-600 text-white' : 'text-slate-600'}`}>Withdraw</button>
              <button onClick={() => { setSubTab('status'); fetchTransactions(); }} className={`w-1/3 py-2 rounded-lg font-bold transition ${subTab === 'status' ? 'bg-blue-600 text-white' : 'text-slate-600'}`}>Status</button>
            </div>

            {subTab === 'deposit' && (
              <form onSubmit={handleDepositAction} className="space-y-3">
                <div>
                  <label className="block text-xs text-slate-500 mb-1">Jumlah (MYR)</label>
                  <input type="number" value={depAmountInput} onChange={(e) => setDepAmountInput(e.target.value)} required placeholder="Contoh: 500" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-900 outline-none focus:border-blue-500" />
                </div>
                <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-xl text-xs transition shadow-md shadow-blue-600/20">
                  Hantar Pengajuan Deposit
                </button>
              </form>
            )}

            {subTab === 'withdraw' && (
              <form onSubmit={handleWithdrawAction} className="space-y-3">
                <div>
                  <label className="block text-xs text-slate-500 mb-1">Jumlah Pengeluaran (MYR)</label>
                  <input type="number" value={wdAmountInput} onChange={(e) => setWdAmountInput(e.target.value)} required placeholder="Contoh: 200" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-900 outline-none focus:border-rose-500" />
                </div>
                <div>
                  <label className="block text-xs text-slate-500 mb-1">Nombor Akaun Bank & Nama Pemilik</label>
                  <input type="text" value={bankInfoInput} onChange={(e) => setBankInfoInput(e.target.value)} required placeholder="Maybank - 1234567890 (Nama Pemilik)" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-900 outline-none focus:border-rose-500" />
                </div>
                <button type="submit" className="w-full bg-rose-500 hover:bg-rose-600 text-white font-bold py-2.5 rounded-xl text-xs transition shadow-md shadow-rose-500/20">
                  Mohon Pengeluaran
                </button>
              </form>
            )}

            {subTab === 'status' && (
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <h4 className="text-xs font-bold text-slate-700">Sejarah & Status Transaksi</h4>
                  <span className="text-[10px] text-slate-400">Terkini</span>
                </div>
                <div className="space-y-2">
                  {transactions.length === 0 ? (
                    <p className="text-xs text-slate-500 text-center py-4">Tiada sejarah transaksi.</p>
                  ) : (
                    transactions.map((trx) => (
                      <div key={trx.trxId} className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex justify-between items-center text-xs">
                        <div>
                          <div className="flex items-center space-x-1.5">
                            <span className={`font-bold ${trx.type === 'Deposit' ? 'text-blue-600' : 'text-rose-600'}`}>{trx.type}</span>
                            <span className="text-[10px] text-slate-400">{trx.trxId}</span>
                          </div>
                          <p className="text-[10px] text-slate-500 mt-0.5">{new Date(trx.createdAt).toLocaleString()}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-slate-900">RM {trx.amount.toFixed(2)}</p>
                          <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${trx.status === 'Berhasil' ? 'bg-blue-500/10 text-blue-700 border border-blue-500/20' : trx.status === 'Ditolak' ? 'bg-rose-500/10 text-rose-700 border border-rose-500/20' : 'bg-amber-500/10 text-amber-700 border border-amber-500/20'}`}>
                            {trx.status}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 5: PROFIL / PROFILE */}
        {activeTab === 'profile' && (
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-md space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center font-bold text-blue-600 text-base">
                  {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : '?'}
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-sm text-slate-900">{currentUser?.name || 'Sila Log Masuk'}</h3>
                  <p className="text-[11px] text-slate-500">{currentUser?.email || 'Log masuk untuk akses akaun'}</p>
                  <span className="inline-block mt-1 text-[9px] bg-amber-500/10 text-amber-700 border border-amber-500/20 px-2 py-0.5 rounded font-bold">
                    {currentUser?.kycStatus || 'Unverified'}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2">
                <button onClick={() => { setActiveTab('order'); setSubTab('deposit'); }} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-xl text-xs transition">
                  Deposit
                </button>
                <button onClick={() => { setActiveTab('order'); setSubTab('withdraw'); }} className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold py-2 rounded-xl text-xs border border-slate-200 transition">
                  Withdraw
                </button>
              </div>
            </div>

            <form onSubmit={handleBankSave} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-md space-y-3">
              <h4 className="font-bold text-xs text-slate-900 flex items-center">
                Maklumat Akaun Bank Saya
              </h4>
              <div>
                <label className="block text-[11px] text-slate-500 mb-1">Pilih Bank</label>
                <select value={userBankName} onChange={(e) => setUserBankName(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 outline-none focus:border-blue-500">
                  <option value="Maybank">Maybank (Malayan Banking Berhad)</option>
                  <option value="CIMB Bank">CIMB Bank Berhad</option>
                  <option value="Public Bank">Public Bank Berhad</option>
                  <option value="RHB Bank">RHB Bank Berhad</option>
                  <option value="Hong Leong Bank">Hong Leong Bank Berhad</option>
                  <option value="Bank Islam">Bank Islam Malaysia Berhad</option>
                  <option value="AmBank">AmBank Berhad</option>
                </select>
              </div>
              <div>
                <label className="block text-[11px] text-slate-500 mb-1">Nombor Akaun Bank</label>
                <input type="text" value={userAccInput} onChange={(e) => setUserAccInput(e.target.value)} required placeholder="1234567890" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 outline-none focus:border-blue-500" />
              </div>
              <div>
                <label className="block text-[11px] text-slate-500 mb-1">Nama Pemilik Akaun</label>
                <input type="text" value={userHolderInput} onChange={(e) => setUserHolderInput(e.target.value)} required placeholder="Nama Anda" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 outline-none focus:border-blue-500" />
              </div>
              <button type="submit" className="w-full bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 font-bold py-2 rounded-xl text-xs transition">
                Simpan Akaun Bank
              </button>
            </form>

            <div className="space-y-2">
              <a href="https://wa.me/00000" target="_blank" className="w-full bg-white border border-slate-200 text-slate-700 p-3 rounded-xl flex items-center justify-between transition shadow-sm hover:border-blue-300">
                <span className="text-xs font-bold">Hubungi Kami</span>
              </a>
              <button onClick={handleLogoutLoginBtn} className="w-full bg-rose-50 border border-rose-200 text-rose-600 hover:bg-rose-100 p-3 rounded-xl font-bold text-xs transition">
                {currentUser ? 'Log Keluar' : 'Log Masuk / Daftar'}
              </button>
            </div>
          </div>
        )}

      </main>

      {/* BOTTOM NAVIGATION BAR WITH FEATHER ICONS */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-200 px-2 py-2.5 z-40 shadow-lg">
        <div className="max-w-md mx-auto flex justify-around items-center text-[10px]">
          <button onClick={() => setActiveTab('home')} className={`flex flex-col items-center space-y-1 transition ${activeTab === 'home' ? 'text-blue-600 font-bold' : 'text-slate-400 hover:text-slate-600'}`}>
            <i data-feather="home" className="w-5 h-5"></i>
            <span>Beranda</span>
          </button>
          <button onClick={() => setActiveTab('chart')} className={`flex flex-col items-center space-y-1 transition ${activeTab === 'chart' ? 'text-blue-600 font-bold' : 'text-slate-400 hover:text-slate-600'}`}>
            <i data-feather="bar-chart-2" className="w-5 h-5"></i>
            <span>Pasaran</span>
          </button>
          <button onClick={() => setActiveTab('news')} className={`flex flex-col items-center space-y-1 transition ${activeTab === 'news' ? 'text-blue-600 font-bold' : 'text-slate-400 hover:text-slate-600'}`}>
            <i data-feather="globe" className="w-5 h-5"></i>
            <span>Berita</span>
          </button>
          <button onClick={() => setActiveTab('order')} className={`flex flex-col items-center space-y-1 transition ${activeTab === 'order' ? 'text-blue-600 font-bold' : 'text-slate-400 hover:text-slate-600'}`}>
            <i data-feather="credit-card" className="w-5 h-5"></i>
            <span>Transaksi</span>
          </button>
          <button onClick={() => setActiveTab('profile')} className={`flex flex-col items-center space-y-1 transition ${activeTab === 'profile' ? 'text-blue-600 font-bold' : 'text-slate-400 hover:text-slate-600'}`}>
            <i data-feather="user" className="w-5 h-5"></i>
            <span>Profil</span>
          </button>
        </div>
      </nav>

      {/* AUTHENTICATION MODAL */}
      {authModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 w-full max-w-sm rounded-2xl p-5 space-y-4 relative shadow-2xl">
            <button onClick={() => setAuthModalOpen(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
              ✕
            </button>

            <div className="flex border-b border-slate-200 pb-2">
              <button onClick={() => setAuthMode('login')} className={`w-1/2 text-center pb-1 text-xs font-bold ${authMode === 'login' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-400'}`}>
                Log Masuk
              </button>
              <button onClick={() => setAuthMode('register')} className={`w-1/2 text-center pb-1 text-xs font-bold ${authMode === 'register' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-400'}`}>
                Daftar Akaun
              </button>
            </div>

            {authMode === 'login' ? (
              <form onSubmit={handleLoginSubmit} className="space-y-3">
                <div>
                  <label className="block text-xs text-slate-500 mb-1">E-mel / ID Pengguna</label>
                  <input type="email" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} required className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 outline-none focus:border-blue-500" />
                </div>
                <div>
                  <label className="block text-xs text-slate-500 mb-1">Kata Laluan</label>
                  <input type="password" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} required className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 outline-none focus:border-blue-500" />
                </div>
                <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-xl text-xs transition shadow-md shadow-blue-600/20">
                  Masuk
                </button>
              </form>
            ) : (
              <form onSubmit={handleRegisterSubmit} className="space-y-3">
                <div>
                  <label className="block text-xs text-slate-500 mb-1">Nama Penuh</label>
                  <input type="text" value={regFullname} onChange={(e) => setRegFullname(e.target.value)} required className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 outline-none focus:border-blue-500" />
                </div>
                <div>
                  <label className="block text-xs text-slate-500 mb-1">E-mel</label>
                  <input type="email" value={regEmail} onChange={(e) => setRegEmail(e.target.value)} required className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 outline-none focus:border-blue-500" />
                </div>
                <div>
                  <label className="block text-xs text-slate-500 mb-1">Kata Laluan</label>
                  <input type="password" value={regPassword} onChange={(e) => setRegPassword(e.target.value)} required className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 outline-none focus:border-blue-500" />
                </div>
                <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-xl text-xs transition shadow-md shadow-blue-600/20">
                  Daftar Sekarang
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* DEPOSIT POPUP MODAL */}
      {depositModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 w-full max-w-xs rounded-2xl p-5 text-center space-y-4 shadow-2xl">
            <div>
              <h3 className="font-bold text-sm text-slate-900">Status Pengajuan Deposit</h3>
              <p className="text-xs text-slate-500 mt-1">Pengajuan deposit telah dibuat, silakan hubungi layanan pelanggan.</p>
            </div>
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
              <p className="text-[10px] text-slate-400">Jumlah Deposit</p>
              <p className="text-base font-extrabold text-blue-600">RM {depositAmountPop.toFixed(2)}</p>
            </div>
            <div className="space-y-2">
              <button onClick={() => window.open('https://wa.me/00000', '_blank')} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-xl text-xs transition">
                Hubungi Customer Service
              </button>
              <button onClick={() => setDepositModalOpen(false)} className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2 rounded-xl text-xs transition">
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CUSTOM ALERT MODAL */}
      {alertModal.open && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 w-full max-w-xs rounded-2xl p-5 text-center space-y-4 shadow-2xl">
            <div>
              <h3 className="font-bold text-sm text-slate-900">{alertModal.title}</h3>
              <p className="text-xs text-slate-500 mt-1">{alertModal.message}</p>
            </div>
            <button onClick={() => setAlertModal({ open: false, title: '', message: '' })} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-xl text-xs transition">
              OK
            </button>
          </div>
        </div>
      )}

    </div>
  );
}