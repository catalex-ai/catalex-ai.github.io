// Mark JS-enabled so CSS can hide fade-in elements before reveal
document.documentElement.classList.add('js');

// Scroll fade-in animation
(function() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    document.addEventListener('DOMContentLoaded', () => {
        document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
    });
})();

// Counter animation for [data-counter] elements
(function() {
    const easeOut = t => 1 - Math.pow(1 - t, 3);
    function animateCounter(el) {
        const target = parseInt(el.getAttribute('data-counter'), 10);
        if (isNaN(target)) return;
        const duration = 1800;
        const start = performance.now();
        function tick(now) {
            const t = Math.min(1, (now - start) / duration);
            const v = Math.round(easeOut(t) * target);
            el.textContent = v;
            if (t < 1) requestAnimationFrame(tick);
            else el.textContent = target;
        }
        requestAnimationFrame(tick);
    }
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    document.addEventListener('DOMContentLoaded', () => {
        document.querySelectorAll('[data-counter]').forEach(el => observer.observe(el));
    });
})();

// Stagger reveal — adds .stagger-in to children of [data-stagger] when section enters viewport
(function() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('staggered');
                const children = entry.target.children;
                Array.from(children).forEach((child, i) => {
                    child.style.animationDelay = `${i * 90}ms`;
                    child.classList.add('stagger-in');
                });
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });
    document.addEventListener('DOMContentLoaded', () => {
        document.querySelectorAll('[data-stagger]').forEach(el => observer.observe(el));
    });
})();

// Mobile nav hamburger toggle
(function() {
    const toggle = document.getElementById('navToggle');
    const links = document.getElementById('navLinks');
    if (!toggle || !links) return;
    toggle.addEventListener('click', () => {
        const isOpen = links.classList.toggle('open');
        toggle.classList.toggle('open', isOpen);
        toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
    // Close on link click
    links.querySelectorAll('a').forEach(a => {
        a.addEventListener('click', () => {
            links.classList.remove('open');
            toggle.classList.remove('open');
            toggle.setAttribute('aria-expanded', 'false');
        });
    });
})();

// Subtle parallax for [data-parallax] — translates Y based on scroll position
(function() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    // Disable parallax on small viewports — too jarring on mobile
    if (window.matchMedia('(max-width: 900px)').matches) return;
    const els = [];
    document.addEventListener('DOMContentLoaded', () => {
        document.querySelectorAll('[data-parallax]').forEach(el => {
            els.push({
                el,
                speed: parseFloat(el.getAttribute('data-parallax')) || 0.15
            });
        });
        if (!els.length) return;
        function update() {
            const scrollY = window.scrollY;
            els.forEach(({el, speed}) => {
                const rect = el.getBoundingClientRect();
                const center = rect.top + rect.height / 2 - window.innerHeight / 2;
                el.style.setProperty('--parallax-y', `${-center * speed}px`);
            });
        }
        window.addEventListener('scroll', update, { passive: true });
        update();
    });
})();

// Navbar scroll state
(function() {
  const nav = document.querySelector('.navbar');
  if (!nav) return;
  const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 8);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

// Typewriter Effect - cycles through phrases
(function() {
    const phrases = ['needs to use AI.', 'works with AI.', 'ships with AI.', 'gets work done.'];
    const el = document.getElementById('typewriter');
    if (!el) return;

    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let timeout;

    function type() {
        const current = phrases[phraseIndex];
        if (isDeleting) {
            const next = current.substring(0, charIndex - 1);
            el.textContent = next.length === 0 ? '\u00a0' : next;
            charIndex--;
        } else {
            el.textContent = current.substring(0, charIndex + 1);
            charIndex++;
        }

        el.style.borderRight = '2px solid #2D4A53';
        el.style.animation = 'blink-caret 0.75s step-end infinite';

        let delay = isDeleting ? 20 : 50;

        if (!isDeleting && charIndex === current.length) {
            delay = 2000;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            delay = 400;
        }

        timeout = setTimeout(type, delay);
    }

    // Start after a brief delay
    setTimeout(type, 500);
})();

// Routing Logic
function checkRoute() {
    const hash = window.location.hash;
    const homepage = document.getElementById('homepage');
    const getStarted = document.getElementById('get-started');
    const vision = document.getElementById('vision');

    // Hide all pages
    homepage.classList.remove('active');
    getStarted.classList.remove('active');
    if (vision) vision.classList.remove('active');

    if (hash === '#/forms/get-started' || hash === '#/forms/get-started/') {
        getStarted.classList.add('active');
        currentStep = 0;
        updateProgress();
    } else if (hash === '#/vision' || hash === '#/vision/') {
        if (vision) {
            vision.classList.add('active');
            initVisionAnimations();
        }
    } else {
        homepage.classList.add('active');
    }
}

window.addEventListener('hashchange', checkRoute);
window.addEventListener('load', checkRoute);

// Modal Logic
window.openDemoModal = function () {
    const modal = document.getElementById('demoModal');
    document.getElementById('demoInitialView').style.display = 'block';
    document.getElementById('demoSuccessView').style.display = 'none';
    modal.style.display = 'flex';
    setTimeout(() => modal.classList.add('active'), 10);
};

window.closeDemoModal = function () {
    const modal = document.getElementById('demoModal');
    modal.classList.remove('active');
    setTimeout(() => modal.style.display = 'none', 400);
};

const DEMO_FORM_URL = 'https://script.google.com/macros/s/AKfycbx09AfKPG6Lpp3hvmciiALLOHIvByppAUUWKjeKxrCTPZAZ3itorFVvam2M-Fh6UidE/exec';

// Demo Form Submission
document.getElementById('demoForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const form = e.target;
    const btn = form.querySelector('button');
    const formData = {
        name: document.getElementById('demoName').value,
        email: document.getElementById('demoEmail').value,
        role: document.getElementById('demoRole').value,
        type: 'demo_request',
        timestamp: new Date().toISOString()
    };

    btn.disabled = true;
    btn.innerHTML = 'Sending...';

    try {
        await fetch(DEMO_FORM_URL, {
            method: 'POST',
            mode: 'no-cors',
            cache: 'no-cache',
            headers: { 'Content-Type': 'text/plain' },
            body: JSON.stringify(formData)
        });

        // Show inline success message
        document.getElementById('demoInitialView').style.display = 'none';
        document.getElementById('demoSuccessView').style.display = 'block';
        form.reset();

        // Auto-close after 3 seconds
        setTimeout(window.closeDemoModal, 3000);

    } catch (error) {
        console.error('Demo submission error:', error);
        alert('Something went wrong. Please try again.');
    } finally {
        btn.disabled = false;
        btn.innerHTML = 'Request Demo';
    }
});

// Questionnaire Logic (mostly unchanged but ensures it only runs when get-started is active)
const FORM_URL = 'https://script.google.com/macros/s/AKfycbx09AfKPG6Lpp3hvmciiALLOHIvByppAUUWKjeKxrCTPZAZ3itorFVvam2M-Fh6UidE/exec';

let currentStep = 0;
const totalSteps = 8;
let isTransitioning = false;
const form = document.getElementById('questionnaireForm');
const nextBtn = document.getElementById('nextBtn');
const errorMsg = document.getElementById('errorMsg');
const currentStepText = document.getElementById('currentStepText');
const navFooter = document.getElementById('navFooter');

const prevBtn = document.getElementById('prevBtn');

function updateProgress() {
    if (!currentStepText) return;
    currentStepText.textContent = currentStep;
    if (currentStep === 0) {
        navFooter.style.display = 'none';
        navFooter.style.opacity = '0';
    } else {
        navFooter.style.display = 'flex';
        setTimeout(() => navFooter.style.opacity = '1', 50);
    }

    // Update Back button visibility
    if (prevBtn) {
        prevBtn.style.display = currentStep > 0 ? 'inline-block' : 'none'; // Use inline-block or block as per CSS, simple override
        // Actually CSS for .btn-secondary might expect specific display. Let's assume block or remove style.display='none'
        // But original code set it to display:none in HTML.
        // Let's toggle it.
        prevBtn.style.display = currentStep > 1 ? 'block' : 'none'; // Only show back button from Step 2 onwards? 
        // Or Step 1? logic: Step 1 (Email) -> Back goes to Step 0 (Start). 
        // If we want users to be able to go back to "Start", then Step 1 is fine.
        // If I look at the requested manual verification plan: "Go to Step 1 (Email). Click Back -> Should go to Start Screen (Step 0)."
        // So it should be visible on Step 1.
        prevBtn.style.display = currentStep > 0 ? 'block' : 'none';
    }
}

function focusInput(step) {
    const section = document.querySelector(`.question-container[data-step="${step}"]`);
    if (!section) return;
    const input = section.querySelector('input:not([type="radio"]):not([type="checkbox"]), textarea');
    if (input) input.focus();
}

window.nextStep = async function () {
    if (isTransitioning || currentStep > totalSteps) return;

    if (currentStep > 0 && !validateStep(currentStep)) {
        showError('Please answer to continue &rarr;');
        return;
    }
    showError(null);

    if (currentStep === totalSteps) {
        submitForm();
        return;
    }

    const currentSection = document.querySelector(`.question-container[data-step="${currentStep}"]`);
    const nextSection = document.querySelector(`.question-container[data-step="${currentStep + 1}"]`);

    if (!nextSection) return;

    isTransitioning = true;
    currentSection.classList.remove('active');

    setTimeout(() => {
        currentSection.style.display = 'none';
        nextSection.style.display = 'block';
        setTimeout(() => {
            nextSection.classList.add('active');
            currentStep++;
            updateProgress();
            focusInput(currentStep);
            isTransitioning = false;
        }, 50);
    }, 400);
}

window.prevStep = function () {
    if (isTransitioning || currentStep <= 0) return;

    const currentSection = document.querySelector(`.question-container[data-step="${currentStep}"]`);
    const prevSection = document.querySelector(`.question-container[data-step="${currentStep - 1}"]`);

    if (!prevSection) return;

    isTransitioning = true;
    currentSection.classList.remove('active');

    setTimeout(() => {
        currentSection.style.display = 'none';
        prevSection.style.display = 'block';
        setTimeout(() => {
            prevSection.classList.add('active');
            currentStep--;
            updateProgress();
            // Optional: Remove focus when going back
            isTransitioning = false;
        }, 50);
    }, 400);
}

function validateStep(step) {
    const section = document.querySelector(`.question-container[data-step="${step}"]`);
    if (!section) return true;

    const requiredInputs = section.querySelectorAll('[required]');
    if (requiredInputs.length === 0) return true;

    for (const input of requiredInputs) {
        if (input.type === 'radio') {
            const checked = section.querySelector(`input[name="${input.name}"]:checked`);
            if (!checked) return false;
        } else if (input.type === 'email') {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!input.value.trim() || !emailRegex.test(input.value)) {
                return false;
            }
        } else if (!input.value.trim()) {
            return false;
        }
    }
    return true;
}

