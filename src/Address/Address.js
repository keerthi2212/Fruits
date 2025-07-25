import React, { useState, useEffect, useRef } from 'react';
import './Address.css';
import { Link, useNavigate } from 'react-router-dom';

const navLinks = [
  { to: '/Home', image: require('../Images/Fahome.png'), label: 'Home', className:'nav-link' },
  { to: '/products', image: require('../Images/Fabox.png'), label: 'Products', className:'nav-link' },
  { to: '/Orders', image: require('../Images/order.png'), label: 'Your Orders', className:'nav-link' },
  { to: '/profile', image: require('../Images/Fauser.png'), label: 'Profile' , className:'nav-link' },
  { to: '/Wallet', image: require('../Images/wallet.png'), label: 'Wallet' , className:'nav-link' },
  { to: '/Yourcoupons', image: require('../Images/co.png'), label: 'Your Coupons' , className:'nav-link' },
  { to: '/Yourrating', image: require('../Images/rate.png'), label: 'Your Rating', className:'nav-link' },
  { to: '/Payment', image: require('../Images/payment.png'), label: 'Payment' , className:'nav-link' },
  { to: '/settings', image: require('../Images/settings-24.png'), label: 'Settings' , className:'nav-link' },
  { to: '/address', image: require('../Images/location.png'), label: 'Address', className:'nav-link link-active' },
  { to: '/help', image: require('../Images/help-c.png'), label: 'Help Center', className:'nav-link' },
];

