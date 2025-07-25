import React, { useState, useRef } from 'react';
import '../Dashboard/Dashboard.css';
import './Coupons.css';
import { Link, useNavigate } from 'react-router-dom';

const navLinks = [
  { to: '/Home', image: require('../Images/Fahome.png'), label: 'Home', className:'nav-link ' },
  { to: '/products', image: require('../Images/Fabox.png'), label: 'Products', className:'nav-link' },
  { to: '/Orders', image: require('../Images/order.png'), label: 'Your Orders', className:'nav-link    ' },
  { to: '/Profile', image: require('../Images/Fauser.png'), label: 'Profile' , className:'nav-link ' },
  { to: '/Wallet', image: require('../Images/wallet.png'), label: 'Wallet' , className:'nav-link ' },
  { to: '/Yourcoupons', image: require('../Images/co.png'), label: 'Your Coupons' , className:'nav-link link-active ' },
  { to: '/Yourrating', image: require('../Images/rate.png'), label: 'Your Rating', className:'nav-link ' },
  { to: '/Payment', image: require('../Images/payment.png'), label: 'Payment' , className:'nav-link' },
  { to: '/settings', image: require('../Images/settings-24.png'), label: 'Settings' , className:'nav-link' },
  { to: '/address', image: require('../Images/location.png'), label: 'Address', className:'nav-link ' },
  { to: '/help', image: require('../Images/help-c.png'), label: 'Help Center', className:'nav-link' },
];

const membershipTypes = [
  { key: 'premium', label: 'Premium', icon: 'fa-crown' },
];

// Coupon data (static for now)
const normalCoupons = [
  {
    code: 'FRUIT50',
    title: 'Flat ₹50 OFF on Fruits',
    description: 'Get flat ₹50 off on all fresh fruits. Valid on orders above ₹299.',
    minOrder: 299,
    discount: '₹50 OFF',
    expiry: '2024-07-31',
    items: [
      { name: 'Apple', image: 'https://images.unsplash.com/photo-1567306226416-28f0efdc88ce' },
      { name: 'Banana', image: 'https://www.jiomart.com/images/product/original/590000454/banana-robusta-1-kg-product-images-o590000454-p590000454-0-202410011654.jpg?im=Resize=(420,420)' },
      { name: 'Grapes', image: 'https://www.shysha.in/wp-content/uploads/2022/12/Grape-Seed-less-White-600x419.jpg' },
    ],
    terms: 'Applicable only on fresh fruits. Cannot be clubbed with other offers.',
  },
  {
    code: 'DAIRY20',
    title: '20% OFF on Dairy & Bakery',
    description: 'Enjoy 20% off on all dairy and bakery products. Max discount ₹100.',
    minOrder: 199,
    discount: '20% OFF (up to ₹100)',
    expiry: '2024-07-20',
    items: [
      { name: 'Milk', image: 'https://image1.jdomni.in/product/09082021/B6/40/95/69E61DFEBC8F07440F282561BF_1628449240817.jpg?fit=around|500:500' },
      { name: 'Bread', image: 'https://www.bbassets.com/media/uploads/p/l/40232044_8-tasties-milk-bread.jpg' },
      { name: 'Rasgulla', image: 'https://www.haldirams.com/media/catalog/product/cache/71134970afb779eb7860339989626b7e/r/a/rasgulla_6.jpg' },
    ],
    terms: 'Valid on select dairy & bakery items only. One use per user.',
  },
  {
    code: 'WELCOME100',
    title: 'Welcome Offer: ₹100 OFF',
    description: 'New users get ₹100 off on their first order above ₹499.',
    minOrder: 499,
    discount: '₹100 OFF',
    expiry: '2024-08-15',
    items: [],
    terms: 'Valid for new users only. Minimum order value required.',
  },
  {
    code: 'ICECREAM30',
    title: '30% OFF on Ice Creams',
    description: 'Beat the heat! 30% off on all ice creams. Max discount ₹75.',
    minOrder: 150,
    discount: '30% OFF (up to ₹75)',
    expiry: '2024-07-25',
    items: [
      { name: 'Chocolate Ice Cream', image: 'https://i.pinimg.com/736x/99/ff/4a/99ff4a9612558f8f21e7990848ef00d0.jpg' },
      { name: 'Strawberry Ice Cream', image: 'https://im.pluckk.in/unsafe/1920x0/uploads/30300-2.png' },
    ],
    terms: 'Applicable only on ice cream category. Limited period offer.',
  },
  {
    code: 'FRESH10',
    title: '10% OFF on All Orders',
    description: 'Get 10% off on your entire order. No minimum order value.',
    minOrder: 0,
    discount: '10% OFF',
    expiry: '2024-07-31',
    items: [],
    terms: 'No minimum order. Maximum discount ₹50. Valid for all users.',
  },
  {
    code: 'MEAT75',
    title: 'Flat ₹75 OFF on Meat',
    description: 'Flat ₹75 off on all meat products. Valid on orders above ₹399.',
    minOrder: 399,
    discount: '₹75 OFF',
    expiry: '2024-07-28',
    items: [
      { name: 'Chicken', image: 'https://www.shutterstock.com/image-photo/balanced-diet-cooking-culinary-food-260nw-300553067.jpg' },
      { name: 'Eggs', image: 'https://www.shutterstock.com/image-photo/balanced-diet-cooking-culinary-food-260nw-300553067.jpg' },
    ],
    terms: 'Applicable only on meat and egg products. Cannot be clubbed with other offers.',
  },
];

