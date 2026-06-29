/* ==========================================
   Mazen Ismail Ali - Interactive JS Core
   Theme: Business Intelligence Console
========================================== */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialise Lucide Icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // 2. Real-time Status Gauges (Clock, Ping, CPU Load)
    initSystemGauges();

    // 3. Dynamic Node Canvas Background
    initNodeBackground();

    // 4. Floating Navbar & Tab Router
    initTabRouter();

    // 5. Dynamic KPI Roll-ups & Mini Sparklines
    initKpiCounters();

    // 6. Interactive Shell Terminal (CLI Console)
    initCliTerminal();

    // 7. Capability & Skills Category Toggler
    initSkillsConsole();

    // 8. Power BI Simulator (Projects Viewer + Cohort Slicer)
    initBiSimulator();

    // 9. Scroll-Triggered Data Storytelling
    initStorytelling();

    // 10. GitHub Analytics Center Setup
    initGithubAnalytics();

    // 11. Secure Contact Transmission Form
    initContactForm();
});

/* ==========================================
   SYSTEM GAUGES
========================================== */
function initSystemGauges() {
    // System Clock
    const clock = document.getElementById('live-clock');
    if (clock) {
        setInterval(() => {
            const now = new Date();
            clock.textContent = now.toTimeString().split(' ')[0];
        }, 1000);
    }

    // Simulated Ping & CPU
    const pingEl = document.getElementById('ping-metric');
    const cpuEl = document.getElementById('cpu-metric');
    
    if (pingEl && cpuEl) {
        setInterval(() => {
            const randPing = Math.floor(Math.random() * 8) + 8; // 8 - 15ms
            const randCpu = (Math.random() * 3 + 1.2).toFixed(1); // 1.2% - 4.2%
            pingEl.textContent = `${randPing} ms`;
            cpuEl.textContent = `${randCpu}%`;
        }, 4000);
    }
}

/* ==========================================
   NODE CANVAS BACKGROUND
========================================== */
function initNodeBackground() {
    const canvas = document.getElementById('dashboard-node-bg');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    window.addEventListener('resize', () => {
        width = (canvas.width = window.innerWidth);
        height = (canvas.height = window.innerHeight);
    });

    const particles = [];
    const particleCount = Math.min(60, Math.floor((width * height) / 25000));
    const mouse = { x: null, y: null, radius: 150 };

    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });

    window.addEventListener('mouseleave', () => {
        mouse.x = null;
        mouse.y = null;
    });

    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.vx = (Math.random() - 0.5) * 0.4;
            this.vy = (Math.random() - 0.5) * 0.4;
            this.radius = Math.random() * 2 + 1;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            if (this.x < 0 || this.x > width) this.vx *= -1;
            if (this.y < 0 || this.y > height) this.vy *= -1;

            // Pull towards mouse slightly
            if (mouse.x && mouse.y) {
                const dx = mouse.x - this.x;
                const dy = mouse.y - this.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < mouse.radius) {
                    const force = (mouse.radius - dist) / mouse.radius;
                    this.x -= (dx / dist) * force * 0.5;
                    this.y -= (dy / dist) * force * 0.5;
                }
            }
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = '#00f2fe';
            ctx.fill();
        }
    }

    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);

        particles.forEach((p) => {
            p.update();
            p.draw();
        });

        // Draw connections
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 100) {
                    const alpha = (100 - dist) / 100 * 0.15;
                    ctx.strokeStyle = `rgba(0, 242, 254, ${alpha})`;
                    ctx.lineWidth = 0.5;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }

        requestAnimationFrame(animate);
    }

    animate();
}

/* ==========================================
   TAB ROUTER
========================================== */
function initTabRouter() {
    const navItems = document.querySelectorAll('.nav-item');
    const sections = document.querySelectorAll('.dashboard-section');

    navItems.forEach((item) => {
        item.addEventListener('click', (e) => {
            const targetId = item.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);

            if (targetSection) {
                e.preventDefault();
                
                // Toggle active menu tags
                navItems.forEach((nav) => nav.classList.remove('active'));
                item.classList.add('active');

                // Toggle active workspace sections
                sections.forEach((sec) => sec.classList.remove('active-section'));
                targetSection.classList.add('active-section');

                // If about or capabilities tabs are opened, trigger bar animations
                if (targetId === 'capabilities') {
                    animateSkillBars();
                }

                // Smooth scroll to top of workspace
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        });
    });

    // Auto update scroll behavior navbar size
    window.addEventListener('scroll', () => {
        const nav = document.getElementById('floating-navbar');
        if (nav) {
            if (window.scrollY > 40) {
                nav.classList.add('scrolled');
            } else {
                nav.classList.remove('scrolled');
            }
        }
    });
}

