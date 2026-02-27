import React, { useState, useEffect } from 'react';
import { Settings, CheckCircle, Smartphone, Mail, Repeat } from 'lucide-react';
import './IntegrationsHub.css';

interface Integration {
    id: string;
    name: string;
    type: string;
    connected: boolean;
}

export const IntegrationsHub: React.FC = () => {
    const [integrations, setIntegrations] = useState<Integration[]>([]);

    useEffect(() => {
        fetch('http://localhost:3001/api/integrations')
            .then(res => res.json())
            .then(data => setIntegrations(data.integrations));
    }, []);

    const toggleConnection = async (id: string, currentStatus: boolean) => {
        const res = await fetch('http://localhost:3001/api/integrations/sync', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id, connected: !currentStatus })
        });

        const data = await res.json();
        if (data.success) {
            setIntegrations(prev => prev.map(i => i.id === id ? data.integration : i));
        }
    };

    const getIcon = (id: string) => {
        switch (id) {
            case 'klaviyo':
            case 'attentive': return <Mail size={32} />;
            case 'recharge': return <Repeat size={32} />;
            case 'tapcart': return <Smartphone size={32} />;
            default: return <Settings size={32} />;
        }
    };

    return (
        <div className="container" style={{ padding: '2rem 1.5rem' }}>
            <header className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Ecosystem Hub</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Connect NovaCart AI with your existing tech stack.</p>
                </div>
            </header>

            <div className="integrations-grid">
                {integrations.map(integration => (
                    <div key={integration.id} className="integration-card glass">
                        <div className="integration-header">
                            <div className={`integration-icon ${integration.connected ? 'active' : ''}`}>
                                {getIcon(integration.id)}
                            </div>
                            <div className="integration-status">
                                {integration.connected ? (
                                    <span className="status-badge connected"><CheckCircle size={12} /> Connected</span>
                                ) : (
                                    <span className="status-badge disconnected">Disconnected</span>
                                )}
                            </div>
                        </div>

                        <div className="integration-info">
                            <h3>{integration.name}</h3>
                            <p>{integration.type}</p>
                        </div>

                        <div className="integration-actions">
                            <button
                                className={`btn ${integration.connected ? 'btn-outline' : 'btn-primary'}`}
                                onClick={() => toggleConnection(integration.id, integration.connected)}
                                style={{ width: '100%' }}
                            >
                                {integration.connected ? 'Disconnect' : 'Connect'}
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
