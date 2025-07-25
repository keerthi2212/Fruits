import React, { useState, useEffect, useRef } from 'react';
import './Payment.css';
import { Link, useNavigate } from 'react-router-dom';

const navLinks = [
  { to: '/Home', image: require('../Images/Fahome.png'), label: 'Home', className:'nav-link' },
  { to: '/products', image: require('../Images/Fabox.png'), label: 'Products', className:'nav-link' },
  { to: '/Orders', image: require('../Images/order.png'), label: 'Your Orders', className:'nav-link' },
  { to: '/Profile', image: require('../Images/Fauser.png'), label: 'Profile' , className:'nav-link' },
  { to: '/Wallet', image: require('../Images/wallet.png'), label: 'Wallet' , className:'nav-link' },
  { to: '/Yourcoupons', image: require('../Images/co.png'), label: 'Your Coupons' , className:'nav-link' },
  { to: '/Yourrating', image: require('../Images/rate.png'), label: 'Your Rating', className:'nav-link' },
  { to: '/Payment', image: require('../Images/payment.png'), label: 'Payment' , className:'nav-link link-active' },
  { to: '/settings', image: require('../Images/settings-24.png'), label: 'Settings' , className:'nav-link' },
  { to: '/address', image: require('../Images/location.png'), label: 'Address', className:'nav-link ' },
  { to: '/help', image: require('../Images/help-c.png'), label: 'Help Center', className:'nav-link' },
];

