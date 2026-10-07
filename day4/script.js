// 1. Select elements
const noteText = document.getElementById('note-text');
const charCount = document.getElementById('char-count');
const wordCount = document.getElementById('word-count');
const clearBtn = document.getElementById('clear-btn');
const themeToggle = document.getElementById('theme-toggle');

// 2. Function to update counts and classes
function updateCounts() {
    const text = noteText.value;
    const length = text.length;
    
    // Calculate words (trim spaces, split by whitespace, handle empty case)
    const words = text.trim() === "" ? 0 : text.trim().split(/\s+/).length;

    // Update text
    charCount.textContent = `${length} / 200 characters`;
    wordCount.textContent = `${words} words`;

    // Reset and apply warning/over classes
    charCount.classList.remove('warning', 'over');
    if (length > 200) {
        charCount.classList.add('over');
    } else if (length > 180) {
        charCount.classList.add('warning');
    }
}

// 3. Function to clear text, counts, and storage
function clearEverything() {
    noteText.value = '';
    updateCounts();
    localStorage.removeItem('draftNote');
}

// 4. Event Listeners
// Input event: Update count and save to localStorage on every keystroke
noteText.addEventListener('input', () => {
    updateCounts();
    localStorage.setItem('draftNote', noteText.value);
});

// Clear button event
clearBtn.addEventListener('click', clearEverything);

// Escape key event inside textarea
noteText.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        clearEverything();
    }
});

// Theme toggle event
themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark');
    const isDark = document.body.classList.contains('dark');
    
    // Update button text and save choice to localStorage
    themeToggle.textContent = isDark ? 'Light mode' : 'Dark mode';
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
});

// 5. Page Load Initialization
function init() {
    // Restore saved draft
    const savedDraft = localStorage.getItem('draftNote');
    if (savedDraft) {
        noteText.value = savedDraft;
    }

    // Restore saved theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark');
        themeToggle.textContent = 'Light mode';
    }

    // Run count update immediately to reflect restored data
    updateCounts();
}

// Start the app
init();