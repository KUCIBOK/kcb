import React, { useState } from 'react';
import { Mail, Search, Plus, Trash, Edit, Save } from 'lucide-react';
import { 
  Button, 
  Input, 
  Card, 
  CardHeader, 
  CardContent, 
  CardFooter,
  Badge,
  StatusBadge,
  KPICard,
  toast
} from './index';

/**
 * Design System Demo Page
 * 
 * Showcases all available components with live examples
 * Access at: /design-system (add route in Router.jsx)
 */

export function DesignSystemDemo() {
  const [inputValue, setInputValue] = useState('');
  const [emailError, setEmailError] = useState('');

  const validateEmail = (value) => {
    if (value && !/\S+@\S+\.\S+/.test(value)) {
      setEmailError('Email invalide');
    } else {
      setEmailError('');
    }
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">Design System KuciBoK</h1>
          <p className="text-gray-400">Composants UI réutilisables pour une expérience cohérente</p>
        </div>

        {/* Buttons */}
        <section>
          <h2 className="text-2xl font-semibold text-white mb-6">Buttons</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader title="Variants" />
              <CardContent>
                <div className="space-y-3">
                  <Button variant="primary" fullWidth>Primary Button</Button>
                  <Button variant="secondary" fullWidth>Secondary Button</Button>
                  <Button variant="danger" fullWidth>Danger Button</Button>
                  <Button variant="ghost" fullWidth>Ghost Button</Button>
                  <Button variant="outline" fullWidth>Outline Button</Button>
                  <Button variant="success" fullWidth>Success Button</Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader title="Sizes" />
              <CardContent>
                <div className="space-y-3">
                  <Button size="sm" fullWidth>Small Button</Button>
                  <Button size="md" fullWidth>Medium Button (default)</Button>
                  <Button size="lg" fullWidth>Large Button</Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader title="States & Icons" />
              <CardContent>
                <div className="space-y-3">
                  <Button icon={Plus} fullWidth>With Icon</Button>
                  <Button icon={Save} iconPosition="right" fullWidth>Icon Right</Button>
                  <Button loading fullWidth>Loading...</Button>
                  <Button disabled fullWidth>Disabled</Button>
                  <Button 
                    onClick={() => toast.success('Button clicked!')}
                    fullWidth
                  >
                    Show Toast
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Inputs */}
        <section>
          <h2 className="text-2xl font-semibold text-white mb-6">Inputs</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader title="Basic Inputs" />
              <CardContent>
                <div className="space-y-4">
                  <Input
                    label="Nom complet"
                    placeholder="Entrez votre nom"
                    helperText="Votre nom tel qu'il apparaîtra"
                  />
                  <Input
                    label="Email"
                    type="email"
                    placeholder="exemple@email.com"
                    leftIcon={Mail}
                    required
                  />
                  <Input
                    label="Recherche"
                    placeholder="Rechercher..."
                    leftIcon={Search}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader title="States" />
              <CardContent>
                <div className="space-y-4">
                  <Input
                    label="Email valide"
                    type="email"
                    value="user@example.com"
                    success
                  />
                  <Input
                    label="Email invalide"
                    type="email"
                    value={inputValue}
                    onChange={(e) => {
                      setInputValue(e.target.value);
                      validateEmail(e.target.value);
                    }}
                    error={emailError}
                  />
                  <Input
                    label="Input désactivé"
                    disabled
                    value="Disabled input"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* KPI Cards */}
        <section>
          <h2 className="text-2xl font-semibold text-white mb-6">KPI Cards</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <KPICard
              icon={Mail}
              label="Total Contacts"
              value="2,543"
              trend={{ value: '+12%', direction: 'up' }}
              subtitle="vs last month"
            />
            <KPICard
              icon={Plus}
              label="New Signups"
              value="387"
              trend={{ value: '-5%', direction: 'down' }}
              iconColor="text-green-400"
              iconBgColor="bg-green-900/20"
            />
            <KPICard
              icon={Edit}
              label="Active Users"
              value="1,892"
              trend={{ value: '0%', direction: 'neutral' }}
              iconColor="text-yellow-400"
              iconBgColor="bg-yellow-900/20"
            />
            <KPICard
              icon={Trash}
              label="Revenue"
              value="€45,231"
              trend={{ value: '+23%', direction: 'up' }}
              iconColor="text-purple-400"
              iconBgColor="bg-purple-900/20"
            />
          </div>
        </section>

        {/* Badges */}
        <section>
          <h2 className="text-2xl font-semibold text-white mb-6">Badges</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader title="Variants" />
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  <Badge>Default</Badge>
                  <Badge variant="success">Success</Badge>
                  <Badge variant="warning">Warning</Badge>
                  <Badge variant="danger">Danger</Badge>
                  <Badge variant="info">Info</Badge>
                  <Badge variant="primary">Primary</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader title="Status Badges" />
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  <StatusBadge status="active" />
                  <StatusBadge status="pending" />
                  <StatusBadge status="approved" />
                  <StatusBadge status="rejected" />
                  <StatusBadge status="draft" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader title="With Icons & Dots" />
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="success" icon={Plus}>With Icon</Badge>
                  <Badge variant="danger" dot>With Dot</Badge>
                  <Badge variant="primary" removable onRemove={() => alert('Removed!')}>
                    Removable
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader title="Sizes" />
              <CardContent>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge size="sm">Small</Badge>
                  <Badge size="md">Medium</Badge>
                  <Badge size="lg">Large</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Cards */}
        <section>
          <h2 className="text-2xl font-semibold text-white mb-6">Cards</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card variant="default">
              <CardHeader 
                title="Default Card" 
                subtitle="Simple card with border"
              />
              <CardContent>
                <p>This is a default card with standard styling.</p>
              </CardContent>
            </Card>

            <Card variant="elevated">
              <CardHeader title="Elevated Card" />
              <CardContent>
                <p>This card has a shadow effect.</p>
              </CardContent>
            </Card>

            <Card variant="glass">
              <CardHeader title="Glass Card" />
              <CardContent>
                <p>This card has a glassmorphism effect.</p>
              </CardContent>
            </Card>

            <Card hover>
              <CardHeader 
                title="Interactive Card"
                actions={
                  <Button size="sm" variant="ghost" icon={Edit} />
                }
              />
              <CardContent>
                <p>This card has hover effects.</p>
              </CardContent>
              <CardFooter justify="between">
                <Button variant="ghost" size="sm">Cancel</Button>
                <Button size="sm">Save</Button>
              </CardFooter>
            </Card>
          </div>
        </section>

        {/* Toast Examples */}
        <section>
          <h2 className="text-2xl font-semibold text-white mb-6">Toast Notifications</h2>
          <Card>
            <CardHeader title="Try Different Toasts" />
            <CardContent>
              <div className="flex flex-wrap gap-3">
                <Button onClick={() => toast.success('Operation successful!')}>
                  Success Toast
                </Button>
                <Button 
                  variant="danger"
                  onClick={() => toast.error('Something went wrong')}
                >
                  Error Toast
                </Button>
                <Button 
                  variant="secondary"
                  onClick={() => toast.warning('Please verify your data')}
                >
                  Warning Toast
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => toast.info('New update available')}
                >
                  Info Toast
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => {
                    const promise = new Promise((resolve) => 
                      setTimeout(resolve, 2000)
                    );
                    toast.promise(promise, {
                      loading: 'Saving...',
                      success: 'Saved successfully!',
                      error: 'Failed to save'
                    });
                  }}
                >
                  Promise Toast
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}

export default DesignSystemDemo;
