import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  MessageSquare,
  X,
  Send,
  Bot,
  User,
  Minus,
  Sparkles,
  RefreshCw,
  Cpu,
  Trash2,
  ChevronDown,
  Plus,
  Copy,
  Check,
  Clock,
  ShieldCheck
} from 'lucide-react';
import { api } from '../api';
import { ChatMessage, ChatSession } from '../types';

interface SavedConversationSummary {
  id: string;
  preview: string;
  updatedAt: string;
  messageCount: number;
}

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
  const [isWaitingForReply, setIsWaitingForReply] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [conversationHistory, setConversationHistory] = useState<SavedConversationSummary[]>([]);
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
  const [deletingMessageId, setDeletingMessageId] = useState<string | null>(null);

  // Dedicated container ref for internal scrolling ONLY (prevents outer webpage from jumping)
  const chatScrollContainerRef = useRef<HTMLDivElement>(null);
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Helper to load user's conversations list from localStorage
  const loadSavedConversationsList = (): SavedConversationSummary[] => {
    try {
      const stored = localStorage.getItem('sarohub_chat_conversations_history');
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error('Failed to parse chat conversations history', e);
    }
    return [];
  };

  const saveConversationSummary = (sessId: string, msgs: ChatMessage[]) => {
    if (!sessId) return;
    try {
      const currentList = loadSavedConversationsList();
      const nonSystem = msgs.filter(m => m.sender !== 'system');
      const lastMsg = nonSystem.length > 0 ? nonSystem[nonSystem.length - 1] : (msgs.length > 0 ? msgs[msgs.length - 1] : null);
      let previewText = 'New Conversation';
      if (lastMsg) {
        previewText = lastMsg.text.replace(/^\[AI Assistant\]\s*/, '').trim().slice(0, 45);
      }

      const existingIndex = currentList.findIndex(item => item.id === sessId);
      const summaryItem: SavedConversationSummary = {
        id: sessId,
        preview: previewText || 'Conversation thread',
        updatedAt: new Date().toISOString(),
        messageCount: msgs.filter(m => m.sender !== 'system').length
      };

      let updatedList: SavedConversationSummary[];
      if (existingIndex >= 0) {
        currentList[existingIndex] = summaryItem;
        updatedList = [...currentList];
      } else {
        updatedList = [summaryItem, ...currentList].slice(0, 15); // keep latest 15 conversations
      }

      localStorage.setItem('sarohub_chat_conversations_history', JSON.stringify(updatedList));
      setConversationHistory(updatedList);
    } catch (err) {
      console.error('Failed to save conversation summary', err);
    }
  };

  // Safe container-only scrolling (does NOT scroll the outer window)
  const scrollToBottom = (behavior: ScrollBehavior = 'smooth') => {
    if (chatScrollContainerRef.current) {
      chatScrollContainerRef.current.scrollTo({
        top: chatScrollContainerRef.current.scrollHeight,
        behavior
      });
    }
  };

  // 1. Initialize or load existing session from localStorage
  useEffect(() => {
    let storedSessionId = localStorage.getItem('sarohub_chat_session_id');
    const storedVisitorName = localStorage.getItem('sarohub_chat_visitor_name');
    const storedVisitorPhone = localStorage.getItem('sarohub_chat_visitor_phone');
    const storedVisitorEmail = localStorage.getItem('sarohub_chat_visitor_email');

    if (!storedSessionId) {
      storedSessionId = 'sess-' + Date.now() + '-' + Math.floor(Math.random() * 100000);
      localStorage.setItem('sarohub_chat_session_id', storedSessionId);
    }

    setSessionId(storedSessionId);
    setConversationHistory(loadSavedConversationsList());

    if (storedVisitorName && storedVisitorPhone) {
      setVisitorName(storedVisitorName);
      setVisitorPhone(storedVisitorPhone);
      setVisitorEmail(storedVisitorEmail || '');
      setIsRegistered(true);
    }

    fetchAgentStatus();
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDropdown]);

  // 2. Poll for new messages when widget is open and visitor is registered
  useEffect(() => {
    if (isOpen && isRegistered && sessionId) {
      fetchSessionDetails(sessionId);

      pollingIntervalRef.current = setInterval(() => {
        fetchSessionDetails(sessionId);
      }, 3500);
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

  // Auto-scroll strictly within chat container on new messages or waiting changes
  useEffect(() => {
    if (isOpen) {
      scrollToBottom('smooth');
    }
  }, [messages, isWaitingForReply, isOpen]);

  const fetchAgentStatus = async () => {
    try {
      const res = await api.getAgentStatus();
      setAgentStatus(res.availability || 'online');
    } catch (err) {
      setAgentStatus('online');
    }
  };

  const fetchSessionDetails = async (targetSessionId = sessionId) => {
    if (!targetSessionId) return;
    try {
      const session: ChatSession = await api.getChatSession(targetSessionId);
      if (session) {
        const msgs = session.messages || [];
        setMessages(msgs);
        setSessionClosed(session.status === 'closed');
        saveConversationSummary(targetSessionId, msgs);

        if (session.visitor_unread && !isOpen) {
          setHasNewUnread(true);
        }

        // If we were waiting for a reply and received one, stop waiting
        if (isWaitingForReply) {
          const lastMsg = msgs[msgs.length - 1];
          if (lastMsg && lastMsg.sender !== 'visitor') {
            setIsWaitingForReply(false);
          }
        }
      }
    } catch (err) {
      // Session might not be initialized on backend yet
    }
  };

  // Switch to an existing conversation
  const handleSelectConversation = (targetSessionId: string) => {
    if (targetSessionId === sessionId) {
      setShowDropdown(false);
      return;
    }
    setSessionId(targetSessionId);
    localStorage.setItem('sarohub_chat_session_id', targetSessionId);
    setShowDropdown(false);
    setIsWaitingForReply(false);
    fetchSessionDetails(targetSessionId);
  };

  // Start a fresh new conversation thread
  const handleStartNewConversation = () => {
    const newSessionId = 'sess-' + Date.now() + '-' + Math.floor(Math.random() * 100000);
    localStorage.setItem('sarohub_chat_session_id', newSessionId);
    setSessionId(newSessionId);
    setSessionClosed(false);
    setHasNewUnread(false);
    setIsWaitingForReply(false);
    setShowDropdown(false);

    const initialWelcomeMsg: ChatMessage = {
      id: 'welcome-' + Date.now(),
      sender: 'system',
      text: `New conversation initialized. RinaAI is online to assist you.`,
      created_at: new Date().toISOString()
    };
    setMessages([initialWelcomeMsg]);
    saveConversationSummary(newSessionId, [initialWelcomeMsg]);
  };

  // Delete entire conversation group
  const handleClearChat = async () => {
    const targetSessionId = sessionId;
    // Optimistically update local view first
    const newSessionId = 'sess-' + Date.now() + '-' + Math.floor(Math.random() * 100000);
    localStorage.setItem('sarohub_chat_session_id', newSessionId);
    setSessionId(newSessionId);
    setMessages([
      {
        id: 'welcome-' + Date.now(),
        sender: 'system',
        text: `Conversation cleared. RinaAI is online. How can we assist you today?`,
        created_at: new Date().toISOString()
      }
    ]);
    setSessionClosed(false);
    setHasNewUnread(false);
    setShowClearConfirm(false);

    // Remove from local conversation history
    const remaining = loadSavedConversationsList().filter(item => item.id !== targetSessionId);
    localStorage.setItem('sarohub_chat_conversations_history', JSON.stringify(remaining));
    setConversationHistory(remaining);

    try {
      if (targetSessionId) {
        await api.deleteChatSession(targetSessionId);
      }
    } catch (err) {
      console.warn('Failed to delete chat session on server:', err);
    }
  };

  // Delete a single message with instant optimistic removal
  const handleDeleteSingleMessage = async (e: React.MouseEvent, msgId: string) => {
    e.stopPropagation();
    e.preventDefault();
    if (!sessionId || !msgId) return;

    setDeletingMessageId(msgId);

    // Instant optimistic update on local UI
    setMessages(prev => {
      const updated = prev.filter(m => String(m.id) !== String(msgId));
      saveConversationSummary(sessionId, updated);
      return updated;
    });

    try {
      await api.deleteChatMessage(sessionId, msgId);
    } catch (err) {
      console.warn('Backend delete message call failed or was local-only:', err);
    } finally {
      setDeletingMessageId(null);
    }
  };

  // Copy message text to clipboard
  const handleCopyMessage = (e: React.MouseEvent, msgId: string, text: string) => {
    e.stopPropagation();
    e.preventDefault();
    const cleanText = text.replace(/^\[AI Assistant\]\s*/, '').trim();
    navigator.clipboard.writeText(cleanText);
    setCopiedMessageId(msgId);
    setTimeout(() => {
      setCopiedMessageId(null);
    }, 2000);
  };

  const handleRefresh = async () => {
    if (isRefreshing) return;
    setIsRefreshing(true);
    try {
      await Promise.all([fetchSessionDetails(sessionId), fetchAgentStatus()]);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!visitorName.trim() || !visitorPhone.trim()) return;

    localStorage.setItem('sarohub_chat_visitor_name', visitorName);
    localStorage.setItem('sarohub_chat_visitor_phone', visitorPhone);
    localStorage.setItem('sarohub_chat_visitor_email', visitorEmail);
    setIsRegistered(true);

    const initialWelcomeMsg: ChatMessage = {
      id: 'welcome-' + Date.now(),
      sender: 'system',
      text: `RinaAI is online. Welcome, ${visitorName}! How can I assist you with SaroHub's software development, AI solutions, or venture building today?`,
      created_at: new Date().toISOString()
    };
    setMessages([initialWelcomeMsg]);
    saveConversationSummary(sessionId, [initialWelcomeMsg]);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !sessionId || isSending) return;

    if (sessionClosed) {
      setSessionClosed(false);
    }

    const messageText = inputText.trim();
    setInputText('');
    setIsSending(true);
    setIsWaitingForReply(true);

    const tempId = 'temp-' + Date.now();
    const newMsg: ChatMessage = {
      id: tempId,
      sender: 'visitor',
      text: messageText,
      created_at: new Date().toISOString()
    };

    setMessages(prev => {
      const updated = [...prev, newMsg];
      saveConversationSummary(sessionId, updated);
      return updated;
    });

    try {
      const res = await api.sendChatMessage(sessionId, {
        sender: 'visitor',
        text: messageText,
        visitorName,
        visitorPhone,
        visitorEmail
      });

      if (res && res.session && res.session.messages) {
        setMessages(res.session.messages);
        setSessionClosed(false);
        saveConversationSummary(sessionId, res.session.messages);
        setIsWaitingForReply(false);
      } else {
        await fetchSessionDetails(sessionId);
      }
    } catch (err) {
      console.error('Failed to transmit message', err);
      // Fallback message locally if network failed
      setTimeout(() => {
        setIsWaitingForReply(false);
        setMessages(prev => {
          const fallbackMsg: ChatMessage = {
            id: 'fallback-' + Date.now(),
            sender: 'agent',
            text: `[AI Assistant] Thank you for your inquiry regarding "${messageText.slice(0, 30)}...". Our engineering and consulting directors are reviewing your request and will follow up shortly. You can also reach us directly at info@sarohub.com or +92 3430381471.`,
            created_at: new Date().toISOString()
          };
          const updated = [...prev, fallbackMsg];
          saveConversationSummary(sessionId, updated);
          return updated;
        });
      }, 800);
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
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end" id="sarohub-ai-chat-root">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ type: 'spring', damping: 24, stiffness: 300 }}
            className="w-[calc(100vw-32px)] sm:w-[420px] h-[580px] max-h-[calc(100vh-100px)] rounded-3xl overflow-hidden bg-slate-950/98 backdrop-blur-2xl border border-cyan-500/25 shadow-[0_20px_60px_rgba(0,0,0,0.85)] flex flex-col mb-4 relative z-50 text-slate-100"
          >
            {/* Top Bar Header - Matches SaroHub Website Navbar styling */}
            <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border-b border-cyan-500/20 px-4 py-3 flex items-center justify-between shrink-0 shadow-md">
              <div className="flex items-center gap-3 min-w-0">
                <div className="relative shrink-0">
                  <div className="h-10 w-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.25)]">
                    <Cpu className="h-5 w-5 animate-pulse text-cyan-400" />
                  </div>
                  {/* Status Indicator Dot */}
                  <span
                    className={`absolute -bottom-0.5 -right-0.5 block h-3 w-3 rounded-full border-2 border-slate-950 ${
                      agentStatus === 'online'
                        ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]'
                        : agentStatus === 'away'
                        ? 'bg-amber-400 animate-pulse'
                        : 'bg-slate-500'
                    }`}
                  />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-xs font-display font-bold tracking-tight text-white truncate">
                      RinaAI Virtual Assistant
                    </h3>
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-bold uppercase tracking-wider">
                      AI
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
                      <span className="text-slate-500">SYSTEM:</span>
                      <span
                        className={
                          agentStatus === 'online'
                            ? 'text-emerald-400 font-semibold'
                            : agentStatus === 'away'
                            ? 'text-amber-400 font-semibold'
                            : 'text-slate-400'
                        }
                      >
                        {agentStatus.toUpperCase()}
                      </span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-1 shrink-0">
                {isRegistered && (
                  <button
                    type="button"
                    onClick={() => setShowClearConfirm(true)}
                    className="p-1.5 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-950/30 border border-transparent hover:border-rose-900/50 transition-all cursor-pointer"
                    title="Delete / Clear entire conversation"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-cyan-300 hover:bg-slate-900 border border-transparent hover:border-slate-800 transition-all cursor-pointer disabled:opacity-50"
                  title="Synchronize session"
                >
                  <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                </button>
                <button
                  type="button"
                  onClick={toggleWidget}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900 border border-transparent hover:border-slate-800 transition-all cursor-pointer"
                  title="Minimize"
                >
                  <Minus className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Conversation Selector / History Dropdown Bar */}
            {isRegistered && (
              <div
                className="bg-slate-900/90 border-b border-slate-800 px-4 py-2 flex items-center justify-between relative z-20 text-xs shrink-0"
                ref={dropdownRef}
              >
                <button
                  type="button"
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center gap-2 text-slate-300 hover:text-cyan-400 font-mono text-[11px] py-1 px-2.5 rounded-lg bg-slate-950 border border-slate-800 hover:border-cyan-500/40 transition-all cursor-pointer truncate max-w-[270px]"
                >
                  <MessageSquare className="h-3 w-3 text-cyan-400 shrink-0" />
                  <span className="truncate">
                    Session: {sessionId.slice(-6).toUpperCase()} ({messages.filter(m => m.sender !== 'system').length} msgs)
                  </span>
                  <ChevronDown className={`h-3 w-3 text-slate-400 transition-transform ${showDropdown ? 'rotate-180 text-cyan-400' : ''}`} />
                </button>

                <button
                  type="button"
                  onClick={handleStartNewConversation}
                  className="flex items-center gap-1 text-[10px] font-mono text-cyan-400 hover:text-cyan-300 bg-cyan-950/40 hover:bg-cyan-900/50 border border-cyan-500/30 px-2 py-1 rounded-lg transition-all cursor-pointer shrink-0 font-semibold"
                  title="Start a new conversation thread"
                >
                  <Plus className="h-3 w-3" /> New Chat
                </button>

                {/* Dropdown Menu for All Conversations */}
                <AnimatePresence>
                  {showDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: -6, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -6, scale: 0.98 }}
                      className="absolute top-full left-4 right-4 mt-1 bg-slate-900/95 border border-slate-700/80 rounded-2xl p-2 shadow-2xl z-30 max-h-64 overflow-y-auto space-y-1 backdrop-blur-xl"
                    >
                      <div className="px-2 py-1 flex items-center justify-between border-b border-slate-800 pb-1.5">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold">Your Conversations</span>
                        <span className="text-[9px] font-mono text-cyan-400">{conversationHistory.length} Recorded</span>
                      </div>

                      {conversationHistory.length === 0 ? (
                        <div className="p-3 text-center text-[11px] text-slate-400">Current thread is your only active conversation.</div>
                      ) : (
                        conversationHistory.map((conv) => {
                          const isCurrent = conv.id === sessionId;
                          return (
                            <div
                              key={conv.id}
                              onClick={() => handleSelectConversation(conv.id)}
                              className={`p-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-between gap-2 border ${
                                isCurrent
                                  ? 'bg-cyan-950/40 border-cyan-500/40 text-white'
                                  : 'bg-slate-950/40 border-transparent hover:border-slate-700 text-slate-300 hover:bg-slate-800/60'
                              }`}
                            >
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-2">
                                  <span className="font-mono text-[10px] font-bold text-cyan-400">ID: {conv.id.slice(-6).toUpperCase()}</span>
                                  {isCurrent && (
                                    <span className="text-[8px] font-mono bg-cyan-500 text-slate-950 px-1 rounded font-bold uppercase">Active</span>
                                  )}
                                  <span className="text-[9px] text-slate-500 font-mono flex items-center gap-0.5 ml-auto">
                                    <Clock className="h-2.5 w-2.5" />
                                    {new Date(conv.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                  </span>
                                </div>
                                <p className="text-[11px] text-slate-300 truncate mt-0.5 leading-snug">{conv.preview || 'Conversation thread'}</p>
                              </div>
                            </div>
                          );
                        })
                      )}

                      <div className="pt-1.5 border-t border-slate-800 mt-1 flex justify-between gap-2">
                        <button
                          type="button"
                          onClick={handleStartNewConversation}
                          className="w-full py-1.5 rounded-lg bg-cyan-500 text-slate-950 font-bold text-[10px] font-mono uppercase tracking-wider hover:bg-cyan-400 transition-all flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <Plus className="h-3 w-3" /> Start New Conversation
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* Main Chat Messages Viewport (Container-bounded scroll, will NOT push website down) */}
            <div
              ref={chatScrollContainerRef}
              className="flex-1 min-h-0 overflow-y-auto p-4 space-y-3.5 bg-slate-950/60 flex flex-col scroll-smooth"
            >
              {!isRegistered ? (
                /* Registration Screen */
                <form onSubmit={handleRegister} className="my-auto space-y-4 px-2">
                  <div className="text-center space-y-2 mb-4">
                    <div className="h-12 w-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mx-auto shadow-[0_0_15px_rgba(6,182,212,0.25)]">
                      <Sparkles className="h-6 w-6 text-cyan-400" />
                    </div>
                    <h4 className="font-display font-bold text-white text-base">Connect with RinaAI</h4>
                    <p className="text-xs text-slate-400 max-w-[260px] mx-auto leading-relaxed">
                      Enter your details to start a conversation with SaroHub's virtual AI assistant.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1">
                        Your Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={visitorName}
                        onChange={e => setVisitorName(e.target.value)}
                        placeholder="Haider Ali"
                        className="w-full text-xs bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-cyan-500/60 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1">
                        WhatsApp / Phone Number *
                      </label>
                      <input
                        type="tel"
                        required
                        value={visitorPhone}
                        onChange={e => setVisitorPhone(e.target.value)}
                        placeholder="e.g. +92 343 0381473"
                        className="w-full text-xs bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-cyan-500/60 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1">
                        Email Address (Optional)
                      </label>
                      <input
                        type="email"
                        value={visitorEmail}
                        onChange={e => setVisitorEmail(e.target.value)}
                        placeholder="haider.ali@sarohub.com"
                        className="w-full text-xs bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-cyan-500/60 transition-all"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full mt-2 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold text-xs font-mono uppercase tracking-wider hover:brightness-110 transition-all cursor-pointer shadow-[0_4px_14px_rgba(6,182,212,0.3)] flex items-center justify-center gap-2"
                    >
                      <Sparkles className="h-4 w-4" /> Begin Conversation
                    </button>
                  </div>
                </form>
              ) : (
                /* Chat Messages Screen with Explicit Blocks */
                <>
                  {messages.length === 0 ? (
                    <div className="my-auto text-center p-6 space-y-2">
                      <Bot className="h-8 w-8 text-cyan-400 mx-auto opacity-70" />
                      <p className="text-xs text-slate-400">RinaAI is ready. Ask anything about SaroHub software, pricing, or careers!</p>
                    </div>
                  ) : (
                    <div className="space-y-3.5">
                      {messages.map((m) => {
                        const isVisitor = m.sender === 'visitor';
                        const isSystem = m.sender === 'system';
                        const isAI = typeof m.text === 'string' && m.text.startsWith('[AI Assistant]');
                        const messageText = isAI ? m.text.replace('[AI Assistant]', '').trim() : m.text;

                        if (isSystem) {
                          return (
                            <div key={m.id} className="text-center py-1 shrink-0">
                              <span className="inline-block rounded-lg bg-slate-900/80 border border-slate-800 px-3 py-1 text-[10px] font-mono text-slate-400 leading-normal">
                                {m.text}
                              </span>
                            </div>
                          );
                        }

                        return (
                          /* Dedicated User & AI Message Blocks with Website Aesthetic */
                          <div
                            key={m.id}
                            className={`group relative rounded-2xl p-3.5 transition-all border shadow-md ${
                              isVisitor
                                ? 'bg-cyan-950/25 border-cyan-500/30 text-cyan-50 ml-4'
                                : 'bg-slate-900/90 border-slate-800 text-slate-100 mr-4'
                            }`}
                          >
                            {/* Block Header: Sender + Time + Copy + Delete Action */}
                            <div className="flex items-center justify-between gap-2 border-b border-slate-800/80 pb-1.5 mb-2">
                              <div className="flex items-center gap-2">
                                <div
                                  className={`h-6 w-6 rounded-lg flex items-center justify-center text-[10px] font-bold shrink-0 ${
                                    isVisitor
                                      ? 'bg-cyan-500 text-slate-950 shadow-[0_0_8px_rgba(6,182,212,0.3)]'
                                      : 'bg-cyan-950 border border-cyan-500/40 text-cyan-400'
                                  }`}
                                >
                                  {isVisitor ? <User className="h-3.5 w-3.5" /> : <Bot className="h-3.5 w-3.5" />}
                                </div>
                                <span className={`text-[11px] font-mono font-bold ${isVisitor ? 'text-cyan-300' : 'text-slate-200'}`}>
                                  {isVisitor ? visitorName || 'You' : 'RinaAI Virtual Assistant'}
                                </span>
                                {!isVisitor && isAI && (
                                  <span className="text-[8px] font-mono px-1 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-semibold">
                                    AI
                                  </span>
                                )}
                              </div>

                              {/* Message Block Actions (Copy + Delete single message) */}
                              <div className="flex items-center gap-1.5">
                                <span className="text-[9px] font-mono text-slate-500">
                                  {new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                                <button
                                  type="button"
                                  onClick={(e) => handleCopyMessage(e, m.id, m.text)}
                                  className="p-1 rounded text-slate-400 hover:text-cyan-300 hover:bg-slate-800 transition-colors cursor-pointer"
                                  title="Copy message text"
                                >
                                  {copiedMessageId === m.id ? (
                                    <Check className="h-3 w-3 text-emerald-400" />
                                  ) : (
                                    <Copy className="h-3 w-3" />
                                  )}
                                </button>
                                <button
                                  type="button"
                                  disabled={deletingMessageId === m.id}
                                  onClick={(e) => handleDeleteSingleMessage(e, m.id)}
                                  className="p-1 rounded text-slate-400 hover:text-rose-400 hover:bg-rose-950/30 transition-colors cursor-pointer disabled:opacity-40"
                                  title="Delete this message permanently"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              </div>
                            </div>

                            {/* Block Content Body */}
                            <div className="text-xs leading-relaxed text-slate-200 whitespace-pre-line break-words select-text font-sans">
                              {messageText}
                            </div>
                          </div>
                        );
                      })}

                      {/* Typing indicator block */}
                      {isWaitingForReply && (
                        <div className="rounded-2xl p-3.5 bg-slate-900/80 border border-cyan-500/30 mr-4 shadow-sm">
                          <div className="flex items-center gap-2 mb-2 pb-1.5 border-b border-slate-800/60">
                            <div className="h-6 w-6 rounded-lg bg-cyan-950 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                              <Bot className="h-3.5 w-3.5 animate-spin-slow" />
                            </div>
                            <span className="text-[11px] font-mono font-bold text-cyan-400">RinaAI is finding an answer...</span>
                          </div>
                          <div className="flex items-center gap-2 py-1">
                            <span className="text-xs text-slate-400">Finding the best information</span>
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
                      )}
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Input Footer - Grounded and matching SaroHub styling */}
            {isRegistered && (
              <div className="border-t border-slate-800 bg-slate-950/95 p-3 shrink-0">
                {sessionClosed && (
                  <div className="rounded-xl border border-slate-800 bg-slate-900/60 px-3 py-1.5 mb-2 text-center flex items-center justify-between gap-2">
                    <span className="text-[10px] font-mono text-slate-400">Previous ticket was resolved.</span>
                    <button
                      type="button"
                      onClick={handleStartNewConversation}
                      className="text-[10px] font-mono text-cyan-400 hover:underline font-semibold cursor-pointer"
                    >
                      Start Fresh Thread
                    </button>
                  </div>
                )}
                <form onSubmit={handleSendMessage} className="flex gap-2">
                  <input
                    type="text"
                    value={inputText}
                    onChange={e => setInputText(e.target.value)}
                    placeholder="Ask RinaAI anything about SaroHub..."
                    disabled={isSending}
                    className="flex-1 text-xs bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/60 transition-all disabled:opacity-50"
                  />
                  <button
                    type="submit"
                    disabled={!inputText.trim() || isSending}
                    className="h-10 w-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 text-slate-950 flex items-center justify-center hover:brightness-110 active:scale-95 disabled:opacity-40 disabled:scale-100 transition-all cursor-pointer shrink-0 shadow-[0_4px_12px_rgba(6,182,212,0.25)]"
                    title="Send Message"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </form>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Confirmation Modal for Clearing Entire Conversation */}
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
              className="w-full max-w-[340px] rounded-2xl bg-slate-900 border border-slate-700 p-5 shadow-2xl"
              role="dialog"
              aria-modal="true"
              aria-labelledby="clear-chat-title"
              onClick={event => event.stopPropagation()}
            >
              <div className="flex items-center gap-3 text-rose-400 mb-2">
                <Trash2 className="h-5 w-5" />
                <h4 id="clear-chat-title" className="font-display font-bold text-white text-sm">Delete Entire Conversation?</h4>
              </div>
              <p className="mt-2 text-xs leading-relaxed text-slate-400">
                This will permanently delete this whole conversation thread from the server and initialize a clean session.
              </p>
              <div className="mt-5 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowClearConfirm(false)}
                  className="rounded-lg px-3 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleClearChat}
                  className="rounded-lg bg-rose-500 px-3.5 py-2 text-xs font-semibold text-white hover:bg-rose-400 cursor-pointer shadow-[0_2px_8px_rgba(244,63,94,0.3)]"
                >
                  Delete Group / Clear
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Toggle Button matching SaroHub Theme */}
      <button
        onClick={toggleWidget}
        className="relative h-14 w-14 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 hover:scale-105 active:scale-95 transition-all flex items-center justify-center cursor-pointer shadow-[0_8px_24px_rgba(6,182,212,0.4)] border border-cyan-400/30"
        aria-label="Open RinaAI support portal"
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
              <X className="h-6 w-6 text-slate-950 stroke-[2.5]" />
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
              <MessageSquare className="h-6 w-6 text-slate-950 stroke-[2.2]" />
              {hasNewUnread && (
                <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-rose-500 border-2 border-slate-950"></span>
                </span>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </button>
    </div>
  );
}
