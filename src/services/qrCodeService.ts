import { supabase } from './supabaseClient';
import QRCode from 'qrcode';

export interface QRCodeRecord {
  id: string;
  table_number: number;
  location: string;
  feedback_url: string;
  qr_image_url: string | null;
  created_at: string;
  is_active: boolean;
}

export interface CreateQRCodeData {
  table_number: number;
  location?: string;
  feedback_url: string;
}

export interface UpdateQRCodeData {
  table_number: number;
  location?: string;
  feedback_url: string;
}

export class QRCodeService {
  /**
   * Generate QR code as data URL
   */
  static async generateQRCode(url: string, options?: QRCode.QRCodeToDataURLOptions): Promise<string> {
    try {
      const defaultOptions: QRCode.QRCodeToDataURLOptions = {
        width: 300,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        },
        ...options
      };
      
      const qrDataURL = await QRCode.toDataURL(url, defaultOptions);
      return qrDataURL;
    } catch (error) {
      console.error('Error generating QR code:', error);
      throw new Error('Failed to generate QR code');
    }
  }

  /**
   * Upload QR code image to Supabase Storage
   */
  static async uploadQRImage(qrDataURL: string, tableNumber: number): Promise<string> {
    try {
      // Convert data URL to blob
      const response = await fetch(qrDataURL);
      const blob = await response.blob();
      
      // Create file name with timestamp to avoid conflicts
      const timestamp = Date.now();
      const fileName = `qr-codes/table-${tableNumber}-${timestamp}.png`;
      
      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from('images')
        .upload(fileName, blob, {
          contentType: 'image/png',
          cacheControl: '3600'
        });

      if (error) throw error;

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('images')
        .getPublicUrl(fileName);

      return urlData.publicUrl;
    } catch (error) {
      console.error('Error uploading QR image:', error);
      throw new Error('Failed to upload QR code image');
    }
  }

  /**
   * Load all QR codes from database
   */
  static async loadQRCodes(): Promise<QRCodeRecord[]> {
    try {
      const { data, error } = await supabase
        .from('qr_codes')
        .select('*')
        .order('table_number', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error loading QR codes:', error);
      throw new Error('Failed to load QR codes');
    }
  }

  /**
   * Create a new QR code
   */
  static async createQRCode(qrData: CreateQRCodeData): Promise<QRCodeRecord> {
    try {
      // Generate QR code
      const qrDataURL = await this.generateQRCode(qrData.feedback_url);
      
      // Upload to storage
      const qrImageUrl = await this.uploadQRImage(qrDataURL, qrData.table_number);
      
      // Save to database
      const { data, error } = await supabase
        .from('qr_codes')
        .insert({
          table_number: qrData.table_number,
          location: qrData.location || null,
          feedback_url: qrData.feedback_url,
          qr_image_url: qrImageUrl
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating QR code:', error);
      throw new Error('Failed to create QR code');
    }
  }

  /**
   * Update an existing QR code
   */
  static async updateQRCode(id: string, qrData: UpdateQRCodeData): Promise<void> {
    try {
      // Get current QR code
      const { data: currentQR, error: fetchError } = await supabase
        .from('qr_codes')
        .select('feedback_url, qr_image_url')
        .eq('id', id)
        .single();

      if (fetchError) throw fetchError;

      let qrImageUrl = currentQR.qr_image_url;
      
      // If feedback URL changed, regenerate QR code
      if (currentQR.feedback_url !== qrData.feedback_url) {
        const qrDataURL = await this.generateQRCode(qrData.feedback_url);
        qrImageUrl = await this.uploadQRImage(qrDataURL, qrData.table_number);
      }
      
      // Update database
      const { error } = await supabase
        .from('qr_codes')
        .update({
          table_number: qrData.table_number,
          location: qrData.location || null,
          feedback_url: qrData.feedback_url,
          qr_image_url: qrImageUrl
        })
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Error updating QR code:', error);
      throw new Error('Failed to update QR code');
    }
  }

  /**
   * Delete a QR code
   */
  static async deleteQRCode(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('qr_codes')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting QR code:', error);
      throw new Error('Failed to delete QR code');
    }
  }

  /**
   * Toggle QR code active status
   */
  static async toggleQRCodeStatus(id: string, currentStatus: boolean): Promise<void> {
    try {
      const { error } = await supabase
        .from('qr_codes')
        .update({ is_active: !currentStatus })
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Error toggling QR code status:', error);
      throw new Error('Failed to update QR code status');
    }
  }

  /**
   * Download QR code as PNG file
   */
  static async downloadQRCode(qrCode: QRCodeRecord): Promise<void> {
    try {
      if (!qrCode.qr_image_url) {
        // Generate QR code if not stored
        const qrDataURL = await this.generateQRCode(qrCode.feedback_url);
        const link = document.createElement('a');
        link.href = qrDataURL;
        link.download = `table-${qrCode.table_number}-qr.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        return;
      }

      // Download from storage using Supabase SDK for reliability
      const urlParts = qrCode.qr_image_url.split('/images/');
      if (urlParts.length < 2) {
        throw new Error('Invalid QR code image URL format.');
      }
      const imagePath = urlParts[1];

      const { data: imageBlob, error } = await supabase.storage
        .from('images')
        .download(imagePath);

      if (error) throw error;
      if (!imageBlob) throw new Error('Downloaded QR code is empty.');
      
      const imageUrl = window.URL.createObjectURL(imageBlob);

      const link = document.createElement('a');
      link.href = imageUrl;
      link.download = `table-${qrCode.table_number}-qr.png`;
      
      // Append to body to ensure click works across browsers
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Clean up
      window.URL.revokeObjectURL(imageUrl);
    } catch (error) {
      console.error('Error downloading QR code:', error);
      throw new Error('Failed to download QR code');
    }
  }

  /**
   * Get QR code by table number
   */
  static async getQRCodeByTable(tableNumber: number): Promise<QRCodeRecord | null> {
    try {
      const { data, error } = await supabase
        .from('qr_codes')
        .select('*')
        .eq('table_number', tableNumber)
        .eq('is_active', true)
        .single();

      if (error && error.code !== 'PGRST116') throw error; // PGRST116 is "not found"
      return data;
    } catch (error) {
      console.error('Error getting QR code by table:', error);
      throw new Error('Failed to get QR code');
    }
  }

  /**
   * Check if table number already exists
   */
  static async isTableNumberExists(tableNumber: number, excludeId?: string): Promise<boolean> {
    try {
      let query = supabase
        .from('qr_codes')
        .select('id')
        .eq('table_number', tableNumber);

      if (excludeId) {
        query = query.neq('id', excludeId);
      }

      const { data, error } = await query;
      if (error) throw error;
      
      return (data?.length || 0) > 0;
    } catch (error) {
      console.error('Error checking table number existence:', error);
      throw new Error('Failed to check table number');
    }
  }
} 