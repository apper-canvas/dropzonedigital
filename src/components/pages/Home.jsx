import React, { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import DropZone from "@/components/organisms/DropZone";
import FileQueue from "@/components/organisms/FileQueue";
import { uploadService } from "@/services/api/uploadService";
import ApperIcon from "@/components/ApperIcon";

const Home = () => {
  const [files, setFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);

  const handleFilesAdded = useCallback((newFiles) => {
    setFiles(prev => [...prev, ...newFiles]);
  }, []);

  const handleRemoveFile = useCallback((fileId) => {
    setFiles(prev => prev.filter(f => f.id !== fileId));
  }, []);

  const handleClearAll = useCallback(() => {
    setFiles([]);
    toast.info("All files cleared from queue");
  }, []);

  const handleCancelUpload = useCallback((fileId) => {
    setFiles(prev => prev.map(f => 
      f.id === fileId ? { ...f, status: "pending", progress: 0 } : f
    ));
    toast.info("Upload cancelled");
  }, []);

  const uploadFile = useCallback(async (file) => {
    try {
      // Update status to uploading
      setFiles(prev => prev.map(f => 
        f.id === file.id ? { ...f, status: "uploading", progress: 0 } : f
      ));

      // Simulate upload with progress
      const result = await uploadService.uploadFile(file.file, (progress) => {
        setFiles(prev => prev.map(f => 
          f.id === file.id ? { ...f, progress } : f
        ));
      });

      // Update to success
      setFiles(prev => prev.map(f => 
        f.id === file.id ? { 
          ...f, 
          status: "success", 
          progress: 100,
          uploadedAt: result.uploadedAt,
          url: result.url
        } : f
      ));

      toast.success(`${file.name} uploaded successfully!`);
    } catch (error) {
      console.error("Upload error:", error);
      
      // Update to error
      setFiles(prev => prev.map(f => 
        f.id === file.id ? { 
          ...f, 
          status: "error", 
          errorMessage: error.message 
        } : f
      ));

      toast.error(`Failed to upload ${file.name}: ${error.message}`);
    }
  }, []);

  const handleUploadAll = useCallback(async () => {
    const pendingFiles = files.filter(f => f.status === "pending");
    
    if (pendingFiles.length === 0) {
      toast.warning("No files to upload");
      return;
    }

    setIsUploading(true);
    
    try {
      // Upload files sequentially to avoid overwhelming the system
      for (const file of pendingFiles) {
        await uploadFile(file);
      }
      
      toast.success(`Successfully uploaded ${pendingFiles.length} file${pendingFiles.length > 1 ? "s" : ""}!`);
    } catch (error) {
      console.error("Batch upload error:", error);
      toast.error("Some files failed to upload");
    } finally {
      setIsUploading(false);
    }
  }, [files, uploadFile]);

  const totalFiles = files.length;
  const completedFiles = files.filter(f => f.status === "success").length;
  const failedFiles = files.filter(f => f.status === "error").length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center shadow-lg">
              <ApperIcon name="Upload" size={24} className="text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              DropZone
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Upload files quickly and easily with drag-and-drop support and real-time progress tracking
          </p>
        </motion.div>

        {/* Stats */}
        {totalFiles > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8"
          >
            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 text-center">
              <div className="text-2xl font-bold text-gray-900">{totalFiles}</div>
              <div className="text-sm text-gray-500">Total Files</div>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 text-center">
              <div className="text-2xl font-bold text-success">{completedFiles}</div>
              <div className="text-sm text-gray-500">Completed</div>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 text-center">
              <div className="text-2xl font-bold text-error">{failedFiles}</div>
              <div className="text-sm text-gray-500">Failed</div>
            </div>
          </motion.div>
        )}

        {/* Drop Zone */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <DropZone 
            onFilesAdded={handleFilesAdded}
            disabled={isUploading}
          />
        </motion.div>

        {/* File Queue */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <FileQueue
            files={files}
            onRemoveFile={handleRemoveFile}
            onCancelUpload={handleCancelUpload}
            onClearAll={handleClearAll}
            onUploadAll={handleUploadAll}
          />
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-12 pt-8 border-t border-gray-200"
        >
          <p className="text-sm text-gray-500">
            Supported formats: Images, Documents, Archives, and Media files up to 50MB
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Home;