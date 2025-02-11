function toggleInstructions() {
    const content = document.querySelector('.instructions-content');
    const icon = document.querySelector('.toggle-icon');
    content.classList.toggle('show');
    icon.classList.toggle('rotated');
}