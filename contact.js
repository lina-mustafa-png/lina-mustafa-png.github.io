const copyButton = document.getElementById('copy-email');
const copyStatus = document.getElementById('copy-status');
copyButton.addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText('lina9.mustafa90@gmail.com');
    copyStatus.textContent = 'Email copied — talk soon!';
  } catch {
    copyStatus.textContent = 'Email: lina9.mustafa90@gmail.com';
  }
});