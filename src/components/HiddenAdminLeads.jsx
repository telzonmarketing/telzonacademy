import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { supabase } from '@/lib/customSupabaseClient';
import { RefreshCw } from "lucide-react";

const HiddenAdminLeads = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLeads = async () => {
    setLoading(true);
    // Ensure your Supabase table is named 'leads'
    const { data, error } = await supabase.from('leads').select('*').order('created_at', { ascending: false });
    if (!error) setLeads(data);
    setLoading(false);
  };

  useEffect(() => { fetchLeads(); }, []);

  return (
    <>
      <Helmet>
        <meta name="robots" content="noindex, nofollow" />
        <title>Admin – Leads | Telzon Academy</title>
      </Helmet>
    <div className="min-h-screen bg-[#030014] text-white p-8 pt-32">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Registration Leads</h1>
          <button onClick={fetchLeads} className="bg-white/10 p-2 rounded-full hover:bg-white/20">
            <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
          </button>
        </div>

        <div className="overflow-x-auto bg-white/5 rounded-xl border border-white/10">
          <table className="w-full text-left border-collapse">
            <thead className="bg-white/10">
              <tr>
                <th className="p-4 border-b border-white/10">Name</th>
                <th className="p-4 border-b border-white/10">Email</th>
                <th className="p-4 border-b border-white/10">Phone</th>
                <th className="p-4 border-b border-white/10">Source</th>
                <th className="p-4 border-b border-white/10">Date</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead) => (
                <tr key={lead.id} className="hover:bg-white/5 transition-colors">
                  <td className="p-4 border-b border-white/5">{lead.full_name || lead.name}</td>
                  <td className="p-4 border-b border-white/5">{lead.email}</td>
                  <td className="p-4 border-b border-white/5">{lead.phone || lead.mobile}</td>
                  <td className="p-4 border-b border-white/5">{lead.source || 'general'}</td>
                  <td className="p-4 border-b border-white/5">{new Date(lead.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {leads.length === 0 && !loading && <p className="p-10 text-center text-gray-500">No leads found yet.</p>}
        </div>
      </div>
    </div>
    </>
  );
};

export default HiddenAdminLeads;
