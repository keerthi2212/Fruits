import React, { useState, useEffect, useRef } from 'react';
import './Settings.css';
import { Link, useNavigate } from 'react-router-dom';
import accset from '../Images/setting-page.png';
import nofper from '../Images/bell-no.png';
import prisett from '../Images/secu.png';
import feedpage from '../Images/feedback-page.png';

const navLinks = [
  { to: '/Home', image: require('../Images/Fahome.png'), label: 'Home', className:'nav-link' },
  { to: '/products', image: require('../Images/Fabox.png'), label: 'Products', className:'nav-link' },
  { to: '/Orders', image: require('../Images/order.png'), label: 'Your Orders', className:'nav-link' },
  { to: '/Profile', image: require('../Images/Fauser.png'), label: 'Profile' , className:'nav-link' },
  { to: '/Wallet', image: require('../Images/wallet.png'), label: 'Wallet' , className:'nav-link' },
  { to: '/Yourcoupons', image: require('../Images/co.png'), label: 'Your Coupons' , className:'nav-link' },
  { to: '/Yourrating', image: require('../Images/rate.png'), label: 'Your Rating', className:'nav-link' },
  { to: '/Payment', image: require('../Images/payment.png'), label: 'Payment' , className:'nav-link' },
  { to: '/settings', image: require('../Images/settings-24.png'), label: 'Settings' , className:'nav-link link-active' },
  { to: '/address', image: require('../Images/location.png'), label: 'Address', className:'nav-link' },
  { to: '/help', image: require('../Images/help-c.png'), label: 'Help Center', className:'nav-link' },
];