function Payment() {
  // Get cart items count from localStorage
  const [cartCount, setCartCount] = useState(0);
  useEffect(() => {
    const cartData = JSON.parse(localStorage.getItem('cart') || '{}');
    setCartCount(Object.keys(cartData).length);
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
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({ type: '', label: '', method: '' });

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

  // Modal open handler
  const openModal = (type, label, method) => {
    setModalContent({ type, label, method });
    setModalOpen(true);
  };
  const closeModal = () => setModalOpen(false);

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
        {/* --- PAYMENT PAGE CONTENT GOES HERE --- */}
        <section className="payment-content">
          <h2><img src='https://cdn-icons-png.flaticon.com/512/552/552788.png'  className='png-flat'/> &nbsp;Payment</h2>
          <p>Manage your payment methods, view your payment history, and add new cards or UPI IDs for a seamless checkout experience.</p>

          {/* Top row: UPI and Cards side by side */}
          <div className="payment-methods-row">
            <div className="saved-section payment-upi-section no-bg-section">
              <div className="section-header-row">
                <h3><img src='https://static.vecteezy.com/system/resources/previews/020/716/209/non_2x/flat-icon-bank-bank-icon-where-to-keep-money-illustration-of-saving-in-the-bank-free-png.png' className='flat-icon-img' /> Saved UPI IDs</h3>
                <button className="payment-add-btn" onClick={() => openModal('Add', 'UPI', '')}><i className="fa fa-plus-circle"></i> Add New UPI</button>
              </div>
              <ul className="saved-list">
                <li><span><i className="fa fa-user-circle"></i> keerthi@ybl</span> <span>
                  <button className="edit-btn" onClick={() => openModal('Edit', 'UPI', 'keerthi@ybl')}><i className="fa fa-pencil"></i> Edit</button>
                  <button className="delete-btn" onClick={() => openModal('Delete', 'UPI', 'keerthi@ybl')}><i className="fa fa-trash"></i> Delete</button></span></li>
                <li><span><i className="fa fa-user-circle"></i> keerthi123@okicici</span> <span>
                  <button className="edit-btn" onClick={() => openModal('Edit', 'UPI', 'keerthi123@okicici')}><i className="fa fa-pencil"></i> Edit</button>
                  <button className="delete-btn" onClick={() => openModal('Delete', 'UPI', 'keerthi123@okicici')}><i className="fa fa-trash"></i> Delete</button></span></li>
              </ul>
            </div>
            <div className="saved-section payment-card-section no-bg-section">
              <div className="section-header-row">
                <h3><img src='https://w7.pngwing.com/pngs/155/195/png-transparent-credit-card-debit-card-bank-computer-icons-and-simple-business-icons-use-these-icons-for-print-or-web-they-re-100-angle-text-rectangle.png' className='flat-icon-card' /> Saved Cards</h3>
                <button className="payment-add-btn" onClick={() => openModal('Add', 'Card', '')}><i className="fa fa-plus-circle"></i> Add New Card</button>
              </div>
              <ul className="saved-list">
                <li><span><i className="fa fa-cc-visa"></i> **** **** **** 1234 (Visa)</span> <span>
                  <button className="edit-btn" onClick={() => openModal('Edit', 'Card', '**** **** **** 1234 (Visa)')}><i className="fa fa-pencil"></i> Edit</button>
                  <button className="delete-btn" onClick={() => openModal('Delete', 'Card', '**** **** **** 1234 (Visa)')}><i className="fa fa-trash"></i> Delete</button></span></li>
                <li><span><i className="fa fa-cc-mastercard"></i> **** **** **** 5678 (Mastercard)</span> <span>
                  <button className="edit-btn" onClick={() => openModal('Edit', 'Card', '**** **** **** 5678 (Mastercard)')}><i className="fa fa-pencil"></i> Edit</button>
                  <button className="delete-btn" onClick={() => openModal('Delete', 'Card', '**** **** **** 5678 (Mastercard)')}><i className="fa fa-trash"></i> Delete</button></span></li>
              </ul>
            </div>
          </div>

          {/* Other Saved Payment Methods */}
          <div className="saved-section payment-other-section">
            <div className="section-header-row">
              <h3><img src='https://cdn-icons-png.flaticon.com/512/671/671517.png' className='falt-icon-payment' /> Other Saved Payment Methods</h3>
              <button className="payment-add-btn" onClick={() => openModal('Add', 'Wallet', '')}><i className="fa fa-plus-circle"></i> Add New Method</button>
            </div>
            <div className="payment-other-desc"><i className="fa fa-info-circle"></i> Manage your wallets and alternative payment options for faster checkout. You can add Paytm, Amazon Pay, PhonePe, and more.</div>
            <ul className="saved-list">
              <li><span><img src='https://cdn4.iconfinder.com/data/icons/banking-and-money-13/32/banking_transaction_history_clock-512.png' className='payment-wall' /> Paytm Wallet</span> <span>
                <button className="edit-btn" onClick={() => openModal('Edit', 'Wallet', 'Paytm Wallet')}><i className="fa fa-pencil"></i> Edit</button>
                <button className="delete-btn" onClick={() => openModal('Delete', 'Wallet', 'Paytm Wallet')}><i className="fa fa-trash"></i> Delete</button></span></li>
              <li><span><i className="fa fa-amazon"></i> Amazon Pay</span> <span>
                <button className="edit-btn" onClick={() => openModal('Edit', 'Wallet', 'Amazon Pay')}><i className="fa fa-pencil"></i> Edit</button>
                <button className="delete-btn" onClick={() => openModal('Delete', 'Wallet', 'Amazon Pay')}><i className="fa fa-trash"></i> Delete</button></span></li>
              <li><span><i className="fa fa-phone"></i> PhonePe</span> <span>
                <button className="edit-btn" onClick={() => openModal('Edit', 'Wallet', 'PhonePe')}><i className="fa fa-pencil"></i> Edit</button>
                <button className="delete-btn" onClick={() => openModal('Delete', 'Wallet', 'PhonePe')}><i className="fa fa-trash"></i> Delete</button></span></li>
            </ul>
          </div>

          {/* Payment History Section */}
          <div className="history-section">
            <h3><img src='https://cdn4.iconfinder.com/data/icons/banking-and-money-13/32/banking_transaction_history_clock-512.png' className='payment-w' /> Payment History</h3>
            <table className="history-table">
              <thead>
                <tr>
                  <th><i className="fa fa-calendar"></i> Date</th>
                  <th><i className="fa fa-rupee-sign"></i> Amount</th>
                  <th><i className="fa fa-money-check-alt"></i> Method</th>
                  <th><i className="fa fa-check-circle"></i> Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>2024-06-10</td>
                  <td>₹500</td>
                  <td><i className="fa fa-university"></i> UPI (keerthi@ybl)</td>
                  <td><i className="fa fa-check-circle" style={{color:'#22c55e'}}></i> Success</td>
                </tr>
                <tr>
                  <td>2024-06-08</td>
                  <td>₹1200</td>
                  <td><i className="fa fa-cc-visa"></i> Card (**** 1234)</td>
                  <td><i className="fa fa-check-circle" style={{color:'#22c55e'}}></i> Success</td>
                </tr>
                <tr>
                  <td>2024-06-05</td>
                  <td>₹300</td>
                  <td><i className="fa fa-mobile-alt"></i> Paytm Wallet</td>
                  <td><i className="fa fa-times-circle" style={{color:'#ef4444'}}></i> Failed</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </main>
      {/* Modal for Add/Edit/Delete */}
      {modalOpen && (
        <div className="payment-modal-overlay" onClick={closeModal}>
          <div className="payment-modal" onClick={e => e.stopPropagation()}>
            <h4>
              {modalContent.type === 'Add' && <><i className="fa fa-plus-circle"></i> Add {modalContent.label}</>}
              {modalContent.type === 'Edit' && <><i className="fa fa-pencil"></i> Edit {modalContent.label}</>}
              {modalContent.type === 'Delete' && <><i className="fa fa-trash"></i> Delete {modalContent.label}</>}
            </h4>
            <div style={{marginBottom: '12px', textAlign: 'center'}}>
              {/* Show input fields for Add/Edit */}
              {(modalContent.type === 'Add' || modalContent.type === 'Edit') && (
                <form className="payment-modal-form">
                  {modalContent.label === 'UPI' && (
                    <input type="text" className="payment-modal-input" placeholder="Enter UPI ID" defaultValue={modalContent.method || ''} />
                  )}
                  {modalContent.label === 'Card' && (
                    <>
                      <input type="text" className="payment-modal-input" placeholder="Card Number" defaultValue={modalContent.method ? modalContent.method.replace(/[^0-9]/g, '') : ''} maxLength={16} />
                      <input type="text" className="payment-modal-input" placeholder="Cardholder Name" />
                      <input type="text" className="payment-modal-input" placeholder="Expiry (MM/YY)" maxLength={5} />
                      <input type="text" className="payment-modal-input" placeholder="CVV" maxLength={3} />
                    </>
                  )}
                  {modalContent.label === 'Wallet' && (
                    <>
                      <input type="text" className="payment-modal-input" placeholder="Wallet Name (e.g. Paytm, Amazon Pay)" defaultValue={modalContent.method || ''} />
                      <input type="text" className="payment-modal-input" placeholder="Mobile/Account Number" />
                    </>
                  )}
                  <div className="modal-actions">
                    <button className="payment-add-btn" type="submit"><i className="fa fa-save"></i> Save</button>
                    <button className="modal-close-btn" type="button" onClick={closeModal}><i className="fa fa-times"></i> Close</button>
                  </div>
                </form>
              )}
              {/* Show confirmation for Delete */}
              {modalContent.type === 'Delete' && (
                <>
                  {modalContent.method && <div><b>Method:</b> {modalContent.method}</div>}
                  <div>Are you sure you want to delete this {modalContent.label}?</div>
                  <div className="modal-actions">
                    <button className="payment-add-btn" style={{background:'#1a237e', color:'#fff'}}><i className="fa fa-trash"></i> Confirm Delete</button>
                    <button className="modal-close-btn" type="button" onClick={closeModal}><i className="fa fa-times"></i> Close</button>
                  </div>
                </>
              )}
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

export default Payment;