const copyButton = document.getElementById("copy-email");
const copyStatus = document.getElementById("copy-status");

if (copyButton && copyStatus) {
    copyButton.addEventListener("click", async () => {
        try {
            await navigator.clipboard.writeText("lina9.mustafa90@gmail.com");
            copyStatus.textContent = "Email copied!";
        } catch {
            copyStatus.textContent =
                "Please copy the email address above manually.";
        }
    });
}