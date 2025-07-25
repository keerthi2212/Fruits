import React, { useState, useEffect, useRef } from 'react';
import './Product.css';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import allProducts from './productsData';

const navLinks = [
   { to: '/Home', image: require('../Images/Fahome.png'), label: 'Home', className:'nav-link ' },
  { to: '/products', image: require('../Images/Fabox.png'), label: 'Products', className:'nav-link link-active ' },
  { to: '/Orders', image: require('../Images/order.png'), label: 'Your Orders', className:'nav-link' },
  { to: '/Profile', image: require('../Images/Fauser.png'), label: 'Profile' , className:'nav-link' },
  { to: '/Wallet', image: require('../Images/wallet.png'), label: 'Wallet' , className:'nav-link' },
  { to: '/Yourcoupons', image: require('../Images/co.png'), label: 'Your Coupons' , className:'nav-link' },
  { to: '/Yourrating', image: require('../Images/rate.png'), label: 'Your Rating', className:'nav-link' },
  { to: '/Payment', image: require('../Images/payment.png'), label: 'Payment' , className:'nav-link' },
  { to: '/settings', image: require('../Images/settings-24.png'), label: 'Settings' , className:'nav-link' },
  { to: '/address', image: require('../Images/location.png'), label: 'Address', className:'nav-link ' },
  { to: '/help', image: require('../Images/help-c.png'), label: 'Help Center', className:'nav-link' },
];

const categories = [
  'All',
  'Today Deals',
  'Fruits & Vegetables',
  'Bakery & Dairy',
  'Frozen Foods',
  'Hot & Cold Beverages',
  'Chocolates & Ice Creams',
  'Masalas & Dry Fruits',
  'Chips & Namkeen',
  'Bath & Body',
  'Eggs & Meat',
  'Hygiene',
];

const categoryImages = {
  'All': 'https://thumbs.dreamstime.com/b/grocery-shopping-concept-balanced-diet-concept-fresh-foods-shopping-bag-white-background-grocery-shopping-concept-balanced-114552130.jpg',
  'Today Deals':'https://previews.123rf.com/images/drnn/drnn1906/drnn190600070/125242974-daily-deals-colorful-web-typography-banner-icon-frame.jpg',
  'Fruits & Vegetables': 'https://images.moneycontrol.com/static-mcnews/2024/02/Health-benefits-of-vegetables-and-fruits-770x433.jpg',
  'Bakery & Dairy': 'https://www.shutterstock.com/image-photo/bread-milk-on-table-260nw-1179049846.jpg',
  'Frozen Foods': 'https://www.financialexpress.com/wp-content/uploads/2024/04/Shailja-Tiwari-2024-04-05T083242.139.png',
  'Hot & Cold Beverages': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSsJlrWY1X4eLvRUZhZAG50RtYlwBmJFFDUxA&s',
  'Chocolates & Ice Creams': 'https://i.pinimg.com/736x/99/ff/4a/99ff4a9612558f8f21e7990848ef00d0.jpg',
  'Masalas & Dry Fruits': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcREnlxT79VluTAKUWUk9M1Pvq2pKJfGryhiCw&s',
  'Chips & Namkeen': 'https://m.media-amazon.com/images/I/81wz+n636HL._UF350,350_QL80_.jpg',
  'Bath & Body': 'https://m.media-amazon.com/images/I/61rCCuSH2aL.jpg',
  'Eggs & Meat': 'https://www.shutterstock.com/image-photo/balanced-diet-cooking-culinary-food-260nw-300553067.jpg',
  'Hygiene': 'https://media.istockphoto.com/id/147280026/photo/collection-of-personal-hygiene-products.jpg?s=612x612&w=0&k=20&c=4E7B2HBjPEoymkbZmExNnfyRL7D2GTqAK5gWzz6jUv0=',
};

