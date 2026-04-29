import React, { useEffect, useMemo } from "react";
import { Fancybox } from "@fancyapps/ui";
import "@fancyapps/ui/dist/fancybox/fancybox.css";
import { Play, ImageOff } from "lucide-react";

const VIDEO_EXTENSIONS = ["mp4", "webm", "ogg"];
const PLACEHOLDER_SRC = "/Images/placeholder-media.jpg"; // optional

const isVideo = (url) => {
  if (!url || typeof url !== "string") return false;
  const ext = url.split(".").pop()?.toLowerCase();
  return VIDEO_EXTENSIONS.includes(ext);
};

const LightboxMedia = ({ src, caption = "", alt = "", className = "" }) => {
  const hasMedia = Boolean(src);
  const video = useMemo(() => isVideo(src), [src]);

  useEffect(() => {
    Fancybox.bind('[data-fancybox="media"]', {
      Html5Video: {
        autoplay: true,
        controls: true,
      },
    });

    return () => {
      Fancybox.unbind('[data-fancybox="media"]');
      Fancybox.close();
    };
  }, []);

  /* ----------------------------
     🔹 PLACEHOLDER (NO MEDIA)
  ----------------------------- */
  if (!hasMedia) {
    return (
      <div className="relative overflow-hidden cursor-not-allowed">
        {/* <ImageOff className="h-6 w-6 text-slate-400" /> */}
        <img
          src={PLACEHOLDER_SRC}
          alt="No media"
          className={`bg-slate-100 object-cover ${className}`}
        />
      </div>
    );
  }

  return (
    <a
      href={src}
      data-fancybox="media"
      data-caption={caption}
      {...(video && { "data-type": "html5video" })}
      className="relative block overflow-hidden"
    >
      {video ? (
        <>
          <video
            src={src}
            muted
            playsInline
            preload="metadata"
            className={`cursor-pointer ${className}`}
          />

          <span className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span className="w-11 h-11 flex items-center justify-center bg-black/60 text-white rounded-full p-3">
              <Play />
            </span>
          </span>
        </>
      ) : (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          className={`cursor-pointer hover:opacity-90 transition ${className}`}
        />
      )}
    </a>
  );
};

export default LightboxMedia;
