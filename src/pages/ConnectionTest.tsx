import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { apiEndpoints } from '@/lib/api';

export default function ConnectionTest() {
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const testConnection = async () => {
    setLoading(true);
    setResult('Testing...');
    
    try {
      console.log('Testing API URL:', apiEndpoints.health);
      const response = await fetch(apiEndpoints.health);
      const data = await response.json();
      
      if (response.ok) {
        setResult(`✅ Success: ${data.message}`);
      } else {
        setResult(`❌ Error: ${response.status} - ${data.error || 'Unknown error'}`);
      }
    } catch (error) {
      setResult(`❌ Connection Error: ${error.message}`);
      console.error('Connection test failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">API Connection Test</h1>
      <p className="mb-4">Testing connection to: {apiEndpoints.health}</p>
      <Button onClick={testConnection} disabled={loading}>
        {loading ? 'Testing...' : 'Test Connection'}
      </Button>
      {result && (
        <div className="mt-4 p-4 bg-gray-100 rounded">
          <pre>{result}</pre>
        </div>
      )}
    </div>
  );
}