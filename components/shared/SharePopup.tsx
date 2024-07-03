import React, { useState } from "react";
import {
  FaFacebook,
  FaTwitter,
  FaLinkedin,
  FaCopy,
  FaTimes,
} from "react-icons/fa";

interface Props {
  threadLink: string;
  onClose: () => void;
}

const SharePopup = ({ threadLink, onClose }: Props) => {
  const [showNotification, setShowNotification] = useState(false);
  const handleCopyLink = () => {
    navigator.clipboard.writeText(threadLink);
    setShowNotification(true);
    setTimeout(() => {
      setShowNotification(false);
    }, 3000);
  };

  return (
    <div className="popup">
      <div className="popup-content">
        <h3>Share this thread</h3>
        <button className="close-icon" onClick={onClose}>
          <FaTimes size={24} />
        </button>
        <div className="share-options">
          <a
            href={`https://www.facebook.com/sharer/sharer.php?u=${threadLink}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaFacebook size={24} className="share-icon" />
          </a>
          <a
            href={`https://twitter.com/intent/tweet?url=${threadLink}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaTwitter size={24} className="share-icon" />
          </a>
          <a
            href={`https://www.linkedin.com/shareArticle?mini=true&url=${threadLink}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaLinkedin size={24} className="share-icon" />
          </a>
          <button onClick={handleCopyLink}>
            <FaCopy size={24} className="share-icon" />
          </button>
        </div>
      </div>
      {showNotification && (
        <div className="notification">Link copied to clipboard!</div>
      )}
    </div>
  );
};

export default SharePopup;
