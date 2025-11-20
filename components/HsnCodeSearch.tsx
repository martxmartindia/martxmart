'use client';

import { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';

interface HsnCode {
  hsnCode: string;
  hsnName: string;
}

interface HsnCodeSearchProps {
  value: string;
  onChange: (value: string) => void;
}

export function HsnCodeSearch({ value, onChange }: HsnCodeSearchProps) {
  const [hsnCodes, setHsnCodes] = useState<HsnCode[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const searchHsnCodes = async (search: string) => {
    if (!search || search.length < 2) {
      setHsnCodes([]);
      return;
    }

    setLoading(true);
    try {
      console.log('Searching HSN codes for:', search);
      const response = await fetch(`/api/kyc/verify/hsn?search=${encodeURIComponent(search)}&limit=50`);
      console.log('HSN API response status:', response.status);
      if (response.ok) {
        const data = await response.json();
        console.log('HSN API data:', data);
        setHsnCodes(data.hsnCodes || []);
      } else {
        console.error('HSN API error:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching HSN codes:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      searchHsnCodes(searchQuery);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const handleSelect = (hsnCode: HsnCode) => {
    onChange(hsnCode.hsnCode);
    setSearchQuery(hsnCode.hsnCode);
    setShowDropdown(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <Label htmlFor="hsnCode">HSN Code</Label>
      <div className="relative">
        <Input
          value={searchQuery || value}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            onChange(e.target.value);
            setShowDropdown(true);
          }}
          onFocus={() => setShowDropdown(true)}
          placeholder="Search HSN code..."
          className="pr-8"
        />
        <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
      </div>
      
      {showDropdown && hsnCodes.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-64 overflow-auto">
          {loading && (
            <div className="p-2 text-sm text-gray-500">Searching...</div>
          )}
          {hsnCodes.map((hsn) => (
            <div
              key={hsn.hsnCode}
              className="p-2 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0"
              onClick={() => handleSelect(hsn)}
            >
              <div className="font-medium text-sm">{hsn.hsnCode}</div>
              <div className="text-xs text-gray-500 truncate">{hsn.hsnName}</div>
            </div>
          ))}
        </div>
      )}
      
      {showDropdown && !loading && hsnCodes.length === 0 && searchQuery.length >= 2 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg">
          <div className="p-2 text-sm text-gray-500">No HSN codes found</div>
        </div>
      )}
    </div>
  );
}