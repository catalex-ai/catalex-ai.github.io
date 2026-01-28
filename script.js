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

const DEMO_FORM_URL = 'https://script.google.com/macros/s/AKfycbzUoxb49FlTE2E9v85J_2rEPeCMYnDQig-9V-tS-79d4n1PK0UXWSSNiiU1Eua2Vjc1/exec';

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
const FORM_URL = 'https://script.google.com/macros/s/AKfycbzUoxb49FlTE2E9v85J_2rEPeCMYnDQig-9V-tS-79d4n1PK0UXWSSNiiU1Eua2Vjc1/exec';

let currentStep = 0;
const totalSteps = 8;
let isTransitioning = false;
const form = document.getElementById('questionnaireForm');
const nextBtn = document.getElementById('nextBtn');
const errorMsg = document.getElementById('errorMsg');
const currentStepText = document.getElementById('currentStepText');
const navFooter = document.getElementById('navFooter');

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

function validateStep(step) {
    const section = document.querySelector(`.question-container[data-step="${step}"]`);
    if (!section) return true;

    const requiredInputs = section.querySelectorAll('[required]');
    if (requiredInputs.length === 0) return true;

    for (const input of requiredInputs) {
        if (input.type === 'radio') {
            const checked = section.querySelector(`input[name="${input.name}"]:checked`);
            if (!checked) return false;
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