function showError(msg) {
    if (msg) {
        errorMsg.innerHTML = msg;
        errorMsg.style.display = 'block';
    } else {
        errorMsg.style.display = 'none';
    }
}

async function submitForm() {
    if (FORM_URL.includes('YOUR_GOOGLE_APPS_SCRIPT_URL_HERE')) {
        showError('Backend URL not configured.');
        return;
    }

    const formData = new FormData(form);
    const data = {};
    const improvements = formData.getAll('improvements');
    data.improvements = improvements.join(', ');

    formData.forEach((value, key) => {
        if (key !== 'improvements' && key !== 'pain_scale' && key !== 'value_scale') {
            data[key] = value;
        }
    });

    data.pain_scale = formData.get('pain_scale');
    data.value_scale = formData.get('value_scale');
    data.timestamp = new Date().toISOString();

    nextBtn.disabled = true;
    nextBtn.innerHTML = 'Sending...';
    showError(null);

    try {
        await fetch(FORM_URL, {
            method: 'POST',
            mode: 'no-cors',
            cache: 'no-cache',
            headers: { 'Content-Type': 'text/plain' },
            body: JSON.stringify(data)
        });

        const lastSection = document.querySelector(`.question-container[data-step="${totalSteps}"]`);
        lastSection.classList.remove('active');
        setTimeout(() => {
            lastSection.style.display = 'none';
            navFooter.style.display = 'none';
            const successView = document.getElementById('successView');
            successView.style.display = 'block';
            setTimeout(() => successView.classList.add('active'), 50);
        }, 400);

    } catch (error) {
        console.error('Submission error:', error);
        showError('Submission failed.');
        nextBtn.disabled = false;
        nextBtn.innerHTML = 'Try Again';
    }
}

nextBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    nextStep();
});

prevBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    prevStep();
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        const activeSection = document.querySelector('.question-container.active');
        if (activeSection) {
            const isTextarea = activeSection.querySelector('textarea') === document.activeElement;
            if (isTextarea) e.preventDefault();
            nextStep();
        }
    }

    const activeSection = document.querySelector('.question-container.active');
    if (activeSection && !['TEXTAREA', 'INPUT', 'SELECT'].includes(document.activeElement.tagName)) {
        const radioChoices = activeSection.querySelectorAll('.choice-item');
        if (radioChoices.length > 0) {
            const index = e.key.toUpperCase().charCodeAt(0) - 65;
            if (index >= 0 && index < radioChoices.length) {
                const radio = radioChoices[index].querySelector('input[type="radio"], input[type="checkbox"]');
                if (radio) {
                    radio.checked = radio.type === 'checkbox' ? !radio.checked : true;
                    handleSelection(radioChoices[index]);
                    if (radio.type === 'radio') setTimeout(nextStep, 500);
                }
            }
        }
    }
});

function handleSelection(element) {
    const parent = element.closest('.question-container');
    if (parent) {
        const input = element.querySelector('input');
        if (input && input.type === 'radio') {
            parent.querySelectorAll('.choice-item, .scale-item').forEach(el => {
                if (el.querySelector(`input[name="${input.name}"]`)) {
                    el.classList.remove('selected');
                }
            });
            element.classList.add('selected');
        } else if (input && input.type === 'checkbox') {
            if (input.checked) element.classList.add('selected');
            else element.classList.remove('selected');
        }
    }
}

document.addEventListener('change', (e) => {
    const parentLabel = e.target.parentElement;
    if (parentLabel?.classList.contains('choice-item') || parentLabel?.classList.contains('scale-item')) {
        handleSelection(parentLabel);
        if (e.target.type === 'radio') {
            setTimeout(nextStep, 500);
        }
    }
});

let orgAnimationStarted = false;

