import React, { useState } from 'react';
import '../Dashboard/Dashboard.css';
import '../Product/Product.css';
import './Profile.css';
import { Link } from 'react-router-dom';
import sc from '../Images/s-c-removebg-preview.png';
import ss from '../Images/se-tt-removebg-preview.png';

import { useNavigate } from 'react-router-dom';

const navLinks = [
  { to: '/Home', image: require('../Images/Fahome.png'), label: 'Home', className:'nav-link ' },
  { to: '/products', image: require('../Images/Fabox.png'), label: 'Products', className:'nav-link' },
  { to: '/Orders', image: require('../Images/order.png'), label: 'Your Orders', className:'nav-link' },
  { to: '/Profile', image: require('../Images/Fauser.png'), label: 'Profile' , className:'nav-link link-active' },
  { to: '/Wallet', image: require('../Images/wallet.png'), label: 'Wallet' , className:'nav-link' },
  { to: '/Yourcoupons', image: require('../Images/co.png'), label: 'Your Coupons' , className:'nav-link' },
  { to: '/Yourrating', image: require('../Images/rate.png'), label: 'Your Rating', className:'nav-link   ' },
  { to: '/Payment', image: require('../Images/payment.png'), label: 'Payment' , className:'nav-link' },
  { to: '/settings', image: require('../Images/settings-24.png'), label: 'Settings' , className:'nav-link' },
  { to: '/address', image: require('../Images/location.png'), label: 'Address', className:'nav-link ' },
  { to: '/help', image: require('../Images/help-c.png'), label: 'Help Center', className:'nav-link' },
];

const membershipTypes = [
  { key: 'premium', label: 'Premium', icon: 'fa-crown' },
];

