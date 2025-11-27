import React, { useState } from 'react';
import config from './config';

const BackendTest = () => {
    const [result, setResult] = useState('');
    const [loading, setLoading] = useState(false);

    const testConnection = async () => {
        setLoading(true);
        setResult('Tesztelés folyamatban...\n');
        
        try {
            const token = localStorage.getItem('authToken');
            
            setResult(prev => prev + `\n✅ Token megtalálva: ${token ? 'Igen' : 'Nem'}`);
            setResult(prev => prev + `\n📍 API URL: ${config.API_BASE_URL}/felhasznalokLekerdezese`);
            
            if (!token) {
                setResult(prev => prev + '\n\n❌ HIBA: Nincs token! Kérlek jelentkezz be!');
                setLoading(false);
                return;
            }

            setResult(prev => prev + '\n\n🔄 Kérés indítása...');
            
            const response = await fetch(`${config.API_BASE_URL}/felhasznalokLekerdezese`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            setResult(prev => prev + `\n📊 Státusz kód: ${response.status}`);
            setResult(prev => prev + `\n📊 Státusz szöveg: ${response.statusText}`);

            if (response.ok) {
                const data = await response.json();
                setResult(prev => prev + `\n\n✅ SIKERES VÁLASZ!`);
                setResult(prev => prev + `\n📦 Adatok száma: ${data.length}`);
                setResult(prev => prev + `\n📋 Adatok:\n${JSON.stringify(data, null, 2)}`);
            } else {
                const errorText = await response.text();
                setResult(prev => prev + `\n\n❌ HIBA a szerverről:`);
                setResult(prev => prev + `\n${errorText}`);
            }
            
        } catch (error) {
            setResult(prev => prev + `\n\n❌ KAPCSOLATI HIBA:`);
            setResult(prev => prev + `\n${error.message}`);
            setResult(prev => prev + `\n\n💡 Lehetséges okok:`);
            setResult(prev => prev + `\n- A backend szerver nem fut`);
            setResult(prev => prev + `\n- Rossz port (jelenlegi: ${config.API_BASE_URL})`);
            setResult(prev => prev + `\n- CORS probléma`);
            setResult(prev => prev + `\n- Hálózati hiba`);
        } finally {
            setLoading(false);
        }
    };

    const checkToken = () => {
        const token = localStorage.getItem('authToken');
        const userData = localStorage.getItem('user');
        
        let info = '🔍 LocalStorage információk:\n\n';
        info += `Token: ${token ? '✅ Megvan (' + token.substring(0, 20) + '...)' : '❌ Nincs'}\n\n`;
        info += `User adatok: ${userData || '❌ Nincs'}\n\n`;
        
        if (userData) {
            try {
                const user = JSON.parse(userData);
                info += `👤 Felhasználó:\n${JSON.stringify(user, null, 2)}`;
            } catch (e) {
                info += `❌ Hibás user adat formátum`;
            }
        }
        
        setResult(info);
    };

    const clearStorage = () => {
        if (window.confirm('Biztosan törölni szeretnéd a localStorage-t? Újra be kell jelentkezned!')) {
            localStorage.clear();
            setResult('✅ LocalStorage törölve! Jelentkezz be újra.');
        }
    };

    return (
        <div style={{
            padding: '20px',
            maxWidth: '800px',
            margin: '0 auto',
            fontFamily: 'monospace'
        }}>
            <h2>🔧 Backend Kapcsolat Tesztelő</h2>
            
            <div style={{ marginBottom: '20px' }}>
                <button 
                    onClick={testConnection}
                    disabled={loading}
                    style={{
                        padding: '10px 20px',
                        margin: '5px',
                        fontSize: '16px',
                        cursor: loading ? 'not-allowed' : 'pointer',
                        background: '#7c3aed',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px'
                    }}
                >
                    {loading ? '⏳ Tesztelés...' : '🚀 Kapcsolat tesztelése'}
                </button>
                
                <button 
                    onClick={checkToken}
                    style={{
                        padding: '10px 20px',
                        margin: '5px',
                        fontSize: '16px',
                        cursor: 'pointer',
                        background: '#3b82f6',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px'
                    }}
                >
                    📋 Token ellenőrzése
                </button>
                
                <button 
                    onClick={clearStorage}
                    style={{
                        padding: '10px 20px',
                        margin: '5px',
                        fontSize: '16px',
                        cursor: 'pointer',
                        background: '#ef4444',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px'
                    }}
                >
                    🗑️ LocalStorage törlése
                </button>
            </div>

            <pre style={{
                background: '#1e293b',
                color: '#e2e8f0',
                padding: '20px',
                borderRadius: '8px',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
                minHeight: '300px',
                maxHeight: '600px',
                overflow: 'auto'
            }}>
                {result || 'Kattints a gombokra a teszteléshez...'}
            </pre>
        </div>
    );
};

export default BackendTest;
