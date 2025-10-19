class DecisionMaker {
    constructor() {
        this.options = [];
        this.initializeElements();
        this.attachEventListeners();
    }

    initializeElements() {
        this.questionInput = document.getElementById('question-input');
        this.optionInput = document.getElementById('option-input');
        this.addOptionBtn = document.getElementById('add-option-btn');
        this.optionsContainer = document.getElementById('options-container');
        this.makeDecisionBtn = document.getElementById('make-decision-btn');
        this.decisionResult = document.getElementById('decision-result');
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
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.decisionMaker = new DecisionMaker();
});
