import { useState, useCallback } from "react";

import ChatSidebar from "../../partial/support/ChatSidebar";
import SupportStatusModal from "../../partial/support/SupportStatusModal";
import ChatScreen from "../../partial/support/ChatScreen";
import SupportInfoPanel from "../../partial/support/SupportInfoPanel";

// ─── Constants ────────────────────────────────────────────────────────────────
const CONTACTS = [
  {
    id: 1,
    name: "Rajesh Kumar",
    initials: "RK",
    color: "bg-emerald-500",
    role: "Customer",
    lastMessage: "My order hasn't arrived yet, it's been 5 days!",
    time: "10:42 AM",
    unread: 3,
    online: true,
    pinned: true,
    status: "urgent",
    phone: "+91 98765 43210",
    issue: "Order Delay",
    orderId: "ORD-2024-5891",
  },
  {
    id: 2,
    name: "Priya Sharma",
    initials: "PS",
    color: "bg-violet-500",
    role: "Customer",
    lastMessage: "Thank you for resolving my issue 😊",
    time: "9:15 AM",
    unread: 0,
    online: true,
    pinned: true,
    status: "resolved",
    phone: "+91 87654 32109",
    issue: "Payment Issue",
    orderId: "ORD-2024-5760",
  },
  {
    id: 3,
    name: "Amit Patel",
    initials: "AP",
    color: "bg-blue-500",
    role: "Customer",
    lastMessage: "Can I get a refund for my last order?",
    time: "Yesterday",
    unread: 1,
    online: false,
    pinned: false,
    status: "open",
    phone: "+91 76543 21098",
    issue: "Refund Request",
    orderId: "ORD-2024-5643",
  },
  {
    id: 4,
    name: "Sneha Joshi",
    initials: "SJ",
    color: "bg-pink-500",
    role: "Customer",
    lastMessage: "The app keeps crashing on my phone",
    time: "Yesterday",
    unread: 0,
    online: false,
    pinned: false,
    status: "open",
    phone: "+91 65432 10987",
    issue: "Technical Issue",
    orderId: "ORD-2024-5592",
  },
  {
    id: 5,
    name: "Vikram Singh",
    initials: "VS",
    color: "bg-orange-500",
    role: "Customer",
    lastMessage: "How do I update my billing address?",
    time: "Mon",
    unread: 0,
    online: false,
    pinned: false,
    status: "closed",
    phone: "+91 54321 09876",
    issue: "Account Help",
    orderId: "ORD-2024-5501",
  },
  {
    id: 6,
    name: "Deepika Nair",
    initials: "DN",
    color: "bg-teal-500",
    role: "Customer",
    lastMessage: "Payment was deducted but order not placed",
    time: "Mon",
    unread: 2,
    online: true,
    pinned: false,
    status: "urgent",
    phone: "+91 43210 98765",
    issue: "Payment Issue",
    orderId: "ORD-2024-5487",
  },
  {
    id: 7,
    name: "Arjun Mehta",
    initials: "AM",
    color: "bg-indigo-500",
    role: "Customer",
    lastMessage: "Got the refund, thanks!",
    time: "Sun",
    unread: 0,
    online: false,
    pinned: false,
    status: "closed",
    phone: "+91 32109 87654",
    issue: "Refund Request",
    orderId: "ORD-2024-5412",
  },
  {
    id: 8,
    name: "Pooja Reddy",
    initials: "PR",
    color: "bg-rose-500",
    role: "Customer",
    lastMessage: "When will my issue be escalated?",
    time: "Sun",
    unread: 1,
    online: false,
    pinned: false,
    status: "open",
    phone: "+91 21098 76543",
    issue: "Escalation",
    orderId: "ORD-2024-5388",
  },
];

