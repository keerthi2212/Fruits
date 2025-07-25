import React, { useState, useEffect, useRef } from 'react';
import './Help.css';
import { Link, useNavigate } from 'react-router-dom';

const navLinks = [
   { to: '/Home', image: require('../Images/Fahome.png'), label: 'Home', className:'nav-link ' },
  { to: '/products', image: require('../Images/Fabox.png'), label: 'Products', className:'nav-link' },
  { to: '/Orders', image: require('../Images/order.png'), label: 'Your Orders', className:'nav-link' },
  { to: '/Profile', image: require('../Images/Fauser.png'), label: 'Profile' , className:'nav-link' },
  { to: '/Wallet', image: require('../Images/wallet.png'), label: 'Wallet' , className:'nav-link' },
  { to: '/Yourcoupons', image: require('../Images/co.png'), label: 'Your Coupons' , className:'nav-link' },
  { to: '/Yourrating', image: require('../Images/rate.png'), label: 'Your Rating', className:'nav-link' },
  { to: '/Payment', image: require('../Images/payment.png'), label: 'Payment' , className:'nav-link' },
  { to: '/settings', image: require('../Images/settings-24.png'), label: 'Settings' , className:'nav-link' },
  { to: '/address', image: require('../Images/location.png'), label: 'Address', className:'nav-link ' },
  { to: '/help', image: require('../Images/help-c.png'), label: 'Help Center', className:'nav-link  link-active' },
];

