import React, { useState, useEffect } from 'react';
import './index.css';

// --- SHARED REDDISH-BLACK BACKGROUND (mobile + desktop) ---
function BackgroundGlow() {
  return (
    <>
      {/* Mobile / small screens: glow centered behind the portrait */}
      <div
        className="md:hidden fixed inset-0 w-full h-full -z-10"
        style={{
          backgroundColor: '#120201',
          background:
            'radial-gradient(ellipse at 50% 30%, #c2410c 0%, #7a1d05 30%, #2a0502 62%, #0d0201 100%)',
        }}
      ></div>
      {/* Desktop: orange glow on the left behind the photo, fading to reddish black */}
      <div
        className="hidden md:block fixed inset-0 w-full h-full -z-10"
        style={{
          backgroundColor: '#120201',
          background:
            'radial-gradient(ellipse at 12% 45%, #e2520b 0%, #b02f06 20%, #4a0a04 48%, #140201 82%)',
        }}
      ></div>
    </>
  );
}

// --- SMOOTH SCROLL REVEAL ANIMATION COMPONENT ---
function ScrollReveal({ children, className = "", delay = 0 }) {
  const [isVisible, setIsVisible] = useState(false);
  const domRef = React.useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: '0px 0px -50px 0px', threshold: 0.1 }
    );

    const currentRef = domRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, []);

  return (
    <div
      ref={domRef}
      className={`transition-all duration-1000 ease-out ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
      } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

// --- MAIN PORTFOLIO COMPONENT ---
function Portfolio({ setView }) {
  const [activeSection, setActiveSection] = useState('home');
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const [formData, setFormData] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [formStatus, setFormStatus] = useState('idle');

  useEffect(() => {
    const sections = ['home', 'about', 'services', 'projects', 'experience', 'education', 'skills', 'contact'];
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100;
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element && element.offsetTop <= scrollPosition && (element.offsetTop + element.offsetHeight) > scrollPosition) {
          setActiveSection(section);
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  // --- FIXED WEB3FORMS LOGIC FOR CONTACT FORM ---
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormStatus('submitting');

    const submitData = new FormData();
    submitData.append("access_key", "1f16ed81-b21b-4e51-acde-8b5ee0bdac85");
    submitData.append("subject", `New Contact from ${formData.name}: ${formData.subject || "Portfolio"}`);
    submitData.append("name", formData.name);
    submitData.append("email", formData.email);
    submitData.append("phone", formData.phone);
    submitData.append("message", formData.message);

    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: submitData
      });
      
      const data = await response.json();
      
      if (data.success) {
        setFormStatus('success');
        setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
        setTimeout(() => setFormStatus('idle'), 5000);
      } else {
        setFormStatus('idle');
        alert("Error sending message: " + data.message);
      }
    } catch (error) {
      console.error(error);
      setFormStatus('idle');
      alert("Something went wrong. Please try again.");
    }
  };

  const services = [
    { title: "Business Analysis & Strategy", desc: "Translating complex organizational needs into actionable technical requirements and risk-mitigating strategies.", bullets: ["Requirements Gathering", "Operational Risk Mitigation", "Process Optimization"], image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop" },
    { title: "Full-Stack Web Development", desc: "Building scalable, production-ready web applications that combine clean architecture with intuitive user experiences.", bullets: ["React & Next.js Frontends", "Node.js & Python Backends", "Responsive UI/UX"], image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=800&auto=format&fit=crop" },
    { title: "Data Analytics & Pipelines", desc: "Architecting automated ETL data pipelines to centralize unstructured data and drive actionable business intelligence.", bullets: ["ETL Pipeline Automation", "SQL & Python (Pandas)", "Time-Series Forecasting"], image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop" },
    { title: "API & Backend Integration", desc: "Designing robust RESTful APIs and connecting third-party services for seamless and secure data flow.", bullets: ["RESTful API Design", "Meta Graph API Integration", "JSON Data Payloads"], image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=800&auto=format&fit=crop" },
    { title: "Business Intelligence", desc: "Transforming raw data into interactive visual dashboards that track key performance metrics and compliance.", bullets: ["Power BI & Tableau", "Interactive Dashboards", "Strategic Reporting"], image: "https://images.unsplash.com/photo-1543286386-2e659306cd6c?q=80&w=800&auto=format&fit=crop" },
    { title: "Custom Software Solutions", desc: "Developing bespoke tools and CRM automations that solve real organizational problems and increase efficiency.", bullets: ["CRM Automation", "Database Centralization", "Secure Infrastructures"], image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=800&auto=format&fit=crop" }
  ];

  const projects = [
    { category: "Data Analytics & BI", title: "Public Housing & Demographics Dashboard", desc: "Interactive Power BI dashboard tracking regional housing trends, compliance metrics, and demographic distributions in Ghana.", bullets: ["Real-time KPI tracking", "Data visualization", "Centralized public datasets"], tech: ["Power BI", "SQL", "Python (Pandas)"], link: "#", image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop" },
    { category: "Full-Stack Web Engineering", title: "HHC Care Network Canada", desc: "A comprehensive healthcare service platform connecting patients with caregivers through a seamless, accessible digital interface.", bullets: ["Clean UI/UX architecture", "Secure user data handling", "Responsive mobile-first design"], tech: ["React", "TypeScript", "Tailwind CSS"], link: "https://hhccare.ca/", image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=800&auto=format&fit=crop" },
    { category: "Data Science & BI", title: "Enterprise Revenue Predictor", desc: "Machine learning pipeline and BI dashboard forecasting quarterly revenue trends, customer churn, and dynamic pricing strategies.", bullets: ["Time-series forecasting", "Predictive churn modeling", "Strategic business intelligence"], tech: ["Python (Scikit-Learn)", "Tableau", "SQL"], link: "#", image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=800&auto=format&fit=crop" },
    { category: "Full-Stack Web Engineering", title: "Delofy Corporate Platform", desc: "Production-ready corporate web application featuring secure e-commerce capabilities and background data payload processing.", bullets: ["Cryptographic authentication", "Background data processing", "Scalable infrastructure"], tech: ["React", "PHP", "JSON Payloads"], link: "https://delofy.com/", image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?q=80&w=800&auto=format&fit=crop" },
    { category: "Data Automation", title: "Autonomous Financial Data Bot", desc: "Engineered a fully autonomous WhatsApp bot integrating the Meta Graph API to process real-time commercial payments and log sales data.", bullets: ["Real-time transaction processing", "Automated sales logging", "Meta Graph API integration"], tech: ["Python", "Meta Graph API", "PostgreSQL"], link: "https://wa.link/r3034w", image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=800&auto=format&fit=crop" },
    { category: "Full-Stack Web Engineering", title: "Osdanwus Corporation Network", desc: "A responsive digital business portal supporting enterprise-level telecommunications and automated network data distribution.", bullets: ["Client dashboard management", "Data distribution logic", "Responsive frontend"], tech: ["React", "Express.js", "Node.js"], link: "https://osdanwus.org/", image: "https://images.unsplash.com/photo-1551434678-e076c223a692?q=80&w=800&auto=format&fit=crop" },
    { category: "Business Analytics", title: "BA-Farms Management Analytics", desc: "Custom agricultural analytics solution featuring automated business workflows, inventory KPI tracking, and supply chain centralization.", bullets: ["Inventory KPI tracking", "Supply chain dashboards", "Structured database design"], tech: ["SQL", "Power BI", "Python"], link: "#", image: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?q=80&w=800&auto=format&fit=crop" },
    { category: "Full-Stack Web Engineering", title: "Delofy Housing Real Estate Platform", desc: "A comprehensive real estate marketplace enabling verified agents to list properties and users to discover rentals across Ghana.", bullets: ["Property listing architecture", "Agent dashboard", "Search & filter functionality"], tech: ["React", "Next.js", "Node.js"], link: "https://housing.delofy.com", image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=800&auto=format&fit=crop" },
    { category: "Business Analytics", title: "Corporate Finance & HR Matrix", desc: "Comprehensive Tableau reporting suite designed for executive decision-making, consolidating financial performance and HR compliance data.", bullets: ["Automated ETL data pipelines", "Financial KPI monitoring", "Cross-departmental reporting"], tech: ["Tableau", "PostgreSQL", "Python"], link: "#", image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop" },
    { category: "Full-Stack Web Engineering", title: "NashData Telecom Portal", desc: "A fast, user-friendly digital telecommunications platform facilitating seamless mobile data reselling and network transactions in Ghana.", bullets: ["Mobile-first UI/UX", "Telecom API integration", "Secure transaction routing"], tech: ["JavaScript", "PHP", "MySQL"], link: "https://nashdata.online", image: "https://images.unsplash.com/photo-1526628953301-3e589a6a8b74?q=80&w=800&auto=format&fit=crop" },
    { category: "Data Science & BI", title: "HR Attrition & Optimization Model", desc: "A data science model and reporting dashboard analyzing employee attrition rates, performance metrics, and departmental resource allocation.", bullets: ["Statistical inference modeling", "HR compliance reporting", "Resource allocation tracking"], tech: ["R-Programming", "Power BI", "SQL"], link: "#", image: "https://images.unsplash.com/photo-1543286386-2e659306cd6c?q=80&w=800&auto=format&fit=crop" },
    { category: "Web Engineering & AI", title: "Delotranslate / Delovibe AI Suite", desc: "An AI-driven workstation featuring a conversational agent (Delovibe) and a professional linguistic translator (Delotranslate).", bullets: ["AI-driven semantic analysis", "Natural language processing", "Scalable backend integration"], tech: ["React", "Flask", "AI Tooling"], link: "#", image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=800&auto=format&fit=crop" }
  ];

  // Smaller icons (w-6 h-6 to w-7 h-7)
  const techStack = [
    { name: "Python", category: "Data Science", 
      icon: <svg viewBox="0 0 24 24" className="w-6 h-6 md:w-7 md:h-7 fill-current"><rect width="24" height="24" rx="4" /><text x="12" y="14" alignmentBaseline="middle" textAnchor="middle" fill="#fdfbf9" fontSize="12" fontWeight="bold" fontFamily="sans-serif">Py</text></svg> 
    },
    { name: "React", category: "Web Engineering", 
      icon: <svg viewBox="0 0 24 24" className="w-6 h-6 md:w-7 md:h-7 fill-none stroke-current" strokeWidth="1.5"><circle cx="12" cy="12" r="2.5" fill="currentColor" stroke="none"/><ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(30 12 12)"/><ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(150 12 12)"/><ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(90 12 12)"/></svg>
    },
    { name: "Next.js", category: "Web Engineering", 
      icon: <svg viewBox="0 0 24 24" className="w-6 h-6 md:w-7 md:h-7 fill-current"><path fillRule="evenodd" clipRule="evenodd" d="M12 24C18.6274 24 24 18.6274 24 12C24 5.37258 18.6274 0 12 0C5.37258 0 0 5.37258 0 12C0 18.6274 5.37258 24 12 24ZM19.2622 17.5131L9.63875 4.5H7.5V19.5H9.76125V8.92484L17.8863 19.5C18.3842 18.9168 18.8504 18.2435 19.2622 17.5131ZM16.5 4.5H14.2387V15.0752L16.5 18.0166V4.5Z"/></svg>
    },
    { name: "Node.js", category: "Web Engineering", 
      icon: <svg viewBox="0 0 24 24" className="w-6 h-6 md:w-7 md:h-7 fill-current"><path d="M11.83 0L1.6 5.86V17.65L11.83 23.51L22.06 17.65V5.86L11.83 0ZM11.82 21.65L3.21 16.71V6.79L11.82 1.84L20.44 6.79V16.71L11.82 21.65ZM15.42 8.42H13.65V13.84C13.65 14.5 13.1 15 12.43 15H11.58V8.42H9.8V15.34C9.8 16.32 10.59 17.11 11.58 17.11H12.43C13.41 17.11 14.21 16.32 14.21 15.34V10.2H15.42V8.42Z"/></svg>
    },
    { name: "PostgreSQL", category: "Data Science", 
      icon: <svg viewBox="0 0 24 24" className="w-6 h-6 md:w-7 md:h-7 fill-none stroke-current stroke-[1.5]"><path d="M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21Z"/><path d="M12 7V17M8 10H16M8 14H16"/></svg>
    },
    { name: "TypeScript", category: "Web Engineering", 
      icon: <svg viewBox="0 0 24 24" className="w-6 h-6 md:w-7 md:h-7 fill-current"><rect width="24" height="24" rx="4" /><text x="12" y="14" alignmentBaseline="middle" textAnchor="middle" fill="#fdfbf9" fontSize="12" fontWeight="bold" fontFamily="sans-serif">TS</text></svg>
    },
    { name: "Power BI", category: "Business Analytics", 
      icon: <svg viewBox="0 0 24 24" className="w-6 h-6 md:w-7 md:h-7 fill-current"><rect x="4" y="14" width="4" height="8" rx="1"/><rect x="10" y="8" width="4" height="14" rx="1"/><rect x="16" y="2" width="4" height="20" rx="1"/></svg>
    },
    { name: "Tableau", category: "Data Analytics", 
      icon: <svg viewBox="0 0 24 24" className="w-6 h-6 md:w-7 md:h-7 fill-current"><circle cx="12" cy="12" r="4"/><circle cx="5" cy="12" r="2"/><circle cx="19" cy="12" r="2"/><circle cx="12" cy="5" r="2"/><circle cx="12" cy="19" r="2"/></svg>
    },
    { name: "Excel", category: "Business Analytics", 
      icon: <svg viewBox="0 0 24 24" className="w-6 h-6 md:w-7 md:h-7 fill-current"><path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm-1.8 14.8L10 14.5l-2.2 2.3H6.4l3.1-3.2-3-3.2h1.5l2 2.2 2-2.2h1.4l-3 3.2 3.1 3.2h-1.3z"/></svg>
    },
    { name: "Tailwind CSS", category: "Web Engineering", 
      icon: <svg viewBox="0 0 24 24" className="w-6 h-6 md:w-7 md:h-7 fill-current"><path d="M12 6c-3.18 0-5.82 2.1-6.5 5.5.68-2.55 2.5-3.5 4.5-3.5 1.5 0 2.25.75 3.5 2C15 11.5 16 13 19 13c3.18 0 5.82-2.1 6.5-5.5-.68 2.55-2.5 3.5-4.5 3.5-1.5 0-2.25-.75-3.5-2C16 7.5 15 6 12 6zM5.5 13c-3.18 0-5.82 2.1-6.5 5.5.68-2.55 2.5-3.5 4.5-3.5 1.5 0 2.25.75 3.5 2C8.5 18.5 9.5 20 12.5 20c3.18 0 5.82-2.1 6.5-5.5-.68 2.55-2.5 3.5-4.5 3.5-1.5 0-2.25-.75-3.5-2C9.5 14.5 8.5 13 5.5 13z"/></svg>
    },
    { name: "Scikit-Learn", category: "Machine Learning", 
      icon: <svg viewBox="0 0 24 24" className="w-6 h-6 md:w-7 md:h-7 fill-none stroke-current" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M8 12L16 12M12 8L12 16" strokeLinecap="round"/></svg>
    },
    { name: "Figma", category: "UI/UX Design", 
      icon: <svg viewBox="0 0 24 24" className="w-6 h-6 md:w-7 md:h-7 fill-current"><path d="M12 2.001A3.5 3.5 0 0 0 8.5 5.5v13a3.5 3.5 0 0 0 7 0V5.5A3.5 3.5 0 0 0 12 2.001zm0 7A3.5 3.5 0 0 0 8.5 12.5a3.5 3.5 0 0 0 7 0 3.5 3.5 0 0 0-3.5-3.499z"/></svg>
    },
    { name: "R-Programming", category: "Data Science", 
      icon: <svg viewBox="0 0 24 24" className="w-6 h-6 md:w-7 md:h-7 fill-current"><rect width="24" height="24" rx="4" /><text x="12" y="14" alignmentBaseline="middle" textAnchor="middle" fill="#fdfbf9" fontSize="14" fontWeight="bold" fontFamily="sans-serif">R</text></svg>
    },
    { name: "Looker Studio", category: "Data Visualization", 
      icon: <svg viewBox="0 0 24 24" className="w-6 h-6 md:w-7 md:h-7 fill-none stroke-current" strokeWidth="2"><path d="M3 3v18h18M7 16l4-4 4 4 6-6" strokeLinecap="round" strokeLinejoin="round"/></svg>
    },
    { name: "Docker", category: "Web Engineering", 
      icon: <svg viewBox="0 0 24 24" className="w-6 h-6 md:w-7 md:h-7 fill-current"><path d="M11 11h2v2h-2v-2zm-3 0h2v2H8v-2zm6 0h2v2h-2v-2zm-9 0h2v2H5v-2zm3-3h2v2H8V8zm6 0h2v2h-2V8zm-3 0h2v2h-2V8zm-3-3h2v2H8V5zM2 14.5c0 2.5 3.5 4.5 10 4.5s10-2 10-4.5h-2c0 1.5-2.5 2.5-8 2.5s-8-1-8-2.5H2z"/></svg>
    },
    { name: "GitHub", category: "Version Control", 
      icon: <svg viewBox="0 0 24 24" className="w-6 h-6 md:w-7 md:h-7 fill-current"><path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.268 2.75 1.022A9.606 9.606 0 0112 6.82c.85.004 1.705.114 2.504.336 1.909-1.29 2.747-1.022 2.747-1.022.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.161 22 16.416 22 12c0-5.523-4.477-10-10-10z"/></svg>
    }
  ];

  return (
    <div className="min-h-screen font-sans selection:bg-[#ea580c] selection:text-white relative overflow-x-hidden text-white bg-[#120201]">

      {/* BACKGROUND GLOW */}
      <BackgroundGlow />

      {/* 1. NAVIGATION BAR */}
      <nav className="fixed top-0 w-full bg-transparent border-b border-white/5 z-50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-5 py-4 flex justify-between items-center">

          <div className="text-xl md:text-2xl font-black tracking-tighter cursor-pointer" onClick={() => window.scrollTo(0,0)}>
            <span className="text-white">LO</span><span className="text-[#ea580c]">.</span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden lg:flex space-x-6 text-[12px] xl:text-[13px] font-bold tracking-widest uppercase items-center">
            {['home', 'about', 'services', 'projects', 'experience', 'education', 'skills', 'contact'].map((item) => (
              <a
                key={item}
                href={`#${item}`}
                className={`transition-colors ${activeSection === item ? 'text-[#ea580c]' : 'text-white/70 hover:text-white'}`}
              >
                {item}
              </a>
            ))}
            <button onClick={() => setView('inquiry')} className="text-[#ea580c] hover:text-white text-[12px] xl:text-[13px] font-bold tracking-widest uppercase transition-colors ml-4 border border-[#ea580c]/30 px-4 py-2 rounded-full hover:border-[#ea580c]">
              Start a Project
            </button>
          </div>

          {/* Mobile Hamburger Button */}
          <button
            className="lg:hidden text-white p-2 focus:outline-none z-[110]"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </nav>

      {/* MOBILE SLIDE-IN DRAWER */}
      <div
        className={`lg:hidden fixed inset-0 bg-black/70 backdrop-blur-sm z-[100] transition-opacity duration-300 ${isMobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
        onClick={closeMobileMenu}
      ></div>

      <div className={`lg:hidden fixed top-0 right-0 h-[60vh] w-[65%] sm:w-[45%] bg-[#f9f5f0] shadow-2xl z-[105] transform transition-transform duration-300 ease-in-out flex flex-col p-5 rounded-bl-3xl border-b border-l border-black/10 overflow-hidden ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>

        <div className="flex justify-end mb-4">
          <button onClick={closeMobileMenu} className="text-[#111111] p-1.5 hover:text-[#ea580c] transition-colors bg-black/5 rounded-full">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Menu Items strictly pushed to the top */}
        <div className="flex flex-col gap-4 flex-1 justify-start pt-2">
          {['home', 'about', 'services', 'projects', 'experience', 'education', 'skills', 'contact'].map((item) => (
            <a
              key={item}
              href={`#${item}`}
              onClick={closeMobileMenu}
              className="text-[#111111] hover:text-[#ea580c] text-[12px] font-black tracking-[0.2em] uppercase transition-colors px-2"
            >
              {item}
            </a>
          ))}
          <div className="mt-2 pt-5 border-t border-black/10 px-2">
            <button
              onClick={() => { closeMobileMenu(); setView('inquiry'); }}
              className="w-full text-center bg-[#ea580c] hover:bg-[#c2410c] text-white py-3 rounded-xl text-[11px] font-bold tracking-[0.15em] uppercase shadow-lg transition-colors"
            >
              Start a Project
            </button>
          </div>
        </div>

      </div>

      {/* 2. HERO SECTION */}
      <main className="pt-0 md:pt-[100px] px-0 md:px-6 max-w-7xl mx-auto relative z-10 pb-0 mb-0">
        <section
          id="home"
          className="relative min-h-[80svh] md:min-h-[85vh] flex flex-col md:flex-row items-center md:items-end justify-between md:border-b md:border-white/5 pb-0 mb-0"
        >

          {/* --- DESKTOP HERO LAYOUT --- */}
          <div className="hidden md:flex w-full md:w-1/2 justify-start items-end h-full relative z-10">
            <ScrollReveal delay={100} className="w-full h-full flex items-end">
              <img src="/profile.png" alt="Listowel Owusu" className="w-[85%] max-h-full object-contain object-bottom drop-shadow-2xl brightness-105" />
            </ScrollReveal>
          </div>
          <div className="hidden md:flex w-full md:w-1/2 flex-col items-start text-left mb-8 z-10">
            <ScrollReveal delay={200}>
              <h1 className="text-[90px] lg:text-[110px] font-black tracking-tighter leading-none">
                <span className="text-white/90">Listowel</span><br/>
                <span className="text-white/50">Owusu</span>
              </h1>
              <div className="w-24 h-1 bg-[#ea580c] mt-8 mb-6 rounded-full"></div>
              <p className="text-3xl text-white/60 font-medium mb-12 flex items-center justify-start gap-4">
                Business Analyst <span className="text-[#ea580c] font-light">|</span> Web Engineer
              </p>
              <div className="flex flex-row space-x-4">
                <a href="#projects" className="bg-gradient-to-r from-[#f9591b] to-[#dc3a22] hover:brightness-110 text-white px-8 py-3.5 rounded-lg font-bold transition text-lg shadow-lg text-center tracking-wide">Explore My Work</a>
                <button onClick={() => setView('inquiry')} className="border border-white/30 hover:border-white/80 text-white px-8 py-3.5 rounded-lg font-bold transition-all text-lg text-center tracking-wide">Start a Project</button>
              </div>
            </ScrollReveal>
          </div>

          {/* --- MOBILE HERO LAYOUT --- */}
          <div className="md:hidden relative w-full h-[80svh] flex flex-col justify-between overflow-hidden">
            
            <ScrollReveal delay={100} className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full z-10 flex justify-center">
              <img
                src="/profile.png"
                alt="Listowel Owusu"
                className="w-[135vw] sm:w-[120vw] max-w-[480px] h-auto pointer-events-none select-none drop-shadow-2xl"
              />
            </ScrollReveal>

            <div className="absolute inset-x-0 bottom-0 h-[50%] bg-gradient-to-t from-[#0d0201] via-[#0d0201]/80 to-transparent z-20 pointer-events-none"></div>

            <ScrollReveal delay={200} className="relative z-30 flex flex-col items-center pt-[100px]">
              <div className="w-16 h-[3px] bg-[#ea580c]/80 mb-5 rounded-full"></div>
              <p className="text-[16px] text-white/80 font-medium tracking-wide">
                Business Analyst <span className="text-[#ea580c] mx-2">|</span> Web Engineer
              </p>
            </ScrollReveal>

            <ScrollReveal delay={300} className="relative z-30 flex flex-col w-full gap-3 px-5 pb-6 mt-auto max-w-[420px] mx-auto">
              <a href="#projects" className="w-full bg-gradient-to-r from-[#f06a35] to-[#d7432a] text-white py-4 rounded-lg font-bold text-[15px] text-center shadow-[0_4px_14px_rgba(234,88,12,0.4)]">Explore My Work</a>
              <button onClick={() => setView('inquiry')} className="w-full bg-black/30 border border-white/30 text-white py-4 rounded-lg font-bold text-[15px] text-center backdrop-blur-md">Start a Project</button>
            </ScrollReveal>

          </div>
        </section>
      </main>

      {/* 3. ABOUT SECTION */}
      <section id="about" className="pt-2 pb-20 md:py-24 bg-[#f9f5f0] relative z-20">
        <div className="max-w-7xl mx-auto px-6 w-full flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-20">

          <ScrollReveal className="w-full md:w-5/12 relative flex justify-center mb-10 md:mb-0 mt-8 md:mt-0">
            <div className="absolute inset-0 bg-[#ea580c] blur-[30px] md:blur-[50px] opacity-30 rounded-3xl transform scale-95 translate-y-4"></div>
            <div className="relative w-full max-w-[280px] sm:max-w-[320px] md:max-w-[420px] aspect-[4/5] bg-gradient-to-br from-[#f97316] to-[#7f1d1d] rounded-3xl overflow-hidden shadow-2xl">
              <img src="/profile.png" alt="Listowel Owusu" className="w-full h-full object-cover object-bottom" />
            </div>
            <div className="absolute -bottom-4 md:-bottom-5 left-1/2 -translate-x-1/2 bg-[#ea580c] text-white px-6 md:px-8 py-2 md:py-3 rounded-xl font-bold text-[13px] md:text-xl whitespace-nowrap shadow-xl">
              Business Analyst | Web Engineer
            </div>
          </ScrollReveal>

          <ScrollReveal delay={200} className="w-full md:w-7/12 text-left mt-4 md:mt-0">
            <div className="flex items-center gap-3 mb-4 md:mb-6">
              <span className="text-[#ea580c] text-[11px] md:text-sm font-bold tracking-[0.25em] uppercase">01 &mdash; About Me</span>
            </div>
            <h2 className="text-[2.5rem] md:text-5xl lg:text-6xl font-black text-[#111111] leading-[1.1] mb-6 md:mb-8 tracking-tight">
              Turning ideas <br className="block" />
              <span className="text-[#ea580c] font-serif italic font-medium">into reality,</span> <br className="block" />
              one line at a time.
            </h2>
            <div className="text-[#4b5563] text-sm md:text-lg leading-relaxed space-y-4 md:space-y-6">
              <p>I am a Certified Business Analyst and versatile Full-Stack Web Engineer. I specialize in data-driven strategies. I architect automated business data pipelines and leverage advanced analytics, including SQL, Python (Pandas), and Power BI, to centralize data, mitigate operational risks, and enforce data privacy compliance.</p>
              <p>Beyond data analytics, my technical foundation spans across modern frontend interfaces and robust backend architectures, allowing me to engineer web applications using React, Next.js, Node.js, and Python.</p>
              <p>My goal is to translate complex technical requirements and behavioral metrics into practical, high-performance commercial tools that solve real organizational problems.</p>
            </div>
            <div className="flex flex-wrap gap-2 mt-8 md:mt-10">
              {['Data Analytics', 'Python (Pandas)', 'Full-Stack Development', 'Business Intelligence', 'API Development', 'SQL (PostgreSQL, MySQL)', 'Power BI', 'R-Programming', 'Tableau', 'Visualization Boards', 'Git', 'Node.js', 'Flask', 'PHP', 'WordPress', 'JSON Payloads', 'AI', 'ETL Pipelines', 'Web Applications'].map(skill => (
                <span key={skill} className="bg-[#ea580c]/10 text-[#ea580c] px-3 md:px-3 py-1.5 md:py-1.5 rounded-full text-[10px] md:text-xs font-semibold border border-[#ea580c]/20 cursor-default">{skill}</span>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* 4. SERVICES SECTION */}
      <section id="services" className="py-20 md:py-32 bg-[#0a0201] relative z-20 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <ScrollReveal className="mb-12 md:mb-16">
            <div className="flex items-center gap-3 mb-4 md:mb-6">
              <span className="text-[#ea580c] text-xs md:text-sm font-bold tracking-[0.25em] uppercase">02 &mdash; What I Do</span>
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight">Services<span className="text-[#ea580c]">.</span></h2>
            <p className="text-[#a3a3a3] mt-4 text-sm md:text-lg max-w-2xl">Bridging the gap between data-driven business strategy and high-performance software engineering.</p>
          </ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {services.map((service, index) => (
              <ScrollReveal key={index} delay={(index % 3) * 150} className="h-full">
                <div className="bg-[#111111] rounded-2xl overflow-hidden border border-white/5 hover:border-[#ea580c]/30 transition-colors duration-300 flex flex-col shadow-2xl group h-full">
                  <div className="h-40 md:h-48 w-full bg-[#1a1a1a] relative border-b border-white/5 overflow-hidden flex-shrink-0">
                    <img src={service.image} alt={service.title} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#111111] to-transparent opacity-80"></div>
                  </div>
                  <div className="p-6 md:p-8 flex-1 flex flex-col relative z-10">
                    <h3 className="text-xl md:text-2xl font-bold text-white mb-2 md:mb-3">{service.title}</h3>
                    <p className="text-[#a3a3a3] text-sm leading-relaxed mb-5 md:mb-6 flex-1">{service.desc}</p>
                    <ul className="space-y-2 md:space-y-3">
                      {service.bullets.map((bullet, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <span className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-sm bg-[#ea580c] mt-1.5 flex-shrink-0"></span>
                          <span className="text-[#d1d5db] text-xs md:text-sm font-medium">{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* 5. PROJECTS SECTION */}
      <section id="projects" className="py-20 md:py-32 bg-[#0a0201] relative z-20">
        <div className="max-w-7xl mx-auto px-6">
          <ScrollReveal className="mb-12 md:mb-16">
            <div className="flex items-center gap-3 mb-4 md:mb-6">
              <span className="text-[#ea580c] text-xs md:text-sm font-bold tracking-[0.25em] uppercase">03 &mdash; Selected Work</span>
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight">Projects<span className="text-[#ea580c]">.</span></h2>
            <p className="text-[#a3a3a3] mt-4 text-sm md:text-lg max-w-2xl">A selection of data dashboards, web platforms, and automated software utilities I've engineered.</p>
          </ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {projects.map((project, index) => (
              <ScrollReveal key={index} delay={(index % 2) * 200} className="h-full">
                <div className="bg-[#111111] rounded-2xl overflow-hidden border border-white/5 hover:border-[#ea580c]/50 transition-all duration-300 flex flex-col shadow-2xl group h-full">
                  <div className="h-48 md:h-64 w-full bg-[#1a1a1a] relative border-b border-white/5 overflow-hidden flex-shrink-0">
                    <img src={project.image} alt={project.title} className="w-full h-full object-cover opacity-70 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500" />
                    <div className="absolute top-3 left-3 md:top-4 md:left-4 bg-[#ea580c] text-white px-2 py-1 md:px-3 md:py-1 rounded text-[10px] md:text-xs font-bold uppercase tracking-wider shadow-lg">{project.category}</div>
                  </div>
                  <div className="p-6 md:p-8 flex-1 flex flex-col">
                    <h3 className="text-xl md:text-2xl font-bold text-white mb-2 md:mb-3 group-hover:text-[#ea580c] transition-colors">{project.title}</h3>
                    <p className="text-[#a3a3a3] text-sm leading-relaxed mb-5 md:mb-6 flex-1">{project.desc}</p>
                    <ul className="space-y-2 md:space-y-3 mb-6 md:mb-8">
                      {project.bullets.map((bullet, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <span className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-sm bg-[#ea580c] mt-1.5 flex-shrink-0"></span>
                          <span className="text-[#d1d5db] text-xs md:text-sm font-medium">{bullet}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-auto pt-5 md:pt-6 border-t border-white/5 flex flex-col xl:flex-row items-start xl:items-center justify-between gap-4">
                      <div className="flex flex-wrap gap-1.5 md:gap-2 text-[9px] md:text-[11px] font-bold text-[#a3a3a3] uppercase tracking-wider">
                        {project.tech.map((techItem, i) => (
                          <span key={i} className="flex items-center gap-1.5 md:gap-2">
                            {techItem} {i < project.tech.length - 1 && <span className="text-[#ea580c]">•</span>}
                          </span>
                        ))}
                      </div>
                      {project.link !== "#" ? (
                        <a href={project.link} target="_blank" rel="noreferrer" className="w-full sm:w-auto text-center bg-[#ea580c] hover:bg-[#c2410c] text-white px-5 md:px-6 py-2 md:py-2.5 rounded font-bold transition-colors text-xs md:text-sm whitespace-nowrap shadow-md">Live Demo</a>
                      ) : (
                        <a 
  href="/ghana_housing_analytics_listowel_owusu.html" 
  target="_blank" 
  rel="noopener noreferrer"
  className="inline-block px-4 py-2 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 transition-colors"
>
  View Live Dashboard
</a>
                      )}
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* 6. RESUME SECTION */}
      <section id="experience" className="py-20 md:pt-32 bg-[#f9f5f0] text-[#111111] relative z-20">
        <div className="max-w-7xl mx-auto px-6">
          <ScrollReveal className="mb-12 md:mb-16">
            <div className="flex items-center gap-3 mb-4 md:mb-6">
              <span className="text-[#ea580c] text-xs md:text-sm font-bold tracking-[0.25em] uppercase">04 &mdash; Résumé</span>
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-7xl font-black text-[#111111] tracking-tight">Experience<span className="text-[#ea580c]">.</span></h2>
          </ScrollReveal>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16">
            <ScrollReveal delay={150}>
              <div className="flex items-center gap-3 mb-6 md:mb-8">
                <span className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-[#ea580c]"></span>
                <h3 className="text-xl md:text-2xl font-bold">Professional Experience</h3>
              </div>
              <div className="border-l border-[#ea580c]/30 pl-6 md:pl-8 space-y-10 md:space-y-12 relative">
                <div className="relative">
                  <div className="absolute -left-[29px] md:-left-[37px] top-1.5 w-2 md:w-2.5 h-2 md:h-2.5 rounded-full bg-[#ea580c]"></div>
                  <h4 className="text-base md:text-xl font-bold text-[#111111]">Lead Data Automation & Software Engineer</h4>
                  <p className="text-[11px] md:text-sm font-semibold text-[#6b7280] mt-1 mb-2 md:mb-3">Delofy Technologies & Delords Workspace | 2023 - Present</p>
                  <p className="text-[#4b5563] text-xs md:text-sm leading-relaxed">Engineered autonomous WhatsApp financial bots via Meta Graph API for secure transaction processing. Architected automated CRM data pipelines and optimized e-commerce architecture utilizing background processing (WP Cron) for heavy data payloads.</p>
                </div>
                
                <div className="relative">
                  <div className="absolute -left-[29px] md:-left-[37px] top-1.5 w-2 md:w-2.5 h-2 md:h-2.5 rounded-full bg-[#ea580c]"></div>
                  <h4 className="text-base md:text-xl font-bold text-[#111111]">Research, Policy & Data Analyst</h4>
                  <p className="text-[11px] md:text-sm font-semibold text-[#6b7280] mt-1 mb-2 md:mb-3">Rent Control Dept, Ministry of Works & Housing | 2024 - Present</p>
                  <p className="text-[#4b5563] text-xs md:text-sm leading-relaxed">Centralized unstructured records into a secure SQL database, significantly reducing agent fraud. Designed automated Python ETL pipelines and interactive Power BI dashboards to track regional housing trends, compliance, and departmental KPIs.</p>
                </div>

                <div className="relative">
                  <div className="absolute -left-[29px] md:-left-[37px] top-1.5 w-2 md:w-2.5 h-2 md:h-2.5 rounded-full bg-[#ea580c]"></div>
                  <h4 className="text-base md:text-xl font-bold text-[#111111]">Software Engineer</h4>
                  <p className="text-[11px] md:text-sm font-semibold text-[#6b7280] mt-1 mb-2 md:mb-3">BestChoice Technologies & Solutions | 2024 - 2026</p>
                  <p className="text-[#4b5563] text-xs md:text-sm leading-relaxed">Led technical decision-making and developed RESTful APIs to support robust frontend logic. Built and maintained production dashboards to monitor business operations, participating in code reviews and full-lifecycle software deployment.</p>
                </div>
              </div>
            </ScrollReveal>
            
            <ScrollReveal delay={300} id="education">
              <div className="flex items-center gap-3 mb-6 md:mb-8">
                <span className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-[#ea580c]"></span>
                <h3 className="text-xl md:text-2xl font-bold">Education</h3>
              </div>
              <div className="border-l border-[#ea580c]/30 pl-6 md:pl-8 space-y-10 md:space-y-12 relative">
                <div className="relative">
                  <div className="absolute -left-[29px] md:-left-[37px] top-1.5 w-2 md:w-2.5 h-2 md:h-2.5 rounded-full bg-[#ea580c]"></div>
                  <h4 className="text-base md:text-xl font-bold text-[#111111]">M.Sc. Data and Business Analytics</h4>
                  <p className="text-[11px] md:text-sm font-semibold text-[#6b7280] mt-1 mb-2 md:mb-3">Kwame Nkrumah University of Science and Technology | 2026 - Present</p>
                  <p className="text-[#4b5563] text-xs md:text-sm leading-relaxed"><strong>Relevant Coursework:</strong> Applied Regression Analysis, Statistical Inference, Prompt Engineering, SQL, Python, R, Tableau, Power BI, Probability and Stochastic Models.</p>
                </div>
                <div className="relative">
                  <div className="absolute -left-[29px] md:-left-[37px] top-1.5 w-2 md:w-2.5 h-2 md:h-2.5 rounded-full bg-[#ea580c]"></div>
                  <h4 className="text-base md:text-xl font-bold text-[#111111]">BSc. Information Technology & Psychology</h4>
                  <p className="text-[11px] md:text-sm font-semibold text-[#6b7280] mt-1 mb-2 md:mb-3">University of Education, Winneba | 2020 - 2024</p>
                  <p className="text-[#4b5563] text-xs md:text-sm leading-relaxed"><strong>Relevant Coursework:</strong> Data Structures and Algorithms, Database Management Systems, Object-Oriented Programming, Information Assurance, Measurement & Statistics.</p>
                </div>
                <div className="relative">
                  <div className="absolute -left-[29px] md:-left-[37px] top-1.5 w-2 md:w-2.5 h-2 md:h-2.5 rounded-full bg-[#ea580c]"></div>
                  <h4 className="text-base md:text-xl font-bold text-[#111111]">Full-Stack Development</h4>
                  <p className="text-[11px] md:text-sm font-semibold text-[#6b7280] mt-1 mb-2 md:mb-3">Independent Study & Applied Practice</p>
                  <p className="text-[#4b5563] text-xs md:text-sm leading-relaxed">Hands-on experience building modern web applications using JavaScript, TypeScript, React, Next.js, Node.js, Express.js, PostgreSQL, MongoDB, and cloud platforms. Focused on scalable architecture, clean code, performance optimization, and industry best practices.</p>
                </div>
                <div className="relative">
                  <div className="absolute -left-[29px] md:-left-[37px] top-1.5 w-2 md:w-2.5 h-2 md:h-2.5 rounded-full bg-[#ea580c]"></div>
                  <h4 className="text-base md:text-xl font-bold text-[#111111]">Global Certifications</h4>
                  <p className="text-[11px] md:text-sm font-semibold text-[#6b7280] mt-1 mb-2 md:mb-3">Professional Credentials</p>
                  <p className="text-[#4b5563] text-xs md:text-sm leading-relaxed">Google Data Analytics Professional Certificate, EC-Council Information Security Analyst, IBM Data Engineering Credential, HRCI Compliance & Risk Management Certificate.</p>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* 7. SKILLS SECTION */}
      <section id="skills" className="py-20 md:py-24 bg-[#f9f5f0] text-[#111111] relative z-20 border-b border-black/5">
        <div className="max-w-7xl mx-auto px-6">
          <ScrollReveal className="flex items-center gap-3 mb-8 md:mb-12">
            <span className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-[#ea580c]"></span>
            <h3 className="text-xl md:text-2xl font-bold">Tech Stack & Tools</h3>
          </ScrollReveal>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
            {techStack.map((tech, index) => (
              <ScrollReveal key={index} delay={(index % 4) * 100}>
                <div className="bg-[#fcfcfb] rounded-[18px] py-6 px-4 md:py-8 md:px-6 flex flex-col items-center justify-center shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-[#eaeaea] hover:shadow-[0_8px_30px_rgba(234,88,12,0.08)] hover:border-[#ea580c]/40 transition-all duration-300 group">
                  <div className="text-[#333333] group-hover:text-[#ea580c] transition-colors mb-3">
                    {tech.icon}
                  </div>
                  <span className="font-mono text-[10px] md:text-[11px] text-[#888888] font-semibold tracking-wider group-hover:text-[#ea580c] transition-colors text-center">{tech.name}</span>
                </div>
              </ScrollReveal>
            ))}
          </div>
          
          <ScrollReveal delay={200} className="mt-12 md:mt-16 pt-10 md:pt-12 border-t border-black/10">
            <h4 className="font-bold mb-4 md:mb-6 text-base md:text-lg">Applied Professional Competencies</h4>
            <div className="flex flex-wrap gap-2 md:gap-3">
              {["Agile Project Management", "Operational Risk Mitigation", "Data Privacy Compliance", "Strategic IT Planning", "CRM Automation Architecture", "ETL Pipeline Design", "Cryptographic Authentication", "Quantitative Research", "UI/UX System Design"].map(skill => (
                <span key={skill} className="bg-[#111111] text-white px-3 md:px-4 py-1.5 md:py-2 rounded-full text-[10px] md:text-xs font-semibold tracking-wide">{skill}</span>
              ))}
            </div>
          </ScrollReveal>
          
          <ScrollReveal delay={300} className="mt-16 md:mt-20 flex justify-center">
            <a href="https://www.dropbox.com/scl/fi/dal0bkueegjx1m5mon886/Owusu_Listowel_C-DFSIT.pdf?rlkey=7813dccofvtbj7r0nujr8x9v3&st=14e37xny&dl=0" target="_blank" rel="noreferrer" className="w-full sm:w-auto justify-center bg-[#ea580c] hover:bg-[#c2410c] text-white px-8 py-3.5 rounded-lg font-bold transition-all shadow-lg flex items-center gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
              Download Full CV (PDF)
            </a>
          </ScrollReveal>
        </div>
      </section>

      {/* 8. CONTACT SECTION */}
      <section id="contact" className="py-20 md:py-32 bg-[#0a0201] relative z-20">
        <div className="max-w-7xl mx-auto px-6">
          <ScrollReveal className="mb-12 md:mb-16">
            <div className="flex items-center gap-3 mb-4 md:mb-6">
              <span className="text-[#ea580c] text-xs md:text-sm font-bold tracking-[0.25em] uppercase">05 &mdash; Contact</span>
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.1] md:leading-[1.2]">
              Let's build <br className="hidden md:block"/> something <br className="hidden md:block"/>
              <span className="text-[#ea580c] font-serif italic font-medium">great together.</span>
            </h2>
            <p className="text-[#a3a3a3] mt-4 md:mt-6 text-base md:text-lg max-w-2xl">
              Open to employment, new projects, collaborations, freelance and technical partnerships, feel free to reach out.
            </p>
          </ScrollReveal>
          <div className="flex flex-col lg:flex-row gap-12 md:gap-16">
            <ScrollReveal delay={150} className="w-full lg:w-3/5 bg-[#111111] p-6 md:p-10 rounded-2xl border border-white/5 shadow-2xl">
              <h3 className="text-xl md:text-2xl font-bold text-white mb-2">Send a Message</h3>
              <p className="text-[#a3a3a3] text-xs md:text-sm mb-6 md:mb-8">Fill out the form and I'll get back to you as soon as possible.</p>
              <form onSubmit={handleFormSubmit} className="space-y-4 md:space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  <div>
                    <label className="block text-[10px] md:text-xs font-bold text-[#d1d5db] mb-2 uppercase tracking-wide">Name <span className="text-[#ea580c]">*</span></label>
                    <input type="text" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full bg-[#1a1a1a] border border-white/5 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-[#ea580c] transition-colors" />
                  </div>
                  <div>
                    <label className="block text-[10px] md:text-xs font-bold text-[#d1d5db] mb-2 uppercase tracking-wide">Phone / WhatsApp <span className="text-[#ea580c]">*</span></label>
                    <input type="tel" required value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="w-full bg-[#1a1a1a] border border-white/5 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-[#ea580c] transition-colors" />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] md:text-xs font-bold text-[#d1d5db] mb-2 uppercase tracking-wide">Email <span className="text-[#ea580c]">*</span></label>
                  <input type="email" required value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full bg-[#1a1a1a] border border-white/5 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-[#ea580c] transition-colors" />
                </div>
                <div>
                  <label className="block text-[10px] md:text-xs font-bold text-[#d1d5db] mb-2 uppercase tracking-wide">Subject <span className="text-[#ea580c]">*</span></label>
                  <input type="text" required value={formData.subject} onChange={(e) => setFormData({...formData, subject: e.target.value})} className="w-full bg-[#1a1a1a] border border-white/5 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-[#ea580c] transition-colors" />
                </div>
                <div>
                  <label className="block text-[10px] md:text-xs font-bold text-[#d1d5db] mb-2 uppercase tracking-wide">Message <span className="text-[#ea580c]">*</span></label>
                  <textarea rows="5" required value={formData.message} onChange={(e) => setFormData({...formData, message: e.target.value})} className="w-full bg-[#1a1a1a] border border-white/5 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-[#ea580c] transition-colors resize-none"></textarea>
                </div>
                <button type="submit" disabled={formStatus !== 'idle'} className={`w-full font-bold py-3.5 md:py-4 rounded-lg transition-colors text-base md:text-lg mt-2 md:mt-4 shadow-lg flex justify-center items-center gap-2 ${formStatus === 'success' ? 'bg-green-600 text-white' : 'bg-[#ea580c] hover:bg-[#c2410c] text-white'}`}>
                  {formStatus === 'idle' && 'Send Message'}
                  {formStatus === 'submitting' && 'Sending...'}
                  {formStatus === 'success' && 'Message Sent!'}
                </button>
              </form>
            </ScrollReveal>
            <ScrollReveal delay={300} className="w-full lg:w-2/5 flex flex-col gap-10 md:gap-12">
              <div>
                <div className="flex items-center gap-3 mb-4 md:mb-6">
                  <span className="w-2 md:w-2.5 h-2 md:h-2.5 rounded-full bg-[#ea580c]"></span>
                  <h3 className="text-lg md:text-xl font-bold text-white">Direct Contact</h3>
                </div>
                <div className="space-y-3 md:space-y-4 text-[#a3a3a3] bg-[#111111] p-5 md:p-6 rounded-2xl border border-white/5 text-sm md:text-base">
                  <p className="flex items-center gap-3"><span className="font-bold text-white min-w-[70px] md:min-w-[80px]">Phone:</span> +233 (0) 246 317 831</p>
                  <p className="flex items-center gap-3"><span className="font-bold text-white min-w-[70px] md:min-w-[80px]">Email 1:</span> listowel@delofy.com</p>
                  <p className="flex items-center gap-3"><span className="font-bold text-white min-w-[70px] md:min-w-[80px]">Email 2:</span> listowelowusu05@gmail.com</p>
                </div>
              </div>
              <div>
                <div className="flex items-center gap-3 mb-4 md:mb-6">
                  <span className="w-2 md:w-2.5 h-2 md:h-2.5 rounded-full bg-[#ea580c]"></span>
                  <h3 className="text-lg md:text-xl font-bold text-white">Socials</h3>
                </div>
                <div className="flex flex-col gap-3">
                  <a href="https://github.com/listowel05" target="_blank" rel="noreferrer" className="bg-[#111111] border border-white/5 rounded-xl px-5 md:px-6 py-3.5 md:py-4 hover:border-[#ea580c]/50 transition-colors text-[#d1d5db] text-xs md:text-sm font-medium"><span className="text-white font-bold">GitHub</span> : Explore my projects</a>
                  <button onClick={() => setShowEmailModal(true)} className="text-left bg-[#111111] border border-white/5 rounded-xl px-5 md:px-6 py-3.5 md:py-4 hover:border-[#ea580c]/50 transition-colors text-[#d1d5db] text-xs md:text-sm font-medium"><span className="text-white font-bold">Email</span> : Get in touch</button>
                  <a href="https://www.linkedin.com/in/listowel-owusu-47b905249/" target="_blank" rel="noreferrer" className="bg-[#111111] border border-white/5 rounded-xl px-5 md:px-6 py-3.5 md:py-4 hover:border-[#ea580c]/50 transition-colors text-[#d1d5db] text-xs md:text-sm font-medium"><span className="text-white font-bold">LinkedIn</span> : Connect professionally</a>
                  <a href="https://wa.link/bqx6p6" target="_blank" rel="noreferrer" className="bg-[#111111] border border-white/5 rounded-xl px-5 md:px-6 py-3.5 md:py-4 hover:border-[#ea580c]/50 transition-colors text-[#d1d5db] text-xs md:text-sm font-medium"><span className="text-white font-bold">WhatsApp</span> : Chat with me about a project</a>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>

        {/* Email Selection Modal */}
        {showEmailModal && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4" onClick={() => setShowEmailModal(false)}>
            <div className="bg-[#111111] border border-white/10 rounded-2xl p-6 md:p-8 max-w-sm w-full shadow-2xl" onClick={e => e.stopPropagation()}>
              <h3 className="text-xl md:text-2xl font-bold text-white mb-6 text-center">Choose an Email</h3>
              <div className="flex flex-col gap-3 md:gap-4">
                <a href="mailto:listowel@delofy.com" className="bg-[#1a1a1a] hover:bg-[#ea580c] hover:text-white text-[#d1d5db] border border-white/5 px-4 md:px-6 py-3.5 md:py-4 rounded-xl text-center text-sm md:text-base font-bold transition-all">listowel@delofy.com</a>
                <a href="mailto:listowelowusu05@gmail.com" className="bg-[#1a1a1a] hover:bg-[#ea580c] hover:text-white text-[#d1d5db] border border-white/5 px-4 md:px-6 py-3.5 md:py-4 rounded-xl text-center text-sm md:text-base font-bold transition-all">listowelowusu05@gmail.com</a>
              </div>
              <button onClick={() => setShowEmailModal(false)} className="w-full mt-6 text-[#a3a3a3] hover:text-white text-xs md:text-sm font-bold uppercase tracking-widest transition-colors">Cancel</button>
            </div>
          </div>
        )}
      </section>
      
      {/* 9. PURE BLACK FOOTER */}
      <footer className="bg-[#0a0201] py-8 md:py-10 border-t border-white/5 relative z-20">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4 md:gap-6 relative">
          
          <div className="w-full md:w-1/3 flex justify-center md:justify-start text-xl md:text-2xl font-black tracking-tighter cursor-pointer" onClick={() => window.scrollTo(0,0)}>
            <span className="text-white">Listowel Owusu</span><span className="text-[#ea580c]">.</span>
          </div>
          
          <div className="w-full md:w-1/3 flex justify-center">
            <p className="text-xs md:text-sm font-medium text-[#a3a3a3] text-center whitespace-nowrap">
              © {new Date().getFullYear()} • Designed & Coded by Listowel Owusu
            </p>
          </div>
          
          <div className="w-full md:w-1/3 flex justify-center md:justify-end">
            <a href="mailto:listowel@delofy.com" className="text-xs md:text-sm font-bold text-white hover:text-[#ea580c] transition-colors border border-white/20 hover:border-[#ea580c] px-5 md:px-6 py-2 md:py-2.5 rounded-full">
              listowel@delofy.com
            </a>
          </div>
          
        </div>
      </footer>
    </div>
  );
}

// --- PROJECT INQUIRY MULTI-STEP FORM COMPONENT ---
function ProjectInquiry({ setView }) {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [inquiryData, setInquiryData] = useState({
    firstName: '', lastName: '', email: '', phone: '',
    companyName: '', website: '', industry: '',
    projectType: '', description: '', features: '',
    budget: '', timeline: ''
  });

  const handleNext = () => {
    if (step === 1) {
      if (!inquiryData.firstName || !inquiryData.lastName || !inquiryData.email || !inquiryData.phone) {
        alert("Please fill out all required personal details.");
        return;
      }
    }
    if (step === 3) {
      if (!inquiryData.projectType || !inquiryData.description) {
        alert("Please select a project type and provide a brief description.");
        return;
      }
    }
    if (step === 4) {
      if (!inquiryData.budget || !inquiryData.timeline) {
        alert("Please select your estimated budget and timeline.");
        return;
      }
    }
    setStep(prev => Math.min(prev + 1, 5));
  };

  const handleBack = () => setStep(prev => Math.max(prev - 1, 1));

  // --- FIXED WEB3FORMS LOGIC FOR PROJECT INQUIRY ---
  const submitInquiry = async () => {
    setIsSubmitting(true);
    const submitData = new FormData();
    submitData.append("access_key", "1f16ed81-b21b-4e51-acde-8b5ee0bdac85");
    submitData.append("subject", `Project Inquiry from ${inquiryData.firstName} ${inquiryData.lastName}`);
    
    // Explicit name and email for the auto-reply mapping
    submitData.append("name", `${inquiryData.firstName} ${inquiryData.lastName}`);
    submitData.append("email", inquiryData.email);

    const formattedMessage = `
      Name: ${inquiryData.firstName} ${inquiryData.lastName}
      Email: ${inquiryData.email} | Phone: ${inquiryData.phone}
      Company: ${inquiryData.companyName || 'N/A'} | Website: ${inquiryData.website || 'N/A'} | Industry: ${inquiryData.industry || 'N/A'}
      Project Type: ${inquiryData.projectType}
      Budget: ${inquiryData.budget} | Timeline: ${inquiryData.timeline}
      
      Description:
      ${inquiryData.description}
      
      Features:
      ${inquiryData.features}
    `;
    submitData.append("message", formattedMessage);

    try {
      const response = await fetch("https://api.web3forms.com/submit", { 
        method: "POST", 
        body: submitData 
      });
      
      const data = await response.json();
      
      if (data.success) {
        alert("Inquiry Sent Successfully! I will review it and get back to you shortly.");
        setView('portfolio');
      } else {
        console.error("Web3Forms Error:", data);
        alert("Error sending inquiry: " + data.message);
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong. Please try emailing directly.");
    }
    setIsSubmitting(false);
  };

  const OptionPill = ({ selected, onClick, label }) => (
    <button 
      onClick={onClick}
      className={`px-4 md:px-5 py-2.5 md:py-3 rounded-full text-xs md:text-sm font-bold transition-all border ${
        selected ? 'bg-[#ea580c] border-[#ea580c] text-white shadow-lg' : 'bg-transparent border-white/10 text-[#a3a3a3] hover:border-[#ea580c]/50 hover:text-white'
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="min-h-screen font-sans bg-[#0a0201] text-white relative flex flex-col">
      
      <div 
        className="fixed inset-0 w-full h-full -z-10" 
        style={{ 
          background: 'radial-gradient(circle at 40% 10%, #991b1b 0%, #450a0a 35%, #0a0201 80%)',
          backgroundColor: '#0a0201' 
        }}
      ></div>
      
      <nav className="w-full bg-transparent p-4 md:p-6 flex justify-between items-center absolute top-0 z-50">
        <div className="text-xl md:text-2xl font-black tracking-tighter cursor-pointer" onClick={() => setView('portfolio')}>
          <span className="text-white">LO</span><span className="text-[#ea580c]">.</span>
        </div>
        <button onClick={() => setView('portfolio')} className="text-[10px] md:text-sm font-bold text-[#a3a3a3] hover:text-white tracking-widest uppercase flex items-center gap-1 md:gap-2 border border-white/10 px-4 py-2 rounded-full">
          &larr; <span className="hidden sm:inline">Back to Portfolio</span><span className="sm:hidden">Back</span>
        </button>
      </nav>

      <div className="max-w-3xl mx-auto pt-24 md:pt-32 px-4 md:px-6 pb-20 md:pb-24 flex-1 w-full">
        
        <ScrollReveal className="text-center mb-12 md:mb-16 mt-6 md:mt-0">
          <span className="text-[#ea580c] text-[10px] md:text-xs font-bold tracking-[0.25em] uppercase mb-3 md:mb-4 block">Project Inquiry</span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight mb-4 md:mb-6 leading-tight">
            Let's scope out <br className="sm:hidden" /> <span className="text-[#ea580c] font-serif italic">your project.</span>
          </h1>
          <p className="text-[#a3a3a3] text-sm md:text-base max-w-xl mx-auto px-4">Tell me a little about you, your business, and what you're looking to build. The more I understand about your goals, the better I can tailor the right solution for you.</p>
        </ScrollReveal>

        <ScrollReveal delay={150} className="flex justify-between items-center mb-10 md:mb-12 relative max-w-xl mx-auto px-2 md:px-0">
          <div className="absolute left-2 md:left-0 top-4 md:top-1/2 md:-translate-y-1/2 w-[calc(100%-16px)] md:w-full h-0.5 bg-white/10 -z-10"></div>
          <div className="absolute left-2 md:left-0 top-4 md:top-1/2 md:-translate-y-1/2 h-0.5 bg-[#ea580c] transition-all duration-300 -z-10" style={{ width: `calc(${((step - 1) / 4) * 100}% - 16px)` }}></div>
          
          {[
            { num: 1, label: 'PERSONAL' }, { num: 2, label: 'COMPANY' }, 
            { num: 3, label: 'PROJECT' }, { num: 4, label: 'PLANNING' }, { num: 5, label: 'REVIEW' }
          ].map((s) => (
            <div key={s.num} className="flex flex-col items-center bg-transparent px-1 md:px-2">
              <div className={`w-6 h-6 md:w-8 md:h-8 rounded-full flex items-center justify-center text-[10px] md:text-sm font-bold border transition-colors mb-1 md:mb-3 ${step >= s.num ? 'bg-[#ea580c] border-[#ea580c] text-white' : 'bg-[#111111] border-white/20 text-[#a3a3a3]'}`}>
                {s.num}
              </div>
              <span className={`text-[8px] md:text-[10px] tracking-[0.1em] md:tracking-widest font-bold hidden sm:block ${step >= s.num ? 'text-white' : 'text-[#a3a3a3]'}`}>{s.label}</span>
            </div>
          ))}
        </ScrollReveal>

        <ScrollReveal delay={300} className="bg-[#111111] border border-white/5 rounded-2xl p-6 md:p-12 shadow-2xl">
          
          {step === 1 && (
            <div className="animate-fade-in">
              <h2 className="text-2xl md:text-3xl font-bold mb-2">Your Details</h2>
              <p className="text-[#a3a3a3] mb-6 md:mb-8 text-xs md:text-sm">Let's start with the basics how can I reach you?</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <div>
                  <label className="block text-[10px] md:text-xs font-bold text-[#d1d5db] mb-2 uppercase tracking-wide">First Name <span className="text-[#ea580c]">*</span></label>
                  <input type="text" required value={inquiryData.firstName} onChange={e => setInquiryData({...inquiryData, firstName: e.target.value})} className="w-full bg-[#1a1a1a] border border-white/5 rounded-lg px-4 py-3 text-sm md:text-base text-white focus:outline-none focus:border-[#ea580c]" />
                </div>
                <div>
                  <label className="block text-[10px] md:text-xs font-bold text-[#d1d5db] mb-2 uppercase tracking-wide">Last Name <span className="text-[#ea580c]">*</span></label>
                  <input type="text" required value={inquiryData.lastName} onChange={e => setInquiryData({...inquiryData, lastName: e.target.value})} className="w-full bg-[#1a1a1a] border border-white/5 rounded-lg px-4 py-3 text-sm md:text-base text-white focus:outline-none focus:border-[#ea580c]" />
                </div>
                <div>
                  <label className="block text-[10px] md:text-xs font-bold text-[#d1d5db] mb-2 uppercase tracking-wide">Email <span className="text-[#ea580c]">*</span></label>
                  <input type="email" required value={inquiryData.email} onChange={e => setInquiryData({...inquiryData, email: e.target.value})} className="w-full bg-[#1a1a1a] border border-white/5 rounded-lg px-4 py-3 text-sm md:text-base text-white focus:outline-none focus:border-[#ea580c]" />
                </div>
                <div>
                  <label className="block text-[10px] md:text-xs font-bold text-[#d1d5db] mb-2 uppercase tracking-wide">Phone / WhatsApp <span className="text-[#ea580c]">*</span></label>
                  <input type="tel" required value={inquiryData.phone} onChange={e => setInquiryData({...inquiryData, phone: e.target.value})} className="w-full bg-[#1a1a1a] border border-white/5 rounded-lg px-4 py-3 text-sm md:text-base text-white focus:outline-none focus:border-[#ea580c]" />
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="animate-fade-in">
              <h2 className="text-2xl md:text-3xl font-bold mb-2">Company Details</h2>
              <p className="text-[#a3a3a3] mb-6 md:mb-8 text-xs md:text-sm">Tell me a bit about the business behind the project. (Optional if you're an individual)</p>
              <div className="space-y-4 md:space-y-6">
                <div>
                  <label className="block text-[10px] md:text-xs font-bold text-[#d1d5db] mb-2 uppercase tracking-wide">Company Name <span className="text-[#6b7280] font-normal lowercase">(optional)</span></label>
                  <input type="text" value={inquiryData.companyName} onChange={e => setInquiryData({...inquiryData, companyName: e.target.value})} className="w-full bg-[#1a1a1a] border border-white/5 rounded-lg px-4 py-3 text-sm md:text-base text-white focus:outline-none focus:border-[#ea580c]" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  <div>
                    <label className="block text-[10px] md:text-xs font-bold text-[#d1d5db] mb-2 uppercase tracking-wide">Website <span className="text-[#6b7280] font-normal lowercase">(optional)</span></label>
                    <input type="url" placeholder="https://" value={inquiryData.website} onChange={e => setInquiryData({...inquiryData, website: e.target.value})} className="w-full bg-[#1a1a1a] border border-white/5 rounded-lg px-4 py-3 text-sm md:text-base text-white focus:outline-none focus:border-[#ea580c]" />
                  </div>
                  <div>
                    <label className="block text-[10px] md:text-xs font-bold text-[#d1d5db] mb-2 uppercase tracking-wide">Industry <span className="text-[#6b7280] font-normal lowercase">(optional)</span></label>
                    <select value={inquiryData.industry} onChange={e => setInquiryData({...inquiryData, industry: e.target.value})} className="w-full bg-[#1a1a1a] border border-white/5 rounded-lg px-4 py-3 text-sm md:text-base text-white focus:outline-none focus:border-[#ea580c] appearance-none">
                      <option value="">Select an industry...</option>
                      <option value="Technology / Software">Technology / Software</option>
                      <option value="Finance / Fintech">Finance / Fintech</option>
                      <option value="Healthcare / Medical">Healthcare / Medical</option>
                      <option value="Real Estate">Real Estate</option>
                      <option value="Agriculture / Agribusiness">Agriculture / Agribusiness</option>
                      <option value="Retail / E-commerce">Retail / E-commerce</option>
                      <option value="Public Sector">Public Sector</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="animate-fade-in">
              <h2 className="text-2xl md:text-3xl font-bold mb-2">Project Details</h2>
              <p className="text-[#a3a3a3] mb-6 md:mb-8 text-xs md:text-sm">Tell me what you're looking to build and the problem you want it to solve.</p>
              
              <label className="block text-[10px] md:text-xs font-bold text-[#d1d5db] mb-3 md:mb-4 uppercase tracking-wide">Project Type <span className="text-[#ea580c]">*</span></label>
              <div className="flex flex-wrap gap-2 md:gap-3 mb-6 md:mb-8">
                {[
                  "Data/BI Dashboard", "ETL Data Pipeline", "Full-Stack Web App", 
                  "Custom Corporate Software", "API / Backend Integration", "AI / Predictive Model", "Other"
                ].map(type => (
                  <OptionPill key={type} label={type} selected={inquiryData.projectType === type} onClick={() => setInquiryData({...inquiryData, projectType: type})} />
                ))}
              </div>

              <div className="space-y-4 md:space-y-6">
                <div>
                  <label className="block text-[10px] md:text-xs font-bold text-[#d1d5db] mb-2 uppercase tracking-wide">Project Description <span className="text-[#ea580c]">*</span></label>
                  <textarea rows="4" required placeholder="What problem are you trying to solve? Who is it for?" value={inquiryData.description} onChange={e => setInquiryData({...inquiryData, description: e.target.value})} className="w-full bg-[#1a1a1a] border border-white/5 rounded-lg px-4 py-3 text-sm md:text-base text-white focus:outline-none focus:border-[#ea580c] resize-none"></textarea>
                </div>
                <div>
                  <label className="block text-[10px] md:text-xs font-bold text-[#d1d5db] mb-2 uppercase tracking-wide">Features / Requirements <span className="text-[#6b7280] font-normal lowercase">(optional)</span></label>
                  <textarea rows="3" placeholder="Any specific features, integrations (e.g. Meta API, Power BI), or must-haves?" value={inquiryData.features} onChange={e => setInquiryData({...inquiryData, features: e.target.value})} className="w-full bg-[#1a1a1a] border border-white/5 rounded-lg px-4 py-3 text-sm md:text-base text-white focus:outline-none focus:border-[#ea580c] resize-none"></textarea>
                </div>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="animate-fade-in">
              <h2 className="text-2xl md:text-3xl font-bold mb-2">Let's Talk About Your Project</h2>
              <p className="text-[#a3a3a3] mb-6 md:mb-8 text-xs md:text-sm">If you're not sure about the budget or timeline yet, that's completely fine.</p>
              
              <label className="block text-[10px] md:text-xs font-bold text-[#d1d5db] mb-3 md:mb-4 uppercase tracking-wide">Estimated Budget <span className="text-[#ea580c]">*</span></label>
              <div className="flex flex-wrap gap-2 md:gap-3 mb-8 md:mb-10">
                {["GH₵5,000 - GH₵10,000", "GH₵10,000 - GH₵25,000", "GH₵25,000 - GH₵50,000", "GH₵50,000+", "I'm not sure yet"].map(b => (
                  <OptionPill key={b} label={b} selected={inquiryData.budget === b} onClick={() => setInquiryData({...inquiryData, budget: b})} />
                ))}
              </div>

              <label className="block text-[10px] md:text-xs font-bold text-[#d1d5db] mb-3 md:mb-4 uppercase tracking-wide">When would you like to get started? <span className="text-[#ea580c]">*</span></label>
              <div className="flex flex-wrap gap-2 md:gap-3">
                {["As soon as possible", "Within 2-4 weeks", "1-3 months", "3+ months", "Flexible"].map(t => (
                  <OptionPill key={t} label={t} selected={inquiryData.timeline === t} onClick={() => setInquiryData({...inquiryData, timeline: t})} />
                ))}
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="animate-fade-in">
              <h2 className="text-2xl md:text-3xl font-bold mb-2">Review Your Inquiry</h2>
              <p className="text-[#a3a3a3] mb-6 md:mb-8 text-xs md:text-sm">Double-check everything below before submitting.</p>
              
              <div className="space-y-6 md:space-y-8 text-xs md:text-sm">
                
                <div className="border-b border-white/10 pb-4 md:pb-6">
                  <div className="flex justify-between items-center mb-2 md:mb-4">
                    <h3 className="text-[#ea580c] font-bold uppercase tracking-widest text-[9px] md:text-[10px]">Your Details</h3>
                    <button onClick={() => setStep(1)} className="text-[#6b7280] hover:text-white text-[10px] md:text-xs border border-white/10 px-2 md:px-3 py-1 rounded">Edit</button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                    <div><span className="block text-[10px] md:text-xs font-bold text-[#6b7280] uppercase mb-1">Name</span>{inquiryData.firstName || '-'} {inquiryData.lastName}</div>
                    <div><span className="block text-[10px] md:text-xs font-bold text-[#6b7280] uppercase mb-1">Contact</span><span className="truncate block">{inquiryData.email || '-'}</span>{inquiryData.phone}</div>
                  </div>
                </div>

                <div className="border-b border-white/10 pb-4 md:pb-6">
                  <div className="flex justify-between items-center mb-2 md:mb-4">
                    <h3 className="text-[#ea580c] font-bold uppercase tracking-widest text-[9px] md:text-[10px]">Project Details</h3>
                    <button onClick={() => setStep(3)} className="text-[#6b7280] hover:text-white text-[10px] md:text-xs border border-white/10 px-2 md:px-3 py-1 rounded">Edit</button>
                  </div>
                  <div><span className="block text-[10px] md:text-xs font-bold text-[#6b7280] uppercase mb-1">Type</span>{inquiryData.projectType || '-'}</div>
                  <div className="mt-2 md:mt-4"><span className="block text-[10px] md:text-xs font-bold text-[#6b7280] uppercase mb-1">Description</span>{inquiryData.description || '-'}</div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2 md:mb-4">
                    <h3 className="text-[#ea580c] font-bold uppercase tracking-widest text-[9px] md:text-[10px]">Planning</h3>
                    <button onClick={() => setStep(4)} className="text-[#6b7280] hover:text-white text-[10px] md:text-xs border border-white/10 px-2 md:px-3 py-1 rounded">Edit</button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                    <div><span className="block text-[10px] md:text-xs font-bold text-[#6b7280] uppercase mb-1">Budget</span>{inquiryData.budget || '-'}</div>
                    <div><span className="block text-[10px] md:text-xs font-bold text-[#6b7280] uppercase mb-1">Timeline</span>{inquiryData.timeline || '-'}</div>
                  </div>
                </div>

              </div>
            </div>
          )}

          <div className="flex flex-col-reverse sm:flex-row justify-between mt-10 md:mt-12 pt-6 border-t border-white/5 gap-3">
            <button 
              onClick={handleBack} 
              className={`w-full sm:w-auto px-6 md:px-8 py-3.5 md:py-3 text-[11px] md:text-base font-bold transition-opacity border sm:border-none border-white/10 rounded-lg sm:rounded-none ${step === 1 ? 'hidden sm:block sm:opacity-0 sm:pointer-events-none' : 'text-[#a3a3a3] hover:text-white hover:bg-white/5 sm:hover:bg-transparent'}`}
            >
              Back
            </button>
            
            {step < 5 ? (
              <button onClick={handleNext} className="w-full sm:w-auto bg-[#ea580c] hover:bg-[#c2410c] text-white px-8 md:px-10 py-3.5 md:py-3 rounded-lg text-sm md:text-base font-bold shadow-lg transition-colors">
                Next
              </button>
            ) : (
              <button 
                onClick={submitInquiry} 
                disabled={isSubmitting}
                className="w-full sm:w-auto bg-[#ea580c] hover:bg-[#c2410c] text-white px-8 md:px-10 py-3.5 md:py-3 rounded-lg text-sm md:text-base font-bold shadow-lg transition-colors flex items-center justify-center gap-2"
              >
                {isSubmitting ? 'Sending...' : 'Submit Inquiry'}
              </button>
            )}
          </div>

        </ScrollReveal>
      </div>
      
      {/* 9. PURE BLACK FOOTER FOR INQUIRY PAGE */}
      <footer className="bg-[#0a0201] py-6 md:py-8 border-t border-white/10 mt-auto z-20">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-3 md:gap-6 relative">
          
          <div className="w-full md:w-1/3 flex justify-center md:justify-start text-xl md:text-2xl font-black tracking-tighter cursor-pointer" onClick={() => setView('portfolio')}>
            <span className="text-white">Listowel Owusu</span><span className="text-[#ea580c]">.</span>
          </div>
          
          <div className="w-full md:w-1/3 flex justify-center">
            <p className="text-xs md:text-sm font-medium text-[#a3a3a3] text-center whitespace-nowrap">
              © {new Date().getFullYear()} • Designed & Coded by Listowel Owusu
            </p>
          </div>
          
          <div className="w-full md:w-1/3 flex justify-center md:justify-end">
            <a href="mailto:listowel@delofy.com" className="text-xs md:text-sm font-bold text-white hover:text-[#ea580c] transition-colors border border-white/20 hover:border-[#ea580c] px-5 md:px-6 py-2 md:py-2.5 rounded-full">
              listowel@delofy.com
            </a>
          </div>
          
        </div>
      </footer>
    </div>
  );
}

// --- ROOT APP COMPONENT ---
function App() {
  const [view, setView] = useState('portfolio'); 

  return (
    <>
      {view === 'portfolio' ? <Portfolio setView={setView} /> : <ProjectInquiry setView={setView} />}
    </>
  );
}

export default App;