import React from "react";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const ErrorView = ({ 
  message = "Something went wrong", 
  onRetry, 
  showRetry = true 
}) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-gray-100">
      <div className="text-center space-y-6 max-w-md mx-auto p-6">
        <div className="mx-auto w-20 h-20 bg-gradient-to-br from-error to-red-600 rounded-full flex items-center justify-center">
          <ApperIcon name="AlertTriangle" size={32} className="text-white" />
        </div>
        
        <div className="space-y-2">
          <h3 className="text-xl font-bold text-gray-900">Oops!</h3>
          <p className="text-gray-600">{message}</p>
        </div>

        {showRetry && onRetry && (
          <div className="space-y-4">
            <Button
              variant="primary"
              onClick={onRetry}
              icon="RefreshCw"
              className="w-full sm:w-auto"
            >
              Try Again
            </Button>
            <p className="text-sm text-gray-500">
              If the problem persists, please refresh the page
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ErrorView;