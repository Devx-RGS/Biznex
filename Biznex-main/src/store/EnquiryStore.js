const store = {
  received: [
    {
      id: 'enq_1',
      from: { name: 'Rajesh Kumar', initials: 'RK', color: '#1abc9c', business: 'Nexus Solutions', category: 'IT & Technology', phone: '+91 98201 11111', email: 'rajesh@nexussolutions.in' },
      message: "Hi! I'd love to connect and explore potential referrals between our businesses.",
      time: '10:30 AM',
      status: 'pending',
    },
    {
      id: 'enq_2',
      from: { name: 'Anjali Singh', initials: 'AS', color: '#e74c3c', business: 'FoodCraft Co.', category: 'Food & Mfg', phone: '+91 98202 22222', email: 'anjali@foodcraft.in' },
      message: 'Saw your profile at the Andheri chapter meet. Would love to discuss a collaboration.',
      time: 'Yesterday',
      status: 'pending',
    },
    {
      id: 'enq_3',
      from: { name: 'Vikram Joshi', initials: 'VJ', color: '#3498db', business: 'ProServ Inc', category: 'Services', phone: '+91 98203 33333', email: 'vikram@proserv.in' },
      message: 'Interested in your services. Can we set up a quick call?',
      time: '2 days ago',
      status: 'accepted',
    },
  ],

  sent: [],

  // IDs of accepted connections (both directions)
  connections: ['enq_3'],

  listeners: [],

  sendEnquiry(member, message) {
    const id = 'sent_' + Date.now();
    store.sent.unshift({
      id,
      to: {
        name: member.name,
        initials: member.initials,
        color: member.color,
        business: member.business,
        category: member.category,
      },
      message: message.trim() || 'Hi! I came across your profile and would love to connect.',
      time: 'Just now',
      status: 'pending',
    });
    store.notify();
    return id;
  },

  acceptEnquiry(id) {
    const enq = store.received.find(e => e.id === id);
    if (enq) {
      enq.status = 'accepted';
      if (!store.connections.includes(id)) store.connections.push(id);
      store.notify();
    }
  },

  declineEnquiry(id) {
    const enq = store.received.find(e => e.id === id);
    if (enq) { enq.status = 'declined'; store.notify(); }
  },

  isConnected(memberId) {
    return store.connections.includes(memberId);
  },

  getPending()  { return store.received.filter(e => e.status === 'pending');  },
  getAccepted() { return store.received.filter(e => e.status === 'accepted'); },
  getSent()     { return store.sent; },

  subscribe(fn) {
    store.listeners.push(fn);
    return () => { store.listeners = store.listeners.filter(l => l !== fn); };
  },

  notify() { store.listeners.forEach(fn => fn()); },
};

export default store;
