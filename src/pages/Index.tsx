
import React, { useState } from 'react';
import { ChatSidebar } from '@/components/ChatSidebar';
import { CodeSandboxIframe } from '@/components/CodeSandboxIframe';

const Index = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(6,182,212,0.1),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(59,130,246,0.1),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(168,85,247,0.1),transparent_50%)]"></div>
      </div>

      {/* Chat Sidebar */}
      <ChatSidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />

      {/* Main Content */}
      <main 
        className={`min-h-screen p-4 smooth-transition ${
          sidebarOpen ? 'md:ml-[80%] md:max-ml-md' : 'ml-0'
        }`}
      >
        <div className="h-[calc(100vh-2rem)]">
          {!sidebarOpen ? (
            <CodeSandboxIframe sidebarOpen={sidebarOpen} />
          ) : (
            <div className="h-full flex items-center justify-center">
              <div className="glass-strong p-8 rounded-2xl text-center max-w-md mx-auto">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center glow-cyan">
                  <span className="text-2xl font-bold text-white">C</span>
                </div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent mb-2">
                  Willkommen bei Codix AI
                </h1>
                <p className="text-muted-foreground leading-relaxed">
                  Schließe den Chat, um den integrierten CodeSandbox-Editor zu sehen und direkt mit der Entwicklung zu beginnen.
                </p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Index;