function Help() {
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
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [openQuestion, setOpenQuestion] = useState(null);
  const [feedback, setFeedback] = useState({});
  const [copySuccess, setCopySuccess] = useState(null);

  const helpTopics = [
    {
      icon: 'fa-shopping-cart',
      title: 'Get Started',
      description: 'Learn how to browse products, add items to your cart, and place your first order.',
      qna: [
        { q: 'How do I find products?', a: 'You can use the search bar at the top of the page or browse through the product categories in the sidebar. We have a wide selection of fresh fruits and vegetables, updated daily.', icon: 'fa-search' },
        { q: 'How do I add items to my cart?', a: 'On any product page, simply select the quantity you desire and click the prominent "Add to Cart" button. The item will be saved in your cart while you continue shopping.', icon: 'fa-plus-circle' },
        { q: 'How do I place an order?', a: 'Once you have items in your cart, click the cart icon in the header, review your items to ensure everything is correct, and proceed to our secure checkout to enter your shipping and payment information.', icon: 'fa-credit-card' },
        { q: 'Can I save items for later?', a: 'Yes! You can add items to your wishlist to save them for future purchases.', icon: 'fa-heart' },
        { q: 'How do I use discount codes?', a: 'Enter your discount code at checkout in the promo code field to apply your savings.', icon: 'fa-tag' },
      ]
    },
    {
      icon: 'fa-user',
      title: 'Manage Your Account',
      description: 'Update your profile, change your password, and manage your addresses.',
      qna: [
        { q: 'How do I update my profile information?', a: 'Navigate to the "Profile" section from the sidebar. Here, you can update your name, email, contact number, and other personal details.', icon: 'fa-edit' },
        { q: 'How can I change my password?', a: 'For your security, go to the "Security" settings page. You will be prompted to enter your current password before choosing a new one.', icon: 'fa-key' },
        { q: 'How do I add or remove a shipping address?', a: 'You can manage all your shipping addresses in the "Address Book" section. Add new addresses or delete old ones to keep your information up-to-date.', icon: 'fa-map-marker-alt' },
        { q: 'How do I delete my account?', a: 'Please contact our support team to request account deletion. We will process your request promptly.', icon: 'fa-user-times' },
      ]
    },
    {
      icon: 'fa-truck',
      title: 'Shipping & Delivery',
      description: 'Find out about our shipping options, delivery times, and tracking information.',
      qna: [
        { q: 'What are your shipping rates?', a: 'Shipping rates are calculated at checkout based on your delivery location and the total weight of your order. We strive to offer the most competitive rates.', icon: 'fa-rupee-sign' },
        { q: 'How long does delivery take?', a: 'Standard delivery typically takes 3-5 business days. We also offer an express delivery option for faster service, which usually arrives within 1-2 business days.', icon: 'fa-clock' },
        { q: 'How can I track my order?', a: 'As soon as your order has shipped, you will receive an email containing a tracking link. You can also find real-time tracking information in the "Your Orders" section of your account.', icon: 'fa-location-arrow' },
        { q: 'Do you deliver to my area?', a: 'We deliver to most locations in the city. Enter your pin code at checkout to check delivery availability.', icon: 'fa-map-pin' },
      ]
    },
    {
      icon: 'fa-credit-card',
      title: 'Payments & Billing',
      description: 'Learn about our accepted payment methods, and how to view your order history.',
      qna: [
        { q: 'What payment methods do you accept?', a: 'We accept all major credit and debit cards, PayPal, and other popular digital payment wallets for your convenience.', icon: 'fa-credit-card' },
        { q: 'Where can I find my invoices?', a: 'Your complete order history and detailed invoices are available anytime in the "Payment" section of your account dashboard.', icon: 'fa-file-invoice' },
        { q: 'Is my payment information secure?', a: 'Absolutely. We use industry-leading SSL encryption to ensure that your payment details are always safe and secure.', icon: 'fa-lock' },
        { q: 'Can I pay with cash on delivery?', a: 'Yes, we offer cash on delivery for select locations and order values.', icon: 'fa-money-bill' },
      ]
    },
    {
      icon: 'fa-undo',
      title: 'Returns & Refunds',
      description: 'Read our return policy and learn how to initiate a return or request a refund.',
      qna: [
        { q: 'What is your return policy?', a: 'We offer a 14-day return policy on all our fresh produce. If you are not completely satisfied with your order, you can request a return.', icon: 'fa-calendar-check' },
        { q: 'How do I start a return?', a: 'Please contact our dedicated support team through the "Help Center" with your order number. Our team will guide you through the simple return process.', icon: 'fa-life-ring' },
        { q: 'When will I get my refund?', a: 'Once we receive the returned items, your refund will be processed promptly and should appear in your account within 5-7 business days.', icon: 'fa-history' },
        { q: 'Can I exchange an item?', a: 'Yes, exchanges are possible for certain products. Please contact support for more details.', icon: 'fa-exchange-alt' },
      ]
    },
    {
      icon: 'fa-leaf',
      title: 'Product Information',
      description: 'Get details about our products, including nutritional information and sourcing.',
      qna: [
        { q: 'Where do you source your produce from?', a: 'We are proud to partner with a network of local and organic farms. This allows us to bring you the freshest, highest-quality produce available.', icon: 'fa-handshake' },
        { q: 'Is the produce organic?', a: 'We offer a wide variety of both certified organic and conventional produce to suit your preferences. Please check the product description for specific details.', icon: 'fa-check-circle' },
        { q: 'How should I store fruits and vegetables?', a: 'Proper storage is key to freshness. We provide detailed storage recommendations and tips on each product page to help you keep your produce fresh for longer.', icon: 'fa-info-circle' },
        { q: 'Where can I find nutritional information?', a: 'Nutritional details are available on each product page. If you need more information, contact our support team.', icon: 'fa-apple-alt' },
      ]
    },
  ];

  const handleTopicClick = (topic) => {
    setSelectedTopic(topic);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedTopic(null);
    setOpenQuestion(null);
    setCopySuccess(null);
  };

  const handleQuestionToggle = (index) => {
    setOpenQuestion(openQuestion === index ? null : index);
    setCopySuccess(null);
  };

  const handleCopy = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopySuccess(index);
    setTimeout(() => setCopySuccess(null), 1500);
  };

  const handleFeedback = (index, value) => {
    setFeedback(prev => ({ ...prev, [index]: value }));
  };

  const handleContactSupport = () => {
    window.open('mailto:support@fruitsandveggies.com?subject=Help%20Request', '_blank');
  };

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
        {/* Welcome/Intro Section */}
        {/* <div className="help-welcome">
            <h2>Welcome to the Fruits & Vegetables Help Center!</h2>
            <p>Find answers, tips, and resources to make your shopping experience smooth and enjoyable. If you need further assistance, our support team is just a click away.</p>
          </div> */}
        <div className="help-center-container">
          <div className="help-hero">
            <h1>We are here to Help you.</h1>
            <p>Advice and answers from the Fruits Team</p>
            <div className="help-search-bar">
              <i className="fa fa-search"></i>
              <input type="text" placeholder="Type your search..." />
              <button>SEARCH</button>
            </div>
          </div>

          

          

          <div className="help-topics-grid">
            {helpTopics.map((topic, index) => (
              <div className="topic-card" key={index} onClick={() => handleTopicClick(topic)}>
                <div className="topic-icon-wrapper">
                  <i className={`fa ${topic.icon}`}></i>
                </div>
                <div className="topic-content">
                  <h3>{topic.title}</h3>
                  <p>{topic.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      {isModalOpen && selectedTopic && (
        <div className="help-modal-overlay" onClick={handleCloseModal}>
          <div className="help-modal" onClick={(e) => e.stopPropagation()}>
            <div className="help-modal-header">
              <h2>{selectedTopic.title}</h2>
              <button className="help-modal-close-btn" onClick={handleCloseModal}>
                <i className="fa fa-times"></i>
              </button>
            </div>
            <div className="help-modal-body">
              {selectedTopic.qna.map((item, index) => (
                <div className="qna-item" key={index}>
                  <div className="qna-question" onClick={() => handleQuestionToggle(index)}>
                    <div className="qna-question-title">
                      <i className={`fa ${item.icon}`}></i>
                      <span>{item.q}</span>
                    </div>
                    <i className={`fa fa-chevron-${openQuestion === index ? 'up' : 'down'}`}></i>
                  </div>
                  {openQuestion === index && (
                    <div className="qna-answer">
                      <p>{item.a}</p>
                      <button className="copy-btn" onClick={() => handleCopy(item.a, index)}>
                        <i className="fa fa-copy"></i> {copySuccess === index ? 'Copied!' : 'Copy Answer'}
                      </button>
                      <div className="feedback-row">
                        <span>Was this helpful?</span>
                        <button className={`feedback-btn${feedback[index] === 'yes' ? ' selected' : ''}`} onClick={() => handleFeedback(index, 'yes')}>
                          <i className="fa fa-thumbs-up"></i>
                        </button>
                        <button className={`feedback-btn${feedback[index] === 'no' ? ' selected' : ''}`} onClick={() => handleFeedback(index, 'no')}>
                          <i className="fa fa-thumbs-down"></i>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
              <div className="contact-support-row">
                <button className="contact-support-btn" onClick={handleContactSupport}>
                  <i className="fa fa-headset"></i> Contact Support
                </button>
              </div>
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

export default Help;