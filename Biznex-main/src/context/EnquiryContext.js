import React, { createContext, useContext, useMemo, useState } from 'react';
import { MEMBERS } from '../data/memberData';

const CURRENT_USER = {
  id: 'me',
  name: 'Your Name',
  initials: 'YO',
  business: 'BizNex Member',
  color: '#C9A84C',
};

const EnquiryContext = createContext(null);

const initialRequests = [
  {
    id: 'enq-1',
    sender: MEMBERS[1],
    receiver: CURRENT_USER,
    direction: 'incoming',
    status: 'pending',
    message: 'Hi, I would like to discuss catering support for a corporate event.',
    createdAt: 'Today, 10:30 AM',
  },
  {
    id: 'enq-2',
    sender: MEMBERS[5],
    receiver: CURRENT_USER,
    direction: 'incoming',
    status: 'accepted',
    message: 'Can we connect about GST and audit advisory for a new client?',
    createdAt: 'Yesterday, 4:15 PM',
  },
];

const initialChats = {
  'enq-2': [
    {
      id: 'm-1',
      from: 'them',
      text: 'Thanks for accepting my enquiry request.',
      time: '4:20 PM',
    },
    {
      id: 'm-2',
      from: 'me',
      text: 'Happy to connect. Please share the basic requirement.',
      time: '4:22 PM',
    },
  ],
};

export function EnquiryProvider({ children }) {
  const [requests, setRequests] = useState(initialRequests);
  const [chats, setChats] = useState(initialChats);

  const sendEnquiry = (member, message) => {
    const existing = requests.find(
      request =>
        request.direction === 'outgoing' &&
        request.receiver.id === member.id &&
        request.status !== 'declined'
    );

    if (existing) {
      return existing;
    }

    const request = {
      id: `enq-${Date.now()}`,
      sender: CURRENT_USER,
      receiver: member,
      direction: 'outgoing',
      status: 'pending',
      message: message || `Hi ${member.name}, I would like to send you a business enquiry.`,
      createdAt: 'Just now',
    };

    setRequests(prev => [request, ...prev]);
    return request;
  };

  const sendMockIncomingRequest = () => {
    const mockSenders = [MEMBERS[0], MEMBERS[2], MEMBERS[4], MEMBERS[9]];
    const sender = mockSenders[Math.floor(Math.random() * mockSenders.length)];
    const request = {
      id: `enq-${Date.now()}`,
      sender,
      receiver: CURRENT_USER,
      direction: 'incoming',
      status: 'pending',
      message: `Hi, I would like to connect with you about ${sender.offer.toLowerCase()}`,
      createdAt: 'Just now',
    };

    setRequests(prev => [request, ...prev]);
    return request;
  };

  const updateRequestStatus = (id, status) => {
    setRequests(prev =>
      prev.map(request =>
        request.id === id ? { ...request, status } : request
      )
    );

    if (status === 'accepted') {
      setChats(prev => ({
        ...prev,
        [id]: prev[id] || [
          {
            id: `${id}-welcome`,
            from: 'system',
            text: 'Secure chat opened after enquiry acceptance.',
            time: 'Now',
          },
        ],
      }));
    }
  };

  const sendChatMessage = (requestId, text) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    setChats(prev => ({
      ...prev,
      [requestId]: [
        ...(prev[requestId] || []),
        {
          id: `${requestId}-${Date.now()}`,
          from: 'me',
          text: trimmed,
          time: 'Now',
        },
      ],
    }));
  };

  const value = useMemo(
    () => ({
      currentUser: CURRENT_USER,
      requests,
      chats,
      sendEnquiry,
      updateRequestStatus,
      sendChatMessage,
      sendMockIncomingRequest,
    }),
    [requests, chats]
  );

  return (
    <EnquiryContext.Provider value={value}>
      {children}
    </EnquiryContext.Provider>
  );
}

export function useEnquiries() {
  const context = useContext(EnquiryContext);
  if (!context) {
    throw new Error('useEnquiries must be used within EnquiryProvider');
  }
  return context;
}
