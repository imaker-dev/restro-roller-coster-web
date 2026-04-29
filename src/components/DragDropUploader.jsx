import { useState, useCallback, useRef } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, X, Crop, Info } from "lucide-react";
import Cropper from "react-easy-crop";
import Api from "../redux/api.js";
import ModalBasic from "./ModalBasic.jsx";
import { getFullFileUrl } from "../utils/fileUrl.js";
import { formatFileSize } from "../utils/formatFileSize.js";

const DragDropUploader = ({
  value = [],
  onChange,
  multiple = false,
  accept = "image/*",
  maxFiles = 5,
  maxSize = 5 * 1024 * 1024,
  className = "",
  size = "lg",
  uploadToServer = false,
  enableCrop = false, // New prop: enable cropping feature
  aspectRatio = 1, // New prop: crop aspect ratio
}) => {
  const files = Array.isArray(value) ? value : value ? [value] : [];

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [croppingFile, setCroppingFile] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const canvasRef = useRef(null);

  const sizeConfig = {
    sm: {
      container: "min-h-[44px] p-2",
      icon: "w-4 h-4",
      iconContainer: "w-8 h-8",
      title: "text-xs font-medium",
      subtitle: "text-xs",
      info: "text-xs",
      preview: "w-16 h-16",
      removeBtn: "w-4 h-4",
      removeIcon: "w-3 h-3",
    },
    md: {
      container: "min-h-[80px] p-3",
      icon: "w-5 h-5",
      iconContainer: "w-10 h-10",
      title: "text-sm font-semibold",
      subtitle: "text-xs",
      info: "text-xs",
      preview: "w-16 h-16",
      removeBtn: "w-5 h-5",
      removeIcon: "w-3 h-3",
    },
    lg: {
      container: "min-h-[120px] p-4",
      icon: "w-6 h-6",
      iconContainer: "w-12 h-12",
      title: "text-sm font-semibold",
      subtitle: "text-xs",
      info: "text-xs",
      preview: "w-20 h-20",
      removeBtn: "w-6 h-6",
      removeIcon: "w-3 h-3",
    },
  };

  const config = sizeConfig[size];

  // Validate file size & type
  const validateFile = (file) => {
    if (typeof file === "string") return null;
    if (file.size > maxSize)
      return `File ${file.name} is too large. Maximum size is ${formatFileSize(maxSize)}`;

    if (accept) {
      const acceptedTypes = accept.split(",");
      let isAccepted = false;
      for (const type of acceptedTypes) {
        if (type === "*/*") {
          isAccepted = true;
          break;
        }
        if (type.endsWith("/*")) {
          const category = type.split("/")[0];
          if (file.type.startsWith(`${category}/`)) {
            isAccepted = true;
            break;
          }
        } else if (
          file.type === type ||
          file.name.endsWith(type.replace("*", ""))
        ) {
          isAccepted = true;
          break;
        }
      }
      if (!isAccepted)
        return `File type not supported. Accepted types: ${accept}`;
    }
    return null;
  };

  // Crop image functionality
  const createImage = (url) =>
    new Promise((resolve, reject) => {
      const image = new Image();
      image.addEventListener("load", () => resolve(image));
      image.addEventListener("error", (error) => reject(error));
      image.setAttribute("crossOrigin", "anonymous"); // Needed to avoid CORS issues
      image.src = url;
    });

  const getCroppedImg = async (imageSrc, pixelCrop) => {
    const image = await createImage(imageSrc);
    const canvas = canvasRef.current || document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (!canvasRef.current) {
      canvasRef.current = canvas;
    }

    // Set canvas size to the cropped size
    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;

    // Draw the cropped image onto the canvas
    ctx.drawImage(
      image,
      pixelCrop.x,
      pixelCrop.y,
      pixelCrop.width,
      pixelCrop.height,
      0,
      0,
      pixelCrop.width,
      pixelCrop.height,
    );

    // Return a promise that resolves with the cropped image as a blob
    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        resolve(blob);
      }, "image/jpeg");
    });
  };

  // Handle crop completion
  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  // Apply crop and save the image
  const applyCrop = async () => {
    if (!croppingFile || !croppedAreaPixels) return;

    try {
      const croppedImageBlob = await getCroppedImg(
        croppingFile.preview,
        croppedAreaPixels,
      );

      // Create a new file from the cropped blob
      const croppedFile = new File(
        [croppedImageBlob],
        `cropped-${croppingFile.name}`,
        { type: "image/jpeg" },
      );

      // Add the cropped file to the files list
      handleFiles([croppedFile]);

      // Clean up
      if (croppingFile.preview.startsWith("blob:")) {
        URL.revokeObjectURL(croppingFile.preview);
      }

      // Close the crop modal
      setCroppingFile(null);
      setCrop({ x: 0, y: 0 });
      setZoom(1);
      setCroppedAreaPixels(null);
    } catch (error) {
      console.error("Error cropping image:", error);
      setError("Failed to crop image");
    }
  };

  // Cancel cropping
  const cancelCrop = () => {
    if (croppingFile && croppingFile.preview.startsWith("blob:")) {
      URL.revokeObjectURL(croppingFile.preview);
    }
    setCroppingFile(null);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setCroppedAreaPixels(null);
  };

  // Conditional upload or keep locally
  const handleFiles = async (newFiles) => {
    setError("");
    const fileArray = Array.from(newFiles);

    // Validation
    for (const file of fileArray) {
      const error = validateFile(file);
      if (error) {
        setError(error);
        return;
      }
    }

    let updatedFiles = multiple ? [...files] : [];

    if (uploadToServer) {
      setLoading(true);
      try {
        const formData = new FormData();
        fileArray.forEach((file) => formData.append("images", file));

        const res = await Api.post("/upload/images", formData);

        const uploadedFiles = res.data?.data?.files || [];
        const uploadedPaths = uploadedFiles.map((file) => file.path);

        updatedFiles = multiple
          ? [...files, ...uploadedPaths].slice(0, maxFiles)
          : [uploadedPaths[0]];
      } catch (err) {
        setError(err.message || "Failed to upload files.");
        return;
      } finally {
        setLoading(false);
      }
    } else {
      updatedFiles = multiple
        ? [...files, ...fileArray].slice(0, maxFiles)
        : [fileArray[0]];
    }

    onChange(updatedFiles);
  };

  const removeFile = (index) => {
    const updatedFiles = files.filter((_, i) => i !== index);
    onChange(updatedFiles);
  };

  const onDrop = useCallback(
    (acceptedFiles, rejectedFiles) => {
      if (rejectedFiles && rejectedFiles.length > 0) {
        const firstRejection = rejectedFiles[0];
        if (firstRejection.errors[0].code === "file-too-large") {
          setError(
            `File is too large. Maximum size is ${formatFileSize(maxSize)}`,
          );
        } else if (firstRejection.errors[0].code === "file-invalid-type") {
          setError(`File type not supported. Accepted types: ${accept}`);
        }
        return;
      }

      if (acceptedFiles && acceptedFiles.length > 0) {
        // If cropping is enabled and it's an image, open crop modal
        if (enableCrop && acceptedFiles[0].type.startsWith("image/")) {
          const file = acceptedFiles[0];
          setCroppingFile({
            file,
            preview: URL.createObjectURL(file),
            name: file.name,
          });
        } else {
          handleFiles(acceptedFiles);
        }
      }
    },
    [files, multiple, maxFiles, uploadToServer, enableCrop],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple,
    // accept: accept === "*/*" ? undefined : { [accept]: [] },
    accept:
      accept === "*/*"
        ? undefined
        : accept.split(",").reduce((acc, type) => {
            acc[type.trim()] = [];
            return acc;
          }, {}),
    maxSize,
    maxFiles: multiple ? maxFiles : 1,
  });

  // Crop an existing file from the preview
  const cropExistingFile = (file, index) => {
    if (typeof file === "string") {
      // For uploaded URLs, we need to fetch the image
      fetch(file)
        .then((res) => res.blob())
        .then((blob) => {
          const fileObj = new File([blob], `image-${index}.jpg`, {
            type: "image/jpeg",
          });
          setCroppingFile({
            file: fileObj,
            preview: file,
            name: `image-${index}.jpg`,
            originalIndex: index,
          });
        })
        .catch((err) => {
          console.error("Error fetching image for cropping:", err);
          setError("Failed to load image for cropping");
        });
    } else {
      setCroppingFile({
        file,
        preview: URL.createObjectURL(file),
        name: file.name,
        originalIndex: index,
      });
    }
  };

  return (
    <div className={`w-full ${className}`}>
      {/* Crop Modal */}
      <ModalBasic
        id={"image-crop"}
        title={"Crop Image"}
        isOpen={croppingFile}
        onClose={cancelCrop}
        size="2xl"
      >
        <div className="p-4">
          <div className="relative h-96 w-full bg-gray-900">
            <Cropper
              image={croppingFile?.preview}
              crop={crop}
              zoom={zoom}
              aspect={aspectRatio}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
              cropShape="rect"
              showGrid={true}
              objectFit="contain"
              classes={{
                containerClassName: "rounded-lg",
                cropAreaClassName: "border-2 border-primary-500",
              }}
            />
          </div>

          <div className="mt-4 flex gap-3 justify-end">
            <button
              type="button"
              onClick={cancelCrop}
              className="btn border border-gray-300 text-gray-700 hover:bg-gray-50 "
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={applyCrop}
              className="btn bg-primary-500 text-white hover:bg-primary-600 "
            >
              Apply Crop
            </button>
          </div>
        </div>
      </ModalBasic>

      {/* Hidden canvas for cropping */}
      <canvas ref={canvasRef} style={{ display: "none" }} />

      {/* Upload Area */}
      <div
        {...getRootProps()}
        className={`relative border-2 border-dashed rounded-xl text-center cursor-pointer transition-all duration-300 flex items-center justify-center ${
          config.container
        } ${
          isDragActive
            ? "border-primary-500 bg-primary-100 scale-[1.02]"
            : "border-gray-300 hover:border-primary-400 hover:bg-primary-100"
        }`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center space-y-2">
          <div
            className={`rounded-full flex items-center justify-center transition-all duration-300 ${
              config.iconContainer
            } ${
              isDragActive
                ? "bg-primary-100 scale-110"
                : "bg-gradient-to-br from-gray-100 to-gray-200"
            }`}
          >
            <Upload
              className={`${config.icon} transition-colors ${
                isDragActive ? "text-primary-600" : "text-gray-500"
              }`}
            />
          </div>
          <div>
            <p className={`${config.title} text-gray-900`}>
              {isDragActive ? "Drop files here" : "Upload files"}
            </p>
            <p className={`${config.subtitle} text-gray-500 mt-1`}>
              Drag and drop files here, or click to browse
            </p>
            <p className={`${config.info} text-gray-400 mt-2`}>
              {accept.includes("image") ? "Images only" : "All files"} • Max{" "}
              {formatFileSize(maxSize)} •{" "}
              {multiple ? `Up to ${maxFiles} files` : "Single file"}
              {enableCrop && accept.includes("image") && " • Crop available"}
            </p>
          </div>
        </div>
        {loading && (
          <div className="absolute inset-0 bg-black/20 flex items-center justify-center text-white font-semibold">
            Uploading...
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600 flex items-center gap-2">
            <Info className="w-4 h-4" /> {error}
          </p>
        </div>
      )}

      {/* File Previews */}
      {files.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-3">
          {files.map((file, index) => {
            const isString = typeof file === "string";
            const isVideo = isString
              ? file.includes(".mp4") ||
                file.includes(".webm") ||
                file.includes(".mov")
              : file.type?.startsWith("video/");
            const isImage = isString
              ? /\.(jpg|jpeg|png|gif|webp)$/i.test(file)
              : file.type?.startsWith("image/");

            // const fileUrl = getFullFileUrl(file);
            const fileUrl =
              typeof file === "string"
                ? getFullFileUrl(file)
                : URL.createObjectURL(file);
            const fileName = isString ? "Uploaded File" : file.name;

            // Only show crop button for local File objects (not strings)
            const canCrop =
              enableCrop && isImage && !isString && file instanceof File;

            return (
              <div key={index} className="relative group">
                <div
                  className={`bg-gray-100 rounded-lg overflow-hidden border-2 border-gray-200 hover:border-primary-300 transition-all duration-200 ${config.preview}`}
                >
                  {isVideo ? (
                    <video
                      className="w-full h-full object-cover"
                      autoPlay
                      muted
                      loop
                      playsInline
                      disablePictureInPicture
                      disableRemotePlayback
                    >
                      <source
                        src={fileUrl}
                        type={isString ? "video/mp4" : file.type}
                      />
                    </video>
                  ) : (
                    <img
                      src={fileUrl}
                      alt={fileName}
                      className="w-full h-full object-cover"
                      onLoad={() => {
                        if (fileUrl && fileUrl.startsWith("blob:")) {
                          URL.revokeObjectURL(fileUrl);
                        }
                      }}
                      onError={(e) => {
                        console.error("Failed to load image:", fileUrl);
                      }}
                    />
                  )}
                </div>

                {/* Action buttons container */}
                <div className="absolute -top-2 -right-2 flex gap-1">
                  {/* Crop button (only for local File objects when cropping is enabled) */}
                  {canCrop && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        cropExistingFile(file, index);
                      }}
                      className={`bg-primary-500 hover:bg-primary-600 text-white rounded-full flex items-center justify-center shadow-lg transition-all duration-200 hover:scale-110 ${config.removeBtn}`}
                      title="Crop image"
                    >
                      <Crop className={config.removeIcon} />
                    </button>
                  )}

                  {/* Remove button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFile(index);
                    }}
                    className={`bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center shadow-lg transition-all duration-200 hover:scale-110 ${config.removeBtn}`}
                  >
                    <X className={config.removeIcon} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default DragDropUploader;
