export const copyToClipboard = async (text) => {
  if (!text) return false;

  try {
    // Modern API (best case)
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }

    // Fallback for mobile / older browsers
    const textarea = document.createElement("textarea");
    textarea.value = text;

    // Prevent scrolling on iOS
    textarea.style.position = "fixed";
    textarea.style.top = "0";
    textarea.style.left = "0";
    textarea.style.opacity = "0";

    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();

    const success = document.execCommand("copy");
    document.body.removeChild(textarea);

    return success;
  } catch (err) {
    console.error("Clipboard copy failed:", err);
    return false;
  }
};