/* ==========================================
   KPI COUNTERS & SPARKLINES
========================================== */
function initKpiCounters() {
    const counters = document.querySelectorAll('.counter');
    const floatCounters = document.querySelectorAll('.counter-float');

    // Run counting animation
    counters.forEach((c) => {
        const target = parseInt(c.getAttribute('data-target'));
        let current = 0;
        const step = Math.max(1, Math.floor(target / 40));
        const timer = setInterval(() => {
            current += step;
            if (current >= target) {
                c.textContent = target;
                clearInterval(timer);
            } else {
                c.textContent = current;
            }
        }, 30);
    });

    floatCounters.forEach((fc) => {
        const target = parseFloat(fc.getAttribute('data-target'));
        let current = 0.0;
        const timer = setInterval(() => {
            current += 0.1;
            if (current >= target) {
                fc.textContent = target.toFixed(1);
                clearInterval(timer);
            } else {
                fc.textContent = current.toFixed(1);
            }
        }, 40);
    });

    // Draw KPI mini Sparklines
    const config = {
        type: 'line',
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false }, tooltip: { enabled: false } },
            scales: { x: { display: false }, y: { display: false } },
            elements: { point: { radius: 0 }, line: { borderWidth: 1.5 } }
        }
    };

    const datasets = [
        { id: 'mini-chart-projects', data: [1, 2, 2, 3, 3, 4], color: '#00f2fe' },
        { id: 'mini-chart-datasets', data: [1, 3, 2, 4, 3, 5], color: '#7f00ff' },
        { id: 'mini-chart-dashboards', data: [0, 1, 1, 2, 2, 3], color: '#4facfe' },
        { id: 'mini-chart-gpa', data: [3.0, 3.1, 3.1, 3.2, 3.2, 3.2], color: '#39ff14' }
    ];

    datasets.forEach((item) => {
        const el = document.getElementById(item.id);
        if (el) {
            new Chart(el.getContext('2d'), {
                ...config,
                data: {
                    labels: ['', '', '', '', '', ''],
                    datasets: [{
                        data: item.data,
                        borderColor: item.color,
                        backgroundColor: 'transparent',
                        fill: false
                    }]
                }
            });
        }
    });
}

/* ==========================================
   INTERACTIVE CLI TERMINAL
========================================== */
function initCliTerminal() {
    const form = document.getElementById('terminal-form');
    const input = document.getElementById('terminal-input');
    const history = document.getElementById('terminal-history');

    if (!form || !input || !history) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const value = input.value.trim().toLowerCase();
        input.value = '';

        if (!value) return;

        // Log entry
        appendHistory(`> ${value}`, 'cli-info');

        // Parse commands
        switch (value) {
            case '/help':
                appendHistory('Available Commands:', 'text-cyan');
                appendHistory('  /about       - Display executive profile brief');
                appendHistory('  /skills      - Redirect to analytical stack details');
                appendHistory('  /projects    - Switch to dashboard sandbox view');
                appendHistory('  /impact      - View corporate efficiency impacts');
                appendHistory('  /contact     - Jump to contact command center');
                appendHistory('  /clear       - Flush terminal logs');
                break;
            case '/about':
                appendHistory('Profile: Third-Year Computers & Data Science undergraduate focused on Business Intelligence architectures & Decision Systems.', 't-output');
                navigateToSection('about');
                break;
            case '/skills':
                appendHistory('Opening Capabilities matrix...', 't-output');
                navigateToSection('capabilities');
                break;
            case '/projects':
                appendHistory('Launching BI Simulator engine...', 't-output');
                navigateToSection('projects');
                break;
            case '/impact':
                appendHistory('Retrieving efficiency metrics logs...', 't-output');
                navigateToSection('experience');
                break;
            case '/contact':
                appendHistory('Opening terminal email form...', 't-output');
                navigateToSection('contact');
                break;
            case '/clear':
                history.innerHTML = '<p class="cli-info">Terminal log flushed. Enter commands below.</p>';
                break;
            default:
                appendHistory(`Command syntax not recognized: "${value}". Type /help for options.`, 'text-purple');
        }

        // Auto-scroll terminal log
        history.scrollTop = history.scrollHeight;
    });

    function appendHistory(text, cssClass = '') {
        const p = document.createElement('p');
        p.className = cssClass;
        p.textContent = text;
        history.appendChild(p);
    }

    function navigateToSection(id) {
        const targetNav = document.querySelector(`.nav-item[href="#${id}"]`);
        if (targetNav) targetNav.click();
    }
}

