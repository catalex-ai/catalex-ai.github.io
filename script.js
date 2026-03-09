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

// Typewriter Effect - cycles through phrases
(function() {
    const phrases = ['Ask your docs.', 'Deploy agents.', 'Automate work.'];
    const el = document.getElementById('typewriter');
    if (!el) return;

    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let timeout;

    function type() {
        const current = phrases[phraseIndex];
        if (isDeleting) {
            el.textContent = current.substring(0, charIndex - 1);
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

    if (hash === '#/forms/get-started' || hash === '#/forms/get-started/') {
        homepage.classList.remove('active');
        getStarted.classList.add('active');
        currentStep = 0; // Reset get-started if needed
        updateProgress();
    } else {
        getStarted.classList.remove('active');
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