const bankCoupons = [
  {
    code: 'HDFCBANK10',
    title: '10% OFF with HDFC Bank Cards',
    description: 'Get 10% instant discount using HDFC Bank Credit/Debit cards. Max discount ₹150.',
    minOrder: 499,
    discount: '10% OFF (up to ₹150)',
    expiry: '2024-07-31',
    bank: 'HDFC Bank',
    terms: 'Valid only on HDFC Bank cards. One use per user. T&Cs apply.',
  },
  {
    code: 'ICICIBANK15',
    title: '15% OFF with ICICI Bank Cards',
    description: 'Enjoy 15% off on orders above ₹799 using ICICI Bank Credit Cards.',
    minOrder: 799,
    discount: '15% OFF',
    expiry: '2024-07-25',
    bank: 'ICICI Bank',
    terms: 'Valid only on ICICI Bank credit cards. Cannot be clubbed with other offers.',
  },
  {
    code: 'PAYTM20',
    title: '20% Cashback with Paytm Wallet',
    description: 'Get 20% cashback up to ₹100 on payment via Paytm wallet.',
    minOrder: 299,
    discount: '20% Cashback (up to ₹100)',
    expiry: '2024-07-30',
    bank: 'Paytm',
    terms: 'Valid only on Paytm wallet payments. Cashback credited within 24 hours.',
  },
  {
    code: 'AXIS12',
    title: '12% OFF with Axis Bank Cards',
    description: 'Flat 12% off on orders above ₹599 using Axis Bank Debit Cards.',
    minOrder: 599,
    discount: '12% OFF',
    expiry: '2024-07-28',
    bank: 'Axis Bank',
    terms: 'Valid only on Axis Bank debit cards. One use per user.',
  },
];