function initVisionAnimations() {
    const visionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                visionObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    document.querySelectorAll('.vision-org-section, .vision-arch-section, .vision-today-section, .vision-timeline-section, .vision-cta').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.7s ease, transform 0.7s ease';
        visionObserver.observe(el);
    });

    // Stagger vertical timeline items
    const phaseObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const item = entry.target;
                const phase = item.dataset.phase;
                const delay = (phase - 1) * 200;
                setTimeout(() => {
                    item.style.opacity = '1';
                    item.style.transform = 'translateY(0)';
                }, delay);
                phaseObserver.unobserve(item);
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.vtimeline-item').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(24px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        phaseObserver.observe(el);
    });

    // Org network animation
    if (!orgAnimationStarted) {
        const orgObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    orgAnimationStarted = true;
                    drawOrgNetworks();
                    orgObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });
        const orgSection = document.querySelector('.vision-org-section');
        if (orgSection) orgObserver.observe(orgSection);
    }

    // Architecture canvas
    const archObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                drawArchitecture();
                archObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });
    const archSection = document.querySelector('.vision-arch-section');
    if (archSection) archObserver.observe(archSection);
}

function drawOrgNetworks() {
    drawTraditionalOrg();
    drawFutureOrg();
}

function setupCanvas(id, w, h) {
    const canvas = document.getElementById(id);
    if (!canvas) return null;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';
    ctx.scale(dpr, dpr);
    return ctx;
}

function drawTraditionalOrg() {
    const W = 420, H = 380;
    const ctx = setupCanvas('orgCanvasToday', W, H);
    if (!ctx) return;

    const cx = W / 2;
    const leader = { x: cx, y: 55, r: 18, label: 'Leader', type: 'person' };

    const leadY = 155;
    const memberY = 260;
    const teams = [
        { name: 'Engineering', x: 70, members: 5 },
        { name: 'Product', x: 210, members: 4 },
        { name: 'Design', x: 350, members: 3 },
    ];

    const allNodes = [leader];
    const edges = [];

    teams.forEach(t => {
        const lead = { x: t.x, y: leadY, r: 13, label: t.name, type: 'person' };
        allNodes.push(lead);
        edges.push([leader, lead]);

        const spread = 32;
        for (let i = 0; i < t.members; i++) {
            const mx = t.x + (i - (t.members - 1) / 2) * spread;
            const member = { x: mx, y: memberY, r: 7, label: '', type: 'person' };
            allNodes.push(member);
            edges.push([lead, member]);
        }
    });

    let progress = 0;
    function animate() {
        progress += 0.018;
        if (progress > 1) progress = 1;
        ctx.clearRect(0, 0, W, H);
        const e = easeOutCubic(progress);

        edges.forEach((edge, i) => {
            const [from, to] = edge;
            const ep = Math.min(1, (e - i / edges.length) * edges.length);
            if (ep <= 0) return;
            ctx.beginPath();
            ctx.moveTo(from.x, from.y);
            ctx.lineTo(from.x + (to.x - from.x) * ep, from.y + (to.y - from.y) * ep);
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.07)';
            ctx.lineWidth = 1;
            ctx.stroke();
        });

        allNodes.forEach((node, i) => {
            const np = Math.min(1, (e - i / allNodes.length) * allNodes.length * 1.5);
            if (np <= 0) return;
            const s = easeOutCubic(Math.min(1, np));

            ctx.beginPath();
            ctx.arc(node.x, node.y, node.r * s, 0, Math.PI * 2);
            ctx.fillStyle = i === 0 ? '#8B949E' : (node.r > 10 ? '#484F58' : '#2A2A2A');
            ctx.globalAlpha = np * 0.9;
            ctx.fill();
            ctx.globalAlpha = 1;

            if (node.label) {
                ctx.font = `500 ${9 * s}px Inter, sans-serif`;
                ctx.fillStyle = '#484F58';
                ctx.textAlign = 'center';
                ctx.globalAlpha = np;
                ctx.fillText(node.label, node.x, node.y + node.r + 14);
                ctx.globalAlpha = 1;
            }
        });

        // Person icons inside lead nodes
        allNodes.forEach((node, i) => {
            if (node.r < 10) return; // skip small member nodes
            const np = Math.min(1, (e - i / allNodes.length) * allNodes.length * 1.5);
            if (np <= 0) return;
            ctx.globalAlpha = np;
            ctx.strokeStyle = '#0A0A0A';
            ctx.lineWidth = 1.2;
            ctx.beginPath(); ctx.arc(node.x, node.y - 2, 3, 0, Math.PI * 2); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(node.x - 5, node.y + 6); ctx.quadraticCurveTo(node.x, node.y + 1, node.x + 5, node.y + 6); ctx.stroke();
            ctx.globalAlpha = 1;
        });

        // Small person dots inside member nodes
        allNodes.forEach((node, i) => {
            if (node.r >= 10) return;
            const np = Math.min(1, (e - i / allNodes.length) * allNodes.length * 1.5);
            if (np <= 0) return;
            ctx.globalAlpha = np * 0.7;
            ctx.beginPath(); ctx.arc(node.x, node.y - 1, 2, 0, Math.PI * 2);
            ctx.strokeStyle = '#0A0A0A'; ctx.lineWidth = 0.8; ctx.stroke();
            ctx.beginPath(); ctx.moveTo(node.x - 3, node.y + 4); ctx.quadraticCurveTo(node.x, node.y + 1, node.x + 3, node.y + 4); ctx.stroke();
            ctx.globalAlpha = 1;
        });

        if (progress >= 0.8) {
            const a = Math.min(1, (progress - 0.8) * 5);
            ctx.globalAlpha = a;
            ctx.textAlign = 'left';
            ctx.font = '700 34px Outfit, sans-serif';
            ctx.fillStyle = '#484F58';
            const numW = ctx.measureText('15').width;
            const totalLabel = ' people across 3 functions';
            ctx.font = '500 13px Inter, sans-serif';
            const txtW = ctx.measureText(totalLabel).width;
            const totalW = numW + txtW;
            const startX = cx - totalW / 2;
            ctx.font = '700 34px Outfit, sans-serif';
            ctx.fillStyle = '#484F58';
            ctx.fillText('15', startX, H - 18);
            ctx.font = '500 13px Inter, sans-serif';
            ctx.fillStyle = '#3D3D3D';
            ctx.fillText(totalLabel, startX + numW, H - 18);
            ctx.globalAlpha = 1;
        }

        if (progress < 1) requestAnimationFrame(animate);
    }
    animate();
}

