import React, { useState, useEffect } from 'react';
import { previewMessages } from '../services/api';

const Preview = ({ template, customers, onClose, onConfirm, imagePreview = null }) => {
  const [previews, setPreviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPreviews = async () => {
      try {
        setLoading(true);
        const response = await previewMessages(template, customers, 5);
        setPreviews(response.data.previews);
      } catch (error) {
        console.error('Error loading previews:', error);
      } finally {
        setLoading(false);
      }
    };

    if (template && customers && customers.length > 0) {
      loadPreviews();
    }
  }, [template, customers]);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>📋 Preview Messages</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="modal-body">
          {loading ? (
            <div className="loading">Loading previews...</div>
          ) : (
            <>
              <div className="preview-summary">
                <p>
                  <strong>{customers.length}</strong> message{customers.length !== 1 ? 's' : ''} will be sent
                </p>
                {imagePreview && (
                  <div className="image-preview-container">
                    <p><strong>📷 Image will be attached:</strong></p>
                    <img src={imagePreview} alt="Message attachment" className="preview-image" />
                  </div>
                )}
              </div>

              <div className="preview-list">
                <h3>Sample Messages (showing {previews.length} of {customers.length}):</h3>
                {previews.map((preview, index) => (
                  <div key={index} className="preview-item">
                    <div className="preview-header">
                      <strong>{preview.name}</strong>
                      <span className="phone">{preview.phoneNumber}</span>
                    </div>
                    <div className="preview-message">
                      {preview.personalizedMessage}
                    </div>
                  </div>
                ))}
              </div>

              {customers.length > 5 && (
                <p className="preview-note">
                  ... and {customers.length - 5} more message{customers.length - 5 !== 1 ? 's' : ''}
                </p>
              )}
            </>
          )}
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button className="btn btn-primary" onClick={onConfirm} disabled={loading}>
            ✅ Confirm & Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Preview;

