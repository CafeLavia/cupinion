import { useState, useEffect } from 'react';
import { sessionManager } from '../utils/sessionManager';

interface OfferType {
    id: string;
    name: string;
    type: 'percentage' | 'fixed' | 'bogo';
    value: number;
    status: 'active' | 'inactive';
    minRating: number;
    redemptions: number;
}

interface FeedbackOffer {
    id: string;
    feedbackId: string;
    customerName: string;
    customerEmail?: string;
    rating: number;
    offerType: string;
    offerValue: string;
    status: 'Not Redeemed' | 'Already Redeemed' | 'Pending';
    submittedAt: string;
    redeemedAt?: string;
    billAmount?: string;
    feedback?: string;
}

interface OfferStats {
    totalOffersGenerated: number;
    totalRedemptions: number;
    redemptionRate: number;
    averageRedemptionTime: number;
    activeOffers: number;
}

export const useFeedbackOffers = () => {
    const [offerTypes, setOfferTypes] = useState<OfferType[]>([
        { id: '1', name: '5-Star Feedback Reward', type: 'percentage', value: 15, status: 'active', minRating: 5, redemptions: 89 },
        { id: '2', name: '4-Star Feedback Reward', type: 'percentage', value: 10, status: 'active', minRating: 4, redemptions: 156 },
        { id: '3', name: '3-Star Feedback Reward', type: 'percentage', value: 5, status: 'active', minRating: 3, redemptions: 67 },
        { id: '4', name: 'First Time Customer', type: 'percentage', value: 20, status: 'inactive', minRating: 0, redemptions: 23 },
    ]);

    const [recentOffers, setRecentOffers] = useState<FeedbackOffer[]>([
        { id: '1', feedbackId: 'FB-2024-001', customerName: 'John Doe', rating: 5, offerType: '5-Star Feedback Reward', offerValue: '15% off', status: 'Already Redeemed', submittedAt: '2024-01-15 14:30:00', redeemedAt: '2024-01-15 16:20:00' },
        { id: '2', feedbackId: 'FB-2024-002', customerName: 'Jane Smith', rating: 4, offerType: '4-Star Feedback Reward', offerValue: '10% off', status: 'Already Redeemed', submittedAt: '2024-01-15 13:45:00', redeemedAt: '2024-01-15 15:30:00' },
        { id: '3', feedbackId: 'FB-2024-003', customerName: 'Mike Johnson', rating: 3, offerType: '3-Star Feedback Reward', offerValue: '5% off', status: 'Not Redeemed', submittedAt: '2024-01-15 12:20:00' },
        { id: '4', feedbackId: 'FB-2024-004', customerName: 'Sarah Wilson', rating: 5, offerType: '5-Star Feedback Reward', offerValue: '15% off', status: 'Pending', submittedAt: '2024-01-15 11:15:00' },
    ]);

    const [stats, setStats] = useState<OfferStats>({
        totalOffersGenerated: 247,
        totalRedemptions: 156,
        redemptionRate: 63.2,
        averageRedemptionTime: 2.3,
        activeOffers: 3
    });

    const [isLoading, setIsLoading] = useState(false);

    // Get offer type by rating
    const getOfferTypeByRating = (rating: number): OfferType | null => {
        return offerTypes.find(offer => 
            offer.status === 'active' && 
            rating >= offer.minRating
        ) || null;
    };

    // Generate offer for feedback
    const generateOffer = (feedbackId: string, rating: number, customerName: string, customerEmail?: string): FeedbackOffer | null => {
        const offerType = getOfferTypeByRating(rating);
        if (!offerType) return null;

        const newOffer: FeedbackOffer = {
            id: Date.now().toString(),
            feedbackId,
            customerName,
            customerEmail,
            rating,
            offerType: offerType.name,
            offerValue: `${offerType.value}% off`,
            status: 'Not Redeemed',
            submittedAt: new Date().toISOString()
        };

        setRecentOffers(prev => [newOffer, ...prev]);
        setStats(prev => ({
            ...prev,
            totalOffersGenerated: prev.totalOffersGenerated + 1
        }));

        // Create session
        sessionManager.createSession(feedbackId, customerEmail, offerType.name, `${offerType.value}% off`);

        return newOffer;
    };

    // Redeem offer
    const redeemOffer = (feedbackId: string): boolean => {
        const offerIndex = recentOffers.findIndex(offer => offer.feedbackId === feedbackId);
        if (offerIndex === -1) return false;

        const updatedOffers = [...recentOffers];
        updatedOffers[offerIndex] = {
            ...updatedOffers[offerIndex],
            status: 'Already Redeemed',
            redeemedAt: new Date().toISOString()
        };

        setRecentOffers(updatedOffers);
        setStats(prev => ({
            ...prev,
            totalRedemptions: prev.totalRedemptions + 1,
            redemptionRate: ((prev.totalRedemptions + 1) / prev.totalOffersGenerated) * 100
        }));

        return true;
    };

    // Search offer by feedback ID
    const searchOffer = (feedbackId: string): FeedbackOffer | null => {
        return recentOffers.find(offer => offer.feedbackId === feedbackId) || null;
    };

    // Update offer type
    const updateOfferType = (id: string, updates: Partial<OfferType>): void => {
        setOfferTypes(prev => 
            prev.map(offer => 
                offer.id === id ? { ...offer, ...updates } : offer
            )
        );
    };

    // Add new offer type
    const addOfferType = (offerType: Omit<OfferType, 'id' | 'redemptions'>): void => {
        const newOfferType: OfferType = {
            ...offerType,
            id: Date.now().toString(),
            redemptions: 0
        };
        setOfferTypes(prev => [...prev, newOfferType]);
        setStats(prev => ({
            ...prev,
            activeOffers: prev.activeOffers + (offerType.status === 'active' ? 1 : 0)
        }));
    };

    // Delete offer type
    const deleteOfferType = (id: string): void => {
        const offerType = offerTypes.find(offer => offer.id === id);
        setOfferTypes(prev => prev.filter(offer => offer.id !== id));
        if (offerType?.status === 'active') {
            setStats(prev => ({
                ...prev,
                activeOffers: prev.activeOffers - 1
            }));
        }
    };

    return {
        offerTypes,
        recentOffers,
        stats,
        isLoading,
        getOfferTypeByRating,
        generateOffer,
        redeemOffer,
        searchOffer,
        updateOfferType,
        addOfferType,
        deleteOfferType
    };
}; 