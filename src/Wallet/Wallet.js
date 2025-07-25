import React, { useState, useEffect, useRef } from 'react';
import '../Dashboard/Dashboard.css';
import './Wallet.css';
import { Link, useNavigate } from 'react-router-dom';

const navLinks = [
  { to: '/Home', image: require('../Images/Fahome.png'), label: 'Home', className:'nav-link ' },
  { to: '/products', image: require('../Images/Fabox.png'), label: 'Products', className:'nav-link' },
  { to: '/Orders', image: require('../Images/order.png'), label: 'Your Orders', className:'nav-link' },
  { to: '/Profile', image: require('../Images/Fauser.png'), label: 'Profile' , className:'nav-link ' },
  { to: '/Wallet', image: require('../Images/wallet.png'), label: 'Wallet' , className:'nav-link  link-active ' },
  { to: '/Yourcoupons', image: require('../Images/co.png'), label: 'Your Coupons' , className:'nav-link' },
  { to: '/Yourrating', image: require('../Images/rate.png'), label: 'Your Rating', className:'nav-link ' },
  { to: '/Payment', image: require('../Images/payment.png'), label: 'Payment' , className:'nav-link' },
  { to: '/settings', image: require('../Images/settings-24.png'), label: 'Settings' , className:'nav-link' },
  { to: '/address', image: require('../Images/location.png'), label: 'Address', className:'nav-link ' },
  { to: '/help', image: require('../Images/help-c.png'), label: 'Help Center', className:'nav-link' },
];


// Mock data
const walletBalance = 1250.50;
const cashback = 150.00;
const premiumSavings = 820.00;
const allCoupons = [
  { code: 'SAVE10', desc: 'Save ₹10 on orders above ₹100', icon: 'fa-tag', color: '#2563eb' },
  { code: 'FRESH20', desc: '20% off on Fruits & Vegetables', icon: 'fa-apple-alt', color: '#22c55e' },
  { code: 'FREESHIP', desc: 'Free Delivery', icon: 'fa-truck', color: '#6366f1' },
  { code: 'WELCOME25', desc: 'Flat ₹25 off for new users', icon: 'fa-gift', color: '#fbbf24' },
];
const cardOffers = [
  { bank: 'HDFC Bank', offer: '10% instant discount on HDFC Credit Cards', code: 'HDFC10', min: 500, icon: 'fa-building-columns', logo: require('../Images/wallet.png'), color: '#1a237e' },
  { bank: 'ICICI Bank', offer: '5% cashback on ICICI Debit Cards', code: 'ICICI5', min: 300, icon: 'fa-building-columns', logo: require('../Images/wallet.png'), color: '#ff6f00' },
  { bank: 'SBI Bank', offer: '₹100 off on SBI Cards above ₹1000', code: 'SBI100', min: 1000, icon: 'fa-building-columns', logo: require('../Images/wallet.png'), color: '#1976d2' },
];
const savedCards = [
  { type: 'Credit Card', bank: 'HDFC Bank', number: '**** **** **** 1234', name: 'Keerthi S', expiry: '12/27', icon: 'fa-cc-visa', color: '#1a237e', logo: require('../Images/wallet.png') },
  { type: 'Debit Card', bank: 'ICICI Bank', number: '**** **** **** 5678', name: 'Keerthi S', expiry: '09/26', icon: 'fa-cc-mastercard', color: '#ff6f00', logo: require('../Images/wallet.png') },
];
const recentTransactions = [
  { id: 'TXN1001', type: 'Add Money', amount: 500, date: '2024-06-10', status: 'Success', method: 'UPI', icon: 'fa-plus-circle', color: '#22c55e' },
  { id: 'TXN1002', type: 'Order Payment', amount: -299, date: '2024-06-09', status: 'Success', method: 'Card', icon: 'fa-shopping-cart', color: '#2563eb' },
  { id: 'TXN1003', type: 'Cashback', amount: 25, date: '2024-06-08', status: 'Success', method: 'Cashback', icon: 'fa-gift', color: '#fbbf24' },
  { id: 'TXN1004', type: 'Order Refund', amount: 120, date: '2024-06-07', status: 'Success', method: 'Refund', icon: 'fa-undo', color: '#6366f1' },
  { id: 'TXN1005', type: 'Order Payment', amount: -199, date: '2024-06-06', status: 'Success', method: 'UPI', icon: 'fa-shopping-cart', color: '#2563eb' },
];
const premiumBenefits = [
  { icon: 'fa-percent', color: '#22c55e', title: 'Extra Discounts', desc: 'Get exclusive extra discounts on all products.' },
  { icon: 'fa-rocket', color: '#6366f1', title: 'Faster Delivery', desc: 'Enjoy priority delivery on every order.' },
  { icon: 'fa-gift', color: '#fbbf24', title: 'Special Offers', desc: 'Access to premium-only offers and deals.' },
  { icon: 'fa-headset', color: '#2563eb', title: 'Priority Support', desc: '24/7 premium customer support.' },
  { icon: 'fa-star', color: '#ff6f00', title: 'Birthday Surprises', desc: 'Get special gifts and offers on your birthday.' },
  { icon: 'fa-wallet', color: '#1976d2', title: 'Wallet Boost', desc: 'Earn extra cashback on wallet top-ups.' },
  { icon: 'fa-shield-alt', color: '#1a237e', title: 'Purchase Protection', desc: 'All purchases are protected with premium.' },
  { icon: 'fa-users', color: '#6366f1', title: 'Referral Rewards', desc: 'Refer friends and earn wallet rewards.' },
  { icon: 'fa-coins', color: '#fbbf24', title: 'Loyalty Points', desc: 'Earn points on every purchase and redeem for rewards.' },
  { icon: 'fa-credit-card', color: '#22c55e', title: 'Multiple Payment Methods', desc: 'Save and use multiple cards and UPI IDs.' },
];
const walletInfo = {
  id: 'WALLET-9876543210',
  holder: 'Keerthi S',
  mobile: '+91-9876543210',
  email: 'keerthi@email.com',
  status: 'Active',
  created: '2023-01-15',
  lastUsed: '2024-06-10',
  kyc: 'Verified',
  icon: 'fa-user-circle',
};

