import { useState, useEffect, useRef } from 'react'
import AOS from 'aos'
import 'aos/dist/aos.css'
import Tilt from 'react-parallax-tilt'
import Typewriter from 'typewriter-effect'
import ParticlesBackground from './ParticlesBackground'

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
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

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
      title: 'Automated Parking System',
      category: 'IoT & Embedded Systems',
      desc: 'A smart parking solution designed to optimize space usage and reduce traffic congestion. The system uses IR sensors to detect vehicle presence and automatically controls entry/exit gates. It features a real-time display showing available slots and prevents unauthorized entry.',
      tech: ['C++', 'Arduino', 'IR Sensors', 'Servo Motors', 'LCD Display'],
      icon: 'bi-p-square',
      image: 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&q=80&w=1000',
      github: 'https://github.com/Kavindu379'
    },
    {
      id: 2,
      title: 'Real Estate Platform',
      category: 'Full Stack Web Dev',
      desc: 'A modern, responsive web application for buying, selling, and renting properties. It features advanced search filters, an interactive map integration, and a user-friendly admin dashboard for managing listings. Built with a focus on high performance and SEO.',
      tech: ['React', 'Node.js', 'MongoDB', 'Tailwind CSS', 'Framer Motion'],
      icon: 'bi-building',
      image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=1000',
      github: 'https://github.com/Kavindu379/Real_Estate_Website'
    },
    {
      id: 3,
      title: 'AI Personal Assistant',
      category: 'Artificial Intelligence',
      desc: 'A voice-activated desktop assistant capable of performing system tasks, searching the web, and answering queries. It utilizes Natural Language Processing (NLP) to understand context and can automate daily workflows like sending emails or playing music.',
      tech: ['Python', 'NLP', 'Speech Recognition', 'OpenAI API', 'PyAudio'],
      icon: 'bi-cpu',
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
      const totalScroll = document.documentElement.scrollTop;
      const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scroll = `${totalScroll / windowHeight}`;
      setScrollProgress(Number(scroll));
      setShowScrollTop(totalScroll > 300);
    }

    const updateMousePosition = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      
      const target = e.target;
      if (target.closest('a, button, .card, .logo, input, textarea, .footer-big-cta h2, .hamburger, .mobile-menu-overlay a')) {
        document.body.classList.add('hovering');
      } else {
        document.body.classList.remove('hovering');
      }
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('mousemove', updateMousePosition);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', updateMousePosition);
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
    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      body: formData
    });
    const data = await response.json();
    if (data.success) {
      alert("Message Sent Successfully!");
      event.target.reset();
    } else {
      console.log("Error", data);
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
      <div className="cursor-dot" style={{ left: `${mousePosition.x}px`, top: `${mousePosition.y}px` }} />
      <div className="cursor-outline" style={{ left: `${mousePosition.x}px`, top: `${mousePosition.y}px` }} />

      <ParticlesBackground theme={theme} />
      <div style={{ transform: `scaleX(${scrollProgress})`, transformOrigin: 'left', position: 'fixed', top: 0, left: 0, width: '100%', height: '4px', background: 'var(--accent)', zIndex: 9999 }} />
      
      <nav data-aos="fade-down" data-aos-duration="1000" data-aos-delay="200" style={{ zIndex: 10000 }}>
        <div className="logo" onClick={handleReset} style={{cursor: 'pointer', zIndex: 10001}} title="Reset Site">RHKKS</div>
        
        <ul className="nav-links">
          <li><a href="#home">01. Home</a></li>
          <li><a href="#about">02. About</a></li>
          <li><a href="#resume">03. Resume</a></li>
          <li><a href="#portfolio">04. Projects</a></li>
          <li><a href="#contact">05. Contact</a></li>
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
          <li><a href="#resume" onClick={closeMobileMenu}><span>03.</span> Resume</a></li>
          <li><a href="#portfolio" onClick={closeMobileMenu}><span>04.</span> Projects</a></li>
          <li><a href="#contact" onClick={closeMobileMenu}><span>05.</span> Contact</a></li>
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
            <span>Currently working on: <strong>Autonomous Drone</strong></span>
          </div>
          <h3>Hi, my name is</h3>
          <h1 className="glitch" data-text="Kavindu Kavishka.">Kavindu Kavishka.</h1>
          <h2 style={{color:'var(--text-color)', fontSize:'3rem', marginTop:'0', border:'none'}}>I build things for the web & IoT.</h2>
          <div style={{ fontSize: '1.2rem', color: 'var(--accent)', fontFamily: 'monospace', marginBottom: '2rem', height: '30px' }}>
            <Typewriter options={{ strings: ['> Computer Engineer', '> Full Stack Developer', '> Embedded Systems'], autoStart: true, loop: true, delay: 40 }} />
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
              <div className="stat"><strong>4+</strong> Projects</div>
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

      <section id="resume">
        <h2 data-aos="fade-up"><span style={{color:'var(--accent)', marginRight:'10px'}}>02.</span> Experience & Education</h2>
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
        <h2 data-aos="fade-up"><span style={{color:'var(--accent)', marginRight:'10px'}}>03.</span> What I Do</h2>
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
        <h2 data-aos="fade-up"><span style={{color:'var(--accent)', marginRight:'10px'}}>04.</span> Featured Projects</h2>
        <div className="grid">
          {projects.map((project, index) => (
            <Tilt key={index} tiltMaxAngleX={5} tiltMaxAngleY={5} scale={1.02} transitionSpeed={2500}>
              <div className="card" data-aos="fade-up" data-aos-delay={index * 50} onClick={() => setSelectedProject(project)} style={{cursor: 'pointer'}}>
                <div className="icon"><i className={`bi ${project.icon}`}></i></div>
                <h3>{project.title}</h3>
                <p style={{marginBottom:'1rem'}}>{project.desc.substring(0, 80)}...</p>
                <small style={{color:'var(--accent)'}}>Click for details &rarr;</small>
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
        <h2 data-aos="fade-up"><span style={{color:'var(--accent)', marginRight:'10px'}}>05.</span> Get In Touch</h2>
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
          <p>© 2025 <strong>RHKKS</strong>. All Rights Reserved.</p>
          <div className="system-status"><div className="blink"></div> SYSTEM ONLINE</div>
        </div>
      </footer>
      
      {showScrollTop && (
        <button onClick={scrollToTop} style={{ position: 'fixed', bottom: '30px', right: '30px', background: 'var(--accent)', color: 'var(--bg-color)', border: 'none', borderRadius: '5px', width: '50px', height: '50px', cursor: 'pointer', zIndex: 999 }}>
          <i className="bi bi-arrow-up" style={{fontSize: '1.5rem'}}></i>
        </button>
      )}
    </div>
  )
}

export default App