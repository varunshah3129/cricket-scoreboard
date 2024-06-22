import React, { useEffect, useState } from 'react';

const ApiUsageMonitor = () => {
    const [apiHitCount, setApiHitCount] = useState(0);
    const [apiHitDate, setApiHitDate] = useState('');

    useEffect(() => {
        const apiHitData = JSON.parse(localStorage.getItem('apiHitData') || '{}');
        setApiHitCount(apiHitData.count || 0);
        setApiHitDate(apiHitData.date || 'N/A');
    }, []);

    return (
        <div className="api-usage-monitor">
            <h2>API Usage Monitor</h2>
            <p>Date: {apiHitDate}</p>
            <p>API Hits Today: {apiHitCount}</p>
        </div>
    );
};

export default ApiUsageMonitor;