function Wallet() {


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
  const navigate = useNavigate();

  // Membership state (copied from Dashboard)
  const membershipTypes = [
    { key: 'premium', label: 'Premium', icon: 'fa-crown' },
  ];
  const [membershipIndex, setMembershipIndex] = useState(0);
  const currentMembership = membershipTypes[membershipIndex];
  const handleSwitchMembership = () => {
    setMembershipIndex((prev) => (prev + 1) % membershipTypes.length);
  };

  // Notification dropdown handler
  const handleNotificationClick = () => {
    setShowNotificationDropdown((prev) => !prev);
  };

  // Voice search handler
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

  // Show header search only when user scrolls down (not at the top/hero)
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

  // Add/Withdraw money handlers (mock)
  const [addAmount, setAddAmount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [addMsg, setAddMsg] = useState('');
  const [withdrawMsg, setWithdrawMsg] = useState('');
  const handleAddMoney = () => {
    if (!addAmount || isNaN(addAmount) || Number(addAmount) <= 0) {
      setAddMsg('Enter a valid amount');
      return;
    }
    setAddMsg(`₹${addAmount} added to your wallet!`);
    setTimeout(() => setAddMsg(''), 2000);
    setAddAmount('');
  };
  const handleWithdrawMoney = () => {
    if (!withdrawAmount || isNaN(withdrawAmount) || Number(withdrawAmount) <= 0) {
      setWithdrawMsg('Enter a valid amount');
      return;
    }
    setWithdrawMsg(`₹${withdrawAmount} withdrawn from your wallet!`);
    setTimeout(() => setWithdrawMsg(''), 2000);
    setWithdrawAmount('');
  };

  const [showReferralModal, setShowReferralModal] = useState(false);
  const [copyMsg, setCopyMsg] = useState('');
  const referralCode = 'FRUITS123';
  const successfulInvites = 4;

  const handleCopyReferral = () => {
    navigator.clipboard.writeText(referralCode);
    setCopyMsg('Copied!');
    setTimeout(() => setCopyMsg(''), 1500);
  };

  const premiumRowRef = useRef(null);
  const [premiumIndex, setPremiumIndex] = useState(0);
  const premiumCardCount = premiumBenefits.length;

  // Auto-slide effect for premium benefits
  useEffect(() => {
    const interval = setInterval(() => {
      setPremiumIndex(prev => (prev + 1) % premiumCardCount);
    }, 3000);
    return () => clearInterval(interval);
  }, [premiumCardCount]);

  // Scroll to active card
  useEffect(() => {
    if (premiumRowRef.current) {
      const row = premiumRowRef.current;
      const card = row.children[premiumIndex];
      if (card) {
        row.scrollTo({
          left: card.offsetLeft - row.offsetLeft,
          behavior: 'smooth'
        });
      }
    }
  }, [premiumIndex]);

  const [copiedCoupon, setCopiedCoupon] = useState('');
  const [copiedCardOffer, setCopiedCardOffer] = useState('');

  const handleCopyCoupon = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCoupon(code);
    setTimeout(() => setCopiedCoupon(''), 1200);
  };
  const handleCopyCardOffer = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCardOffer(code);
    setTimeout(() => setCopiedCardOffer(''), 1200);
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
      <main className="main-content ">
        <div className="wallet-header-row">
          <h1 className="wallet-title"><i className="fa fa-wallet"></i> My Wallet</h1>
          {/* <div className="wallet-actions">
            <div className="wallet-action-card">
              <input type="number" min="1" placeholder="Add Money" value={addAmount} onChange={e => setAddAmount(e.target.value)} />
              <button className="wallet-action-btn add" onClick={handleAddMoney}><i className="fa fa-plus"></i> Add</button>
              {addMsg && <div className="wallet-action-msg success">{addMsg}</div>}
            </div>
            <div className="wallet-action-card">
              <input type="number" min="1" placeholder="Withdraw" value={withdrawAmount} onChange={e => setWithdrawAmount(e.target.value)} />
              <button className="wallet-action-btn withdraw" onClick={handleWithdrawMoney}><i className="fa fa-minus"></i> Withdraw</button>
              {withdrawMsg && <div className="wallet-action-msg error">{withdrawMsg}</div>}
            </div>
          </div> */}
        </div>
        <div className="wallet-balance-section wallet-balance-new">
          <div className="wallet-balance-card">
            <div className="wallet-balance-label"><i className="fa fa-wallet"></i> Wallet Balance</div>
            <div className="wallet-balance-value">₹{walletBalance.toFixed(2)}</div>
          </div>
          <div className="wallet-cashback-card">
            <div className="wallet-cashback-label"><i className="fa fa-rupee-sign"></i> Cashbacks</div>
            <div className="wallet-cashback-value">₹{cashback.toFixed(2)}</div>
          </div>
          <div className="wallet-premium-card">
            <div className="wallet-premium-label"><i className="fa fa-crown"></i> Saved with Fruits Premium</div>
            <div className="wallet-premium-value">₹{premiumSavings.toFixed(2)}</div>
          </div>
        </div>
        <div className="wallet-info-section wallet-info-fullwidth">
          <div className="wallet-insights-rewards-card">
            <div className="wallet-insights-title"><i className="fa fa-chart-line"></i> Wallet Insights & Rewards</div>
            <div className="wallet-insights-stats-row">
              <div className="wallet-insight-stat-card">
                <i className="fa fa-shopping-cart" style={{color:'#2563eb'}}></i>
                <div className="wallet-insight-stat-label">Orders Paid</div>
                <div className="wallet-insight-stat-value">32</div>
              </div>
              <div className="wallet-insight-stat-card">
                <i className="fa fa-undo" style={{color:'#6366f1'}}></i>
                <div className="wallet-insight-stat-label">Refunds</div>
                <div className="wallet-insight-stat-value">3</div>
              </div>
              <div className="wallet-insight-stat-card">
                <i className="fa fa-rupee-sign" style={{color:'#22c55e'}}></i>
                <div className="wallet-insight-stat-label">Avg. Spend</div>
                <div className="wallet-insight-stat-value">₹410</div>
              </div>
              <div className="wallet-insight-stat-card">
                <i className="fa fa-apple-alt" style={{color:'#fbbf24'}}></i>
                <div className="wallet-insight-stat-label">Top Category</div>
                <div className="wallet-insight-stat-value">Fruits</div>
              </div>
              <div className="wallet-insight-stat-card">
                <i className="fa fa-credit-card" style={{color:'#1a237e'}}></i>
                <div className="wallet-insight-stat-label">Most Used Payment</div>
                <div className="wallet-insight-stat-value">HDFC Card</div>
              </div>
            </div>
            <div className="wallet-rewards-row">
              <div className="wallet-rewards-card">
                <div className="wallet-rewards-title"><i className="fa fa-coins" style={{color:'#fbbf24'}}></i> Loyalty Points</div>
                <div className="wallet-rewards-points">1,250</div>
                <div className="wallet-rewards-progress-bar">
                  <div className="wallet-rewards-progress" style={{width:'62%'}}></div>
                </div>
                <div className="wallet-rewards-next">Next reward at 2,000 points!</div>
                <div className="wallet-rewards-badges">
                  <span className="wallet-badge"><i className="fa fa-medal" style={{color:'#FFD700'}}></i> Gold</span>
                  <span className="wallet-badge"><i className="fa fa-star" style={{color:'#22c55e'}}></i> Super Saver</span>
                </div>
              </div>
              <div className="wallet-referral-card">
                <div className="wallet-referral-title"><i className="fa fa-users" style={{color:'#6366f1'}}></i> Referral Program</div>
                <div className="wallet-referral-status">You’ve referred <b>{successfulInvites}</b> friends! Earn more rewards by inviting friends.</div>
                <button className="wallet-referral-btn" onClick={() => setShowReferralModal(true)}><i className="fa fa-share-alt"></i> Invite Friends</button>
              </div>
            </div>
          </div>
          <div className="wallet-premium-benefits-card">
            <div className="wallet-info-title"><i className="fa fa-crown"></i> Premium Benefits</div>
            <div className="wallet-premium-benefits-row" ref={premiumRowRef}>
              {premiumBenefits.map((b, idx) => (
                <div key={b.title} className="wallet-premium-benefit-card">
                  <div className="wallet-premium-benefit-icon-large" style={{color: b.color}}><i className={`fa ${b.icon}`}></i></div>
                  <div className="wallet-premium-benefit-title">{b.title}</div>
                  <div className="wallet-premium-benefit-desc">{b.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="wallet-offers-section">
          <h2 className="wallet-section-title"><i className="fa fa-gift"></i> Available Offers</h2>
          <div className="wallet-coupons-list wallet-coupons-list-grid">
            {allCoupons.map(c => (
              <div key={c.code} className="wallet-coupon-card wallet-coupon-card-large">
                <div className="wallet-coupon-icon" style={{background: c.color}}><i className={`fa ${c.icon}`}></i></div>
                <div className="wallet-coupon-code-row">
                  <span className="wallet-coupon-code">{c.code}</span>
                  <button className="wallet-coupon-copy-btn" onClick={() => handleCopyCoupon(c.code)}><i className="fa fa-copy"></i></button>
                  {copiedCoupon === c.code && <span className="wallet-coupon-copy-msg">Copied!</span>}
                </div>
                <div className="wallet-coupon-desc">{c.desc}</div>
              </div>
            ))}
          </div>
          <h3 className="wallet-section-subtitle"><i className="fa fa-credit-card"></i> Card Offers</h3>
          <div className="wallet-card-offers-list wallet-card-offers-list-grid">
            {cardOffers.map((offer, idx) => (
              <div key={offer.code} className="wallet-card-offer-card wallet-card-offer-card-large">
                <div className="wallet-card-offer-bank-row">
                  <div className="wallet-card-offer-bank-logo" >
                    <img src={offer.logo} alt={offer.bank} />
                  </div>
                  <div className="wallet-card-offer-bank-name">{offer.bank}</div>
                </div>
                <div className="wallet-card-offer-desc">{offer.offer}</div>
                <div className="wallet-card-offer-code-row">
                  <span className="wallet-card-offer-code">Use Code: <b>{offer.code}</b> (Min. ₹{offer.min})</span>
                  <button className="wallet-card-offer-copy-btn" onClick={() => handleCopyCardOffer(offer.code)}><i className="fa fa-copy"></i></button>
                  {copiedCardOffer === offer.code && <span className="wallet-card-offer-copy-msg">Copied!</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="wallet-saved-cards-section">
          <h2 className="wallet-section-title"><i className="fa fa-id-card"></i> Saved Cards</h2>
          <div className="wallet-saved-cards-list wallet-saved-cards-list-glass">
            {savedCards.map((card, idx) => (
              <div key={card.number} className="wallet-saved-card-card wallet-saved-card-card-glass">
                <div className="wallet-saved-card-logo-float" >
                  <img src={card.logo} alt={card.bank} />
                </div>
                <div className="wallet-saved-card-content">
                  <div className="wallet-saved-card-type-row">
                    <span className="wallet-saved-card-type"> {card.type}</span>
                    {idx === 0 && <span className="wallet-saved-card-badge-primary">Primary</span>}
                  </div>
                  <div className="wallet-saved-card-number">{card.number}</div>
                  <div className="wallet-saved-card-bank">{card.bank}</div>
                  <div className="wallet-saved-card-name">{card.name}</div>
                  <div className="wallet-saved-card-expiry">Expiry: {card.expiry}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="wallet-transactions-section">
          <h2 className="wallet-section-title"><i className="fa fa-history"></i> Recent Transactions</h2>
          <div className="wallet-transactions-list">
            {recentTransactions.map(txn => (
              <div key={txn.id} className="wallet-transaction-card">
                <div className="wallet-transaction-icon" style={{background: txn.color}}><i className={`fa ${txn.icon}`}></i></div>
                <div className="wallet-transaction-info">
                  <div className="wallet-transaction-type">{txn.type}</div>
                  <div className="wallet-transaction-date">{txn.date} | {txn.method}</div>
                </div>
                <div className={`wallet-transaction-amount${txn.amount > 0 ? ' plus' : ' minus'}`}>{txn.amount > 0 ? '+' : ''}₹{Math.abs(txn.amount)}</div>
                <div className={`wallet-transaction-status ${txn.status.toLowerCase()}`}>{txn.status}</div>
              </div>
            ))}
          </div>
        </div>
      </main>
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
      {showReferralModal && (
        <div className="referral-modal-overlay" onClick={() => setShowReferralModal(false)}>
          <div className="referral-modal" onClick={e => e.stopPropagation()}>
            <div className="referral-modal-title"><i className="fa fa-gift"></i> Invite Friends & Earn Rewards</div>
            <div className="referral-modal-code-row">
              <span className="referral-modal-code">{referralCode}</span>
              <button className="referral-modal-copy-btn" onClick={handleCopyReferral}><i className="fa fa-copy"></i></button>
              {copyMsg && <span className="referral-modal-copy-msg">{copyMsg}</span>}
            </div>
            <div className="referral-modal-details">
              <ul>
                <li>Share your referral code with friends.</li>
                <li>When a friend signs up and places their first order, you both get <b>₹50 wallet cashback</b>.</li>
                <li>You have <b>{successfulInvites}</b> successful invites.</li>
                <li>No limit on invites. More friends = more rewards!</li>
              </ul>
            </div>
            <button className="referral-modal-close-btn" onClick={() => setShowReferralModal(false)}><i className="fa fa-times"></i> Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Wallet;
