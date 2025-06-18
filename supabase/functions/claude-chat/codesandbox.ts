
export async function createCodeSandbox(code: string, title: string, codesandboxApiKey: string): Promise<string | null> {
  if (!codesandboxApiKey) {
    console.log('CodeSandbox API key not available');
    return null;
  }

  try {
    const response = await fetch('https://codesandbox.io/api/v1/sandboxes/define', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${codesandboxApiKey}`,
      },
      body: JSON.stringify({
        files: {
          'package.json': {
            content: JSON.stringify({
              name: title.toLowerCase().replace(/\s+/g, '-'),
              version: '1.0.0',
              main: 'index.js',
              dependencies: {
                'react': '^18.0.0',
                'react-dom': '^18.0.0',
                'react-scripts': '^5.0.0'
              },
              scripts: {
                start: 'react-scripts start',
                build: 'react-scripts build'
              }
            }, null, 2)
          },
          'public/index.html': {
            content: `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${title}</title>
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>`
          },
          'src/index.js': {
            content: `import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);`
          },
          'src/App.js': {
            content: code
          }
        },
        template: 'create-react-app'
      })
    });

    if (response.ok) {
      const data = await response.json();
      return `https://codesandbox.io/s/${data.sandbox_id}`;
    } else {
      console.error('CodeSandbox creation failed:', await response.text());
      return null;
    }
  } catch (error) {
    console.error('Error creating CodeSandbox:', error);
    return null;
  }
}