function Profile() {
  const navigate = useNavigate();
  // Get cart items count from localStorage
  const [cartCount, setCartCount] = React.useState(0);
  React.useEffect(() => {
    const cartData = JSON.parse(localStorage.getItem('cart') || '{}');
    setCartCount(Object.keys(cartData).length);
  }, []);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [membershipIndex, setMembershipIndex] = useState(0);
  const currentMembership = membershipTypes[membershipIndex];

  // Example user data
  const [user, setUser] = useState({
    name: 'Keerthi',
    email: 'keerthi@example.com',
    phone: '+91 98765 43210',
    address: '123, Main Street, Hyderabad, India',
    city: 'Hyderabad',
    state: 'Telangana',
    country: 'India',
    gender: 'Female',
    dob: '2002-12-22',
    image: 'https://randomuser.me/api/portraits/women/32.jpg',
  });
  const [showEditModal, setShowEditModal] = useState(false);
  const [editUser, setEditUser] = useState(user);
  const [editImagePreview, setEditImagePreview] = useState(user.image);
  const [editImageFile, setEditImageFile] = useState(null);

  const handleSwitchMembership = () => {
    setMembershipIndex((prev) => (prev + 1) % membershipTypes.length);
  };

  const openEditModal = () => {
    setEditUser(user);
    setEditImagePreview(user.image);
    setEditImageFile(null);
    setShowEditModal(true);
  };
  const closeEditModal = () => {
    setShowEditModal(false);
  };
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditUser(prev => ({ ...prev, [name]: value }));
  };
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEditImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  const handleUpdate = (e) => {
    e.preventDefault();
    setUser(prev => ({
      ...prev,
      name: editUser.name,
      email: editUser.email,
      phone: editUser.phone,
      address: editUser.address,
      image: editImagePreview || prev.image,
    }));
    setShowEditModal(false);
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
        <div className="header-right">
          <div className="header-icon-cart" onClick={() => navigate('/cart')}  style={{ position: 'relative', cursor: 'pointer' }}>
            <img className='header-icon' src={require('../Images/Cart.png')} alt="Cart" title="Cart" />
            {cartCount > 0 && (
              <span className="cart-badge-count">{cartCount}</span>
            )}
          </div>
          <img className='header-icon' src={require('../Images/Wishlist.png')} alt="Wishlist" title="Wishlist" />
          <div className="notification-wrapper">
            <img className='header-icon' src={require('../Images/bell-no.png')} alt='Notification' style={{cursor:'pointer'}}/>
          </div>
          <div className="user-info">
            <img className="user-img" src={user.image} alt="User" />
            <div className="user-name">{user.name}</div>
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
        

      <div className="profile-main-grid">
          {/* Left: Profile image and summary */}
          <section className="profile-main-left">
            <img src="https://randomuser.me/api/portraits/women/32.jpg" alt="User" className="profile-main-avatar" />
            <div className="profile-main-summary">
              <div className="profile-main-name">Keerthi</div>
            </div>
            {/* Premium Account Card */}
            <div className="profile-main-premium-card">
              {/* <div className="profile-main-premium-icon"><i className="fa fa-crown"></i></div> */}
              <div className="profile-main-premium-title">Premium Account</div>
              <div className="profile-main-premium-desc">You are a Fruits Premium member! Enjoy exclusive benefits, priority support, and special offers.</div>
            </div>

          </section>
          {/* Right: Contact and basic info */}
          <section className="profile-main-right">
            {/* Edit Button at the top */}
            <button className="profile-edit-btn" onClick={openEditModal} style={{alignSelf:'flex-end', marginBottom:'1.2rem'}}>Edit Profile</button>
            <div className="profile-main-contact">
              <div className="profile-main-contact-title">Contact Information</div>
              <div className="profile-main-contact-row"><span>Phone:</span> {user.phone}</div>
              <div className="profile-main-contact-row"><span>Address:</span> {user.address}</div>
              <div className="profile-main-contact-row"><span>E-mail:</span> {user.email}</div>
              <div className="profile-main-contact-row"><span>Site:</span> <a href="https://www.jeremyrose.com">www.jeremyrose.com</a></div>
            </div>
            <div className="profile-main-basic">
              <div className="profile-main-basic-title">Basic Information</div>
              <div className="profile-main-basic-row"><span>Birthday:</span> {user.dob}</div>
              <div className="profile-main-basic-row"><span>Gender:</span> {user.gender}</div>
            </div>
            {/* Modal for editing profile */}
            {showEditModal && (
              <div className="profile-modal-overlay" onClick={closeEditModal}>
                <div className="profile-modal" onClick={e => e.stopPropagation()}>
                  <h2>Edit Profile</h2>
                  <form className="profile-edit-form" onSubmit={handleUpdate}>
                    {/* Image preview */}
                    {editImagePreview && (
                      <img src={editImagePreview} alt="Preview" className="profile-main-avatar" style={{ margin: '0 auto 1.2rem auto', display: 'block' }} />
                    )}
                    <label className="profile-image-upload-label">
                      Profile Image:
                      <div className="profile-image-upload-row">
                        <input
                          type="file"
                          accept="image/*"
                          id="profile-image-upload"
                          style={{ display: 'none' }}
                          onChange={handleImageChange}
                        />
                        <button
                          type="button"
                          className="profile-image-upload-btn"
                          onClick={e => {
                            e.preventDefault();
                            document.getElementById('profile-image-upload').click();
                          }}
                        >
                          Choose File
                        </button>
                        <span className="profile-image-file-name">
                          {editImageFile ? editImageFile.name : ''}
                        </span>
                      </div>
                    </label>
                    <label>
                      Name:
                      <input type="text" name="name" value={editUser.name} onChange={handleEditChange} />
                    </label>
                    <label>
                      Phone:
                      <input type="text" name="phone" value={editUser.phone} onChange={handleEditChange} />
                    </label>
                    <label>
                      Address:
                      <input type="text" name="address" value={editUser.address} onChange={handleEditChange} />
                    </label>
                    <label>
                      E-mail:
                      <input type="email" name="email" value={editUser.email} onChange={handleEditChange} />
                    </label>
                    <label>
                      Birthday:
                      <input type="date" name="dob" value={editUser.dob} onChange={handleEditChange} />
                    </label>
                    <label>
                      Gender:
                      <input type="text" name="gender" value={editUser.gender} onChange={handleEditChange} />
                    </label>
                    <div className="profile-modal-btn-row">
                      <button type="submit" className="profile-modal-update-btn">Update</button>
                      <button type="button" className="profile-modal-close-btn" onClick={closeEditModal}>Close</button>
                    </div>
                  </form>
                </div>
              </div>
            )}
            

        </section>
        
        </div>
        {/* Info Cards Row */}
        <div className='cards-row-pr'>
            <div className="profile-info-cards-row">
              <div className="profile-info-card">
                <div className="profile-info-card-icon"><img src='https://png.pngtree.com/png-vector/20190309/ourmid/pngtree-premium-quality-label-png-image_784322.jpg'  className='pre-imgs'  /></div>
                <div className="profile-info-card-title">Explore Premium</div>
                <div className="profile-info-card-desc">Unlock more features and exclusive offers with Fruits Premium membership.</div>
              </div>
              <div className="profile-info-card">
                <div className="profile-info-card-icon"><img src={sc} className='pre-imgs-th' /> </div>
                <div className="profile-info-card-title">Safety Tips</div>
                <div className="profile-info-card-desc">Keep your account secure: use strong passwords and never share your credentials.</div>
              </div>
              <div className="profile-info-card">
                <div className="profile-info-card-icon"><img src={ss} className='pre-imgs' /></div>
                <div className="profile-info-card-title">Support</div>
                <div className="profile-info-card-desc">Need help? Contact our 24/7 support team for assistance with your account or orders.</div>
              </div>
          </div>
        </div>

      </main>
    </div>
  );
}

export default Profile;