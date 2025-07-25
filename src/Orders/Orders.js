import React, { useState, useRef } from 'react';
import '../Dashboard/Dashboard.css';
import './Orders.css';
import { Link, useNavigate } from 'react-router-dom';
import orderimg from '../Images/order.png';

const navLinks = [
  { to: '/Home', image: require('../Images/Fahome.png'), label: 'Home', className:'nav-link ' },
  { to: '/products', image: require('../Images/Fabox.png'), label: 'Products', className:'nav-link' },
  { to: '/Orders', image: require('../Images/order.png'), label: 'Your Orders', className:'nav-link   link-active ' },
  { to: '/Profile', image: require('../Images/Fauser.png'), label: 'Profile' , className:'nav-link ' },
  { to: '/Wallet', image: require('../Images/wallet.png'), label: 'Wallet' , className:'nav-link ' },
  { to: '/Yourcoupons', image: require('../Images/co.png'), label: 'Your Coupons' , className:'nav-link' },
  { to: '/Yourrating', image: require('../Images/rate.png'), label: 'Your Rating', className:'nav-link ' },
  { to: '/Payment', image: require('../Images/payment.png'), label: 'Payment' , className:'nav-link' },
  { to: '/settings', image: require('../Images/settings-24.png'), label: 'Settings' , className:'nav-link' },
  { to: '/address', image: require('../Images/location.png'), label: 'Address', className:'nav-link ' },
  { to: '/help', image: require('../Images/help-c.png'), label: 'Help Center', className:'nav-link' },
];


