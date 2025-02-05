class AdvancedCalculator {
    constructor() {
        this.previousOperandElement = document.querySelector('.previous-operand');
        this.currentOperandElement = document.querySelector('.current-operand');
        this.historyElement = document.querySelector('.history');
        this.memory = 0;
        this.history = [];
        this.clear();
        this.setupEventListeners();
        this.setupThemeToggle();
    }

    clear() {
        this.currentOperand = '0';
        this.previousOperand = '';
        this.operation = undefined;
        this.updateDisplay();
    }

    delete() {
        if (this.currentOperand === '0') return;
        this.currentOperand = this.currentOperand.slice(0, -1);
        if (this.currentOperand === '') this.currentOperand = '0';
    }

    appendNumber(number) {
        if (number === '.' && this.currentOperand.includes('.')) return;
        if (this.currentOperand === '0' && number !== '.') {
            this.currentOperand = number;
        } else {
            this.currentOperand += number;
        }
    }

    chooseOperation(operation) {
        if (this.currentOperand === '0') return;
        if (this.previousOperand !== '') {
            this.compute();
        }
        this.operation = operation;
        this.previousOperand = this.currentOperand;
        this.currentOperand = '0';
    }

    compute() {
        let computation;
        const prev = parseFloat(this.previousOperand);
        const current = parseFloat(this.currentOperand);
        
        if (isNaN(prev) || isNaN(current)) return;

        switch (this.operation) {
            case '+':
                computation = prev + current;
                break;
            case '-':
                computation = prev - current;
                break;
            case '×':
                computation = prev * current;
                break;
            case '÷':
                if (current === 0) {
                    alert('Cannot divide by zero!');
                    return;
                }
                computation = prev / current;
                break;
            default:
                return;
        }

        // Add to history
        this.addToHistory(`${prev} ${this.operation} ${current} = ${computation}`);
        
        this.currentOperand = computation.toString();
        this.operation = undefined;
        this.previousOperand = '';
    }

    executeFunction(func) {
        const current = parseFloat(this.currentOperand);
        let result;

        switch (func) {
            case 'sin':
                result = Math.sin(current * Math.PI / 180);
                break;
            case 'cos':
                result = Math.cos(current * Math.PI / 180);
                break;
            case 'tan':
                result = Math.tan(current * Math.PI / 180);
                break;
            case 'log':
                if (current <= 0) {
                    alert('Invalid input for logarithm!');
                    return;
                }
                result = Math.log10(current);
                break;
            case 'ln':
                if (current <= 0) {
                    alert('Invalid input for natural logarithm!');
                    return;
                }
                result = Math.log(current);
                break;
            case 'sqrt':
                if (current < 0) {
                    alert('Cannot calculate square root of negative number!');
                    return;
                }
                result = Math.sqrt(current);
                break;
            case 'power':
                this.chooseOperation('^');
                return;
            case 'pi':
                result = Math.PI;
                break;
            case 'e':
                result = Math.E;
                break;
            case 'factorial':
                if (current < 0 || !Number.isInteger(current)) {
                    alert('Factorial is only defined for positive integers!');
                    return;
                }
                result = this.factorial(current);
                break;
        }

        this.addToHistory(`${func}(${current}) = ${result}`);
        this.currentOperand = result.toString();
    }

    factorial(n) {
        if (n === 0 || n === 1) return 1;
        return n * this.factorial(n - 1);
    }

    addToHistory(entry) {
        this.history.push(entry);
        if (this.history.length > 5) this.history.shift();
        this.updateHistory();
    }

    updateHistory() {
        this.historyElement.innerHTML = this.history.join('<br>');
    }

    updateDisplay() {
        this.currentOperandElement.textContent = this.currentOperand;
        if (this.operation != null) {
            this.previousOperandElement.textContent = `${this.previousOperand} ${this.operation}`;
        } else {
            this.previousOperandElement.textContent = this.previousOperand;
        }
    }

    setupThemeToggle() {
        const themeToggle = document.getElementById('themeToggle');
        const icon = themeToggle.querySelector('i');
        
        themeToggle.addEventListener('click', () => {
            document.body.dataset.theme = document.body.dataset.theme === 'dark' ? 'light' : 'dark';
            icon.className = document.body.dataset.theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        });
    }

    setupEventListeners() {
        // Number buttons
        document.querySelectorAll('.number').forEach(button => {
            button.addEventListener('click', () => {
                this.appendNumber(button.innerText);
                this.updateDisplay();
            });
        });

        // Operator buttons
        document.querySelectorAll('.operator').forEach(button => {
            button.addEventListener('click', () => {
                this.chooseOperation(button.innerText);
                this.updateDisplay();
            });
        });

        // Function buttons
        document.querySelectorAll('.function').forEach(button => {
            button.addEventListener('click', () => {
                this.executeFunction(button.dataset.function);
                this.updateDisplay();
            });
        });

        // Memory buttons
        document.getElementById('mc').addEventListener('click', () => {
            this.memory = 0;
        });

        document.getElementById('mr').addEventListener('click', () => {
            this.currentOperand = this.memory.toString();
            this.updateDisplay();
        });

        document.getElementById('m+').addEventListener('click', () => {
            this.memory += parseFloat(this.currentOperand);
        });

        document.getElementById('m-').addEventListener('click', () => {
            this.memory -= parseFloat(this.currentOperand);
        });

        // Other buttons
        document.querySelector('.equals').addEventListener('click', () => {
            this.compute();
            this.updateDisplay();
        });

        document.querySelector('.clear').addEventListener('click', () => {
            this.clear();
            this.updateDisplay();
        });

        document.querySelector('.delete').addEventListener('click', () => {
            this.delete();
            this.updateDisplay();
        });

        // Keyboard support
        document.addEventListener('keydown', (e) => {
            if (e.key >= '0' && e.key <= '9' || e.key === '.') {
                this.appendNumber(e.key);
            } else if (e.key === '+' || e.key === '-' || e.key === '*' || e.key === '/') {
                const operationMap = { '*': '×', '/': '÷' };
                this.chooseOperation(operationMap[e.key] || e.key);
            } else if (e.key === 'Enter' || e.key === '=') {
                e.preventDefault();
                this.compute();
            } else if (e.key === 'Backspace') {
                this.delete();
            } else if (e.key === 'Escape') {
                this.clear();
            }
            this.updateDisplay();
        });
    }
}

// Initialize the calculator
const calculator = new AdvancedCalculator();
