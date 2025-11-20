"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from '@/store/auth';
import { toast } from 'sonner';

type ActionButton = {
  text: string;
  action: string;
  data: string;
};

type Product = {
  name: string;
  price: string;
  description: string;
  category: string;
};

type Message = {
  id: string;
  content: string;
  sender: 'user' | 'bot' | 'agent';
  timestamp: Date;
  needsEscalation?: boolean;
  actionButtons?: ActionButton[];
  quickReplies?: string[];
  suggestedProducts?: Product[];
};

type LeadForm = {
  name: string;
  email: string;
  phone: string;
  interest: string;
};

type ChatContextType = {
  messages: Message[];
  isOpen: boolean;
  isLoading: boolean;
  showLeadForm: boolean;
  leadForm: LeadForm;
  sendMessage: (content: string) => Promise<void>;
  handleQuickReply: (reply: string) => void;
  handleActionButton: (action: string, data: string) => void;
  handleLeadSubmit: (e: React.FormEvent) => Promise<void>;
  setLeadForm: React.Dispatch<React.SetStateAction<LeadForm>>;
  setShowLeadForm: React.Dispatch<React.SetStateAction<boolean>>;
  toggleChat: () => void;
};

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'bot',
      content: 'नमस्कार! मैं माहीश्री हूँ — martXmart पर आपकी Assistant। आप पहली बार यहाँ आए हैं, इसके लिए दिल से धन्यवाद। मैं आपकी ज़रूरतों को समझने, सुनने और सही समाधान देने के लिए हमेशा तैयार हूँ। बताइए, मैं आपकी क्या मदद कर सकती हूँ? 🛍️',
      timestamp: new Date(),
      quickReplies: ['मुझे फोन चाहिए', 'लैपटॉप दिखाएं', 'स्टोर का समय', 'डिलीवरी की जानकारी', 'संपर्क करें'],
      actionButtons: [
        { text: 'प्रोडक्ट देखें', action: 'VIEW_PRODUCTS', data: 'all' },
        { text: 'ऑफर देखें', action: 'VIEW_OFFERS', data: 'current' },
        { text: 'कॉल करें', action: 'CALL_NOW', data: '+91 02269718200' },
        { text: 'व्हाट्सऐप करें', action: 'CONTACT_SUPPORT', data: 'whatsapp' },
      ],
    },
  ]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [leadForm, setLeadForm] = useState<LeadForm>({
    name: '',
    email: '',
    phone: '',
    interest: '',
  });
  const [sessionId] = useState(`session_${Date.now()}`);
  const { user } = useAuth();

  const sendMessage = async (content: string) => {
    if (!content.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);

      const response = await fetch('/api/agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          input: content,
          sessionId,
          userInfo: {
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            userId: user?.id,
          },
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.message || 'मैं आपकी मदद करने के लिए यहाँ हूँ!',
        sender: data.isAgent ? 'agent' : 'bot',
        timestamp: new Date(),
        needsEscalation: data.needsEscalation || false,
        actionButtons: data.actionButtons || [],
        quickReplies: data.quickReplies || [],
        suggestedProducts: data.suggestedProducts || [],
      };

      setMessages((prev) => [...prev, botMessage]);

      if (data.needsLeadCollection) {
        setShowLeadForm(true);
        setLeadForm((prev) => ({ ...prev, interest: content }));
      }

      if (data.needsEscalation) {
        toast.info('सहायता टीम से जुड़ रहे हैं', {
          description: 'आपकी समस्या जटिल है, हमारी टीम मदद करेगी',
          closeButton: true,
          duration: 5000,
        });
      }
    } catch (error) {
      console.error('Chat error:', error);
      
      const errorMessage = error instanceof Error && error.name === 'AbortError' 
        ? 'समय समाप्त हो गया, कृपया पुनः प्रयास करें'
        : 'क्षमा करें, कुछ तकनीकी समस्या है। कृपया थोड़ी देर बाद पुनः प्रयास करें या हमारी सहायता टीम से संपर्क करें: +91 02269718200 🔧';
      
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          content: errorMessage,
          sender: 'bot',
          timestamp: new Date(),
          actionButtons: [
            { text: 'तुरंत कॉल करें', action: 'CALL_NOW', data: '+91 02269718200' },
            { text: 'व्हाट्सऐप करें', action: 'CONTACT_SUPPORT', data: 'whatsapp' },
            { text: 'ईमेल करें', action: 'EMAIL_SUPPORT', data: 'support@martxmart.com' },
            { text: 'पुनः प्रयास करें', action: 'VIEW_MORE', data: 'retry' }
          ],
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickReply = (reply: string) => {
    sendMessage(reply);
  };

  const handleActionButton = async (action: string, data: string) => {
    switch (action) {
      case 'CALL_NOW':
        window.open(`tel:${data}`, '_self');
        toast.success('कॉल कनेक्ट हो रहा है', {
          description: `${data} पर कॉल कर रहे हैं`,
          closeButton: true,
          duration: 3000,
        });
        break;
      case 'EMAIL_SUPPORT':
        const email = data || 'support@martxmart.com';
        window.open(`mailto:${email}?subject=MartxMart Support Request&body=नमस्कार, मुझे सहायता चाहिए।`, '_blank');
        toast.success('ईमेल खुल रहा है', {
          description: `${email} पर ईमेल भेज रहे हैं`,
          closeButton: true,
          duration: 3000,
        });
        break;
      case 'CONTACT_SUPPORT':
      case 'GET_OFFERS':
        if (data === 'whatsapp') {
          const whatsappNumber = '+919876543210';
          const message = encodeURIComponent('नमस्कार! मुझे martXmart के बारे में जानकारी चाहिए।');
          window.open(`https://wa.me/${whatsappNumber.replace('+', '')}?text=${message}`, '_blank');
          toast.success('व्हाट्सऐप खुल रहा है', {
            description: 'व्हाट्सऐप पर संपर्क कर रहे हैं',
            closeButton: true,
            duration: 3000,
          });
        }
        break;
      case 'VIEW_PRODUCTS':
        if (data === 'all') {
          window.open('/products', '_blank');
        } else {
          window.open(`/products?category=${data}`, '_blank');
        }
        break;
      case 'VIEW_PRODUCT_DETAIL':
        if (data) {
          window.open(`/products/${data}`, '_blank');
          toast.info('प्रोडक्ट विवरण पेज खुल रहा है');
        }
        break;
      case 'VIEW_SERVICE_DETAIL':
        if (data) {
          window.open(`/services/${data}`, '_blank');
          toast.info('सर्विस विवरण पेज खुल रहा है');
        }
        break;
      case 'VIEW_OFFERS':
        window.open('/products?filter=offers', '_blank');
        break;
      case 'VIEW_CATEGORIES':
        window.open('/categories', '_blank');
        break;
      case 'VIEW_SERVICES':
        window.open('/services', '_blank');
        break;
      case 'VIEW_FRANCHISES':
        window.open('/franchises', '_blank');
        break;
      case 'VIEW_GOVERNMENT_SCHEMES':
        window.open('/gov-scheme', '_blank');
        break;
      case 'VIEW_VENDORS':
        window.open('/vendors', '_blank');
        break;
      case 'VIEW_REVIEWS':
        window.open('/reviews', '_blank');
        break;
      case 'VIEW_BLOG':
        window.open('/blog', '_blank');
        break;
      case 'VIEW_CAREERS':
        window.open('/careers', '_blank');
        break;
      case 'VIEW_QUOTATIONS':
        window.open('/quotations', '_blank');
        break;
      case 'VIEW_COUPONS':
        window.open('/coupons', '_blank');
        break;
      case 'VIEW_INVENTORY':
        window.open('/inventory', '_blank');
        break;
      case 'VIEW_ANALYTICS':
        window.open('/analytics', '_blank');
        break;
      case 'VIEW_MEDIA':
        window.open('/media', '_blank');
        break;
      case 'VIEW_NOTIFICATIONS':
        window.open('/notifications', '_blank');
        break;
      case 'VIEW_TICKETS':
        window.open('/tickets', '_blank');
        break;
      case 'VIEW_WISHLIST':
        window.open('/wishlist', '_blank');
        break;
      case 'VIEW_CART':
        window.open('/cart', '_blank');
        break;
      case 'CHECKOUT':
        window.open('/checkout', '_blank');
        break;
      case 'TRACK_ORDER':
        window.open('/orders', '_blank');
        toast.info('ऑर्डर ट्रैकिंग पेज खुल रहा है');
        break;
      case 'VIEW_MORE':
        if (data === 'location') {
          const address = 'Shashi Bhawan, Jayprakash Nagar, Purnea, Bihar 854301';
          const encodedAddress = encodeURIComponent(address);
          window.open(`https://maps.google.com/?q=${encodedAddress}`, '_blank');
          toast.success('गूगल मैप्स खुल रहा है');
        } else if (data === 'store_location') {
          sendMessage('स्टोर का पता और समय बताएं');
        } else if (data === 'retry') {
          sendMessage('कृपया पुनः प्रयास करें');
        }
        break;
      case 'CALLBACK_REQUEST':
        setShowLeadForm(true);
        setLeadForm((prev) => ({ ...prev, interest: data === 'service_booking' ? 'सर्विस बुकिंग' : 'कॉल बैक रिक्वेस्ट' }));
        break;
      case 'DOWNLOAD_CATALOG':
        toast.info('कैटलॉग डाउनलोड हो रहा है');
        break;
      case 'LIVE_CHAT':
        sendMessage('मुझे लाइव सपोर्ट चाहिए');
        break;
      default:
        sendMessage(data);
        break;
    }
  };

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      toast.success('धन्यवाद! आपकी जानकारी सेव हो गई', {
        description: 'हमारी टीम जल्दी आपसे संपर्क करेगी',
        closeButton: true,
        duration: 5000,
      });
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          content: `धन्यवाद ${leadForm.name} जी! आपकी जानकारी हमारे पास सुरक्षित है। हमारी टीम 24 घंटे में आपसे ${leadForm.phone} पर संपर्क करेगी। 📞`,
          sender: 'bot',
          timestamp: new Date(),
          actionButtons: [
            { text: 'तुरंत कॉल करें', action: 'CALL_NOW', data: '+91 02269718200' },
            { text: 'व्हाट्सऐप करें', action: 'CONTACT_SUPPORT', data: 'whatsapp' },
          ],
        },
      ]);
      setShowLeadForm(false);
      setLeadForm({ name: '', email: '', phone: '', interest: '' });
    } catch (error) {
      toast.error('कुछ समस्या हुई, कृपया पुनः प्रयास करें', {
        closeButton: true,
        duration: Infinity,
      });
    }
  };

  const toggleChat = () => setIsOpen((prev) => !prev);

  return (
    <ChatContext.Provider
      value={{
        messages,
        isOpen,
        isLoading,
        showLeadForm,
        leadForm,
        sendMessage,
        handleQuickReply,
        handleActionButton,
        handleLeadSubmit,
        setLeadForm,
        setShowLeadForm,
        toggleChat,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
}