function Orders() {
  // Get cart items count from localStorage
  const [cartCount, setCartCount] = React.useState(0);
  React.useEffect(() => {
    const cartData = JSON.parse(localStorage.getItem('cart') || '{}');
    setCartCount(Object.keys(cartData).length);
  }, []);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showNotificationDropdown, setShowNotificationDropdown] = useState(false);
  // For filter bar (pending values)
  const [pendingSearch, setPendingSearch] = useState('');
  const [pendingStatus, setPendingStatus] = useState('All');
  // For applied filters
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const navigate = useNavigate();
  const [modalOrder, setModalOrder] = useState(null);

  // Sample order data with more details
  const orders = [
    {
      id: 'ORD12345',
      date: '2024-06-10',
      time: '10:30 AM',
      status: 'Successful',
      total: 499,
      payment: 'UPI',
      address: '12A, Sunshine Apartments, City',
      pin: '123456',
      coupon: { code: 'SAVE10', desc: 'Save ₹10 on orders above ₹100', discount: 10, min: 100 },
      items: [
        { name: 'Apple', qty: 2, price: 60 },
        { name: 'Banana', qty: 1, price: 30 },
      ],
    },
    {
      id: 'ORD12346',
      date: '2024-06-09',
      time: '2:15 PM',
      status: 'Cancelled',
      total: 299,
      payment: 'Card',
      address: '45B, Green Residency, City',
      pin: '654321',
      items: [
        { name: 'Orange', qty: 3, price: 45 },
      ],
    },
    {
      id: 'ORD12347',
      date: '2024-06-08',
      time: '9:00 AM',
      status: 'Pending',
      total: 199,
      payment: 'Cash',
      address: '7C, Blue Towers, City',
      pin: '789123',
      items: [
        { name: 'Grapes', qty: 1, price: 120 },
        { name: 'Mango', qty: 2, price: 40 },
      ],
    },
    {
      id: 'ORD12348',
      date: '2024-06-07',
      time: '6:45 PM',
      status: 'Shipped',
      total: 399,
      payment: 'UPI',
      address: '22D, Lakeview Villas, City',
      pin: '321987',
      items: [
        { name: 'Pineapple', qty: 1, price: 80 },
        { name: 'Watermelon', qty: 1, price: 90 },
        { name: 'Kiwi', qty: 2, price: 114 },
      ],
    },
    {
      id: 'ORD12349',
      date: '2024-06-06',
      time: '11:20 AM',
      status: 'Delivered',
      total: 599,
      payment: 'Card',
      address: '9F, Rosewood Park, City',
      pin: '456789',
      items: [
        { name: 'Strawberry', qty: 2, price: 200 },
        { name: 'Pomegranate', qty: 1, price: 199 },
      ],
    },
  ];

  const statusOptions = ['All', 'Successful', 'Cancelled', 'Pending', 'Shipped', 'Delivered'];

  // Filtered orders (applied only when button is clicked)
  const filteredOrders = orders.filter(order => {
    const matchesStatus = statusFilter === 'All' || order.status === statusFilter;
    const matchesSearch =
      order.id.toLowerCase().includes(search.toLowerCase()) ||
      order.items.some(item => item.name.toLowerCase().includes(search.toLowerCase()));
    return matchesStatus && matchesSearch;
  });

  const handleNotificationClick = () => {
    setShowNotificationDropdown((prev) => !prev);
  };

  // Apply filters button handler
  const handleApplyFilters = () => {
    setSearch(pendingSearch);
    setStatusFilter(pendingStatus);
  };

  // Download order as text
  const handleDownloadOrder = (order) => {
    const text = `Order ID: ${order.id}\nDate: ${order.date} ${order.time}\nStatus: ${order.status}\nPayment: ${order.payment}\nAddress: ${order.address}\nPin: ${order.pin}\nItems:\n${order.items.map(i => `- ${i.name} x${i.qty} (₹${i.price})`).join('\n')}\nTotal: ₹${order.total}`;
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${order.id}.txt`;
    a.click();
    URL.revokeObjectURL(url);
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
            <i className="fa fa-crown"></i> Premium
          </span>
        </div>
        <div className="search-bar header-search-bar">
          <span className="search-bar-icon">
            <i className="fa fa-search"></i>
          </span>
          <input
            type="text"
            placeholder="Search in orders ..."
           
          />
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
        <h1 className="cart-sidebyside-titl"><span><img className='img-orders-p' src={orderimg} /></span> Your Orders</h1>
        <div className="orders-filter-bar">
          <input
            className="orders-search-input"
            type="text"
            placeholder="Search by order id or item..."
            value={pendingSearch}
            onChange={e => setPendingSearch(e.target.value)}
          />
          <select
            className="orders-status-select"
            value={pendingStatus}
            onChange={e => setPendingStatus(e.target.value)}
          >
            {statusOptions.map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
          <button className="orders-apply-btn" onClick={handleApplyFilters}>
            <i className="fa fa-filter"></i> Apply Filters
          </button>
        </div>
        <div className="orders-result-count">{filteredOrders.length} result{filteredOrders.length !== 1 ? 's' : ''} found</div>
        <div className="orders-list-modern">
          {filteredOrders.length === 0 ? (
            <div className="orders-empty">No orders found.</div>
          ) : (
            filteredOrders.map(order => (
              <div className={`order-card-modern order-${order.status.toLowerCase()}`} key={order.id}>
                <div className="order-card-modern-header">
                  <span className="order-modern-id">#{order.id}</span>
                  <span className={`order-status-pill-modern order-status-${order.status.toLowerCase()}`}>{order.status}</span>
                </div>
                <div className="order-card-modern-body">
                  <div className="order-modern-row order-modern-row-1">
                    <span className="order-modern-date"><i className="fa fa-calendar"></i> {order.date} <i className="fa fa-clock-o"></i> {order.time}</span>
                    <span className="order-modern-payment"><i className="fa fa-credit-card"></i> {order.payment}</span>
                  </div>
                  <div className="order-modern-row order-modern-row-2">
                    <span className="order-modern-address"><i className="fa fa-map-marker-alt"></i> {order.address}</span>
                    <span className="order-modern-pin"><i className="fa fa-map-pin"></i> {order.pin}</span>
                  </div>
                  <div className="order-modern-items-list">
                    <div className='order-mod'>
                    <div className='order-mod'>
                      {order.items.map((item, idx) => (
                        <span className="order-modern-item-chip" key={idx}>{item.name} x{item.qty}</span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className='order-modern-total'>
                <div className="order-modern-total-row">
                  <button className="order-view-btn-icon-modern" title="View Details" onClick={() => setModalOrder(order)}>
                        <i className="fa fa-eye"></i> &nbsp; View 
                      </button>
                    </div>
                  <div className='order-modern-total-row'>
                    <span className="order-modern-total-label">Total:</span>
                    <span className="order-modern-total-value">₹{order.total}</span>
                  </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        {/* Modal for order details */}
        {modalOrder && (
          <div className="order-modal-modern-overlay" onClick={() => setModalOrder(null)}>
            <div className="order-modal-modern" onClick={e => e.stopPropagation()}>
              <div className="order-modal-modern-header">
                <span className="order-modal-modern-title"><i className="fa fa-list"></i> Order #{modalOrder.id}</span>
                <span className={`order-status-pill-modern order-status-${modalOrder.status.toLowerCase()}`}>{modalOrder.status}</span>
                <button className="order-modal-modern-close" onClick={() => setModalOrder(null)}><i className="fa fa-times"></i></button>
              </div>
              <div className="order-modal-modern-content">
                <div className="order-modal-modern-row"><b>Date:</b> {modalOrder.date} <b>Time:</b> {modalOrder.time}</div>
                <div className="order-modal-modern-row"><b>Payment:</b> {modalOrder.payment}</div>
                <div className="order-modal-modern-row"><b>Address:</b> {modalOrder.address}</div>
                <div className="order-modal-modern-row"><b>Pin:</b> {modalOrder.pin}</div>
                <div className="order-modal-modern-row"><b>Items:</b></div>
                <table className="order-modal-modern-items-table">
                  <thead><tr><th>Item</th><th>Qty</th><th>Price</th></tr></thead>
                  <tbody>
                    {modalOrder.items.map((item, idx) => (
                      <tr key={idx}><td>{item.name}</td><td>{item.qty}</td><td>₹{item.price}</td></tr>
                    ))}
                  </tbody>
                </table>
                {/* Bill Summary */}
                <div className="order-modal-modern-bill-summary">
                  <div className="order-modal-modern-bill-title">Bill Summary</div>
                  {(() => {
                    const subtotal = modalOrder.items.reduce((sum, i) => sum + i.price * i.qty, 0);
                    let discount = 0;
                    let coupon = modalOrder.coupon;
                    if (coupon && coupon.discount) {
                      discount = coupon.discount < 1 ? Math.round(subtotal * coupon.discount) : coupon.discount;
                    }
                    const GST_RATE = 0.05;
                    const gst = Math.round((subtotal - discount) * GST_RATE);
                    const delivery = coupon && coupon.freeDelivery ? 0 : 30;
                    const total = subtotal - discount + gst + delivery;
                    return (
                      <>
                        <div className="order-modal-bill-row"><span>Subtotal</span><span>₹{subtotal}</span></div>
                        {discount > 0 && <div className="order-modal-bill-row"><span>Discount</span><span>-₹{discount}</span></div>}
                        <div className="order-modal-bill-row"><span>GST (5%)</span><span>₹{gst}</span></div>
                        <div className="order-modal-bill-row"><span>Delivery Fee</span><span>₹{delivery}</span></div>
                        {coupon && (
                          <div className="order-modal-bill-row order-modal-bill-coupon"><span>Coupon</span><span>{coupon.code} - {coupon.desc}</span></div>
                        )}
                        <div className="order-modal-bill-row order-modal-bill-total"><span>Total</span><span>₹{total}</span></div>
                      </>
                    );
                  })()}
                </div>
              </div>
              <div className="order-modal-modern-actions">
                <button className="order-modal-modern-download" onClick={() => handleDownloadOrder(modalOrder)}><i className="fa fa-download"></i> Download</button>
                <button className="order-modal-modern-close-btn" onClick={() => setModalOrder(null)}><i className="fa fa-times"></i> Close</button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default Orders;
