import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 flex items-center justify-center">
      <div className="max-w-md mx-auto text-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Error Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
            className="mx-auto w-24 h-24 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center"
          >
            <ApperIcon name="FileQuestion" size={40} className="text-white" />
          </motion.div>

          {/* Error Message */}
          <div className="space-y-2">
            <h1 className="text-6xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              404
            </h1>
            <h2 className="text-2xl font-bold text-gray-900">Page Not Found</h2>
            <p className="text-gray-600">
              Sorry, the page you're looking for doesn't exist or has been moved.
            </p>
          </div>

          {/* Actions */}
          <div className="space-y-4">
            <Button
              variant="primary"
              onClick={() => navigate("/")}
              icon="Home"
              className="w-full sm:w-auto"
            >
              Back to Home
            </Button>
            
            <div className="text-sm text-gray-500">
              <p>Need help? Try uploading some files to get started.</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default NotFound;