import React, { useState, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import { uploadService } from "@/services/api/uploadService";
import { toast } from "react-toastify";

const DropZone = ({ onFilesAdded, disabled = false }) => {
  const [isDragActive, setIsDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDragIn = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragActive(true);
    }
  }, []);

  const handleDragOut = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
  }, []);

  const handleDrop = useCallback(async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    if (disabled) return;

    const files = Array.from(e.dataTransfer.files);
    await processFiles(files);
  }, [disabled]);

  const handleFileSelect = useCallback(async (e) => {
    if (disabled) return;
    
    const files = Array.from(e.target.files);
    await processFiles(files);
    
    // Reset input value so same file can be selected again
    e.target.value = "";
  }, [disabled]);

  const processFiles = async (files) => {
    if (files.length === 0) return;

    const validFiles = [];
    let errorCount = 0;

    for (const file of files) {
const validation = uploadService.validateFile(file);
      
      if (!validation.valid) {
        toast.error(`${file.name}: ${validation.error}`);
        errorCount++;
        continue;
      }

      const preview = await uploadService.generatePreview(file);
      
      const uploadFile = {
        Id: Date.now(),
        name_c: file.name,
        size_c: file.size,
        type_c: file.type,
        status_c: "pending",
        progress_c: 0,
        preview_c: preview,
        file, // Keep reference to original file for upload
        uploadedAt_c: null,
        errorMessage_c: null
      };

      validFiles.push(uploadFile);
    }

    if (validFiles.length > 0) {
      onFilesAdded(validFiles);
      toast.success(`${validFiles.length} file${validFiles.length > 1 ? "s" : ""} added to queue`);
    }

    if (errorCount > 0) {
      toast.warning(`${errorCount} file${errorCount > 1 ? "s" : ""} could not be added`);
    }
  };

  const openFileDialog = () => {
    if (!disabled) {
      fileInputRef.current?.click();
    }
  };

  return (
    <motion.div
      className={cn(
        "relative border-2 border-dashed border-gray-300 rounded-xl p-8 text-center transition-all duration-150",
        "hover:border-primary hover:bg-primary/5",
        isDragActive && "drag-over drag-active",
        disabled && "opacity-50 cursor-not-allowed",
        !disabled && "cursor-pointer"
      )}
      onClick={openFileDialog}
      onDragEnter={handleDragIn}
      onDragLeave={handleDragOut}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      whileHover={!disabled ? { scale: 1.01 } : {}}
      whileTap={!disabled ? { scale: 0.99 } : {}}
    >
      <input
        ref={fileInputRef}
        type="file"
        multiple
        onChange={handleFileSelect}
        className="hidden"
        disabled={disabled}
      />

      <div className="space-y-4">
        <motion.div
          className="mx-auto w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center"
          animate={{ y: [0, -4, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <ApperIcon name="CloudUpload" size={32} className="text-white" />
        </motion.div>

        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-gray-900">
            {isDragActive ? "Drop files here" : "Drag files here or click to browse"}
          </h3>
          <p className="text-sm text-gray-500">
            Support for images, documents, archives, and media files up to 50MB
          </p>
        </div>

        {!disabled && (
          <Button
            variant="primary"
            icon="Upload"
            className="mt-4"
            onClick={(e) => {
              e.stopPropagation();
              openFileDialog();
            }}
          >
            Select Files
          </Button>
        )}
      </div>
    </motion.div>
  );
};

export default DropZone;