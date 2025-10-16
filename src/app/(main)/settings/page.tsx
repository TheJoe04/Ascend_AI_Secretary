"use client";

import { useState } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatusPill } from "@/components/shared/status-pill";
import { useIntegrationsApi } from "@/lib/hooks/use-integrations-api";
import { IntegrationStatus } from "@/lib/types";
import { 
  Settings, 
  Users, 
  Plug, 
  CreditCard,
  CheckCircle,
  XCircle,
  AlertCircle,
  TestTube
} from "lucide-react";

export default function SettingsPage() {
  const { list, connect, disconnect, testConnection } = useIntegrationsApi();
  const [integrations, setIntegrations] = useState<IntegrationStatus[]>([]);
  const [activeTab, setActiveTab] = useState('general');
  const [isLoading, setIsLoading] = useState(false);

  const tabs = [
    { id: 'general', label: 'General', icon: Settings },
    { id: 'team', label: 'Team', icon: Users },
    { id: 'integrations', label: 'Integrations', icon: Plug },
    { id: 'billing', label: 'Billing', icon: CreditCard },
  ];

  const loadIntegrations = async () => {
    try {
      const data = await list();
      setIntegrations(data);
    } catch (err) {
      console.error("Failed to load integrations:", err);
    }
  };

  const handleConnect = async (type: string) => {
    setIsLoading(true);
    try {
      // Using mock integration for demonstration
      await connect(type as any, { apiKey: 'mock-api-key' });
      await loadIntegrations();
    } catch (err) {
      console.error("Failed to connect integration:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisconnect = async (type: string) => {
    setIsLoading(true);
    try {
      await disconnect(type as any);
      await loadIntegrations();
    } catch (err) {
      console.error("Failed to disconnect integration:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTestConnection = async (type: string) => {
    setIsLoading(true);
    try {
      const result = await testConnection(type as any);
      if (result) {
        // Show success toast
        console.log("Connection test successful");
      } else {
        // Show error toast
        console.log("Connection test failed");
      }
    } catch (err) {
      console.error("Connection test failed:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIcon = (connected: boolean) => {
    if (connected) {
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    } else {
      return <XCircle className="h-4 w-4 text-red-500" />;
    }
  };

  const getStatusColor = (connected: boolean) => {
    return connected ? 'success' : 'error';
  };

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Settings" 
        description="Manage your account and integrations"
      />

      {/* Tabs */}
      <div className="flex space-x-1 rounded-lg bg-muted p-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      {activeTab === 'general' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Company Name</label>
                  <Input placeholder="Your Company" defaultValue="Acme Corp" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Timezone</label>
                  <Input placeholder="UTC-8" defaultValue="Pacific Standard Time" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Business Hours</label>
                  <Input placeholder="9:00 AM - 5:00 PM" defaultValue="9:00 AM - 5:00 PM" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Primary Phone</label>
                  <Input placeholder="+1 (555) 123-4567" defaultValue="+1 (555) 123-4567" />
                </div>
              </div>
              <Button>Save Changes</Button>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'team' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Team Members</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-medium">
                      JD
                    </div>
                    <div>
                      <p className="font-medium">John Doe</p>
                      <p className="text-sm text-muted-foreground">john@company.com</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge>Admin</Badge>
                    <Button variant="outline" size="sm">Edit</Button>
                  </div>
                </div>
                <Button variant="outline">
                  <Users className="h-4 w-4 mr-2" />
                  Invite Team Member
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'integrations' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Integrations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {integrations.map((integration) => (
                <div key={integration.type} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
                      <Plug className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium">{integration.name}</p>
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(integration.connected)}
                        <StatusPill status={getStatusColor(integration.connected) as any}>
                          {integration.connected ? 'Connected' : 'Disconnected'}
                        </StatusPill>
                        {integration.lastSync && (
                          <span className="text-xs text-muted-foreground">
                            Last sync: {integration.lastSync.toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {integration.connected && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleTestConnection(integration.type)}
                        disabled={isLoading}
                      >
                        <TestTube className="h-4 w-4 mr-1" />
                        Test
                      </Button>
                    )}
                    <Button
                      variant={integration.connected ? "destructive" : "default"}
                      size="sm"
                      onClick={() => 
                        integration.connected 
                          ? handleDisconnect(integration.type)
                          : handleConnect(integration.type)
                      }
                      disabled={isLoading}
                    >
                      {integration.connected ? 'Disconnect' : 'Connect'}
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Integration Details */}
          <Card>
            <CardHeader>
              <CardTitle>Integration Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Twilio Account SID</label>
                <Input placeholder="AC..." defaultValue="AC1234567890abcdef" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Twilio Auth Token</label>
                <Input type="password" placeholder="••••••••" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">OpenAI API Key</label>
                <Input type="password" placeholder="sk-..." />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">ElevenLabs API Key</label>
                <Input type="password" placeholder="••••••••" />
              </div>
              <Button>Save API Keys</Button>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'billing' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Current Plan</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h3 className="font-semibold">Pro Plan</h3>
                  <p className="text-sm text-muted-foreground">
                    Unlimited calls, messages, and leads
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold">$99/month</p>
                  <p className="text-sm text-muted-foreground">Billed monthly</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 border rounded-lg">
                  <p className="text-2xl font-bold text-green-600">1,247</p>
                  <p className="text-sm text-muted-foreground">Calls this month</p>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <p className="text-2xl font-bold text-blue-600">2,891</p>
                  <p className="text-sm text-muted-foreground">Messages sent</p>
                </div>
              </div>
              <Button>Upgrade Plan</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Payment Method</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="h-8 w-12 bg-blue-600 rounded flex items-center justify-center text-white text-xs font-bold">
                    VISA
                  </div>
                  <div>
                    <p className="font-medium">•••• •••• •••• 4242</p>
                    <p className="text-sm text-muted-foreground">Expires 12/25</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">Update</Button>
              </div>
              <Button variant="outline">
                <CreditCard className="h-4 w-4 mr-2" />
                Add Payment Method
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

