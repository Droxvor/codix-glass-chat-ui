
import React from 'react';

interface CodeSandboxIframeProps {
  sidebarOpen: boolean;
}

export const CodeSandboxIframe: React.FC<CodeSandboxIframeProps> = ({ sidebarOpen }) => {
  return (
    <div
      className={`h-full smooth-transition ${
        sidebarOpen ? 'ml-[80%] max-ml-md' : 'ml-0'
      }`}
    >
      <div className="h-full w-full glass border border-white/10 rounded-lg overflow-hidden">
        <div className="h-full w-full">
          <iframe
            src="https://codesandbox.io/embed/react-new?fontsize=14&hidenavigation=1&theme=dark&view=split&module=%2Fsrc%2FApp.js"
            style={{
              width: '100%',
              height: '100%',
              border: 0,
              borderRadius: '8px',
              overflow: 'hidden',
            }}
            title="CodeSandbox React Editor"
            allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
            sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
          ></iframe>
        </div>
        
        {/* Overlay when sidebar is open on mobile */}
        {sidebarOpen && (
          <div className="absolute inset-0 bg-black/10 backdrop-blur-[1px] rounded-lg flex items-center justify-center md:hidden">
            <div className="glass-strong p-4 rounded-xl text-center">
              <p className="text-sm text-muted-foreground">
                CodeSandbox wird ausgeblendet während der Chat geöffnet ist
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