/* ==========================================
   CAPABILITIES & SKILLS CONSOLE
========================================== */
function initSkillsConsole() {
    const tabs = document.querySelectorAll('.skill-tab');
    const grids = document.querySelectorAll('.skills-grid');

    tabs.forEach((tab) => {
        tab.addEventListener('click', () => {
            const category = tab.getAttribute('data-category');

            tabs.forEach((t) => t.classList.remove('active'));
            tab.classList.add('active');

            grids.forEach((grid) => {
                grid.classList.add('hide');
                if (grid.getAttribute('id') === `skills-${category}`) {
                    grid.classList.remove('hide');
                }
            });

            animateSkillBars();
        });
    });
}

function animateSkillBars() {
    const visibleBars = document.querySelectorAll('.skills-grid:not(.hide) .skill-bar-inner');
    visibleBars.forEach((bar) => {
        const targetWidth = bar.parentElement.previousElementSibling.querySelector('.skill-pct').textContent;
        bar.style.width = '0%';
        setTimeout(() => {
            bar.style.width = targetWidth;
        }, 100);
    });
}

/* ==========================================
   POWER BI SIMULATOR (PROJECTS ENGINE)
========================================== */
let activeCharts = {};

function initBiSimulator() {
    const tabs = document.querySelectorAll('.pbi-page-tab');
    const views = document.querySelectorAll('.pbi-project-view');
    const slicer = document.getElementById('cohort-filter');

    if (!tabs || !views || !slicer) return;

    // Switch report tab page
    tabs.forEach((tab) => {
        tab.addEventListener('click', () => {
            const project = tab.getAttribute('data-project');

            tabs.forEach((t) => t.classList.remove('active'));
            tab.classList.add('active');

            views.forEach((v) => {
                v.classList.add('hide-view');
                if (v.getAttribute('id') === `${project}-view`) {
                    v.classList.remove('hide-view');
                }
            });

            // Re-render project charts when tab changes to avoid dimensions errors
            renderProjectCharts(project, slicer.value);
        });
    });

    // Handle Cohort Selector Slicer Update
    slicer.addEventListener('change', () => {
        const activeTab = document.querySelector('.pbi-page-tab.active');
        if (activeTab) {
            const project = activeTab.getAttribute('data-project');
            updateKpiMetrics(project, slicer.value);
            renderProjectCharts(project, slicer.value);
        }
    });

    // Default load first project charts
    renderProjectCharts('project1', 'all');
}

