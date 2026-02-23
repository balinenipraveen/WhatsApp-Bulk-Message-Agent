import React, { useState, useEffect } from 'react';
import { getAllCampaigns, getCampaignLogs, deleteCampaign } from '../services/api';

const CampaignList = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [logs, setLogs] = useState([]);
  const [showLogs, setShowLogs] = useState(false);

  useEffect(() => {
    loadCampaigns();

    // Auto-refresh every 5 seconds if there are active campaigns
    const interval = setInterval(() => {
      loadCampaigns();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const loadCampaigns = async () => {
    try {
      const response = await getAllCampaigns();
      setCampaigns(response.data);
    } catch (error) {
      console.error('Error loading campaigns:', error);
    } finally {
      setLoading(false);
    }
  };

  const viewLogs = async (campaign) => {
    try {
      setSelectedCampaign(campaign);
      const response = await getCampaignLogs(campaign._id);
      setLogs(response.data);
      setShowLogs(true);
    } catch (error) {
      console.error('Error loading logs:', error);
    }
  };

  const handleDelete = async (campaignId) => {
    if (window.confirm('Are you sure you want to delete this campaign?')) {
      try {
        await deleteCampaign(campaignId);
        loadCampaigns();
      } catch (error) {
        alert('Error deleting campaign: ' + error.message);
      }
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      draft: { emoji: '📝', class: 'status-draft' },
      sending: { emoji: '📤', class: 'status-sending' },
      completed: { emoji: '✅', class: 'status-completed' },
      failed: { emoji: '❌', class: 'status-failed' },
      paused: { emoji: '⏸️', class: 'status-paused' }
    };
    const badge = badges[status] || badges.draft;
    return <span className={`status-badge ${badge.class}`}>{badge.emoji} {status}</span>;
  };

  const getLogStatusBadge = (status) => {
    const badges = {
      pending: '⏳',
      sent: '✅',
      delivered: '📬',
      read: '👁️',
      failed: '❌'
    };
    return <span className="log-status">{badges[status] || '?'} {status}</span>;
  };

  if (loading) {
    return <div className="loading">Loading campaigns...</div>;
  }

  return (
    <div className="campaign-list">
      <h2>📊 Campaign History</h2>

      {campaigns.length === 0 ? (
        <div className="empty-state">
          <p>No campaigns yet. Create your first campaign above!</p>
        </div>
      ) : (
        <div className="campaigns-grid">
          {campaigns.map((campaign) => (
            <div key={campaign._id} className="campaign-card">
              <div className="campaign-header">
                <h3>{campaign.name}</h3>
                {getStatusBadge(campaign.status)}
              </div>

              <div className="campaign-stats">
                <div className="stat">
                  <span className="stat-label">Total</span>
                  <span className="stat-value">{campaign.totalMessages}</span>
                </div>
                <div className="stat">
                  <span className="stat-label">Sent</span>
                  <span className="stat-value success">{campaign.sentMessages}</span>
                </div>
                <div className="stat">
                  <span className="stat-label">Failed</span>
                  <span className="stat-value error">{campaign.failedMessages}</span>
                </div>
              </div>

              <div className="campaign-message">
                <strong>Message:</strong>
                <p>{campaign.messageTemplate.substring(0, 100)}...</p>
              </div>

              <div className="campaign-footer">
                <small>Created: {new Date(campaign.createdAt).toLocaleString()}</small>
                <div className="campaign-actions">
                  <button
                    className="btn btn-small btn-secondary"
                    onClick={() => viewLogs(campaign)}
                  >
                    View Logs
                  </button>
                  {campaign.status !== 'sending' && (
                    <button
                      className="btn btn-small btn-danger"
                      onClick={() => handleDelete(campaign._id)}
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Logs Modal */}
      {showLogs && selectedCampaign && (
        <div className="modal-overlay" onClick={() => setShowLogs(false)}>
          <div className="modal-content logs-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>📜 Message Logs - {selectedCampaign.name}</h2>
              <button className="close-btn" onClick={() => setShowLogs(false)}>×</button>
            </div>

            <div className="modal-body">
              <div className="logs-list">
                {logs.map((log) => (
                  <div key={log._id} className="log-item">
                    <div className="log-header">
                      <strong>{log.customerName}</strong>
                      <span className="phone">{log.phoneNumber}</span>
                      {getLogStatusBadge(log.status)}
                    </div>
                    <div className="log-message">{log.personalizedMessage}</div>
                    {log.errorMessage && (
                      <div className="log-error">❌ Error: {log.errorMessage}</div>
                    )}
                    {log.sentAt && (
                      <div className="log-time">
                        <small>Sent: {new Date(log.sentAt).toLocaleString()}</small>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowLogs(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CampaignList;

