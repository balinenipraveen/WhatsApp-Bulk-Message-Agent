import React, { useState } from 'react';
import FileUploader from './FileUploader';
import MessageDrafter from './MessageDrafter';
import Preview from './Preview';
import CampaignList from './CampaignList';
import { uploadExcel, uploadImage, createCampaign, sendCampaign } from '../services/api';

const Dashboard = () => {
  const [step, setStep] = useState(1);
  const [customers, setCustomers] = useState([]);
  const [excelErrors, setExcelErrors] = useState([]);
  const [messageTemplate, setMessageTemplate] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [imagePath, setImagePath] = useState(null);
  const [campaignName, setCampaignName] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleExcelUpload = async (file) => {
    try {
      setLoading(true);
      setError(null);

      const response = await uploadExcel(file);

      if (response.success) {
        setCustomers(response.data.customers);
        setExcelErrors(response.data.errors || []);
        setSuccess(`✅ ${response.data.total} customers loaded successfully!`);
        setStep(2);
      }
    } catch (err) {
      setError('Failed to upload Excel file: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (file) => {
    try {
      setLoading(true);
      setError(null);

      const response = await uploadImage(file);

      if (response.success) {
        setImageFile(file);
        setImagePreview(URL.createObjectURL(file));
        setImagePath(response.data.path);
        setSuccess('✅ Image uploaded successfully!');
      }
    } catch (err) {
      setError('Failed to upload image: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    setImagePath(null);
  };

  const handlePreview = () => {
    if (!messageTemplate.trim()) {
      setError('Please enter a message template');
      return;
    }

    if (!campaignName.trim()) {
      setError('Please enter a campaign name');
      return;
    }

    setShowPreview(true);
  };

  const handleConfirmSend = async () => {
    try {
      setLoading(true);
      setError(null);
      setShowPreview(false);

      // Create campaign
      const campaignResponse = await createCampaign({
        name: campaignName,
        messageTemplate,
        customers,
        imagePath,
        imageUrl: imagePreview
      });

      if (campaignResponse.success) {
        const campaignId = campaignResponse.data._id;

        // Send campaign
        await sendCampaign(campaignId);

        setSuccess('✅ Campaign started! Messages are being sent in the background.');

        // Reset form
        setTimeout(() => {
          resetForm();
        }, 2000);
      }
    } catch (err) {
      setError('Failed to create/send campaign: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setStep(1);
    setCustomers([]);
    setExcelErrors([]);
    setMessageTemplate('');
    setImageFile(null);
    setImagePreview(null);
    setImagePath(null);
    setCampaignName('');
    setShowPreview(false);
    setError(null);
    setSuccess(null);
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>📱 WhatsApp Bulk Message Agent</h1>
        <p>Send personalized WhatsApp messages to multiple customers</p>
      </header>

      {/* Alerts */}
      {error && (
        <div className="alert alert-error">
          <span>{error}</span>
          <button onClick={() => setError(null)}>×</button>
        </div>
      )}

      {success && (
        <div className="alert alert-success">
          <span>{success}</span>
          <button onClick={() => setSuccess(null)}>×</button>
        </div>
      )}

      {/* Progress Steps */}
      <div className="steps">
        <div className={`step ${step >= 1 ? 'active' : ''} ${step > 1 ? 'completed' : ''}`}>
          <div className="step-number">1</div>
          <div className="step-label">Upload Excel</div>
        </div>
        <div className="step-divider"></div>
        <div className={`step ${step >= 2 ? 'active' : ''} ${step > 2 ? 'completed' : ''}`}>
          <div className="step-number">2</div>
          <div className="step-label">Draft Message</div>
        </div>
        <div className="step-divider"></div>
        <div className={`step ${step >= 3 ? 'active' : ''}`}>
          <div className="step-number">3</div>
          <div className="step-label">Send</div>
        </div>
      </div>

      {/* Main Content */}
      <div className="dashboard-content">
        {/* Step 1: Upload Excel */}
        {step === 1 && (
          <div className="step-content">
            <FileUploader
              onFileUpload={handleExcelUpload}
              accept={{
                'application/vnd.ms-excel': ['.xls'],
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
              }}
              label="📊 Upload Customer Excel File"
              icon="📊"
            />

            <div className="info-box">
              <h3>📋 Excel File Format</h3>
              <p>Your Excel file should have two columns:</p>
              <ul>
                <li><strong>Column A:</strong> Customer Name</li>
                <li><strong>Column B:</strong> Phone Number (with country code, e.g., +1234567890)</li>
              </ul>
              <p><em>The first row can optionally be headers.</em></p>
            </div>

            {excelErrors.length > 0 && (
              <div className="error-list">
                <h4>⚠️ Warnings ({excelErrors.length}):</h4>
                {excelErrors.map((err, idx) => (
                  <div key={idx} className="error-item">
                    Row {err.row}: {err.message}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Step 2: Draft Message */}
        {step === 2 && (
          <div className="step-content">
            <div className="form-group">
              <label>Campaign Name</label>
              <input
                type="text"
                className="input"
                placeholder="e.g., Summer Sale 2024"
                value={campaignName}
                onChange={(e) => setCampaignName(e.target.value)}
              />
            </div>

            <MessageDrafter
              value={messageTemplate}
              onChange={setMessageTemplate}
              customerCount={customers.length}
            />

            <FileUploader
              onFileUpload={handleImageUpload}
              accept={{
                'image/jpeg': ['.jpg', '.jpeg'],
                'image/png': ['.png'],
                'image/gif': ['.gif'],
                'image/webp': ['.webp']
              }}
              label="🖼️ Upload Image (Optional)"
              icon="🖼️"
            />

            {imagePreview && (
              <div className="image-preview-section">
                <h4>Selected Image:</h4>
                <div className="image-preview-wrapper">
                  <img src={imagePreview} alt="Preview" className="uploaded-image" />
                  <button className="remove-image-btn" onClick={removeImage}>
                    Remove Image
                  </button>
                </div>
              </div>
            )}

            <div className="customer-summary">
              <h4>📋 Loaded Customers ({customers.length}):</h4>
              <div className="customer-list">
                {customers.slice(0, 5).map((customer, idx) => (
                  <div key={idx} className="customer-item">
                    <span className="customer-name">{customer.name}</span>
                    <span className="customer-phone">{customer.phoneNumber}</span>
                  </div>
                ))}
                {customers.length > 5 && (
                  <div className="customer-item more">
                    ... and {customers.length - 5} more
                  </div>
                )}
              </div>
            </div>

            <div className="button-group">
              <button className="btn btn-secondary" onClick={() => setStep(1)}>
                ← Back
              </button>
              <button
                className="btn btn-primary"
                onClick={handlePreview}
                disabled={!messageTemplate.trim() || !campaignName.trim()}
              >
                Preview & Send →
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Preview Modal */}
      {showPreview && (
        <Preview
          template={messageTemplate}
          customers={customers}
          imagePreview={imagePreview}
          onClose={() => setShowPreview(false)}
          onConfirm={handleConfirmSend}
        />
      )}

      {/* Loading Overlay */}
      {loading && (
        <div className="loading-overlay">
          <div className="spinner"></div>
          <p>Processing...</p>
        </div>
      )}

      {/* Campaign List */}
      <CampaignList />
    </div>
  );
};

export default Dashboard;

