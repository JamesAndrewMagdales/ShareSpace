import React, { useState } from 'react';
import { 
  MessageCircle, 
  Search, 
  Send, 
  Clock,
  Check,
  ArrowLeft
} from 'lucide-react';
import './Messages.css';

const Messages = () => {
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const conversations = [
    {
      id: 1,
      user: { name: 'Sarah Johnson', avatar: null, online: true },
      lastMessage: 'Thanks for the great service!',
      time: '2 hours ago',
      unread: 2,
      messages: [
        { id: 1, sender: 'them', text: 'Hi! I need help with my website.', time: '10:00 AM' },
        { id: 2, sender: 'me', text: 'Sure! What kind of help do you need?', time: '10:05 AM' },
        { id: 3, sender: 'them', text: 'I need a new landing page designed.', time: '10:10 AM' },
        { id: 4, sender: 'them', text: 'Thanks for the great service!', time: '2 hours ago' },
      ]
    },
    {
      id: 2,
      user: { name: 'Mike Chen', avatar: null, online: false },
      lastMessage: 'When can we schedule the session?',
      time: 'Yesterday',
      unread: 0,
      messages: [
        { id: 1, sender: 'me', text: 'Hello Mike, are you available for guitar lessons?', time: 'Yesterday 9:00 AM' },
        { id: 2, sender: 'them', text: 'Yes! I have slots available on weekends.', time: 'Yesterday 9:30 AM' },
        { id: 3, sender: 'them', text: 'When can we schedule the session?', time: 'Yesterday 9:35 AM' },
      ]
    },
    {
      id: 3,
      user: { name: 'Emma Wilson', avatar: null, online: true },
      lastMessage: 'Perfect, see you tomorrow!',
      time: 'Monday',
      unread: 0,
      messages: [
        { id: 1, sender: 'them', text: 'Is the yoga session still on for tomorrow?', time: 'Monday 3:00 PM' },
        { id: 2, sender: 'me', text: 'Yes, 10 AM works for me.', time: 'Monday 3:15 PM' },
        { id: 3, sender: 'them', text: 'Perfect, see you tomorrow!', time: 'Monday 3:20 PM' },
      ]
    }
  ];

  const filteredConversations = conversations.filter(conv =>
    conv.user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      setNewMessage('');
    }
  };

  return (
    <div className="messages-page">
      <div className="messages-container">
        {/* Conversations List */}
        <aside className={`conversations-panel ${selectedConversation ? 'hidden' : ''}`}>
          <div className="panel-header">
            <h2>Messages</h2>
          </div>
          
          <div className="search-messages">
            <Search size={18} />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="conversations-list">
            {filteredConversations.map((conv) => (
              <div
                key={conv.id}
                className={`conversation-item ${selectedConversation?.id === conv.id ? 'active' : ''}`}
                onClick={() => setSelectedConversation(conv)}
              >
                <div className="conversation-avatar">
                  <MessageCircle size={24} />
                  {conv.user.online && <span className="online-indicator"></span>}
                </div>
                <div className="conversation-info">
                  <div className="conversation-header">
                    <h4>{conv.user.name}</h4>
                    <span className="conversation-time">{conv.time}</span>
                  </div>
                  <p className="conversation-preview">{conv.lastMessage}</p>
                </div>
                {conv.unread > 0 && (
                  <span className="unread-badge">{conv.unread}</span>
                )}
              </div>
            ))}
          </div>
        </aside>

        {/* Chat Area */}
        <main className={`chat-panel ${!selectedConversation ? 'hidden' : ''}`}>
          {selectedConversation ? (
            <>
              <div className="chat-header">
                <button 
                  className="back-btn"
                  onClick={() => setSelectedConversation(null)}
                >
                  <ArrowLeft size={20} />
                </button>
                <div className="chat-user-info">
                  <div className="chat-avatar">
                    <MessageCircle size={24} />
                    {selectedConversation.user.online && <span className="online-indicator"></span>}
                  </div>
                  <div>
                    <h3>{selectedConversation.user.name}</h3>
                    <span className="online-status">
                      {selectedConversation.user.online ? 'Online' : 'Offline'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="messages-list">
                {selectedConversation.messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`message ${msg.sender === 'me' ? 'sent' : 'received'}`}
                  >
                    <div className="message-bubble">
                      <p>{msg.text}</p>
                    </div>
                    <div className="message-meta">
                      <span className="message-time">{msg.time}</span>
                      {msg.sender === 'me' && (
                        <Check size={14} className="message-check" />
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <form className="message-input" onSubmit={handleSendMessage}>
                <input
                  type="text"
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                />
                <button type="submit" className="send-btn">
                  <Send size={20} />
                </button>
              </form>
            </>
          ) : (
            <div className="no-conversation">
              <MessageCircle size={64} />
              <h3>Select a conversation</h3>
              <p>Choose a message to start chatting</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Messages;