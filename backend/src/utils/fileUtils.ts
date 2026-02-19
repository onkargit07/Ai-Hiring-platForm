import fs from 'fs';
import path from 'path';
import { validateFileUpload } from './validation';

/**
 * Advanced file validation utilities
 */

// File signature (magic numbers) for common file types
const FILE_SIGNATURES: Record<string, Buffer[]> = {
  'application/pdf': [Buffer.from([0x25, 0x50, 0x44, 0x46])], // %PDF
  'application/msword': [Buffer.from([0xD0, 0xCF, 0x11, 0xE0, 0xA1, 0xB1, 0x1A, 0xE1])], // DOC
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': [
    Buffer.from([0x50, 0x4B, 0x03, 0x04]), // DOCX (ZIP format)
    Buffer.from([0x50, 0x4B, 0x05, 0x06]),
    Buffer.from([0x50, 0x4B, 0x07, 0x08]),
  ],
};

/**
 * Verify file signature matches declared MIME type
 */
export const verifyFileSignature = async (filePath: string, mimeType: string): Promise<boolean> => {
  try {
    const signatures = FILE_SIGNATURES[mimeType];
    if (!signatures) {
      return true; // Unknown type, skip verification
    }

    const fileHandle = await fs.promises.open(filePath, 'r');
    const buffer = Buffer.alloc(8); // Read first 8 bytes
    await fileHandle.read(buffer, 0, 8, 0);
    await fileHandle.close();

    // Check if file starts with any valid signature
    return signatures.some(signature => {
      return buffer.slice(0, signature.length).equals(signature);
    });
  } catch (error) {
    console.error('File signature verification failed:', error);
    return false;
  }
};

/**
 * Scan file for potential security issues
 * Basic implementation - in production, use a dedicated service like ClamAV
 */
export const scanFile = async (filePath: string): Promise<{ safe: boolean; issues: string[] }> => {
  const issues: string[] = [];

  try {
    const stats = await fs.promises.stat(filePath);
    
    // Check file size
    if (stats.size === 0) {
      issues.push('File is empty');
    }
    
    if (stats.size > 10 * 1024 * 1024) { // 10MB
      issues.push('File exceeds maximum size limit');
    }

    // Read file content for basic checks
    const content = await fs.promises.readFile(filePath, 'utf-8').catch(() => null);
    
    if (content) {
      // Check for suspicious patterns (basic XSS/script injection)
      const suspiciousPatterns = [
        /<script[^>]*>[\s\S]*?<\/script>/gi,
        /javascript:/gi,
        /on\w+\s*=\s*["'][^"']*["']/gi, // event handlers
        /<iframe[^>]*>[\s\S]*?<\/iframe>/gi,
      ];

      for (const pattern of suspiciousPatterns) {
        if (pattern.test(content)) {
          issues.push('File contains potentially malicious content');
          break;
        }
      }

      // Check for embedded executables
      if (content.includes('MZ\x90\x00') || content.includes('PE\x00\x00')) {
        issues.push('File may contain executable code');
      }
    }

    return {
      safe: issues.length === 0,
      issues,
    };
  } catch (error) {
    return {
      safe: false,
      issues: ['Failed to scan file'],
    };
  }
};

/**
 * Sanitize filename to prevent directory traversal
 */
export const sanitizeFilename = (filename: string): string => {
  return filename
    .replace(/[^a-zA-Z0-9._-]/g, '_') // Replace special chars
    .replace(/\.{2,}/g, '.') // Remove consecutive dots
    .substring(0, 255); // Limit length
};

/**
 * Generate unique filename to prevent collisions
 */
export const generateUniqueFilename = (originalName: string): string => {
  const ext = path.extname(originalName);
  const nameWithoutExt = path.basename(originalName, ext);
  const sanitized = sanitizeFilename(nameWithoutExt);
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  
  return `${sanitized}_${timestamp}_${random}${ext}`;
};

/**
 * Comprehensive file validation for resume uploads
 */
export const validateResumeFile = async (file: Express.Multer.File): Promise<void> => {
  // Basic validation
  validateFileUpload(file);

  // Verify file signature
  const signatureValid = await verifyFileSignature(file.path, file.mimetype);
  if (!signatureValid) {
    // Clean up invalid file
    await fs.promises.unlink(file.path).catch(() => {});
    throw new Error('File type verification failed. The file may be corrupted or not a valid document.');
  }

  // Scan for security issues
  const scanResult = await scanFile(file.path);
  if (!scanResult.safe) {
    // Clean up unsafe file
    await fs.promises.unlink(file.path).catch(() => {});
    throw new Error(`File security scan failed: ${scanResult.issues.join(', ')}`);
  }
};

/**
 * Clean up old files (for scheduled cleanup jobs)
 */
export const cleanupOldFiles = async (directory: string, maxAgeMs: number): Promise<number> => {
  try {
    const files = await fs.promises.readdir(directory);
    let deletedCount = 0;
    const now = Date.now();

    for (const file of files) {
      const filePath = path.join(directory, file);
      const stats = await fs.promises.stat(filePath);
      
      if (now - stats.mtimeMs > maxAgeMs) {
        await fs.promises.unlink(filePath);
        deletedCount++;
      }
    }

    return deletedCount;
  } catch (error) {
    console.error('Cleanup failed:', error);
    return 0;
  }
};
