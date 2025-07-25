import React, { useState, useRef, useMemo } from 'react';
import '../Dashboard/Dashboard.css';
import './Rating.css'
import { Link, useNavigate } from 'react-router-dom';

const navLinks = [
  { to: '/Home', image: require('../Images/Fahome.png'), label: 'Home', className:'nav-link ' },
  { to: '/products', image: require('../Images/Fabox.png'), label: 'Products', className:'nav-link' },
  { to: '/Orders', image: require('../Images/order.png'), label: 'Your Orders', className:'nav-link' },
  { to: '/Profile', image: require('../Images/Fauser.png'), label: 'Profile' , className:'nav-link ' },
  { to: '/Wallet', image: require('../Images/wallet.png'), label: 'Wallet' , className:'nav-link' },
  { to: '/Yourcoupons', image: require('../Images/co.png'), label: 'Your Coupons' , className:'nav-link' },
  { to: '/Yourrating', image: require('../Images/rate.png'), label: 'Your Rating', className:'nav-link  link-active ' },
  { to: '/Payment', image: require('../Images/payment.png'), label: 'Payment' , className:'nav-link' },
  { to: '/settings', image: require('../Images/settings-24.png'), label: 'Settings' , className:'nav-link' },
  { to: '/address', image: require('../Images/location.png'), label: 'Address', className:'nav-link ' },
  { to: '/help', image: require('../Images/help-c.png'), label: 'Help Center', className:'nav-link' },
];

const membershipTypes = [
  { key: 'premium', label: 'Premium', icon: 'fa-crown' },
];