function Address() {
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
  const [addressModal, setAddressModal] = useState(false);
  const [addresses, setAddresses] = useState([
    {
      name: 'Keerthi',
      phone: '9876543210',
      address: '123, Main Street',
      city: 'Bangalore',
      state: 'Karnataka',
      pincode: '560001',
      type: 'Home',
    },
    {
      name: 'Ravi',
      phone: '9123456789',
      address: '456, Market Road',
      city: 'Chennai',
      state: 'Tamil Nadu',
      pincode: '600001',
      type: 'Office',
    },
    {
        name: 'Kumar',
        phone: '987886534',
        address: '1-8-6, Ameerpet, Market Road',
        city: 'Hyderabad',
        state: 'Telangana',
        pincode: '500038',
        type: 'Other',
      },
  ]);
  const [newAddress, setNewAddress] = useState({
    name: '', phone: '', address: '', city: '', state: '', pincode: '', landmark: '', type: 'Home',
  });
  const [locating, setLocating] = useState(false);
  const searchInputRef = useRef(null);
  const recognitionRef = useRef(null);
  const membershipTypes = [
    { key: 'premium', label: 'Premium', icon: 'fa-crown' },
  ];
  const [membershipIndex, setMembershipIndex] = useState(0);
  const currentMembership = membershipTypes[membershipIndex];
  const navigate = useNavigate();
  const [modal, setModal] = useState({ type: null, idx: null });
  const [editAddress, setEditAddress] = useState(null);

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

  // Simulate location fill
  const handleLocate = () => {
    setLocating(true);
    setTimeout(() => {
      setNewAddress({
        name: '',
        phone: '',
        address: '789, Residency Road',
        city: 'Hyderabad',
        state: 'Telangana',
        pincode: '500001',
        type: 'other',
      });
      setLocating(false);
    }, 1200);
  };

  // Add address handler
  const handleAddAddress = (e) => {
    e.preventDefault();
    setAddresses([...addresses, newAddress]);
    setNewAddress({ name: '', phone: '', address: '', city: '', state: '', pincode: '', landmark: '', type: 'Home' });
    setAddressModal(false);
  };

  // Reset form
  const handleReset = () => {
    setNewAddress({ name: '', phone: '', address: '', city: '', state: '', pincode: '', landmark: '', type: 'Home' });
  };

  // Placeholder handlers for view, edit, delete
  const handleView = (idx) => setModal({ type: 'view', idx });
  const handleEdit = (idx) => {
    setEditAddress({ ...addresses[idx] });
    setModal({ type: 'edit', idx });
  };
  const handleDelete = (idx) => setModal({ type: 'delete', idx });

  const handleEditSave = (e) => {
    e.preventDefault();
    setAddresses(addresses.map((a, i) => i === modal.idx ? editAddress : a));
    setModal({ type: null, idx: null });
    setEditAddress(null);
  };
  const handleDeleteConfirm = () => {
    setAddresses(addresses.filter((_, i) => i !== modal.idx));
    setModal({ type: null, idx: null });
  };
  const closeModal = () => {
    setModal({ type: null, idx: null });
    setEditAddress(null);
  };

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
        <section className="address-content">
          <div className="address-header-row">
            <h2><i className="fa fa-map-marker-alt"></i> Address Book</h2>
            <button className="address-add-btn" onClick={() => setAddressModal(true)}><i className="fa fa-plus"></i> Add Delivery Address</button>
          </div>
          <div className="address-list address-list-grid">
            {addresses.map((addr, idx) => (
              <div className="address-card-card" key={idx}>
                <div className="address-card-top">
                  <div className="address-type">
                    <i className={`fa fa-${addr.type === 'Home' ? 'home' : addr.type === 'Office' ? 'building' : 'map-marker-alt'}`}></i> {addr.type}
                  </div>
                  <div className="address-actions-abs">
                    <button className="address-action-btn view" title="View" onClick={() => handleView(idx)}><i className="fa fa-eye"></i></button>
                    <button className="address-action-btn edit" title="Edit" onClick={() => handleEdit(idx)}><i className="fa fa-edit"></i></button>
                    <button className="address-action-btn delete" title="Delete" onClick={() => handleDelete(idx)}><i className="fa fa-trash"></i></button>
                  </div>
                </div>
                <div className="address-details">
                  <div><b>{addr.name}</b> ({addr.phone})</div>
                  <div>{addr.address}, {addr.city}, {addr.state} - {addr.pincode}</div>
                  {addr.landmark && <div>Landmark: {addr.landmark}</div>}
                </div>
              </div>
            ))}
            {addresses.length === 0 && <div className="address-empty">No addresses saved yet.</div>}
          </div>
        </section>
      </main>
      {/* View Modal */}
      {modal.type === 'view' && (
        <div className="address-modal-overlay" onClick={closeModal}>
          <div className="address-modal address-add-wide" onClick={e => e.stopPropagation()}>
            <i className="fa fa-times close-modal-x" onClick={closeModal}></i>
            <h4 className='add-de' ><i className="fa fa-eye"></i> Address Details</h4>
            <div className="address-view-details">
              {Object.entries(addresses[modal.idx]).map(([k, v]) => (
                <div key={k}><b>{k.charAt(0).toUpperCase() + k.slice(1)}:</b> {v}</div>
              ))}
            </div>
          </div>
        </div>
      )}
      {/* Edit Modal */}
      {modal.type === 'edit' && editAddress && (
        <div className="address-modal-overlay" onClick={closeModal}>
          <div className="payment-modal address-edit-wide" onClick={e => e.stopPropagation()}>
            <i className="fa fa-times close-modal-x" onClick={closeModal}></i>
            <h4 className='add-edi' ><i className="fa fa-edit"></i> Edit Address</h4>
            <form className="address-modal-form" onSubmit={handleEditSave}>
              <div className="address-row">
                <div className="address-field">
                  <label htmlFor="edit-name">Full Name</label>
                  <input id="edit-name" className="address-input" type="text" value={editAddress.name} onChange={e => setEditAddress({ ...editAddress, name: e.target.value })} required />
                </div>
                <div className="address-field">
                  <label htmlFor="edit-phone">Phone Number</label>
                  <input id="edit-phone" className="address-input" type="tel" value={editAddress.phone} onChange={e => setEditAddress({ ...editAddress, phone: e.target.value })} required />
                </div>
              </div>
              <div className="address-row">
                <div className="address-field">
                  <label htmlFor="edit-address">Address</label>
                  <input id="edit-address" className="address-input" type="text" value={editAddress.address} onChange={e => setEditAddress({ ...editAddress, address: e.target.value })} required />
                </div>
                <div className="address-field">
                  <label htmlFor="edit-landmark">Landmark</label>
                  <input id="edit-landmark" className="address-input" type="text" value={editAddress.landmark} onChange={e => setEditAddress({ ...editAddress, landmark: e.target.value })} />
                </div>
              </div>
              <div className="address-row">
                <div className="address-field">
                  <label htmlFor="edit-city">City</label>
                  <input id="edit-city" className="address-input" type="text" value={editAddress.city} onChange={e => setEditAddress({ ...editAddress, city: e.target.value })} required />
                </div>
                <div className="address-field">
                  <label htmlFor="edit-state">State</label>
                  <input id="edit-state" className="address-input" type="text" value={editAddress.state} onChange={e => setEditAddress({ ...editAddress, state: e.target.value })} required />
                </div>
              </div>
              <div className="address-row">
                <div className="address-field">
                  <label htmlFor="edit-pincode">Pincode</label>
                  <input id="edit-pincode" className="address-input" type="text" value={editAddress.pincode} onChange={e => setEditAddress({ ...editAddress, pincode: e.target.value })} required />
                </div>
                <div className="address-field">
                  <label htmlFor="edit-type">Address Type</label>
                  <select id="edit-type" className="address-input" value={editAddress.type} onChange={e => setEditAddress({ ...editAddress, type: e.target.value })}>
                    <option value="Home">Home</option>
                    <option value="Office">Office</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
              <div className="address-modal-actions">
                <button type="submit" className="address-save-btn"><i className="fa fa-save"></i> Save</button>
                {/* <button type="button" className="address-reset-btn" onClick={closeModal}><i className="fa fa-times"></i> Cancel</button> */}
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Delete Modal */}
      {modal.type === 'delete' && (
        <div className="address-modal-overlay" onClick={closeModal}>
          <div className="payment-modal address-delete-wide" onClick={e => e.stopPropagation()}>
            {/* <i className="fa fa-times close-modal-x" onClick={closeModal}></i> */}
            <h4 className='add-edi' ><i className="fa fa-trash"></i> Delete Address</h4>
            <div style={{marginBottom: 18}}>Are you sure you want to delete this address?</div>
            <div className="address-modal-actions">
              <button className="address-save-btn"  onClick={handleDeleteConfirm}><i className="fa fa-trash"></i>Yes</button>
              <button className="address-reset-btn" onClick={closeModal}><i className="fa fa-times"></i> No</button>
            </div>
          </div>
        </div>
      )}
      {/* Add Address Modal */}
      {addressModal && (
        <div className="payment-modal-overlay" onClick={() => setAddressModal(false)}>
          <div className="payment-modal address-modal-wide" onClick={e => e.stopPropagation()}>
            <i className="fa fa-times close-modal-x" onClick={() => setAddressModal(false)}></i>
            <h4><i className="fa fa-plus"></i> Add Delivery Address</h4>
            <form className="address-modal-form" onSubmit={handleAddAddress}>
              <div className="address-row">
                <div className="address-field">
                  <label htmlFor="address-name">Full Name</label>
                  <input id="address-name" className="address-input" type="text" placeholder="Full Name" value={newAddress.name} onChange={e => setNewAddress({ ...newAddress, name: e.target.value })} required />
                </div>
                <div className="address-field">
                  <label htmlFor="address-phone">Phone Number</label>
                  <input id="address-phone" className="address-input" type="tel" placeholder="Phone Number" value={newAddress.phone} onChange={e => setNewAddress({ ...newAddress, phone: e.target.value })} required />
                </div>
              </div>
              <div className="address-row">
                <div className="address-field">
                  <label htmlFor="address-address">Address</label>
                  <input id="address-address" className="address-input" type="text" placeholder="Flat, House no., Building, Company, Apartment" value={newAddress.address} onChange={e => setNewAddress({ ...newAddress, address: e.target.value })} required />
                </div>
                <div className="address-field">
                  <label htmlFor="address-landmark">Landmark</label>
                  <input id="address-landmark" className="address-input" type="text" placeholder="Landmark (optional)" value={newAddress.landmark} onChange={e => setNewAddress({ ...newAddress, landmark: e.target.value })} />
                </div>
              </div>
              <div className="address-row">
                <div className="address-field">
                  <label htmlFor="address-city">City</label>
                  <input id="address-city" className="address-input" type="text" placeholder="City" value={newAddress.city} onChange={e => setNewAddress({ ...newAddress, city: e.target.value })} required />
                </div>
                <div className="address-field">
                  <label htmlFor="address-state">State</label>
                  <input id="address-state" className="address-input" type="text" placeholder="State" value={newAddress.state} onChange={e => setNewAddress({ ...newAddress, state: e.target.value })} required />
                </div>
              </div>
              <div className="address-row">
                <div className="address-field">
                  <label htmlFor="address-pincode">Pincode</label>
                  <input id="address-pincode" className="address-input" type="text" placeholder="Pincode" value={newAddress.pincode} onChange={e => setNewAddress({ ...newAddress, pincode: e.target.value })} required />
                </div>
                <div className="address-field">
                  <label htmlFor="address-type">Address Type</label>
                  <select id="address-type" className="address-input" value={newAddress.type} onChange={e => setNewAddress({ ...newAddress, type: e.target.value })}>
                    <option value="Home">Home</option>
                    <option value="Office">Office</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
              <div className="address-modal-actions">
                <button type="button" className="address-locate-btn" onClick={handleLocate} disabled={locating}>
                  <i className="fa fa-location-arrow"></i> {locating ? 'Locating...' : 'Use My Location'}
                </button>
                <button type="button" className="address-reset-btn" onClick={handleReset}><i className="fa fa-undo"></i> Reset</button>
                <button type="submit" className="address-save-btn"><i className="fa fa-save"></i> Save</button>
              </div>
            </form>
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

export default Address;