function drawFutureOrg() {
    const W = 420, H = 380;
    const ctx = setupCanvas('orgCanvasTomorrow', W, H);
    if (!ctx) return;

    const cx = W / 2;
    const leader = { x: cx, y: 55, r: 18, label: 'Leader', type: 'person' };

    const leadY = 155;
    const agentY = 260;
    const functions = [
        { name: 'Eng Lead', x: 70, agents: ['Code', 'Test', 'Deploy', 'Review'] },
        { name: 'Product Lead', x: 210, agents: ['Research', 'Specs', 'Analytics'] },
        { name: 'Design Lead', x: 350, agents: ['UI', 'Assets', 'Prototype'] },
    ];

    const allNodes = [leader];
    const edges = [];

    functions.forEach(fn => {
        const lead = { x: fn.x, y: leadY, r: 13, label: fn.name, type: 'person' };
        allNodes.push(lead);
        edges.push({ from: leader, to: lead, type: 'person' });

        const spread = 32;
        fn.agents.forEach((name, i) => {
            const ax = fn.x + (i - (fn.agents.length - 1) / 2) * spread;
            const agent = { x: ax, y: agentY, r: 9, label: name, type: 'agent' };
            allNodes.push(agent);
            edges.push({ from: lead, to: agent, type: 'agent' });
        });
    });

    let progress = 0;
    let time = 0;

    function animate() {
        progress += 0.018;
        if (progress > 1) progress = 1;
        time += 0.02;
        ctx.clearRect(0, 0, W, H);
        const e = easeOutCubic(progress);

        edges.forEach((edge, i) => {
            const { from, to } = edge;
            const ep = Math.min(1, (e - i / edges.length) * edges.length);
            if (ep <= 0) return;
            ctx.beginPath();
            ctx.moveTo(from.x, from.y);
            ctx.lineTo(from.x + (to.x - from.x) * ep, from.y + (to.y - from.y) * ep);
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.07)';
            ctx.lineWidth = 1;
            ctx.stroke();
        });

        allNodes.forEach((node, i) => {
            const np = Math.min(1, (e - i / allNodes.length) * allNodes.length * 1.5);
            if (np <= 0) return;
            const s = easeOutCubic(Math.min(1, np));

            if (node.type === 'agent') {
                const r = node.r * s;
                // AI shimmer gradient fill
                const grad = ctx.createRadialGradient(node.x - r * 0.3, node.y - r * 0.3, 0, node.x, node.y, r);
                grad.addColorStop(0, 'rgba(180, 140, 255, 0.14)');
                grad.addColorStop(0.4, 'rgba(126, 200, 200, 0.10)');
                grad.addColorStop(0.7, 'rgba(220, 120, 180, 0.08)');
                grad.addColorStop(1, 'rgba(100, 160, 240, 0.05)');
                ctx.beginPath();
                ctx.arc(node.x, node.y, r, 0, Math.PI * 2);
                ctx.fillStyle = grad;
                ctx.globalAlpha = np;
                ctx.fill();
                // Shimmer border — shifts between teal/pink/purple
                const hue = 260 + Math.sin(time * 0.8 + i * 0.9) * 80;
                ctx.strokeStyle = `hsla(${hue}, 45%, 55%, 0.35)`;
                ctx.lineWidth = 1;
                ctx.stroke();
                ctx.globalAlpha = 1;
            } else {
                ctx.beginPath();
                ctx.arc(node.x, node.y, node.r * s, 0, Math.PI * 2);
                ctx.fillStyle = i === 0 ? '#8B949E' : '#6B6B6B';
                ctx.globalAlpha = np * 0.9;
                ctx.fill();
                ctx.globalAlpha = 1;
            }

            if (node.label) {
                ctx.font = `500 ${(node.type === 'agent' ? 8 : 9) * s}px Inter, sans-serif`;
                ctx.fillStyle = node.type === 'agent' ? '#8BB8D0' : '#484F58';
                ctx.textAlign = 'center';
                ctx.globalAlpha = np;
                ctx.fillText(node.label, node.x, node.y + node.r + 14);
                ctx.globalAlpha = 1;
            }
        });

        // Person icons inside people nodes
        allNodes.forEach((node, i) => {
            if (node.type !== 'person') return;
            const np = Math.min(1, (e - i / allNodes.length) * allNodes.length * 1.5);
            if (np <= 0) return;
            ctx.globalAlpha = np;
            ctx.strokeStyle = '#0A0A0A';
            ctx.lineWidth = 1.2;
            ctx.beginPath(); ctx.arc(node.x, node.y - 2, 3, 0, Math.PI * 2); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(node.x - 5, node.y + 6); ctx.quadraticCurveTo(node.x, node.y + 1, node.x + 5, node.y + 6); ctx.stroke();
            ctx.globalAlpha = 1;
        });

        // Bot icons inside agent nodes with shimmer color
        allNodes.forEach((node, i) => {
            if (node.type !== 'agent') return;
            const np = Math.min(1, (e - i / allNodes.length) * allNodes.length * 1.5);
            if (np <= 0) return;
            ctx.globalAlpha = np;
            const hue = 260 + Math.sin(time * 0.8 + i * 0.9) * 80;
            const iconColor = `hsl(${hue}, 50%, 65%)`;
            ctx.strokeStyle = iconColor;
            ctx.lineWidth = 0.8;
            ctx.strokeRect(node.x - 3, node.y - 3, 6, 5);
            ctx.beginPath(); ctx.arc(node.x - 1.5, node.y - 1, 0.8, 0, Math.PI * 2); ctx.fillStyle = iconColor; ctx.fill();
            ctx.beginPath(); ctx.arc(node.x + 1.5, node.y - 1, 0.8, 0, Math.PI * 2); ctx.fill();
            ctx.beginPath(); ctx.moveTo(node.x, node.y - 3); ctx.lineTo(node.x, node.y - 5); ctx.stroke();
            ctx.globalAlpha = 1;
        });

        // Subtle activity indicators (reduced)
        if (progress >= 1) {
            edges.forEach((edge, i) => {
                if (edge.type !== 'agent') return;
                const { from, to } = edge;
                const t = ((time * 0.5 + i * 0.25) % 1);
                const px = from.x + (to.x - from.x) * t;
                const py = from.y + (to.y - from.y) * t;
                ctx.beginPath();
                ctx.arc(px, py, 1, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(126, 200, 200, 0.12)';
                ctx.fill();
            });
        }

        if (progress >= 0.8) {
            const a = Math.min(1, (progress - 0.8) * 5);
            ctx.globalAlpha = a;
            ctx.textAlign = 'left';
            ctx.font = '700 34px Outfit, sans-serif';
            ctx.fillStyle = '#5A9E9E';
            const numW = ctx.measureText('5').width;
            const part1 = ' people + ';
            const part2 = '10 AI agents';
            ctx.font = '500 13px Inter, sans-serif';
            const p1W = ctx.measureText(part1).width;
            const p2W = ctx.measureText(part2).width;
            const totalW = numW + p1W + p2W;
            const startX = cx - totalW / 2;
            ctx.font = '700 34px Outfit, sans-serif';
            ctx.fillStyle = '#5A9E9E';
            ctx.fillText('5', startX, H - 18);
            ctx.font = '500 13px Inter, sans-serif';
            ctx.fillStyle = '#3D3D3D';
            ctx.fillText(part1, startX + numW, H - 18);
            ctx.fillStyle = '#8BB8D0';
            ctx.fillText(part2, startX + numW + p1W, H - 18);
            ctx.globalAlpha = 1;
        }

        requestAnimationFrame(animate);
    }
    animate();
}

function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
}

