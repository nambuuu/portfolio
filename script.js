/**
 * NGUYỄN VĂN NAM — AI ENGINEER PORTFOLIO INTERACTIVITY
 * Pure Vanilla JavaScript (ES6+)
 */

document.addEventListener('DOMContentLoaded', () => {
  initNeuralCanvas();
  initTypewriter();
  initScrollRevealAndNav();
  initSpotlightCards();
  initSkillsFilter();
  initCopyToClipboard();
  initLanguageToggle();
  initMobileMenuAndPrint();
});

/* ==========================================================================
   1. INTERACTIVE NEURAL NETWORK CANVAS
   ========================================================================== */
function initNeuralCanvas() {
  const canvas = document.getElementById('neural-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  const mouse = { x: null, y: null, radius: 140 };

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  window.addEventListener('mouseout', () => {
    mouse.x = null;
    mouse.y = null;
  });

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    createNodes();
  });

  let nodes = [];
  const colors = ['#00f2fe', '#38bdf8', '#a855f7', '#10b981'];

  function createNodes() {
    nodes = [];
    const count = Math.min(Math.floor((width * height) / 18000), 75);
    for (let i = 0; i < count; i++) {
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.55,
        vy: (Math.random() - 0.5) * 0.55,
        radius: Math.random() * 1.8 + 1,
        color: colors[i % colors.length],
      });
    }
  }

  createNodes();

  function animate() {
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < nodes.length; i++) {
      const n1 = nodes[i];
      n1.x += n1.vx;
      n1.y += n1.vy;

      if (n1.x < 0 || n1.x > width) n1.vx *= -1;
      if (n1.y < 0 || n1.y > height) n1.vy *= -1;

      // Draw Node
      ctx.beginPath();
      ctx.arc(n1.x, n1.y, n1.radius, 0, Math.PI * 2);
      ctx.fillStyle = n1.color;
      ctx.fill();

      // Connect nearby nodes
      for (let j = i + 1; j < nodes.length; j++) {
        const n2 = nodes[j];
        const dx = n1.x - n2.x;
        const dy = n1.y - n2.y;
        const dist = Math.hypot(dx, dy);

        if (dist < 135) {
          const alpha = (1 - dist / 135) * 0.22;
          ctx.beginPath();
          ctx.moveTo(n1.x, n1.y);
          ctx.lineTo(n2.x, n2.y);
          ctx.strokeStyle = `rgba(56, 189, 248, ${alpha})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }

      // Connect to mouse cursor
      if (mouse.x !== null && mouse.y !== null) {
        const mdx = n1.x - mouse.x;
        const mdy = n1.y - mouse.y;
        const mDist = Math.hypot(mdx, mdy);
        if (mDist < mouse.radius) {
          const mAlpha = (1 - mDist / mouse.radius) * 0.45;
          ctx.beginPath();
          ctx.moveTo(n1.x, n1.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.strokeStyle = `rgba(0, 242, 254, ${mAlpha})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(animate);
  }

  animate();
}

/* ==========================================================================
   2. TYPEWRITER EFFECT IN HERO
   ========================================================================== */
let currentLang = 'en';

const typewriterPhrases = {
  en: [
    'Deep Learning & RAG Systems',
    'Machine Learning & XGBoost',
    'FastAPI Inference Microservices',
    'MLOps • MLflow • Docker',
    'PyTorch • LangChain • FAISS',
  ],
  vi: [
    'Deep Learning & Hệ thống RAG',
    'Machine Learning & XGBoost',
    'FastAPI & Triển khai Model AI',
    'MLOps • MLflow • Docker',
    'PyTorch • LangChain • FAISS',
  ],
};

function initTypewriter() {
  const el = document.getElementById('typewriter-text');
  if (!el) return;

  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  function tick() {
    const phrases = typewriterPhrases[currentLang] || typewriterPhrases.en;
    const currentPhrase = phrases[phraseIndex % phrases.length];

    if (isDeleting) {
      charIndex--;
    } else {
      charIndex++;
    }

    el.textContent = currentPhrase.substring(0, charIndex);

    let speed = isDeleting ? 35 : 70;

    if (!isDeleting && charIndex === currentPhrase.length) {
      speed = 2000;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      speed = 350;
    }

    setTimeout(tick, speed);
  }

  tick();
}

/* ==========================================================================
   3. SCROLL REVEAL & ACTIVE NAVBAR TRACKING
   ========================================================================== */
function initScrollRevealAndNav() {
  const navbar = document.getElementById('navbar');
  const reveals = document.querySelectorAll('.reveal');
  const sections = document.querySelectorAll('main section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    },
    { threshold: 0.12 }
  );

  reveals.forEach((item) => revealObserver.observe(item));

  window.addEventListener('scroll', () => {
    if (window.scrollY > 24) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    let currentSection = 'hero';
    sections.forEach((sec) => {
      const top = sec.offsetTop - 140;
      if (window.scrollY >= top) {
        currentSection = sec.getAttribute('id');
      }
    });

    navLinks.forEach((link) => {
      link.classList.toggle('active', link.getAttribute('href') === `#${currentSection}`);
    });
  });
}

/* ==========================================================================
   4. 3D SPOTLIGHT CARD HOVER TRACKING
   ========================================================================== */
function initSpotlightCards() {
  const cards = document.querySelectorAll('.spotlight-card');
  cards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });
}

