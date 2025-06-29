// config/appwrite.js
const { Client, Storage, ID } = require("node-appwrite");

class AppwriteService {
  constructor() {
    this.client = new Client();
    this.storage = new Storage(this.client);

    // Initialize Appwrite client
    this.client
      .setEndpoint(process.env.APPWRITE_ENDPOINT) // Your Appwrite endpoint
      .setProject(process.env.APPWRITE_PROJECT_ID) // Your project ID
      .setKey(process.env.APPWRITE_API_KEY); // Your API key

    this.bucketId = process.env.APPWRITE_BUCKET_ID; // Your storage bucket ID
  }

  async uploadFile(fileBuffer, fileName) {
    try {
      // Convert buffer to File object
      const file = new File([fileBuffer], fileName, {
        type: this.getMimeType(fileName),
      });

      // Upload file to Appwrite storage
      const response = await this.storage.createFile(
        this.bucketId,
        ID.unique(), // Auto-generate unique ID
        file
      );

      // Generate file URL
      const fileUrl = this.getFileUrl(response.$id);

      return {
        success: true,
        fileId: response.$id,
        fileUrl: fileUrl,
        fileName: response.name,
        size: response.sizeOriginal,
      };
    } catch (error) {
      console.error("Appwrite upload error:", error);
      return {
        success: false,
        error: error.message || "Upload failed",
      };
    }
  }

  // Generate file preview/download URL
  getFileUrl(fileId) {
    return `${process.env.APPWRITE_ENDPOINT}/storage/buckets/${this.bucketId}/files/${fileId}/view?project=${process.env.APPWRITE_PROJECT_ID}`;
  }

  // Get file download URL
  getFileDownloadUrl(fileId) {
    return `${process.env.APPWRITE_ENDPOINT}/storage/buckets/${this.bucketId}/files/${fileId}/download?project=${process.env.APPWRITE_PROJECT_ID}`;
  }

  // Delete file from storage
  async deleteFile(fileId) {
    try {
      await this.storage.deleteFile(this.bucketId, fileId);
      return { success: true };
    } catch (error) {
      console.error("Appwrite delete error:", error);
      return {
        success: false,
        error: error.message || "Delete failed",
      };
    }
  }

  // Get file info
  async getFile(fileId) {
    try {
      const file = await this.storage.getFile(this.bucketId, fileId);
      return {
        success: true,
        file: file,
      };
    } catch (error) {
      console.error("Appwrite get file error:", error);
      return {
        success: false,
        error: error.message || "Get file failed",
      };
    }
  }

  // Helper method to determine MIME type
  getMimeType(fileName) {
    const extension = fileName.toLowerCase().split(".").pop();
    const mimeTypes = {
      jpg: "image/jpeg",
      jpeg: "image/jpeg",
      png: "image/png",
      gif: "image/gif",
      bmp: "image/bmp",
      webp: "image/webp",
      svg: "image/svg+xml",
    };
    return mimeTypes[extension] || "application/octet-stream";
  }
}

module.exports = new AppwriteService();