// Chart definitions datasets
const chartDataWarehouse = {
    project1: {
        all: {
            kpis: { attrition: '16.1%', active: '1,233', tenure: '3.7 Yrs' },
            labels1: ['R&D', 'Sales', 'HR', 'Logistics'],
            values1: [8, 14, 4, 9],
            labels2: ['&lt;1 Yr', '1-2 Yrs', '3-5 Yrs', '5+ Yrs'],
            values2: [25, 43, 12, 6]
        },
        q1: {
            kpis: { attrition: '14.2%', active: '1,241', tenure: '3.8 Yrs' },
            labels1: ['R&D', 'Sales', 'HR', 'Logistics'],
            values1: [6, 11, 2, 7],
            labels2: ['&lt;1 Yr', '1-2 Yrs', '3-5 Yrs', '5+ Yrs'],
            values2: [20, 35, 10, 5]
        },
        q2: {
            kpis: { attrition: '18.4%', active: '1,220', tenure: '3.5 Yrs' },
            labels1: ['R&D', 'Sales', 'HR', 'Logistics'],
            values1: [10, 18, 5, 11],
            labels2: ['&lt;1 Yr', '1-2 Yrs', '3-5 Yrs', '5+ Yrs'],
            values2: [30, 50, 15, 8]
        }
    },
    project2: {
        all: {
            kpis: { revenue: '$342.5K', transactions: '18.4K', category: 'Espresso' },
            labels1: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            values1: [48, 52, 61, 58, 63, 60],
            labels2: ['Espresso', 'Lattes', 'Cold Brews', 'Teas', 'Bakery'],
            values2: [38, 24, 18, 10, 10]
        },
        q1: {
            kpis: { revenue: '$161.2K', transactions: '8.9K', category: 'Lattes' },
            labels1: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            values1: [48, 52, 61, 0, 0, 0],
            labels2: ['Espresso', 'Lattes', 'Cold Brews', 'Teas', 'Bakery'],
            values2: [32, 28, 15, 12, 13]
        },
        q2: {
            kpis: { revenue: '$181.3K', transactions: '9.5K', category: 'Espresso' },
            labels1: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            values1: [0, 0, 0, 58, 63, 60],
            labels2: ['Espresso', 'Lattes', 'Cold Brews', 'Teas', 'Bakery'],
            values2: [44, 20, 21, 8, 7]
        }
    },
    project3: {
        all: {
            kpis: { gross: '$2.84M', profit: '$689K', top: 'Branch North' },
            labels1: ['Branch North', 'Branch East', 'Branch South', 'Branch West'],
            values1: [28, 22, 26, 14],
            labels2: ['Q1', 'Q2', 'Q3', 'Q4'],
            values2: [620, 710, 780, 730]
        },
        q1: {
            kpis: { gross: '$1.33M', profit: '$310K', top: 'Branch North' },
            labels1: ['Branch North', 'Branch East', 'Branch South', 'Branch West'],
            values1: [30, 20, 27, 13],
            labels2: ['Q1', 'Q2', 'Q3', 'Q4'],
            values2: [620, 710, 0, 0]
        },
        q2: {
            kpis: { gross: '$1.51M', profit: '$379K', top: 'Branch South' },
            labels1: ['Branch North', 'Branch East', 'Branch South', 'Branch West'],
            values1: [26, 24, 25, 15],
            labels2: ['Q1', 'Q2', 'Q3', 'Q4'],
            values2: [0, 0, 780, 730]
        }
    },
    project4: {
        all: {
            kpis: { rate: '22.4%', profiles: '843', ltv: '$1.2M' },
            labels1: ['M2M Contract', '1-Yr Commit', '2-Yr Commit'],
            values1: [48, 14, 6],
            labels2: ['Billing Issues', 'Support Load', 'Speed Drop', 'Competitor Tier'],
            values2: [42, 28, 18, 12]
        },
        q1: {
            kpis: { rate: '19.8%', profiles: '390', ltv: '$0.52M' },
            labels1: ['M2M Contract', '1-Yr Commit', '2-Yr Commit'],
            values1: [42, 12, 5],
            labels2: ['Billing Issues', 'Support Load', 'Speed Drop', 'Competitor Tier'],
            values2: [38, 30, 20, 12]
        },
        q2: {
            kpis: { rate: '25.0%', profiles: '453', ltv: '$0.68M' },
            labels1: ['M2M Contract', '1-Yr Commit', '2-Yr Commit'],
            values1: [54, 16, 7],
            labels2: ['Billing Issues', 'Support Load', 'Speed Drop', 'Competitor Tier'],
            values2: [46, 26, 16, 12]
        }
    }
};

function updateKpiMetrics(project, cohort) {
    const data = chartDataWarehouse[project][cohort].kpis;
    if (project === 'project1') {
        document.getElementById('pbi-hr-attrition-rate').textContent = data.attrition;
        document.getElementById('pbi-hr-active-emp').textContent = data.active;
        document.getElementById('pbi-hr-avg-age').textContent = data.tenure;
    } else if (project === 'project2') {
        document.getElementById('pbi-cafe-revenue').textContent = data.revenue;
        document.getElementById('pbi-cafe-transactions').textContent = data.transactions;
        document.getElementById('pbi-cafe-top-cat').textContent = data.category;
    } else if (project === 'project3') {
        document.getElementById('pbi-sales-gross').textContent = data.gross;
        document.getElementById('pbi-sales-profit').textContent = data.profit;
        document.getElementById('pbi-sales-top-branch').textContent = data.top;
    } else if (project === 'project4') {
        document.getElementById('pbi-churn-rate').textContent = data.rate;
        document.getElementById('pbi-churn-risk-users').textContent = data.profiles;
        document.getElementById('pbi-churn-ltv').textContent = data.ltv;
    }
}