/* ==========================================================================
   5. TECHNICAL SKILLS CATEGORY FILTER
   ========================================================================== */
function initSkillsFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const skillCards = document.querySelectorAll('.skill-card');

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const category = btn.getAttribute('data-filter');

      skillCards.forEach((card) => {
        const cardCat = card.getAttribute('data-category');
        if (category === 'all' || cardCat === category) {
          card.classList.remove('hidden');
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });
}

/* ==========================================================================
   6. ONE-CLICK COPY TO CLIPBOARD & TOAST NOTIFICATION
   ========================================================================== */
function initCopyToClipboard() {
  const copyTriggers = document.querySelectorAll('.copy-trigger');
  const toast = document.getElementById('toast');
  const toastMessage = document.getElementById('toast-message');
  let toastTimeout;

  function showToast(text) {
    if (!toast || !toastMessage) return;
    toastMessage.textContent = text;
    toast.classList.add('show');
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      toast.classList.remove('show');
    }, 2600);
  }

  copyTriggers.forEach((btn) => {
    btn.addEventListener('click', async () => {
      const value = btn.getAttribute('data-copy');
      if (!value) return;

      try {
        await navigator.clipboard.writeText(value);
      } catch {
        const textarea = document.createElement('textarea');
        textarea.value = value;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }

      const msg =
        currentLang === 'vi'
          ? `Đã sao chép: ${value}`
          : `Copied to clipboard: ${value}`;
      showToast(msg);
    });
  });
}

/* ==========================================================================
   7. BILINGUAL SWITCHER (ENGLISH / VIETNAMESE)
   ========================================================================== */
