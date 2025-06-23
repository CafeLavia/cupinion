import React, { useState, useEffect, useMemo } from 'react';
import { Settings, Percent, RefreshCw, QrCode, Plus, Download, Trash2, Edit, Eye } from 'lucide-react';
import { QRCodeService } from '../../../services/qrCodeService';
import { AuthService } from '../../../services/authService';
import type { QRCodeRecord } from '../../../services/qrCodeService';

const Modal = ({ isOpen, onClose, title, children }: { isOpen: boolean; onClose: () => void; title: string; children: React.ReactNode }) => {
    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50 transition-opacity">
        <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl transform transition-all">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">{title}</h3>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              ✕
            </button>
          </div>
          {children}
        </div>
      </div>
    );
  };

const SettingsPage: React.FC = () => {
  const [qrCodes, setQrCodes] = useState<QRCodeRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedQR, setSelectedQR] = useState<QRCodeRecord | null>(null);
  
  // Form states
  const [tableNumber, setTableNumber] = useState('');
  const [location, setLocation] = useState('');
  const [feedbackUrl, setFeedbackUrl] = useState('');
  const [discountRate, setDiscountRate] = useState('10');
  const [formErrors, setFormErrors] = useState<{[key: string]: string}>({});

  const appBaseUrl = useMemo(() => import.meta.env.VITE_APP_BASE_URL || window.location.origin, []);

  // Effect to auto-generate feedback URL for new QR codes
  useEffect(() => {
    if (showCreateModal) {
      if (tableNumber) {
        setFeedbackUrl(`${appBaseUrl}/feedback?table=${tableNumber}`);
      } else {
        setFeedbackUrl(`${appBaseUrl}/feedback`);
      }
    }
  }, [tableNumber, showCreateModal, appBaseUrl]);

  // Load QR codes on component mount
  useEffect(() => {
    loadQRCodes();
  }, []);

  const loadQRCodes = async () => {
    try {
      setLoading(true);
      const data = await QRCodeService.loadQRCodes();
      setQrCodes(data);
    } catch (error) {
      console.error('Error loading QR codes:', error);
      alert('Failed to load QR codes');
    } finally {
      setLoading(false);
    }
  };

  const validateForm = (): boolean => {
    const errors: {[key: string]: string} = {};

    if (!tableNumber) {
      errors.tableNumber = 'Table number is required';
    } else if (isNaN(parseInt(tableNumber)) || parseInt(tableNumber) <= 0) {
      errors.tableNumber = 'Table number must be a positive number';
    }

    if (!feedbackUrl) {
      errors.feedbackUrl = 'Feedback URL is required';
    } else if (!isValidUrl(feedbackUrl)) {
      errors.feedbackUrl = 'Please enter a valid URL';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const isValidUrl = (string: string): boolean => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const createQRCode = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);

      const isAuthenticated = await AuthService.isAuthenticated();
      if (!isAuthenticated) {
        alert('You are not authorized. Please log in again.');
        return;
      }
      
      // Check if table number already exists
      const exists = await QRCodeService.isTableNumberExists(parseInt(tableNumber));
      if (exists) {
        setFormErrors({ tableNumber: 'Table number already exists' });
        return;
      }

      await QRCodeService.createQRCode({
        table_number: parseInt(tableNumber),
        location: location || undefined,
        feedback_url: feedbackUrl
      });

      // Reset form and close modal
      setTableNumber('');
      setLocation('');
      setFeedbackUrl('');
      setFormErrors({});
      setShowCreateModal(false);
      
      // Reload QR codes
      await loadQRCodes();
      
      alert('QR code created successfully!');
    } catch (error) {
      console.error('Error creating QR code:', error);
      alert('Failed to create QR code');
    } finally {
      setLoading(false);
    }
  };

  const updateQRCode = async () => {
    if (!selectedQR || !validateForm()) return;

    try {
      setLoading(true);

      const isAuthenticated = await AuthService.isAuthenticated();
      if (!isAuthenticated) {
        alert('You are not authorized. Please log in again.');
        return;
      }
      
      // Check if table number already exists (excluding current QR code)
      const exists = await QRCodeService.isTableNumberExists(parseInt(tableNumber), selectedQR.id);
      if (exists) {
        setFormErrors({ tableNumber: 'Table number already exists' });
        return;
      }

      await QRCodeService.updateQRCode(selectedQR.id, {
        table_number: parseInt(tableNumber),
        location: location || undefined,
        feedback_url: feedbackUrl
      });

      // Reset form and close modal
      setTableNumber('');
      setLocation('');
      setFeedbackUrl('');
      setFormErrors({});
      setSelectedQR(null);
      setShowEditModal(false);
      
      // Reload QR codes
      await loadQRCodes();
      
      alert('QR code updated successfully!');
    } catch (error) {
      console.error('Error updating QR code:', error);
      alert('Failed to update QR code');
    } finally {
      setLoading(false);
    }
  };

  const deleteQRCode = async (id: string) => {
    if (!confirm('Are you sure you want to delete this QR code?')) return;

    try {
      setLoading(true);
      await QRCodeService.deleteQRCode(id);
      await loadQRCodes();
      alert('QR code deleted successfully!');
    } catch (error) {
      console.error('Error deleting QR code:', error);
      alert('Failed to delete QR code');
    } finally {
      setLoading(false);
    }
  };

  const toggleQRCodeStatus = async (id: string, currentStatus: boolean) => {
    try {
      setLoading(true);
      await QRCodeService.toggleQRCodeStatus(id, currentStatus);
      await loadQRCodes();
    } catch (error) {
      console.error('Error toggling QR code status:', error);
      alert('Failed to update QR code status');
    } finally {
      setLoading(false);
    }
  };

  const downloadQRCode = async (qrCode: QRCodeRecord) => {
    try {
      await QRCodeService.downloadQRCode(qrCode);
    } catch (error) {
      console.error('Error downloading QR code:', error);
      alert('Failed to download QR code');
    }
  };

  const openEditModal = (qrCode: QRCodeRecord) => {
    setSelectedQR(qrCode);
    setTableNumber(qrCode.table_number.toString());
    setLocation(qrCode.location || '');
    setFeedbackUrl(qrCode.feedback_url);
    setFormErrors({});
    setShowEditModal(true);
  };

  const openCreateModal = () => {
    setTableNumber('');
    setLocation('');
    setFeedbackUrl('');
    setFormErrors({});
    setShowCreateModal(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Settings & Configuration</h1>
      </div>

      {/* Offer Settings */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center mb-4">
          <Percent className="w-6 h-6 mr-3 text-blue-600" />
          <h2 className="text-lg font-semibold text-gray-900">Offer Settings</h2>
        </div>
        <div className="space-y-4">
          <div>
            <label htmlFor="discount-rate" className="block text-sm font-medium text-gray-700">
              Default Discount Rate
            </label>
            <div className="mt-1 flex rounded-md shadow-sm">
              <input
                type="number"
                name="discount-rate"
                id="discount-rate"
                value={discountRate}
                onChange={(e) => setDiscountRate(e.target.value)}
                className="block w-full rounded-none rounded-l-md border-gray-300 sm:text-sm p-2 border"
                placeholder="10"
              />
              <span className="inline-flex items-center rounded-r-md border border-l-0 border-gray-300 bg-gray-50 px-3 text-gray-500 sm:text-sm">
                %
              </span>
            </div>
            <p className="mt-2 text-xs text-gray-500">The default discount percentage for new offers.</p>
          </div>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700">
            Save Changes
          </button>
        </div>
      </div>

      {/* QR Code Management */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <QrCode className="w-6 h-6 mr-3 text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-900">Table QR Codes</h2>
          </div>
          <button
            onClick={openCreateModal}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md text-sm font-medium hover:bg-green-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create New QR Code
          </button>
        </div>

        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Table #
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {qrCodes.map((qrCode) => (
                  <tr key={qrCode.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {qrCode.table_number}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {qrCode.location || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        qrCode.is_active 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {qrCode.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(qrCode.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button
                        onClick={() => downloadQRCode(qrCode)}
                        className="text-blue-600 hover:text-blue-900"
                        title="Download QR Code"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => openEditModal(qrCode)}
                        className="text-green-600 hover:text-green-900"
                        title="Edit QR Code"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => toggleQRCodeStatus(qrCode.id, qrCode.is_active)}
                        className={`${qrCode.is_active ? 'text-yellow-600 hover:text-yellow-900' : 'text-green-600 hover:text-green-900'}`}
                        title={qrCode.is_active ? 'Deactivate' : 'Activate'}
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteQRCode(qrCode.id)}
                        className="text-red-600 hover:text-red-900"
                        title="Delete QR Code"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {qrCodes.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No QR codes found. Create your first one!
              </div>
            )}
          </div>
        )}
      </div>

      {/* Create QR Code Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create New QR Code"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Table Number *</label>
            <input
              type="number"
              value={tableNumber}
              onChange={(e) => setTableNumber(e.target.value)}
              className={`mt-1 block w-full border rounded-md px-3 py-2 ${
                formErrors.tableNumber ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="1"
            />
            {formErrors.tableNumber && (
              <p className="mt-1 text-sm text-red-600">{formErrors.tableNumber}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Location</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
              placeholder="Ground Floor, Outdoor, etc."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Feedback URL *</label>
            <input
              type="url"
              value={feedbackUrl}
              onChange={(e) => setFeedbackUrl(e.target.value)}
              className={`mt-1 block w-full border rounded-md px-3 py-2 ${
                formErrors.feedbackUrl ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="https://yourdomain.com/feedback?table=1"
            />
            {formErrors.feedbackUrl && (
              <p className="mt-1 text-sm text-red-600">{formErrors.feedbackUrl}</p>
            )}
          </div>
          <div className="flex space-x-3 pt-4">
            <button
              onClick={createQRCode}
              disabled={loading}
              className="flex-1 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create QR Code'}
            </button>
            <button
              onClick={() => setShowCreateModal(false)}
              className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>

      {/* Edit QR Code Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edit QR Code"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Table Number *</label>
            <input
              type="number"
              value={tableNumber}
              onChange={(e) => setTableNumber(e.target.value)}
              className={`mt-1 block w-full border rounded-md px-3 py-2 ${
                formErrors.tableNumber ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="1"
            />
            {formErrors.tableNumber && (
              <p className="mt-1 text-sm text-red-600">{formErrors.tableNumber}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Location</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
              placeholder="Ground Floor, Outdoor, etc."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Feedback URL *</label>
            <input
              type="url"
              value={feedbackUrl}
              onChange={(e) => setFeedbackUrl(e.target.value)}
              className={`mt-1 block w-full border rounded-md px-3 py-2 ${
                formErrors.feedbackUrl ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="https://yourdomain.com/feedback?table=1"
            />
            {formErrors.feedbackUrl && (
              <p className="mt-1 text-sm text-red-600">{formErrors.feedbackUrl}</p>
            )}
          </div>
          <div className="flex space-x-3 pt-4">
            <button
              onClick={updateQRCode}
              disabled={loading}
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Updating...' : 'Update QR Code'}
            </button>
            <button
              onClick={() => setShowEditModal(false)}
              className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default SettingsPage; 