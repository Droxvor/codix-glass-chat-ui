
export interface LovableClaude {
  files: Array<{path: string, content: string}>;
  dependencies: string[];
  envVariables: Record<string, string>;
}

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
                'react-scripts': '^5.0.0',
                '@types/react': '^18.0.0',
                '@types/react-dom': '^18.0.0',
                'typescript': '^4.9.0',
                'tailwindcss': '^3.3.0',
                'autoprefixer': '^10.4.0',
                'postcss': '^8.4.0'
              },
              scripts: {
                start: 'react-scripts start',
                build: 'react-scripts build'
              },
              browserslist: {
                production: [">0.2%", "not dead", "not op_mini all"],
                development: ["last 1 chrome version", "last 1 firefox version", "last 1 safari version"]
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
    <script src="https://cdn.tailwindcss.com"></script>
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>`
          },
          'src/index.tsx': {
            content: `import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);`
          },
          'src/App.tsx': {
            content: code
          },
          'src/index.css': {
            content: `@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}`
          },
          'tailwind.config.js': {
            content: `/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}`
          },
          'postcss.config.js': {
            content: `module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}`
          }
        },
        template: 'create-react-app-typescript'
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

export async function createAdvancedCodeSandbox(lovableData: LovableClaude, title: string, codesandboxApiKey: string): Promise<string | null> {
  if (!codesandboxApiKey) {
    console.log('CodeSandbox API key not available');
    return null;
  }

  try {
    // Base dependencies
    const baseDependencies = {
      'react': '^18.0.0',
      'react-dom': '^18.0.0',
      'react-scripts': '^5.0.0',
      '@types/react': '^18.0.0',
      '@types/react-dom': '^18.0.0',
      'typescript': '^4.9.0',
      'tailwindcss': '^3.3.0',
      'autoprefixer': '^10.4.0',
      'postcss': '^8.4.0'
    };

    // Parse additional dependencies
    const additionalDeps: Record<string, string> = {};
    lovableData.dependencies.forEach(dep => {
      if (dep.includes('@')) {
        const [name, version] = dep.split('@');
        additionalDeps[name] = version || 'latest';
      } else {
        additionalDeps[dep] = 'latest';
      }
    });

    // Merge dependencies
    const allDependencies = { ...baseDependencies, ...additionalDeps };

    // Create base files structure
    const files: Record<string, { content: string }> = {
      'package.json': {
        content: JSON.stringify({
          name: title.toLowerCase().replace(/\s+/g, '-'),
          version: '1.0.0',
          main: 'index.js',
          dependencies: allDependencies,
          scripts: {
            start: 'react-scripts start',
            build: 'react-scripts build'
          },
          browserslist: {
            production: [">0.2%", "not dead", "not op_mini all"],
            development: ["last 1 chrome version", "last 1 firefox version", "last 1 safari version"]
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
    <script src="https://cdn.tailwindcss.com"></script>
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>`
      },
      'src/index.tsx': {
        content: `import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);`
      },
      'src/index.css': {
        content: `@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}`
      },
      'tailwind.config.js': {
        content: `/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}`
      },
      'postcss.config.js': {
        content: `module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}`
      }
    };

    // Add environment variables file if provided
    if (Object.keys(lovableData.envVariables).length > 0) {
      const envContent = Object.entries(lovableData.envVariables)
        .map(([key, value]) => `${key}=${value}`)
        .join('\n');
      
      files['.env'] = { content: envContent };
    }

    // Add all custom files from lov-write blocks
    lovableData.files.forEach(file => {
      files[file.path] = { content: file.content };
    });

    // Ensure App.tsx exists (fallback)
    if (!files['src/App.tsx']) {
      files['src/App.tsx'] = {
        content: `import React from 'react';

function App() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          Willkommen bei LovableClaude
        </h1>
        <p className="text-gray-600">
          Deine App wurde erfolgreich erstellt!
        </p>
      </div>
    </div>
  );
}

export default App;`
      };
    }

    const response = await fetch('https://codesandbox.io/api/v1/sandboxes/define', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${codesandboxApiKey}`,
      },
      body: JSON.stringify({
        files,
        template: 'create-react-app-typescript'
      })
    });

    if (response.ok) {
      const data = await response.json();
      console.log('Advanced CodeSandbox created with', lovableData.files.length, 'custom files');
      return `https://codesandbox.io/s/${data.sandbox_id}`;
    } else {
      console.error('Advanced CodeSandbox creation failed:', await response.text());
      return null;
    }
  } catch (error) {
    console.error('Error creating advanced CodeSandbox:', error);
    return null;
  }
}
