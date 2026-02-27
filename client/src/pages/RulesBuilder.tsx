import React, { useState, useEffect } from 'react';
import { PlusCircle, Save, Trash2, ArrowRight } from 'lucide-react';
import './RulesBuilder.css';

interface Rule {
    id: string;
    name: string;
    condition: { type: string; value: string | number };
    action: { type: string; productId: string };
    active: boolean;
}

export const RulesBuilder: React.FC = () => {
    const [rules, setRules] = useState<Rule[]>([]);
    const [isCreating, setIsCreating] = useState(false);
    const [newRule, setNewRule] = useState<Partial<Rule>>({
        name: '',
        condition: { type: 'cart_value_greater_than', value: '' },
        action: { type: 'recommend', productId: '' }
    });

    useEffect(() => {
        fetch('http://localhost:3001/api/rules')
            .then(res => res.json())
            .then(data => setRules(data.rules));
    }, []);

    const handleSave = async () => {
        if (!newRule.name) return;

        // Convert value to number if it's cart_value_greater_than
        const payload = { ...newRule };
        if (payload.condition?.type === 'cart_value_greater_than') {
            payload.condition.value = Number(payload.condition.value);
        }

        const res = await fetch('http://localhost:3001/api/rules', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const data = await res.json();
        if (data.success) {
            setRules([...rules, data.rule]);
            setIsCreating(false);
            setNewRule({
                name: '',
                condition: { type: 'cart_value_greater_than', value: '' },
                action: { type: 'recommend', productId: '' }
            });
        }
    };

    return (
        <div className="container" style={{ padding: '2rem 1.5rem' }}>
            <header className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Logic Engine</h1>
                    <p style={{ color: 'var(--text-muted)' }}>No-code personalization rules.</p>
                </div>
                <button className="btn btn-primary" onClick={() => setIsCreating(true)}>
                    <PlusCircle size={18} style={{ marginRight: '0.5rem' }} /> Create Rule
                </button>
            </header>

            {isCreating && (
                <div className="glass rule-editor-card">
                    <div className="editor-header">
                        <h3>New Logic Rule</h3>
                    </div>

                    <div className="editor-form">
                        <div className="form-group">
                            <label>Rule Name</label>
                            <input
                                type="text"
                                placeholder="e.g. VIP Upsell Offer"
                                value={newRule.name}
                                onChange={e => setNewRule({ ...newRule, name: e.target.value })}
                            />
                        </div>

                        <div className="logic-row">
                            <div className="logic-block if-block">
                                <div className="logic-tag">IF</div>
                                <select
                                    value={newRule.condition?.type}
                                    onChange={e => setNewRule({ ...newRule, condition: { ...newRule.condition!, type: e.target.value } })}
                                >
                                    <option value="cart_value_greater_than">Cart Value is greater than</option>
                                    <option value="cart_contains">Cart contains Product ID</option>
                                </select>
                                <input
                                    type="text"
                                    placeholder="Value..."
                                    value={newRule.condition?.value}
                                    onChange={e => setNewRule({ ...newRule, condition: { ...newRule.condition!, value: e.target.value } })}
                                />
                            </div>

                            <div className="logic-arrow"><ArrowRight size={24} color="var(--text-muted)" /></div>

                            <div className="logic-block then-block">
                                <div className="logic-tag then-tag">THEN</div>
                                <select
                                    value={newRule.action?.type}
                                    onChange={e => setNewRule({ ...newRule, action: { ...newRule.action!, type: e.target.value } })}
                                >
                                    <option value="recommend">Recommend Product ID</option>
                                    <option value="show_upsell_modal">Show Upsell Modal for Product ID</option>
                                </select>
                                <input
                                    type="text"
                                    placeholder="Product ID..."
                                    value={newRule.action?.productId}
                                    onChange={e => setNewRule({ ...newRule, action: { ...newRule.action!, productId: e.target.value } })}
                                />
                            </div>
                        </div>

                        <div className="editor-actions">
                            <button className="btn btn-primary" onClick={handleSave}><Save size={16} style={{ marginRight: '0.5rem' }} /> Save Rule</button>
                            <button className="btn btn-outline" onClick={() => setIsCreating(false)}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}

            <div className="rules-list">
                {rules.map(rule => (
                    <div key={rule.id} className="rule-card glass">
                        <div className="rule-info">
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                                <div className={`status-dot ${rule.active ? 'active' : ''}`}></div>
                                <h4 style={{ fontSize: '1.125rem' }}>{rule.name}</h4>
                            </div>
                            <div className="rule-logic-preview">
                                <span className="logic-pill">IF</span>
                                {rule.condition.type === 'cart_value_greater_than' ? `Cart > $${rule.condition.value}` : `Cart has Item ${rule.condition.value}`}
                                <ArrowRight size={14} style={{ margin: '0 0.5rem' }} />
                                <span className="logic-pill then">THEN</span>
                                {rule.action.type === 'recommend' ? `Recommend Item ${rule.action.productId}` : `Upsell Item ${rule.action.productId}`}
                            </div>
                        </div>
                        <div className="rule-actions">
                            <button className="btn-icon"><Trash2 size={18} /></button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