function renderProjectCharts(project, cohort) {
    const data = chartDataWarehouse[project][cohort];

    // Destroy active charts in this project slot if they exist to prevent memory leaks
    if (activeCharts[`${project}_1`]) activeCharts[`${project}_1`].destroy();
    if (activeCharts[`${project}_2`]) activeCharts[`${project}_2`].destroy();

    const canvas1 = document.getElementById(`${project}-chart1`);
    const canvas2 = document.getElementById(`${project}-chart2`);

    if (!canvas1 || !canvas2) return;

    const ctx1 = canvas1.getContext('2d');
    const ctx2 = canvas2.getContext('2d');

    const barGradient = ctx1.createLinearGradient(0, 0, 0, 200);
    barGradient.addColorStop(0, '#00f2fe');
    barGradient.addColorStop(1, 'rgba(0, 242, 254, 0.05)');

    const lineGradient = ctx1.createLinearGradient(0, 0, 0, 200);
    lineGradient.addColorStop(0, 'rgba(127, 0, 255, 0.3)');
    lineGradient.addColorStop(1, 'rgba(127, 0, 255, 0.0)');

    if (project === 'project1') {
        activeCharts[`${project}_1`] = new Chart(ctx1, {
            type: 'bar',
            data: {
                labels: data.labels1,
                datasets: [{
                    label: 'Attrition Drivers %',
                    data: data.values1,
                    backgroundColor: barGradient,
                    borderColor: '#00f2fe',
                    borderWidth: 1.5,
                    borderRadius: 4
                }]
            },
            options: getChartOptions('Department Attrition Rate (%)')
        });

        activeCharts[`${project}_2`] = new Chart(ctx2, {
            type: 'doughnut',
            data: {
                labels: data.labels2,
                datasets: [{
                    data: data.values2,
                    backgroundColor: ['#ff5f56', '#7f00ff', '#4facfe', '#00f2fe'],
                    borderColor: 'rgba(5, 8, 17, 0.8)',
                    borderWidth: 2
                }]
            },
            options: getDoughnutOptions()
        });
    } else if (project === 'project2') {
        activeCharts[`${project}_1`] = new Chart(ctx1, {
            type: 'line',
            data: {
                labels: data.labels1,
                datasets: [{
                    label: 'Revenue Trend ($K)',
                    data: data.values1,
                    borderColor: '#00f2fe',
                    backgroundColor: lineGradient,
                    borderWidth: 2.5,
                    fill: true,
                    tension: 0.4
                }]
            },
            options: getChartOptions('Monthly Revenue Velocity')
        });

        activeCharts[`${project}_2`] = new Chart(ctx2, {
            type: 'doughnut',
            data: {
                labels: data.labels2,
                datasets: [{
                    data: data.values2,
                    backgroundColor: ['#00f2fe', '#4facfe', '#7f00ff', '#39ff14', '#ff9900'],
                    borderColor: 'rgba(5, 8, 17, 0.8)'
                }]
            },
            options: getDoughnutOptions()
        });
    } else if (project === 'project3') {
        activeCharts[`${project}_1`] = new Chart(ctx1, {
            type: 'bar',
            data: {
                labels: data.labels1,
                datasets: [{
                    label: 'Profit Margin %',
                    data: data.values1,
                    backgroundColor: barGradient,
                    borderColor: '#00f2fe',
                    borderWidth: 1
                }]
            },
            options: getChartOptions('Regional Performance Margins')
        });

        activeCharts[`${project}_2`] = new Chart(ctx2, {
            type: 'line',
            data: {
                labels: data.labels2,
                datasets: [{
                    label: 'Quarterly Net Profit ($K)',
                    data: data.values2,
                    borderColor: '#7f00ff',
                    backgroundColor: 'transparent',
                    borderWidth: 2,
                    tension: 0.1
                }]
            },
            options: getChartOptions('Net Target Growth Log')
        });
    } else if (project === 'project4') {
        activeCharts[`${project}_1`] = new Chart(ctx1, {
            type: 'bar',
            data: {
                labels: data.labels1,
                datasets: [{
                    label: 'Churn %',
                    data: data.values1,
                    backgroundColor: ['rgba(255, 95, 86, 0.75)', 'rgba(127, 0, 255, 0.75)', 'rgba(0, 242, 254, 0.75)'],
                    borderColor: '#ff5f56',
                    borderWidth: 1
                }]
            },
            options: getChartOptions('Contract Vector Churn Vulnerability')
        });

        activeCharts[`${project}_2`] = new Chart(ctx2, {
            type: 'doughnut',
            data: {
                labels: data.labels2,
                datasets: [{
                    data: data.values2,
                    backgroundColor: ['#ff5f56', '#ff9900', '#7f00ff', '#00f2fe'],
                    borderColor: 'rgba(5, 8, 17, 0.8)'
                }]
            },
            options: getDoughnutOptions()
        });
    }
}

