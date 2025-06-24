import { supabase } from './supabaseClient';

export interface FeedbackData {
  table_number: number | null;
  rating: string;
  customer_email?: string;
  details?: any;
  billFile?: File | null;
}

export class FeedbackService {
  /**
   * Upload a bill image to the new 'bills' bucket
   */
  private static async uploadBillImage(billFile: File): Promise<string> {
    try {
      const fileName = `bill-${Date.now()}-${billFile.name}`;
      const { data, error } = await supabase.storage
        .from('bills') // Use the new bucket
        .upload(fileName, billFile, {
          contentType: billFile.type,
          cacheControl: '3600',
        });

      if (error) throw error;

      const { data: urlData } = supabase.storage
        .from('bills')
        .getPublicUrl(fileName);
      return urlData.publicUrl;
    } catch (error) {
      console.error('Error uploading bill image:', error);
      throw new Error('Failed to upload bill image.');
    }
  }

  /**
   * Submit new feedback to the database
   */
  static async submitFeedback(feedbackData: FeedbackData): Promise<any> {
    try {
      let bill_image_url: string | undefined = undefined;

      if (feedbackData.billFile) {
        bill_image_url = await this.uploadBillImage(feedbackData.billFile);
      }

      const { billFile, ...dbData } = feedbackData;

      // Generate custom_id (e.g., FD-ABC123)
      const custom_id = 'FD-' + Math.random().toString(36).substr(2, 6).toUpperCase();

      const { data, error } = await supabase
        .from('feedback')
        .insert({
          ...dbData,
          bill_image_url,
          custom_id,
        })
        .select()
        .single();
      if (error) throw error;

      return data;
    } catch (error) {
      console.error('Error submitting feedback:', error);
      throw new Error('Failed to submit feedback.');
    }
  }

  /**
   * Update admin notes for a feedback entry
   */
  static async updateAdminNotes(feedbackId: string, adminNotes: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('feedback')
        .update({ admin_notes: adminNotes })
        .eq('id', feedbackId);
      if (error) throw error;
    } catch (error) {
      console.error('Error updating admin notes:', error);
      throw new Error('Failed to update admin notes.');
    }
  }

  /**
   * Fetch all feedback from the database (no join)
   */
  static async fetchAllFeedback(): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('feedback')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching feedback:', error);
      throw new Error('Failed to fetch feedback.');
    }
  }

  /**
   * Fetch all QR codes from the database
   */
  static async fetchAllQRCodes(): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('qr_codes')
        .select('table_number, location')
        .order('table_number', { ascending: true });
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching QR codes:', error);
      throw new Error('Failed to fetch QR codes.');
    }
  }

  /**
   * Update status for a feedback entry
   */
  static async updateStatus(feedbackId: string, status: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('feedback')
        .update({ status })
        .eq('id', feedbackId);
      if (error) throw error;
    } catch (error) {
      console.error('Error updating feedback status:', error);
      throw new Error('Failed to update feedback status.');
    }
  }

  /**
   * Fetch feedback by ID or custom_id
   */
  static async fetchFeedbackById(feedbackId: string): Promise<any> {
    try {
      let query = supabase.from('feedback').select('*');
      // Try UUID first
      if (/^[0-9a-fA-F-]{36}$/.test(feedbackId)) {
        query = query.eq('id', feedbackId);
      } else {
        query = query.eq('custom_id', feedbackId);
      }
      const { data, error } = await query.single();
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching feedback by ID:', error);
      throw new Error('Failed to fetch feedback by ID.');
    }
  }

  /**
   * Check if a bill or feedback has already been claimed
   */
  static async checkOfferClaim({ feedbackId, billNumber }: { feedbackId: string, billNumber: string }): Promise<any> {
    try {
      const { data, error } = await supabase
        .from('offer_claims')
        .select('*')
        .or(`feedback_id.eq.${feedbackId},bill_number.eq.${billNumber}`);
      if (error) throw error;
      return data && data.length > 0 ? data[0] : null;
    } catch (error) {
      console.error('Error checking offer claim:', error);
      throw new Error('Failed to check offer claim.');
    }
  }

  /**
   * Create a new offer claim
   */
  static async createOfferClaim({ feedbackId, billNumber, claimedBy }: { feedbackId: string, billNumber: string, claimedBy?: string }): Promise<any> {
    try {
      const { data, error } = await supabase
        .from('offer_claims')
        .insert({
          feedback_id: feedbackId,
          bill_number: billNumber,
          claimed_by: claimedBy || null
        })
        .select()
        .single();
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating offer claim:', error);
      throw new Error('Failed to create offer claim.');
    }
  }
} 