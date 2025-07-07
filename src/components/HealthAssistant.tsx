import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, Bot, User, Paperclip, MoreHorizontal, Menu, Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { generateGeminiResponse } from '../utils/geminiApi';
import { classifyIntent, type Intent } from '../utils/intentClassifier';
import { classifyEntity, type Entity } from '../utils/entityClassifier';
import { useChatHistory } from '../hooks/useChatHistory';
import ChatHistorySidebar from './ChatHistorySidebar';
import DocumentUpload from './DocumentUpload';
import MarkdownRenderer from './MarkdownRenderer';

interface ChatMessage {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
  intent?: Intent;
  entity?: Entity;
  isDocumentAnalysis?: boolean;
}

export default function HealthAssistant() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentInput, setCurrentInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showDocumentUpload, setShowDocumentUpload] = useState(false);
  const [isProcessingDocument, setIsProcessingDocument] = useState(false);
  const { toast } = useToast();
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const {
    chatSessions,
    currentChatId,
    setCurrentChatId,
    createNewChat,
    updateChatMessages,
    deleteChat,
    getCurrentChat,
    exportChatToMarkdown,
  } = useChatHistory();

  useEffect(() => {
    const currentChat = getCurrentChat();
    if (currentChat) {
      setMessages(currentChat.messages.map(msg => ({
        ...msg,
        timestamp: new Date(msg.timestamp)
      })));
    } else {
      const newChatId = createNewChat();
      const welcomeMessage: ChatMessage = {
        id: 'welcome',
        content: 'Hello! I\'m Velmora, your personal AI health assistant. I can help answer your health questions, provide wellness tips, and guide you on medical topics. You can also upload prescription images for personalized suggestions. How can I assist you today?',
        isUser: false,
        timestamp: new Date()
      };
      setMessages([welcomeMessage]);
      updateChatMessages(newChatId, [welcomeMessage]);
    }
  }, [currentChatId]);

  useEffect(() => {
    if (currentChatId && messages.length > 0) {
      updateChatMessages(currentChatId, messages);
    }
  }, [messages, currentChatId]);

  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messages]);

  const handleNewChat = () => {
    const newChatId = createNewChat();
    setCurrentChatId(newChatId);
    const welcomeMessage: ChatMessage = {
      id: 'welcome',
      content: 'Hello! I\'m Velmora, your personal AI health assistant. I can help answer your health questions, provide wellness tips, and guide you on medical topics. You can also upload prescription images for personalized suggestions. How can I assist you today?',
      isUser: false,
      timestamp: new Date()
    };
    setMessages([welcomeMessage]);
    setSidebarOpen(false);
  };

  const handleSelectChat = (chatId: string) => {
    setCurrentChatId(chatId);
    setSidebarOpen(false);
  };

  const handleDocumentProcessed = (extractedText: string, suggestions: string) => {
    // Add extracted text as user message
    const extractedMessage: ChatMessage = {
      id: Date.now().toString(),
      content: `📄 **Document Upload - Extracted Text:**\n\n${extractedText}`,
      isUser: true,
      timestamp: new Date(),
      isDocumentAnalysis: true
    };

    // Add AI suggestions as bot message
    const suggestionsMessage: ChatMessage = {
      id: (Date.now() + 1).toString(),
      content: `🩺 **Based on your prescription, here are my recommendations:**\n\n${suggestions}\n\n⚠️ **Important**: This is AI-generated advice for educational purposes only. Please consult with your healthcare provider before making any changes to your treatment plan.`,
      isUser: false,
      timestamp: new Date(),
      isDocumentAnalysis: true
    };

    setMessages(prev => [...prev, extractedMessage, suggestionsMessage]);
    setShowDocumentUpload(false);
    
    toast({
      title: "Document Analysis Complete",
      description: "Your prescription has been analyzed and suggestions generated.",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentInput.trim() || isTyping) return;

    const intent = classifyIntent(currentInput);
    const entity = classifyEntity(currentInput);

    console.log(`Question: "${currentInput}"`);
    console.log(`Intent: ${intent}, Entity: ${entity}`);

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: currentInput,
      isUser: true,
      timestamp: new Date(),
      intent,
      entity
    };

    setMessages(prev => [...prev, userMessage]);
    setCurrentInput('');
    setIsTyping(true);

    try {
      const response = await generateGeminiResponse(currentInput);
      
      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: response,
        isUser: false,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Gemini API error:', error);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: 'I apologize, but I\'m having trouble connecting to my AI service right now. Please try again in a moment.',
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
      
      toast({
        title: "Connection Error",
        description: "Failed to get AI response. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsTyping(false);
    }
  };

  const getClassificationBadges = (message: ChatMessage) => {
    if (!message.isUser || !message.intent) return null;
    
    return (
      <div className="flex gap-1 mt-1">
        <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
          {message.intent}
        </span>
        {message.isDocumentAnalysis && (
          <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full">
            Document Analysis
          </span>
        )}
      </div>
    );
  };

  const formatMessageContent = (content: string) => {
    // Format content with proper line breaks and spacing like ChatGPT
    let formattedContent = content
      // First, normalize line breaks
      .replace(/\r\n/g, '\n')
      .replace(/\n{3,}/g, '\n\n')
      
      // Format bold text with proper spacing
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>')
      
      // Format italic text
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      
      // Format numbered lists with proper line breaks
      .replace(/(\n|^)(\d+\.\s+)(.*?)(?=\n\d+\.|\n[^\d]|$)/gs, (match, lineStart, number, content) => {
        return `<div class="mb-3"><div class="flex items-start gap-2"><span class="font-medium text-gray-700 min-w-[20px]">${number.trim()}</span><div class="flex-1">${content.trim()}</div></div></div>`;
      })
      
      // Format bullet points with proper spacing
      .replace(/(\n|^)([-•]\s+)(.*?)(?=\n[-•]|\n[^-•]|$)/gs, (match, lineStart, bullet, content) => {
        return `<div class="mb-2"><div class="flex items-start gap-2"><span class="text-gray-600 min-w-[12px]">•</span><div class="flex-1">${content.trim()}</div></div></div>`;
      })
      
      // Format section headers (text ending with colon) with proper spacing
      .replace(/(\n|^)([A-Za-z][^:\n]*:)(\s*)/gm, '<div class="font-semibold text-gray-800 mt-6 mb-3 first:mt-0">$2</div>')
      
      // Handle emojis with consistent spacing
      .replace(/(🩺|📄|⚠️|🍎|💊|🏃‍♂️|😴|💧|❤️|🌟|⭐|✨)/g, '<span class="inline-block mr-1">$1</span>')
      
      // Format paragraphs - split by double line breaks
      .split(/\n\n+/)
      .filter(paragraph => paragraph.trim())
      .map(paragraph => {
        const trimmed = paragraph.trim();
        // Don't wrap if it's already wrapped in a div
        if (trimmed.startsWith('<div')) {
          return trimmed;
        }
        return `<div class="mb-4">${trimmed}</div>`;
      })
      .join('')
      
      // Clean up extra spacing and formatting issues
      .replace(/\s+/g, ' ')
      .replace(/> </g, '><')
      .replace(/<div class="mb-4"><\/div>/g, '')
      .replace(/(<\/div>)(\s*)(<div)/g, '$1$3');

    return formattedContent;
  };

  return (
    <div className="flex h-screen bg-white">
      {/* Conditionally render sidebar only when open */}
      {sidebarOpen && (
        <ChatHistorySidebar
          chatSessions={chatSessions}
          currentChatId={currentChatId}
          onSelectChat={handleSelectChat}
          onNewChat={handleNewChat}
          onDeleteChat={deleteChat}
          onExportChat={exportChatToMarkdown}
          isOpen={sidebarOpen}
          onToggle={() => setSidebarOpen(!sidebarOpen)}
        />
      )}

      {/* Main content area - no longer needs margin adjustment */}
      <div className="flex flex-col flex-1">
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
          <div className="flex items-center gap-3">
            <Button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              variant="ghost"
              size="icon"
              className="h-8 w-8"
            >
              <Menu className="h-5 w-5" />
            </Button>
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
              <Bot className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-gray-900">Velmora - Your personal AI Health Assistant</h1>
              <p className="text-sm text-gray-500">Online</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setShowDocumentUpload(!showDocumentUpload)}
              disabled={isProcessingDocument}
            >
              <Upload className="h-4 w-4 mr-2" />
              Upload Prescription
            </Button>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {showDocumentUpload && (
          <div className="p-4 border-b border-gray-200 bg-gray-50">
            <DocumentUpload 
              onTextExtracted={handleDocumentProcessed}
              isProcessing={isProcessingDocument}
              setIsProcessing={setIsProcessingDocument}
            />
          </div>
        )}

        <ScrollArea ref={scrollAreaRef} className="flex-1 p-4">
          <div className="max-w-4xl mx-auto space-y-6">
            {messages.map((message) => (
              <div key={message.id} className={`flex gap-3 ${message.isUser ? 'justify-end' : 'justify-start'}`}>
                {!message.isUser && (
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Bot className="h-4 w-4 text-white" />
                  </div>
                )}
                
                <div className={`max-w-[80%] ${message.isUser ? 'order-1' : ''}`}>
                  <div className={`rounded-2xl px-4 py-3 ${
                    message.isUser 
                      ? 'bg-blue-500 text-white ml-12' 
                      : 'bg-gray-100 text-gray-900'
                  }`}>
                    {message.isDocumentAnalysis ? (
                      <MarkdownRenderer 
                        content={message.content.replace(/^📄\s*\*\*.*?\*\*\s*|^🩺\s*\*\*.*?\*\*\s*/g, '')}
                        className="text-sm leading-relaxed"
                      />
                    ) : (
                      <div 
                        className="text-sm leading-relaxed"
                        dangerouslySetInnerHTML={{ 
                          __html: formatMessageContent(message.content) 
                        }}
                      />
                    )}
                  </div>
                  <div className={`mt-1 ${message.isUser ? 'text-right' : 'text-left'}`}>
                    <p className="text-xs text-gray-500">
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                    {getClassificationBadges(message)}
                  </div>
                </div>

                {message.isUser && (
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <User className="h-4 w-4 text-white" />
                  </div>
                )}
              </div>
            ))}
            
            {isTyping && (
              <div className="flex gap-3 justify-start">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <Bot className="h-4 w-4 text-white" />
                </div>
                <div className="bg-gray-100 rounded-2xl px-4 py-3">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-75"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150"></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        <div className="p-4 border-t border-gray-200 bg-white">
          <div className="max-w-4xl mx-auto">
            <form onSubmit={handleSubmit} className="flex gap-2 items-end">
              <div className="flex-1 relative">
                <Input
                  ref={inputRef}
                  value={currentInput}
                  onChange={(e) => setCurrentInput(e.target.value)}
                  placeholder="Ask me anything about health and wellness..."
                  disabled={isTyping || isProcessingDocument}
                  className="pr-12 py-3 rounded-full border-gray-300 focus:border-blue-500 focus:ring-blue-500/20 resize-none"
                  style={{ minHeight: '44px' }}
                />
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="icon"
                  onClick={() => setShowDocumentUpload(!showDocumentUpload)}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 text-gray-400 hover:text-gray-600"
                >
                  <Paperclip className="h-4 w-4" />
                </Button>
              </div>
              <Button 
                type="submit" 
                disabled={isTyping || !currentInput.trim() || isProcessingDocument}
                className="h-11 w-11 rounded-full bg-blue-500 hover:bg-blue-600 focus:ring-blue-500/20 focus:ring-2 flex-shrink-0"
                size="icon"
              >
                {isTyping || isProcessingDocument ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </form>
            
            <p className="text-xs text-gray-500 text-center mt-2">
              AI can make mistakes. Please verify important health information with professionals.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
