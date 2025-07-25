import React, { useState, useEffect, useRef } from 'react';
//ximport './Home.css';
import './Dashboard.css'
import { Link, useNavigate } from 'react-router-dom';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Products from '../Product/Products';
//import Products from './Product/Products';
//import Product from './Product/Product';
import chocolates from '../Images/Chocolates.webp'; 

// Updated background images for slider
const bgImages = [
  // Organic vegetables
  'https://images.moneycontrol.com/static-mcnews/2024/02/Health-benefits-of-vegetables-and-fruits-770x433.jpg',
  // Fresh vegetables
  'https://c.ndtvimg.com/2023-05/ggrnff6o_chicken_625x300_04_May_23.jpg?im=FaceCrop,algorithm=dnn,width=1200,height=886',
  // Home appliances
  'https://images.pexels.com/photos/373548/pexels-photo-373548.jpeg?auto=compress&w=1200&q=80',
  // Beauty products
  'https://images.pexels.com/photos/1667072/pexels-photo-1667072.jpeg?auto=compress&w=1200&q=80',
  // Electronics
  'https://media.istockphoto.com/id/1400570369/photo/old-computers-digital-tablets-mobile-phones-many-used-electronic-gadgets-devices-broken.jpg?s=612x612&w=0&k=20&c=hTH7vKZphyeXnT-MM484pS_54GH6j9O7Ev2QyMkxzTQ=',
];