const Products = () => {
  // Cart state and cartCount synced with localStorage
  const [cart, setCart] = useState(() => {
    const cartData = JSON.parse(localStorage.getItem('cart') || '{}');
    return cartData;
  });
  const [cartCount, setCartCount] = useState(() => Object.keys(cart).length);

  // Update localStorage and cartCount whenever cart changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
    setCartCount(Object.keys(cart).length);
  }, [cart]);

  // Listen for cart changes in other tabs/pages
  useEffect(() => {
    const handleStorage = (e) => {
      if (e.key === 'cart') {
        const newCart = JSON.parse(e.newValue || '{}');
        setCart(newCart);
        setCartCount(Object.keys(newCart).length);
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);
  const [filterCategory, setFilterCategory] = useState('All');
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
  const location = useLocation();

  // Membership state
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

    // Create recognition instance if not already created
    if (!recognitionRef.current) {
      recognitionRef.current = new window.webkitSpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';
    }

    // Prevent starting if already running
    if (recognitionRef.current._isStarted) {
      return;
    }
    recognitionRef.current._isStarted = true;

    recognitionRef.current.onstart = () => {
      setMicListening(true);
      setShowMicModal(true);
      setMicResult('Listening...');
    };

    recognitionRef.current.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setSearchText(transcript);
      setMicResult(`Recognized: "${transcript}"`);
      setMicListening(false);
    };

    recognitionRef.current.onerror = (event) => {
      setMicResult(`Voice recognition error: ${event.error}`);
      setMicListening(false);
      recognitionRef.current._isStarted = false;
    };

    recognitionRef.current.onend = () => {
      setMicListening(false);
      recognitionRef.current._isStarted = false;
    };

    recognitionRef.current.start();
  };

  // Add handleCloseMicModal and handleTryAgain for mic modal
  const handleCloseMicModal = () => {
    setShowMicModal(false);
    setMicListening(false);
    setMicResult('');
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current._isStarted = false;
    }
  };

  const handleTryAgain = () => {
    setMicResult('');
    setMicListening(true);
    handleVoiceSearch();
  };

  // If navigated with state, filter by category or open modal for product
  React.useEffect(() => {
    if (location.state) {
      if (location.state.category) {
        setFilterCategory(location.state.category);
      }
      if (location.state.productName) {
        // Find product by name (case-insensitive)
        const prod = allProducts.find(p => p.name.toLowerCase() === location.state.productName.toLowerCase());
        if (prod) {
          openProductModal(prod);
        }
      }
    }
  }, [location.state]);

  const [showFilterModal, setShowFilterModal] = useState(false);
  const [sortBy, setSortBy] = useState(""); // "lowToHigh" or "highToLow"
  const [vegPref, setVegPref] = useState(""); // "veg", "egg", "nonveg"
  const [topPick, setTopPick] = useState(false);
  const [dietPref, setDietPref] = useState(""); // "spicy"

  let filteredProducts;
  if (filterCategory === 'Today Deals') {
    // Shuffle and pick 8 random products
    const shuffled = allProducts.slice().sort(() => 0.5 - Math.random());
    filteredProducts = shuffled.slice(0, 8);
  } else {
    filteredProducts = allProducts.filter(p =>
      (filterCategory === 'All' ||
        (filterCategory === 'Fruits & Vegetables' && (p.category === 'Fruits' || p.category === 'Vegetables')) ||
        p.category === filterCategory
      ) &&
      p.name.toLowerCase().includes(searchText.toLowerCase())
    );
    // Veg/Non-veg filter
    if (vegPref === "veg") filteredProducts = filteredProducts.filter(p => p.category === "Fruits" || p.category === "Vegetables");
    if (vegPref === "egg") filteredProducts = filteredProducts.filter(p => p.name.toLowerCase().includes("egg"));
    if (vegPref === "nonveg") filteredProducts = filteredProducts.filter(p => p.category === "Eggs & Meat");
    // Top picks (example: filter by price or reorder count if you have that data)
    if (topPick) filteredProducts = filteredProducts.filter(p => p.price < 50); // Example logic
    // Dietary preference
    if (dietPref === "spicy") filteredProducts = filteredProducts.filter(p => p.name.toLowerCase().includes("spicy"));
    // Sort
    if (sortBy === "lowToHigh") filteredProducts = filteredProducts.slice().sort((a, b) => a.price - b.price);
    if (sortBy === "highToLow") filteredProducts = filteredProducts.slice().sort((a, b) => b.price - a.price);
  }

  const handleAddToCart = (id) => {
    setCart(prev => ({ ...prev, [id]: 1 }));
  };
  const handleIncrement = (id) => {
    setCart(prev => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  };
  const handleDecrement = (id) => {
    setCart(prev => {
      const current = prev[id] || 0;
      if (current <= 1) {
        const updated = { ...prev };
        delete updated[id];
        return updated;
      }
      return { ...prev, [id]: current - 1 };
    });
  };

  // Calculate cart summary
  const cartItems = Object.entries(cart).map(([id, qty]) => {
    const product = allProducts.find(p => p.id === id);
    return product ? { ...product, qty } : null;
  }).filter(Boolean);
  const totalItems = cartItems.reduce((sum, item) => sum + item.qty, 0);
  const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);

  // Save cart to localStorage on change
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  // Handle checkout
  const handleCheckout = () => {
    navigate('/cart');
  };

  // Add state for product modal
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showProductModal, setShowProductModal] = useState(false);
  const [modalMainImg, setModalMainImg] = useState(null);
  const openProductModal = (product) => {
    setSelectedProduct(product);
    setModalMainImg(product.images?.[0] || product.image);
    setShowProductModal(true);
  };
  const closeProductModal = () => {
    setShowProductModal(false);
    setSelectedProduct(null);
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
          {/* <button className="membership-switch-btn gold" onClick={handleSwitchMembership} title="Toggle Premium">
            <i className="fa fa-exchange"></i>
          </button> */}
        </div>
        <div className="search-bar header-search-bar">
          <span className="search-bar-icon">
            <i className="fa fa-search"></i>
          </span>
          <input
            type="text"
            placeholder={(() => {
              if (filterCategory === 'All') return 'Search for Items ...';
              if (filterCategory === 'Fruits & Vegetables') return 'Searcssh Fruits & Vegetables ...';
              return `Search ${filterCategory} ...`;
            })()}
            value={searchText}
            ref={searchInputRef}
            onChange={e => setSearchText(e.target.value)}
          />
          <button className="mic-btn blue" title="Voice Search" onClick={handleVoiceSearch}>
            <i className="fa fa-microphone"></i>
          </button>
        </div>
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
        <div className="product2-page">
          {/* Category cards row */}
          <div className="product2-category-row">
            {['All', ...categories.filter(cat => cat !== 'All')].map(cat => (
              <div
                key={cat}
                className={`product2-category-card${filterCategory === cat ? ' selected' : ''}`}
                onClick={() => setFilterCategory(cat)}
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer' }}
              >
                <img src={categoryImages[cat]} alt={cat} className="product2-category-img" />
                <span style={{ fontSize: 13, marginTop: 2 }}>{cat}</span>
              </div>
            ))}
          </div>
          <div className="product2-filter-row product2-filter-row-flex">
            {/* Dynamic search bar with icon, parallel to Sort & Filter button */}
            <div style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
              <span className="search-bar-icon-product" style={{ marginRight: 8, color: '#2563eb', fontSize: 18 }}>
                <i className="fa fa-search"></i>
              </span>
              <input
                type="text"
                placeholder={(() => {
                  if (filterCategory === 'All') return 'Browse all items ...';
                  else if (filterCategory === 'Today Deals') return 'Search for today’s best deals ...';
                  else if (filterCategory === 'Fruits & Vegetables') return 'Find fresh fruits & vegetables ...';
                  else if (filterCategory === 'Bakery & Dairy') return 'Search bakery goods & dairy products ...';
                  else if (filterCategory === 'Frozen Foods') return 'Search for frozen meals & snacks ...';
                  else if (filterCategory === 'Hot & Cold Beverages') return 'Search hot & cold beverages ...';
                  else if (filterCategory === 'Chocolates & Ice Creams') return 'Search chocolates & ice creams ...';
                  else if (filterCategory === 'Masalas & Dry Fruits') return 'Find spices & dry fruits ...';
                  else if (filterCategory === 'Chips & Namkeen') return 'Search chips, namkeen & munchies ...';
                  else if (filterCategory === 'Bath & Body') return 'Search bath & body essentials ...';
                  else if (filterCategory === 'Eggs & Meat') return 'Search for fresh eggs & meat ...';
                  else if (filterCategory === 'Hygiene') return 'Search hygiene & personal care products ...';
                  return `Search for ${filterCategory} ...`; // Fallback
                })()}
                value={searchText}
                onChange={e => setSearchText(e.target.value)}
                style={{
                  flex: 0.4,
                  padding: '0.7rem 1.2rem',
                  borderRadius: 8,
                  border: '1px solid #d1d5db',
                  fontSize: '1.1rem',
                  background: '#fff',
                  minWidth: 180,
                  outline: 'none',
                  marginRight: 16,
                  marginTop: 20,
                  paddingLeft:35,
                }}
              />

            </div>
            <button onClick={() => setShowFilterModal(true)} className="sortby-btn">
              Sort & Filter
            </button>
          </div>
          <div className="product2-grid">
            {filteredProducts.map(product => (
              <div
                className="product2-card product2-card-clickable"
                key={product.id}
                onClick={() => openProductModal(product)}
                tabIndex={0}
                role="button"
                aria-label={`View details for ${product.name}`}
              >
                <div className="product2-img-wrapper">
                  {product.offer && (
                    <div className="product2-offer-badge">{product.offer}</div>
                  )}
                  <img src={product.image} alt={product.name} className="product2-img" />
                </div>
                <div className="product2-info">
                  <div className="product2-name" style={{ textAlign: 'center', fontWeight: 'bold', marginTop: 8 }}> <h3 className='product-k'> {product.name} </h3>  {product.quantity && <span className="product2-quantity-highlight">{product.quantity}</span>}</div>
                  {/* <div className="product2-quantity">{product.quantity}</div> */}
                  {product.price && (
                    <div className="product2-price-row">
                      <span className="product2-price">₹{product.price}</span>
                      <span className="product2-original-price">₹{product.originalPrice}</span>
                    </div>
                  )}
                   <div className='extra-detail'>
                      {product.extraDetails && product.extraDetails.description && (
                        <span className="product2-description">{product.extraDetails.description}</span>
                      )}
                    </div>
                  <div className="product2-cart-row">
                    {!cart[product.id] && (
                      <button className="product2-add-btn" onClick={e => { e.stopPropagation(); handleAddToCart(product.id); }}>
                        <i className="fa fa-shopping-cart"></i> Add to cart
                      </button>
                    )}
                    {cart[product.id] && (
                      <div className="product2-qty-row">
                        <button className="product2-qty-btn" onClick={e => { e.stopPropagation(); handleDecrement(product.id); }}>-</button>
                        <span className="product2-qty-value">{cart[product.id]}</span>
                        <button className="product2-qty-btn" onClick={e => { e.stopPropagation(); handleIncrement(product.id); }}>+</button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Cart summary bar */}
        {/* {totalItems > 0 && (
          <div className="cart-summary-float-bar">
            <span className="cart-summary-float-total">{totalItems} item{totalItems > 1 ? 's' : ''} | ₹{totalPrice}</span>
            <button className="checkout-btn" onClick={handleCheckout}>Checkout</button>
          </div>
        )} */}
      </main>
      {showFilterModal && (
        <div className="modal-overlay" onClick={() => setShowFilterModal(false)}>
          <div className="filter-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className='filteran' >Filters and Sorting</h2>
              <button className="close-btn" onClick={() => setShowFilterModal(false)}>X</button>
            </div>
            <div className="modal-section">
              <div className='sort-by' >Sort by</div>
              <button onClick={() => setSortBy("lowToHigh")} className={sortBy==="lowToHigh" ? "selected" : ""}>Price - low to high</button>
              <button onClick={() => setSortBy("highToLow")} className={sortBy==="highToLow" ? "selected" : ""}>Price - high to low</button>
            </div>
            <div className="modal-section">
              <div className='sort-by' >Veg/Non-veg preference</div>
              <button onClick={() => setVegPref("veg")} className={vegPref==="veg" ? "selected" : ""}>Veg</button>
              <button onClick={() => setVegPref("egg")} className={vegPref==="egg" ? "selected" : ""}>Egg</button>
              <button onClick={() => setVegPref("nonveg")} className={vegPref==="nonveg" ? "selected" : ""}>Non-veg</button>
            </div>
            <div className="modal-section">
              <div className='sort-by' >Top picks</div>
              <button onClick={() => setTopPick(!topPick)} className={topPick ? "selected" : ""}>Highly reordered</button>
            </div>
            <div className="modal-footer">
              <button onClick={() => {
                setSortBy(""); setVegPref(""); setTopPick(false); setDietPref("");
              }} className="clear-btn">Clear All</button>
              <button onClick={() => setShowFilterModal(false)} className="apply-btn">Apply</button>
            </div>
          </div>
        </div>
      )}
      {showProductModal && selectedProduct && (
        <div className="product-modal-overlay" onClick={closeProductModal}>
          <div className="product-modal" onClick={e => e.stopPropagation()}>
            <button className="product-modal-close" onClick={closeProductModal} aria-label="Close product details">&times;</button>
            <div className="product-modal-content">
              <div className="product-modal-main">
                <img src={modalMainImg} alt={selectedProduct.name} className="product-modal-main-img" />
                <div className="product-modal-thumbnails">
                  {(selectedProduct.images || [selectedProduct.image]).slice(0, 4).map((img, idx) => (
                    <img
                      key={idx}
                      src={img}
                      alt={selectedProduct.name + ' ' + (idx + 1)}
                      className={`product-modal-thumbnail${modalMainImg === img ? ' selected' : ''}`}
                      onClick={() => setModalMainImg(img)}
                      tabIndex={0}
                      role="button"
                      aria-label={`Show image ${idx + 1} for ${selectedProduct.name}`}
                    />
                  ))}
                </div>
              </div>
              <div className="product-modal-details">
                <div className='product-modal-details-header'>
                <h2 className="product-modal-title-center">{selectedProduct.name}</h2>
                {selectedProduct.offer && <div className="product-modal-offer-inline">{selectedProduct.offer}</div>}
                  </div>
                <div className="product-modal-price-row">
                  <span className="product-modal-price">₹{selectedProduct.price}</span>
                  <span className="product-modal-original-price">₹{selectedProduct.originalPrice}</span>
                  {selectedProduct.quantity && <span className="product-modal-quantity-highlight">{selectedProduct.quantity}</span>}
                </div>
                <div className="product-modal-plain-details">
                  {selectedProduct.extraDetails && Object.values(selectedProduct.extraDetails).map((value, idx) => (
                    <div key={idx} className="product-modal-plain-detail">{value}</div>
                  ))}
                </div>
                <div className="product-modal-cart-row">
                  {!cart[selectedProduct.id] && (
                    <button className="product-modal-add-btn" onClick={() => handleAddToCart(selectedProduct.id)}>
                      <i className="fa fa-shopping-cart"></i> Add to cart
                    </button>
                  )}
                  {cart[selectedProduct.id] && (
                    <div className="product-modal-qty-row">
                      <button className="product-modal-qty-btn" onClick={() => handleDecrement(selectedProduct.id)}>-</button>
                      <span className="product-modal-qty-value">{cart[selectedProduct.id]}</span>
                      <button className="product-modal-qty-btn" onClick={() => handleIncrement(selectedProduct.id)}>+</button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Mic Modal for voice search (copied from Dashboard.js) */}
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
};

export default Products;