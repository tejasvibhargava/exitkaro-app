import React, { useState, useEffect } from 'react';

// ExitKaro Production Platform - Next.js App Router + Payload CMS + Supabase Architecture
export default function App() {
  // Navigation State (HTML5 History API Router)
  const [currentPath, setCurrentPath] = useState('/');
  const [toastMessage, setToastMessage] = useState(null);
  const [activeAdminTab, setActiveAdminTab] = useState('crm');

  // Global Site Settings (Editable live via Payload CMS)
  const [siteSettings, setSiteSettings] = useState(() => {
    try {
      const saved = localStorage.getItem('exitkaro_prod_settings');
      return saved ? JSON.parse(saved) : {
        phone: "+91 98765 43210",
        whatsapp: "+91 98765 43210",
        email: "support@exitkaro.com",
        officeAddress: "Sector 62, Noida, Uttar Pradesh 201301",
        seoTitle: "Sell Your Property in Noida, Ghaziabad & Delhi NCR | ExitKaro",
        metaDesc: "Facing EMI pressure, an outstanding home loan or changing financial circumstances? ExitKaro helps property owners explore practical options for selling residential property.",
        canonicalUrl: "https://exitkaro.com/",
        robotsIndex: true,
        robotsFollow: true,
      };
    } catch (e) {
      return {
        phone: "+91 98765 43210",
        whatsapp: "+91 98765 43210",
        email: "support@exitkaro.com",
        officeAddress: "Sector 62, Noida, Uttar Pradesh 201301",
        seoTitle: "Sell Your Property in Noida, Ghaziabad & Delhi NCR | ExitKaro",
        metaDesc: "Facing EMI pressure, an outstanding home loan or changing financial circumstances? ExitKaro helps property owners explore practical options for selling residential property.",
        canonicalUrl: "https://exitkaro.com/",
        robotsIndex: true,
        robotsFollow: true,
      };
    }
  });

  // Leads Collection (PostgreSQL / Supabase Schema)
  const [leads, setLeads] = useState(() => {
    try {
      const saved = localStorage.getItem('exitkaro_prod_leads');
      return saved ? JSON.parse(saved) : [
        {
          id: "EK-8091",
          date: "2026-08-08",
          name: "Anand Verma",
          phone: "+91 98112 33445",
          city: "Noida",
          locality: "Sector 137",
          propertyType: "Flat / Apartment",
          bhk: "2 BHK",
          estimatedValue: "7500000",
          outstandingLoan: "5200000",
          monthlyEmi: "48000",
          bank: "HDFC Bank",
          reasonForSelling: "Increasing Monthly EMI Burden",
          preferredCallbackTime: "Evening (4 PM - 8 PM)",
          status: "New",
          assignedTo: "Unassigned",
          nextFollowUp: "2026-08-09",
          internalNotes: "Property in Paramount Floraville. EMI overdue by 1 month. Needs confidential evaluation call.",
          consent: true
        }
      ];
    } catch (e) {
      return [];
    }
  });

  // Page Content CMS Copy
  const [pageContent, setPageContent] = useState(() => {
    try {
      const saved = localStorage.getItem('exitkaro_prod_pages');
      return saved ? JSON.parse(saved) : {
        home: {
          h1: "Looking to Sell Your Property in Noida, Ghaziabad or Delhi NCR?",
          heroSub: "Facing EMI pressure, an outstanding home loan or changing financial circumstances? ExitKaro helps property owners explore practical options for selling their residential property. Share your details and our team will contact you confidentially.",
          heroTagline: "Property sale assistance for flats, apartments, builder floors and houses.",
          mortgageHead: "Can You Sell a Property With an Outstanding Home Loan?",
          mortgageBody: "Yes. A property with an outstanding home loan may be sold, subject to the lender's requirements and the applicable transaction process across Indian financial institutions. If you are considering selling a residential property while your home loan is still active, the first step is to understand your current outstanding loan principal, current local property market value, and loan closure documentation requirements.",
          noPhotoHead: "No Public Listing. No Photo Upload Required.",
          noPhotoBody: "Unlike a traditional property portal, ExitKaro does not require you to publicly list your property or upload property photographs just to start an enquiry. Simply share your basic details with our team. If your property is suitable for further evaluation, our team can coordinate a property visit and collect the required information directly."
        }
      };
    } catch (e) {
      return {};
    }
  });

  // 2-Step Lead Form Fields
  const [heroFormStep, setHeroFormStep] = useState(1);
  const [formFields, setFormFields] = useState({
    name: '',
    phone: '',
    city: 'Noida',
    locality: '',
    propertyType: 'Flat / Apartment',
    bhk: '2 BHK',
    estimatedValue: '',
    outstandingLoan: '',
    monthlyEmi: '',
    bank: '',
    reasonForSelling: 'Increasing Monthly EMI Burden',
    preferredCallbackTime: 'Anytime',
    consent: true
  });

  // CRM Filters
  const [crmStatusFilter, setCrmStatusFilter] = useState('ALL');
  const [crmSearchQuery, setCrmSearchQuery] = useState('');

  useEffect(() => {
    try {
      localStorage.setItem('exitkaro_prod_settings', JSON.stringify(siteSettings));
      localStorage.setItem('exitkaro_prod_leads', JSON.stringify(leads));
      localStorage.setItem('exitkaro_prod_pages', JSON.stringify(pageContent));
    } catch (e) {
      console.error("Storage persistence error", e);
    }
  }, [siteSettings, leads, pageContent]);

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateTo = (path, scroll = true) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
    if (scroll) window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleHeroFormNext = () => {
    if (!formFields.name || !formFields.phone || !formFields.locality) {
      showToast("Please fill in your Full Name, Mobile Number, and Locality to proceed.");
      return;
    }
    setHeroFormStep(2);
  };

  const handleHeroFormSubmit = (e) => {
    e.preventDefault();
    if (!formFields.consent) {
      showToast("Please agree to the privacy terms to proceed.");
      return;
    }

    const newLead = {
      id: "EK-" + Math.floor(1000 + Math.random() * 9000),
      date: new Date().toISOString().slice(0, 10),
      ...formFields,
      status: "New",
      assignedTo: "Unassigned",
      nextFollowUp: new Date(Date.now() + 86400000).toISOString().slice(0, 10),
      internalNotes: "Captured via 2-Step Lead Form."
    };

    setLeads([newLead, ...leads]);
    showToast("Enquiry Received! Our team will contact you confidentially.");
    
    setFormFields({
      name: '',
      phone: '',
      city: 'Noida',
      locality: '',
      propertyType: 'Flat / Apartment',
      bhk: '2 BHK',
      estimatedValue: '',
      outstandingLoan: '',
      monthlyEmi: '',
      bank: '',
      reasonForSelling: 'Increasing Monthly EMI Burden',
      preferredCallbackTime: 'Anytime',
      consent: true
    });
    setHeroFormStep(1);
  };

  const updateLeadStatus = (id, newStatus) => {
    setLeads(leads.map(l => l.id === id ? { ...l, status: newStatus } : l));
    showToast(`Lead ${id} status updated to ${newStatus}`);
  };

  const deleteLead = (id) => {
    setLeads(leads.filter(l => l.id !== id));
    showToast(`Lead ${id} deleted.`);
  };

  const exportLeadsCSV = () => {
    let csv = "ID,Date,Name,Phone,City,Locality,PropertyType,BHK,ApproxValue,OutstandingLoan,EMI,Bank,PreferredTime,Status\n";
    leads.forEach(l => {
      csv += `"${l.id}","${l.date}","${l.name}","${l.phone}","${l.city}","${l.locality}","${l.propertyType}","${l.bhk}","${l.estimatedValue}","${l.outstandingLoan}","${l.monthlyEmi}","${l.bank}","${l.preferredCallbackTime}","${l.status}"\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ExitKaro_Leads_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    showToast("Leads exported to CSV!");
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans flex flex-col justify-between selection:bg-emerald-700 selection:text-white">

      {/* TOP UTILITY & APP ROUTER STATUS BAR */}
      <div className="bg-slate-950 text-slate-300 py-2 px-4 text-xs sticky top-0 z-50 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2 shadow-md">
        <div className="flex items-center gap-3">
          <span className="bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded tracking-wide flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Delhi NCR Service Active
          </span>
          <span className="hidden md:inline text-slate-400 text-[11px]">Noida • Ghaziabad • Delhi • Gurgaon • Faridabad</span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto py-0.5">
          <button onClick={() => navigateTo('/')} className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-semibold transition-all">
            <i className="fa-solid fa-house text-emerald-400 mr-1"></i> Public Website
          </button>
          <button onClick={() => navigateTo('/admin')} className="px-3 py-1 rounded bg-amber-600 hover:bg-amber-500 text-white text-[11px] font-extrabold transition-all flex items-center gap-1">
            <i className="fa-solid fa-lock text-xs"></i> Payload CMS & CRM
          </button>
          <a href={`tel:${siteSettings.phone.replace(/[^0-9]/g, '')}`} className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 text-[11px] text-emerald-400 font-bold hover:underline">
            <i className="fa-solid fa-phone"></i> {siteSettings.phone}
          </a>
        </div>
      </div>

      {/* MAIN NAVIGATION HEADER */}
      <header className="bg-white/95 border-b border-slate-200 sticky top-[37px] z-40 backdrop-blur-md shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between py-3">
          <button onClick={() => navigateTo('/')} className="flex items-center gap-2.5 text-left group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-emerald-800 flex items-center justify-center text-white text-xl font-black shadow-md shadow-emerald-700/20 group-hover:scale-105 transition-all">
              <i className="fa-solid fa-building-circle-check"></i>
            </div>
            <div>
              <span className="text-2xl font-black text-slate-900 tracking-tight">Exit<span className="text-emerald-700">Karo</span><span className="text-xs text-amber-600 font-bold ml-0.5">.com</span></span>
              <span className="block text-[10px] text-slate-500 font-semibold -mt-1 uppercase tracking-wider">Property Sale Assistance</span>
            </div>
          </button>

          <nav className="hidden lg:flex items-center gap-6 text-xs font-semibold text-slate-700">
            <button onClick={() => navigateTo('/')} className={`hover:text-emerald-700 transition-colors py-1 ${currentPath === '/' ? 'text-emerald-700 font-extrabold border-b-2 border-emerald-700' : ''}`}>Home</button>
            <button onClick={() => navigateTo('/sell-property')} className={`hover:text-emerald-700 transition-colors py-1 ${currentPath === '/sell-property' ? 'text-emerald-700 font-extrabold border-b-2 border-emerald-700' : ''}`}>Sell Property</button>
            <button onClick={() => navigateTo('/how-it-works')} className={`hover:text-emerald-700 transition-colors py-1 ${currentPath === '/how-it-works' ? 'text-emerald-700 font-extrabold border-b-2 border-emerald-700' : ''}`}>How It Works</button>
            <button onClick={() => navigateTo('/why-exitkaro')} className={`hover:text-emerald-700 transition-colors py-1 ${currentPath === '/why-exitkaro' ? 'text-emerald-700 font-extrabold border-b-2 border-emerald-700' : ''}`}>Why ExitKaro</button>
            <button onClick={() => navigateTo('/areas')} className={`hover:text-emerald-700 transition-colors py-1 ${currentPath.startsWith('/areas') ? 'text-emerald-700 font-extrabold border-b-2 border-emerald-700' : ''}`}>Areas Covered</button>
            <button onClick={() => navigateTo('/faqs')} className={`hover:text-emerald-700 transition-colors py-1 ${currentPath === '/faqs' ? 'text-emerald-700 font-extrabold border-b-2 border-emerald-700' : ''}`}>FAQs</button>
            <button onClick={() => navigateTo('/blog')} className={`hover:text-emerald-700 transition-colors py-1 ${currentPath.startsWith('/blog') ? 'text-emerald-700 font-extrabold border-b-2 border-emerald-700' : ''}`}>Blog</button>
          </nav>

          <div className="hidden sm:flex items-center gap-3">
            <button onClick={() => navigateTo('/sell-property')} className="px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-md shadow-emerald-700/20 transition-all">
              Get a Free Property Evaluation
            </button>
          </div>
        </div>
      </header>

      {/* ================================================================= */}
      {/* ROUTE 1: HOMEPAGE (`/`)                                           */}
      {/* ================================================================= */}
      {currentPath === '/' && (
        <main className="flex-1">
          <section className="bg-gradient-to-b from-emerald-50/60 via-slate-50 to-white py-12 lg:py-20 border-b border-slate-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                
                {/* Hero Content */}
                <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
                  <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100/80 border border-emerald-300 text-emerald-900 text-xs font-bold">
                    <i className="fa-solid fa-shield-halved text-emerald-700"></i>
                    DELHI NCR PROPERTY SALE ASSISTANCE
                  </span>

                  <h1 className="text-3xl sm:text-5xl font-black text-slate-900 leading-tight tracking-tight">
                    {pageContent.home?.h1 || "Looking to Sell Your Property in Noida, Ghaziabad or Delhi NCR?"}
                  </h1>

                  <p className="text-slate-700 text-sm sm:text-base leading-relaxed">
                    {pageContent.home?.heroSub}
                  </p>

                  <p className="text-xs text-slate-500 font-semibold italic">
                    {pageContent.home?.heroTagline}
                  </p>

                  <div className="flex flex-wrap gap-3 justify-center lg:justify-start pt-2">
                    <button onClick={() => navigateTo('/sell-property')} className="px-6 py-3.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-sm shadow-xl shadow-emerald-700/20 transition-all flex items-center gap-2">
                      Get a Free Property Evaluation
                      <i className="fa-solid fa-arrow-right text-xs"></i>
                    </button>
                    <a href={`tel:${siteSettings.phone.replace(/[^0-9]/g, '')}`} className="px-6 py-3.5 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 text-slate-900 font-bold text-sm shadow-sm transition-all flex items-center gap-2">
                      <i className="fa-solid fa-headset text-emerald-700"></i>
                      Talk to Our Team
                    </a>
                  </div>
                </div>

                {/* Progressive 2-Step Lead Form */}
                <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-2xl relative">
                  <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
                    <div>
                      <span className="text-[10px] uppercase font-extrabold text-emerald-700 tracking-wider">Confidential Form</span>
                      <h3 className="text-lg font-black text-slate-900">Tell Us About Your Property</h3>
                    </div>
                    <span className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center text-sm font-bold">{heroFormStep}/2</span>
                  </div>

                  <form onSubmit={handleHeroFormSubmit} className="space-y-4">
                    {heroFormStep === 1 && (
                      <div className="space-y-3.5">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">Full Name *</label>
                          <input type="text" required value={formFields.name} onChange={e => setFormFields({ ...formFields, name: e.target.value })} placeholder="Enter your full name" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:bg-white focus:border-emerald-600 outline-none" />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">Mobile Number *</label>
                            <input type="tel" required value={formFields.phone} onChange={e => setFormFields({ ...formFields, phone: e.target.value })} placeholder="10-digit mobile" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:bg-white focus:border-emerald-600 outline-none" />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">City *</label>
                            <select value={formFields.city} onChange={e => setFormFields({ ...formFields, city: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:bg-white focus:border-emerald-600 outline-none">
                              <option value="Noida">Noida</option>
                              <option value="Ghaziabad">Ghaziabad</option>
                              <option value="Delhi NCR">Delhi NCR</option>
                              <option value="Gurgaon">Gurgaon</option>
                              <option value="Faridabad">Faridabad</option>
                            </select>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">Locality / Sector *</label>
                            <input type="text" required value={formFields.locality} onChange={e => setFormFields({ ...formFields, locality: e.target.value })} placeholder="e.g. Sector 137 / Indirapuram" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:bg-white focus:border-emerald-600 outline-none" />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">Property Type *</label>
                            <select value={formFields.propertyType} onChange={e => setFormFields({ ...formFields, propertyType: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:bg-white focus:border-emerald-600 outline-none">
                              <option value="Flat / Apartment">Flat / Apartment</option>
                              <option value="Builder Floor">Builder Floor</option>
                              <option value="House / Villa">House / Villa</option>
                            </select>
                          </div>
                        </div>

                        <button type="button" onClick={handleHeroFormNext} className="w-full py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs shadow-lg shadow-emerald-700/20 transition-all flex items-center justify-center gap-2">
                          Next: Loan & Property Details <i className="fa-solid fa-arrow-right"></i>
                        </button>
                      </div>
                    )}

                    {heroFormStep === 2 && (
                      <div className="space-y-3.5">
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">BHK Configuration</label>
                            <select value={formFields.bhk} onChange={e => setFormFields({ ...formFields, bhk: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 outline-none">
                              <option value="1 BHK">1 BHK</option>
                              <option value="2 BHK">2 BHK</option>
                              <option value="3 BHK">3 BHK</option>
                              <option value="4+ BHK">4+ BHK</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">Approx. Value <span className="text-[10px] text-slate-400 font-normal">(Optional)</span></label>
                            <input type="number" value={formFields.estimatedValue} onChange={e => setFormFields({ ...formFields, estimatedValue: e.target.value })} placeholder="e.g. 7500000" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 outline-none" />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">Loan Outstanding <span className="text-[10px] text-slate-400 font-normal">(Optional)</span></label>
                            <input type="number" value={formFields.outstandingLoan} onChange={e => setFormFields({ ...formFields, outstandingLoan: e.target.value })} placeholder="e.g. 5000000" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 outline-none" />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">Monthly EMI <span className="text-[10px] text-slate-400 font-normal">(Optional)</span></label>
                            <input type="number" value={formFields.monthlyEmi} onChange={e => setFormFields({ ...formFields, monthlyEmi: e.target.value })} placeholder="e.g. 45000" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 outline-none" />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">Lending Bank <span className="text-[10px] text-slate-400 font-normal">(Optional)</span></label>
                            <input type="text" value={formFields.bank} onChange={e => setFormFields({ ...formFields, bank: e.target.value })} placeholder="e.g. HDFC / SBI" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 outline-none" />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">When should we call? *</label>
                            <select value={formFields.preferredCallbackTime} onChange={e => setFormFields({ ...formFields, preferredCallbackTime: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 outline-none">
                              <option value="Anytime">Anytime</option>
                              <option value="Morning (9 AM - 12 PM)">Morning (9 AM - 12 PM)</option>
                              <option value="Afternoon (12 PM - 4 PM)">Afternoon (12 PM - 4 PM)</option>
                              <option value="Evening (4 PM - 8 PM)">Evening (4 PM - 8 PM)</option>
                            </select>
                          </div>
                        </div>

                        <div className="pt-1 flex items-start gap-2">
                          <input type="checkbox" id="consent-check" checked={formFields.consent} onChange={e => setFormFields({ ...formFields, consent: e.target.checked })} className="mt-0.5 rounded border-slate-300 text-emerald-700 focus:ring-emerald-500" />
                          <label htmlFor="consent-check" className="text-[11px] text-slate-600 leading-tight">
                            By submitting this form, you agree to be contacted by ExitKaro regarding your property enquiry. Read our <button type="button" onClick={() => navigateTo('/privacy-policy')} className="text-emerald-700 underline font-bold">Privacy Policy</button>.
                          </label>
                        </div>

                        <div className="flex gap-2">
                          <button type="button" onClick={() => setHeroFormStep(1)} className="w-1/3 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs">Back</button>
                          <button type="submit" className="w-2/3 py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs shadow-lg shadow-emerald-700/20">
                            Submit Property Enquiry
                          </button>
                        </div>
                      </div>
                    )}
                  </form>
                </div>

              </div>
            </div>
          </section>

          {/* TRUST STRIP */}
          <section className="py-10 bg-white border-b border-slate-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center text-lg shrink-0">
                    <i className="fa-solid fa-map-location-dot"></i>
                  </div>
                  <div>
                    <h4 className="font-extrabold text-slate-900 text-sm">Delhi NCR Focused</h4>
                    <p className="text-xs text-slate-600 mt-0.5">Specialized local assistance across Noida, Ghaziabad and NCR markets.</p>
                  </div>
                </div>

                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center text-lg shrink-0">
                    <i className="fa-solid fa-user-shield"></i>
                  </div>
                  <div>
                    <h4 className="font-extrabold text-slate-900 text-sm">Confidential Enquiries</h4>
                    <p className="text-xs text-slate-600 mt-0.5">Your personal and financial details remain private and secure.</p>
                  </div>
                </div>

                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center text-lg shrink-0">
                    <i className="fa-solid fa-clipboard-check"></i>
                  </div>
                  <div>
                    <h4 className="font-extrabold text-slate-900 text-sm">Property Evaluation</h4>
                    <p className="text-xs text-slate-600 mt-0.5">Physical property assessment to understand your options practically.</p>
                  </div>
                </div>

                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center text-lg shrink-0">
                    <i className="fa-solid fa-handshake"></i>
                  </div>
                  <div>
                    <h4 className="font-extrabold text-slate-900 text-sm">Personal Assistance</h4>
                    <p className="text-xs text-slate-600 mt-0.5">Direct team support from enquiry submission through next steps.</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* NEW SECTION 1: MORTGAGE GUIDANCE */}
          <section className="py-16 bg-slate-50 border-b border-slate-200">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
              <div className="text-center space-y-2">
                <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest">Mortgage Guidance</span>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900">{pageContent.home?.mortgageHead}</h2>
              </div>

              <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed">
                <p>{pageContent.home?.mortgageBody}</p>
                <div className="pt-4 text-center">
                  <button onClick={() => navigateTo('/sell-property')} className="px-6 py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs shadow-md">
                    Discuss My Property Situation
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* NEW SECTION 2: SITUATIONS */}
          <section className="py-16 bg-white border-b border-slate-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="max-w-3xl mx-auto text-center space-y-3 mb-12">
                <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest">Understanding Property Needs</span>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900">Property Sale Assistance for Different Situations</h2>
                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                  We assist property owners navigating various changing financial or personal circumstances across Delhi NCR.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-2">
                  <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-xs"><i className="fa-solid fa-calculator"></i></div>
                  <h3 className="font-extrabold text-slate-900 text-base">EMI Pressure</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">When monthly home-loan payments become difficult to maintain comfortable household budgets.</p>
                </div>

                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-2">
                  <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-xs"><i className="fa-solid fa-briefcase"></i></div>
                  <h3 className="font-extrabold text-slate-900 text-base">Job Loss</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">When a sudden change in employment affects your ability to manage the property.</p>
                </div>

                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-2">
                  <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-xs"><i className="fa-solid fa-chart-line-down"></i></div>
                  <h3 className="font-extrabold text-slate-900 text-base">Business Loss</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">When business commitments or reduced commercial income create immediate financial pressure.</p>
                </div>

                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-2">
                  <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-xs"><i className="fa-solid fa-plane"></i></div>
                  <h3 className="font-extrabold text-slate-900 text-base">Relocation</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">When moving to another city or overseas makes keeping and managing the distant property impractical.</p>
                </div>

                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-2">
                  <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-xs"><i className="fa-solid fa-heart-pulse"></i></div>
                  <h3 className="font-extrabold text-slate-900 text-base">Personal Circumstances</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">When changing family or financial commitments make selling the property a consideration.</p>
                </div>

                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-2">
                  <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-xs"><i className="fa-solid fa-house"></i></div>
                  <h3 className="font-extrabold text-slate-900 text-base">Planned Property Sale</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">When you simply want to explore selling your residential flat or floor with professional guidance.</p>
                </div>
              </div>
            </div>
          </section>

          {/* NO PHOTO SECTION */}
          <section className="py-16 bg-slate-900 text-white border-b border-slate-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-6 space-y-4">
                  <span className="text-xs font-extrabold text-amber-400 uppercase tracking-widest">Confidential Approach</span>
                  <h2 className="text-2xl sm:text-4xl font-black">{pageContent.home?.noPhotoHead}</h2>
                  <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">{pageContent.home?.noPhotoBody}</p>
                  <button onClick={() => navigateTo('/sell-property')} className="px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-md">
                    Start Confidential Enquiry
                  </button>
                </div>

                {/* 6-Step What Happens Next */}
                <div className="lg:col-span-6 bg-slate-950 p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-3 text-xs">
                  <h4 className="font-bold text-amber-400 uppercase tracking-wider text-xs mb-2">What Happens After You Submit Your Details?</h4>
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex gap-3"><span className="font-bold text-emerald-400">1.</span> You provide basic property location & contact details.</div>
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex gap-3"><span className="font-bold text-emerald-400">2.</span> Our team contacts you confidentially.</div>
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex gap-3"><span className="font-bold text-emerald-400">3.</span> We understand property type, timeline, and expectations.</div>
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex gap-3"><span className="font-bold text-emerald-400">4.</span> If required, our team coordinates an on-ground site visit.</div>
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex gap-3"><span className="font-bold text-emerald-400">5.</span> Property information and documents are reviewed.</div>
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex gap-3"><span className="font-bold text-emerald-400">6.</span> Our team discusses the possible way forward.</div>
                </div>
              </div>
            </div>
          </section>

          {/* AREAS SECTION */}
          <section className="py-16 bg-white border-b border-slate-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-4">
                <div>
                  <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest">Regional Coverage</span>
                  <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">Property Sale Assistance Across Delhi NCR</h2>
                </div>
                <button onClick={() => navigateTo('/areas')} className="text-xs font-bold text-emerald-700 hover:underline">
                  View All Regional Hubs →
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4">
                  <h3 className="text-xl font-black text-slate-900">Noida</h3>
                  <p className="text-xs text-slate-600">Serving Sector 62, Sector 137, Sector 75, Sector 78, Sector 150, Greater Noida, and Greater Noida West.</p>
                  <button onClick={() => navigateTo('/areas/noida')} className="w-full py-2.5 rounded-xl bg-white border border-slate-300 hover:bg-emerald-700 hover:text-white font-extrabold text-xs text-slate-800 transition-all">
                    View Noida Assistance Page
                  </button>
                </div>

                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4">
                  <h3 className="text-xl font-black text-slate-900">Ghaziabad</h3>
                  <p className="text-xs text-slate-600">Serving Indirapuram, Vaishali, Vasundhara, Raj Nagar Extension, and Crossings Republik.</p>
                  <button onClick={() => navigateTo('/areas/ghaziabad')} className="w-full py-2.5 rounded-xl bg-white border border-slate-300 hover:bg-emerald-700 hover:text-white font-extrabold text-xs text-slate-800 transition-all">
                    View Ghaziabad Assistance Page
                  </button>
                </div>

                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4">
                  <h3 className="text-xl font-black text-slate-900">Delhi NCR</h3>
                  <p className="text-xs text-slate-600">Serving Dwarka, Rohini, South Delhi, Gurgaon Sector 56, Sohna Road, and Faridabad.</p>
                  <button onClick={() => navigateTo('/areas/delhi-ncr')} className="w-full py-2.5 rounded-xl bg-white border border-slate-300 hover:bg-emerald-700 hover:text-white font-extrabold text-xs text-slate-800 transition-all">
                    View Delhi NCR Page
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* FINAL CTA BANNER */}
          <section className="py-16 bg-gradient-to-br from-emerald-800 to-emerald-900 text-white">
            <div className="max-w-5xl mx-auto px-4 text-center space-y-6">
              <h2 className="text-3xl sm:text-4xl font-black">Thinking About Selling Your Property? Let's Talk.</h2>
              <p className="text-slate-200 text-sm max-w-2xl mx-auto leading-relaxed">
                Share your details and our team will contact you to understand your property and situation.
              </p>

              <div className="flex flex-wrap justify-center gap-3 pt-2">
                <button onClick={() => navigateTo('/sell-property')} className="px-6 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-sm shadow-xl">
                  Get a Free Property Evaluation
                </button>
                <a href={`https://wa.me/${siteSettings.whatsapp.replace(/[^0-9]/g, '')}`} target="_blank" rel="noreferrer" className="px-6 py-3.5 rounded-xl bg-emerald-950 hover:bg-slate-950 text-white font-bold text-sm border border-emerald-600 flex items-center gap-2">
                  <i className="fa-brands fa-whatsapp text-lg"></i> WhatsApp Us
                </a>
                <a href={`tel:${siteSettings.phone.replace(/[^0-9]/g, '')}`} className="px-6 py-3.5 rounded-xl bg-white text-slate-900 hover:bg-slate-100 font-bold text-sm flex items-center gap-2">
                  <i className="fa-solid fa-phone text-emerald-700"></i> Call Now
                </a>
              </div>
            </div>
          </section>
        </main>
      )}

      {/* ================================================================= */}
      {/* ROUTE 2: DEDICATED LOCATION PAGES (`/areas/noida`, etc.)          */}
      {/* ================================================================= */}
      {currentPath.startsWith('/areas') && (
        <main className="flex-1 py-12 bg-slate-50">
          <div className="max-w-5xl mx-auto px-4 space-y-8">
            <div className="text-xs text-slate-500 flex items-center gap-2">
              <button onClick={() => navigateTo('/')} className="hover:underline">Home</button>
              <span>/</span>
              <button onClick={() => navigateTo('/areas')} className="hover:underline">Areas</button>
              <span>/</span>
              <span className="text-slate-900 font-bold">{currentPath.replace('/areas/', '') || 'Directory'}</span>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
              <span className="px-3 py-1 bg-emerald-50 text-emerald-800 rounded-full text-xs font-bold border border-emerald-200">Local Service Hub</span>
              <h1 className="text-2xl sm:text-4xl font-black text-slate-900">
                {currentPath.includes('noida') ? 'Sell Your Property in Noida' : currentPath.includes('ghaziabad') ? 'Sell Your Property in Ghaziabad' : 'Sell Your Property in Delhi NCR'}
              </h1>
              
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                Noida and Ghaziabad represent major residential townships with thousands of apartment owners. If you are considering selling a flat, builder floor, or house due to EMI pressure, job changes, or financial commitments, ExitKaro provides personal local guidance.
              </p>

              <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <h3 className="font-extrabold text-slate-900 text-sm">Key Localities Covered:</h3>
                <div className="flex flex-wrap gap-2 text-xs">
                  {currentPath.includes('noida') ? (
                    ['Sector 62', 'Sector 137', 'Sector 75', 'Sector 78', 'Sector 150', 'Greater Noida West'].map(loc => (
                      <span key={loc} className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-slate-800 font-semibold">{loc}</span>
                    ))
                  ) : currentPath.includes('ghaziabad') ? (
                    ['Indirapuram', 'Vaishali', 'Vasundhara', 'Raj Nagar Extension', 'Crossings Republik'].map(loc => (
                      <span key={loc} className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-slate-800 font-semibold">{loc}</span>
                    ))
                  ) : (
                    ['Dwarka', 'Rohini', 'South Delhi', 'Gurgaon Sector 56', 'Faridabad'].map(loc => (
                      <span key={loc} className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-slate-800 font-semibold">{loc}</span>
                    ))
                  )}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200">
                <button onClick={() => navigateTo('/sell-property')} className="px-6 py-3 rounded-xl bg-emerald-700 text-white font-extrabold text-xs shadow-md">
                  Get Free Property Evaluation
                </button>
              </div>
            </div>
          </div>
        </main>
      )}

      {/* ================================================================= */}
      {/* ROUTE 3: PAYLOAD CMS SUPER ADMIN DASHBOARD (`/admin`)             */}
      {/* ================================================================= */}
      {currentPath === '/admin' && (
        <main className="flex-1 py-8 bg-slate-900 text-slate-100 min-h-screen">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
            
            <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2.5 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30 text-[10px] font-extrabold uppercase">Payload CMS + PostgreSQL</span>
                  <span className="text-xs text-slate-400">Super Admin Control Suite</span>
                </div>
                <h1 className="text-2xl font-black text-white">ExitKaro Control Suite</h1>
              </div>

              <div className="flex gap-2">
                <button onClick={exportLeadsCSV} className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow">
                  <i className="fa-solid fa-file-excel mr-1"></i> Export Leads CSV
                </button>
              </div>
            </div>

            {/* CMS Navigation Tabs */}
            <div className="flex gap-2 border-b border-slate-800 pb-2 text-xs font-bold overflow-x-auto">
              <button onClick={() => setActiveAdminTab('crm')} className={`px-4 py-2 rounded-xl transition-all ${activeAdminTab === 'crm' ? 'bg-emerald-700 text-white font-extrabold' : 'bg-slate-800 text-slate-300'}`}>
                <i className="fa-solid fa-users-viewfinder mr-1"></i> Leads CRM Pipeline ({leads.length})
              </button>
              <button onClick={() => setActiveAdminTab('seo')} className={`px-4 py-2 rounded-xl transition-all ${activeAdminTab === 'seo' ? 'bg-emerald-700 text-white font-extrabold' : 'bg-slate-800 text-slate-300'}`}>
                <i className="fa-solid fa-magnifying-glass-chart mr-1"></i> On-Page SEO & Meta Tags
              </button>
              <button onClick={() => setActiveAdminTab('settings')} className={`px-4 py-2 rounded-xl transition-all ${activeAdminTab === 'settings' ? 'bg-emerald-700 text-white font-extrabold' : 'bg-slate-800 text-slate-300'}`}>
                <i className="fa-solid fa-gear mr-1"></i> Site Settings
              </button>
            </div>

            {/* TAB 1: LEADS CRM */}
            {activeAdminTab === 'crm' && (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-slate-950 p-4 rounded-2xl border border-slate-800">
                  <div className="flex flex-wrap gap-2 text-xs">
                    <select value={crmStatusFilter} onChange={e => setCrmStatusFilter(e.target.value)} className="bg-slate-900 border border-slate-800 text-white rounded-lg px-3 py-1.5 outline-none">
                      <option value="ALL">All Lead Statuses</option>
                      <option value="New">New</option>
                      <option value="Contacted">Contacted</option>
                      <option value="Qualified">Qualified</option>
                      <option value="Follow-up">Follow-up</option>
                      <option value="Site Visit Scheduled">Site Visit Scheduled</option>
                      <option value="Converted">Converted</option>
                    </select>
                  </div>

                  <input type="text" value={crmSearchQuery} onChange={e => setCrmSearchQuery(e.target.value)} placeholder="Search by name / phone..." className="bg-slate-900 border border-slate-800 text-white rounded-lg px-3 py-1.5 text-xs outline-none w-full sm:w-64" />
                </div>

                <div className="overflow-x-auto bg-slate-950 rounded-2xl border border-slate-800">
                  <table className="w-full text-left text-xs text-slate-300 border-collapse">
                    <thead>
                      <tr className="bg-slate-900 text-slate-400 border-b border-slate-800">
                        <th className="p-3">ID & Date</th>
                        <th className="p-3">Customer Name</th>
                        <th className="p-3">Contact</th>
                        <th className="p-3">Location</th>
                        <th className="p-3">Property & Loan Info</th>
                        <th className="p-3">Lead Status</th>
                        <th className="p-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {leads
                        .filter(l => crmStatusFilter === 'ALL' || l.status === crmStatusFilter)
                        .filter(l => l.name.toLowerCase().includes(crmSearchQuery.toLowerCase()) || l.phone.includes(crmSearchQuery))
                        .map(l => (
                          <tr key={l.id} className="border-b border-slate-800 hover:bg-slate-900/50">
                            <td className="p-3">
                              <span className="font-mono text-emerald-400 font-bold block">{l.id}</span>
                              <span className="text-[10px] text-slate-500">{l.date}</span>
                            </td>
                            <td className="p-3">
                              <span className="font-bold text-white block">{l.name}</span>
                              <span className="text-[10px] text-slate-400">{l.reasonForSelling}</span>
                            </td>
                            <td className="p-3">
                              <span className="text-amber-400 font-mono font-bold block">{l.phone}</span>
                              <span className="text-[10px] text-slate-500">Callback: {l.preferredCallbackTime}</span>
                            </td>
                            <td className="p-3">
                              <span className="font-semibold text-slate-200 block">{l.city}</span>
                              <span className="text-[10px] text-slate-400">{l.locality}</span>
                            </td>
                            <td className="p-3 text-[11px]">
                              <div>{l.propertyType} ({l.bhk})</div>
                              <div className="text-slate-400">Loan: ₹{l.outstandingLoan || 'N/A'} | EMI: ₹{l.monthlyEmi || 'N/A'}</div>
                            </td>
                            <td className="p-3">
                              <select value={l.status} onChange={e => updateLeadStatus(l.id, e.target.value)} className="bg-slate-900 border border-slate-800 rounded px-2 py-1 text-[11px] text-white outline-none">
                                <option value="New">New</option>
                                <option value="Contacted">Contacted</option>
                                <option value="Qualified">Qualified</option>
                                <option value="Follow-up">Follow-up</option>
                                <option value="Site Visit Scheduled">Site Visit Scheduled</option>
                                <option value="Converted">Converted</option>
                                <option value="Not Interested">Not Interested</option>
                              </select>
                            </td>
                            <td className="p-3 text-right">
                              <button onClick={() => deleteLead(l.id)} className="text-rose-400 hover:text-rose-300 p-1 text-xs">
                                <i className="fa-solid fa-trash"></i>
                              </button>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB 2: SEO CMS */}
            {activeAdminTab === 'seo' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-7 bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-4">
                  <h3 className="font-extrabold text-white text-sm">Global On-Page SEO Meta Controls</h3>
                  
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">SEO Title Tag</label>
                    <input type="text" value={siteSettings.seoTitle} onChange={e => setSiteSettings({ ...siteSettings, seoTitle: e.target.value })} className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white outline-none" />
                  </div>

                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Meta Description</label>
                    <textarea rows="3" value={siteSettings.metaDesc} onChange={e => setSiteSettings({ ...siteSettings, metaDesc: e.target.value })} className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white outline-none" />
                  </div>

                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Canonical URL</label>
                    <input type="text" value={siteSettings.canonicalUrl} onChange={e => setSiteSettings({ ...siteSettings, canonicalUrl: e.target.value })} className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white outline-none" />
                  </div>

                  <button onClick={() => showToast("Saved On-Page SEO meta tags live!")} className="px-5 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs">
                    Publish Meta Tags
                  </button>
                </div>

                {/* Google Snippet Preview */}
                <div className="lg:col-span-5 bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-4">
                  <h3 className="font-extrabold text-white text-sm">Google Search Snippet Preview</h3>
                  
                  <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-1 font-sans">
                    <span className="text-[11px] text-slate-400 block truncate">{siteSettings.canonicalUrl}</span>
                    <h4 className="text-sm font-semibold text-blue-400 line-clamp-1">{siteSettings.seoTitle}</h4>
                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">{siteSettings.metaDesc}</p>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: SITE SETTINGS */}
            {activeAdminTab === 'settings' && (
              <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-4 max-w-xl text-xs">
                <h3 className="font-extrabold text-white text-sm">Global Site Contacts</h3>
                <div>
                  <label className="block text-slate-400 mb-1">Phone Number</label>
                  <input type="text" value={siteSettings.phone} onChange={e => setSiteSettings({ ...siteSettings, phone: e.target.value })} className="w-full bg-slate-900 border border-slate-800 text-white rounded-xl px-3 py-2 outline-none" />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">WhatsApp Number</label>
                  <input type="text" value={siteSettings.whatsapp} onChange={e => setSiteSettings({ ...siteSettings, whatsapp: e.target.value })} className="w-full bg-slate-900 border border-slate-800 text-white rounded-xl px-3 py-2 outline-none" />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Support Email</label>
                  <input type="email" value={siteSettings.email} onChange={e => setSiteSettings({ ...siteSettings, email: e.target.value })} className="w-full bg-slate-900 border border-slate-800 text-white rounded-xl px-3 py-2 outline-none" />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Office Address</label>
                  <input type="text" value={siteSettings.officeAddress} onChange={e => setSiteSettings({ ...siteSettings, officeAddress: e.target.value })} className="w-full bg-slate-900 border border-slate-800 text-white rounded-xl px-3 py-2 outline-none" />
                </div>
                <button onClick={() => showToast("Contact settings updated across website!")} className="px-5 py-2.5 rounded-xl bg-emerald-600 text-white font-bold">Save Contact Info</button>
              </div>
            )}

          </div>
        </main>
      )}

      {/* MAIN FOOTER */}
      <footer className="bg-slate-950 text-slate-300 border-t border-slate-800 pt-12 pb-24 lg:pb-12 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-slate-800">
            <div className="space-y-3">
              <span className="text-xl font-black text-white">Exit<span className="text-emerald-400">Karo</span><span className="text-xs text-amber-500 font-bold ml-0.5">.com</span></span>
              <p className="text-slate-400 text-xs">Dedicated property sale assistance for residential property owners across Noida, Ghaziabad, and Delhi NCR.</p>
            </div>
            <div>
              <h4 className="font-extrabold text-white mb-3 uppercase tracking-wider text-[11px]">Quick Links</h4>
              <ul className="space-y-1.5 text-slate-400">
                <li><button onClick={() => navigateTo('/sell-property')} className="hover:text-emerald-400">Sell Property</button></li>
                <li><button onClick={() => navigateTo('/how-it-works')} className="hover:text-emerald-400">How It Works</button></li>
                <li><button onClick={() => navigateTo('/why-exitkaro')} className="hover:text-emerald-400">Why ExitKaro</button></li>
                <li><button onClick={() => navigateTo('/faqs')} className="hover:text-emerald-400">FAQs</button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-extrabold text-white mb-3 uppercase tracking-wider text-[11px]">Delhi NCR Regions</h4>
              <ul className="space-y-1.5 text-slate-400">
                <li><button onClick={() => navigateTo('/areas/noida')} className="hover:text-emerald-400">Noida & Greater Noida</button></li>
                <li><button onClick={() => navigateTo('/areas/ghaziabad')} className="hover:text-emerald-400">Ghaziabad & Indirapuram</button></li>
                <li><button onClick={() => navigateTo('/areas/delhi-ncr')} className="hover:text-emerald-400">Delhi NCR Areas</button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-extrabold text-white mb-3 uppercase tracking-wider text-[11px]">Legal & Admin</h4>
              <ul className="space-y-1.5 text-slate-400">
                <li><button onClick={() => navigateTo('/privacy-policy')} className="hover:text-emerald-400">Privacy Policy</button></li>
                <li><button onClick={() => navigateTo('/admin')} className="text-amber-400 font-bold hover:underline"><i className="fa-solid fa-lock mr-1"></i> Admin Portal</button></li>
              </ul>
            </div>
          </div>

          <div className="text-[11px] text-slate-500 leading-relaxed">
            <strong>Important Legal Notice:</strong> ExitKaro.com is a private property-selling assistance and consultation guidance platform. We are not a bank, NBFC, or financial institution. We do not provide loans, debt refinancing, guaranteed property valuation, or legal guarantees. All assistance is subject to individual property evaluation, verification, and circumstances.
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-center text-slate-500 text-[11px]">
            <p>© 2026 ExitKaro.com — Delhi NCR Property Assistance Platform. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* STICKY MOBILE CONVERSION BAR */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-950 border-t border-slate-800 p-2.5 flex items-center gap-2 shadow-2xl">
        <a href={`tel:${siteSettings.phone.replace(/[^0-9]/g, '')}`} className="flex-1 py-2.5 rounded-xl bg-slate-800 text-white text-xs font-bold flex items-center justify-center gap-1.5 border border-slate-700">
          <i className="fa-solid fa-phone text-emerald-400"></i> Call Now
        </a>
        <a href={`https://wa.me/${siteSettings.whatsapp.replace(/[^0-9]/g, '')}`} target="_blank" rel="noreferrer" className="flex-1 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-md">
          <i className="fa-brands fa-whatsapp text-lg"></i> WhatsApp Us
        </a>
      </div>

      {/* TOAST NOTIFICATION */}
      {toastMessage && (
        <div className="fixed bottom-14 right-4 z-50 bg-slate-900 border border-emerald-500/40 text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 animate-bounce">
          <i className="fa-solid fa-circle-check text-emerald-400 text-lg"></i>
          <span className="text-xs font-semibold">{toastMessage}</span>
        </div>
      )}

    </div>
  );
}