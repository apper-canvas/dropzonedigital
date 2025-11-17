import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import ProgressBar from "@/components/molecules/ProgressBar";
import { uploadService } from "@/services/api/uploadService";

const FileCard = ({ file, onRemove, onCancel }) => {
  const getStatusBadge = () => {
    switch (file.status) {
      case "pending":
        return <Badge variant="pending">Pending</Badge>;
      case "uploading":
        return <Badge variant="uploading">Uploading</Badge>;
      case "success":
        return <Badge variant="success">Complete</Badge>;
      case "error":
        return <Badge variant="error">Failed</Badge>;
      default:
        return <Badge variant="default">Unknown</Badge>;
    }
  };

  const getStatusIcon = () => {
    switch (file.status) {
      case "pending":
        return "Clock";
      case "uploading":
        return "Loader";
      case "success":
        return "CheckCircle";
      case "error":
        return "XCircle";
      default:
        return "File";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={cn(
        "file-card bg-white rounded-lg p-4 shadow-sm border border-gray-100",
        file.status === "error" && "border-error/20 bg-error/5"
      )}
    >
      <div className="flex items-start gap-3">
        {/* File Preview/Icon */}
        <div className="flex-shrink-0">
          {file.preview ? (
            <img
              src={file.preview}
              alt={file.name}
              className="w-12 h-12 rounded-lg object-cover border border-gray-200"
            />
          ) : (
            <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center">
              <ApperIcon 
                name={uploadService.getFileIcon(file.type)} 
                size={20}
                className="text-gray-500"
              />
            </div>
          )}
        </div>

        {/* File Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              <h3 className="font-medium text-gray-900 truncate" title={file.name}>
                {file.name}
              </h3>
              <p className="text-sm text-gray-500">
                {uploadService.formatFileSize(file.size)}
              </p>
            </div>
            
            <div className="flex items-center gap-2">
              {getStatusBadge()}
              <ApperIcon 
                name={getStatusIcon()} 
                size={16}
                className={cn(
                  file.status === "uploading" && "animate-spin",
                  file.status === "success" && "text-success",
                  file.status === "error" && "text-error",
                  file.status === "pending" && "text-gray-400"
                )}
              />
            </div>
          </div>

          {/* Progress Bar */}
          {file.status === "uploading" && (
            <div className="mt-3">
              <ProgressBar value={file.progress} />
            </div>
          )}

          {/* Error Message */}
          {file.status === "error" && file.errorMessage && (
            <div className="mt-2">
              <p className="text-sm text-error">{file.errorMessage}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-2 mt-3">
            {file.status === "uploading" && onCancel && (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => onCancel(file.id)}
                icon="X"
              >
                Cancel
              </Button>
            )}
            
            {(file.status === "pending" || file.status === "error" || file.status === "success") && onRemove && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onRemove(file.id)}
                icon="Trash2"
                className="text-gray-500 hover:text-error"
              >
                Remove
              </Button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default FileCard;