const translations = {
  en: {
    nav_home: 'Overview',
    nav_skills: 'Skills',
    nav_projects: 'Projects',
    nav_edu: 'Education & Languages',
    nav_contact: 'Contact',
    btn_cv: 'Print CV',
    hero_status: 'Available for AI Engineer Opportunities • Hanoi, Vietnam',
    hero_greeting: 'Hello, I am',
    hero_summary:
      'Passionate <strong>AI Engineer</strong> with a strong foundation in <span class="text-cyan">Machine Learning</span>, <span class="text-violet">Deep Learning (PyTorch)</span>, and <span class="text-emerald">Retrieval-Augmented Generation (RAG)</span>. Experienced in building end-to-end AI pipelines—from feature engineering and model training to production-ready <span class="text-cyan">FastAPI</span> microservices, <span class="text-violet">MLflow</span> tracking, and <span class="text-emerald">Docker</span> containerization.',
    copy_tag: 'Copy',
    btn_explore_projects: 'Explore AI Projects',
    btn_hire_me: 'Contact Me',
    metric_gpa: 'GPA at VNU-IS (2023–2027)',
    metric_eng: 'Advanced English Proficiency',
    metric_proj: 'End-to-End Production AI Systems',
    metric_skills: 'Core AI, Backend & MLOps Domains',
    skills_eyebrow: 'CORE COMPETENCIES',
    skills_title: 'Technical <span class="gradient-text">Skills Arsenal</span>',
    skills_subtitle:
      'Full-lifecycle AI Engineering capabilities spanning model research, data engineering, high-performance API deployment, and MLOps automation.',
    filter_all: 'All Domains (9)',
    filter_ai: 'AI, ML & Deep Learning',
    filter_data: 'Programming & Data',
    filter_backend: 'Backend & Databases',
    filter_mlops: 'MLOps, DevOps & Cloud',
    cat_programming: 'Programming',
    meta_programming: 'Core Languages',
    cat_ml: 'Machine Learning',
    meta_ml: 'Predictive Modeling & Optimization',
    cat_dl: 'Deep Learning',
    meta_dl: 'Neural Architectures',
    cat_data: 'Data Processing',
    meta_data: 'Analytics & Visualization',
    cat_backend: 'Backend',
    meta_backend: 'AI Model Serving & APIs',
    cat_db: 'Database',
    meta_db: 'Relational, NoSQL & In-Memory',
    cat_devops: 'DevOps & Tools',
    meta_devops: 'Containerization & Workflow',
    cat_mlops: 'MLOps',
    meta_mlops: 'Lifecycle & Experiment Management',
    cat_deploy: 'Deployment',
    meta_deploy: 'Automation & Cloud Delivery',
    proj_eyebrow: 'PRODUCTION-READY AI SYSTEMS',
    proj_title: 'Featured <span class="gradient-text">AI Projects</span>',
    proj_subtitle:
      'End-to-end engineering projects combining state-of-the-art Machine Learning / Deep Learning models with scalable APIs and containerized deployment.',
    proj1_pipe_title: 'SYSTEM PIPELINE ARCHITECTURE',
    proj1_b1:
      'Developed an AI-powered <strong>document question-answering system</strong> using <span class="kw kw-cyan">RAG (Retrieval-Augmented Generation)</span>.',
    proj1_b2:
      'Implemented end-to-end <span class="kw kw-violet">document parsing</span>, <span class="kw kw-violet">text chunking</span>, <span class="kw kw-cyan">embedding generation</span> and <span class="kw kw-emerald">semantic search</span>.',
    proj1_b3:
      'Integrated <span class="kw kw-cyan">FAISS</span> for high-speed, efficient <strong>vector similarity retrieval</strong> across large document collections.',
    proj1_b4:
      'Built production-grade, asynchronous <strong>RESTful APIs</strong> using <span class="kw kw-emerald">FastAPI</span> and <span class="kw">PostgreSQL</span>.',
    proj1_b5:
      'Containerized and orchestrated multi-container services using <span class="kw kw-amber">Docker Compose</span>.',
    tech_stack_label: 'TECH STACK & TOOLS',
    proj1_impact_title: 'KEY ENGINEERING HIGHLIGHTS',
    proj1_m1: 'Context-Aware Retrieval',
    proj1_m2: 'Modular Container Stack',
    proj2_pipe_title: 'MLOPS & INFERENCE PIPELINE',
    proj2_b1:
      'Developed an end-to-end <strong>machine learning pipeline</strong> for real-time <span class="kw kw-violet">fraudulent transaction detection</span>.',
    proj2_b2:
      'Applied advanced <span class="kw kw-cyan">feature engineering</span> and solved severe class imbalance using <span class="kw kw-emerald">SMOTE</span>.',
    proj2_b3:
      'Trained, tuned, and benchmarked <span class="kw kw-cyan">Random Forest</span>, <span class="kw kw-violet">XGBoost</span>, and <span class="kw kw-emerald">Neural Networks (PyTorch)</span>.',
    proj2_b4:
      'Rigorously evaluated models using <span class="kw kw-amber">Precision</span>, <span class="kw kw-amber">Recall</span>, <span class="kw kw-amber">F1-score</span>, <span class="kw kw-cyan">ROC-AUC</span>, and <span class="kw kw-emerald">PR-AUC</span>.',
    proj2_b5:
      'Integrated the champion model into a low-latency <span class="kw kw-emerald">FastAPI inference service</span> backed by <span class="kw">Redis</span> & <span class="kw">PostgreSQL</span>.',
    proj2_b6:
      'Used <span class="kw kw-violet">MLflow</span> for experiment tracking and model versioning, with full <span class="kw kw-cyan">Docker-based deployment</span>.',
    proj2_impact_title: 'EVALUATION & MLOPS METRICS',
    edu_eyebrow: 'ACADEMIC & GLOBAL READINESS',
    edu_title: 'Education & <span class="gradient-text">Languages</span>',
    edu_badge: 'EDUCATION',
    edu_school_sub: 'International School — Vietnam National University, Hanoi',
    gpa_label: 'Cumulative GPA',
    gpa_rank: 'Very Good Academic Standing',
    edu_f1: 'Artificial Intelligence',
    edu_f2: 'Data Structures & Algorithms',
    edu_f3: 'Machine Learning & MLOps',
    lang_badge: 'LANGUAGES',
    lang_en_desc: 'Professional working & technical research fluency',
    lang_vi_desc: 'Mother tongue • Full native communication',
    lang_native: 'Native',
    contact_eyebrow: "LET'S BUILD INTELLIGENT SYSTEMS TOGETHER",
    contact_title: 'Get In <span class="gradient-text">Touch</span>',
    contact_subtitle:
      'I am actively seeking <strong>AI Engineer / Machine Learning Engineer (Fresher)</strong> opportunities in Hanoi or Remote. Click any channel below to connect or copy my details instantly.',
    send_email: 'Send Email',
    copy_btn: 'Copy',
    phone_label: 'Phone / Zalo',
    call_now: 'Call Now',
    open_github: 'View Profile ↗',
    loc_label: 'Location',
    loc_ready: 'On-site / Hybrid / Remote',
  },
  vi: {
    nav_home: 'Tổng quan',
    nav_skills: 'Kỹ năng',
    nav_projects: 'Dự án AI',
    nav_edu: 'Học vấn & Ngôn ngữ',
    nav_contact: 'Liên hệ',
    btn_cv: 'In / Xuất CV',
    hero_status: 'Sẵn sàng cho vị trí AI Engineer • Hà Nội, Việt Nam',
    hero_greeting: 'Xin chào, tôi là',
    hero_summary:
      '<strong>Kỹ sư AI (AI Engineer)</strong> đam mê xây dựng các hệ thống thông minh với nền tảng vững chắc về <span class="text-cyan">Machine Learning</span>, <span class="text-violet">Deep Learning (PyTorch)</span> và <span class="text-emerald">Retrieval-Augmented Generation (RAG)</span>. Có kinh nghiệm triển khai quy trình AI End-to-End từ xử lý dữ liệu, huấn luyện mô hình đến đóng gói API hiệu năng cao với <span class="text-cyan">FastAPI</span>, quản lý thực nghiệm <span class="text-violet">MLflow</span> và <span class="text-emerald">Docker</span>.',
    copy_tag: 'Sao chép',
    btn_explore_projects: 'Xem Dự Án AI',
    btn_hire_me: 'Liên Hệ Ngay',
    metric_gpa: 'GPA tại ĐHQGHN - VNU-IS (2023–2027)',
    metric_eng: 'Tiếng Anh C1 (Advanced)',
    metric_proj: 'Hệ thống Dự án AI End-to-End',
    metric_skills: 'Nhóm Kỹ năng AI, Backend & MLOps',
    skills_eyebrow: 'NĂNG LỰC CHUYÊN MÔN',
    skills_title: 'Hệ Thống <span class="gradient-text">Kỹ Năng Kỹ Thuật</span>',
    skills_subtitle:
      'Năng lực phát triển trọn vòng đời sản phẩm AI: từ nghiên cứu mô hình, xử lý dữ liệu, xây dựng Backend API đến tự động hóa MLOps.',
    filter_all: 'Tất cả (9 nhóm)',
    filter_ai: 'AI, ML & Deep Learning',
    filter_data: 'Lập trình & Dữ liệu',
    filter_backend: 'Backend & Cơ sở dữ liệu',
    filter_mlops: 'MLOps, DevOps & Cloud',
    cat_programming: 'Programming',
    meta_programming: 'Ngôn ngữ lập trình cốt lõi',
    cat_ml: 'Machine Learning',
    meta_ml: 'Mô hình dự đoán & Tối ưu tham số',
    cat_dl: 'Deep Learning',
    meta_dl: 'Kiến trúc mạng Nơ-ron sâu',
    cat_data: 'Data Processing',
    meta_data: 'Phân tích & Trực quan hóa dữ liệu',
    cat_backend: 'Backend',
    meta_backend: 'Phục vụ Model AI & RESTful API',
    cat_db: 'Database',
    meta_db: 'SQL, NoSQL & In-Memory Cache',
    cat_devops: 'DevOps & Tools',
    meta_devops: 'Đóng gói Container & Quản lý mã nguồn',
    cat_mlops: 'MLOps',
    meta_mlops: 'Theo dõi thực nghiệm & Quản lý phiên bản Model',
    cat_deploy: 'Deployment',
    meta_deploy: 'Tích hợp liên tục & Triển khai Cloud',
    proj_eyebrow: 'DỰ ÁN THỰC CHIẾN NỔI BẬT',
    proj_title: 'Dự Án <span class="gradient-text">AI Tiêu Biểu</span>',
    proj_subtitle:
      'Các hệ thống AI hoàn chỉnh kết hợp mô hình Machine Learning / Deep Learning hiện đại với kiến trúc API tốc độ cao và triển khai Docker.',
    proj1_pipe_title: 'KIẾN TRÚC LUỒNG XỬ LÝ HỆ THỐNG RAG',
    proj1_b1:
      'Phát triển <strong>hệ thống hỏi-đáp tài liệu thông minh</strong> ứng dụng kiến trúc <span class="kw kw-cyan">RAG (Retrieval-Augmented Generation)</span>.',
    proj1_b2:
      'Triển khai trọn vẹn quy trình <span class="kw kw-violet">document parsing</span>, <span class="kw kw-violet">text chunking</span>, <span class="kw kw-cyan">embedding generation</span> và <span class="kw kw-emerald">semantic search</span>.',
    proj1_b3:
      'Tích hợp <span class="kw kw-cyan">FAISS</span> giúp truy xuất tương đồng vector (<strong>vector similarity retrieval</strong>) tốc độ cao.',
    proj1_b4:
      'Xây dựng hệ thống <strong>RESTful APIs</strong> bất đồng bộ bằng <span class="kw kw-emerald">FastAPI</span> kết nối cơ sở dữ liệu <span class="kw">PostgreSQL</span>.',
    proj1_b5:
      'Đóng gói và điều phối đa dịch vụ (multi-container services) bằng <span class="kw kw-amber">Docker Compose</span>.',
    tech_stack_label: 'CÔNG NGHỆ SỬ DỤNG',
    proj1_impact_title: 'ĐIỂM NHẤN KỸ THUẬT',
    proj1_m1: 'Truy xuất ngữ nghĩa chính xác',
    proj1_m2: 'Kiến trúc Container hóa',
    proj2_pipe_title: 'QUY TRÌNH MLOPS & SUY LUẬN THỜI GIAN THỰC',
    proj2_b1:
      'Xây dựng <strong>machine learning pipeline</strong> hoàn chỉnh phục vụ <span class="kw kw-violet">phát hiện giao dịch gian lận thời gian thực</span>.',
    proj2_b2:
      'Áp dụng <span class="kw kw-cyan">feature engineering</span> chuyên sâu và xử lý mất cân bằng dữ liệu nghiêm trọng bằng <span class="kw kw-emerald">SMOTE</span>.',
    proj2_b3:
      'Huấn luyện và so sánh hiệu năng giữa <span class="kw kw-cyan">Random Forest</span>, <span class="kw kw-violet">XGBoost</span> và <span class="kw kw-emerald">Neural Networks (PyTorch)</span>.',
    proj2_b4:
      'Đánh giá mô hình nghiêm ngặt qua các chỉ số <span class="kw kw-amber">Precision</span>, <span class="kw kw-amber">Recall</span>, <span class="kw kw-amber">F1-score</span>, <span class="kw kw-cyan">ROC-AUC</span> và <span class="kw kw-emerald">PR-AUC</span>.',
    proj2_b5:
      'Tích hợp mô hình tối ưu vào dịch vụ suy luận <span class="kw kw-emerald">FastAPI inference service</span> kết hợp <span class="kw">Redis</span> & <span class="kw">PostgreSQL</span>.',
    proj2_b6:
      'Sử dụng <span class="kw kw-violet">MLflow</span> để theo dõi thực nghiệm, quản lý phiên bản model và triển khai bằng <span class="kw kw-cyan">Docker</span>.',
    proj2_impact_title: 'THƯỚC ĐO ĐÁNH GIÁ MÔ HÌNH',
    edu_eyebrow: 'NỀN TẢNG HỌC THUẬT & NGOẠI NGỮ',
    edu_title: 'Học Vấn & <span class="gradient-text">Ngôn Ngữ</span>',
    edu_badge: 'HỌC VẤN',
    edu_school_sub: 'Trường Quốc tế — Đại học Quốc gia Hà Nội (VNU-IS)',
    gpa_label: 'Điểm trung bình tích lũy (GPA)',
    gpa_rank: 'Thành tích học tập Tốt',
    edu_f1: 'Trí tuệ nhân tạo (AI)',
    edu_f2: 'Cấu trúc dữ liệu & Giải thuật',
    edu_f3: 'Machine Learning & MLOps',
    lang_badge: 'NGÔN NGỮ',
    lang_en_desc: 'Sử dụng thành thạo trong công việc & đọc hiểu tài liệu nghiên cứu AI quốc tế',
    lang_vi_desc: 'Ngôn ngữ bản địa',
    lang_native: 'Bản ngữ (Native)',
    contact_eyebrow: 'SẴN SÀNG ĐỒNG HÀNH CÙNG ĐỘI NGŨ CỦA BẠN',
    contact_title: 'Thông Tin <span class="gradient-text">Liên Hệ</span>',
    contact_subtitle:
      'Tôi đang tìm kiếm cơ hội làm việc ở vị trí <strong>AI Engineer / Machine Learning Engineer (Fresher)</strong> tại Hà Nội hoặc Remote. Nhấn vào bất kỳ kênh nào bên dưới để kết nối ngay.',
    send_email: 'Gửi Email',
    copy_btn: 'Sao chép',
    phone_label: 'Điện thoại / Zalo',
    call_now: 'Gọi ngay',
    open_github: 'Mở GitHub ↗',
    loc_label: 'Địa điểm',
    loc_ready: 'On-site / Hybrid / Remote',
  },
};