// Chart options generator
function getChartOptions(yAxisLabel = '') {
    return {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: {
                backgroundColor: 'rgba(5, 8, 17, 0.95)',
                titleFont: { family: 'JetBrains Mono' },
                bodyFont: { family: 'JetBrains Mono' },
                borderColor: 'rgba(0, 242, 254, 0.2)',
                borderWidth: 1
            }
        },
        scales: {
            x: {
                grid: { color: 'rgba(255,255,255,0.02)' },
                ticks: { color: '#94a3b8', font: { family: 'JetBrains Mono', size: 9 } }
            },
            y: {
                title: { display: !!yAxisLabel, text: yAxisLabel, color: '#64748b', font: { size: 9 } },
                grid: { color: 'rgba(255,255,255,0.02)' },
                ticks: { color: '#94a3b8', font: { family: 'JetBrains Mono', size: 9 } }
            }
        }
    };
}

function getDoughnutOptions() {
    return {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'right',
                labels: {
                    color: '#94a3b8',
                    font: { family: 'Inter', size: 9 },
                    boxWidth: 8,
                    padding: 8
                }
            },
            tooltip: {
                backgroundColor: 'rgba(5, 8, 17, 0.95)',
                titleFont: { family: 'JetBrains Mono' },
                bodyFont: { family: 'JetBrains Mono' }
            }
        }
    };
}

/* ==========================================
   SCROLL-TRIGGERED STORYTELLING
========================================== */
function initStorytelling() {
    const scrollPane = document.querySelector('.story-scroll-pane');
    const slides = document.querySelectorAll('.story-insight-slide');
    const visualTitle = document.getElementById('story-visual-title');
    const canvas = document.getElementById('storytelling-chart');

    if (!scrollPane || !slides || !canvas || !visualTitle) return;

    const ctx = canvas.getContext('2d');
    
    // Dynamic chart that will update as the user scrolls
    const storyChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Month-to-Month', '1-Year Contract', '2-Year Contract'],
            datasets: [{
                label: 'Churn Risk Scale %',
                data: [42, 14, 6],
                backgroundColor: ['#ff5f56', '#7f00ff', '#00f2fe'],
                borderColor: 'rgba(255, 255, 255, 0.05)',
                borderWidth: 1
            }]
        },
        options: getChartOptions('Churn Threat Distribution')
    });

    const slideData = [
        {
            title: 'Global Churn Distribution',
            labels: ['M2M Contract', '1-Yr Commit', '2-Yr Commit'],
            data: [48, 14, 6],
            colors: ['#ff5f56', '#7f00ff', '#00f2fe']
        },
        {
            title: 'Risk Probabilities by Billing Issue',
            labels: ['Billing Delays', 'Visual Bugs', 'Bandwidth Lag', 'Support Block'],
            data: [67, 45, 22, 10],
            colors: ['#7f00ff', '#4facfe', '#00f2fe', '#39ff14']
        },
        {
            title: 'Salvaged Customer Life Time Value',
            labels: ['Retained Target', 'Unmitigated Churn', 'Risk Horizon'],
            data: [240, 80, 110],
            colors: ['#39ff14', '#ff5f56', '#ff9900']
        }
    ];

    // Scroll listener on the scrollpane
    scrollPane.addEventListener('scroll', () => {
        let activeIndex = 0;
        let maxVisibleHeight = 0;

        slides.forEach((slide, idx) => {
            const rect = slide.getBoundingClientRect();
            const parentRect = scrollPane.getBoundingClientRect();
            
            // Calculate visible overlap height
            const visibleTop = Math.max(rect.top, parentRect.top);
            const visibleBottom = Math.min(rect.bottom, parentRect.bottom);
            const overlap = Math.max(0, visibleBottom - visibleTop);

            if (overlap > maxVisibleHeight) {
                maxVisibleHeight = overlap;
                activeIndex = idx;
            }
        });

        // Set active slide styles
        slides.forEach((s, idx) => {
            if (idx === activeIndex) {
                s.classList.add('active-slide');
            } else {
                s.classList.remove('active-slide');
            }
        });

        // Update the storytelling chart dynamically
        const currentStory = slideData[activeIndex];
        if (visualTitle.textContent !== currentStory.title) {
            visualTitle.textContent = currentStory.title;
            
            storyChart.data.labels = currentStory.labels;
            storyChart.data.datasets[0].data = currentStory.data;
            storyChart.data.datasets[0].backgroundColor = currentStory.colors;
            storyChart.update('active');
        }
    });
}

