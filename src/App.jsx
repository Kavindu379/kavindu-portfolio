import { useState, useEffect, useRef } from 'react'
import AOS from 'aos'
import 'aos/dist/aos.css'
import Tilt from 'react-parallax-tilt'
import Typewriter from 'typewriter-effect'
import ParticlesBackground from './ParticlesBackground'
import GitHubHeatmap from './GitHubHeatmap'

// --- CUSTOM HOOK FOR NUMBER ANIMATION ---
const useCounter = (end, duration = 2000) => {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    let start = 0;
    const increment = end / (duration / 16); 
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [end, duration]);
  return count;
};

// --- STAT CARD COMPONENT ---
const StatCard = ({ icon, label, value, colorClass }) => {
  const count = useCounter(value);
  
  return (
    <Tilt tiltMaxAngleX={5} tiltMaxAngleY={5} scale={1.02} transitionSpeed={2500} className="tilt-card">
      <div className={`stat-card ${colorClass}`}>
          <div className="stat-content">
              <div className="stat-icon-wrapper">
                  <i className={`bi ${icon}`}></i>
              </div>
              <div className="stat-info">
                  <h3>{count}</h3>
                  <p>{label}</p>
              </div>
          </div>
      </div>
    </Tilt>
  );
};

// --- MAGNETIC BUTTON COMPONENT ---
const MagneticButton = ({ children, className, onClick, href, target, ...props }) => {
  const buttonRef = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    const { clientX, clientY } = e;
    const { left, top, width, height } = buttonRef.current.getBoundingClientRect();
    const x = (clientX - (left + width / 2)) * 0.3; 
    const y = (clientY - (top + height / 2)) * 0.3;
    setPosition({ x, y });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  const style = { transform: `translate(${position.x}px, ${position.y}px)`, transition: 'transform 0.1s ease-out', display: 'inline-block' };

  if (href) {
    return (
      <a href={href} target={target} className={className} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave} ref={buttonRef} style={style} {...props}>
        {children}
      </a>
    );
  }
  return (
    <button onClick={onClick} className={className} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave} ref={buttonRef} style={style} {...props}>
      {children}
    </button>
  );
};

