
import { useState, useEffect } from 'react';

export interface ChatSession {
  id: string;
  title: string;
  messages: any[];
  createdAt: Date;
  updatedAt: Date;
}

export function useChatHistory() {
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string>('');

  // Load chat history from localStorage on mount
  useEffect(() => {
    const savedSessions = localStorage.getItem('healthAssistantChats');
    if (savedSessions) {
      const sessions = JSON.parse(savedSessions).map((session: any) => ({
        ...session,
        createdAt: new Date(session.createdAt),
        updatedAt: new Date(session.updatedAt),
      }));
      setChatSessions(sessions);
      
      // Set current chat to the most recent one
      if (sessions.length > 0) {
        setCurrentChatId(sessions[0].id);
      }
    }
  }, []);

  // Save to localStorage whenever chatSessions change
  useEffect(() => {
    if (chatSessions.length > 0) {
      localStorage.setItem('healthAssistantChats', JSON.stringify(chatSessions));
    }
  }, [chatSessions]);

  const createNewChat = () => {
    const newChat: ChatSession = {
      id: Date.now().toString(),
      title: 'New Chat',
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    setChatSessions(prev => [newChat, ...prev]);
    setCurrentChatId(newChat.id);
    return newChat.id;
  };

  const updateChatMessages = (chatId: string, messages: any[]) => {
    setChatSessions(prev => prev.map(session => 
      session.id === chatId 
        ? { 
            ...session, 
            messages, 
            updatedAt: new Date(),
            title: messages.length > 1 ? generateChatTitle(messages[1]?.content) : 'New Chat'
          }
        : session
    ));
  };

  const deleteChat = (chatId: string) => {
    setChatSessions(prev => prev.filter(session => session.id !== chatId));
    
    // If deleting current chat, switch to another
    if (currentChatId === chatId) {
      const remaining = chatSessions.filter(session => session.id !== chatId);
      if (remaining.length > 0) {
        setCurrentChatId(remaining[0].id);
      } else {
        const newChatId = createNewChat();
        setCurrentChatId(newChatId);
      }
    }
  };

  const getCurrentChat = () => {
    return chatSessions.find(session => session.id === currentChatId);
  };

  const exportChatToMarkdown = (chatId: string) => {
    const chat = chatSessions.find(session => session.id === chatId);
    if (!chat) return;

    let markdown = `# ${chat.title}\n\n`;
    markdown += `**Created:** ${chat.createdAt.toLocaleDateString()}\n`;
    markdown += `**Updated:** ${chat.updatedAt.toLocaleDateString()}\n\n`;
    markdown += `---\n\n`;

    chat.messages.forEach((message, index) => {
      if (message.id === 'welcome') return; // Skip welcome message
      
      const role = message.isUser ? '**You**' : '**Health Assistant**';
      markdown += `### ${role}\n`;
      markdown += `${message.content}\n\n`;
      
      if (message.intent) {
        markdown += `*Intent: ${message.intent}*\n\n`;
      }
      
      markdown += `*${message.timestamp.toLocaleString()}*\n\n`;
      markdown += `---\n\n`;
    });

    // Create and download file
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `health-chat-${chat.title.replace(/[^a-zA-Z0-9]/g, '-')}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return {
    chatSessions,
    currentChatId,
    setCurrentChatId,
    createNewChat,
    updateChatMessages,
    deleteChat,
    getCurrentChat,
    exportChatToMarkdown,
  };
}

function generateChatTitle(content: string): string {
  if (!content) return 'New Chat';
  
  // Take first few words and limit length
  const words = content.split(' ').slice(0, 4).join(' ');
  return words.length > 30 ? words.substring(0, 30) + '...' : words;
}
