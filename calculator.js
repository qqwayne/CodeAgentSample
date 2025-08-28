/**
 * Calculator Application JavaScript
 * 
 * This file contains all the logic for the online calculator application.
 * It handles user input, performs calculations, and manages the display.
 */

// Global variables to track calculator state
let currentInput = '0';      // Current number being entered
let operator = '';           // Current operator (+, -, *, /)
let previousInput = '';      // Previous number for calculation
let waitingForOperand = false; // Flag to determine if we're waiting for a new number

/**
 * Get the display element reference
 * This function ensures we have access to the calculator display
 */
function getDisplay() {
    return document.getElementById('display');
}

/**
 * Update the calculator display with the current input
 * @param {string} value - The value to display
 */
function updateDisplay(value = currentInput) {
    const display = getDisplay();
    display.value = value;
}

/**
 * Append a number to the current input
 * Handles the logic for entering digits 0-9
 * @param {string} number - The digit to append (0-9)
 */
function appendNumber(number) {
    if (waitingForOperand) {
        // If we're waiting for a new operand, start fresh
        currentInput = number;
        waitingForOperand = false;
    } else {
        // Append to existing number, handling the initial '0'
        currentInput = currentInput === '0' ? number : currentInput + number;
    }
    updateDisplay();
}

/**
 * Handle decimal point input
 * Ensures only one decimal point per number
 */
function appendDecimal() {
    if (waitingForOperand) {
        // Start new number with decimal point
        currentInput = '0.';
        waitingForOperand = false;
    } else if (currentInput.indexOf('.') === -1) {
        // Add decimal point only if one doesn't exist
        currentInput += '.';
    }
    updateDisplay();
}

/**
 * Handle operator input (+, -, *, /)
 * Performs calculation if there's a pending operation
 * @param {string} nextOperator - The operator to set
 */
function appendOperator(nextOperator) {
    const inputValue = parseFloat(currentInput);

    // If we have a previous input and operator, calculate first
    if (previousInput !== '' && operator && !waitingForOperand) {
        const result = performCalculation();
        currentInput = String(result);
        previousInput = currentInput; // Update previousInput to the calculated result
        updateDisplay(currentInput);
    } else if (previousInput === '') {
        // First time setting an operator
        previousInput = currentInput;
    }

    // Set up for next operation
    waitingForOperand = true;
    operator = nextOperator;
}

/**
 * Perform the actual calculation based on the operator
 * @returns {number} The result of the calculation
 */
function performCalculation() {
    const prev = parseFloat(previousInput);
    const current = parseFloat(currentInput);
    let result;

    // Perform calculation based on operator
    switch (operator) {
        case '+':
            result = prev + current;
            break;
        case '-':
            result = prev - current;
            break;
        case '*':
            result = prev * current;
            break;
        case '/':
            // Handle division by zero
            if (current === 0) {
                alert('Error: Cannot divide by zero');
                clearDisplay();
                return 0;
            }
            result = prev / current;
            break;
        default:
            return current;
    }

    // Round result to avoid floating point precision issues
    return Math.round(result * 100000000) / 100000000;
}

/**
 * Execute calculation when equals button is pressed
 * Displays the final result and resets for next calculation
 */
function calculate() {
    if (operator && previousInput !== '' && !waitingForOperand) {
        const result = performCalculation();
        
        // Update display and reset state
        currentInput = String(result);
        previousInput = '';
        operator = '';
        waitingForOperand = true;
        updateDisplay();
    }
}

/**
 * Clear the entire calculator (C button)
 * Resets all variables to initial state
 */
function clearDisplay() {
    currentInput = '0';
    previousInput = '';
    operator = '';
    waitingForOperand = false;
    updateDisplay();
}

/**
 * Clear the current entry (CE button)
 * Only clears the current input, preserves previous calculation
 */
function clearEntry() {
    currentInput = '0';
    updateDisplay();
}

/**
 * Delete the last entered character (backspace)
 * Handles deletion of individual digits
 */
function deleteLast() {
    if (currentInput.length > 1) {
        // Remove last character
        currentInput = currentInput.slice(0, -1);
    } else {
        // If only one character, reset to 0
        currentInput = '0';
    }
    updateDisplay();
}

/**
 * Handle keyboard input for calculator operations
 * Allows users to use keyboard instead of clicking buttons
 */
document.addEventListener('keydown', function(event) {
    const key = event.key;
    
    // Handle number keys
    if (key >= '0' && key <= '9') {
        appendNumber(key);
    }
    // Handle operator keys
    else if (key === '+' || key === '-' || key === '*' || key === '/') {
        appendOperator(key);
    }
    // Handle decimal point
    else if (key === '.') {
        appendDecimal();
    }
    // Handle equals/enter
    else if (key === '=' || key === 'Enter') {
        event.preventDefault();
        calculate();
    }
    // Handle backspace
    else if (key === 'Backspace') {
        event.preventDefault();
        deleteLast();
    }
    // Handle escape (clear)
    else if (key === 'Escape') {
        clearDisplay();
    }
});

/**
 * Initialize calculator when page loads
 * Ensures display shows initial value
 */
document.addEventListener('DOMContentLoaded', function() {
    updateDisplay();
});

// Export functions for testing purposes (if running in Node.js environment)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        appendNumber,
        appendDecimal,
        appendOperator,
        performCalculation,
        calculate,
        clearDisplay,
        clearEntry,
        deleteLast
    };
}