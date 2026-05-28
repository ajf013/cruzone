import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';

// Baseline projects mapping to real GitHub profile ajf013
const BASELINE_PROJECTS = [
  {
    id: "baseline-ats-analyzer",
    place: "Azure AI / React",
    title: "ATS RESUME",
    title2: "ANALYZER",
    description: "Analyze your resume for ATS compatibility, skill gaps & get actionable improvement suggestions — powered by Azure AI.",
    image: "./projects/ats_analyzer.png",
    liveUrl: "https://atsscore.fcruz.org/",
    repoUrl: "https://github.com/ajf013/ATS-Resume-Score-Checker",
    isManual: false
  },
  {
    id: "baseline-cloudsentry",
    place: "NextJS / Gemini",
    title: "CLOUD",
    title2: "SENTRY",
    description: "AI-powered security scanner for Azure subscriptions. Provides cloud node maps, threat monitoring alerts, and compliance auditing checks.",
    image: "./projects/cloudsentry.png",
    liveUrl: "https://cloudsentry.fcruz.org/",
    repoUrl: "https://github.com/ajf013/CloudSentry",
    isManual: false
  },
  {
    id: "baseline-finops",
    place: "React / FinOps",
    title: "AZURE FINANCIAL",
    title2: "INSIGHTS",
    description: "Cloud spend management dashboard with glassmorphism UI. Integrates real-time budget enforcement and cloud cost calculations.",
    image: "./projects/financial_insights.png",
    liveUrl: "https://finops.fcruz.org/",
    repoUrl: "https://github.com/ajf013/Azure-Financial-Insights",
    isManual: false
  },
  {
    id: "baseline-cruzops",
    place: "React / Azure OpenAI",
    title: "CRUZOPS",
    title2: "AI",
    description: "ChatGPT-like conversational scripting assistant for Azure. Generates administration scripts via conversational AI.",
    image: "./projects/cruzops_ai.png",
    liveUrl: "https://pscli.fcruz.org/",
    repoUrl: "https://github.com/ajf013/CruzOps-AI",
    isManual: false
  },
  {
    id: "baseline-unicompile",
    place: "NextJS / WASM",
    title: "UNI",
    title2: "COMPILE",
    description: "Multi-language online compiler running online and offline. Runs client-side sandboxed execution of compiler binaries.",
    image: "./projects/unicompile.png",
    liveUrl: "https://unicompile.fcruz.org/",
    repoUrl: "https://github.com/ajf013/UniCompile",
    isManual: false
  },
  {
    id: "baseline-sticky-notes",
    place: "React / Supabase",
    title: "STICKY NOTES",
    title2: "APP",
    description: "Real-time synchronized dashboard notes manager. Features interactive sticky notes with Supabase backend database sync.",
    image: "./projects/sticky_notes.png",
    liveUrl: "https://sticky-notes.fcruz.org/",
    repoUrl: "https://github.com/ajf013/sticky-notes-app",
    isManual: false
  },
  {
    id: "baseline-converter",
    place: "React / WASM",
    title: "CONVERTER",
    title2: "APP",
    description: "Privacy-friendly offline browser file conversion tool. Conducts client-side format conversion for images, docs, and audio.",
    image: "./projects/converter_app.png",
    liveUrl: "https://convertme.fcruz.org/",
    repoUrl: "https://github.com/ajf013/converter-app",
    isManual: false
  },
  {
    id: "baseline-music-player",
    place: "React / YouTube API",
    title: "MUSIC PLAYER",
    title2: "REACT",
    description: "Advanced audio player with YouTube sync and loop controls. Features custom audio player interface with Semantic UI styling.",
    image: "./projects/music_player.png",
    liveUrl: "https://music.fcruz.org/",
    repoUrl: "https://github.com/ajf013/musicplayerreact",
    isManual: false
  },
  {
    id: "baseline-portfolio",
    place: "React / Node",
    title: "FRANCIS AJF",
    title2: "PORTFOLIO",
    description: "Personal portfolio website showcasing skills & certificates. Features dynamic timeline animations and rendering logic.",
    image: "./projects/francis_portfolio.png",
    liveUrl: "https://fcruz.org",
    repoUrl: "https://github.com/ajf013/francis-ajf-portfolio",
    isManual: false
  }
];

const AZURE_TABLE_URL = "https://stcruzoneportal.table.core.windows.net/projects";
const READ_SAS = "?se=2031-05-28T00%3A00%3A00Z&sp=r&spr=https&sv=2019-02-02&tn=projects&sig=GNq0ih2ur3z/1mO6H0ID9DaTSmXzOK2EUJ3gA%2BX1x4k%3D";
const WRITE_SAS = "?se=2031-05-28T00%3A00%3A00Z&sp=raud&spr=https&sv=2019-02-02&tn=projects&sig=K38%2BEO2el0VRrI%2BQ2Tis5yBezDKKcKeZIqtQyPkQZXQ%3D";