function initLanguageToggle() {
  const langBtn = document.getElementById('lang-toggle');
  if (!langBtn) return;

  const opts = langBtn.querySelectorAll('.lang-opt');

  langBtn.addEventListener('click', () => {
    currentLang = currentLang === 'en' ? 'vi' : 'en';
    document.documentElement.lang = currentLang;

    opts.forEach((opt) => {
      opt.classList.toggle('active', opt.getAttribute('data-lang') === currentLang);
    });

    const dict = translations[currentLang];
    document.querySelectorAll('[data-i18n]').forEach((el) => {
      const key = el.getAttribute('data-i18n');
      if (dict[key]) {
        el.innerHTML = dict[key];
      }
    });
  });
}

/* ==========================================================================
   8. MOBILE MENU & PRINT CV BUTTON
   ========================================================================== */
function initMobileMenuAndPrint() {
  const menuBtn = document.getElementById('mobile-menu-btn');
  const navLinks = document.getElementById('nav-links');
  const printBtn = document.getElementById('print-btn');

  if (menuBtn && navLinks) {
    menuBtn.addEventListener('click', () => {
      navLinks.classList.toggle('open');
    });

    navLinks.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
      });
    });
  }

  if (printBtn) {
    printBtn.addEventListener('click', () => {
      window.print();
    });
  }
}

