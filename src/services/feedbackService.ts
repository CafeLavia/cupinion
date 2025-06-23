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

      const { data, error } = await supabase
        .from('feedback')
        .insert({
          ...dbData,
          bill_image_url,
        });
      if (error) throw error;

      return data;
    } catch (error) {
      console.error('Error submitting feedback:', error);
      throw new Error('Failed to submit feedback.');
    }
  }
} 