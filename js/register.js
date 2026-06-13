/**
 * ShopLite Registration Form Validation
 * Performs real-time validation, password strength analysis, and input masking
 * Uses Bootstrap 5 feedback styles (is-valid, is-invalid)
 */

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('registrationForm');
  if (!form) return;

  // DOM Input References
  const fullName = document.getElementById('fullName');
  const email = document.getElementById('email');
  const password = document.getElementById('password');
  const phone = document.getElementById('phone');
  const country = document.getElementById('country');
  const termsCheck = document.getElementById('termsCheck');
  const successAlert = document.getElementById('successAlert');
  const btnRegister = document.getElementById('btnRegister');

  // Password strength visual elements
  const strengthBar = document.getElementById('passwordStrengthBar');
  const strengthBarInner = strengthBar.querySelector('.progress-bar');
  const passwordFeedback = document.getElementById('passwordFeedback');

  /**
   * Helper to set input field status
   * @param {HTMLElement} input - Target input element
   * @param {HTMLElement} errorSpan - Span showing error details
   * @param {string} errorMessage - Error text (empty if valid)
   */
  function setFieldStatus(input, errorSpan, errorMessage) {
    if (errorMessage) {
      input.classList.remove('is-valid');
      input.classList.add('is-invalid');
      // For simplified templates, check if standard class is-invalid is enough, or update nextSibling
      // The simplified register.html template now uses standard Bootstrap .invalid-feedback blocks next to inputs.
      // Let's support both: update textContent of adjacent errorSpan if it exists.
      if (errorSpan) {
        errorSpan.textContent = errorMessage;
      }
      return false; // Field is invalid
    } else {
      input.classList.remove('is-invalid');
      input.classList.add('is-valid');
      if (errorSpan) {
        errorSpan.textContent = '';
      }
      return true; // Field is valid
    }
  }

  /**
   * Gets or creates error placeholder for simplified template compatibility
   */
  function getErrorSpan(input) {
    // If floating validation span exists (like in full template) return it, otherwise return bootstrap invalid-feedback element
    const customSpan = document.getElementById(`${input.id}Error`);
    if (customSpan) return customSpan;
    
    // In simplified template, the error div is the next sibling element with class 'invalid-feedback'
    return input.parentElement.querySelector('.invalid-feedback');
  }

  /**
   * Validates Full Name
   */
  function validateFullName() {
    const value = fullName.value.trim();
    const errorSpan = getErrorSpan(fullName);
    
    if (!value) {
      return setFieldStatus(fullName, errorSpan, 'Full Name is required.');
    }
    
    if (value.length < 3) {
      return setFieldStatus(fullName, errorSpan, 'Full Name must be at least 3 characters.');
    }
    
    // Check for letters and spaces only
    const nameRegex = /^[a-zA-ZÀ-ỹ\s]+$/;
    if (!nameRegex.test(value)) {
      return setFieldStatus(fullName, errorSpan, 'Full Name can only contain alphabetical letters.');
    }
    
    return setFieldStatus(fullName, errorSpan, '');
  }

  /**
   * Validates Email
   */
  function validateEmail() {
    const value = email.value.trim();
    const errorSpan = getErrorSpan(email);
    
    if (!value) {
      return setFieldStatus(email, errorSpan, 'Email address is required.');
    }
    
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(value)) {
      return setFieldStatus(email, errorSpan, 'Please enter a valid email address (e.g. name@domain.com).');
    }
    
    return setFieldStatus(email, errorSpan, '');
  }

  /**
   * Evaluates Password Strength and sets visual progress meter
   */
  function evaluatePasswordStrength(value) {
    if (!strengthBar || !passwordFeedback) return 0;

    if (!value) {
      strengthBar.classList.add('d-none');
      passwordFeedback.classList.add('d-none');
      return 0;
    }
    
    strengthBar.classList.remove('d-none');
    passwordFeedback.classList.remove('d-none');
    
    let score = 0;
    
    // Score criteria
    if (value.length >= 8) score++;
    if (/[a-z]/.test(value)) score++;
    if (/[A-Z]/.test(value)) score++;
    if (/\d/.test(value)) score++;
    if (/[^a-zA-Z\d]/.test(value)) score++; // Special char
    
    // UI Mapping based on score
    let pct = (score / 5) * 100;
    strengthBarInner.style.width = `${pct}%`;
    
    if (score <= 2) {
      strengthBarInner.className = 'progress-bar bg-danger';
      passwordFeedback.textContent = 'Weak Password';
      passwordFeedback.className = 'small text-danger fw-bold';
    } else if (score <= 4) {
      strengthBarInner.className = 'progress-bar bg-warning';
      passwordFeedback.textContent = 'Medium Password';
      passwordFeedback.className = 'small text-warning fw-bold';
    } else {
      strengthBarInner.className = 'progress-bar bg-success';
      passwordFeedback.textContent = 'Strong Password';
      passwordFeedback.className = 'small text-success fw-bold';
    }
    
    return score;
  }

  /**
   * Validates Password
   */
  function validatePassword() {
    const value = password.value;
    const errorSpan = getErrorSpan(password);
    const score = evaluatePasswordStrength(value);

    if (!value) {
      return setFieldStatus(password, errorSpan, 'Password is required.');
    }

    if (value.length < 8) {
      return setFieldStatus(password, errorSpan, 'Password must be at least 8 characters long.');
    }

    if (!/[A-Z]/.test(value) || !/[a-z]/.test(value) || !/\d/.test(value)) {
      return setFieldStatus(password, errorSpan, 'Password must contain uppercase letters, lowercase letters, and numbers.');
    }

    return setFieldStatus(password, errorSpan, '');
  }

  /**
   * Validates Phone Number
   */
  function validatePhone() {
    const value = phone.value.trim();
    const errorSpan = getErrorSpan(phone);
    
    if (!value) {
      return setFieldStatus(phone, errorSpan, 'Phone number is required.');
    }
    
    // Allow numbers starting with 0 or +84, total 10 to 11 digits
    const phoneRegex = /^(0|\+84)(\d{9,10})$/;
    if (!phoneRegex.test(value)) {
      return setFieldStatus(phone, errorSpan, 'Please enter a valid phone number (9-10 digits after prefix).');
    }
    
    return setFieldStatus(phone, errorSpan, '');
  }

  /**
   * Validates Country Dropdown Select
   */
  function validateCountry() {
    const value = country.value;
    const errorSpan = getErrorSpan(country);
    
    if (!value) {
      return setFieldStatus(country, errorSpan, 'Please select your country of residence.');
    }
    
    return setFieldStatus(country, errorSpan, '');
  }

  /**
   * Validates Terms and Conditions checkbox
   */
  function validateTerms() {
    const errorSpan = getErrorSpan(termsCheck);
    
    if (!termsCheck.checked) {
      termsCheck.classList.add('is-invalid');
      if (errorSpan) {
        errorSpan.textContent = 'You must accept the Terms and Conditions to proceed.';
      }
      return false;
    } else {
      termsCheck.classList.remove('is-invalid');
      termsCheck.classList.add('is-valid');
      if (errorSpan) {
        errorSpan.textContent = '';
      }
      return true;
    }
  }

  // --- Live Inline Event Listeners ---
  fullName.addEventListener('input', validateFullName);
  fullName.addEventListener('blur', validateFullName);
  
  email.addEventListener('input', validateEmail);
  email.addEventListener('blur', validateEmail);
  
  password.addEventListener('input', validatePassword);
  password.addEventListener('blur', validatePassword);
  
  phone.addEventListener('input', validatePhone);
  phone.addEventListener('blur', validatePhone);
  
  country.addEventListener('change', validateCountry);
  country.addEventListener('blur', validateCountry);
  
  termsCheck.addEventListener('change', validateTerms);

  // --- Form Submission Event Listener ---
  form.addEventListener('submit', (e) => {
    e.preventDefault(); // Stop default navigation reload

    // Run validations across all inputs
    const isNameValid = validateFullName();
    const isEmailValid = validateEmail();
    const isPasswordValid = validatePassword();
    const isPhoneValid = validatePhone();
    const isCountryValid = validateCountry();
    const isTermsValid = validateTerms();

    const isFormValid = isNameValid && isEmailValid && isPasswordValid && isPhoneValid && isCountryValid && isTermsValid;

    if (isFormValid) {
      // Disable form buttons to prevent double-submits
      btnRegister.disabled = true;
      btnRegister.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Processing...`;
      
      // Show visual success notification banner
      successAlert.classList.remove('d-none');
      
      // Scroll smoothly to top so user sees the success alert
      window.scrollTo({ top: 0, behavior: 'smooth' });

      // Mock submit saving registration to localStorage
      const mockUserData = {
        name: fullName.value.trim(),
        email: email.value.trim(),
        phone: phone.value.trim(),
        country: country.value,
        registeredAt: new Date().toISOString()
      };
      localStorage.setItem('shoplite_user', JSON.stringify(mockUserData));

      // Redirect back to catalog index.html after 3 seconds
      setTimeout(() => {
        window.location.href = 'index.html';
      }, 3000);
    }
  });
});