/* ==========================================
   GITHUB ANALYTICS CENTER
========================================== */
function initGithubAnalytics() {
    const heatGrid = document.getElementById('github-heatmap-grid');
    const langCanvas = document.getElementById('github-lang-chart');

    if (!heatGrid || !langCanvas) return;

    // Create Contribution Grid (Heatmap)
    // 26 columns x 7 rows = 182 cells
    for (let c = 0; c < 182; c++) {
        const cell = document.createElement('div');
        // Randomly distribute contribution shades
        const rand = Math.random();
        let lvl = 0;
        if (rand > 0.85) lvl = 4;
        else if (rand > 0.70) lvl = 3;
        else if (rand > 0.50) lvl = 2;
        else if (rand > 0.25) lvl = 1;

        cell.className = `heatmap-cell lvl-${lvl}`;
        cell.title = `Contribution level: ${lvl}`;
        heatGrid.appendChild(cell);
    }

    // Repository Language Mix Doughnut
    new Chart(langCanvas.getContext('2d'), {
        type: 'doughnut',
        data: {
            labels: ['SQL', 'Python', 'Power BI (DAX/M)', 'R', 'C++', 'Java'],
            datasets: [{
                data: [40, 30, 15, 5, 5, 5],
                backgroundColor: [
                    '#00f2fe', // SQL
                    '#7f00ff', // Python
                    '#4facfe', // Power BI
                    '#ff9900', // R
                    '#39ff14', // C++
                    '#ff5f56'  // Java
                ],
                borderWidth: 1.5,
                borderColor: 'rgba(5, 8, 17, 0.8)'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'right',
                    labels: { color: '#94a3b8', font: { size: 8 }, boxWidth: 6, padding: 6 }
                }
            }
        }
    });
}

/* ==========================================
   CONTACT SECURE TRANSMISSION FORM
========================================== */
function initContactForm() {
    const form = document.getElementById('contact-form');
    const status = document.getElementById('form-status');
    const btn = document.getElementById('contact-submit-btn');

    if (!form || !status || !btn) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        // Lock form inputs
        btn.disabled = true;
        btn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> TRANSMITTING_DATA_STREAM...';
        status.className = 'form-status-log';
        status.textContent = 'SECURE SSL HANDSHAKE IN PROGRESS...';

        setTimeout(() => {
            status.textContent = 'ENCRYPTING PAYLOAD (AES-256)...';
            
            setTimeout(() => {
                status.className = 'form-status-log success';
                status.textContent = 'ONLINE RESPONSE // TRANSMISSION SUCCESSFUL (HTTP_200)';
                btn.innerHTML = '<i data-lucide="check"></i> TRANSMITTED';
                
                // Refresh Lucide Icons inside button
                if (typeof lucide !== 'undefined') {
                    lucide.createIcons();
                }

                // Clear input fields
                form.reset();

                // Re-enable form after a short interval
                setTimeout(() => {
                    btn.disabled = false;
                    btn.innerHTML = '<i data-lucide="send"></i> TRANSMIT_PAYLOAD()';
                    if (typeof lucide !== 'undefined') lucide.createIcons();
                }, 4000);

            }, 1500);

        }, 1200);
    });
}
