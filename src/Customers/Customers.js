import React, { useState } from 'react';
import './Customers.css';
import { Link } from 'react-router-dom';
import logo from '../Images/unnamed.png';
import { Bar } from 'react-chartjs-2';
import { Chart, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';
Chart.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const userImage = 'https://randomuser.me/api/portraits/women/44.jpg';

const customerCards = [
  {
    type: 'all',
    icon: 'fa-users',
    title: 'All Customers',
    value: 5,
    label: 'Total',
    color: '#6366f1',
    bg: 'linear-gradient(135deg, #e0e7ff 0%, #6366f110 100%)',
  },
  {
    type: 'active',
    icon: 'fa-user-check',
    title: 'Active',
    value: 3,
    label: 'Active',
    color: '#22c55e',
    bg: 'linear-gradient(135deg, #bbf7d0 0%, #22c55e10 100%)',
  },
  {
    type: 'inactive',
    icon: 'fa-user-times',
    title: 'Inactive',
    value: 1,
    label: 'Inactive',
    color: '#fb7185',
    bg: 'linear-gradient(135deg, #ffe4e6 0%, #fb718510 100%)',
  },
  {
    type: 'new',
    icon: 'fa-user-plus',
    title: 'New',
    value: 1,
    label: 'New This Month',
    color: '#fbbf24',
    bg: 'linear-gradient(135deg, #fef9c3 0%, #fbbf2410 100%)',
  },
];

const tagOptions = ['VIP', 'Wholesale', 'Retail', 'Online', 'Local'];
const statusOptions = ['All', 'Active', 'Inactive', 'New'];
const addCustomerTypes = ['Individual', 'Business'];

const dummyCustomers = [
  { id: 1, name: 'John Doe', email: 'john@example.com', phone: '9876543210', company: '', status: 'Active', tags: ['VIP', 'Online'], type: 'Individual' },
  { id: 2, name: 'Acme Corp', email: 'contact@acme.com', phone: '9123456780', company: 'Acme Corp', status: 'Active', tags: ['Wholesale'], type: 'Business' },
  { id: 3, name: 'Jane Smith', email: 'jane@example.com', phone: '9988776655', company: '', status: 'Inactive', tags: ['Retail', 'Local'], type: 'Individual' },
  { id: 4, name: 'FreshMart', email: 'info@freshmart.com', phone: '9001122334', company: 'FreshMart', status: 'New', tags: ['Retail', 'Online'], type: 'Business' },
  { id: 5, name: 'Alice Lee', email: 'alice@example.com', phone: '9871234567', company: '', status: 'Active', tags: ['VIP'], type: 'Individual' },
];

const dummyTagCustomers = {
  VIP:   { id: 1001, name: 'VIP User', email: 'vip@demo.com', phone: '9000000001', company: '', status: 'Active', tags: ['VIP'], type: 'Individual' },
  Wholesale: { id: 1002, name: 'Wholesale Buyer', email: 'wholesale@demo.com', phone: '9000000002', company: 'Wholesale Inc', status: 'Active', tags: ['Wholesale'], type: 'Business' },
  Retail: { id: 1003, name: 'Retail Shopper', email: 'retail@demo.com', phone: '9000000003', company: '', status: 'Inactive', tags: ['Retail'], type: 'Individual' },
  Online: { id: 1004, name: 'Online Customer', email: 'online@demo.com', phone: '9000000004', company: '', status: 'New', tags: ['Online'], type: 'Individual' },
  Local: { id: 1005, name: 'Local Patron', email: 'local@demo.com', phone: '9000000005', company: '', status: 'Active', tags: ['Local'], type: 'Individual' },
};

const allCards = [
  { key: 'vip1', tag: 'VIP', title: 'VIP Gold', desc: 'Top-tier VIP customer', icon: 'fa-gem' },
  { key: 'vip2', tag: 'VIP', title: 'VIP Silver', desc: 'Mid-tier VIP customer', icon: 'fa-star' },
  { key: 'vip3', tag: 'VIP', title: 'VIP Bronze', desc: 'Entry VIP customer', icon: 'fa-user' },
  { key: 'wholesale1', tag: 'Wholesale', title: 'Bulk Buyer', desc: 'Buys in large quantities', icon: 'fa-truck' },
  { key: 'wholesale2', tag: 'Wholesale', title: 'Distributor', desc: 'Distributes to retailers', icon: 'fa-industry' },
  { key: 'wholesale3', tag: 'Wholesale', title: 'Reseller', desc: 'Resells products', icon: 'fa-exchange' },
  { key: 'retail1', tag: 'Retail', title: 'Regular Shopper', desc: 'Shops frequently', icon: 'fa-shopping-bag' },
  { key: 'retail2', tag: 'Retail', title: 'Occasional Shopper', desc: 'Shops sometimes', icon: 'fa-shopping-cart' },
  { key: 'retail3', tag: 'Retail', title: 'New Retail', desc: 'Recently joined retail', icon: 'fa-user-plus' },
  { key: 'online1', tag: 'Online', title: 'App User', desc: 'Shops via app', icon: 'fa-mobile' },
  { key: 'online2', tag: 'Online', title: 'Web User', desc: 'Shops via website', icon: 'fa-globe' },
  { key: 'online3', tag: 'Online', title: 'Online VIP', desc: 'VIP online customer', icon: 'fa-star' },
  { key: 'local1', tag: 'Local', title: 'Neighborhood', desc: 'Lives nearby', icon: 'fa-home' },
  { key: 'local2', tag: 'Local', title: 'Local Business', desc: 'Local business customer', icon: 'fa-briefcase' },
  { key: 'local3', tag: 'Local', title: 'Local VIP', desc: 'VIP from local area', icon: 'fa-user-circle' },
  { key: 'special', tag: 'Special', title: 'Special Customer', desc: 'Special program member', icon: 'fa-gem' },
  { key: 'seasonal', tag: 'Seasonal', title: 'Seasonal Buyer', desc: 'Shops during seasons', icon: 'fa-leaf' },
];
const filterTags = ['VIP', 'Wholesale', 'Retail', 'Online', 'Local'];

const Customers = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState('');
  const [modalOpen, setModalOpen] = useState(''); // 'view', 'edit', 'delete'
  const [modalCustomer, setModalCustomer] = useState(null);
  const [popMessage, setPopMessage] = useState(null);
  const [filterStatus, setFilterStatus] = useState('All');
  const [selectedTag, setSelectedTag] = useState('All');
  const [addModalStep, setAddModalStep] = useState(0); // 0: closed, 1: type, 2: form
  const [addType, setAddType] = useState('Individual');
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', company: '', tags: [] });
  const [customers, setCustomers] = useState(dummyCustomers);
  const [selectedCard, setSelectedCard] = useState('all');
  const [tagDummyAdded, setTagDummyAdded] = useState(null);
  const [cardModal, setCardModal] = useState({ open: false, card: null });

  // Dropdown content for each icon
  const dropdowns = {
    notifications: (
      <div className="dropdown-menu" style={{right: 0, left: 'auto'}}>
        <div><i className="fa fa-info-circle"></i> New customer registered</div>
        <div><i className="fa fa-exclamation-triangle"></i> Email bounce detected</div>
        <div><i className="fa fa-check-circle"></i> Customer feedback received</div>
      </div>
    ),
    messages: (
      <div className="dropdown-menu" style={{right: 0, left: 'auto'}}>
        <div><i className="fa fa-user"></i> John: Inquiry about order</div>
        <div><i className="fa fa-user"></i> Anna: Updated address</div>
        <div><i className="fa fa-user"></i> Support: Ticket closed.</div>
      </div>
    ),
    tasks: (
      <div className="dropdown-menu" style={{right: 0, left: 'auto'}}>
        <div><i className="fa fa-check"></i> Call new customers</div>
        <div><i className="fa fa-check"></i> Review feedback</div>
        <div><i className="fa fa-check"></i> Update CRM</div>
      </div>
    ),
    settings: (
      <div className="dropdown-menu" style={{right: 0, left: 'auto'}}>
        <div><i className="fa fa-cog"></i> Account Settings</div>
        <div><i className="fa fa-paint-brush"></i> Theme</div>
        <div><i className="fa fa-shield"></i> Privacy</div>
      </div>
    ),
    user: (
      <div className="dropdown-menu" style={{right: 0, left: 'auto'}}>
        <div><i className="fa fa-user"></i> Profile</div>
      </div>
    )
  };

  const handleDropdown = (type) => {
    setDropdownOpen(dropdownOpen === type ? '' : type);
  };

  const handleTagSelect = (tag) => {
    if (selectedTag === tag) {
      setSelectedTag('All');
      if (tagDummyAdded) {
        setCustomers(prev => prev.filter(c => c.id !== dummyTagCustomers[tag].id));
        setTagDummyAdded(null);
      }
    } else {
      setSelectedTag(tag);
      // Remove any previous dummy
      if (tagDummyAdded) {
        setCustomers(prev => prev.filter(c => c.id !== dummyTagCustomers[tagDummyAdded].id));
      }
      // Add new dummy
      setCustomers(prev => [...prev, dummyTagCustomers[tag]]);
      setTagDummyAdded(tag);
    }
  };

  // Filtering logic
  const filteredCustomers = customers.filter(c => {
    let statusMatch = filterStatus === 'All' || c.status === filterStatus;
    let tagMatch = selectedTag === 'All' || (c.tags && c.tags[0] === selectedTag);
    let cardMatch = true; // cards are now filtered by selectedTag
    return statusMatch && tagMatch && cardMatch;
  });

  // Add Customer
  const handleAddCustomer = () => {
    setCustomers(prev => [
      ...prev,
      {
        id: prev.length + 1,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        company: addType === 'Business' ? formData.company : '',
        status: 'Active',
        tags: formData.tags,
        type: addType
      }
    ]);
    setPopMessage({ type: 'success', text: 'Customer added successfully!' });
    setAddModalStep(0);
    setFormData({ name: '', email: '', phone: '', company: '', tags: [] });
    setTimeout(() => setPopMessage(null), 2500);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleTagInput = (tag) => {
    setFormData(prev => ({ ...prev, tags: prev.tags.includes(tag) ? prev.tags.filter(t => t !== tag) : [...prev.tags, tag] }));
  };

  // Modal actions
  const openModal = (type, customer) => {
    setModalOpen(type);
    setModalCustomer(customer);
  };
  const closeModal = () => {
    setModalOpen('');
    setModalCustomer(null);
  };
  const handleDelete = () => {
    setCustomers(prev => prev.filter(c => c.id !== modalCustomer.id));
    setPopMessage({ type: 'success', text: 'Customer deleted!' });
    closeModal();
    setTimeout(() => setPopMessage(null), 2000);
  };
  const handleEdit = () => {
    setCustomers(prev => prev.map(c => c.id === modalCustomer.id ? { ...modalCustomer } : c));
    setPopMessage({ type: 'success', text: 'Customer updated!' });
    closeModal();
    setTimeout(() => setPopMessage(null), 2000);
  };

  return (
    <div className={`customers-container${collapsed ? ' collapsed' : ''}`}> {/* Unique class for customers */}
      {/* Side Nav */}
      <nav className={`side-nav${collapsed ? ' collapsed' : ''}`}>
        <ul>
          <li>
            <Link to="/" className="side-link">
              <i className="fa fa-home side-link-icon"></i>
              {!collapsed && <span className="side-link-label">Home</span>}
            </Link>
          </li>
          <li>
            <Link to="/customers" className="side-link active">
              <i className="fa fa-users side-link-icon"></i>
              {!collapsed && <span className="side-link-label">Customers</span>}
            </Link>
          </li>
          <li>
            <Link to="/sales" className="side-link">
              <i className="fa fa-line-chart side-link-icon"></i>
              {!collapsed && <span className="side-link-label">Sales</span>}
            </Link>
          </li>
          <li>
            <Link to="/analytics" className="side-link">
              <i className="fa fa-bar-chart side-link-icon"></i>
              {!collapsed && <span className="side-link-label">Analytics</span>}
            </Link>
          </li>
          <li>
            <Link to="/calendar" className="side-link">
              <i className="fa fa-calendar side-link-icon"></i>
              {!collapsed && <span className="side-link-label">Calendar</span>}
            </Link>
          </li>
          <li>
            <Link to="/tasks" className="side-link">
              <i className="fa fa-tasks side-link-icon"></i>
              {!collapsed && <span className="side-link-label">Tasks</span>}
            </Link>
          </li>
          <li>
            <Link to="/settings" className="side-link">
              <i className="fa fa-cog side-link-icon"></i>
              {!collapsed && <span className="side-link-label">Settings</span>}
            </Link>
          </li>
          <li>
            <Link to="/logout" className="side-link logout">
              <i className="fa fa-sign-out side-link-icon"></i>
              {!collapsed && <span className="side-link-label">Logout</span>}
            </Link>
          </li>
        </ul>
      </nav>

      {/* Main Content */}
      <div className="main-content">
        {/* Header */}
        <header className="dashboard-header">
          <div className="header-left">
            <img src={logo} alt="Logo" className="logo" />
            <button className="collapse-btn" onClick={() => setCollapsed(!collapsed)}>
              <i className={`fa ${collapsed ? 'fa-bars' : 'fa-times'}`}></i>
            </button>
          </div>
          <div className="header-center">
            <input type="text" className="search-bar" placeholder="Search customers..." />
          </div>
          <div className="header-right">
            <div className="icon-group">
              <span className="icon" title="Notifications" onClick={() => handleDropdown('notifications')} style={{position: 'relative'}}>
                <i className="fa fa-bell"></i>
                {dropdownOpen === 'notifications' && dropdowns.notifications}
              </span>
              <span className="icon" title="Messages" onClick={() => handleDropdown('messages')} style={{position: 'relative'}}>
                <i className="fa fa-envelope"></i>
                {dropdownOpen === 'messages' && dropdowns.messages}
              </span>
              <span className="icon" title="Tasks" onClick={() => handleDropdown('tasks')} style={{position: 'relative'}}>
                <i className="fa fa-tasks"></i>
                {dropdownOpen === 'tasks' && dropdowns.tasks}
              </span>
              <span className="icon" title="Settings" onClick={() => handleDropdown('settings')} style={{position: 'relative'}}>
                <i className="fa fa-cog"></i>
                {dropdownOpen === 'settings' && dropdowns.settings}
              </span>
            </div>
            <div className="user-details" onClick={() => handleDropdown('user')} style={{cursor: 'pointer', position: 'relative'}}>
              <span className="user-name">keerthi</span>
              <img src={userImage} alt="User" className="user-image" />
              {dropdownOpen === 'user' && dropdowns.user}
            </div>
          </div>
        </header>
        {/* Page Content */}
        <div className="customers-content">
          <div className="customers-content-header">
            <div className="filters-row">
              <div style={{ display: 'flex', gap: 8 }}>
                <select className="filter-select" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
                  {statusOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
                <div className="tags-select">
                  <button type="button" className={`tag-option${selectedTag === 'All' ? ' selected' : ''}`} onClick={() => setSelectedTag('All')}>All</button>
                  {filterTags.map(tag => (
                    <button type="button" key={tag} className={`tag-option${selectedTag === tag ? ' selected' : ''}`} onClick={() => setSelectedTag(tag)}>{tag}</button>
                  ))}
                </div>
              </div>
              <div style={{ marginLeft: 'auto' }}>
                <button className="add-customer-btn" onClick={() => setAddModalStep(1)}><i className="fa fa-plus"></i> Add Customer</button>
              </div>
            </div>
          </div>
          <div className="card-grid">
            {(selectedTag === 'All'
              ? allCards.slice(0, 8)
              : allCards.filter(card => card.tag === selectedTag).slice(0, 3)
            ).map(card => (
              <div key={card.key} className={`customer-card-grid customer-card-${card.key.toLowerCase()}`}> 
                <div className="customer-card-icon-grid"><i className={`fa ${card.icon}`}></i></div>
                <div className="customer-card-title-grid">{card.title}</div>
                <div className="customer-card-desc-grid">{card.desc}</div>
                <button className="card-btn-grid" onClick={() => setCardModal({ open: true, card })}>View Details</button>
              </div>
            ))}
          </div>
          {cardModal.open && cardModal.card && (
            <div className={`customers-modal-overlay card-modal-${cardModal.card.key}`} onClick={() => setCardModal({ open: false, card: null })}>
              <div className={`customers-modal card-modal-${cardModal.card.key}`} onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                  <span>{cardModal.card.title} Details</span>
                  <button className="modal-close" onClick={() => setCardModal({ open: false, card: null })}><i className="fa fa-times"></i></button>
                </div>
                <div className="modal-body">
                  <h4>{cardModal.card.title}</h4>
                  <p>{cardModal.card.desc}</p>
                  <div style={{marginTop: 16, textAlign: 'center'}}>
                    <Bar
                      data={{
                        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                        datasets: [
                          {
                            label: 'Sales',
                            data: Array.from({length: 12}, (_, i) => Math.floor(Math.random()*100+100)),
                            backgroundColor: '#1d4ed8',
                            borderRadius: 8,
                            barThickness: 32,
                          }
                        ]
                      }}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: { legend: { display: false } },
                        scales: {
                          x: { grid: { display: false } },
                          y: { beginAtZero: true, grid: { color: '#e5e7eb' } }
                        }
                      }}
                      height={300}
                      width={null}
                      style={{ width: '100%', maxWidth: '100%', height: 300 }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
          {/* <div className="customers-row">
            {customerCards.map(card => (
              <div
                className={`customers-card modern-card ${card.type}-card${selectedCard === card.type ? ' selected' : ''}`}
                key={card.type}
                style={{ background: card.bg }}
                onClick={() => setSelectedCard(card.type)}
              >
                <div className="modern-card-icon" style={{ background: card.color + '22', color: card.color }}>
                  <i className={`fa ${card.icon}`}></i>
                </div>
                <div className="modern-card-content">
                  <div className="modern-card-title">{card.title}</div>
                  <div className="modern-card-value">{
                    card.type === 'all' ? customers.length : customers.filter(c =>
                      (card.type === 'active' && c.status === 'Active') ||
                      (card.type === 'inactive' && c.status === 'Inactive') ||
                      (card.type === 'new' && c.status === 'New')
                    ).length
                  }</div>
                  <div className="modern-card-label">{card.label}</div>
                </div>
              </div>
            ))}
          </div> */}
          {/* Table */}
          <div className="customers-table-wrap">
            <table className="customers-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th>Tags</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCustomers.length === 0 ? (
                  <tr><td colSpan="7" style={{ textAlign: 'center', color: '#64748b' }}>No customers found.</td></tr>
                ) : filteredCustomers.map(c => (
                  <tr key={c.id}>
                    <td>
                      <i className={`fa ${c.type === 'Business' ? 'fa-building' : 'fa-user'}`} style={{ marginRight: 8, color: '#6366f1' }}></i>
                      {c.name}
                    </td>
                    <td>{c.email}</td>
                    <td>{c.phone}</td>
                    <td>{c.type}</td>
                    <td>{c.status}</td>
                    <td>{c.tags.length > 0 && <span className="tag-badge">{c.tags[0]}</span>}</td>
                    <td>
                      <button className={`cus-action-btn cus-view-btn`} onClick={() => openModal('view', c)}>
                        <i className="fa fa-eye" ></i>
                      </button>
                      <button className={`cus-action-btn cus-edit-btn`} onClick={() => openModal('edit', { ...c })}>
                        <i className="fa fa-pencil" ></i>
                      </button>
                      <button className={`cus-action-btn cus-delete-btn`} onClick={() => openModal('delete', c)}>
                        <i className="fa fa-trash" ></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Pop Message */}
          {popMessage && (
            <div className={`pop-message ${popMessage.type}`}>{popMessage.text}</div>
          )}
          {/* Modals for View/Edit/Delete */}
          {modalOpen === 'view' && modalCustomer && (
            <div className="customers-modal-overlay cus-view" onClick={closeModal}>
              <div className="customers-modal cus-view-content" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                  <span>View Customer</span>
                  <button className="modal-close" onClick={closeModal}><i className="fa fa-times"></i></button>
                </div>
                <div className="modal-body">
                  <div><b>Name:</b> {modalCustomer.name}</div>
                  <div><b>Email:</b> {modalCustomer.email}</div>
                  <div><b>Phone:</b> {modalCustomer.phone}</div>
                  {modalCustomer.company && <div><b>Company:</b> {modalCustomer.company}</div>}
                  <div><b>Status:</b> {modalCustomer.status}</div>
                  <div><b>Type:</b> {modalCustomer.type}</div>
                  <div><b>Tags:</b> {modalCustomer.tags.join(', ')}</div>
                </div>
              </div>
            </div>
          )}
          {modalOpen === 'edit' && modalCustomer && (
            <div className="customers-modal-overlay cus-edit" onClick={closeModal}>
              <div className="customers-modal cus-edit-content" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                  <span>Edit Customer</span>
                  <button className="modal-close" onClick={closeModal}><i className="fa fa-times"></i></button>
                </div>
                <div className="modal-body">
                  <form className="add-customer-form" onSubmit={e => { e.preventDefault(); handleEdit(); }}>
                    <input name="name" value={modalCustomer.name} onChange={e => setModalCustomer({ ...modalCustomer, name: e.target.value })} required />
                    <input name="email" value={modalCustomer.email} onChange={e => setModalCustomer({ ...modalCustomer, email: e.target.value })} required />
                    <input name="phone" value={modalCustomer.phone} onChange={e => setModalCustomer({ ...modalCustomer, phone: e.target.value })} required />
                    {modalCustomer.type === 'Business' && (
                      <input name="company" value={modalCustomer.company} onChange={e => setModalCustomer({ ...modalCustomer, company: e.target.value })} required />
                    )}
                    <select
                      className="tag-select-dropdown"
                      value={modalCustomer.tags[0] || ''}
                      onChange={e => setModalCustomer({ ...modalCustomer, tags: e.target.value ? [e.target.value] : [] })}
                      required
                    >
                      <option value="" disabled>Select Tag</option>
                      {tagOptions.map(tag => (
                        <option key={tag} value={tag}>{tag}</option>
                      ))}
                    </select>
                    <button type="submit" className="submit-btn">Save</button>
                  </form>
                </div>
              </div>
            </div>
          )}
          {modalOpen === 'delete' && modalCustomer && (
            <div className="customers-modal-overlay cus-delete" onClick={closeModal}>
              <div className="customers-modal cus-delete-content" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                  <span>Delete Customer</span>
                  <button className="modal-close" onClick={closeModal}><i className="fa fa-times"></i></button>
                </div>
                <div className="modal-body">
                  <p>Are you sure you want to delete <b>{modalCustomer.name}</b>?</p>
                  <button className="submit-btn" style={{ background: '#fb7185' }} onClick={handleDelete}>Delete</button>
                </div>
              </div>
            </div>
          )}
          {/* Add Customer Modal: Step 1 (Type) */}
          {addModalStep === 1 && (
            <div className="customers-modal-overlay customers-modal-overlay-add" onClick={() => setAddModalStep(0)}>
              <div className="customers-modal customers-modal-add" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                  <span>Select Customer Type</span>
                  <button className="modal-close" onClick={() => setAddModalStep(0)}><i className="fa fa-times"></i></button>
                </div>
                <div className="modal-body">
                  <div className="add-type-row">
                    {addCustomerTypes.map(type => (
                      <button key={type} className={`add-type-btn${addType === type ? ' selected' : ''}`} onClick={() => { setAddType(type); setAddModalStep(2); }}>{type}</button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
          {/* Add Customer Modal: Step 2 (Form) */}
          {addModalStep === 2 && (
            <div className="customers-modal-overlay customers-modal-overlay-add" onClick={() => setAddModalStep(0)}>
              <div className="customers-modal customers-modal-add" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                  <span>Add Customer</span>
                  <button className="modal-close" onClick={() => setAddModalStep(0)}><i className="fa fa-times"></i></button>
                </div>
                <div className="modal-body">
                  <form className="add-customer-form" onSubmit={e => { e.preventDefault(); handleAddCustomer(); }}>
                    <input name="name" value={formData.name} onChange={handleFormChange} placeholder={addType === 'Individual' ? 'Full Name' : 'Contact Person'} required />
                    <input name="email" value={formData.email} onChange={handleFormChange} placeholder="Email" type="email" required />
                    <input name="phone" value={formData.phone} onChange={handleFormChange} placeholder="Phone" required />
                    {addType === 'Business' && (
                      <input name="company" value={formData.company} onChange={handleFormChange} placeholder="Company Name" required />
                    )}
                    <select
                      className="tag-select-dropdown"
                      value={formData.tags[0] || ''}
                      onChange={e => setFormData(prev => ({ ...prev, tags: e.target.value ? [e.target.value] : [] }))}
                      required
                    >
                      <option value="" disabled>Select Tag</option>
                      {tagOptions.map(tag => (
                        <option key={tag} value={tag}>{tag}</option>
                      ))}
                    </select>
                    <button type="submit" className="submit-btn">Add Customer</button>
                  </form>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Customers;