const INITIAL_MESSAGES = {
  1: [
    {
      id: 1,
      type: "incoming",
      text: "Hi, I need help with my order #ORD-2024-5891",
      time: "10:30 AM",
      status: "read",
    },
    {
      id: 2,
      type: "outgoing",
      text: "Hello Rajesh! I'd be happy to help. Let me check your order details.",
      time: "10:31 AM",
      status: "read",
    },
    {
      id: 3,
      type: "incoming",
      text: "It was supposed to arrive 3 days ago. I've been waiting.",
      time: "10:32 AM",
      status: "read",
    },
    {
      id: 4,
      type: "outgoing",
      text: "I can see your order is in transit. There was a delay at the sorting facility. I'm escalating this to our logistics team right now.",
      time: "10:35 AM",
      status: "read",
    },
    {
      id: 5,
      type: "incoming",
      text: "My order hasn't arrived yet, it's been 5 days!",
      time: "10:42 AM",
      status: "delivered",
    },
  ],
  2: [
    {
      id: 1,
      type: "incoming",
      text: "Hi! My payment failed but money was deducted.",
      time: "9:00 AM",
      status: "read",
    },
    {
      id: 2,
      type: "outgoing",
      text: "I understand your concern. Let me look into this immediately.",
      time: "9:02 AM",
      status: "read",
    },
    {
      id: 3,
      type: "outgoing",
      text: "I've verified the transaction. Your money will be refunded within 3–5 business days.",
      time: "9:10 AM",
      status: "read",
    },
    {
      id: 4,
      type: "incoming",
      text: "Thank you for resolving my issue 😊",
      time: "9:15 AM",
      status: "read",
    },
  ],
  3: [
    {
      id: 1,
      type: "incoming",
      text: "Can I get a refund for my last order?",
      time: "Yesterday",
      status: "delivered",
    },
  ],
  5: [
    {
      id: 1,
      type: "incoming",
      text: "How do I update my billing address?",
      time: "Mon 2:10 PM",
      status: "read",
    },
    {
      id: 2,
      type: "outgoing",
      text: "You can update your billing address from Settings → Payment Methods → Edit Address.",
      time: "Mon 2:15 PM",
      status: "read",
    },
    {
      id: 3,
      type: "incoming",
      text: "Found it! Thanks.",
      time: "Mon 2:18 PM",
      status: "read",
    },
    {
      id: 4,
      type: "system",
      text: "Ticket closed by support agent",
      time: "Mon 2:20 PM",
    },
  ],
  7: [
    {
      id: 1,
      type: "incoming",
      text: "Got the refund, thanks!",
      time: "Sun 4:00 PM",
      status: "read",
    },
    {
      id: 2,
      type: "outgoing",
      text: "Glad we could help! Let us know if you need anything else.",
      time: "Sun 4:05 PM",
      status: "read",
    },
    {
      id: 3,
      type: "system",
      text: "Ticket closed by support agent",
      time: "Sun 4:06 PM",
    },
  ],
};

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function SupportChat() {
  const [contacts, setContacts] = useState(CONTACTS);
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [activeContact, setActiveContact] = useState(null);
  const [activeFilter, setActiveFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [showInfo, setShowInfo] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [sending, setSending] = useState(false);
  const [mobileView, setMobileView] = useState("list");

  const handleSelectContact = (contact) => {
    setActiveContact(contact);
    setShowInfo(false);
    setMobileView("chat");
    if (!messages[contact.id]) setMessages((p) => ({ ...p, [contact.id]: [] }));
  };

  const handleSend = useCallback(
    async ({ input, pendingFiles, resetForm }) => {
      const text = input?.trim();
      const files = pendingFiles || [];

      if ((!text && files.length === 0) || !activeContact || sending) return;

      setSending(true);

      const newMsg = {
        id: Date.now(),
        type: "outgoing",
        text: text || null,
        files: files.length ? files : undefined,
        time: new Date().toLocaleTimeString("en-IN", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        status: "sent",
      };

      setMessages((p) => ({
        ...p,
        [activeContact.id]: [...(p[activeContact.id] || []), newMsg],
      }));

      resetForm();

      setTimeout(() => {
        setMessages((p) => ({
          ...p,
          [activeContact.id]: p[activeContact.id].map((m) =>
            m.id === newMsg.id ? { ...m, status: "delivered" } : m,
          ),
        }));
        setSending(false);
      }, 800);
    },
    [activeContact, sending],
  );

  const handleStatusChange = (newStatus) => {
    if (!activeContact) return;
    const isClosing = newStatus === "closed";
    setContacts((p) =>
      p.map((c) =>
        c.id === activeContact.id ? { ...c, status: newStatus } : c,
      ),
    );
    setActiveContact((p) => ({ ...p, status: newStatus }));

    if (isClosing) {
      const sysMsg = {
        id: Date.now(),
        type: "system",
        text: "Ticket closed by support agent",
        time: new Date().toLocaleTimeString("en-IN", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setMessages((p) => ({
        ...p,
        [activeContact.id]: [...(p[activeContact.id] || []), sysMsg],
      }));
    }
    setShowStatusModal(false);
  };

  const currentMessages = activeContact ? messages[activeContact.id] || [] : [];
  const totalUnread = contacts.reduce((s, c) => s + c.unread, 0);

  const openStatusChange = (e) => {
    e.stopPropagation();
    setShowStatusModal(true);
  };

  return (
    <>
      <div
        className="flex bg-white overflow-hidden  border border-gray-200 "
        style={{ height: "calc(100dvh )" }}
      >
        <ChatSidebar
          mobileView={mobileView}
          totalUnread={totalUnread}
          search={search}
          setSearch={setSearch}
          activeFilter={activeFilter}
          setActiveFilter={setActiveFilter}
          contacts={contacts}
          activeContact={activeContact}
          onSelect={handleSelectContact}
        />

        <ChatScreen
          mobileView={mobileView}
          setMobileView={setMobileView}
          showInfo={showInfo}
          onViewInfo={() => setShowInfo(true)}
          onStatusChange={openStatusChange}
          activeContact={activeContact}
          messages={currentMessages}
          sending={sending}
          handleSend={handleSend}
        />
        
        {showInfo && activeContact && (
          <SupportInfoPanel
            contact={activeContact}
            onClose={() => setShowInfo(false)}
            onStatusChange={openStatusChange}
          />
        )}
      </div>

      <SupportStatusModal
        isOpen={showStatusModal}
        onClose={() => setShowStatusModal(false)}
        current={activeContact?.status}
        onSubmit={handleStatusChange}
      />

      <style>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </>
  );
}
