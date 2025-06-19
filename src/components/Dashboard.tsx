
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Code, Zap, Globe, Users } from 'lucide-react';

const Dashboard: React.FC = () => {
  const features = [
    {
      icon: Code,
      title: 'Code Generierung',
      description: 'AI-gesteuerte Code-Erstellung mit Claude',
      color: 'text-blue-500'
    },
    {
      icon: Zap,
      title: 'Live Preview',
      description: 'Sofortige Vorschau mit CodeSandbox',
      color: 'text-yellow-500'
    },
    {
      icon: Globe,
      title: 'Web Apps',
      description: 'Vollständige React-Anwendungen',
      color: 'text-green-500'
    },
    {
      icon: Users,
      title: 'Collaboration',
      description: 'Team-fähige Entwicklung',
      color: 'text-purple-500'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Codix AI Dashboard
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Dein persönlicher AI-Code-Assistent mit Live-Preview. 
            Erstelle funktionierenden Code per Texteingabe.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <Card key={index} className="glass hover:shadow-lg transition-shadow">
                <CardHeader className="text-center">
                  <IconComponent className={`w-12 h-12 mx-auto mb-4 ${feature.color}`} />
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 text-center">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="text-center">
          <Card className="glass max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="text-2xl">Bereit zum Entwickeln?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600">
                Öffne die Chat-Sidebar und beginne mit deinem ersten Prompt.
              </p>
              <Button size="lg" className="glow-cyan">
                Chat öffnen
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