function Coupons() {
  // Get cart items count from localStorage
  const [cartCount, setCartCount] = React.useState(0);
  React.useEffect(() => {
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
  const [membershipIndex, setMembershipIndex] = useState(0);
  const currentMembership = membershipTypes[membershipIndex];
  const navigate = useNavigate();
  const [copiedCode, setCopiedCode] = useState(null);
  // Add state for modal
  const [modalCoupon, setModalCoupon] = useState(null);
  const [modalType, setModalType] = useState(null); // 'normal' or 'bank'

  const handleSwitchMembership = () => {
    setMembershipIndex((prev) => (prev + 1) % membershipTypes.length);
  };

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

  React.useEffect(() => {
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

  // Helper to get icon class for coupon type
  function getCouponIcon(coupon) {
    if (coupon.title.toLowerCase().includes('fruit')) return 'fa-apple-alt';
    if (coupon.title.toLowerCase().includes('dairy')) return 'fa-cheese';
    if (coupon.title.toLowerCase().includes('bakery')) return 'fa-bread-slice';
    if (coupon.title.toLowerCase().includes('ice cream')) return 'fa-ice-cream';
    if (coupon.title.toLowerCase().includes('meat') || coupon.title.toLowerCase().includes('egg')) return 'fa-drumstick-bite';
    if (coupon.title.toLowerCase().includes('welcome')) return 'fa-gift';
    if (coupon.title.toLowerCase().includes('order')) return 'fa-shopping-basket';
    return 'fa-tag';
  }
  function getBankIcon(bank) {
    if (!bank) return 'fa-university';
    if (bank.toLowerCase().includes('hdfc')) return 'fa-university';
    if (bank.toLowerCase().includes('icici')) return 'fa-university';
    if (bank.toLowerCase().includes('axis')) return 'fa-university';
    if (bank.toLowerCase().includes('paytm')) return 'fa-wallet';
    return 'fa-university';
  }

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
        <div className="coupons-page twocolumns">
          <div className="coupons-twocolumns-wrapper">
            <div className="coupons-column normal-coupons-col">
              <h2 className="coupons-col-title">Your Coupons</h2>
              <div className="coupons-list-nocards grid-2col">
                {normalCoupons.map((coupon, idx) => {
                  return (
                    <div className={`coupon-row new-coupon-card`} key={coupon.code}>
                      <div className="coupon-card-horizontal compact">
                        <div className="coupon-card-image compact">
                          <i className={`fa ${getCouponIcon(coupon)} coupon-type-icon`}></i>
                        </div>
                        <div className="coupon-card-details compact">
                          <div className="coupon-card-header compact">
                            <span className="coupon-discount-badge">{coupon.discount}</span>
                            <span className="coupon-title">{coupon.title}</span>
                          </div>
                          <div className="coupon-card-meta compact">
                            <span className="coupon-code-label">Code:</span>
                            <span className="coupon-code">{coupon.code}</span>
                            <button className="copy-code-btn" onClick={() => {
                              navigator.clipboard.writeText(coupon.code);
                              setCopiedCode(coupon.code);
                              setTimeout(() => setCopiedCode(null), 1200);
                            }}>
                              {copiedCode === coupon.code ? 'Copied!' : 'Copy'}
                            </button>
                          </div>
                          <div className="coupon-card-actions-row compact">
                            <span className="coupon-expiry">Valid till: {coupon.expiry}</span>
                            <button className="coupon-view-btn" onClick={() => { setModalCoupon(coupon); setModalType('normal'); }}>
                              View
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="coupons-column bank-coupons-col">
              <h2 className="coupons-col-title">Bank/Wallet Coupons</h2>
              <div className="coupons-list-nocards grid-2col">
                {bankCoupons.map((coupon, idx) => {
                  return (
                    <div className={`coupon-row bank new-coupon-card`} key={coupon.code}>
                      <div className="coupon-card-horizontal compact">
                        <div className="coupon-card-image bank compact">
                          <i className={`fa ${getBankIcon(coupon.bank)} coupon-type-icon bank`}></i>
                        </div>
                        <div className="coupon-card-details compact">
                          <div className="coupon-card-header compact">
                            <span className="coupon-discount-badge bank">{coupon.discount}</span>
                            <span className="coupon-title">{coupon.title}</span>
                          </div>
                          <div className="coupon-card-meta compact bank-meta-row">
                            <span className="coupon-bank-badge">{coupon.bank}</span>
                            <span className="coupon-code-label">Code:</span>
                            <span className="coupon-code">{coupon.code}</span>
                            <button className="copy-code-btn" onClick={() => {
                              navigator.clipboard.writeText(coupon.code);
                              setCopiedCode(coupon.code);
                              setTimeout(() => setCopiedCode(null), 1200);
                            }}>
                              {copiedCode === coupon.code ? 'Copied!' : 'Copy'}
                            </button>
                          </div>
                          <div className="coupon-card-actions-row compact">
                            <span className="coupon-expiry">Valid till: {coupon.expiry}</span>
                            <button className="coupon-view-btn" onClick={() => { setModalCoupon(coupon); setModalType('bank'); }}>
                              View
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </main>
      {modalCoupon && (
        <div className="coupon-modal-overlay" onClick={() => setModalCoupon(null)}>
          <div className="coupon-modal" onClick={e => e.stopPropagation()}>
            <button className="coupon-modal-close" onClick={() => setModalCoupon(null)}>&times;</button>
            <div className="coupon-modal-header">
              <div className="coupon-modal-icon">
                <i className={`fa ${modalType === 'bank' ? getBankIcon(modalCoupon.bank) : getCouponIcon(modalCoupon)} coupon-type-icon${modalType === 'bank' ? ' bank' : ''}`}></i>
              </div>
              <div className="coupon-modal-title">{modalCoupon.title}</div>
              <div className={`coupon-discount-badge${modalType === 'bank' ? ' bank' : ''}`}>{modalCoupon.discount}</div>
            </div>
            <div className="coupon-modal-meta">
              {modalType === 'bank' && (
                <span className="coupon-bank-badge">{modalCoupon.bank}</span>
              )}
              <span className="coupon-code-label">Code:</span>
              <span className="coupon-code">{modalCoupon.code}</span>
              <button className="copy-code-btn" onClick={() => {
                navigator.clipboard.writeText(modalCoupon.code);
                setCopiedCode(modalCoupon.code);
                setTimeout(() => setCopiedCode(null), 1200);
              }}>
                {copiedCode === modalCoupon.code ? 'Copied!' : 'Copy'}
              </button>
              <span className="coupon-expiry">Valid till: {modalCoupon.expiry}</span>
            </div>
            <div className="coupon-modal-description">{modalCoupon.description}</div>
            {modalCoupon.items && modalCoupon.items.length > 0 && (
              <div className="coupon-items-section">
                <div className="coupon-items-label">Applicable on:</div>
                <div className="coupon-items-list">
                  {modalCoupon.items.map(item => (
                    <div className="coupon-item" key={item.name}>
                      <img src={item.image} alt={item.name} className="coupon-item-img" />
                      <div className="coupon-item-name">{item.name}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div className="coupon-meta-row">
              <span className="coupon-minorder">Min Order: ₹{modalCoupon.minOrder}</span>
            </div>
            {/* Terms & Conditions section */}
            <div className="coupon-modal-terms">
              <div className="coupon-modal-terms-title">Terms & Conditions</div>
              <div className="coupon-modal-terms-text">{modalCoupon.terms}</div>
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

export default Coupons;
