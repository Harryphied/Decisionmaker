class DecisionMaker {
    constructor() {
        this.options = [];
        this.currentUser = null;
        this.initializeElements();
        this.attachEventListeners();
        this.initializeAuth();
    }

    initializeElements() {
        this.questionInput = document.getElementById('question-input');
        this.optionInput = document.getElementById('option-input');
        this.addOptionBtn = document.getElementById('add-option-btn');
        this.optionsContainer = document.getElementById('options-container');
        this.makeDecisionBtn = document.getElementById('make-decision-btn');
        this.decisionResult = document.getElementById('decision-result');
        
        // Auth elements
        this.authForm = document.getElementById('auth-form');
        this.userInfo = document.getElementById('user-info');
        this.userEmail = document.getElementById('user-email');
        this.emailInput = document.getElementById('email');
        this.passwordInput = document.getElementById('password');
        this.signinBtn = document.getElementById('signin-btn');
        this.signupBtn = document.getElementById('signup-btn');
        this.googleSigninBtn = document.getElementById('google-signin-btn');
        this.signoutBtn = document.getElementById('signout-btn');
    }

    attachEventListeners() {
        // Add option when button is clicked
        this.addOptionBtn.addEventListener('click', () => this.addOption());
        
        // Add option when Enter is pressed in input
        this.optionInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.addOption();
            }
        });

        // Make decision when button is clicked
        this.makeDecisionBtn.addEventListener('click', () => this.makeDecision());

        // Update decision button state when options change
        this.updateDecisionButtonState();
        
        // Auth event listeners
        this.signinBtn.addEventListener('click', (e) => this.handleSignIn(e));
        this.signupBtn.addEventListener('click', (e) => this.handleSignUp(e));
        this.googleSigninBtn.addEventListener('click', (e) => this.handleGoogleSignIn(e));
        this.signoutBtn.addEventListener('click', (e) => this.handleSignOut(e));
    }

    addOption() {
        const optionText = this.optionInput.value.trim();
        
        if (optionText === '') {
            this.showMessage('Please enter an option', 'error');
            return;
        }

        if (this.options.includes(optionText)) {
            this.showMessage('This option already exists', 'error');
            return;
        }

        this.options.push(optionText);
        this.optionInput.value = '';
        this.renderOptions();
        this.updateDecisionButtonState();
    }

    removeOption(optionText) {
        this.options = this.options.filter(option => option !== optionText);
        this.renderOptions();
        this.updateDecisionButtonState();
    }

    renderOptions() {
        // Clear existing options (except the add-option div)
        const existingOptions = this.optionsContainer.querySelectorAll('.option-item');
        existingOptions.forEach(option => option.remove());

        // Add each option
        this.options.forEach((option, index) => {
            const optionElement = document.createElement('div');
            optionElement.className = 'option-item';
            optionElement.innerHTML = `
                <span class="option-text">${option}</span>
                <button class="remove-option-btn" onclick="decisionMaker.removeOption('${option}')">×</button>
            `;
            
            // Insert before the add-option div
            this.optionsContainer.insertBefore(optionElement, this.optionsContainer.firstChild);
        });
    }

    makeDecision() {
        if (this.options.length < 2) {
            this.showMessage('Please add at least 2 options', 'error');
            return;
        }

        // Randomly select an option
        const randomIndex = Math.floor(Math.random() * this.options.length);
        const selectedOption = this.options[randomIndex];
        
        // Show the result with animation
        this.decisionResult.textContent = `🎯 Decision: ${selectedOption}`;
        this.decisionResult.classList.add('show');
        
        // Scroll to result
        this.decisionResult.scrollIntoView({ behavior: 'smooth' });
    }

    updateDecisionButtonState() {
        const hasEnoughOptions = this.options.length >= 2;
        this.makeDecisionBtn.disabled = !hasEnoughOptions;
        
        if (hasEnoughOptions) {
            this.makeDecisionBtn.textContent = 'Make My Decision';
        } else {
            this.makeDecisionBtn.textContent = `Add ${2 - this.options.length} more option${2 - this.options.length === 1 ? '' : 's'}`;
        }
    }

    showMessage(message, type = 'info') {
        // Create a temporary message element
        const messageElement = document.createElement('div');
        messageElement.className = `message message-${type}`;
        messageElement.textContent = message;
        messageElement.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 12px 20px;
            background: ${type === 'error' ? '#e74c3c' : '#3498db'};
            color: white;
            border-radius: 8px;
            font-weight: 600;
            z-index: 1000;
            animation: slideIn 0.3s ease;
        `;
        
        document.body.appendChild(messageElement);
        
        // Remove message after 3 seconds
        setTimeout(() => {
            messageElement.remove();
        }, 3000);
    }

    // Firebase Authentication Methods
    initializeAuth() {
        // Listen for auth state changes
        if (window.onAuthStateChanged && window.auth) {
            window.onAuthStateChanged(window.auth, (user) => {
                this.currentUser = user;
                this.updateAuthUI();
            });
        }
    }

    updateAuthUI() {
        if (this.currentUser) {
            // User is signed in
            this.authForm.style.display = 'none';
            this.userInfo.style.display = 'block';
            this.userEmail.textContent = this.currentUser.email;
        } else {
            // User is signed out
            this.authForm.style.display = 'block';
            this.userInfo.style.display = 'none';
        }
    }

    async handleSignIn(e) {
        e.preventDefault();
        const email = this.emailInput.value;
        const password = this.passwordInput.value;

        if (!email || !password) {
            this.showMessage('Please enter both email and password', 'error');
            return;
        }

        try {
            await window.signInWithEmailAndPassword(window.auth, email, password);
            this.showMessage('Successfully signed in!', 'info');
        } catch (error) {
            this.showMessage(this.getErrorMessage(error.code), 'error');
        }
    }

    async handleSignUp(e) {
        e.preventDefault();
        const email = this.emailInput.value;
        const password = this.passwordInput.value;

        if (!email || !password) {
            this.showMessage('Please enter both email and password', 'error');
            return;
        }

        if (password.length < 6) {
            this.showMessage('Password must be at least 6 characters', 'error');
            return;
        }

        try {
            await window.createUserWithEmailAndPassword(window.auth, email, password);
            this.showMessage('Account created successfully!', 'info');
        } catch (error) {
            this.showMessage(this.getErrorMessage(error.code), 'error');
        }
    }

    async handleGoogleSignIn(e) {
        e.preventDefault();
        try {
            await window.signInWithPopup(window.auth, window.googleProvider);
            this.showMessage('Successfully signed in with Google!', 'info');
        } catch (error) {
            this.showMessage(this.getErrorMessage(error.code), 'error');
        }
    }

    async handleSignOut(e) {
        e.preventDefault();
        try {
            await window.signOut(window.auth);
            this.showMessage('Successfully signed out!', 'info');
        } catch (error) {
            this.showMessage('Error signing out', 'error');
        }
    }

    getErrorMessage(errorCode) {
        switch (errorCode) {
            case 'auth/user-not-found':
                return 'No account found with this email';
            case 'auth/wrong-password':
                return 'Incorrect password';
            case 'auth/email-already-in-use':
                return 'An account with this email already exists';
            case 'auth/weak-password':
                return 'Password is too weak';
            case 'auth/invalid-email':
                return 'Invalid email address';
            case 'auth/too-many-requests':
                return 'Too many failed attempts. Please try again later';
            default:
                return 'Authentication error. Please try again';
        }
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.decisionMaker = new DecisionMaker();
});
