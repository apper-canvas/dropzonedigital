import { getApperClient } from "@/services/apperClient";

const TABLE_NAME = 'uploads_c';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const uploadService = {
  async uploadFile(file, onProgress) {
    // Simulate upload progress
    const totalSteps = 10;
    const stepDuration = 200;
    
    for (let i = 0; i <= totalSteps; i++) {
      await delay(stepDuration);
      const progress = Math.round((i / totalSteps) * 100);
      onProgress(progress);
      
      // Simulate random failures (5% chance)
      if (i === Math.floor(totalSteps * 0.7) && Math.random() < 0.05) {
        throw new Error("Upload failed: Network error");
      }
    }
    
    return {
      Id: Date.now(),
      name_c: file.name,
      size_c: file.size,
      type_c: file.type,
      uploadedAt_c: new Date().toISOString(),
      url_c: URL.createObjectURL(file)
    };
  },

  async createUpload(fileData) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error('ApperClient not initialized');
      }

      const response = await apperClient.createRecord(TABLE_NAME, {
        records: [{
          name_c: fileData.name_c,
          size_c: fileData.size_c,
          type_c: fileData.type_c,
          status_c: fileData.status_c,
          progress_c: fileData.progress_c,
          preview_c: fileData.preview_c,
          uploadedAt_c: fileData.uploadedAt_c,
          url_c: fileData.url_c,
          errorMessage_c: fileData.errorMessage_c
        }]
      });

      if (!response.success) {
        throw new Error(response.message);
      }

      if (response.results && response.results.length > 0) {
        const result = response.results[0];
        if (result.success) {
          return result.data;
        } else {
          throw new Error(result.message || 'Failed to create upload record');
        }
      }
    } catch (error) {
      console.error('Error creating upload:', error?.response?.data?.message || error);
      throw error;
    }
  },

  async updateUpload(Id, fileData) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error('ApperClient not initialized');
      }

      const response = await apperClient.updateRecord(TABLE_NAME, {
        records: [{
          Id,
          name_c: fileData.name_c,
          size_c: fileData.size_c,
          type_c: fileData.type_c,
          status_c: fileData.status_c,
          progress_c: fileData.progress_c,
          preview_c: fileData.preview_c,
          uploadedAt_c: fileData.uploadedAt_c,
          url_c: fileData.url_c,
          errorMessage_c: fileData.errorMessage_c
        }]
      });

      if (!response.success) {
        throw new Error(response.message);
      }

      if (response.results && response.results.length > 0) {
        const result = response.results[0];
        if (result.success) {
          return result.data;
        } else {
          throw new Error(result.message || 'Failed to update upload record');
        }
      }
    } catch (error) {
      console.error('Error updating upload:', error?.response?.data?.message || error);
      throw error;
    }
  },

  async deleteUpload(Id) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error('ApperClient not initialized');
      }

      const response = await apperClient.deleteRecord(TABLE_NAME, {
        RecordIds: [Id]
      });

      if (!response.success) {
        throw new Error(response.message);
      }

      return true;
    } catch (error) {
      console.error('Error deleting upload:', error?.response?.data?.message || error);
      throw error;
    }
  },

  validateFile(file) {
    const maxSize = 50 * 1024 * 1024; // 50MB
    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
      'application/pdf',
      'text/plain',
      'text/csv',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/zip',
      'application/x-rar-compressed',
      'audio/mpeg',
      'audio/wav',
      'video/mp4',
      'video/quicktime'
    ];

    if (file.size > maxSize) {
      return { valid: false, error: "File size exceeds 50MB limit" };
    }

    if (!allowedTypes.includes(file.type)) {
      return { valid: false, error: "File type not supported" };
    }

    return { valid: true };
  },

  generatePreview(file) {
    return new Promise((resolve) => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.readAsDataURL(file);
      } else {
        resolve(null);
      }
    });
  },

  formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  },

  getFileIcon(fileType) {
    if (fileType.startsWith('image/')) return 'Image';
    if (fileType.startsWith('video/')) return 'Video';
    if (fileType.startsWith('audio/')) return 'Music';
    if (fileType === 'application/pdf') return 'FileText';
    if (fileType.includes('word')) return 'FileText';
    if (fileType.includes('excel') || fileType.includes('sheet')) return 'FileSpreadsheet';
    if (fileType.includes('zip') || fileType.includes('rar')) return 'Archive';
    return 'File';
  }
};