let textDisplay = document.getElementById('text-display');
const refreshBtn = document.getElementById('refresh-btn');
const editBtn = document.getElementById('edit-btn');
const deleteBtn = document.getElementById('delete-btn');
const textContainer = document.getElementById('text-container');

let isEditing = false;

async function getClipboardText() {
    if (!navigator.clipboard) {
        textDisplay.textContent = 'Clipboard API not supported in this browser.';
        return;
    }
    try {
        const text = await navigator.clipboard.readText();
        textDisplay.textContent = text;
    } catch (err) {
        console.error('Failed to read clipboard contents: ', err);
        textDisplay.textContent = 'Failed to read clipboard. Please grant permission in your browser.';
    }
}

refreshBtn.addEventListener('click', getClipboardText);

deleteBtn.addEventListener('click', () => {
    if (isEditing) {
        const textArea = textContainer.querySelector('textarea');
        textArea.value = '';
    } else {
        textDisplay.textContent = '';
    }
});

editBtn.addEventListener('click', () => {
    isEditing = !isEditing;

    if (isEditing) {
        const currentText = textDisplay.textContent;
        const textArea = document.createElement('textarea');
        textArea.value = currentText;
        textContainer.innerHTML = '';
        textContainer.appendChild(textArea);
        textArea.setAttribute('lang', 'ja');
        textArea.setAttribute('inputmode', 'text');
        textArea.focus();
        editBtn.textContent = 'Save';
    } else {
        const textArea = textContainer.querySelector('textarea');
        const newText = textArea.value;
        textContainer.innerHTML = '';
        const newTextDisplay = document.createElement('div');
        newTextDisplay.id = 'text-display';
        textContainer.appendChild(newTextDisplay);
        textDisplay = newTextDisplay; // Re-assign textDisplay to the new element
        textDisplay.textContent = newText;
        editBtn.textContent = 'Edit';
    }
});

window.addEventListener('load', getClipboardText);

function setHeight() {
    document.documentElement.style.height = `${window.innerHeight}px`;
}

window.addEventListener('resize', setHeight);
window.addEventListener('load', setHeight);
