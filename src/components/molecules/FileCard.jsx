import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { uploadService } from "@/services/api/uploadService";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import ProgressBar from "@/components/molecules/ProgressBar";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";

const FileCard = ({ file, onRemove, onCancel }) => {
  const getStatusBadge = () => {
    switch (file.status_c) {
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
    switch (file.status_c) {
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
    initial={{
        opacity: 0,
        y: 20
    }}
    animate={{
        opacity: 1,
        y: 0
    }}
    exit={{
        opacity: 0,
        y: -20
    }}
    className={cn(
        "file-card bg-white rounded-lg p-4 shadow-sm border border-gray-100",
        file.status_c === "error" && "border-error/20 bg-error/5"
    )}>
    <div className="flex items-start gap-3">
        {/* File Preview/Icon */}
        <div className="flex-shrink-0">
            {file.preview_c ? <img
                src={file.preview_c}
                alt={file.name_c}
                className="w-12 h-12 rounded-lg object-cover border border-gray-200" /> : <div
                className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center">
                <ApperIcon
                    name={uploadService.getFileIcon(file.type_c)}
                    size={20}
                    className="text-gray-500" />
            </div>}
        </div>
    </div>
    {/* File Info */}
    <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
            <h3 className="font-medium text-gray-900 truncate" title={file.name_c}>
                {file.name_c}
            </h3>
            <p className="text-sm text-gray-500">
                {uploadService.formatFileSize(file.size_c)}
            </p>
        </div>
        <div className="flex items-center gap-2 mt-2">
            {getStatusBadge()}
            <ApperIcon
                name={getStatusIcon()}
                size={16}
                className={cn(
                    file.status_c === "uploading" && "animate-spin",
                    file.status_c === "success" && "text-success",
                    file.status_c === "error" && "text-error",
                    file.status_c === "pending" && "text-gray-400"
                )} />
        </div>
        {/* Progress Bar */}
        {file.status_c === "uploading" && <div className="mt-3">
            <ProgressBar value={file.progress_c} />
        </div>}
        {/* Error Message */}
        {file.status_c === "error" && file.errorMessage_c && <div className="mt-2">
            <p className="text-sm text-error">{file.errorMessage_c}</p>
        </div>}
        {/* Actions */}
        <div className="flex items-center gap-2 mt-3">
            {file.status_c === "uploading" && onCancel && <Button variant="secondary" size="sm" onClick={() => onCancel(file.Id)} icon="X">Cancel
                              </Button>}
            {(file.status_c === "pending" || file.status_c === "error" || file.status_c === "success") && onRemove && <Button
                variant="ghost"
                size="sm"
                onClick={() => onRemove(file.Id)}
                icon="Trash2"
                className="text-gray-500 hover:text-error">Remove
                              </Button>}
        </div>
    </div>
</motion.div>
  );
};

export default FileCard;