function Rating() {
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
  const products = [
    { name: 'Apple', image: 'https://images.unsplash.com/photo-1567306226416-28f0efdc88ce', description: 'Fresh and juicy apples from the farm.' },
    { name: 'Orange', image: 'https://plantskingdom.in/cdn/shop/products/exoticflorakinnow.jpg?v=1657427218&width=1445', description: 'Citrus oranges full of vitamin C.' },
    { name: 'Water Bottle', image:'https://shropshireprinting.co.uk/cdn-cgi/image/width=2048,format=webp/https:/shropshireprinting.co.uk/assets/uploads/2023/09/Summit-water-bottle-front.jpg', description: 'Pure and cool mineral water.' },
    { name: 'Mango', image: 'https://www.fortheloveofnature.in/cdn/shop/products/Mangiferaindica-Priyur_Mango_1.jpg?v=1640246617', description: 'King of fruits, juicy and delicious.' },
    { name: 'Milk', image: 'https://image1.jdomni.in/product/09082021/B6/40/95/69E61DFEBC8F07440F282561BF_1628449240817.jpg?fit=around|500:500', description: 'Fresh cow milk, rich in calcium.' },
    { name: 'Bread', image: 'https://www.bbassets.com/media/uploads/p/l/40232044_8-tasties-milk-bread.jpg', description: 'Soft and fresh bakery bread.' },
    { name: 'Apple Juice', image:'https://instamart-media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,h_600/NI_CATALOG/IMAGES/CIW/2025/5/19/9ccf397a-3a3f-421e-876a-f2971585de21_1144_1.png', description: 'Apple juice, refreshing.' },
    { name: 'Banana Juice', image:'https://www.thespruceeats.com/thmb/RTH5cMhDMvK61a4okKEUqneMtxU=/3909x2601/filters:fill(auto,1)/banana-smoothie-recipes-759606-hero-01-d2abaa79f3204030a0ec0a8940456acc.jpg', description: 'Banana juice, refreshing.' },
    { name: 'Grapes Juice', image:'https://i.ytimg.com/vi/FFEKni_ik9k/maxresdefault.jpg', description: 'Grapes juice, refreshing.' },
    { name: 'Chips', image: 'https://m.media-amazon.com/images/I/81wz+n636HL._UF350,350_QL80_.jpg', description: 'Crispy potato chips, lightly salted.' },
    { name: 'Banana', image: 'https://www.jiomart.com/images/product/original/590000454/banana-robusta-1-kg-product-images-o590000454-p590000454-0-202410011654.jpg?im=Resize=(420,420)', description: 'Sweet bananas rich in potassium.' },
    { name: 'Grapes', image: 'https://www.shysha.in/wp-content/uploads/2022/12/Grape-Seed-less-White-600x419.jpg', description: 'Seedless grapes, sweet and crisp.' },
  ];
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
  const [userRating, setUserRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviews, setReviews] = useState([
    { quality: 'Excellent', rating: 5, text: 'Amazing apples! Super fresh and tasty.', items: ['Apple', 'Banana', 'Apple Juice'], submittedAt: new Date('2024-06-01T10:00:00'), delivery: 'On time', packaging: 'Very good' },
    { quality: 'Bad', rating: 2, text: 'Orange was not sweet, a bit sour.', items: ['Orange', 'Water Bottle', 'Chips'], submittedAt: new Date('2024-06-02T12:30:00'), delivery: 'Late', packaging: 'Average' },
    { quality: 'Good', rating: 4, text: 'Water bottle was cool and pure.', items: ['Water Bottle', 'Bread', 'Milk'], submittedAt: new Date('2024-06-03T09:15:00'), delivery: 'On time', packaging: 'Good' },
    { quality: 'Excellent', rating: 5, text: 'Mangoes were the best I ever had!', items: ['Mango', 'Apple', 'Grapes'], submittedAt: new Date('2024-06-04T14:45:00'), delivery: 'Early', packaging: 'Perfect' },
    { quality: 'Worst', rating: 1, text: 'Milk was spoiled, very bad experience.', items: ['Milk', 'Bread', 'Chips'], submittedAt: new Date('2024-06-05T11:20:00'), delivery: 'Late', packaging: 'Poor' },
    { quality: 'Average', rating: 3, text: 'Bread was okay, not very fresh.', items: ['Bread', 'Banana Juice', 'Banana'], submittedAt: new Date('2024-06-06T16:10:00'), delivery: 'On time', packaging: 'Good' },
    { quality: 'Good', rating: 4, text: 'Juice was refreshing and tasty.', items: ['Juice', 'Apple', 'Orange'], submittedAt: new Date('2024-06-07T13:00:00'), delivery: 'On time', packaging: 'Excellent' },
    { quality: 'Bad', rating: 2, text: 'Chips were soggy, not crispy.', items: ['Chips', 'Banana', 'Milk'], submittedAt: new Date('2024-06-08T10:30:00'), delivery: 'Late', packaging: 'Average' },
    { quality: 'Excellent', rating: 5, text: 'Bananas were sweet and fresh.', items: ['Banana', 'Apple', 'Grapes'], submittedAt: new Date('2024-06-09T13:00:00'), delivery: 'On time', packaging: 'Excellent' },
    { quality: 'Average', rating: 3, text: 'Grapes were okay, a bit sour.', items: ['Grapes', 'Orange', 'Grapes Juice'], submittedAt: new Date('2024-06-10T10:30:00'), delivery: 'On time', packaging: 'Good' },
  ]);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);

  // Generate a random order ID for each review, consistent for the session
  const orderIds = useMemo(() =>
    reviews.map(() => `#Order${Math.floor(1000 + Math.random() * 9000)}#`)
  , [reviews.length]);

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

  const openReviewModal = (review) => {
    setSelectedReview(review);
    setShowReviewModal(true);
  };
  const closeReviewModal = () => {
    setShowReviewModal(false);
    setSelectedReview(null);
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

        <div className="review-list-section full-width">
          <h2>Reviews</h2>
          <div className="review-list">
            {reviews.map((review, idx) => (
              <div className="review-card" key={idx} onClick={() => openReviewModal(review)} role="button" tabIndex={0}>
                <div className="review-card-content">
                  <div className="review-card-details">
                    <div className="review-order-id"><b>Order ID:</b> {orderIds[idx]}</div>
                    <div className="review-card-items-names">
                      {review.items.map(itemName => (
                        <div className="review-product-name" key={itemName}>{itemName},</div>
                      ))}
                    </div>
                    <div className="review-quality"><b>Quality:</b> {review.quality}</div>
                    <div className="review-rating">
                      {[1,2,3,4,5].map(star => (
                        <span key={star} className={`star${review.rating >= star ? ' filled' : ''}`}>
                          <i className="fa fa-star"></i>
                        </span>
                      ))}
                    </div>
                    <div className="review-text">{review.text}</div>
                    <div className="review-info-row">
                      <span className="review-delivery"><b>Delivery:</b> {review.delivery}</span>
                      <span className="review-packaging"><b>Packaging:</b> {review.packaging}</span>
                    </div>
                    <div className="review-date">{review.submittedAt ? new Date(review.submittedAt).toLocaleDateString() : ''}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        {showReviewModal && selectedReview && (
          <div className="review-modal-overlay" onClick={closeReviewModal}>
            <div className="review-modal" onClick={e => e.stopPropagation()}>
              <>
                <h3>Review Details</h3>
                <div className="modal-product-info">
                  <div className="modal-items-list">
                    {selectedReview.items.map(itemName => {
                      const product = products.find(p => p.name === itemName);
                      return (
                        <div className="modal-item" key={itemName}>
                          <img src={product.image} alt={product.name} className="modal-product-image" />
                          <div className="modal-product-name">{product.name}</div>
                          <div className="modal-product-desc">{product.description}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div className="modal-review-quality"><b>Quality:</b> {selectedReview.quality}</div>
                <div className="modal-review-rating">
                  {[1,2,3,4,5].map(star => (
                    <span key={star} className={`star${selectedReview.rating >= star ? ' filled' : ''}`}>
                      <i className="fa fa-star"></i>
                    </span>
                  ))}
                </div>
                <div className="modal-review-text"><b>Review:</b> "{selectedReview.text}"</div>
                <div className="modal-review-date"><b>Submitted At:</b> {selectedReview.submittedAt ? new Date(selectedReview.submittedAt).toLocaleString() : ''}</div>
                <div className="modal-review-delivery"><b>Delivery:</b> {selectedReview.delivery}</div>
                <div className="modal-review-packaging"><b>Packaging:</b> {selectedReview.packaging}</div>
                <div className="modal-order-id"><b>Order ID:</b> {orderIds[reviews.findIndex(r => r === selectedReview)]}</div>
                <button className="modal-close-btn" onClick={closeReviewModal}>Close</button>
              </>
            </div>
          </div>
        )}
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
    </div>
  );
}

export default Rating;