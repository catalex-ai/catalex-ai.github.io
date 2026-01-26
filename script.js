const FORM_URL = 'https://script.google.com/macros/s/AKfycbxg6l_N12IKIKyIEWzFe6GOBLs5NoIrgXm-9GffADh0s9Yz-GNpjvvcZqaEwaFG6Luv/exec';

let currentStep = 0;
const totalSteps = 8;
let isTransitioning = false;
const form = document.getElementById('questionnaireForm');
const nextBtn = document.getElementById('nextBtn');
const errorMsg = document.getElementById('errorMsg');
const currentStepText = document.getElementById('currentStepText');
const navFooter = document.getElementById('navFooter');

// Progress Mapping
function updateProgress() {
    currentStepText.textContent = currentStep;
    // Hide footer on welcome screen
    if (currentStep === 0) {
        navFooter.style.display = 'none';
    } else {
        navFooter.style.display = 'flex';
        setTimeout(() => navFooter.style.opacity = '1', 50);
    }
}

// Focus helper
function focusInput(step) {
    const section = document.querySelector(`.question-container[data-step="${step}"]`);
    if (!section) return;
    const input = section.querySelector('input:not([type="radio"]):not([type="checkbox"]), textarea');
    if (input) input.focus();
}

// Step Navigation
window.nextStep = async function () {
    if (isTransitioning || currentStep > totalSteps) return;

    // Validate current step
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

// Form Submission
async function submitForm() {
    if (FORM_URL.includes('YOUR_GOOGLE_APPS_SCRIPT_URL_HERE')) {
        showError('Backend URL not configured. Please check script.js.');
        return;
    }

    const formData = new FormData(form);
    const data = {};

    // Special handling for improvements (checkboxes)
    const improvements = formData.getAll('improvements');
    data.improvements = improvements.join(', ');

    formData.forEach((value, key) => {
        if (key !== 'improvements' && key !== 'pain_scale' && key !== 'value_scale') {
            data[key] = value;
        }
    });

    // Ensure numeric values for scales
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

        // Show Success
        const lastSection = document.querySelector(`.question-container[data-step="${totalSteps}"]`);
        lastSection.classList.remove('active');
        setTimeout(() => {
            lastSection.style.display = 'none';
            navFooter.style.display = 'none';
            const successView = document.getElementById('successView');
            successView.style.display = 'block';
            setTimeout(() => {
                successView.classList.add('active');
            }, 50);
        }, 400);

    } catch (error) {
        console.error('Submission error:', error);
        showError('Submission failed. Please check your connection.');
        nextBtn.disabled = false;
        nextBtn.innerHTML = 'Try Again';
    }
}

// Interaction Listeners
nextBtn.addEventListener('click', (e) => {
    e.preventDefault();
    nextStep();
});

// Keyboard Support
document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        const activeSection = document.querySelector('.question-container.active');
        if (activeSection) {
            const isTextarea = activeSection.querySelector('textarea') === document.activeElement;
            if (isTextarea) e.preventDefault();
            nextStep();
        }
    }

    // Choice Keys (A, B, C...)
    const activeSection = document.querySelector('.question-container.active');
    if (activeSection && !['TEXTAREA', 'INPUT'].includes(document.activeElement.tagName)) {
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

// Selection Visuals
function handleSelection(element) {
    const parent = element.closest('.question-container');
    if (parent) {
        // If it's a radio inside the element, deselect others
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
    if (parentLabel.classList.contains('choice-item') || parentLabel.classList.contains('scale-item')) {
        handleSelection(parentLabel);
        if (e.target.type === 'radio') {
            setTimeout(nextStep, 500);
        }
    }
});

// Initial Setup
window.addEventListener('load', () => {
    document.querySelectorAll('.question-container').forEach(c => {
        if (c.getAttribute('data-step') !== "0") {
            c.style.display = 'none';
        }
    });
    updateProgress();
});
