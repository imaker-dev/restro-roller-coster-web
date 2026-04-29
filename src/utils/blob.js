import { saveAs } from "file-saver";
import toast from "react-hot-toast";

export function downloadBlob({
  data,
  fileName = "file",
  playSound = true,
  showToast = true,
  onError,
} = {}) {
  try {
    if (!data) {
      toast.error("Nothing to download");
      return;
    }

    const blob =
      data instanceof Blob
        ? data
        : new Blob([data], { type: "application/octet-stream" });

    saveAs(blob, fileName);

    if (playSound && typeof playDownloadSound === "function") {
    //   playDownloadSound();
    }

  } catch (err) {
    console.error("Download failed:", err);

    if (showToast && typeof toast === "function") {
      toast.error("Download failed");
    }

    if (typeof onError === "function") {
      onError(err);
    }
  }
}