const navLinks = [
  { to: '/Home', image: require('../Images/Fahome.png'), label: 'Home', className:'nav-link link-active' },
  { to: '/products', image: require('../Images/Fabox.png'), label: 'Products', className:'nav-link' },
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

const frequentlySearched = [
  'essentials hoodie',
  'iphones 15 pro max',
  'designer bags',
];

function Home() {
  // Get cart items count from localStorage
  const [cartCount, setCartCount] = useState(0);
  useEffect(() => {
    const cartData = JSON.parse(localStorage.getItem('cart') || '{}');
    setCartCount(Object.keys(cartData).length);
  }, []);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [bgIndex, setBgIndex] = useState(0);
  const [searchText, setSearchText] = useState('');
  const [showHeaderSearch, setShowHeaderSearch] = useState(true);
  const [showNotificationDropdown, setShowNotificationDropdown] = useState(false);
  const [showMicModal, setShowMicModal] = useState(false);
  const [micListening, setMicListening] = useState(false);
  const [micResult, setMicResult] = useState('');
  const searchInputRef = useRef(null);
  const heroSearchInputRef = useRef(null);
  const recognitionRef = useRef(null);
  const [onSaleIndex, setOnSaleIndex] = useState(0);
  const navigate = useNavigate();


  // Product data for 'Recommended for you'
  const recommendedProducts = [
    {
      id: 'chocolates',
      name: 'Chocolates',
      unit: '500g',
      image: [chocolates],
      offer: '20% OFF on all premium chocolates!',
      price: 199,
      originalPrice: 249,
      offerPercent: 20,
    },
    {
      id: 'icecreams',
      name: 'Ice Creams',
      unit: '500ml',
      image: 'https://b.zmtcdn.com/data/pictures/chains/7/90007/79ba091cb3f65e22ab935a7e9708185d.jpg',
      offer: 'Buy 1 Get 1 Free!',
      price: 149,
      originalPrice: 199,
      offerPercent: 25,
    },
    {
      id: 'pineapple',
      name: 'Pineapple',
      unit: '1kg',
      image: 'https://images.immediate.co.uk/production/volatile/sites/30/2024/06/Pineapple-01-5562ee3.jpg',
      offer: 'Fresh Pineapples at 15% OFF',
      price: 85,
      originalPrice: 100,
      offerPercent: 15,
    },
    {
      id: 'orange',
      name: 'Orange',
      unit: '1kg',
      image: 'https://plantskingdom.in/cdn/shop/products/exoticflorakinnow.jpg?v=1657427218&width=1445',
      offer: 'Vitamin C Boost! 10% OFF',
      price: 45,
      originalPrice: 50,
      offerPercent: 10,
    },
    {
      id: 'tomato',
      name: 'Tomato',
      unit: '1kg bag',
      image: 'https://media.post.rvohealth.io/wp-content/uploads/2020/09/AN313-Tomatoes-732x549-Thumb-732x549.jpg',
      offer: 'Farm Fresh Tomatoes 18% OFF',
      price: 33,
      originalPrice: 40,
      offerPercent: 18,
    },
  ];

  // Product data for Slick Slider (fruits)
  const slickSliderProducts = [
    {
      id: 'apple',
      name: 'Apple',
      image: 'https://images.unsplash.com/photo-1567306226416-28f0efdc88ce',
    },
    {
      id: 'banana',
      name: 'Banana',
      image: 'https://www.jiomart.com/images/product/original/590000454/banana-robusta-1-kg-product-images-o590000454-p590000454-0-202410011654.jpg?im=Resize=(420,420)',
    },
    {
      id: 'grapes',
      name: 'Grapes',
      image: 'https://www.shysha.in/wp-content/uploads/2022/12/Grape-Seed-less-White-600x419.jpg',
    },
    {
      id: 'orange',
      name: 'Orange',
      image: 'https://plantskingdom.in/cdn/shop/products/exoticflorakinnow.jpg?v=1657427218&width=1445',
    },
    {
      id: 'pineapple',
      name: 'Pineapple',
      image: 'https://images.immediate.co.uk/production/volatile/sites/30/2024/06/Pineapple-01-5562ee3.jpg',
    },
    {
      id: 'watermelon',
      name: 'Watermelon',
      image: 'https://www.euroschoolindia.com/blogs/wp-content/uploads/2023/11/how-watermelon-can-help-keep-kids-hydrated-jpg.webp',
    },
    {
      id: 'mango',
      name: 'Mango',
      image: 'https://www.fortheloveofnature.in/cdn/shop/products/Mangiferaindica-Priyur_Mango_1.jpg?v=1640246617',
    },
    {
      id: 'kiwi',
      name: 'Kiwi',
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS0ldxcNoF34BRrO8zaBM7S4mcjRIXV3VF0gw&s',
    },
    {
      id: 'strawberry',
      name: 'Strawberry',
      image: 'https://im.pluckk.in/unsafe/1920x0/uploads/30300-2.png',
    },
    {
      id: 'pomegranate',
      name: 'Pomegranate',
      image: 'https://toneopeats.com/_next/image?url=https%3A%2F%2Ftoneopeats-strapi-prod.s3.ap-south-1.amazonaws.com%2FPomegranate_Benefits_1c9932b0cc.jpg&w=1920&q=75',
    },
  ];

  // State for product quantities
  const [productQuantities, setProductQuantities] = useState({});

  // Membership state
  const membershipTypes = [
    { key: 'premium', label: 'Premium', icon: 'fa-crown' },
    // { key: 'plus', label: 'Fruits Plus', icon: 'fa-star' },
    // { key: 'explore', label: 'Fruits Explore', icon: 'fa-compass' },
  ];
  const [membershipIndex, setMembershipIndex] = useState(0);
  const currentMembership = membershipTypes[membershipIndex];
  const handleSwitchMembership = () => {
    setMembershipIndex((prev) => (prev + 1) % membershipTypes.length);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setBgIndex((prev) => (prev + 1) % bgImages.length);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  // Auto-close mic modal after 2s if successful speech
  useEffect(() => {
    if (showMicModal && micResult && !micResult.startsWith('Voice recognition error')) {
      const timer = setTimeout(() => {
        setShowMicModal(false);
        setMicListening(false);
        setMicResult('');
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [showMicModal, micResult]);

  // Notification dropdown handler
  const handleNotificationClick = () => {
    setShowNotificationDropdown((prev) => !prev);
  };

  // Voice search handler (for header and hero)
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
      if (heroSearchInputRef.current) heroSearchInputRef.current.value = transcript;
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

  const handleAddToCart = (id) => {
    setProductQuantities((prev) => ({ ...prev, [id]: 1 }));
  };
  const handleIncrement = (id) => {
    setProductQuantities((prev) => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  };
  const handleDecrement = (id) => {
    setProductQuantities((prev) => {
      const current = prev[id] || 0;
      if (current <= 1) {
        const updated = { ...prev };
        delete updated[id];
        return updated;
      }
      return { ...prev, [id]: current - 1 };
    });
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

  // Auto-slide for On Sale section
  useEffect(() => {
    const autoSlide = setInterval(() => {
      setOnSaleIndex((prev) => (prev + 1) % recommendedProducts.length);
    }, 3500);
    return () => clearInterval(autoSlide);
  }, [recommendedProducts.length]);


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
        {/* --- SLIDER SECTION (Hero/Banner) --- */}
        <div className="hero-section-container">
        <section className="hero-section" style={{ backgroundImage: `url(${bgImages[bgIndex]})` }}>
          <div className="hero-overlay">
            {/* <div className="hero-top-link">
              <span className="play-icon">▶</span> Learn about FreshMart.com
            </div> */}
            <h1 className="hero-title custom-hero-title">India's #1 B2B ecommerce platform</h1>
            <div className="hero-subtitle">Fruits, Vegetables & More</div>
            <div className="hero-search-bar">
              <input
                type="text"
                placeholder="Search for Items"
                value={searchText}
                ref={heroSearchInputRef}
                onChange={e => setSearchText(e.target.value)}
              />
              <button className="mic-btn" title="Voice Search" onClick={handleVoiceSearch}>
                <i className="fa fa-microphone"></i>
              </button>
              <button className="search-btn"><i className="fa fa-search"></i> Search</button>
            </div>
            <div className="frequently-searched">
              <span className="freq-label">Popular categories:</span>
              <span className="freq-pill" onClick={() => setSearchText('Fruits')}>Fruits</span>
              <span className="freq-pill" onClick={() => setSearchText('Vegetables')}>Vegetables</span>
              <span className="freq-pill" onClick={() => setSearchText('Electronics')}>Electronics</span>
              <span className="freq-pill" onClick={() => setSearchText('Home Essentials')}>Home Essentials</span>
            </div>
          </div>
        </section>
        </div>

        {/* --- SHOP BY CATEGORY CARDS SECTION --- */}
        <div className="category-section">
          <h2 className="category-title">Shop by Category</h2>
          <div className="category-cards">
            {[
              {
                name: 'Fruits & Vegetables',
                image: 'https://www.lalpathlabs.com/blog/wp-content/uploads/2019/01/Fruits-and-Vegetables.jpg',
                category: 'Fruits & Vegetables',
              },
              {
                name: 'Bakery & Dairy',
                image: 'https://www.shutterstock.com/image-photo/bread-milk-on-table-260nw-1179049846.jpg',
                category: 'Bakery & Dairy',
              },
              {
                name: 'Hot & Cold Beverages',
                image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSsJlrWY1X4eLvRUZhZAG50RtYlwBmJFFDUxA&s',
                category: 'Hot & Cold Beverages', 
              },
              {
                name: 'Frozen Foods',
                image: 'https://www.financialexpress.com/wp-content/uploads/2024/04/Shailja-Tiwari-2024-04-05T083242.139.png',
                category:'Frozen Foods',
              },
              {
                name: 'Chocolates & Ice Creams',
                image: 'https://i.pinimg.com/736x/99/ff/4a/99ff4a9612558f8f21e7990848ef00d0.jpg',
                category:'Chocolates & Ice Creams',
              },
              {
                name: 'Masalas & Dry Fruits',
                image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcREnlxT79VluTAKUWUk9M1Pvq2pKJfGryhiCw&s',
                category:'Masalas & Dry Fruits',
              },
              {
                name: 'Chips & Namkeen',
                image: 'https://m.media-amazon.com/images/I/81wz+n636HL._UF350,350_QL80_.jpg',
                category:'Chips & Namkeen',
              },
              {
                name: 'Bath & Body',
                image: 'https://m.media-amazon.com/images/I/61rCCuSH2aL.jpg',
                category:'Bath & Body',
              },
              {
                name: 'Eggs & Meat',
                image: 'https://www.shutterstock.com/image-photo/balanced-diet-cooking-culinary-food-260nw-300553067.jpg',
                category:'Eggs & Meat',
              },
              {
                name: 'Hygiene',
                image: 'https://media.istockphoto.com/id/147280026/photo/collection-of-personal-hygiene-products.jpg?s=612x612&w=0&k=20&c=4E7B2HBjPEoymkbZmExNnfyRL7D2GTqAK5gWzz6jUv0=',
                category:'Hygiene',
              },
            ].map((cat, idx) => (
              <div
                className="category-card"
                key={cat.name}
                onClick={cat.category ? () => navigate('/products', { state: { category: cat.category } }) : undefined}
                style={cat.category ? { cursor: 'pointer' } : {}}
              >
                <img src={cat.image} alt={cat.name} className="category-img" />
                <div className="category-name">{cat.name}</div>
              </div>
            ))}
          </div>
        </div>



        {/* --- ON SALE FULL-WIDTH SLIDESHOW SECTION --- */}
        <div className="on-sale-fw-section">
          <h2 className="on-sale-fw-title">On Sale</h2>
          <div className="on-sale-fw-slider full-bg-sale-slider" style={{position:'relative', overflow:'hidden'}}>
            {recommendedProducts.length > 0 && (
              <div
                className={
                  `custom-sale-slide sale-animate-bg on-sale-fade-anim${onSaleIndex % 2 === 0 ? ' fadein-left' : ' fadein-right'}`
                }
                style={{
                  minHeight: 340,
                  borderRadius: 18,
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'stretch',
                  justifyContent: 'center',
                  boxShadow: '0 2px 18px rgba(35,41,70,0.13)',
                  overflow: 'hidden',
                  background: '#fff',
                }}
              >
                <div className="custom-sale-img-col sale-img-anim" style={{flex: '0 0 60%', minHeight: 340, background: '#f4f6fa', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                  <img
                    src={recommendedProducts[onSaleIndex].image}
                    alt={recommendedProducts[onSaleIndex].name}
                    className="custom-sale-img"
                    style={{width: '100%', height: '100%', objectFit: 'cover', borderRadius: 0, display: 'block', transition: 'transform 0.7s cubic-bezier(0.4,0,0.2,1), opacity 0.7s'}}
                  />
                  {/* <span className="custom-sale-badge sale-badge-animate" style={{position:'absolute', left: 32, top: 32, zIndex: 2, animation: 'badgeSlideIn 0.8s'}}>
                    {recommendedProducts[onSaleIndex].offerPercent}% OFF
                  </span> */}
                </div>
                <span
                  className="custom-sale-badge sale-badge-animate"
                  style={{position:'absolute', left: 32, top: 32, zIndex: 2, animation: 'badgeSlideIn 0.8s'}}
                >
                  {recommendedProducts[onSaleIndex].offerPercent}% OFF
                </span>
                <div
                  className={
                    `custom-sale-text-col sale-text-animate on-sale-fade-anim${onSaleIndex % 2 === 0 ? ' fadein-right' : ' fadein-left'}`
                  }
                  style={{
                    borderRadius: 18,
                    margin: '32px 48px 32px 0',
                    padding: '36px 36px 36px 36px',
                    minWidth: 340,
                    maxWidth: 420,
                    position: 'relative',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                  }}
                >
                  <div className="custom-sale-name" style={{fontSize:'2.5rem', fontWeight:900, color:'#ff6f00', marginBottom:18, lineHeight:1.1, textShadow:'0 2px 8px rgba(0,0,0,0.10)'}}>
                    {recommendedProducts[onSaleIndex].name}
                  </div>
                  <div className="custom-sale-offer" style={{fontSize:'1.2rem', color:'#232946', fontWeight:700, marginBottom:12}}>
                    {recommendedProducts[onSaleIndex].offer}
                  </div>
                  <div className="on-sale-fw-price-row" style={{marginBottom:12}}>
                    <span className="on-sale-fw-price" style={{fontSize:'1.3rem', fontWeight:800, color:'#232946'}}>
                      ₹{recommendedProducts[onSaleIndex].price}
                    </span>
                    <span className="on-sale-fw-original-price" style={{fontSize:'1.1rem', color:'#888', textDecoration:'line-through', marginLeft:10}}>
                      ₹{recommendedProducts[onSaleIndex].originalPrice}
                    </span>
                  </div>
                  <div className="custom-sale-details" style={{fontSize:'1.08rem', color:'#393e6a', marginBottom:18, minHeight: '4.5em', lineHeight:'1.3'}}>
                    {(() => {
                      const details = {
                        chocolates: 'Indulge in our premium chocolates, crafted for the perfect gift or a sweet treat. Rich, smooth, and irresistible, they are sure to delight your senses and make every moment special.',
                        icecreams: 'Beat the heat with our delicious ice creams! Creamy, flavorful, and made with the finest ingredients, they are the perfect way to cool down and enjoy a refreshing dessert any time.',
                        pineapple: 'Enjoy the tropical taste of our fresh pineapples, handpicked for juiciness and flavor. Perfect for snacking, desserts, or adding a zesty twist to your favorite recipes.',
                        orange: 'Boost your health with vitamin C rich oranges. Juicy, tangy, and full of natural goodness, they are ideal for juices, salads, or a quick, healthy snack on the go.',
                        tomato: 'Savor the freshness of farm-picked tomatoes, ideal for salads, cooking, and sauces. Packed with nutrients and flavor, they bring a burst of color and taste to every meal.'
                      };
                      return details[recommendedProducts[onSaleIndex].id] || 'Best quality product at a great price. Fresh, delicious, and delivered to your door. Order now and experience the difference!';
                    })()}
                  </div>
                  <button
                    className="custom-sale-goto-btn"
                    style={{position: 'relative', right: 0, marginLeft: 'auto', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '8px', padding: '9px 28px', fontWeight: 700, fontSize: '1.05rem', cursor: 'pointer', boxShadow: '0 1px 4px rgba(37,99,235,0.10)', minWidth: 'auto', marginTop: 10}}
                    onClick={() => navigate('/products', { state: { productName: recommendedProducts[onSaleIndex].name } })}
                  >
                    Explore Product
                  </button>
                </div>
                {/* Prev/Next arrows only on hover */}
                <button
                  className="on-sale-fw-arrow left sale-arrow-hover"
                  onClick={() => setOnSaleIndex((prev) => (prev - 1 + recommendedProducts.length) % recommendedProducts.length)}
                  aria-label="Previous"
                >
                  <i class='fas fa-angle-left'></i>
                </button>
                <button
                  className="on-sale-fw-arrow right sale-arrow-hover"
                  onClick={() => setOnSaleIndex((prev) => (prev + 1) % recommendedProducts.length)}
                  aria-label="Next"
                >
                  <i class='fas fa-angle-right'></i>
                </button>
              </div>
            )}
          </div>
        </div>

                {/* Slick Slider for Fruits */}
      <div className="fruits-slick-slider" >
          <Slider
            dots={false}
            arrows={false}
            infinite={true}
            speed={200}
            slidesToShow={sidebarOpen ? 7 : 8}
            slidesToScroll={1}
            autoplay={true}
            autoplaySpeed={1800}
            responsive={[
              { breakpoint: 1400, settings: { slidesToShow: 6 } },
              { breakpoint: 1100, settings: { slidesToShow: 4 } },
              { breakpoint: 900, settings: { slidesToShow: 3 } },
              { breakpoint: 600, settings: { slidesToShow: 2 } }
            ]}
          >
            {slickSliderProducts.map(product => (
              <div key={product.id} className="fruit-slick-card"  onClick={() => navigate('/products', { state: { productName: product.name } })}  >
                <img
                  src={product.image}
                  alt={product.name}
                  className="fruit-slick-img"
                />
                <div className="fruit-slick-name">
                  {product.name}
                </div>
              </div>
            ))}
          </Slider>
        </div>

        {/* --- DASHBOARD CONTENT (Other content can go here) --- */}
        <section className="dashboard-content">
          {/* Dashboard content goes here */}
        </section>

        {/* --- RECOMMENDED FOR YOU CARDS SECTION --- */}
        <div className="recommended-section">
          <h2 className="recommended-title">Recommended for you</h2>
          <div className="recommended-cards">
            {recommendedProducts.map(product => (
              <div className="recommended-card" key={product.id}>
                <div className="offer-badge">{product.offerPercent}% OFF</div>
                <img src={product.image} alt={product.name} className="recommended-img" />
                {!productQuantities[product.id] && (
                  <button className="add-btn" onClick={() => handleAddToCart(product.id)}>
                    <i className="fa fa-plus"></i>
                  </button>
                )}
                <div className="recommended-qty-row">
                    {productQuantities[product.id] ? (
                      <div className="qty-controls">
                        <button className="qty-btn" onClick={() => handleDecrement(product.id)}>-</button>
                        <span className="qty-value">{productQuantities[product.id]}</span>
                        <button className="qty-btn" onClick={() => handleIncrement(product.id)}>+</button>
                      </div>
                    ) : null}
                  </div>
                <div className="recommended-info">
                  <div className="recommended-name">{product.name}<span className="recommended-unit">({product.unit})</span> </div> 
                  {/* Style .recommended-unit in Dashboard.css */}
                  <div className="recommended-offer">{product.offer}</div>

                  <div className="recommended-price-row">
                    <span className="recommended-price">₹{product.price}</span>
                    <span className="recommended-original-price">₹{product.originalPrice}</span>
                    <button className="recommended-cart-btn" onClick={() => handleAddToCart(product.id)} title="Add to Cart">
                      <i className="fa fa-shopping-cart"></i>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* --- MONSOON ESSENTIALS CARDS SECTION --- */}
        <div className="monsoon-section">
          <h2 className="monsoon-title">Monsoon Essentials</h2>
          <div className="monsoon-cards">
            {[
              {
                name: 'Umbrella',
                image: 'https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcTaj2u_WxywQx8Qyr4IhXmiuB3ggD19YG9_DKEBwKYD_qO5n1HR1xyhkHyFCPv6e1oew9w-4tjTDjb6dDjyPp47TusgwC5tTkiAMs1b4qls-eNM5d6gaZzk',
              },
              {
                name: 'Raincoat',
                image: 'https://toyshine.in/cdn/shop/files/1_resize_c71de131-aae0-4aea-8f4a-deb7ceab0646_720x.jpg?v=1695107554',
              },
              {
                name: 'Lights',
                image: 'https://www.blockbluelight.com.au/cdn/shop/articles/a112A59ssss88_1000x.jpg?v=1645130995',
              },
              {
                name: 'Waterproof Shoes',
                image: 'https://www.solereview.com/wp-content/uploads/2023/05/Salomon_Speedcross_6_Gore_Tex_in_water.jpg',
              },
              {
                name: 'Mosquito Repellent',
                image: 'https://m.media-amazon.com/images/I/61eQx9IZAJL._SL1500_.jpg',
              },
            ].map((item, idx) => (
              <div className="monsoon-card" key={item.name}>
                <img src={item.image} alt={item.name} className="monsoon-img" />
                <div className="monsoon-name">{item.name}</div>
              </div>
            ))}
          </div>
        </div>

        {/* --- BEST SELLERS CARDS SECTION --- */}
        <div className="bestseller-section">
          <h2 className="bestseller-title">Best Sellers</h2>
          <div className="bestseller-cards">
            {[
              {
                id: 'fruits',
                name: 'Fruits',
                image: 'https://www.lalpathlabs.com/blog/wp-content/uploads/2019/01/Fruits-and-Vegetables.jpg',
                offer: 'Fresh Fruits 10% OFF',
                price: 120,
                originalPrice: 135,
                offerPercent: 10,
              },
              {
                id: 'icecreams',
                name: 'Ice Creams',
                image: 'https://b.zmtcdn.com/data/pictures/chains/7/90007/79ba091cb3f65e22ab935a7e9708185d.jpg',
                offer: 'Buy 1 Get 1 Free!',
                price: 149,
                originalPrice: 199,
                offerPercent: 25,
              },
              {
                id: 'greenleaves',
                name: 'Green Leaves',
                image: 'https://www.ugaoo.com/cdn/shop/articles/shutterstock_394590805.jpg?v=1661854121',
                offer: 'Leafy Greens 15% OFF',
                price: 60,
                originalPrice: 70,
                offerPercent: 15,
              },
              {
                id: 'mobile',
                name: 'Mobile',
                image: 'https://etimg.etb2bimg.com/photo/98913352.cms',
                offer: 'Latest Mobiles 5% OFF',
                price: 15999,
                originalPrice: 16999,
                offerPercent: 5,
              },
              {
                id: 'meat',
                name: 'Meat',
                image: 'https://www.shutterstock.com/image-photo/balanced-diet-cooking-culinary-food-260nw-300553067.jpg',
                offer: 'Fresh Meat 12% OFF',
                price: 399,
                originalPrice: 455,
                offerPercent: 12,
              },
            ].map(product => (
              <div className="bestseller-card" key={product.id}>
                <div className="offer-badge">{product.offerPercent}% OFF</div>
                <img src={product.image} alt={product.name} className="bestseller-img" />
                {!productQuantities[product.id] && (
                  <button className="add-btn" onClick={() => handleAddToCart(product.id)}>
                    <i className="fa fa-plus"></i>
                  </button>
                )}
                <div className="bestseller-qty-row">
                  {productQuantities[product.id] ? (
                    <div className="qty-controls">
                      <button className="qty-btn" onClick={() => handleDecrement(product.id)}>-</button>
                      <span className="qty-value">{productQuantities[product.id]}</span>
                      <button className="qty-btn" onClick={() => handleIncrement(product.id)}>+</button>
                    </div>
                  ) : null}
                </div>
                <div className="bestseller-info">
                  <div className="bestseller-name">{product.name}</div>
                  <div className="bestseller-offer">{product.offer}</div>
                  <div className="bestseller-price-row">
                    <span className="bestseller-price">₹{product.price}</span>
                    <span className="bestseller-original-price">₹{product.originalPrice}</span>
                    <button className="recommended-cart-btn" onClick={() => handleAddToCart(product.id)} title="Add to Cart">
                      <i className="fa fa-shopping-cart"></i>
                    </button>
                  </div>
                </div>
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
    </div>
  );
}

export default Home;