function App() {
  const [theme, setTheme] = useState('dark');
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [navVisible, setNavVisible] = useState(true);
  const lastScrollY = useRef(0);

  const [isLoading, setIsLoading] = useState(true);
  
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState('All');
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(prev => prev ? { ...prev, hiding: true } : null);
      setTimeout(() => setToast(null), 400);
    }, 3500);
  };

  // --- GITHUB STATS STATE ---
  const [githubStats, setGithubStats] = useState({ repos: 0, stars: 0, forks: 0 });

  useEffect(() => {
    const fetchGithubData = async () => {
      try {
        const userRes = await fetch('https://api.github.com/users/Kavindu379');
        const userData = await userRes.json();

        const reposRes = await fetch('https://api.github.com/users/Kavindu379/repos?per_page=100');
        const reposData = await reposRes.json();

        let totalStars = 0;
        let totalForks = 0;

        if (Array.isArray(reposData)) {
          reposData.forEach(repo => {
            totalStars += repo.stargazers_count;
            totalForks += repo.forks_count;
          });
        }

        setGithubStats({
          repos: userData.public_repos || 0,
          stars: totalStars,
          forks: totalForks
        });
      } catch (error) {
        console.error("Error fetching GitHub data:", error);
      }
    };

    fetchGithubData();
  }, []);

  useEffect(() => {
    const originalTitle = document.title;
    const handleVisibilityChange = () => {
      if (document.hidden) {
        document.title = "⚠️ Connection Lost...";
      } else {
        document.title = "🟢 Signal Restored | Kavindu";
        setTimeout(() => { document.title = originalTitle; }, 2000);
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  const projects = [
    {
      id: 1,
      title: 'Mango AI Quality System',
      category: 'Artificial Intelligence & Computer Vision',
      desc: 'An AI-powered mango quality detection system using computer vision to classify mangoes by ripeness, defects, and grade. The system processes real-time camera feeds using a trained ML model to automate quality control in agricultural supply chains, improving accuracy and reducing manual inspection time.',
      tech: ['Python', 'Computer Vision', 'Machine Learning', 'OpenCV', 'TensorFlow'],
      icon: 'bi-cpu-fill',
      image: 'https://images.unsplash.com/photo-1519996529931-28324d5a630e?auto=format&fit=crop&q=80&w=1000',
      github: 'https://github.com/Kavindu379/Mango-AI-Quality-System'
    },
    {
      id: 2,
      title: 'Fix My City',
      category: 'Mobile App Development',
      desc: 'A community-driven Android application that enables citizens to report and track local infrastructure issues such as potholes, broken streetlights, and drainage problems. Features GPS-tagged reports, photo uploads, status tracking, and admin dashboards for municipal authorities.',
      tech: ['Kotlin', 'Android', 'Firebase', 'Google Maps API', 'REST API'],
      icon: 'bi-phone',
      image: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&q=80&w=1000',
      github: 'https://github.com/Kavindu379/fix_my_city'
    },
    {
      id: 3,
      title: 'CineSearch Movie App',
      category: 'Frontend Web Development',
      desc: 'A sleek movie discovery web application that fetches live data from a movie database API. Users can search for movies, view ratings, read plot summaries, and browse by genre. Features a fully responsive design with dark mode support and smooth UI transitions.',
      tech: ['HTML', 'CSS', 'JavaScript', 'TMDB API', 'REST API'],
      icon: 'bi-camera-reels',
      image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&q=80&w=1000',
      github: 'https://github.com/Kavindu379/CineSearch-Movie-App'
    },
    {
      id: 4,
      title: 'Uni Attendance Tracker',
      category: 'Mobile App Development',
      desc: 'An Android attendance management system for university students to track their lecture attendance, calculate attendance percentages per module, and receive alerts when attendance drops below the required threshold. Helps students manage their academic standing proactively.',
      tech: ['Kotlin', 'Android', 'SQLite', 'Material Design', 'Room DB'],
      icon: 'bi-calendar-check',
      image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&q=80&w=1000',
      github: 'https://github.com/Kavindu379/Uni_Attendance_Tracker'
    },
    {
      id: 5,
      title: 'Automated Parking System',
      category: 'IoT & Embedded Systems',
      desc: 'A smart parking solution designed to optimize space usage and reduce traffic congestion. The system uses IR sensors to detect vehicle presence and automatically controls entry/exit gates. It features a real-time display showing available slots and prevents unauthorized entry.',
      tech: ['C++', 'Arduino', 'IR Sensors', 'Servo Motors', 'LCD Display'],
      icon: 'bi-p-square',
      image: 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&q=80&w=1000',
      github: 'https://github.com/Kavindu379'
    },
    {
      id: 6,
      title: 'Real Estate Platform',
      category: 'Full Stack Web Dev',
      desc: 'A modern, responsive web application for buying, selling, and renting properties. It features advanced search filters, an interactive map integration, and a user-friendly admin dashboard for managing listings. Built with a focus on high performance and SEO.',
      tech: ['PHP', 'MySQL', 'HTML', 'CSS', 'JavaScript'],
      icon: 'bi-building',
      image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=1000',
      github: 'https://github.com/Kavindu379/Real_Estate_Website'
    },
    {
      id: 7,
      title: 'AI Personal Assistant',
      category: 'Artificial Intelligence',
      desc: 'A voice-activated desktop assistant capable of performing system tasks, searching the web, and answering queries. It utilizes Natural Language Processing (NLP) to understand context and can automate daily workflows like sending emails or playing music.',
      tech: ['Java', 'NLP', 'Speech Recognition', 'API Integration'],
      icon: 'bi-mic',
      image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=1000',
      github: 'https://github.com/Kavindu379/Personal-Assistant-Project'
    }
  ];

  const services = [
    { icon: 'palette', title: 'UI/UX Design', desc: 'Designing intuitive interfaces.', fullDesc: 'I create user-centric designs that are both visually appealing and easy to use. My process involves user research, wireframing, prototyping, and usability testing to ensure the final product meets the needs of the target audience.' },
    { icon: 'cpu', title: 'Embedded Systems', desc: 'IoT solutions & C++ programming.', fullDesc: 'I specialize in developing embedded systems for IoT applications. This includes programming microcontrollers like Arduino and ESP32 using C++, designing custom PCBs, and integrating various sensors and actuators.' },
    { icon: 'code-slash', title: 'Web Development', desc: 'Modern sites with React & Node.', fullDesc: 'I build modern, responsive websites and web applications using the MERN stack (MongoDB, Express.js, React, Node.js). I focus on creating performant, scalable, and SEO-friendly solutions.' },
    { icon: 'phone', title: 'Mobile Apps', desc: 'Android apps using Java.', fullDesc: 'I develop native Android applications using Java and Kotlin. From concept to deployment on the Google Play Store, I handle the entire mobile app development lifecycle, ensuring a high-quality user experience.' },
    { icon: 'diagram-2', title: 'Circuit Design', desc: 'PCB design with Proteus/Altium.', fullDesc: 'I design professional-grade Printed Circuit Boards (PCBs) using industry-standard software like Altium Designer and Proteus. My expertise ranges from simple single-layer boards to complex multi-layer designs.' },
    { icon: 'laptop', title: 'Software Dev', desc: 'Python & Java Applications.', fullDesc: 'I develop robust and scalable desktop applications using Python and Java. Whether it\'s a simple utility script or a complex enterprise application, I write clean, maintainable code.' }
  ];

  const techStack = [
    { icon: 'bi-filetype-java', name: 'Java' },
    { icon: 'bi-filetype-py', name: 'Python' },
    { icon: 'bi-filetype-js', name: 'JavaScript' },
    { icon: 'bi-motherboard', name: 'Embedded C' },
    { icon: 'bi-cpu', name: 'Arduino' },
    { icon: 'bi-filetype-jsx', name: 'React' },
    { icon: 'bi-database', name: 'SQL' },
    { icon: 'bi-git', name: 'Git' },
    { icon: 'bi-palette', name: 'Figma' },
    { icon: 'bi-android', name: 'Android' },
    { icon: 'bi-terminal', name: 'Bash' },
    { icon: 'bi-code-slash', name: 'VS Code' }
  ];

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false); 
    }, 2200);

    AOS.init({ 
      duration: 800,        
      easing: 'ease-out-cubic', 
      once: true,            
      offset: 50,           
      anchorPlacement: 'top-bottom', 
      delay: 0,
    });

    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);

    const savedTheme = localStorage.getItem('theme') || 'dark';
    setTheme(savedTheme);
    document.body.className = savedTheme + '-mode';

    const handleScroll = () => {
      const totalScroll = window.scrollY;
      const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scroll = `${totalScroll / windowHeight}`;
      setScrollProgress(Number(scroll));
      setShowScrollTop(totalScroll > 300);

      // Nav hide/show logic
      if (totalScroll > lastScrollY.current && totalScroll > 100) {
        setNavVisible(false); // scrolling down & past 100px -> hide
      } else {
        setNavVisible(true); // scrolling up -> show
      }
      lastScrollY.current = totalScroll;
    }



    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    if (!isLoading) {
      setTimeout(() => {
        AOS.refreshHard(); 
        AOS.refresh();
      }, 100);
    }
  }, [isLoading]);

  const toggleMobileMenu = () => {
    setMenuOpen(!menuOpen);
    if (!menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  };

  const closeMobileMenu = () => {
    setMenuOpen(false);
    document.body.style.overflow = 'auto';
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.body.className = newTheme + '-mode';
    localStorage.setItem('theme', newTheme);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReset = (e) => {
    e.preventDefault(); 
    window.scrollTo(0, 0);
    window.history.replaceState(null, '', window.location.pathname);
    window.location.reload();
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    formData.append("access_key", "36782a8c-a13f-436b-ba82-06973d308895");
    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData
      });
      const data = await response.json();
      if (data.success) {
        showToast('✅ Message sent successfully! I will get back to you soon.', 'success');
        event.target.reset();
      } else {
        showToast('❌ Failed to send. Please try again.', 'error');
      }
    } catch {
      showToast('❌ Network error. Please check your connection.', 'error');
    }
  };

  if (isLoading) {
    return (
      <div className="preloader">
        <h2 className="loader-text">
          <Typewriter
            options={{
              strings: ['System Initializing...', 'Loading Assets...', 'Welcome, User.'],
              autoStart: true,
              loop: false,
              delay: 40,
              deleteSpeed: 20,
            }}
          />
        </h2>
        <div className="loader-bar"></div>
      </div>
    );
  }

  return (
    <div className="app">
      <ParticlesBackground theme={theme} />
      <div style={{ transform: `scaleX(${scrollProgress})`, transformOrigin: 'left', position: 'fixed', top: 0, left: 0, width: '100%', height: '4px', background: 'var(--accent)', zIndex: 9999 }} />
      
      <nav className={navVisible ? '' : 'nav-hidden'} style={{ zIndex: 10000 }}>
        <div className="logo" onClick={handleReset} style={{cursor: 'pointer', zIndex: 10001}} title="Reset Site">RHKKS</div>
        
        <ul className="nav-links">
          <li><a href="#home">01. Home</a></li>
          <li><a href="#about">02. About</a></li>
          <li><a href="#stats">03. Stats</a></li>
          <li><a href="#resume">04. Resume</a></li>
          <li><a href="#portfolio">05. Projects</a></li>
          <li><a href="#contact">06. Contact</a></li>
        </ul>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          
          <button 
            className="creative-theme-toggle" 
            onClick={toggleTheme} 
            aria-label="Toggle Theme"
          >
            <div className="sun-moon-icon"></div>
          </button>

          <div className="desktop-btn">
             <MagneticButton href="cv.pdf" download className="creative-btn" style={{marginTop: 0, padding: '10px 24px', fontSize: '0.85rem'}}>
               <i className="bi bi-download"></i> Resume
             </MagneticButton>
          </div>

          <div className={`hamburger ${menuOpen ? 'active' : ''}`} onClick={toggleMobileMenu}>
            <span className="bar"></span>
            <span className="bar"></span>
            <span className="bar"></span>
          </div>

        </div>
      </nav>

      <div className={`mobile-menu-overlay ${menuOpen ? 'active' : ''}`}>
        <ul className="mobile-nav-links">
          <li><a href="#home" onClick={closeMobileMenu}><span>01.</span> Home</a></li>
          <li><a href="#about" onClick={closeMobileMenu}><span>02.</span> About</a></li>
          <li><a href="#stats" onClick={closeMobileMenu}><span>03.</span> Stats</a></li>
          <li><a href="#resume" onClick={closeMobileMenu}><span>04.</span> Resume</a></li>
          <li><a href="#portfolio" onClick={closeMobileMenu}><span>05.</span> Projects</a></li>
          <li><a href="#contact" onClick={closeMobileMenu}><span>06.</span> Contact</a></li>
          <li style={{marginTop: '2rem'}}>
             <MagneticButton href="cv.pdf" download className="creative-btn" onClick={closeMobileMenu}>
                <i className="bi bi-download"></i> Download Resume
             </MagneticButton>
          </li>
        </ul>
      </div>

      <section id="home" className="hero">
        <div className="hero-text" data-aos="fade-up" data-aos-delay="300">
          <div className="status-badge">
            <div className="status-dot"></div>
            <span>Open to work: <strong>Internships &amp; Freelance</strong></span>
          </div>
          <h3>Hi, my name is</h3>
          <h1 className="glitch" data-text="Kavindu Kavishka.">Kavindu Kavishka.</h1>
          <h2 style={{color:'var(--text-color)', fontSize:'3rem', marginTop:'0', border:'none'}}>I build things for the web &amp; IoT.</h2>
          <div style={{ fontSize: '1.2rem', color: 'var(--accent)', fontFamily: 'monospace', marginBottom: '2rem', height: '30px' }}>
            <Typewriter options={{ strings: ['> Computer Engineer', '> Full Stack Developer', '> Embedded Systems', '> AI Engineer', '> Android Developer'], autoStart: true, loop: true, delay: 40 }} />
          </div>
          <p style={{maxWidth:'500px', lineHeight:'1.8'}}>I am a Computer Engineering undergraduate at <strong>KDU</strong> bridging the gap between hardware and software.</p>
          <div className="social-icons" style={{marginTop:'2rem', marginBottom:'2rem'}}>
            <a href="https://github.com/Kavindu379" target="_blank"><i className="bi bi-github"></i></a>
            <a href="https://www.linkedin.com/in/kavindu-kavishka-6a2016362/" target="_blank"><i className="bi bi-linkedin"></i></a>
            <a href="https://wa.me/94740588722" target="_blank"><i className="bi bi-whatsapp"></i></a>
            <a href="mailto:kkavindu379@gmail.com"><i className="bi bi-envelope"></i></a>
          </div>
          <MagneticButton href="#contact" className="btn btn-primary">Check out my work!</MagneticButton>
        </div>
        <div className="hero-img" data-aos="fade-left" data-aos-delay="600">
          <img src="kavindu.jpeg" alt="Kavindu" className="profile-pic" />
        </div>
        <a href="#about" className="scroll-down"><i className="bi bi-arrow-down-circle"></i></a>
      </section>

      <section id="about">
        <h2 data-aos="fade-up"><span style={{color:'var(--accent)', marginRight:'10px'}}>01.</span> About Me</h2>
        <div className="grid" style={{ gridTemplateColumns: "3fr 2fr" }}>
          <div className="about-text" data-aos="fade-right">
            <p style={{marginBottom:'1rem', lineHeight:'1.6'}}>Hello! My name is Kavindu and I enjoy creating things that live on the internet and in the physical world. My interest in engineering started back in 2023 when I decided to try editing custom PCB designs — turns out hacking together hardware models taught me a lot about HTML & CSS too!</p>
            <div className="stats-row" style={{display:'flex', gap:'2rem', marginTop:'2rem'}}>
              <div className="stat"><strong>1+</strong> Years Exp</div>
              <div className="stat"><strong>7+</strong> Projects</div>
              <div className="stat"><strong>3.4</strong> GPA</div>
            </div>
          </div>
          <div data-aos="fade-left">
              <div className="skills-container">
              <h3>Technical Proficiency</h3>
              {['Java', 'Python', 'Figma', 'Embedded C'].map((skill, index) => (
                <div className="skill-bar" key={index} style={{marginBottom:'1.5rem'}}>
                  <div className="skill-info"><span>{skill}</span><span>{95 - index * 5}%</span></div>
                  <div className="progress">
                    <div className="progress-bar" style={{width: `${95 - index * 5}%`}} data-aos="slide-right" data-aos-duration="1000" data-aos-delay={index * 100}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="tech-scroller" data-aos="fade-up">
          <div className="tech-track">
            {[...techStack, ...techStack].map((tech, index) => (
              <div className="tech-item" key={index}><i className={`bi ${tech.icon}`}></i><span>{tech.name}</span></div>
            ))}
          </div>
        </div>
      </section>

      {/* --- STATS SECTION --- */}
      <section id="stats">
        <h2 data-aos="fade-up"><span style={{color:'var(--accent)', marginRight:'10px'}}>02.</span> Live Stats</h2>

        {/* CSS Grid 1-column — guarantees identical width for both rows */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem', width: '100%' }}>

          {/* 4 Stat Cards */}
          <div className="stats-grid" data-aos="fade-up" style={{gridTemplateColumns: 'repeat(4, 1fr)'}}>
            <StatCard icon="bi-code-slash" label="Public Repos" value={githubStats.repos} colorClass="cyan" />
            <StatCard icon="bi-star" label="Total Stars" value={githubStats.stars} colorClass="orange" />
            <StatCard icon="bi-git" label="Total Forks" value={githubStats.forks} colorClass="blue" />
            <StatCard icon="bi-folder-check" label="Projects Built" value={7} colorClass="green" />
          </div>

          {/* Heatmap — forced to same 1fr column width */}
          <div data-aos="fade-up" data-aos-delay="150" style={{ width: '100%', minWidth: 0 }}>
            <GitHubHeatmap username="Kavindu379" theme={theme} />
          </div>

        </div>
      </section>

      <section id="resume">
        <h2 data-aos="fade-up"><span style={{color:'var(--accent)', marginRight:'10px'}}>03.</span> Experience & Education</h2>
        <div className="timeline">
          <div className="timeline-item left" data-aos="fade-right">
            <div className="timeline-dot"></div>
            <div className="timeline-content">
              <span className="timeline-date">Jan 2023 </span>
              <h3>Software Engineering Intern</h3>
              <h4 style={{color:'var(--accent)', marginBottom:'10px'}}>IXDLAB</h4>
              <p>Specialized in UI/UX design, creating intuitive user interfaces and enhancing user experience for digital products. Worked on real-world client projects using Figma and React.</p>
            </div>
          </div>
          <div className="timeline-item right" data-aos="fade-left">
            <div className="timeline-dot"></div>
            <div className="timeline-content">
              <span className="timeline-date">2024 </span>
              <h3>BSc (Hons) Computer Engineering</h3>
              <h4 style={{color:'var(--accent)', marginBottom:'10px'}}>KDU (General Sir John Kotelawala Defence University)</h4>
              <p>Undergraduate degree focusing on hardware, software, and networking. Currently maintaining a <strong>GPA of 3.4</strong>.</p>
            </div>
          </div>
          <div className="timeline-item left" data-aos="fade-right">
            <div className="timeline-dot"></div>
            <div className="timeline-content">
              <span className="timeline-date">2025</span>
              <h3>Embedded Systems Project</h3>
              <h4 style={{color:'var(--accent)', marginBottom:'10px'}}>Self-Initiated</h4>
              <p>Designed and built a custom PCB for a home automation system using Altium Designer and programmed the logic in Embedded C.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="services">
        <h2 data-aos="fade-up"><span style={{color:'var(--accent)', marginRight:'10px'}}>04.</span> What I Do</h2>
        <div className="grid">
          {services.map((service, index) => (
            <Tilt key={index} tiltMaxAngleX={5} tiltMaxAngleY={5} scale={1.02} transitionSpeed={2500}>
              <div className="card" data-aos="fade-up" data-aos-delay={index * 50} onClick={() => setSelectedService(service)} style={{cursor: 'pointer'}}>
                <div className="icon"><i className={`bi bi-${service.icon}`}></i></div>
                <h3>{service.title}</h3>
                <p>{service.desc}</p>
                <small style={{color:'var(--accent)', marginTop:'1rem', display:'block'}}>Read More &rarr;</small>
              </div>
            </Tilt>
          ))}
        </div>
      </section>

      <section id="portfolio">
        <h2 data-aos="fade-up"><span style={{color:'var(--accent)', marginRight:'10px'}}>05.</span> Featured Projects</h2>

        {/* Filter Tabs */}
        <div className="filter-tabs" data-aos="fade-up">
          {['All', 'Web', 'Mobile', 'AI', 'IoT'].map(tab => (
            <button
              key={tab}
              className={`filter-tab ${activeFilter === tab ? 'active' : ''}`}
              onClick={() => setActiveFilter(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="grid">
          {projects
            .filter(p => {
              if (activeFilter === 'All') return true;
              if (activeFilter === 'Web') return p.category.toLowerCase().includes('web');
              if (activeFilter === 'Mobile') return p.category.toLowerCase().includes('mobile');
              if (activeFilter === 'AI') return p.category.toLowerCase().includes('ai') || p.category.toLowerCase().includes('artificial');
              if (activeFilter === 'IoT') return p.category.toLowerCase().includes('iot') || p.category.toLowerCase().includes('embedded');
              return true;
            })
            .map((project, index) => (
            <Tilt key={project.id} tiltMaxAngleX={5} tiltMaxAngleY={5} scale={1.02} transitionSpeed={2500}>
              <div className="card" data-aos="fade-up" data-aos-delay={index * 50} onClick={() => setSelectedProject(project)} style={{cursor: 'pointer'}}>
                <div className="card-category-badge">{project.category}</div>
                <div className="icon"><i className={`bi ${project.icon}`}></i></div>
                <h3>{project.title}</h3>
                <p style={{marginBottom:'0.5rem'}}>{project.desc.substring(0, 80)}...</p>
                <div className="card-tech-pills">
                  {project.tech.slice(0, 3).map((t, i) => <span key={i} className="card-tech-pill">{t}</span>)}
                </div>
                <small style={{color:'var(--accent)', marginTop:'1rem', display:'block'}}>Click for details &rarr;</small>
              </div>
            </Tilt>
          ))}
        </div>
      </section>

      {selectedProject && (
        <div className="modal-overlay" onClick={() => setSelectedProject(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setSelectedProject(null)}>&times;</button>
            <div className="modal-header">
              <img src={selectedProject.image} alt={selectedProject.title} />
            </div>
            <div className="modal-body">
              <h3>{selectedProject.title}</h3>
              <p style={{color:'var(--accent)', fontFamily:'monospace'}}>{selectedProject.category}</p>
              <p>{selectedProject.desc}</p>
              <div className="modal-tech-list">
                {selectedProject.tech.map((tag, i) => (<span key={i} className="modal-tech-tag">{tag}</span>))}
              </div>
              <div className="modal-links">
                <MagneticButton href={selectedProject.github} target="_blank" className="btn btn-primary"><i className="bi bi-github"></i> View Code</MagneticButton>
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedService && (
        <div className="modal-overlay" onClick={() => setSelectedService(null)} style={{zIndex: 20002}}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '600px' }}>
            <button className="close-btn" onClick={() => setSelectedService(null)}>&times;</button>
            <div className="modal-body" style={{ paddingTop: '3rem', textAlign: 'center' }}>
              <div className="icon" style={{ fontSize: '4rem', marginBottom: '1rem', color: 'var(--accent)' }}>
                <i className={`bi bi-${selectedService.icon}`}></i>
              </div>
              <h3 style={{ fontSize: '2rem', marginBottom: '1rem' }}>{selectedService.title}</h3>
              <p style={{ lineHeight: '1.6', color: 'var(--text-color)' }}>{selectedService.fullDesc}</p>
            </div>
          </div>
        </div>
      )}

      <section id="contact">
        <h2 data-aos="fade-up"><span style={{color:'var(--accent)', marginRight:'10px'}}>06.</span> Get In Touch</h2>
        <div className="contact-container">
          <div data-aos="fade-right" data-aos-delay="100">
              <div className="contact-info-item"><i className="bi bi-geo-alt"></i><div><h4 style={{margin:0, color:'var(--heading-color)'}}>Location</h4><p style={{margin:0}}>Panadura, Sri Lanka</p></div></div>
              <div className="contact-info-item"><i className="bi bi-telephone"></i><div><h4 style={{margin:0, color:'var(--heading-color)'}}>Phone</h4><p style={{margin:0}}>074 058 8722</p></div></div>
              <div className="contact-info-item"><i className="bi bi-envelope"></i><div><h4 style={{margin:0, color:'var(--heading-color)'}}>Email</h4><p style={{margin:0}}>kkavindu379@gmail.com</p></div></div>
          </div>
          <div className="terminal-window" data-aos="fade-left">
            <div className="terminal-header"><div className="terminal-btn red"></div><div className="terminal-btn yellow"></div><div className="terminal-btn green"></div><div style={{marginLeft: '10px', color: '#888', fontSize: '0.8rem'}}>bash — 80x24</div></div>
            <div className="terminal-body">
              <form action="https://api.web3forms.com/submit" method="POST" onSubmit={onSubmit}>
                <input type="hidden" name="access_key" value="YOUR_ACCESS_KEY_HERE" />
                <div className="command-line"><span className="prompt">root@kavindu:~$</span><input type="text" name="name" className="terminal-input" placeholder="enter name" required /></div>
                <div className="command-line"><span className="prompt">root@kavindu:~$</span><input type="email" name="email" className="terminal-input" placeholder="enter email" required /></div>
                <div className="command-line"><span className="prompt">root@kavindu:~$</span><textarea name="message" className="terminal-input" rows="3" placeholder="enter message..." required></textarea></div>
                <MagneticButton type="submit" className="btn btn-primary" style={{marginTop:'10px'}}>{'>'} Send Message</MagneticButton>
              </form>
            </div>
          </div>
        </div>
      </section>

      <footer>
        <div className="footer-big-cta">
          <a href="mailto:kkavindu379@gmail.com" style={{textDecoration:'none'}}>
            <h2>LET'S BUILD SOMETHING</h2>
          </a>
        </div>

        <div className="footer-container">
          <div className="footer-col">
            <h2 className="logo" onClick={handleReset} style={{margin:0, cursor: 'pointer', zIndex: 10001}} title="Reset Site">RHKKS</h2>
            <p style={{marginTop: '1rem', opacity: 0.7, lineHeight: '1.6'}}>Bridging the gap between hardware and software. Building robust IoT solutions and modern web applications.</p>
          </div>
          <div className="footer-col">
            <h4>Menu</h4>
            <ul>
              <li><a href="#home"><i className="bi bi-chevron-right" style={{fontSize:'0.7rem'}}></i> Home</a></li>
              <li><a href="#about"><i className="bi bi-chevron-right" style={{fontSize:'0.7rem'}}></i> About</a></li>
              <li><a href="#portfolio"><i className="bi bi-chevron-right" style={{fontSize:'0.7rem'}}></i> Projects</a></li>
              <li><a href="#contact"><i className="bi bi-chevron-right" style={{fontSize:'0.7rem'}}></i> Contact</a></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Expertise</h4>
            <ul><li><a href="#services">Embedded C</a></li><li><a href="#services">Arduino / ESP32</a></li><li><a href="#services">React & Node.js</a></li><li><a href="#services">PCB Design</a></li></ul>
          </div>
          <div className="footer-col">
            <h4>Connect</h4>
            <ul style={{fontSize:'0.9rem'}}><li><i className="bi bi-geo-alt"></i> Panadura, Sri Lanka</li><li><i className="bi bi-envelope"></i> kkavindu379@gmail.com</li></ul>
            <div className="social-icons">
              <a href="https://github.com/Kavindu379" target="_blank"><i className="bi bi-github"></i></a>
              <a href="https://www.linkedin.com/in/kavindu-kavishka-6a2016362/" target="_blank"><i className="bi bi-linkedin"></i></a>
              <a href="https://wa.me/94740588722" target="_blank"><i className="bi bi-whatsapp"></i></a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2026 <strong>RHKKS</strong>. All Rights Reserved.</p>
          <div className="system-status"><div className="blink"></div> SYSTEM ONLINE</div>
        </div>
      </footer>
      
      {/* Toast Notification */}
      {toast && (
        <div className="toast-container">
          <div className={`toast ${toast.type} ${toast.hiding ? 'hide' : ''}`}>
            {toast.message}
          </div>
        </div>
      )}

      {showScrollTop && (
        <button onClick={scrollToTop} className="scroll-top-btn">
          <i className="bi bi-arrow-up" style={{fontSize: '1.3rem'}}></i>
        </button>
      )}
    </div>
  )
}

export default App