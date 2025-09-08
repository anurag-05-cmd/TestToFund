import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Minimize2, Maximize2, BotMessageSquare } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

interface TestMateProps {
  apiKey: string;
}

export default function TestMate({ apiKey }: TestMateProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hi! I'm TestMate, your AI learning assistant for TestToFund. I can help you with questions about courses, rewards, blockchain, and our platform. \n\nTestToFund was built by Team EXPOSE: Anurag, Debapriya, Prithvi, and Sangram. How can I assist you today?",
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: text.trim(),
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('https://api.cohere.ai/v1/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'command',
          prompt: `You are TestMate, a helpful AI assistant for the TestToFund platform. TestToFund is a learn-to-earn platform where users complete educational courses (especially Udemy courses) and earn TTF tokens as rewards. 

Key features of TestToFund:
- Users complete Udemy courses and upload certificates
- Each verified completion earns 2000 TTF tokens
- TTF tokens are distributed on BlockDAG Testnet (Chain ID: 1043)
- Platform focuses on Python programming and Software Testing courses
- Users connect their MetaMask wallet to receive rewards
- Platform has anti-cheat measures and certificate verification
- Built by Team EXPOSE: Anurag, Debapriya, Prithvi, and Sangram

User question: ${text}

Provide a helpful, friendly response as TestMate. Keep responses concise but informative. If asked about technical details, be specific about TestToFund's features. If asked about the team, mention Team EXPOSE members.`,
          max_tokens: 200,
          temperature: 0.7,
          truncate: 'END'
        })
      });

      if (!response.ok) {
        throw new Error('Failed to get response from AI');
      }

      const data = await response.json();
      const aiResponse = data.generations[0]?.text?.trim() || "I'm sorry, I couldn't generate a response. Please try again.";

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: aiResponse,
        isUser: false,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "I'm sorry, I'm having trouble connecting right now. Please try again in a moment.",
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(inputMessage);
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
    setIsMinimized(false);
  };

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <>
      {/* Chat Button */}
      {!isOpen && (
        <button
          onClick={toggleChat}
          className="fixed bottom-4 right-4 z-50 bg-gradient-to-r from-[#00A88E] to-[#00967D] hover:from-[#00967D] hover:to-[#007A6A] text-white p-3 rounded-full shadow-lg transition-all duration-300 transform hover:scale-110 md:bottom-6 md:right-6 md:p-4 group"
          aria-label="Open TestMate Chat"
        >
          <BotMessageSquare className="w-5 h-5 md:w-6 md:h-6 transition-transform group-hover:rotate-12" />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-4 right-4 z-50 bg-gray-900 border border-gray-700 rounded-xl shadow-2xl transition-all duration-300 md:bottom-6 md:right-6 w-80 h-[450px] max-w-[calc(100vw-2rem)] flex flex-col overflow-hidden">
          {/* Header - Always visible */}
          <div className="flex items-center justify-between p-3 md:p-4 border-b border-gray-700 bg-gradient-to-r from-[#00A88E] to-[#00967D] flex-shrink-0 h-16">
            <div className="flex items-center gap-2 md:gap-3">
              <div className="w-7 h-7 md:w-8 md:h-8 bg-white rounded-full flex items-center justify-center transition-transform hover:scale-105">
                <BotMessageSquare className="w-4 h-4 md:w-5 md:h-5 text-[#00A88E]" />
              </div>
              <div>
                <h3 className="font-semibold text-white text-sm md:text-base">TestMate</h3>
                <p className="text-xs text-white/90">Team EXPOSE's AI Assistant</p>
              </div>
            </div>
            <div className="flex items-center gap-1 md:gap-2">
              <button
                onClick={toggleMinimize}
                className="text-white/80 hover:text-white transition-colors p-1 rounded"
                aria-label={isMinimized ? 'Maximize' : 'Minimize'}
              >
                {isMinimized ? <Maximize2 className="w-3 h-3 md:w-4 md:h-4" /> : <Minimize2 className="w-3 h-3 md:w-4 md:h-4" />}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white/80 hover:text-white transition-colors p-1 rounded"
                aria-label="Close chat"
              >
                <X className="w-3 h-3 md:w-4 md:h-4" />
              </button>
            </div>
          </div>

          {/* Chat Content */}
          {!isMinimized && (
            <>
              {/* Messages - Fixed height container */}
              <div className="flex-1 overflow-y-auto p-3 md:p-4 space-y-3 md:space-y-4 h-[300px]">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.isUser ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2 duration-300`}
                  >
                    <div
                      className={`max-w-[85%] px-3 py-2 rounded-lg text-xs md:text-sm leading-relaxed shadow-sm ${
                        message.isUser
                          ? 'bg-gradient-to-r from-[#00A88E] to-[#00967D] text-white rounded-br-sm'
                          : 'bg-gray-800 text-gray-200 border border-gray-700 rounded-bl-sm'
                      }`}
                    >
                      <p className="text-sm">{message.text}</p>
                      <p className={`text-xs mt-1 ${message.isUser ? 'text-blue-200' : 'text-gray-500'}`}>
                        {formatTime(message.timestamp)}
                      </p>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-gray-800 border border-gray-700 px-2 py-1 md:px-3 md:py-2 rounded-lg">
                      <div className="flex space-x-1">
                        <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-[#00A88E] rounded-full animate-bounce"></div>
                        <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-[#00A88E] rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-[#00A88E] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input - Always visible at bottom */}
              <div className="border-t border-gray-700 bg-gray-900 flex-shrink-0 h-[70px]">
                <form onSubmit={handleSubmit} className="p-3 md:p-4 h-full flex items-center">
                  <div className="flex gap-2 w-full">
                    <input
                      type="text"
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      placeholder="Ask TestMate anything..."
                      className="flex-1 bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-gray-200 placeholder-gray-400 focus:outline-none focus:border-[#00A88E] transition-all duration-200 text-sm md:text-base focus:ring-1 focus:ring-[#00A88E]/30"
                      disabled={isLoading}
                    />
                    <button
                      type="submit"
                      disabled={isLoading || !inputMessage.trim()}
                      className="bg-gradient-to-r from-[#00A88E] to-[#00967D] hover:from-[#00967D] hover:to-[#007A6A] disabled:bg-gray-700 disabled:cursor-not-allowed text-white p-2 rounded-lg transition-all duration-200 transform hover:scale-105 disabled:hover:scale-100"
                    >
                      <Send className="w-3 h-3 md:w-4 md:h-4" />
                    </button>
                  </div>
                </form>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}
