import React, { useState, useEffect, useRef } from 'react';
import './Cart.css';
import '../Product/Product.css';
import { useNavigate, Link } from 'react-router-dom';
import allProducts from '../Product/productsData';

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
  { to: '/security', image: require('../Images/verified-s.png'), label: 'Security', className:'nav-link' },
  { to: '/help', image: require('../Images/help-c.png'), label: 'Help Center', className:'nav-link' },
];

const allCoupons = [
  { code: 'SAVE10', desc: 'Save ₹10 on orders above ₹100', discount: 10, min: 100 },
  { code: 'FRESH20', desc: '20% off on Fruits & Vegetables', discount: 0.2, category: 'Fruits & Vegetables' },
  { code: 'FREESHIP', desc: 'Free Delivery', freeDelivery: true },
  { code: 'WELCOME25', desc: 'Flat ₹25 off for new users', discount: 25, min: 0 },
];

const deliveryFee = 30;
const GST_RATE = 0.05;

const Cart = () => {
  const [cart, setCart] = useState({});
  const [products, setProducts] = useState([]);
  const [coupon, setCoupon] = useState(null);
  const [tip, setTip] = useState(0);
  const [address, setAddress] = useState('123 Main Street, City, 123456');
  const [showCouponList, setShowCouponList] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showNotificationDropdown, setShowNotificationDropdown] = useState(false);
  const [paymentMode, setPaymentMode] = useState('UPI');
  const [upiId, setUpiId] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCVV, setCardCVV] = useState('');
  const [cardName, setCardName] = useState('');
  const [showOrderModal, setShowOrderModal] = useState(false);
  const navigate = useNavigate();
  const [showSummary, setShowSummary] = useState(false);
  const [selectedTip, setSelectedTip] = useState(0);
  const [couponError, setCouponError] = useState("");
  const [addressModalOpen, setAddressModalOpen] = useState(false);
  const [addressType, setAddressType] = useState('Home');
  const [addressTypeOther, setAddressTypeOther] = useState('');
  const [addressPhone, setAddressPhone] = useState('9876543210');
  const [addressDoorNo, setAddressDoorNo] = useState('12A');
  const [addressStreet, setAddressStreet] = useState('Sunshine Apartments, 2nd Line, MG Street');
  const [addressPin, setAddressPin] = useState('123456');
  const [addressLandmark, setAddressLandmark] = useState('Near City Park');
  const [addressError, setAddressError] = useState("");
  const [addressSaved, setAddressSaved] = useState(false);
  const [upiApp, setUpiApp] = useState('');

  useEffect(() => {
    const cartData = JSON.parse(localStorage.getItem('cart') || '{}');
    setCart(cartData);
    setProducts(allProducts);
  }, []);

  // Get cart items with product info
  const cartItems = Object.entries(cart).map(([id, qty]) => {
    const product = products.find(p => p.id === id);
    return product ? { ...product, qty } : null;
  }).filter(Boolean);

  // Cart summary
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);
  let discount = 0;
  let appliedCoupon = null;
  if (coupon) {
    if (coupon.discount) {
      if (coupon.category) {
        const catTotal = cartItems.filter(i => i.category === coupon.category).reduce((sum, i) => sum + i.price * i.qty, 0);
        discount = coupon.discount < 1 ? Math.round(catTotal * coupon.discount) : coupon.discount;
      } else if (!coupon.min || subtotal >= coupon.min) {
        discount = coupon.discount < 1 ? Math.round(subtotal * coupon.discount) : coupon.discount;
      }
    }
    appliedCoupon = coupon;
  }
  const gst = Math.round((subtotal - discount) * GST_RATE);
  const delivery = appliedCoupon && appliedCoupon.freeDelivery ? 0 : deliveryFee;
  const total = subtotal - discount + gst + delivery + Number(tip || 0);

  // Quantity handlers
  const handleQty = (id, delta) => {
    setCart(prev => {
      const next = { ...prev };
      next[id] = (next[id] || 0) + delta;
      if (next[id] <= 0) delete next[id];
      localStorage.setItem('cart', JSON.stringify(next));
      return next;
    });
  };
  const handleDelete = id => {
    setCart(prev => {
      const next = { ...prev };
      delete next[id];
      localStorage.setItem('cart', JSON.stringify(next));
      return next;
    });
  };
  const handleApplyCoupon = c => {
    // Check if coupon is applicable
    let applicable = true;
    if (c.min && subtotal < c.min) applicable = false;
    if (c.category) {
      const catTotal = cartItems.filter(i => i.category === c.category).reduce((sum, i) => sum + i.price * i.qty, 0);
      if (catTotal === 0) applicable = false;
    }
    if (applicable) {
      setCoupon(c);
      setShowCouponList(false);
      setCouponError("");
    } else {
      setCouponError("Coupon not applicable for your cart");
      // Do NOT apply coupon or close the list
    }
  };
  const handleNotificationClick = () => {
    setShowNotificationDropdown((prev) => !prev);
  };

  // Tip handler
  const handleTip = (amount) => {
    setTip(amount);
    setSelectedTip(amount);
  };

  // Address modal save handler
  const handleSaveAddress = () => {
    if (!addressPhone.trim() || !addressDoorNo.trim() || !addressStreet.trim() || !addressPin.trim() || !addressLandmark.trim() || (addressType === 'Other' && !addressTypeOther.trim())) {
      setAddressError("All fields are required");
      return;
    }
    setAddressModalOpen(false);
    setAddressError("");
    setAddressSaved(true);
  };

  // Address modal open handler (reset fields)
  const openNewAddressModal = () => {
    setAddressType('Home');
    setAddressTypeOther('');
    setAddressPhone('');
    setAddressDoorNo('');
    setAddressStreet('');
    setAddressPin('');
    setAddressLandmark('');
    setAddressError("");
    setAddressModalOpen(true);
    setAddressSaved(false);
  };

  return (
    <div className={`crm-dashboard${sidebarOpen ? '' : ' collapsed'}`}>
      <header className="main-header">
        <div className="header-left">
          <img src={require('../Images/unnamed.png')} alt="Logo" className="logo" />
          <button className="menu-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>
            <i className="fa fa-bars" style={{ color: '#2563eb' }}></i>
          </button>
          <span className="membership-badge premium active">
            <i className="fa fa-crown"></i> Fruits Premium
          </span>
          <button className="membership-switch-btn gold" title="Toggle Premium">
            <i className="fa fa-exchange"></i>
          </button>
        </div>
        <div className="search-bar header-search-bar">
          <span className="search-bar-icon">
            <i className="fa fa-search"></i>
          </span>
          <input
            type="text"
            placeholder="Search in cart ..."
          />
        </div>
        <div className="header-right">
          <div className="header-icon-cart" onClick={() => navigate('/cart')}  style={{ position: 'relative', cursor: 'pointer' }}>
            <img className='header-icon' src={require('../Images/Cart.png')} alt="Cart" title="Cart" />
            {cartItems.length > 0 && (
              <span className="cart-badge-count">{cartItems.length}</span>
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
      <main className="main-content cart-fullpage-bg">



      {cartItems.length === 0 ? (
        <div className="cart-empty-full cart-empty-centered">
          <img src={require('../Images/Cart.png')} alt="Empty Cart" className="cart-empty-img-big" />
          <div className="cart-empty-title">Oops! Your cart is empty.</div>
          <div className="cart-empty-desc">Looks like you haven’t added anything to your cart yet.</div>
          <button className="cart-empty-continue" onClick={() => navigate('/products')}>Shop Now</button>
        </div>
      ) : (
        <>


      <h1 className="cart-sidebyside-title"><i className="fa fa-shopping-cart"></i> Your Cart</h1>
        <div className="cart-flex-main">
          {/* LEFT SIDE */}
          <div className="cart-flex-left">
           
            {/* Cart Items */}
            {cartItems.length === 0 ? (
              <div className="cart-empty-full">
                <i className="fa fa-shopping-cart cart-empty-icon"></i>
                <div>Your cart is empty.</div>
                <button className="cart-empty-continue" onClick={() => navigate('/products')}>Continue Shopping</button>
              </div>
            ) : (
              <div className="cart-items-list">
                {cartItems.map(item => (
                  <div className="cart-item-row cart-item-card-modern" key={item.id}>
                    <img src={item.image} alt={item.name} className="cart-item-img-horizontal" />
                    <span className="cart-item-name-horizontal">{item.name}</span>
                    <div className="cart-item-qty-controls-horizontal">
                      <button onClick={() => handleQty(item.id, -1)}>-</button>
                      <span>{item.qty}</span>
                      <button onClick={() => handleQty(item.id, 1)}>+</button>
                    </div>
                    <span className="cart-item-total-horizontal">₹{item.price * item.qty}</span>
                    <button className="cart-item-delete-horizontal" onClick={() => handleDelete(item.id)} title="Remove">
                      <i className="fa fa-trash"></i>
                    </button>
                  </div>
                ))}
              </div>
            )}
            {/* Coupons Section - new modern design */}
            <div className="coupon-card-section">
              <div className="coupon-header-row-flex">
                <div>
                  <div className="coupon-header-ti">
                    <i className="fa fa-tag"></i> Coupons
                  </div>
                  <div className="coupon-subtitle">Save more with available offers!</div>
                </div>
                {!coupon ? (
                  <button className="coupon-add-btn" onClick={() => setShowCouponList(v => !v)}>
                    <i className="fa fa-plus"></i> Add Coupon
                  </button>
                ) : (
                  <div className="coupon-applied-glass">
                    <i className="fa fa-tag"></i> {coupon.code}
                    <button className="coupon-remove-btn-modern" onClick={() => setCoupon(null)} title="Remove Coupon">
                      <i className="fa fa-times"></i>
                    </button>
                  </div>
                )}
              </div>
              {couponError && (
                <div className="coupon-error-msg"><i className="fa fa-exclamation-circle"></i> {couponError}</div>
              )}
              {/* Coupon list only if no coupon is applied and showCouponList is true */}
              {!coupon && showCouponList && (
                <div className="coupon-list-modern">
                  {allCoupons.map(c => (
                    <div key={c.code} className="coupon-list-card">
                      <div>
                        <span className="coupon-code">{c.code}  </span>
                        <span className="coupon-desc">-&nbsp;&nbsp;{c.desc}</span>
                      </div>
                      <button className="coupon-apply-btn-modern" onClick={() => handleApplyCoupon(c)}>
                        <i className="fa fa-check"></i> Apply
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            {/* Address Section - new design */}
            <div className="address-card-section">
              <div className="address-card-header-row">
                <div className="address-card-title"><i className="fa fa-map-marker-alt"></i> Delivery Address</div>
                <button className="address-add-btn-a" onClick={openNewAddressModal}>
                  <i className="fa fa-plus"></i> Add Address
                </button>
              </div>
              {addressSaved ? (
                <div className="address-card">
                  <div className="address-card-info">
                    <div className="address-type-pill">{addressType === 'Other' ? addressTypeOther : addressType}</div>
                    <div className="address-card-phone">{addressPhone}</div>
                    <div className="address-card-value">
                      {addressDoorNo}, {addressStreet}<br/>
                      {addressLandmark}<br/>
                      Pin: {addressPin}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="address-card address-card-placeholder">
                  <div className="address-card-placeholder-content">
                    <i className="fa fa-map-marker-alt address-placeholder-icon"></i>
                    <div className="address-placeholder-text">No address added yet.<br/>Please add your delivery address.</div>
                  </div>
                </div>
              )}
            </div>
            {/* Address Modal */}
            {addressModalOpen && (
              <div className="address-modal-overlay">
                <div className="address-modal">
                  <div className="address-modal-title"><i className="fa fa-map-marker-alt"></i> Add New Address</div>
                  <div className="address-modal-form">
                    <input
                      className="address-modal-input"
                      type="text"
                      placeholder="Phone Number"
                      value={addressPhone}
                      onChange={e => setAddressPhone(e.target.value)}
                    />
                    <input
                      className="address-modal-input"
                      type="text"
                      placeholder="Door No."
                      value={addressDoorNo}
                      onChange={e => setAddressDoorNo(e.target.value)}
                    />
                    <input
                      className="address-modal-input"
                      type="text"
                      placeholder="Apartment Name, Line No, Street Name"
                      value={addressStreet}
                      onChange={e => setAddressStreet(e.target.value)}
                    />
                    <input
                      className="address-modal-input"
                      type="text"
                      placeholder="Pin Code"
                      value={addressPin}
                      onChange={e => setAddressPin(e.target.value)}
                    />
                    <input
                      className="address-modal-input"
                      type="text"
                      placeholder="Nearby Landmark"
                      value={addressLandmark}
                      onChange={e => setAddressLandmark(e.target.value)}
                    />
                    <div className="address-type-btns">
                      {['Home', 'Work', 'Other'].map(type => (
                        <button
                          key={type}
                          className={`address-type-btn${addressType === type ? ' selected' : ''}`}
                          onClick={e => { e.preventDefault(); setAddressType(type); }}
                        >
                          {type}
                        </button>
                      ))}
                      </div>
                      {addressType === 'Other' && (
                        <input
                          className="address-modal-input address-type-other-input"
                          type="text"
                          placeholder="Enter type (e.g. Grandma's)"
                          value={addressTypeOther}
                          onChange={e => setAddressTypeOther(e.target.value)}
                        />
                      )}
                    
                    {addressError && <div className="address-modal-error"><i className="fa fa-exclamation-circle"></i> {addressError}</div>}
                  </div>
                  <div className="address-modal-actions">
                    <button className="address-modal-save" onClick={handleSaveAddress}><i className="fa fa-save"></i> Save</button>
                    <button className="address-modal-cancel" onClick={() => { setAddressModalOpen(false); setAddressError(""); }}><i className="fa fa-times"></i> Cancel</button>
                  </div>
                </div>
              </div>
            )}
          </div>
          {/* RIGHT SIDE */}
          <div className="cart-flex-right">
            {/* Tip Section - stays at the top */}
            <div className="cart-tip-section-modern">
              <label className='tip-your' ><i className="fa fa-hand-holding-usd"></i> Tip your delivery partner</label>
              <div className="cart-tip-buttons">
                {[10, 20, 50].map(amount => (
                  <button
                    key={amount}
                    className={`cart-tip-btn${selectedTip == amount ? ' selected' : ''}`}
                    onClick={() => handleTip(amount)}
                  >
                    ₹{amount}
                  </button>
                ))}
                {/* <input
                  type="number"
                  min="0"
                  className="cart-tip-custom"
                  value={tip}
                  onChange={e => handleTip(Number(e.target.value))}
                  placeholder="Custom"
                /> */}
              </div>
            </div>
            {/* Bill Summary Dropdown */}
            <div className="cart-summary-dropdown">
              <button className="cart-summary-dropdown-btn" onClick={() => setShowSummary(s => !s)}>
              <i className={`fa fa-chevron-${showSummary ? 'up' : 'down'}`}></i>  <i className="fa fa-file-invoice"></i>  Bill Summary
              </button>
              {showSummary && (
                <div className="cart-summary-dropdown-content">
                  <div className="cart-summary-row"><span>Subtotal</span><span>₹{subtotal}</span></div>
                  {discount > 0 && <div className="cart-summary-row"><span>Discount</span><span>-₹{discount}</span></div>}
                  <div className="cart-summary-row"><span>GST (5%)</span><span>₹{gst}</span></div>
                  <div className="cart-summary-row"><span>Delivery Fee</span><span>₹{delivery}</span></div>
                  {tip > 0 && <div className="cart-summary-row"><span>Tip</span><span>₹{tip}</span></div>}
                </div>
              )}
            </div>
            {/* Payment Modes - new design */}
            <div className="cart-payment-section-modern">
              <div className="cart-payment-label-centered"><i className="fa fa-credit-card"></i> Select Payment Mode</div>
              <div className="cart-payment-modes-modern">
                {['UPI', 'Card', 'Cash'].map(mode => (
                  <button
                    key={mode}
                    className={`cart-payment-btn${paymentMode === mode ? ' selected' : ''}`}
                    onClick={() => setPaymentMode(mode)}
                  >
                    {mode === 'Cash' ? 'Cash on Delivery' : mode}
                  </button>
                ))}
              </div>
              {/* Payment Details */}
              {paymentMode === 'UPI' && (
                <div className="cart-payment-details">
                  <div className="cart-upi-apps-row" style={{ display: 'flex', gap: '28px', marginBottom: '18px', justifyContent: 'center' }}>
                    <label style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', fontSize: '1.1rem', padding: '8px 12px' }}>
                      <input
                        type="radio"
                        name="upiApp"
                        value="GPay"
                        checked={upiApp === 'GPay'}
                        onChange={() => setUpiApp('GPay')}
                        className="large-radio"
                        style={{ marginBottom: '10px' }}
                      />
                      <img src={require('../Images/Gpay.webp')} alt="GPay" style={{ width: 72, height: 72, objectFit: 'contain', marginBottom: 8 }} />
                      <span>GPay</span>
                    </label>
                    <label style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', fontSize: '1.1rem', padding: '8px 12px' }}>
                      <input
                        type="radio"
                        name="upiApp"
                        value="PhonePe"
                        checked={upiApp === 'PhonePe'}
                        onChange={() => setUpiApp('PhonePe')}
                        className="large-radio"
                        style={{ marginBottom: '10px' }}
                      />
                      <img src={require('../Images/Phonepe.png')} alt="PhonePe" style={{ width: 72, height: 72, objectFit: 'contain', marginBottom: 8 }} />
                      <span>PhonePe</span>
                    </label>
                    <label style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', fontSize: '1.1rem', padding: '8px 12px' }}>
                      <input
                        type="radio"
                        name="upiApp"
                        value="Paytm"
                        checked={upiApp === 'Paytm'}
                        onChange={() => setUpiApp('Paytm')}
                        className="large-radio"
                        style={{ marginBottom: '10px' }}
                      />
                      <img src={require('../Images/Paytm.png')} alt="Paytm" style={{ width: 72, height: 72, objectFit: 'contain', marginBottom: 8 }} />
                      <span>Paytm</span>
                    </label>
                  </div>
                  <input
                    className="cart-payment-input"
                    type="text"
                    placeholder="Enter UPI ID"
                    value={upiId}
                    onChange={e => setUpiId(e.target.value)}
                  />
                  {/* <div style={{ color: '#888', fontSize: '0.95rem', margin: '8px 0' }}>
                    DEBUG: upiApp = {upiApp}, upiId = {upiId}
                  </div> */}
                  <button
                    className="cart-payment-pay-btn"
                    onClick={() => {
                      if (!upiApp && !upiId.trim()) {
                        alert('Please select a UPI app or enter your UPI ID to proceed.');
                        return;
                      }
                      if (upiApp) {
                        alert(`Opening ${upiApp} app for payment...`);
                      } else if (upiId.trim()) {
                        alert('Proceeding with UPI ID payment...');
                      }
                      setShowOrderModal(true);
                    }}
                    disabled={!upiApp && !upiId.trim()}
                  >
                    Pay ₹{total}
                  </button>
                </div>
              )}
              {paymentMode === 'Card' && (
                <div className="cart-payment-details">
                  <input
                    className="cart-payment-input"
                    type="text"
                    placeholder="Card Number"
                    value={cardNumber}
                    onChange={e => setCardNumber(e.target.value)}
                  />
                  <div className="cart-payment-card-row">
                    <input
                      className="cart-payment-input"
                      type="text"
                      placeholder="MM/YY"
                      value={cardExpiry}
                      onChange={e => setCardExpiry(e.target.value)}
                    />
                    <input
                      className="cart-payment-input"
                      type="text"
                      placeholder="CVV"
                      value={cardCVV}
                      onChange={e => setCardCVV(e.target.value)}
                    />
                  </div>
                  <input
                    className="cart-payment-input"
                    type="text"
                    placeholder="Name on Card"
                    value={cardName}
                    onChange={e => setCardName(e.target.value)}
                  />
                  <button className="cart-payment-pay-btn" onClick={() => setShowOrderModal(true)} disabled={!cardNumber.trim() || !cardExpiry.trim() || !cardCVV.trim() || !cardName.trim()}>
                    Pay ₹{total}
                  </button>
                </div>
              )}
              {paymentMode === 'Cash' && (
                <div className="cart-payment-details">
                  <button className="cart-payment-pay-btn" onClick={() => setShowOrderModal(true)}>
                    Proceed & Pay ₹{total}
                  </button>
                </div>
              )}
            </div>
            {/* Order Confirmation Modal */}
            {showOrderModal && (
              <div className="order-modal-overlay">
                <div className="order-modal">
                  <div className="order-modal-icon"><i className="fa fa-check-circle"></i></div>
                  <div className="order-modal-title">Your order is on the way!</div>
                  <button className="order-modal-close-p" onClick={() => setShowOrderModal(false)}><i className="fa fa-times"></i> Close</button>
                </div>
              </div>
            )}
            {/* Bottom: Total and Pay Button */}
            {/* <div className="cart-total-bottom">
              <span className="cart-total-value">₹{total}</span>
              <button className="cart-checkout-btn">Proceed to Pay</button>
            </div> */}
          </div>
        </div>
        </>
      )}
      {/* End of cart items */}
      </main>
    </div>
  );
};

export default Cart;