function Settings() {

// Cart count state synced with localStorage
  const [cartCount, setCartCount] = React.useState(() => {
    const cartData = JSON.parse(localStorage.getItem('cart') || '{}');
    return Object.keys(cartData).length;
  });
  React.useEffect(() => {
    const handleStorage = (e) => {
      if (e.key === 'cart') {
        const newCart = JSON.parse(e.newValue || '{}');
        setCartCount(Object.keys(newCart).length);
      }
    };
    window.addEventListener('storage', handleStorage);
    // Also update on mount in case cart changed in this tab
    const cartData = JSON.parse(localStorage.getItem('cart') || '{}');
    setCartCount(Object.keys(cartData).length);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);


  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [showHeaderSearch, setShowHeaderSearch] = useState(true);
  const [showNotificationDropdown, setShowNotificationDropdown] = useState(false);
  const [showMicModal, setShowMicModal] = useState(false);
  const [micListening, setMicListening] = useState(false);
  const [micResult, setMicResult] = useState('');
  const searchInputRef = useRef(null);
  const recognitionRef = useRef(null);
  const membershipTypes = [
    { key: 'premium', label: 'Premium', icon: 'fa-crown' },
  ];
  const [membershipIndex, setMembershipIndex] = useState(0);
  const currentMembership = membershipTypes[membershipIndex];
  const navigate = useNavigate();

  // Settings state
  const [language, setLanguage] = useState('English');
  const [theme, setTheme] = useState('Light');
  const [currency, setCurrency] = useState('INR');
  const [emailNotif, setEmailNotif] = useState('Enabled');
  const [smsNotif, setSmsNotif] = useState('Disabled');
  const [pushNotif, setPushNotif] = useState('Enabled');
  const [privacyModal, setPrivacyModal] = useState(false);
  const [feedbackModal, setFeedbackModal] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [openPrivacyFAQ, setOpenPrivacyFAQ] = useState(null);

  const handleSwitchMembership = () => {
    setMembershipIndex((prev) => (prev + 1) % membershipTypes.length);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY < 0) {
        setShowHeaderSearch(false);
      } else {
        setShowHeaderSearch(true);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNotificationClick = () => {
    setShowNotificationDropdown((prev) => !prev);
  };

  const handleVoiceSearch = () => {
    if (!('webkitSpeechRecognition' in window)) {
      setMicResult('Voice recognition not supported in this browser.');
      setShowMicModal(true);
      return;
    }
    setShowMicModal(true);
    setMicListening(true);
    setMicResult('');
    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = 'en-US';
    recognition.start();
    recognitionRef.current = recognition;
    recognition.onresult = function(event) {
      const transcript = event.results[0][0].transcript;
      setSearchText(transcript);
      setMicResult(transcript);
      setMicListening(false);
      if (searchInputRef.current) searchInputRef.current.value = transcript;
    };
    recognition.onerror = function(event) {
      setMicResult('Voice recognition error: ' + event.error);
      setMicListening(false);
    };
    recognition.onend = function() {
      setMicListening(false);
    };
  };

  const handleCloseMicModal = () => {
    setShowMicModal(false);
    setMicListening(false);
    setMicResult('');
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  };

  const handleTryAgain = () => {
    setMicResult('');
    setMicListening(true);
    handleVoiceSearch();
  };

  // --- Settings page content ---
  return (
    <div className={`crm-dashboard${sidebarOpen ? '' : ' collapsed'}`}>
      <header className="main-header">
        <div className="header-left">
          <img src={require('../Images/unnamed.png')} alt="Logo" className="logo" />
          <button className="menu-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>
            <i className="fa fa-bars" style={{ color: '#2563eb' }}></i>
          </button>
          <span className={`membership-badge premium${currentMembership.key === 'premium' ? ' active' : ' inactive'}`}> 
            <i className={`fa ${currentMembership.icon}`}></i> {currentMembership.label}
          </span>
        </div>
        {showHeaderSearch && (
          <div className="search-bar header-search-bar">
            <span className="search-bar-icon">
              <i className="fa fa-search"></i>
            </span>
            <input
              type="text"
              placeholder="Search for Items"
              value={searchText}
              ref={searchInputRef}
              onChange={e => setSearchText(e.target.value)}
            />
            <button className="mic-btn blue" title="Voice Search" onClick={handleVoiceSearch}>
              <i className="fa fa-microphone"></i>
            </button>
          </div>
        )}
        <div className="header-right">
          <div className="header-icon-cart" onClick={() => navigate('/cart')}  style={{ position: 'relative', cursor: 'pointer' }}>
            <img className='header-icon' src={require('../Images/Cart.png')} alt="Cart" title="Cart" />
            {cartCount > 0 && (
              <span className="cart-badge-count">{cartCount}</span>
            )}
          </div>
          <img className='header-icon' src={require('../Images/Wishlist.png')} alt="Wishlist" title="Wishlist" />
          <div className="notification-wrapper">
            <img className='header-icon' src={require('../Images/bell-no.png')} alt='Notification' onClick={handleNotificationClick} style={{cursor:'pointer'}}/>
            {showNotificationDropdown && (
              <div className="notification-dropdown">
                <div className="notification-title">Notifications</div>
                <div className="notification-empty">No new notifications</div>
              </div>
            )}
          </div>
          <div className="user-info">
            <img className="user-img" src="https://randomuser.me/api/portraits/women/32.jpg" alt="User" />
            <div className="user-name">keerthi</div>
          </div>
        </div>
      </header>
      <aside className={`sidebar${sidebarOpen ? '' : ' collapsed'}`}>
        <nav className="nav-links">
          {navLinks.map(link => (
            <Link to={link.to} className={link.className} key={link.to}>
              <img src={link.image} alt={link.label} className="nav-img" />
              {sidebarOpen && <span>{link.label}</span>}
            </Link>
          ))}
        </nav>
        <div className="logout-section">
          <button className="logout-btn">
            <i className="fa fa-sign-out nav-icon"></i>
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>
      <main className="main-content">
        <section className="settings-content">
          <h2><i className="fa fa-cog"></i> Settings</h2>
          <div className="settings-section">
            <h3><img src={accset} /> Account Settings</h3>
            <div className="settings-row">
              <label><i className="fa fa-language"></i> Language</label>
              <select value={language} onChange={e => setLanguage(e.target.value)} className="settings-dropdown">
                <option>English</option>
                <option>Hindi</option>
                <option>Spanish</option>
                <option>French</option>
              </select>
            </div>
            <div className="settings-row">
              <label><i className="fa fa-adjust"></i> Theme</label>
              <select value={theme} onChange={e => setTheme(e.target.value)} className="settings-dropdown">
                <option>Light</option>
                <option>Dark</option>
                <option>System</option>
              </select>
            </div>
            <div className="settings-row">
              <label><i className="fa fa-money-bill"></i> Currency</label>
              <select value={currency} onChange={e => setCurrency(e.target.value)} className="settings-dropdown">
                <option>INR</option>
                <option>USD</option>
                <option>EUR</option>
                <option>GBP</option>
              </select>
            </div>
          </div>
          <div className="settings-section">
            <h3 className='h-detai' ><img className='set-im' src={nofper} /> Notification Preferences</h3>
            <div className="settings-row">
              <label><i className="fa fa-envelope"></i> Email</label>
              <select value={emailNotif} onChange={e => setEmailNotif(e.target.value)} className="settings-dropdown">
                <option>Enabled</option>
                <option>Disabled</option>
              </select>
            </div>
            <div className="settings-row">
              <label><i className="fa fa-sms"></i> SMS</label>
              <select value={smsNotif} onChange={e => setSmsNotif(e.target.value)} className="settings-dropdown">
                <option>Enabled</option>
                <option>Disabled</option>
              </select>
            </div>
            <div className="settings-row">
              <label><i className="fa fa-bell"></i> Push</label>
              <select value={pushNotif} onChange={e => setPushNotif(e.target.value)} className="settings-dropdown">
                <option>Enabled</option>
                <option>Disabled</option>
              </select>
            </div>
          </div>

          <div className="settings-section">
            <h3><img src={prisett} /> Privacy Settings</h3>
            <div className="settings-row">
              <span>Manage your privacy and data sharing preferences.</span>
              <button className="settings-btn" onClick={() => setPrivacyModal(true)}><i className="fa fa-shield-alt"></i> Privacy Info</button>
            </div>
            <div className="privacy-faq-list">
              {[{
                q: 'How is my data used?',
                a: 'Your data is used only to improve your shopping experience and is never sold to third parties.'
              }, {
                q: 'Can I delete my account?',
                a: 'Yes, you can request account deletion in your profile settings or by contacting support.'
              }, {
                q: 'How do I control marketing emails?',
                a: 'You can enable or disable marketing emails in Notification Preferences above.'
              }, {
                q: 'Is my payment information secure?',
                a: 'All payment data is encrypted and handled securely by trusted payment gateways.'
              }].map((item, idx) => (
                <div className="privacy-faq-item" key={idx}>
                  <button className="privacy-faq-question" onClick={() => setOpenPrivacyFAQ(openPrivacyFAQ === idx ? null : idx)}>
                    <i className={`fa fa-chevron-${openPrivacyFAQ === idx ? 'down' : 'right'}`}></i> {item.q}
                  </button>
                  {openPrivacyFAQ === idx && <div className="privacy-faq-answer">{item.a}</div>}
                </div>
              ))}
            </div>
          </div>
          <div className="settings-section">
            <h3><img src={feedpage} /> Feedback</h3>
            <div className="settings-row">
              <span>Is this site helpful?</span>
              <button className="settings-btn" onClick={() => setFeedbackModal(true)}><i className="fa fa-comment-dots"></i> Give Feedback</button>
            </div>
          </div>
        </section>
      </main>
      {/* Privacy Modal */}
      {privacyModal && (
        <div className="payment-modal-overlay" onClick={() => setPrivacyModal(false)}>
          <div className="payment-modal" onClick={e => e.stopPropagation()}>
            <i className="fa fa-times close-modal-x" onClick={() => setPrivacyModal(false)}></i>
            <h4><i className="fa fa-shield-alt"></i> Privacy Information</h4>
            <p style={{marginBottom: 18}}>We value your privacy. You can control your data sharing and visibility in your account settings. For more details, visit our privacy policy.</p>
            <div className="modal-actions">
            </div>
          </div>
        </div>
      )}
      {/* Feedback Modal */}
      {feedbackModal && (
        <div className="payment-modal-overlay" onClick={() => setFeedbackModal(false)}>
          <div className="payment-modal" onClick={e => e.stopPropagation()}>
            <i className="fa fa-times close-modal-x" onClick={() => setFeedbackModal(false)}></i>
            <h4><i className="fa fa-comment-dots"></i> Feedback</h4>
            <p style={{marginBottom: 18}}>Is this site helpful?</p>
            <div className="modal-actions">
              <button className={`settings-btn${feedback==='yes' ? ' selected' : ''}`} onClick={() => setFeedback('yes')}><i className="fa fa-thumbs-up"></i> Yes</button>
              <button className={`settings-btn${feedback==='no' ? ' selected' : ''}`} onClick={() => setFeedback('no')}><i className="fa fa-thumbs-down"></i> No</button>
            </div>
          </div>
        </div>
      )}
      {showMicModal && (
        <div className="mic-modal-overlay" onClick={handleCloseMicModal}>
          <div className="mic-modal" onClick={e => e.stopPropagation()}>
            <div className="mic-animation-container">
              <div className={`mic-animation${micListening ? ' listening' : ''}`}> 
                <i className="fa fa-microphone"></i>
                {micListening && <div className="mic-pulse"></div>}
              </div>
            </div>
            <div className="mic-modal-text">
              {micListening ? 'Listening...' : micResult ? `You said: ${micResult}` : ''}
            </div>
            {!micListening && micResult && micResult.startsWith('Voice recognition error') && (
              <button className="mic-modal-close" onClick={handleTryAgain}>Try Again</button>
            )}
            {!micListening && (!micResult || !micResult.startsWith('Voice recognition error')) && (
              <button className="mic-modal-close" onClick={handleCloseMicModal}>Close</button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Settings;