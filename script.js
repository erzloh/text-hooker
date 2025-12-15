let textDisplay = document.getElementById('text-display');
const refreshBtn = document.getElementById('refresh-btn');
const editBtn = document.getElementById('edit-btn');
const deleteBtn = document.getElementById('delete-btn');
const textContainer = document.getElementById('text-container');
const backwardBtn = document.getElementById('backward-btn');
const forwardBtn = document.getElementById('forward-btn');

let textHistory = [];
let historyIndex = -1;


let isEditing = false;

function updateHistoryButtons() {
    backwardBtn.disabled = historyIndex <= 0;
    forwardBtn.disabled = historyIndex >= textHistory.length - 1;
}

function addHistoryEntry(text) {
    if (historyIndex < textHistory.length - 1) {
        textHistory = textHistory.slice(0, historyIndex + 1);
    }
    textHistory.push(text);
    historyIndex = textHistory.length - 1;

    localStorage.setItem('textHistory', JSON.stringify(textHistory));
    localStorage.setItem('historyIndex', historyIndex);

    updateHistoryButtons();
}

function autoResize(element) {
    element.style.height = 'auto';
    element.style.height = element.scrollHeight + 'px';
}

async function getClipboardText() {
    if (!navigator.clipboard) {
        const message = 'Clipboard API not supported in this browser.';
        if (isEditing) {
            const textArea = textContainer.querySelector('textarea');
            if (textArea) {
                textArea.value = message;
                autoResize(textArea);
                textArea.focus();
            }
        } else {
            textDisplay.textContent = message;
        }
        return;
    }
    try {
        const text = await navigator.clipboard.readText();
        addHistoryEntry(text);
        if (isEditing) {
            const textArea = textContainer.querySelector('textarea');
            if (textArea) {
                textArea.value = text;
                autoResize(textArea);
                textArea.focus();
            }
        } else {
            textDisplay.textContent = text;
        }
    } catch (err) {
        console.error('Failed to read clipboard contents: ', err);
        const message = 'Failed to read clipboard. Please grant permission in your browser.';
        if (isEditing) {
            const textArea = textContainer.querySelector('textarea');
            if (textArea) {
                textArea.value = message;
                autoResize(textArea);
                textArea.focus();
            }
        } else {
            textDisplay.textContent = message;
        }
    }
}

refreshBtn.addEventListener('click', getClipboardText);

deleteBtn.addEventListener('click', () => {
    if (isEditing) {
        const textArea = textContainer.querySelector('textarea');
        if (textArea) {
            textArea.value = '';
            autoResize(textArea);
            textArea.focus();
        }
    } else {
        textDisplay.textContent = '';
        addHistoryEntry('');
    }
});

backwardBtn.addEventListener('click', () => {
    if (historyIndex > 0) {
        historyIndex--;
        localStorage.setItem('historyIndex', historyIndex);
        const newText = textHistory[historyIndex];
        if (isEditing) {
            const textArea = textContainer.querySelector('textarea');
            if (textArea) {
                textArea.value = newText;
                autoResize(textArea);
                textArea.focus();
            }
        } else {
            textDisplay.textContent = newText;
        }
        updateHistoryButtons();
    }
});

forwardBtn.addEventListener('click', () => {
    if (historyIndex < textHistory.length - 1) {
        historyIndex++;
        localStorage.setItem('historyIndex', historyIndex);
        const newText = textHistory[historyIndex];
        if (isEditing) {
            const textArea = textContainer.querySelector('textarea');
            if (textArea) {
                textArea.value = newText;
                autoResize(textArea);
                textArea.focus();
            }
        } else {
            textDisplay.textContent = newText;
        }
        updateHistoryButtons();
    }
});

const editIcon = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" width="24" height="24"><path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" /></svg>`;
const saveIcon = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" width="24" height="24"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>`;

editBtn.addEventListener('click', () => {
    isEditing = !isEditing;

    if (isEditing) {
        const currentText = textDisplay.textContent;
        const textArea = document.createElement('textarea');
        textArea.value = currentText;

        textContainer.innerHTML = '';
        textContainer.appendChild(textArea);

        textArea.addEventListener('input', () => autoResize(textArea));

        // Initial resize
        autoResize(textArea);

        textArea.setAttribute('lang', 'ja');
        textArea.setAttribute('inputmode', 'text');
        textArea.focus();
        editBtn.innerHTML = saveIcon;
    } else {
        const textArea = textContainer.querySelector('textarea');
        const newText = textArea.value;
        addHistoryEntry(newText);
        textContainer.innerHTML = '';
        const newTextDisplay = document.createElement('div');
        newTextDisplay.id = 'text-display';
        textContainer.appendChild(newTextDisplay);
        textDisplay = newTextDisplay; // Re-assign textDisplay to the new element
        textDisplay.textContent = newText;
        editBtn.innerHTML = editIcon;
    }
});

function setHeight() {
    document.documentElement.style.height = `${window.innerHeight}px`;
}

window.addEventListener('resize', setHeight);

window.addEventListener('load', () => {
    setHeight();

    const storedHistory = localStorage.getItem('textHistory');
    const storedIndex = localStorage.getItem('historyIndex');

    if (storedHistory && storedIndex !== null) {
        textHistory = JSON.parse(storedHistory);
        historyIndex = parseInt(storedIndex, 10);

        if (textHistory.length > 0 && historyIndex >= 0 && historyIndex < textHistory.length) {
            textDisplay.textContent = textHistory[historyIndex];
            updateHistoryButtons();
        } else {
            localStorage.removeItem('textHistory');
            localStorage.removeItem('historyIndex');
            getClipboardText();
        }
    } else {
        getClipboardText();
    }
});
