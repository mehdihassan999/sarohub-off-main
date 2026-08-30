import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, X, Send, Bot, User, Minus, Sparkles, Shield, RefreshCw, Cpu, Trash2 } from 'lucide-react';
import { api } from '../api';
import { ChatMessage, ChatSession } from '../types';

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [sessionId, setSessionId] = useState<string>('');
  const [visitorName, setVisitorName] = useState('');
  const [visitorPhone, setVisitorPhone] = useState('');
  const [visitorEmail, setVisitorEmail] = useState('');
  const [isRegistered, setIsRegistered] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [agentStatus, setAgentStatus] = useState<'online' | 'away' | 'offline'>('online');
  const [isSending, setIsSending] = useState(false);
  const [sessionClosed, setSessionClosed] = useState(false);
  const [hasNewUnread, setHasNewUnread] = useState(false);
  const [isUsingFallback, setIsUsingFallback] = useState(false);
  const [isWaitingForReply, setIsWaitingForReply] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const lastMessageCountRef = useRef(0);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // 1. Initialize or load existing session from localStorage
  useEffect(() => {
    let storedSessionId = localStorage.getItem('sarohub_chat_session_id');
    let storedVisitorName = localStorage.getItem('sarohub_chat_visitor_name');
    let storedVisitorPhone = localStorage.getItem('sarohub_chat_visitor_phone');
    let storedVisitorEmail = localStorage.getItem('sarohub_chat_visitor_email');

    if (!storedSessionId) {
      storedSessionId = 'sess-' + Date.now() + '-' + Math.floor(Math.random() * 100000);
      localStorage.setItem('sarohub_chat_session_id', storedSessionId);
    }

    setSessionId(storedSessionId);

    if (storedVisitorName && storedVisitorPhone && storedVisitorEmail) {
      setVisitorName(storedVisitorName);
      setVisitorPhone(storedVisitorPhone);
      setVisitorEmail(storedVisitorEmail);
      setIsRegistered(true);
    }

    // Fetch initial agent status
    fetchAgentStatus();
  }, []);

  // 2. Poll for new messages when widget is open and visitor is registered
  useEffect(() => {
    if (isOpen && isRegistered && sessionId) {
      // Fetch immediately
      fetchSessionDetails();

      // Start polling
      pollingIntervalRef.current = setInterval(() => {
        fetchSessionDetails();
      }, 3000);
    } else {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
        pollingIntervalRef.current = null;
      }
    }

    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, [isOpen, isRegistered, sessionId]);

  // Scroll to bottom on new messages + detect new reply to stop loading
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
    // If we're waiting for a reply and a new non-visitor message arrived, stop waiting
    if (isWaitingForReply && messages.length > lastMessageCountRef.current) {
      const lastMsg = messages[messages.length - 1];
      if (lastMsg && lastMsg.sender !== 'visitor') {
        setIsWaitingForReply(false);
      }
    }
    lastMessageCountRef.current = messages.length;
  }, [messages, isWaitingForReply]);

  const getFallbackReply = (userText: string) => {
    const lower = userText.toLowerCase();

    if (lower.includes('price') || lower.includes('cost') || lower.includes('quote')) {
      return 'Our pricing is custom to each engagement. A SaroHub consultant can share a tailored proposal based on your scope and timeline.';
    }

    if (lower.includes('service') || lower.includes('solution') || lower.includes('product')) {
      return 'We support custom software, SaaS platforms, AI automation, and enterprise-grade digital solutions. Tell us what you are building and we can guide the next step.';
    }

    if (lower.includes('hello') || lower.includes('hi')) {
      return 'Hello! Thanks for reaching out to SaroHub. I can help with product questions, service details, or next steps for a project.';
    }

    return 'Thanks for your message. Our team is reviewing your inquiry, and we will follow up shortly with the best next step.';
  };

  const fetchAgentStatus = async () => {
    try {
      const res = await api.getAgentStatus();
      setAgentStatus(res.availability);
    } catch (err) {
      console.error('Failed to load agent status', err);
      setAgentStatus('online');
    }
  };

  const fetchSessionDetails = async () => {
    if (!sessionId) return;
    try {
      const session: ChatSession = await api.getChatSession(sessionId);
      if (session) {
        setMessages(session.messages || []);
        setSessionClosed(session.status === 'closed');

        // Check if there are unread messages for the visitor
        if (session.visitor_unread && !isOpen) {
          setHasNewUnread(true);
        }
      }
    } catch (err) {
      // If session doesn't exist on backend, it's fine (will be created on first message)
    }
  };

  const handleClearChat = async () => {
    try {
      if (sessionId) {
        await api.deleteChatSession(sessionId);
      }
    } catch (err) {
      console.error('Failed to delete chat session on server', err);
    }
    const newSessionId = 'sess-' + Date.now() + '-' + Math.floor(Math.random() * 100000);
    localStorage.setItem('sarohub_chat_session_id', newSessionId);
    setSessionId(newSessionId);
    setMessages([
      {
        id: 'welcome-' + Date.now(),
        sender: 'system',
        text: `Chat cleared. RinaAI Online. How can I assist you today?`,
        created_at: new Date().toISOString()
      }
    ]);
    setSessionClosed(false);
    setHasNewUnread(false);
    setShowClearConfirm(false);
  };

  const handleRefresh = async () => {
    if (isRefreshing) return;
    setIsRefreshing(true);
    try {
      await Promise.all([fetchSessionDetails(), fetchAgentStatus()]);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!visitorName.trim()) return;

    localStorage.setItem('sarohub_chat_visitor_name', visitorName);
    localStorage.setItem('sarohub_chat_visitor_phone', visitorPhone);
    localStorage.setItem('sarohub_chat_visitor_email', visitorEmail);
    setIsRegistered(true);
    setIsUsingFallback(false);

    // Seed welcoming system message locally until first server transmission
    setMessages([
      {
        id: 'welcome',
        sender: 'system',
        text: `RinaAI Online. Welcome, ${visitorName}! How can I assist you today?`,
        created_at: new Date().toISOString()
      }
    ]);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !sessionId || isSending || sessionClosed) return;

    const messageText = inputText;
    setInputText('');
    setIsSending(true);
    setIsWaitingForReply(true);

    // Optimistically add message
    const tempId = 'temp-' + Date.now();
    const newMsg: ChatMessage = {
      id: tempId,
      sender: 'visitor',
      text: messageText,
      created_at: new Date().toISOString()
    };
    setMessages(prev => [...prev, newMsg]);

    try {
      await api.sendChatMessage(sessionId, {
        sender: 'visitor',
        text: messageText,
        visitorName,
        visitorPhone,
        visitorEmail
      });

      // Fetch the reply (server generates it synchronously before responding)
      try {
        await fetchSessionDetails();
      } catch (err) {
        console.error('Failed to refresh chat session', err);
      }
    } catch (err) {
      console.error('Failed to send message', err);
      setIsUsingFallback(true);
      setIsWaitingForReply(false);
      setMessages(prev => [...prev, {
        id: 'fallback-' + Date.now(),
        sender: 'agent',
        text: `[AI Assistant] ${getFallbackReply(messageText)}`,
        created_at: new Date().toISOString()
      }]);
    } finally {
      setIsSending(false);
    }
  };

  const toggleWidget = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setHasNewUnread(false);
      fetchAgentStatus();
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ type: 'spring', damping: 20, stiffness: 260 }}
            className="w-[calc(100vw-32px)] sm:w-[380px] h-[520px] rounded-3xl overflow-hidden glass bg-slate-950/85 border border-slate-800/80 shadow-2xl flex flex-col mb-4 relative"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-slate-900/90 to-slate-950/90 border-b border-slate-900 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="h-10 w-10 rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                    <Cpu className="h-5 w-5 animate-spin-slow" />
                  </div>
                  {/* Status Indicator Dot */}
                  <span className={`absolute bottom-0 right-0 block h-3 w-3 rounded-full border-2 border-slate-950 ${agentStatus === 'online' ? 'bg-emerald-400' : agentStatus === 'away' ? 'bg-amber-400 animate-pulse' : 'bg-slate-500'
                    }`} />
                </div>
                <div>
                  <h3 className="text-xs font-mono font-bold tracking-wider text-white">RinaAI Assistant</h3>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="text-[10px] font-mono text-slate-400">
                      Status: <span className={
                        agentStatus === 'online' ? 'text-emerald-400 font-bold' : agentStatus === 'away' ? 'text-amber-400' : 'text-slate-500'
                      }>{agentStatus.toUpperCase()}</span>
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowClearConfirm(true)}
                  className="p-1 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-900/60 transition-all cursor-pointer"
                  title="Clear Chat History"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
                <button
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                  className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900/60 transition-all cursor-pointer disabled:opacity-60"
                  title="Force Synchronize"
                >
                  <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                </button>
                <button
                  onClick={toggleWidget}
                  className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900/60 transition-all cursor-pointer"
                >
                  <Minus className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Content Body */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-slate-950/40 flex flex-col">
              {!isRegistered ? (
                /* Registration Screen */
                <form onSubmit={handleRegister} className="my-auto space-y-4">
                  <div className="text-center space-y-2 mb-6">
                    <div className="h-12 w-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mx-auto">
                      <Sparkles className="h-6 w-6" />
                    </div>
                    <h4 className="font-display font-bold text-white text-base">Chat with RinaAI</h4>
                    <p className="text-xs text-slate-500 max-w-[220px] mx-auto leading-relaxed">
                      Enter your details to start a conversation with RinaAI, your intelligent assistant.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-[10px] font-mono text-slate-500 uppercase tracking-wider mb-1">Your Full Name</label>
                      <input
                        type="text"
                        required
                        value={visitorName}
                        onChange={e => setVisitorName(e.target.value)}
                        placeholder="e.g. Ruwanthi Perera"
                        className="w-full text-xs bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500/50 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono text-slate-500 uppercase tracking-wider mb-1">Phone Number</label>
                      <input
                        type="tel"
                        required
                        value={visitorPhone}
                        onChange={e => setVisitorPhone(e.target.value)}
                        placeholder="e.g. +92 300 1234567"
                        className="w-full text-xs bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500/50 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono text-slate-500 uppercase tracking-wider mb-1">Email Address</label>
                      <input
                        type="email"
                        value={visitorEmail}
                        onChange={e => setVisitorEmail(e.target.value)}
                        placeholder="e.g. ruwanthi@enterprise.lk"
                        className="w-full text-xs bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500/50 transition-all"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full mt-4 py-3 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs font-mono uppercase tracking-wider hover:bg-cyan-400 transition-all cursor-pointer shadow-[0_4px_12px_rgba(6,182,212,0.2)]"
                    >
                      Authenticate & Chat
                    </button>
                  </div>
                </form>
              ) : (
                /* Chat Messages Screen */
                <>
                  {agentStatus !== 'online' && (
                    <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-3 flex gap-2 items-start shrink-0">
                      <Bot className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="text-[10px] font-mono text-amber-400 font-bold block">RinaAI Active</span>
                        <p className="text-[9px] text-slate-400 leading-normal mt-0.5">
                          Support engineers are away. RinaAI is online to answer your questions.
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="flex-1 space-y-3 pr-1">
                    {messages.map((m) => {
                      const isVisitor = m.sender === 'visitor';
                      const isSystem = m.sender === 'system';
                      const isAI = m.text.startsWith('[AI Assistant]');
                      const messageText = isAI ? m.text.replace('[AI Assistant]', '').trim() : m.text;

                      if (isSystem) {
                        return (
                          <div key={m.id} className="text-center py-1 shrink-0">
                            <span className="inline-block rounded-md bg-slate-900 border border-slate-800/60 px-2.5 py-1 text-[9px] font-mono text-slate-500 leading-none">
                              {m.text}
                            </span>
                          </div>
                        );
                      }

                      return (
                        <div
                          key={m.id}
                          className={`flex ${isVisitor ? 'justify-end' : 'justify-start'} items-start gap-2.5 max-w-full`}
                        >
                          {!isVisitor && (
                            <div className={`h-7 w-7 rounded-full shrink-0 flex items-center justify-center text-[10px] ${isAI ? 'bg-cyan-950 border border-cyan-500/20 text-cyan-400' : 'bg-slate-900 border border-slate-800 text-slate-300'
                              }`}>
                              {isAI ? <Bot className="h-4 w-4" /> : <User className="h-4 w-4" />}
                            </div>
                          )}
                          <div className={`flex flex-col max-w-[80%] ${isVisitor ? 'items-end' : 'items-start'}`}>
                            <div className={`rounded-2xl px-4 py-2.5 text-xs leading-relaxed ${isVisitor
                              ? 'bg-cyan-500 text-slate-950 font-medium rounded-tr-none'
                              : isAI
                                ? 'bg-cyan-950/30 border border-cyan-500/20 text-cyan-100 rounded-tl-none font-sans'
                                : 'bg-slate-900 border border-slate-800 text-slate-100 rounded-tl-none'
                              }`}>
                              {messageText}
                            </div>
                            <span className="text-[8px] font-mono text-slate-600 mt-1">
                              {new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                    {/* Typing Indicator */}
                    {isWaitingForReply && (
                      <div className="flex justify-start items-start gap-2.5">
                        <div className="h-7 w-7 rounded-full shrink-0 flex items-center justify-center bg-cyan-950 border border-cyan-500/20 text-cyan-400">
                          <Bot className="h-4 w-4" />
                        </div>
                        <div className="rounded-2xl px-4 py-3 bg-cyan-950/30 border border-cyan-500/20 rounded-tl-none">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] font-mono text-cyan-400/70 mr-1">RinaAI is typing</span>
                            <motion.span
                              className="inline-block h-1.5 w-1.5 rounded-full bg-cyan-400"
                              animate={{ opacity: [0.3, 1, 0.3] }}
                              transition={{ duration: 1.2, repeat: Infinity, delay: 0 }}
                            />
                            <motion.span
                              className="inline-block h-1.5 w-1.5 rounded-full bg-cyan-400"
                              animate={{ opacity: [0.3, 1, 0.3] }}
                              transition={{ duration: 1.2, repeat: Infinity, delay: 0.2 }}
                            />
                            <motion.span
                              className="inline-block h-1.5 w-1.5 rounded-full bg-cyan-400"
                              animate={{ opacity: [0.3, 1, 0.3] }}
                              transition={{ duration: 1.2, repeat: Infinity, delay: 0.4 }}
                            />
                          </div>
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>
                </>
              )}
            </div>

            {/* Input Footer Area */}
            {isRegistered && (
              <div className="border-t border-slate-900/80 bg-slate-950/60 p-4">
                {sessionClosed ? (
                  <div className="rounded-xl border border-rose-950 bg-rose-950/20 p-2.5 text-center shrink-0">
                    <span className="text-[10px] font-mono text-rose-400">Session Closed by Administrator</span>
                  </div>
                ) : (
                  <form onSubmit={handleSendMessage} className="flex gap-2">
                    <input
                      type="text"
                      value={inputText}
                      onChange={e => setInputText(e.target.value)}
                      placeholder="Ask RinaAI anything..."
                      disabled={isSending}
                      className="flex-1 text-xs bg-slate-900/90 border border-slate-800 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500/40 transition-all disabled:opacity-50"
                    />
                    <button
                      type="submit"
                      disabled={!inputText.trim() || isSending}
                      className="h-11 w-11 rounded-xl bg-cyan-500 text-slate-950 flex items-center justify-center hover:bg-cyan-400 active:scale-95 disabled:opacity-40 disabled:scale-100 transition-all cursor-pointer"
                    >
                      <Send className="h-4 w-4" />
                    </button>
                  </form>
                )}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showClearConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4"
            role="presentation"
            onClick={() => setShowClearConfirm(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: 12, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.96 }}
              className="w-full max-w-[320px] rounded-2xl bg-slate-900 border border-slate-700 p-5 shadow-2xl"
              role="dialog"
              aria-modal="true"
              aria-labelledby="clear-chat-title"
              onClick={event => event.stopPropagation()}
            >
              <h4 id="clear-chat-title" className="font-display font-bold text-white">Clear conversation?</h4>
              <p className="mt-2 text-xs leading-relaxed text-slate-400">This will permanently remove your current chat history.</p>
              <div className="mt-5 flex justify-end gap-2">
                <button type="button" onClick={() => setShowClearConfirm(false)} className="rounded-lg px-3 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-800 cursor-pointer">Cancel</button>
                <button type="button" onClick={handleClearChat} className="rounded-lg bg-rose-500 px-3 py-2 text-xs font-semibold text-white hover:bg-rose-400 cursor-pointer">Clear chat</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Toggle Button */}
      <button
        onClick={toggleWidget}
        className="relative h-14 w-14 rounded-full bg-gradient-to-tr from-cyan-500 to-indigo-600 hover:scale-105 active:scale-95 transition-all flex items-center justify-center cursor-pointer shadow-[0_8px_24px_rgba(6,182,212,0.4)] border border-cyan-400/20"
        aria-label="Open support portal"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <X className="h-6 w-6 text-white" />
            </motion.div>
          ) : (
            <motion.div
              key="chat"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="relative"
            >
              <MessageSquare className="h-6 w-6 text-white" />
              {/* Unread Alert Dot */}
              {hasNewUnread && (
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500"></span>
                </span>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </button>
    </div>
  );
}
