'use client';

import axios from 'axios';
import { useEffect, useState } from 'react';
export default function HsnCode() {
  const [hsnList, setHsnList] = useState([]);
  const [sacList, setSacList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hsnError, setHsnError] = useState(null);
  const [sacError, setSacError] = useState(null);
  const [hsnSearch, setHsnSearch] = useState('');
  const [sacSearch, setSacSearch] = useState('');

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setLoading(true);
        const [hsnResponse, sacResponse] = await Promise.all([
          axios.get('/api/kyc/verify/hsn'),
          axios.get('/api/kyc/verify/sac'),
        ]);

        setHsnList(hsnResponse.data.hsn || []);
        setSacList(sacResponse.data.sac || []);
                setLoading(false);
      } catch (error:any) {
        setHsnError(error);
        setSacError(error);
        setLoading(false);
      }
    };

    fetchDetails();
  }, []);

  const filteredHsn = hsnList.filter(
    (item: any) =>
      item.hsnCode.toLowerCase().includes(hsnSearch.toLowerCase()) ||
      item.hsnName.toLowerCase().includes(hsnSearch.toLowerCase())
  );

  const filteredSac = sacList.filter(
    (item: any) =>
      item.sacCode.toLowerCase().includes(sacSearch.toLowerCase()) ||
      item.sacName.toLowerCase().includes(sacSearch.toLowerCase())
  );

  return (
    <main className="p-4 bg-gray-100 min-h-screen">
      <div className="mb-8">
        <h1 className="text-xl font-bold mb-2">HSN Code</h1>
        <input
          type="text"
          placeholder="Search HSN Code or Name"
          className="p-2 mb-4 w-full border rounded"
          value={hsnSearch}
          onChange={(e) => setHsnSearch(e.target.value)}
        />
        <select className="w-full p-2 border rounded">
          {filteredHsn.map((hsn: any, index: number) => (
            <option key={index} value={hsn.hsnCode}>
              {hsn.hsnName} ({hsn.hsnCode})
            </option>
          ))}
        </select>
        {hsnError && <p className="text-red-500">Error loading HSN details.</p>}
      </div>

      <div>
        <h1 className="text-xl font-bold mb-2">SAC Code</h1>
        <input
          type="text"
          placeholder="Search SAC Code or Name"
          className="p-2 mb-4 w-full border rounded"
          value={sacSearch}
          onChange={(e) => setSacSearch(e.target.value)}
        />
        <select className="w-full p-2 border rounded">
          {filteredSac.map((sac: any, index: number) => (
            <option key={index} value={sac.sacCode}>
              {sac.sacName} ({sac.sacCode})
            </option>
          ))}
        </select>
        {sacError && <p className="text-red-500">Error loading SAC details.</p>}
      </div>

      {loading && <p className="text-blue-500 mt-4">Loading data...</p>}
    </main>
  );
}
