interface SessionData {
    feedbackId: string;
    timestamp: number;
    expiresAt: number;
    customerEmail?: string;
    offerType?: string;
    offerValue?: string;
}

class SessionManager {
    private readonly SESSION_DURATION = 10 * 60 * 1000; // 10 minutes in milliseconds
    private readonly STORAGE_KEY = 'cafe_lavia_feedback_session';

    /**
     * Create a new session after feedback submission
     */
    createSession(feedbackId: string, customerEmail?: string, offerType?: string, offerValue?: string): void {
        const now = Date.now();
        const expiresAt = now + this.SESSION_DURATION;

        const sessionData: SessionData = {
            feedbackId,
            timestamp: now,
            expiresAt,
            customerEmail,
            offerType,
            offerValue
        };

        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(sessionData));
        console.log('Session created for feedback:', feedbackId);
    }

    /**
     * Check if a valid session exists
     */
    hasValidSession(): boolean {
        const session = this.getSession();
        if (!session) return false;

        const now = Date.now();
        const isValid = now < session.expiresAt;

        if (!isValid) {
            this.clearSession();
        }

        return isValid;
    }

    /**
     * Get current session data
     */
    getSession(): SessionData | null {
        try {
            const sessionStr = localStorage.getItem(this.STORAGE_KEY);
            if (!sessionStr) return null;

            const session: SessionData = JSON.parse(sessionStr);
            return session;
        } catch (error) {
            console.error('Error parsing session data:', error);
            this.clearSession();
            return null;
        }
    }

    /**
     * Check if feedback ID matches current session
     */
    isSessionForFeedback(feedbackId: string): boolean {
        const session = this.getSession();
        return session?.feedbackId === feedbackId;
    }

    /**
     * Get remaining session time in seconds
     */
    getRemainingTime(): number {
        const session = this.getSession();
        if (!session) return 0;

        const now = Date.now();
        const remaining = Math.max(0, session.expiresAt - now);
        return Math.floor(remaining / 1000);
    }

    /**
     * Get formatted remaining time string
     */
    getFormattedRemainingTime(): string {
        const remainingSeconds = this.getRemainingTime();
        if (remainingSeconds <= 0) return 'Expired';

        const minutes = Math.floor(remainingSeconds / 60);
        const seconds = remainingSeconds % 60;
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }

    /**
     * Clear current session
     */
    clearSession(): void {
        localStorage.removeItem(this.STORAGE_KEY);
        console.log('Session cleared');
    }

    /**
     * Extend session duration
     */
    extendSession(durationMinutes: number = 10): void {
        const session = this.getSession();
        if (!session) return;

        const newExpiresAt = Date.now() + (durationMinutes * 60 * 1000);
        session.expiresAt = newExpiresAt;

        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(session));
        console.log('Session extended for feedback:', session.feedbackId);
    }

    /**
     * Check if user can submit new feedback
     */
    canSubmitNewFeedback(): boolean {
        return !this.hasValidSession();
    }

    /**
     * Get session info for display
     */
    getSessionInfo(): { isValid: boolean; remainingTime: string; feedbackId?: string } {
        const isValid = this.hasValidSession();
        const session = this.getSession();

        return {
            isValid,
            remainingTime: this.getFormattedRemainingTime(),
            feedbackId: session?.feedbackId
        };
    }
}

// Export singleton instance
export const sessionManager = new SessionManager();

// Export types for use in components
export type { SessionData }; 