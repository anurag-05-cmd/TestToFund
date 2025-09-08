"use client";

export default function Debug() {
  const testClaimAPI = async () => {
    try {
      const formData = new FormData();
      formData.append('walletAddress', '0x1234567890123456789012345678901234567890'); // Test address
      formData.append('certificateUrl', 'https://www.udemy.com/certificate/UC-test123456');
      formData.append('timestamp', Date.now().toString());
      
      const response = await fetch('/api/rewards/claim', {
        method: 'POST',
        body: formData
      });
      
      const data = await response.json();
      console.log('Response:', data);
      console.log('Status:', response.status);
      
      alert(`Response: ${JSON.stringify(data, null, 2)}`);
    } catch (error: any) {
      console.error('Error:', error);
      alert(`Error: ${error?.message || 'Unknown error'}`);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Debug Page</h1>
      <button 
        onClick={testClaimAPI}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Test Claim API
      </button>
    </div>
  );
}