// Architecture diagram — animated story loop
function drawArchitecture() {
    const W = 720, H = 420;
    const ctx = setupCanvas('archCanvas', W, H);
    if (!ctx) return;

    const icons = {};
    const iconSvgs = {
        catalex: null,
        gdrive: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 87.3 78" width="24" height="24"><path fill="#0066DA" d="M6.6 66.85l3.85 6.65c.8 1.4 1.95 2.5 3.3 3.3l13.75-23.8H0c0 1.55.4 3.1 1.2 4.5z"/><path fill="#00AC47" d="M43.65 25.15L29.9 1.35c-1.35.8-2.5 1.9-3.3 3.3l-25.4 44a9.06 9.06 0 0 0-1.2 4.5h27.5z"/><path fill="#EA4335" d="M73.55 76.8c1.35-.8 2.5-1.9 3.3-3.3l1.6-2.75 7.65-13.25c.8-1.4 1.2-2.95 1.2-4.5H59.8l5.95 10.3z"/><path fill="#00832D" d="M43.65 25.15L57.4 1.35C56.05.55 54.5 0 52.8 0H34.5c-1.7 0-3.25.55-4.6 1.35z"/><path fill="#2684FC" d="M59.8 53H27.5l-13.75 23.8c1.35.8 2.9 1.2 4.6 1.2H72.2c1.7 0 3.25-.45 4.6-1.2z"/><path fill="#FFBA00" d="M73.4 26.5l-12.7-22c-.8-1.4-1.95-2.5-3.3-3.3L43.65 25.15 59.8 53h27.45c0-1.55-.4-3.1-1.2-4.5z"/></svg>',
        slack: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="#E01E5A" d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313z"/><path fill="#36C5F0" d="M8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zM8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312z"/><path fill="#2EB67D" d="M18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zM17.688 8.834a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312z"/><path fill="#ECB22E" d="M15.165 18.956a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zM15.165 17.688a2.527 2.527 0 0 1-2.52-2.523 2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z"/></svg>',
        github: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="#E6EDF3" d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>',
        jira: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="#2684FF" d="M11.571 11.513H0a5.218 5.218 0 0 0 5.232 5.215h2.13v2.057A5.215 5.215 0 0 0 12.575 24V12.518a1.005 1.005 0 0 0-1.005-1.005zm5.723-5.756H5.723a5.218 5.218 0 0 0 5.232 5.215h2.13v2.057a5.215 5.215 0 0 0 5.213 5.215V6.762a1.005 1.005 0 0 0-1.005-1.005zm5.723-5.756H11.446a5.218 5.218 0 0 0 5.232 5.215h2.13v2.057A5.215 5.215 0 0 0 24.021 12.5V1.006A1.005 1.005 0 0 0 23.017 0z"/></svg>',
        notion: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="#E6EDF3" d="M4.459 4.208c.746.606 1.026.56 2.428.466l13.215-.793c.28 0 .047-.28-.046-.326L17.86 1.968c-.42-.326-.98-.7-2.055-.607L2.58 2.514c-.467.047-.56.28-.374.466l2.253 1.228zm.793 3.08v13.904c0 .747.373 1.027 1.214.98l14.523-.84c.841-.046.935-.56.935-1.166V6.354c0-.606-.233-.933-.748-.886l-15.177.887c-.56.047-.747.327-.747.933zm14.337.745c.093.42 0 .84-.42.888l-.7.14v10.264c-.608.327-1.168.514-1.635.514-.748 0-.935-.234-1.495-.933l-4.577-7.186v6.952l1.448.327s0 .84-1.168.84l-3.222.186c-.093-.186 0-.653.327-.726l.84-.233V9.854L7.822 9.76c-.094-.42.14-1.026.793-1.073l3.456-.233 4.764 7.279v-6.44l-1.215-.14c-.093-.514.28-.886.747-.933l3.222-.186zM1.6 1.054L15.98.154c1.682-.14 2.102.093 2.802.607l3.876 2.708c.513.373.653.467.653 1.167v15.924c0 1.12-.42 1.773-1.682 1.866l-15.45.888c-.935.047-1.402-.093-1.868-.7l-2.476-3.22c-.513-.653-.747-1.26-.747-1.866V2.361c0-.7.42-1.4 1.495-1.307z"/></svg>',
        openai: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="#ccc" d="M22.282 9.821a5.985 5.985 0 0 0-.516-4.91 6.046 6.046 0 0 0-6.51-2.9A6.065 6.065 0 0 0 4.981 4.18a5.985 5.985 0 0 0-3.998 2.9 6.046 6.046 0 0 0 .743 7.097 5.98 5.98 0 0 0 .51 4.911 6.051 6.051 0 0 0 6.515 2.9A5.985 5.985 0 0 0 13.26 24a6.056 6.056 0 0 0 5.772-4.206 5.99 5.99 0 0 0 3.997-2.9 6.056 6.056 0 0 0-.747-7.073zM13.26 22.43a4.476 4.476 0 0 1-2.876-1.04l.141-.081 4.779-2.758a.795.795 0 0 0 .392-.681v-6.737l2.02 1.168a.071.071 0 0 1 .038.052v5.583a4.504 4.504 0 0 1-4.494 4.494zM3.6 18.304a4.47 4.47 0 0 1-.535-3.014l.142.085 4.783 2.759a.771.771 0 0 0 .78 0l5.843-3.369v2.332a.08.08 0 0 1-.033.062L9.74 19.95a4.5 4.5 0 0 1-6.14-1.646zM2.34 7.896a4.485 4.485 0 0 1 2.366-1.973V11.6a.766.766 0 0 0 .388.676l5.815 3.355-2.02 1.168a.076.076 0 0 1-.071 0l-4.83-2.786A4.504 4.504 0 0 1 2.34 7.872zm16.597 3.855l-5.833-3.387L15.119 7.2a.076.076 0 0 1 .071 0l4.83 2.791a4.494 4.494 0 0 1-.676 8.105v-5.678a.79.79 0 0 0-.407-.667zm2.01-3.023l-.141-.085-4.774-2.782a.776.776 0 0 0-.785 0L9.409 9.23V6.897a.066.066 0 0 1 .028-.061l4.83-2.787a4.5 4.5 0 0 1 6.68 4.66zm-12.64 4.135l-2.02-1.164a.08.08 0 0 1-.038-.057V6.075a4.5 4.5 0 0 1 7.375-3.453l-.142.08L8.704 5.46a.795.795 0 0 0-.393.681zm1.097-2.365l2.602-1.5 2.607 1.5v2.999l-2.597 1.5-2.607-1.5z"/></svg>',
        claude: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 1200" width="24" height="24"><path fill="#D97757" d="M233.96 800.21L468.64 668.54l3.95-11.44-3.95-6.36-11.43 0-39.22-2.42-134.1-3.62-116.29-4.83-112.67-6.04-28.35-6.04-26.58-35.03 2.74-17.48 23.84-16.03 34.15 2.98 75.47 5.16 113.23 7.81 82.15 4.83 121.69 12.64 19.33 0 2.74-7.81-6.61-4.83-5.15-4.84-117.18-79.24-126.85-83.92-66.44-48.32-35.92-24.48-18.12-22.95-7.81-50.1 32.62-35.92 43.81 2.98 11.19 2.98 44.38 34.15 94.79 73.37 123.79 91.17 18.12 15.06 7.25-5.16.88-3.62-8.13-13.61-67.33-121.69-71.84-123.79-31.97-51.3-8.46-30.77c-2.98-12.64-5.16-23.25-5.16-36.23l37.13-50.42 20.54-6.6 49.53 6.6 20.86 18.12 30.77 70.39 49.85 110.82 77.31 150.68 22.63 44.7 12.08 41.39 4.51 12.64 7.81 0 0-7.25 6.37-84.88 11.76-104.21 11.43-134.1 3.95-37.77 18.68-45.27 37.13-24.48 29 13.85 23.83 34.15-3.3 22.07-14.17 92.13-27.79 144.32-18.12 96.65 10.55 0 12.08-12.08 48.89-64.92 82.15-102.68 36.24-40.74 42.28-45.02 27.14-21.42 51.3 0 37.77 56.13-16.91 57.99-52.83 67.01-43.81 56.78-62.83 84.57-39.22 67.65 3.62 5.39 9.34-0.88 141.91-30.21 76.67-13.85 91.49-15.7 41.39 19.33 4.51 19.65-16.27 40.19-97.86 24.16-114.76 22.95-170.9 40.43-2.09 1.53 2.41 2.98 77 7.25 32.93 1.78 80.62 0 150.12 11.19 39.22 26.13 23.52 31.73-3.95 24.16-60.39 30.76-81.5-19.33-190.14-45.27-65.23-16.27-9.02 0 0 5.39 54.36 53.16 99.63 89.96 124.74 115.97 6.36 28.67-16.03 22.63-16.91-2.42-109.61-82.47-42.28-37.12-95.75-80.62-6.37 0 0 8.46 22.07 32.29 116.6 175.17 6.04 53.72-8.46 17.48-30.2 10.55-33.18-6.04-68.22-95.76-70.39-107.84-56.77-96.65-6.93 3.95-33.43 160.88-15.71 18.44-36.24 13.85-30.2-22.95-16.03-37.13 16.03-73.37 19.33-95.76 15.7-76.11 14.17-94.55 8.46-31.41-.57-2.09-6.93.89-71.27 97.85-108.4 146.52-85.77 91.81-20.54 8.13-35.59-18.44 3.3-32.93 19.94-29.33 118.72-150.92 71.59-93.59 46.23-53.95-.32-7.81-2.74 0L205.29 929.4l-56.14 7.24-24.16-22.63 2.98-37.12 11.44-12.08 94.79-65.23z"/></svg>',
        gemini: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192 192" width="24" height="24"><defs><linearGradient id="gG" x1="8" y1="96" x2="184" y2="96" gradientUnits="userSpaceOnUse"><stop stop-color="#4285F4"/><stop offset=".5" stop-color="#9B72CB"/><stop offset="1" stop-color="#D96570"/></linearGradient></defs><path d="M164.93 86.68c-13.56-5.84-25.42-13.84-35.6-24.01-10.17-10.17-18.18-22.04-24.01-35.6-2.23-5.19-4.04-10.54-5.42-16.02C99.45 9.26 97.85 8 96 8s-3.45 1.26-3.9 3.05c-1.38 5.48-3.18 10.81-5.42 16.02-5.84 13.56-13.84 25.43-24.01 35.6-10.17 10.16-22.04 18.17-35.6 24.01-5.19 2.23-10.54 4.04-16.02 5.42C9.26 92.55 8 94.15 8 96s1.26 3.45 3.05 3.9c5.48 1.38 10.81 3.18 16.02 5.42 13.56 5.84 25.42 13.84 35.6 24.01 10.17 10.17 18.18 22.04 24.01 35.6 2.24 5.2 4.04 10.54 5.42 16.02A4.03 4.03 0 0 0 96 184c1.85 0 3.45-1.26 3.9-3.05 1.38-5.48 3.18-10.81 5.42-16.02 5.84-13.56 13.84-25.42 24.01-35.6 10.17-10.17 22.04-18.18 35.6-24.01 5.2-2.24 10.54-4.04 16.02-5.42A4.03 4.03 0 0 0 184 96c0-1.85-1.26-3.45-3.05-3.9-5.48-1.38-10.81-3.18-16.02-5.42" fill="url(#gG)"/></svg>',
        deepseek: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 509.64" width="24" height="24"><path fill="#4D6BFE" fill-rule="nonzero" d="M440.9 139.17c-4-1.96-5.72 1.78-8.06 3.67-.8.61-1.48 1.41-2.15 2.14-5.85 6.25-12.68 10.35-21.61 9.86-13.05-.73-24.19 3.37-34.04 13.35-2.09-12.31-9.05-19.66-19.64-24.37-5.54-2.45-11.14-4.9-15.02-10.23-2.71-3.8-3.45-8.02-4.8-12.19-.86-2.51-1.73-5.08-4.62-5.51-3.14-.49-4.37 2.14-5.6 4.35-4.93 9-6.83 18.92-6.65 28.96.43 22.6 9.97 40.6 28.93 53.4 2.15 1.47 2.71 2.94 2.03 5.08-1.29 4.41-2.83 8.7-4.19 13.11-.86 2.82-2.16 3.43-5.17 2.21-10.4-4.35-19.39-10.78-27.33-18.55-13.48-13.04-25.67-27.43-40.87-38.7a177.61 177.61 0 00-10.83-7.41c-15.51-15.06 2.03-27.43 6.09-28.9 4.25-1.53 1.48-6.8-12.25-6.74-13.73.06-26.29 4.65-42.29 10.78-2.34.92-4.8 1.59-7.33 2.14-14.53-2.76-29.61-3.37-45.37-1.59-29.67 3.31-53.37 17.33-70.79 41.27-20.93 28.79-25.85 61.48-19.82 95.59 6.34 35.94 24.68 65.7 52.88 88.97 29.24 24.12 62.91 35.94 101.32 33.68 23.33-1.35 49.31-4.47 78.61-29.27 7.39 3.67 15.14 5.14 28.01 6.25 9.91.92 19.45-.49 26.84-2.02 11.57-2.45 10.77-13.17 6.59-15.12-33.92-15.8-26.47-9.37-33.24-14.57 17.24-20.39 43.21-41.58 53.37-110.22.8-5.45.12-8.88 0-13.29-.06-2.69.55-3.73 3.63-4.04 8.49-.98 16.74-3.31 24.31-7.47 21.98-12 30.84-31.72 32.93-55.36.31-3.61-.06-7.35-3.88-9.25zM249.4 351.89c-32.87-25.84-48.81-34.35-55.4-33.98-6.16.37-5.05 7.41-3.69 12 1.42 4.53 3.26 7.65 5.85 11.63 1.79 2.63 3.02 6.55-1.78 9.49-10.59 6.55-28.99-2.21-29.86-2.64-21.42-12.61-39.33-29.27-51.95-52.05-12.19-21.92-19.27-45.44-20.44-70.54-.31-6.06 1.48-8.21 7.51-9.31 7.94-1.47 16.13-1.78 24.07-.62 33.55 4.9 62.11 19.9 86.05 43.66 13.67 13.53 24.01 29.7 34.66 45.5 11.33 16.78 23.51 32.76 39.03 45.87 5.48 4.59 9.85 8.08 14.04 10.66-12.62 1.41-33.67 1.71-48.08-9.68z"/></svg>',
    };

    // Load all SVGs as Image objects — use encodeURIComponent to preserve # in gradients
    for (const [key, svg] of Object.entries(iconSvgs)) {
        if (!svg) continue;
        const img = new Image();
        img.src = 'data:image/svg+xml,' + encodeURIComponent(svg);
        icons[key] = img;
    }
    // CatalEx logo from file
    const logoImg = new Image();
    logoImg.src = 'logo.svg';
    icons.catalex = logoImg;

    function drawIcon(key, x, y, size, alpha) {
        const img = icons[key];
        if (!img || !img.complete) return;
        const nw = img.naturalWidth || 24;
        const nh = img.naturalHeight || 24;
        const aspect = nw / nh;
        let dw, dh;
        if (aspect >= 1) { dw = size; dh = size / aspect; }
        else { dh = size; dw = size * aspect; }
        ctx.globalAlpha = alpha;
        ctx.drawImage(img, x - dw / 2, y - dh / 2, dw, dh);
        ctx.globalAlpha = 1;
    }

    // === LAYOUT ===
    // Act 1: sources on left, CatalEx center-left, memory right
    // Act 2: CatalEx moves left, user left of CatalEx (same Y), orch/intel/agents/memory/prefs right
    const srcX = 50, srcCY = 200;
    const CX1 = 200, CX2 = 120, CY = 200; // CatalEx position: Act1 vs Act2
    const userLX = 30; // user to the left of CatalEx in Act2, same Y

    // Act 2 right-side layout
    // Orchestration is the hub. Memory, Intelligence, Agents all at same X, stacked vertically.
    const orchAX = 340, orchAY = CY;
    const colX = 560; // single column for the three boxes
    const intAY = CY - 85;   // Intelligence top
    const memAY = CY;        // Memory middle
    const agentAY = CY + 85; // Agents bottom
    const prefAX = orchAX, prefAY = CY + 140;

    const sources = [
        { label: 'Google Drive', icon: 'gdrive', x: srcX, y: 50, color: '#4285F4' },
        { label: 'Slack', icon: 'slack', x: srcX, y: 120, color: '#E01E5A' },
        { label: 'GitHub', icon: 'github', x: srcX, y: 190, color: '#E6EDF3' },
        { label: 'Jira', icon: 'jira', x: srcX, y: 260, color: '#2684FF' },
        { label: 'Notion', icon: 'notion', x: srcX, y: 330, color: '#E6EDF3' },
    ];

    const llmIcons = [
        { icon: 'openai', x: -42 },
        { icon: 'claude', x: -14 },
        { icon: 'gemini', x: 14 },
        { icon: 'deepseek', x: 42 },
    ];

    // Helpers
    function drawRR(x,y,w,h,r,fill,stroke,a) {
        ctx.globalAlpha=a; ctx.beginPath(); ctx.roundRect(x-w/2,y-h/2,w,h,r);
        ctx.fillStyle=fill; ctx.fill();
        if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=1;ctx.stroke();}
        ctx.globalAlpha=1;
    }
    function line(x1,y1,x2,y2,color,a,dash) {
        ctx.globalAlpha=a; if(dash)ctx.setLineDash(dash);
        ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);
        ctx.strokeStyle=color;ctx.lineWidth=1;ctx.stroke();
        ctx.setLineDash([]);ctx.globalAlpha=1;
    }
    function circ(x,y,r,fill,stroke,a) {
        ctx.globalAlpha=a;ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);
        ctx.fillStyle=fill;ctx.fill();
        if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=1.5;ctx.stroke();}
        ctx.globalAlpha=1;
    }
    function lbl(text,x,y,font,color,a) {
        ctx.globalAlpha=a;ctx.font=font;ctx.fillStyle=color;
        ctx.textAlign='center';ctx.fillText(text,x,y);ctx.globalAlpha=1;
    }
    function person(x,y,a) {
        ctx.globalAlpha=a;ctx.strokeStyle='#C9D1D9';ctx.lineWidth=2;
        ctx.beginPath();ctx.arc(x,y-10,7,0,Math.PI*2);ctx.stroke();
        ctx.beginPath();ctx.moveTo(x-10,y+10);ctx.quadraticCurveTo(x,y,x+10,y+10);ctx.stroke();
        ctx.globalAlpha=1;
    }
    function dot(x1,y1,x2,y2,t,color,s) {
        const px=x1+(x2-x1)*t,py=y1+(y2-y1)*t;
        ctx.beginPath();ctx.arc(px,py,s,0,Math.PI*2);ctx.fillStyle=color;ctx.fill();
    }

    const LOOP = 22;
    let time = 0;
    function pr(t,s,e){return Math.max(0,Math.min(1,(t-s)/(e-s)));}
    function ez(v){return v<0.5?2*v*v:1-Math.pow(-2*v+2,2)/2;}

    function animate() {
        time += 0.016;
        const t = time % LOOP;
        const fade = t > 20 ? 1-pr(t,20,22) : 1;
        ctx.clearRect(0,0,W,H);

        // Caption
        let cap='';
        if(t<2) cap='Your tools generate data every day';
        else if(t<5) cap='CatalEx connects and indexes everything';
        else if(t<8) cap='Building your organization\'s memory';
        else if(t<11) cap='You ask — CatalEx orchestrates the workflow';
        else if(t<15) cap='CatalEx reasons the appropriate way to answer';
        else if(t<18) cap='Response delivered — preferences saved';
        if(cap) lbl(cap, W/2, H-10, '500 12px Inter, sans-serif', '#484F58', ez(pr(t,Math.floor(t/2)*2,Math.floor(t/2)*2+1))*fade);

        // === Interpolated CatalEx position ===
        const catSlide = ez(pr(t, 8, 9.5));
        const cx = CX1 + (CX2 - CX1) * catSlide;
        const catR = 26 + 6 * catSlide; // grows slightly

        // ===== ACT 1: DATA INGESTION (0-8s) =====
        const act1 = t < 8 ? 1 : Math.max(0, 1-pr(t,8,9.5));

        // Sources
        if(act1>0){
            sources.forEach((src,i)=>{
                const a=ez(pr(t,i*0.2,i*0.2+0.6))*fade*act1;
                if(a<=0)return;
                circ(src.x,src.y,20,'#0E0E0E',src.color+'30',a);
                drawIcon(src.icon,src.x,src.y,22,a);
                lbl(src.label,src.x,src.y+33,'500 8px Inter, sans-serif','#484F58',a);
            });
        }

        // CatalEx node — always visible after appearance
        const catA = ez(pr(t,2,3))*fade;
        if(catA>0){
            circ(cx,CY,catR,'rgba(90,158,158,0.08)','rgba(90,158,158,0.3)',catA);
            drawIcon('catalex',cx,CY,30+4*catSlide,catA);
            if(t>8) lbl('CatalEx',cx,CY+catR+15,'600 11px Inter, sans-serif','#5A9E9E',catA*catSlide);
        }

        // Source → CatalEx lines + particles
        if(act1>0 && t>2.5){
            const connA=ez(pr(t,2.5,3.5))*fade*act1;
            sources.forEach(src=>{line(src.x+20,src.y,cx-catR,CY,'#5A9E9E',connA*0.12);});
            if(t>3&&t<7.5){
                sources.forEach((src,i)=>{
                    const pt=((t-3+i*0.18)*0.5)%1;
                    ctx.globalAlpha=fade*act1*0.2;
                    dot(src.x+20,src.y,cx-catR,CY,pt,'#5A9E9E',2);
                    ctx.globalAlpha=1;
                });
            }
        }

        // Memory during Act 1 (right of CatalEx)
        const mem1X = cx + 180;
        const mem1A = ez(pr(t,4.5,5.5))*fade*act1;
        if(mem1A>0){
            drawRR(mem1X,CY,150,55,10,'#0E0E0E','rgba(90,158,158,0.2)',mem1A);
            lbl('Memory',mem1X,CY-3,'700 13px Outfit, sans-serif','#5A9E9E',mem1A);
            lbl('Org Context',mem1X,CY+14,'400 9px Inter, sans-serif','#484F58',mem1A);
            line(cx+catR,CY,mem1X-75,CY,'#5A9E9E',mem1A*0.15);
        }
        if(t>5&&t<8){
            ctx.globalAlpha=fade*act1*0.2;
            dot(cx+catR,CY,mem1X-75,CY,((t-5)*0.4)%1,'#5A9E9E',2.5);
            ctx.globalAlpha=1;
        }

        // ===== ACT 2: USER QUERY + ReAct LOOP (8-18s) =====
        // Edge coordinates for Orchestration box
        const oL = orchAX-70, oR = orchAX+70, oT = orchAY-25, oB = orchAY+25;
        // Edge coordinates for column boxes
        const bL = colX-65, bR = colX+65;

        // User — same Y as CatalEx, to its left
        const usrA = ez(pr(t,8.5,9.5))*fade;
        if(usrA>0){
            person(userLX,CY,usrA);
            lbl('You',userLX,CY+26,'700 11px Inter, sans-serif','#C9D1D9',usrA);
            const qA=ez(pr(t,9.5,10.2))*fade;
            if(qA>0) line(userLX+15,CY,cx-catR,CY,'#C9D1D9',qA*0.2);
            if(t>9.5&&t<11.5){
                ctx.globalAlpha=fade*0.35;
                dot(userLX+15,CY,cx-catR,CY,((t-9.5)*0.6)%1,'#C9D1D9',3);
                ctx.globalAlpha=1;
            }
        }

        // Orchestration box
        const oA=ez(pr(t,10,11))*fade;
        if(oA>0){
            drawRR(orchAX,orchAY,140,50,10,'#0E0E0E','rgba(126,200,200,0.2)',oA);
            lbl('Orchestration',orchAX,orchAY-2,'700 12px Outfit, sans-serif','#7EC8C8',oA);
            lbl('CatalEx Engine',orchAX,orchAY+13,'400 8px Inter, sans-serif','#3D3D3D',oA);
            line(cx+catR,CY,oL,orchAY,'#7EC8C8',oA*0.15);
        }

        // Intelligence box — top of column
        const iA=ez(pr(t,10.5,11.3))*fade;
        if(iA>0){
            drawRR(colX,intAY,150,60,10,'#0E0E0E','rgba(139,148,158,0.15)',iA);
            lbl('Intelligence',colX,intAY-12,'700 11px Outfit, sans-serif','#8B949E',iA);
            llmIcons.forEach((llm,j)=>{
                const la=ez(pr(t,11+j*0.1,11.5+j*0.1))*fade;
                drawIcon(llm.icon,colX+llm.x,intAY+10,16,la*iA);
            });
            // Orch → Intelligence
            line(oR,oT+5,bL,intAY,'#8B949E',iA*0.12,[3,3]);
        }

        // Memory box — middle of column
        const mA2=ez(pr(t,10.8,11.6))*fade;
        if(mA2>0){
            drawRR(colX,memAY,130,50,10,'#0E0E0E','rgba(90,158,158,0.2)',mA2);
            lbl('Memory',colX,memAY-2,'700 12px Outfit, sans-serif','#5A9E9E',mA2);
            lbl('Org Context',colX,memAY+12,'400 8px Inter, sans-serif','#484F58',mA2);
            // Orch → Memory
            line(oR,orchAY,bL,memAY,'#5A9E9E',mA2*0.12,[3,3]);
        }

        // Agents box — bottom of column
        const agA=ez(pr(t,11,11.8))*fade;
        if(agA>0){
            drawRR(colX,agentAY,130,50,10,'rgba(180,140,255,0.03)','rgba(180,140,255,0.15)',agA);
            lbl('Agents',colX,agentAY-2,'700 11px Outfit, sans-serif','#8B6FC0',agA);
            lbl('MCP Tools',colX,agentAY+12,'400 8px Inter, sans-serif','#5A4A6B',agA);
            // Orch → Agents
            line(oR,oB-5,bL,agentAY,'rgba(180,140,255,0.2)',agA,[3,3]);
        }

        // === ReAct Loop (12-16s) ===
        // All communication goes through Orchestration only.
        // Sequence: O→I, I→O, O→M, M→O, O→I, I→O, O→A, A→O, O→I, I→O, O→M, M→O
        // This runs fast (0.33s per step) and repeats
        if(t>12&&t<16){
            const lt=(t-12);
            ctx.globalAlpha=fade*0.4;

            const reactSteps=[
                // Orch→Intel, Intel→Orch
                {from:[oR,oT+5],to:[bL,intAY],c:'#8B949E'},
                {from:[bL,intAY],to:[oR,oT+5],c:'#8B949E'},
                // Orch→Memory, Memory→Orch
                {from:[oR,orchAY],to:[bL,memAY],c:'#5A9E9E'},
                {from:[bL,memAY],to:[oR,orchAY],c:'#5A9E9E'},
                // Orch→Intel, Intel→Orch
                {from:[oR,oT+5],to:[bL,intAY],c:'#8B949E'},
                {from:[bL,intAY],to:[oR,oT+5],c:'#8B949E'},
                // Orch→Agent, Agent→Orch
                {from:[oR,oB-5],to:[bL,agentAY],c:'#8B6FC0'},
                {from:[bL,agentAY],to:[oR,oB-5],c:'#8B6FC0'},
                // Orch→Intel, Intel→Orch
                {from:[oR,oT+5],to:[bL,intAY],c:'#8B949E'},
                {from:[bL,intAY],to:[oR,oT+5],c:'#8B949E'},
                // Orch→Memory, Memory→Orch
                {from:[oR,orchAY],to:[bL,memAY],c:'#5A9E9E'},
                {from:[bL,memAY],to:[oR,orchAY],c:'#5A9E9E'},
            ];

            const stepDur = 4.0 / reactSteps.length; // ~0.33s each
            reactSteps.forEach((step,i)=>{
                const sS = i*stepDur, sE = sS+stepDur;
                if(lt>=sS && lt<sE+stepDur*0.4){
                    const st=pr(lt,sS,sE);
                    dot(step.from[0],step.from[1],step.to[0],step.to[1],Math.min(1,st),step.c,2.5);
                }
            });
            ctx.globalAlpha=1;
        }

        // Preferences box — below Orchestration
        const pA=ez(pr(t,15.5,16.5))*fade;
        if(pA>0){
            drawRR(prefAX,prefAY,120,40,8,'rgba(180,140,255,0.04)','rgba(180,140,255,0.15)',pA);
            lbl('Preferences',prefAX,prefAY-2,'600 10px Inter, sans-serif','#8B6FC0',pA);
            lbl('User context saved',prefAX,prefAY+11,'400 7px Inter, sans-serif','#5A4A6B',pA);
            line(orchAX,oB,prefAX,prefAY-20,'rgba(180,140,255,0.15)',pA,[3,3]);
        }

        // Save to preferences (parallel with response)
        if(t>15.5&&t<17.5){
            ctx.globalAlpha=fade*0.3;
            dot(orchAX,oB,prefAX,prefAY-20,((t-15.5)*0.5)%1,'#8B6FC0',2);
            ctx.globalAlpha=1;
        }

        // Response: Orch → CatalEx → User (16-18s)
        if(t>16&&t<18.5){
            const rt=((t-16)*0.4)%1;
            ctx.globalAlpha=fade*0.35;
            dot(oL,orchAY,cx+catR,CY,rt,'#7EC8C8',3);
            if(rt>0.4) dot(cx-catR,CY,userLX+15,CY,(rt-0.4)/0.6,'#5A9E9E',3);
            ctx.globalAlpha=1;
        }

        requestAnimationFrame(animate);
    }
    animate();
}