export default function App() {
  const [projects, setProjects] = useState([]);
  const [order, setOrder] = useState([]);
  const [displayProject, setDisplayProject] = useState(null);
  const [activeIdxState, setActiveIdxState] = useState(0);
  const [theme, setTheme] = useState('dark');
  
  // Modals state
  const [showModal, setShowModal] = useState(false);
  const [showUpdate, setShowUpdate] = useState(false);
  const [changelog, setChangelog] = useState([]);
  const [serverVersion, setServerVersion] = useState('');
  
  // Form values
  const [pTitle, setPTitle] = useState('');
  const [pCategory, setPCategory] = useState('');
  const [pDesc, setPDesc] = useState('');
  const [pLive, setPLive] = useState('');
  const [pRepo, setPRepo] = useState('');
  const [coverStyle, setCoverStyle] = useState('gradient-deep-blue');
  const [pCustomImage, setPCustomImage] = useState('');
  
  // Dimensions references
  const dimensionsRef = useRef({
    cardWidth: 200,
    cardHeight: 300,
    gap: 40,
    offsetTop: 200,
    offsetLeft: 700,
    numberSize: 50
  });

  const isAnimatingRef = useRef(false);
  const isPausedRef = useRef(false);
  const indicatorTweenRef = useRef(null);

  // Get gradient background style
  const getBackgroundStyle = (project) => {
    if (!project.image) {
      return { background: 'linear-gradient(135deg, #1f4068, #162447)' };
    }
    if (project.image.startsWith('gradient-')) {
      const gradients = {
        'gradient-deep-blue': 'linear-gradient(135deg, #1f4068, #162447)',
        'gradient-sunset': 'linear-gradient(135deg, #833ab4, #fd1d1d)',
        'gradient-green': 'linear-gradient(135deg, #11998e, #38ef7d)',
        'gradient-gold': 'linear-gradient(135deg, #fc4a1a, #f7b733)',
        'gradient-purple': 'linear-gradient(135deg, #ff007f, #7f00ff)',
      };
      return { background: gradients[project.image] || gradients['gradient-deep-blue'] };
    }
    return { backgroundImage: `url(${project.image})` };
  };

  // Recalculate dimensions based on viewport
  const updateLayoutDimensions = () => {
    const { innerHeight: height, innerWidth: width } = window;
    const dims = dimensionsRef.current;

    if (width < 480) {
      dims.cardWidth = 70;
      dims.cardHeight = 105;
      dims.gap = 8;
      dims.offsetTop = height - 195;
      dims.offsetLeft = 24;
      dims.numberSize = 20;
    } else if (width < 768) {
      dims.cardWidth = 95;
      dims.cardHeight = 140;
      dims.gap = 10;
      dims.offsetTop = height - 240;
      dims.offsetLeft = 40;
      dims.numberSize = 25;
    } else if (width < 1024) {
      dims.cardWidth = 130;
      dims.cardHeight = 195;
      dims.gap = 16;
      dims.offsetTop = height - 275;
      dims.offsetLeft = width - 450;
      dims.numberSize = 35;
    } else {
      dims.cardWidth = 200;
      dims.cardHeight = 300;
      dims.gap = 40;
      dims.offsetTop = height - 430;
      dims.offsetLeft = width - 830;
      dims.numberSize = 50;
    }
  };

  // Position cards statically (during initialization or resizing)
  const positionCards = (orderList) => {
    if (orderList.length === 0 || window.innerWidth < 992) return;
    const dims = dimensionsRef.current;
    const [active, ...rest] = orderList;

    // Reset pagination position
    gsap.set("#pagination", {
      top: dims.offsetTop + dims.cardHeight + 25,
      left: dims.offsetLeft,
      opacity: 1
    });

    // Main card
    gsap.set(`#card${active}`, {
      x: 0,
      y: 0,
      width: window.innerWidth,
      height: window.innerHeight,
      borderRadius: 0,
      zIndex: 10
    });
    gsap.set(`#card-content-${active}`, { x: 0, y: 0, opacity: 0 });

    // Rest of queue
    rest.forEach((i, index) => {
      gsap.set(`#card${i}`, {
        x: dims.offsetLeft + index * (dims.cardWidth + dims.gap),
        y: dims.offsetTop,
        width: dims.cardWidth,
        height: dims.cardHeight,
        zIndex: 30,
        borderRadius: 12
      });
      gsap.set(`#card-content-${i}`, {
        x: 0,
        y: 0,
        opacity: 1,
        zIndex: 40
      });
      gsap.set(`#slide-item-${i}`, { x: (index + 1) * dims.numberSize });
    });
  };

  // Transition slider forward/backward
  const runTransition = (newOrder, direction) => {
    if (window.innerWidth < 992) {
      setDisplayProject(projects[newOrder[0]]);
      setActiveIdxState(newOrder[0]);
      return Promise.resolve();
    }
    return new Promise((resolve) => {
      const dims = dimensionsRef.current;
      const [active, ...rest] = newOrder;
      const prv = direction === "next" ? rest[rest.length - 1] : rest[0];

      setActiveIdxState(active);

      // Fade out current text elements
      gsap.to([".details .text", ".details .title-1", ".details .title-2", ".details .desc", ".details .cta"], {
        opacity: 0,
        y: (index, target) => {
          if (target.classList.contains("desc") || target.classList.contains("cta")) return 30;
          return 50;
        },
        duration: 0.25,
        stagger: 0.02,
        onComplete: () => {
          // Set state to update contents in DOM
          setDisplayProject(projects[active]);
          
          // Reset y positions and opacity for fade-in
          gsap.set(".details .text", { y: 30, opacity: 0 });
          gsap.set(".details .title-1", { y: 50, opacity: 0 });
          gsap.set(".details .title-2", { y: 50, opacity: 0 });
          gsap.set(".details .desc", { y: 25, opacity: 0 });
          gsap.set(".details .cta", { y: 25, opacity: 0 });
          
          // Fade in the new contents
          gsap.to(".details .text", { y: 0, opacity: 1, duration: 0.4 });
          gsap.to(".details .title-1", { y: 0, opacity: 1, duration: 0.4, delay: 0.05 });
          gsap.to(".details .title-2", { y: 0, opacity: 1, duration: 0.4, delay: 0.05 });
          gsap.to(".details .desc", { y: 0, opacity: 1, duration: 0.3, delay: 0.1 });
          gsap.to(".details .cta", { y: 0, opacity: 1, duration: 0.3, delay: 0.15 });
        }
      });

      // Animate card scale
      gsap.set(`#card${prv}`, { zIndex: 10 });
      gsap.set(`#card${active}`, { zIndex: 20 });
      gsap.to(`#card${prv}`, { scale: 1.2, duration: 0.6 });

      gsap.to(`#card-content-${active}`, {
        y: 30,
        opacity: 0,
        duration: 0.3
      });
      
      gsap.to(`#slide-item-${active}`, { x: 0, duration: 0.5 });
      gsap.to(`#slide-item-${prv}`, { x: -dims.numberSize, duration: 0.5 });
      
      gsap.to(".progress-sub-foreground", {
        width: `${(100 * (active + 1)) / newOrder.length}%`,
        duration: 0.5
      });

      // Scale active card full-screen
      gsap.to(`#card${active}`, {
        x: 0,
        y: 0,
        width: window.innerWidth,
        height: window.innerHeight,
        borderRadius: 0,
        duration: 0.8,
        onComplete: () => {
          const prvRestIndex = rest.indexOf(prv);
          const xNew = dims.offsetLeft + prvRestIndex * (dims.cardWidth + dims.gap);
          
          gsap.set(`#card${prv}`, {
            x: xNew,
            y: dims.offsetTop,
            width: dims.cardWidth,
            height: dims.cardHeight,
            zIndex: 30,
            borderRadius: 12,
            scale: 1,
          });

          gsap.set(`#card-content-${prv}`, {
            x: 0,
            y: 0,
            opacity: 1,
            zIndex: 40
          });
          
          gsap.set(`#slide-item-${prv}`, { x: (prvRestIndex + 1) * dims.numberSize });
          resolve();
        }
      });

      // Shift other cards in the queue
      rest.forEach((i) => {
        if (i !== prv) {
          const itemRestIndex = rest.indexOf(i);
          const xNew = dims.offsetLeft + itemRestIndex * (dims.cardWidth + dims.gap);
          
          gsap.set(`#card${i}`, { zIndex: 30 });
          
          gsap.to(`#card${i}`, {
            x: xNew,
            y: dims.offsetTop,
            width: dims.cardWidth,
            height: dims.cardHeight,
            duration: 0.6,
            delay: 0.03 * (itemRestIndex + 1)
          });

          gsap.to(`#card-content-${i}`, {
            x: 0,
            y: 0,
            opacity: 1,
            zIndex: 40,
            duration: 0.6,
            delay: 0.03 * (itemRestIndex + 1)
          });
          
          gsap.to(`#slide-item-${i}`, { x: (itemRestIndex + 1) * dims.numberSize, duration: 0.6 });
        }
      });
    });
  };

  const stopTimer = () => {
    if (indicatorTweenRef.current) {
      indicatorTweenRef.current.kill();
      indicatorTweenRef.current = null;
    }
  };

  const startTimer = () => {
    stopTimer();
    if (isPausedRef.current || order.length <= 1 || window.innerWidth < 992) return;

    gsap.set(".indicator", { x: -window.innerWidth });

    indicatorTweenRef.current = gsap.to(".indicator", {
      x: 0,
      duration: 5.0, // 5 seconds rotation timer!
      ease: "none",
      onComplete: () => {
        gsap.to(".indicator", {
          x: window.innerWidth,
          duration: 0.4,
          ease: "power1.in",
          onComplete: () => {
            handleNext();
          }
        });
      }
    });
  };

  const handleNext = async () => {
    if (isAnimatingRef.current || order.length <= 1) return;
    isAnimatingRef.current = true;
    
    const newOrder = [...order];
    newOrder.push(newOrder.shift());
    
    await runTransition(newOrder, "next");
    setOrder(newOrder);
    isAnimatingRef.current = false;
  };

  const handlePrev = async () => {
    if (isAnimatingRef.current || order.length <= 1) return;
    isAnimatingRef.current = true;
    
    const newOrder = [...order];
    newOrder.unshift(newOrder.pop());
    
    await runTransition(newOrder, "prev");
    setOrder(newOrder);
    isAnimatingRef.current = false;
  };

  // Load manual list from localStorage
  const loadManual = () => {
    const stored = localStorage.getItem('cruz_portal_manual_projects');
    return stored ? JSON.parse(stored) : [];
  };

  // Fetch manually added projects from Azure Table Storage
  const fetchCloudProjects = async () => {
    try {
      const res = await fetch(`${AZURE_TABLE_URL}()${READ_SAS}`, {
        headers: {
          'Accept': 'application/json;odata=nometadata'
        }
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      return (data.value || []).map(item => ({
        id: item.RowKey,
        place: item.place,
        title: item.title,
        title2: item.title2,
        description: item.description,
        image: item.image,
        liveUrl: item.liveUrl || null,
        repoUrl: item.repoUrl || null,
        isManual: item.isManual
      }));
    } catch (err) {
      console.warn("Could not load projects from Azure Table database, using local cache:", err);
      return null;
    }
  };

  // Helper to get Write SAS token
  const getWriteSas = () => {
    return WRITE_SAS;
  };

  // PWA Check Updates
  const checkPwaUpdates = async () => {
    // Register SW
    if ('serviceWorker' in navigator) {
      try {
        await navigator.serviceWorker.register('./sw.js');
      } catch (err) {
        console.warn('SW register fail', err);
      }
    }

    // Check version
    try {
      const res = await fetch(`./version.json?t=${Date.now()}`);
      if (!res.ok) return;
      const config = await res.json();
      
      const serverV = config.version;
      const serverChangelogs = config.changelog || [];
      const localV = localStorage.getItem('cruz_portal_app_version');

      setServerVersion(serverV);
      setChangelog(serverChangelogs);

      if (!localV) {
        localStorage.setItem('cruz_portal_app_version', serverV);
      } else if (localV !== serverV) {
        setShowUpdate(true);
        isPausedRef.current = true;
      }
    } catch (err) {
      console.warn('Update check failed', err);
    }
  };

  const handleUpdateRefresh = async () => {
    localStorage.setItem('cruz_portal_app_version', serverVersion);
    
    // Clear cache
    try {
      if ('caches' in window) {
        const keys = await caches.keys();
        await Promise.all(keys.map(k => caches.delete(k)));
      }
    } catch(e) {}

    // Unregister SW
    try {
      if ('serviceWorker' in navigator) {
        const regs = await navigator.serviceWorker.getRegistrations();
        await Promise.all(regs.map(r => r.unregister()));
      }
    } catch(e) {}

    window.location.reload(true);
  };

  // Initial Loading
  useEffect(() => {
    const initialize = async () => {
      // Hide cover splash screen
      updateLayoutDimensions();

      const cloudManual = await fetchCloudProjects();
      let manual = [];
      if (cloudManual !== null) {
        manual = cloudManual;
        localStorage.setItem('cruz_portal_manual_projects', JSON.stringify(cloudManual));
      } else {
        manual = loadManual();
      }

      const merged = [...manual, ...BASELINE_PROJECTS];
      setProjects(merged);
      setOrder(Array.from({ length: merged.length }, (_, i) => i));
      setActiveIdxState(0);

      // Theme
      const savedTheme = localStorage.getItem('cruz_portal_theme') || 'dark';
      setTheme(savedTheme);
      if (savedTheme === 'light') {
        document.body.classList.add('light-theme');
      }

      // Check update
      await checkPwaUpdates();
      
      gsap.to(".cover", {
        x: window.innerWidth + 400,
        duration: 0.8,
        ease: "power2.inOut",
        onComplete: () => {
          gsap.set(".cover", { display: "none" });
        }
      });
    };
    
    initialize();

    // Resize handler
    const handleResize = () => {
      updateLayoutDimensions();
      if (order.length > 0) {
        positionCards(order);
      }
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      stopTimer();
    };
  }, []);

  // Position cards whenever projects/order loads
  useEffect(() => {
    if (order.length > 0) {
      updateLayoutDimensions();
      positionCards(order);
      setDisplayProject(projects[order[0]]);
      startTimer();
    }
  }, [order]);

  // Pause cycles on mouse interactions
  const handleMouseEnter = () => {
    isPausedRef.current = true;
    if (indicatorTweenRef.current && !isAnimatingRef.current) {
      indicatorTweenRef.current.pause();
    }
  };

  const handleMouseLeave = () => {
    isPausedRef.current = false;
    if (indicatorTweenRef.current && !isAnimatingRef.current) {
      indicatorTweenRef.current.resume();
    } else if (!isAnimatingRef.current) {
      startTimer();
    }
  };

  // Add project submit
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!pTitle.trim() || !pCategory.trim() || !pDesc.trim()) return;

    const writeSas = getWriteSas();
    if (!writeSas) return;

    let imgVal = coverStyle;
    if (coverStyle === 'custom') {
      imgVal = pCustomImage.trim() || 'gradient-deep-blue';
    }

    const words = pTitle.toUpperCase().split(" ");
    const title1 = words.slice(0, 2).join(" ") || "PROJECT";
    const title2 = words.slice(2).join(" ") || "DETAILS";

    const projectId = `manual-${Date.now()}`;
    const newEntity = {
      PartitionKey: 'project',
      RowKey: projectId,
      place: pCategory,
      title: title1,
      title2: title2,
      description: pDesc,
      image: imgVal,
      liveUrl: pLive.trim() || null,
      repoUrl: pRepo.trim() || null,
      isManual: true
    };

    try {
      const res = await fetch(`${AZURE_TABLE_URL}${writeSas}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json;odata=nometadata'
        },
        body: JSON.stringify(newEntity)
      });

      if (!res.ok) {
        if (res.status === 403 || res.status === 401 || res.status === 400) {
          localStorage.removeItem('cruz_portal_write_sas');
          alert("Access Denied! The Admin SAS Token is invalid, expired, or has insufficient permissions.");
          return;
        }
        throw new Error(`Azure Table Storage responded with status ${res.status}`);
      }

      // Add to local projects state & update localStorage cache
      const newProject = {
        id: projectId,
        place: pCategory,
        title: title1,
        title2: title2,
        description: pDesc,
        image: imgVal,
        liveUrl: pLive.trim() || null,
        repoUrl: pRepo.trim() || null,
        isManual: true
      };

      const manual = loadManual();
      manual.unshift(newProject);
      localStorage.setItem('cruz_portal_manual_projects', JSON.stringify(manual));

      const newProjects = [newProject, ...projects];
      setProjects(newProjects);

      // Close modal & reset form
      setShowModal(false);
      setPTitle('');
      setPCategory('');
      setPDesc('');
      setPLive('');
      setPRepo('');
      setCoverStyle('gradient-deep-blue');
      setPCustomImage('');
      isPausedRef.current = false;

      // Reset carousel showing the newly added index 0
      setOrder(Array.from({ length: newProjects.length }, (_, i) => i));
      setActiveIdxState(0);
      alert("Project successfully added to the Azure Table database!");
    } catch (err) {
      console.error(err);
      alert("Failed to save project to Azure cloud database: " + err.message);
    }
  };

  // Delete manual project
  const handleDeleteProject = async (projId, title) => {
    if (window.confirm(`Are you sure you want to delete "${title}" from the cloud database?`)) {
      const writeSas = getWriteSas();
      if (!writeSas) return;

      try {
        const deleteUrl = `${AZURE_TABLE_URL}(PartitionKey='project',RowKey='${projId}')${writeSas}`;
        const res = await fetch(deleteUrl, {
          method: 'DELETE',
          headers: {
            'If-Match': '*',
            'Accept': 'application/json;odata=nometadata'
          }
        });

        if (!res.ok) {
          if (res.status === 403 || res.status === 401 || res.status === 400) {
            localStorage.removeItem('cruz_portal_write_sas');
            alert("Access Denied! The Admin SAS Token is invalid or expired.");
            return;
          }
          throw new Error(`Azure Table Storage responded with status ${res.status}`);
        }

        // Delete from local projects state & update localStorage cache
        let manual = loadManual();
        manual = manual.filter(p => p.id !== projId);
        localStorage.setItem('cruz_portal_manual_projects', JSON.stringify(manual));

        const newProjects = projects.filter(p => p.id !== projId);
        setProjects(newProjects);
        setOrder(Array.from({ length: newProjects.length }, (_, i) => i));
        setActiveIdxState(0);
        alert("Project successfully deleted from the Azure Table database!");
      } catch (err) {
        console.error(err);
        alert("Failed to delete project from Azure cloud database: " + err.message);
      }
    }
  };

  // Toggle Theme
  const toggleTheme = () => {
    if (theme === 'dark') {
      setTheme('light');
      document.body.classList.add('light-theme');
      localStorage.setItem('cruz_portal_theme', 'light');
    } else {
      setTheme('dark');
      document.body.classList.remove('light-theme');
      localStorage.setItem('cruz_portal_theme', 'dark');
    }
  };

  // Export JSON configs
  const handleExportJSON = () => {
    const manual = loadManual();
    if (manual.length === 0) {
      alert("No manually added projects to export!");
      return;
    }
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(manual, null, 2));
    const a = document.createElement('a');
    a.setAttribute("href", dataStr);
    a.setAttribute("download", "projects.json");
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  // Map active indexes
  const activeIdx = order[0] ?? 0;
  const activeProject = projects[activeIdx] || { place: '', title: '', title2: '', description: '' };

  return (
    <>
      <div className="indicator"></div>

      <nav>
        <div className="brand">
          <img src="./icon.png" alt="CruzOne Logo" className="brand-logo" />
          <h1 className="brand-text">CruzOne Portal</h1>
        </div>
        <div className="nav-links">
          <div className="active">Projects</div>
          <a href="https://github.com/ajf013" target="_blank" rel="noopener noreferrer" className="nav-item">GitHub Profile</a>
          <button id="export-json-btn" onClick={handleExportJSON} className="nav-item-btn" title="Export Added Projects to JSON">Export Config</button>
          <button id="theme-toggle-btn" onClick={toggleTheme} className="theme-toggle" title="Toggle Light/Dark Theme">
            {theme === 'dark' ? (
              <svg className="sun-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707M14 12a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            ) : (
              <svg className="moon-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>
        </div>
      </nav>

      {/* Main Content Area */}
      <main>
        {/* Card Carousel Holder */}
        <div 
          id="demo" 
        onMouseEnter={handleMouseEnter} 
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleMouseEnter}
        onTouchEnd={handleMouseLeave}
      >
        {projects.map((project, idx) => {
          const isActiveBg = activeIdxState === idx;
          return (
            <div
              key={project.id}
              className={`card ${isActiveBg ? 'active-bg' : ''}`}
              id={`card${idx}`}
              style={getBackgroundStyle(project)}
            >
              <div className="card-content" id={`card-content-${idx}`}>
                <div className="content-start"></div>
                <div className="content-place">{project.place}</div>
                <div className="content-title-1">{project.title}</div>
                <div className="content-title-2">{project.title2}</div>
                
                {/* Mobile view details stacked inside the card */}
                <div className="card-mobile-details">
                  {project.image && (
                    <div className="card-mobile-screenshot-wrapper">
                      {project.image.startsWith('gradient-') ? (
                        <div className="card-mobile-screenshot gradient-bg" style={getBackgroundStyle(project)} />
                      ) : (
                        <img 
                          src={project.image} 
                          alt={`${project.title} ${project.title2}`} 
                          className="card-mobile-screenshot" 
                        />
                      )}
                    </div>
                  )}
                  <p className="card-mobile-desc">{project.description}</p>
                  <div className="card-mobile-cta">
                    {project.liveUrl && (
                      <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="mobile-cta-btn live">Launch App</a>
                    )}
                    {project.repoUrl && (
                      <a href={project.repoUrl} target="_blank" rel="noopener noreferrer" className="mobile-cta-btn repo">View Code</a>
                    )}
                    {project.isManual && (
                      <button 
                        className="mobile-delete-btn" 
                        onClick={(e) => { 
                          e.stopPropagation(); 
                          handleDeleteProject(project.id, `${project.title} ${project.title2}`); 
                        }}
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Slide Details Left Panel */}
      <div 
        className="details" 
        onMouseEnter={handleMouseEnter} 
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleMouseEnter}
        onTouchEnd={handleMouseLeave}
      >
        <div className="place-box">
          <div className="text">{displayProject?.place || activeProject.place}</div>
        </div>
        <div className="title-box-1"><div className="title-1">{displayProject?.title || activeProject.title}</div></div>
        <div className="title-box-2"><div className="title-2">{displayProject?.title2 || activeProject.title2}</div></div>
        
        {/* Mobile mockup screenshot (visible on mobile only) */}
        <div className="mobile-mockup-card">
          <div className="mobile-mockup-browser">
            <div className="browser-dots">
              <span className="dot dot-close"></span>
              <span className="dot dot-minimize"></span>
              <span className="dot dot-expand"></span>
            </div>
            {displayProject?.image?.startsWith('gradient-') || activeProject?.image?.startsWith('gradient-') ? (
              <div className="browser-screenshot gradient-bg" style={getBackgroundStyle(displayProject || activeProject)} />
            ) : (
              <img 
                src={displayProject?.image || activeProject.image} 
                alt={displayProject?.title || activeProject.title} 
                className="browser-screenshot" 
              />
            )}
          </div>
        </div>

        <div className="desc">{displayProject?.description || activeProject.description}</div>
        <div className="cta">
          {(displayProject?.liveUrl || activeProject.liveUrl) && (
            <a href={displayProject?.liveUrl || activeProject.liveUrl} target="_blank" rel="noopener noreferrer" className="discover live-btn">Launch App</a>
          )}
          {(displayProject?.repoUrl || activeProject.repoUrl) && (
            <a href={displayProject?.repoUrl || activeProject.repoUrl} target="_blank" rel="noopener noreferrer" className="discover repo-btn">View Code</a>
          )}
          {(displayProject?.isManual || activeProject.isManual) && (
            <button 
              className="delete-btn" 
              onClick={() => handleDeleteProject(
                displayProject?.id || activeProject.id, 
                `${displayProject?.title || activeProject.title} ${displayProject?.title2 || activeProject.title2}`
              )} 
              title="Delete Project"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
              </svg>
            </button>
          )}
        </div>

        {/* Sidebar social & copyrights */}
        <div className="sidebar-footer">
          <div className="social-dock">
            <a href="https://github.com/ajf013" target="_blank" rel="noopener noreferrer" className="social-icon-btn github" title="GitHub" aria-label="GitHub">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
            </a>
            <a href="https://www.linkedin.com/in/ajf013-francis-cruz/" target="_blank" rel="noopener noreferrer" className="social-icon-btn linkedin" title="LinkedIn" aria-label="LinkedIn">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
            </a>
            <a href="https://www.instagram.com/fcruz_013/" target="_blank" rel="noopener noreferrer" className="social-icon-btn instagram" title="Instagram" aria-label="Instagram">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
            </a>
            <a href="https://api.whatsapp.com/send?phone=916379649461" target="_blank" rel="noopener noreferrer" className="social-icon-btn whatsapp" title="WhatsApp" aria-label="WhatsApp">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
            </a>
            <a href="https://x.com/Itsme_Ajf013" target="_blank" rel="noopener noreferrer" className="social-icon-btn twitter" title="X (Twitter)" aria-label="X (formerly Twitter)">
              <svg viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path></svg>
            </a>
          </div>
          <div className="copyright">
            Copyrights © {new Date().getFullYear()} Francis Cruz | MCT
          </div>
        </div>
      </div>

      {/* Desktop mockup browser frame */}
      <div className="showcase-container">
        <div className="browser-mockup">
          <div className="browser-header">
            <div className="browser-dots">
              <span className="dot dot-close"></span>
              <span className="dot dot-minimize"></span>
              <span className="dot dot-expand"></span>
            </div>
            <div className="browser-address-bar">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" style={{ width: '11px', height: '11px', opacity: 0.5, marginRight: '6px' }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
              </svg>
              <span className="address-text">
                {displayProject?.liveUrl ? displayProject.liveUrl.replace('https://', '') : 'fcruz.org'}
              </span>
            </div>
          </div>
          <div className="browser-viewport">
            {displayProject?.image?.startsWith('gradient-') || activeProject?.image?.startsWith('gradient-') ? (
              <div className="browser-screenshot gradient-bg" style={getBackgroundStyle(displayProject || activeProject)} />
            ) : (
              <img 
                src={displayProject?.image || activeProject.image} 
                alt={displayProject?.title || activeProject.title} 
                className="browser-screenshot" 
              />
            )}
          </div>
        </div>
      </div>
    </main>

      {/* Mobile view footer (hidden on desktop) */}
      <footer className="mobile-footer">
        <div className="social-dock">
          <a href="https://github.com/ajf013" target="_blank" rel="noopener noreferrer" className="social-icon-btn github" title="GitHub" aria-label="GitHub">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
          </a>
          <a href="https://www.linkedin.com/in/ajf013-francis-cruz/" target="_blank" rel="noopener noreferrer" className="social-icon-btn linkedin" title="LinkedIn" aria-label="LinkedIn">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
          </a>
          <a href="https://www.instagram.com/fcruz_013/" target="_blank" rel="noopener noreferrer" className="social-icon-btn instagram" title="Instagram" aria-label="Instagram">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
          </a>
          <a href="https://api.whatsapp.com/send?phone=916379649461" target="_blank" rel="noopener noreferrer" className="social-icon-btn whatsapp" title="WhatsApp" aria-label="WhatsApp">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
          </a>
          <a href="https://x.com/Itsme_Ajf013" target="_blank" rel="noopener noreferrer" className="social-icon-btn twitter" title="X (Twitter)" aria-label="X (formerly Twitter)">
            <svg viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path></svg>
          </a>
        </div>
        <div className="copyright">
          Copyrights © {new Date().getFullYear()} Francis Cruz | MCT
        </div>
      </footer>

      {/* Pagination Controls */}
      <div 
        className="pagination" 
        id="pagination"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleMouseEnter}
        onTouchEnd={handleMouseLeave}
      >
        <div className="arrow arrow-left" onClick={handlePrev}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </div>
        <div className="arrow arrow-right" onClick={handleNext}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
        </div>
        <div className="progress-sub-container">
          <div className="progress-sub-background">
            <div className="progress-sub-foreground"></div>
          </div>
        </div>
        <div className="slide-numbers" id="slide-numbers">
          {projects.map((_, idx) => (
            <div key={idx} className="item" id={`slide-item-${idx}`}>{idx + 1}</div>
          ))}
        </div>
      </div>

      {/* Cover screen loader */}
      <div className="cover">
        <div className="cover-content">
          <img src="./icon.png" alt="CruzOne Logo" className="cover-logo" />
          <div className="cover-title">CruzOne Portal</div>
          <div className="cover-loader">
            <div className="cover-loader-bar"></div>
          </div>
        </div>
      </div>

      {/* Add Project FAB */}
      <button 
        className="fab" 
        id="add-project-fab" 
        onClick={() => { setShowModal(true); isPausedRef.current = true; }} 
        title="Add Project Manually"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
      </button>

      {/* Add Project Modal */}
      <div className={`modal ${showModal ? 'show' : ''}`} onClick={(e) => { if (e.target.classList.contains('modal')) { setShowModal(false); isPausedRef.current = false; } }}>
        <div className="modal-content">
          <div className="modal-header">
            <h2>Add New Project</h2>
            <button className="close-btn" onClick={() => { setShowModal(false); isPausedRef.current = false; }}>&times;</button>
          </div>
          <form id="project-form" onSubmit={handleFormSubmit}>
            <div className="form-group">
              <label>Project Title</label>
              <input type="text" value={pTitle} onChange={(e) => setPTitle(e.target.value)} required placeholder="e.g. ATS Resume Score Checker" />
            </div>
            <div className="form-group">
              <label>Category / Tech Stack</label>
              <input type="text" value={pCategory} onChange={(e) => setPCategory(e.target.value)} required placeholder="e.g. React, PWA, JS" />
            </div>
            <div className="form-group">
              <label>Short Description</label>
              <textarea value={pDesc} onChange={(e) => setPDesc(e.target.value)} required placeholder="Describe what the project does..." />
            </div>
            <div className="form-group">
              <label>Live Link URL (Optional)</label>
              <input type="url" value={pLive} onChange={(e) => setPLive(e.target.value)} placeholder="https://atsscore.fcruz.org/" />
            </div>
            <div className="form-group">
              <label>GitHub Repository URL (Optional)</label>
              <input type="url" value={pRepo} onChange={(e) => setPRepo(e.target.value)} placeholder="https://github.com/ajf013/ATS-Resume-Score-Checker" />
            </div>
            <div className="form-group">
              <label>Cover Style</label>
              <div className="cover-options">
                {['gradient-deep-blue', 'gradient-sunset', 'gradient-green', 'gradient-gold', 'gradient-purple'].map((styleName) => (
                  <div
                    key={styleName}
                    className={`cover-option ${coverStyle === styleName ? 'active' : ''}`}
                    style={getBackgroundStyle({ image: styleName })}
                    onClick={() => setCoverStyle(styleName)}
                  />
                ))}
                <div
                  className={`cover-option custom-image-text ${coverStyle === 'custom' ? 'active' : ''}`}
                  onClick={() => setCoverStyle('custom')}
                >
                  Custom
                </div>
              </div>
              {coverStyle === 'custom' && (
                <input
                  type="url"
                  value={pCustomImage}
                  onChange={(e) => setPCustomImage(e.target.value)}
                  placeholder="Paste Custom Image URL"
                  style={{ marginTop: '10px' }}
                  required
                />
              )}
            </div>
            <button type="submit" className="submit-btn">Save Project</button>
          </form>
        </div>
      </div>

      {/* PWA Update Banner */}
      <div className={`update-banner ${showUpdate ? 'show' : ''}`}>
        <div className="update-banner-header">
          <span className="update-badge">Update Available</span>
          <span className="update-version">v{serverVersion}</span>
        </div>
        <div className="update-banner-body">
          <p>New features and improvements were successfully pushed:</p>
          <ul>
            {changelog.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        </div>
        <button className="update-banner-btn" onClick={handleUpdateRefresh}>Update & Refresh</button>
      </div>
    </>
  );
}
