import uploadFiles from "@/services/mockData/uploadFiles.json";

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
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      name: file.name,
      size: file.size,
      type: file.type,
      uploadedAt: new Date().toISOString(),
      url: URL.createObjectURL(file)
    };
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