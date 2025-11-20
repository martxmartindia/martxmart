'use client';

import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { AlertCircle, Clock } from 'lucide-react';

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
  id?: string;
};

type MessageProps = {
  content: string;
  sender: 'user' | 'bot' | 'agent';
  timestamp: Date;
  needsEscalation?: boolean;
  actionButtons?: ActionButton[];
  quickReplies?: string[];
  suggestedProducts?: Product[];
  handleActionButton?: (action: string, data: string) => void;
  handleQuickReply?: (reply: string) => void;
  getActionIcon?: (action: string) => React.ReactNode;
  setInput?: (input: string) => void;
};

export function ChatMessage({
  content,
  sender,
  timestamp,
  needsEscalation,
  actionButtons,
  quickReplies,
  suggestedProducts,
  handleActionButton,
  handleQuickReply,
  getActionIcon,
  setInput,
}: MessageProps) {
  const isUser = sender === 'user';
  const isAgent = sender === 'agent';

  return (
    <div className={cn('flex w-full gap-2 items-start', isUser ? 'flex-row-reverse' : 'flex-row')}>
      <Avatar className="h-6 w-6 sm:h-8 sm:w-8 mt-1">
        {isUser ? (
          <AvatarFallback className="text-xs sm:text-sm">U</AvatarFallback>
        ) : isAgent ? (
          <>
            <AvatarImage src="/support-agent.svg" />
            <AvatarFallback className="text-xs sm:text-sm">A</AvatarFallback>
          </>
        ) : (
          <>
            <AvatarImage src="/bot-avatar.png" />
            <AvatarFallback className="text-xs sm:text-sm">B</AvatarFallback>
          </>
        )}
      </Avatar>

      <div className="flex-1">
        <div
          className={cn(
            'flex max-w-[80%] flex-col gap-1 rounded-lg px-3 py-2 sm:px-4 sm:py-2 text-sm',
            isUser ? 'bg-primary text-primary-foreground' : isAgent ? 'bg-orange-100 text-orange-900' : 'bg-muted'
          )}
        >
          <p className="text-xs sm:text-sm">{content}</p>
          <div className="flex items-center gap-2 mt-1 text-[10px] sm:text-xs opacity-70">
            <Clock className="h-3 w-3" />
            {timestamp.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
            {needsEscalation && (
              <>
                <Separator orientation="vertical" className="h-3" />
                <AlertCircle className="h-3 w-3" />
                <span>सहायता टीम से संपर्क</span>
              </>
            )}
          </div>
        </div>

        {suggestedProducts && suggestedProducts.length > 0 && (
          <div className="mt-3 ml-2">
            <div className="text-sm font-medium mb-2">सुझाए गए प्रोडक्ट:</div>
            <div className="grid grid-cols-1 gap-2">
              {suggestedProducts.map((product, index) => (
                <Card key={index} className="p-3 bg-card/50">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{product.name}</h4>
                      <p className="text-xs text-muted-foreground mt-1">{product.description}</p>
                      <Badge variant="outline" className="mt-1 text-xs">{product.category}</Badge>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-primary">{product.price}</div>
                      <Button
                        size="sm"
                        variant="outline"
                        className="mt-1 h-6 text-xs"
                        onClick={() => handleActionButton && product.id ? handleActionButton('VIEW_PRODUCT_DETAIL', product.id) : setInput && setInput(`${product.name} के बारे में और बताएं`)}
                      >
                        विवरण
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {actionButtons && actionButtons.length > 0 && (
          <div className="mt-3 ml-2">
            <div className="flex flex-wrap gap-2">
              {actionButtons.map((button, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => handleActionButton && handleActionButton(button.action, button.data)}
                  className="h-8 text-xs"
                >
                  {getActionIcon && getActionIcon(button.action)}
                  <span className="ml-1">{button.text}</span>
                </Button>
              ))}
            </div>
          </div>
        )}

        {quickReplies && quickReplies.length > 0 && (
          <div className="mt-3 ml-2">
            <div className="text-sm font-medium mb-2">त्वरित जवाब:</div>
            <div className="flex flex-wrap gap-2">
              {quickReplies.map((reply, index) => (
                <Button
                  key={index}
                  variant="secondary"
                  size="sm"
                  onClick={() => handleQuickReply && handleQuickReply(reply)}
                  className="h-7 text-xs"
                >
                  {reply}
                </Button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}