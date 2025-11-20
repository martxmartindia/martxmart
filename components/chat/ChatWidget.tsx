'use client';

import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Phone, Mail, MessageCircle as MessageIcon, ShoppingCart, Download, Star, ExternalLink, Gift } from 'lucide-react';
import { useChat } from './ChatProvider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { ChatMessage } from './ChatMessage';
import Image from 'next/image';

export function ChatWidget() {
  const {
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
  } = useChat();
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    await sendMessage(input);
    setInput('');
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'CALL_NOW':
        return <Phone className="h-3 w-3" />;
      case 'EMAIL_SUPPORT':
        return <Mail className="h-3 w-3" />;
      case 'LIVE_CHAT':
        return <MessageIcon className="h-3 w-3" />;
      case 'VIEW_PRODUCTS':
        return <ShoppingCart className="h-3 w-3" />;
      case 'VIEW_OFFERS':
        return <Gift className="h-3 w-3" />;
      case 'DOWNLOAD_CATALOG':
        return <Download className="h-3 w-3" />;
      case 'TRACK_ORDER':
        return <ExternalLink className="h-3 w-3" />;
      default:
        return <Star className="h-3 w-3" />;
    }
  };

  if (!isOpen) {
    return (
      <Button
        onClick={toggleChat}
        className="fixed bottom-4 right-4 h-12 w-12 rounded-full p-0 shadow-lg z-50 md:h-14 md:w-14 bg-[#b74a14]"
      >
        <MessageCircle className="h-6 w-6" />
      </Button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 w-[95vw] max-w-[400px] rounded-lg bg-white shadow-xl z-50 sm:w-96 max-h-[85vh] flex flex-col">
      <div className="flex items-center justify-between border-b p-4">
        <h3 className="font-semibold text-base sm:text-lg">martXmart Support</h3>
        <Button variant="ghost" size="icon" onClick={toggleChat}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <ScrollArea className="flex-1 min-h-0 p-4 overflow-y-auto">
        <div className="space-y-4 min-h-full">
          {messages.map((message) => (
            <div key={message.id}>
              <ChatMessage
                content={message.content}
                sender={message.sender}
                timestamp={message.timestamp}
                needsEscalation={message.needsEscalation}
                actionButtons={message.actionButtons}
                quickReplies={message.quickReplies}
                suggestedProducts={message.suggestedProducts}
                handleActionButton={handleActionButton}
                handleQuickReply={handleQuickReply}
                getActionIcon={getActionIcon}
                setInput={setInput}
              />
            </div>
          ))}
          {isLoading && (
            <div className="flex gap-3 justify-start">
              <div className="flex gap-3 max-w-[80%]">
                <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-muted">
                  <Image src="/bot-avatar.png" alt="Bot" className="h-4 w-4"  width={16} height={16} />
                </div>
                <div className="rounded-lg p-3 bg-muted">
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                    <span className="text-sm">माहीश्री टाइप कर रही है...</span>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      <form onSubmit={handleSubmit} className="border-t p-4">
        <div className="flex gap-2">
          <Input
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
            className="text-sm"
          />
          <Button type="submit" size="icon" disabled={isLoading || !input.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </form>

      <Dialog open={showLeadForm} onOpenChange={setShowLeadForm}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>विशेष ऑफर पाने के लिए जानकारी दें</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleLeadSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">नाम *</Label>
              <Input
                id="name"
                value={leadForm.name}
                onChange={(e) => setLeadForm((prev) => ({ ...prev, name: e.target.value }))}
                placeholder="आपका नाम"
                required
              />
            </div>
            <div>
              <Label htmlFor="phone">फोन नंबर *</Label>
              <Input
                id="phone"
                type="tel"
                value={leadForm.phone}
                onChange={(e) => setLeadForm((prev) => ({ ...prev, phone: e.target.value }))}
                placeholder="आपका फोन नंबर"
                required
              />
            </div>
            <div>
              <Label htmlFor="email">ईमेल</Label>
              <Input
                id="email"
                type="email"
                value={leadForm.email}
                onChange={(e) => setLeadForm((prev) => ({ ...prev, email: e.target.value }))}
                placeholder="आपका ईमेल (वैकल्पिक)"
              />
            </div>
            <div>
              <Label htmlFor="interest">रुचि</Label>
              <Input
                id="interest"
                value={leadForm.interest}
                onChange={(e) => setLeadForm((prev) => ({ ...prev, interest: e.target.value }))}
                placeholder="आप क्या ढूंढ रहे हैं?"
                readOnly
              />
            </div>
            <div className="flex gap-2 pt-4">
              <Button type="submit" className="flex-1">
                जानकारी भेजें
              </Button>
              <Button type="button" variant="outline" onClick={() => setShowLeadForm(false)}>
                रद्द करें
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              हम आपकी जानकारी सुरक्षित रखते हैं और केवल विशेष ऑफर भेजने के लिए उपयोग करते हैं।
            </p>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}