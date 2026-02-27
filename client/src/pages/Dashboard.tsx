import React, { useState, useEffect } from 'react';
import { DollarSign, MousePointerClick, TrendingUp, Users } from 'lucide-react';
import './Dashboard.css';

interface Metrics {
    visitors: number;
    views: number;
    orders: number;
    totalRevenue: number;
    conversionRate: string;
    revenuePerVisitor: string;
}

export const Dashboard: React.FC = () => {
    const [metrics, setMetrics] = useState<Metrics | null>(null);

    useEffect(() => {
        fetch('http://localhost:3001/api/analytics/metrics')
            .then(res => res.json())
            .then(data => setMetrics(data.metrics));
    }, []);

    if (!metrics) return null;

    return (
        <div className="dashboard-container">
            <header className="dashboard-header">
                <h1>NovaCart Dashboard</h1>
                <p>Continuous Optimization & Analytics</p>
            </header>

            <div className="metrics-grid">
                <div className="metric-card glass">
                    <div className="metric-top">
                        <h4>Total Revenue</h4>
                        <DollarSign className="metric-icon" size={20} />
                    </div>
                    <div className="metric-value">${metrics.totalRevenue.toFixed(2)}</div>
                </div>

                <div className="metric-card glass">
                    <div className="metric-top">
                        <h4>Conversion Rate</h4>
                        <MousePointerClick className="metric-icon" size={20} />
                    </div>
                    <div className="metric-value">{metrics.conversionRate}%</div>
                </div>

                <div className="metric-card glass">
                    <div className="metric-top">
                        <h4>Revenue / Visitor</h4>
                        <TrendingUp className="metric-icon" size={20} />
                    </div>
                    <div className="metric-value">${metrics.revenuePerVisitor}</div>
                </div>

                <div className="metric-card glass">
                    <div className="metric-top">
                        <h4>Total Visitors</h4>
                        <Users className="metric-icon" size={20} />
                    </div>
                    <div className="metric-value">{metrics.visitors}</div>
                </div>
            </div>

            <div className="dashboard-section glass">
                <h3>A/B Testing Active Experiments</h3>
                <table className="ab-table">
                    <thead>
                        <tr>
                            <th>Experiment</th>
                            <th>Variant</th>
                            <th>Status</th>
                            <th>Conversion Rate</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>In-Cart Recommendations</td>
                            <td>A (Control)</td>
                            <td>Running</td>
                            <td>3.2%</td>
                        </tr>
                        <tr>
                            <td>In-Cart Recommendations</td>
                            <td>B (Machine Learning logic)</td>
                            <td>Running</td>
                            <td style={{ color: 'var(--success)', fontWeight: 600 }}>4.8%</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
};
