import React from 'react';

const MessageDrafter = ({ value, onChange, customerCount = 0 }) => {
  const charCount = value ? value.length : 0;
  const maxChars = 4096;

  const insertPlaceholder = () => {
    const cursorPosition = document.getElementById('messageTextarea').selectionStart;
    const newValue = value.substring(0, cursorPosition) + '{name}' + value.substring(cursorPosition);
    onChange(newValue);
  };

  return (
    <div className="message-drafter">
      <div className="drafter-header">
        <label className="drafter-label">Message Template</label>
        <button
          type="button"
          className="placeholder-btn"
          onClick={insertPlaceholder}
          title="Insert {name} placeholder"
        >
          + Insert {'{name}'}
        </button>
      </div>

      <textarea
        id="messageTextarea"
        className="message-textarea"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Type your message here... Use {name} to personalize with customer names.

Example: Hi {name}, we have a special offer just for you!"
        rows={8}
      />

      <div className="drafter-footer">
        <span className="char-count">
          {charCount} / {maxChars} characters
        </span>
        {customerCount > 0 && (
          <span className="recipient-count">
            📱 {customerCount} recipient{customerCount !== 1 ? 's' : ''}
          </span>
        )}
      </div>

      <div className="message-hint">
        💡 <strong>Tip:</strong> Use <code>{'{name}'}</code> placeholder to personalize messages.
        It will be replaced with each customer's name automatically.
      </div>
    </div>
  );
};

export default MessageDrafter;

