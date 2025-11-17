import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import FileCard from "@/components/molecules/FileCard";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const FileQueue = ({ files, onRemoveFile, onCancelUpload, onClearAll, onUploadAll }) => {
const pendingFiles = files.filter(f => f.status_c === "pending");
  const uploadingFiles = files.filter(f => f.status === "uploading");
  const completedFiles = files.filter(f => f.status === "success");
  const errorFiles = files.filter(f => f.status === "error");

  const totalSize = files.reduce((sum, file) => sum + file.size, 0);
  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (files.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-12"
      >
        <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <ApperIcon name="FileText" size={24} className="text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No files selected</h3>
        <p className="text-gray-500">Select or drag files above to get started</p>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Queue Summary */}
      <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium text-gray-900">Upload Queue</h3>
            <p className="text-sm text-gray-500">
              {files.length} file{files.length !== 1 ? "s" : ""} • {formatBytes(totalSize)}
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            {pendingFiles.length > 0 && (
              <Button
                variant="primary"
                size="sm"
                icon="Upload"
                onClick={onUploadAll}
              >
                Upload All ({pendingFiles.length})
              </Button>
            )}
            
            <Button
              variant="secondary"
              size="sm"
              icon="Trash2"
              onClick={onClearAll}
            >
              Clear All
            </Button>
          </div>
        </div>

        {/* Status Summary */}
        {(completedFiles.length > 0 || uploadingFiles.length > 0 || errorFiles.length > 0) && (
          <div className="flex items-center gap-4 mt-3 pt-3 border-t border-gray-100">
            {completedFiles.length > 0 && (
              <div className="flex items-center gap-1 text-sm text-success">
                <ApperIcon name="CheckCircle" size={16} />
                {completedFiles.length} complete
              </div>
            )}
            {uploadingFiles.length > 0 && (
              <div className="flex items-center gap-1 text-sm text-accent">
                <ApperIcon name="Loader" size={16} className="animate-spin" />
                {uploadingFiles.length} uploading
              </div>
            )}
            {errorFiles.length > 0 && (
              <div className="flex items-center gap-1 text-sm text-error">
                <ApperIcon name="XCircle" size={16} />
                {errorFiles.length} failed
              </div>
            )}
          </div>
        )}
      </div>

      {/* File List */}
      <div className="space-y-3 custom-scrollbar max-h-96 overflow-y-auto">
        <AnimatePresence mode="popLayout">
{files.map((file) => (
            <FileCard
              key={file.Id}
              file={file}
              onRemove={onRemoveFile}
              onCancel={onCancelUpload}
            />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default FileQueue;