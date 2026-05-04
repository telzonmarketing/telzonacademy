import React, { useEffect, useState } from 'react';
import { Loader2, Plus, Trash2, Save, RefreshCw, Video as VideoIcon } from 'lucide-react';
import { supabase } from '@/lib/customSupabaseClient';
import AdminShell from '@/components/admin/AdminShell';

const EMPTY = { title: '', url: '', thumbnail: '', description: '', is_published: true };

const AdminVideos = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [error, setError] = useState(null);
  const [columns, setColumns] = useState(null);

  const fetchVideos = async () => {
    setLoading(true);
    setError(null);
    const { data, error: err } = await supabase.from('videos').select('*').order('created_at', { ascending: false });
    if (err) setError(err.message);
    setVideos(data || []);
    if (data && data.length > 0) {
      setColumns(Object.keys(data[0]));
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  const startEdit = (v) => {
    setEditing(v.id);
    setForm({
      title: v.title || '',
      url: v.url || v.video_url || '',
      thumbnail: v.thumbnail || v.thumbnail_url || '',
      description: v.description || '',
      is_published: v.is_published ?? true,
    });
  };

  const startNew = () => {
    setEditing('new');
    setForm(EMPTY);
  };

  const cancel = () => {
    setEditing(null);
    setForm(EMPTY);
    setError(null);
  };

  const save = async () => {
    setSaving(true);
    setError(null);
    try {
      // Build payload only with fields that exist on the table
      const payload = {};
      const cols = columns ?? Object.keys(form);
      const fieldMap = {
        title: form.title,
        url: form.url,
        video_url: form.url,
        thumbnail: form.thumbnail,
        thumbnail_url: form.thumbnail,
        description: form.description,
        is_published: form.is_published,
      };
      for (const c of cols) {
        if (c in fieldMap) payload[c] = fieldMap[c];
      }
      // Fallback when columns unknown
      if (Object.keys(payload).length === 0) {
        Object.assign(payload, { title: form.title, url: form.url, thumbnail: form.thumbnail, description: form.description, is_published: form.is_published });
      }

      if (editing === 'new') {
        const { error: err } = await supabase.from('videos').insert(payload);
        if (err) throw err;
      } else {
        const { error: err } = await supabase.from('videos').update(payload).eq('id', editing);
        if (err) throw err;
      }
      await fetchVideos();
      cancel();
    } catch (e) {
      setError(e.message);
    }
    setSaving(false);
  };

  const remove = async (id) => {
    if (!window.confirm('Delete this video?')) return;
    const { error: err } = await supabase.from('videos').delete().eq('id', id);
    if (err) {
      setError(err.message);
      return;
    }
    fetchVideos();
  };

  return (
    <AdminShell title="Videos">
      <div className="flex items-center gap-2 mb-6">
        <button
          onClick={startNew}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold bg-gradient-to-r from-violet-600 to-orange-500 hover:opacity-90"
        >
          <Plus className="w-4 h-4" /> New video
        </button>
        <button onClick={fetchVideos} className="p-2.5 rounded-xl border border-white/10 hover:bg-white/5 text-gray-400">
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-xl text-red-300 text-sm border border-red-500/30 bg-red-500/10">
          {error}
        </div>
      )}

      {editing && (
        <div className="rounded-2xl border border-white/[0.07] p-5 mb-6 space-y-3" style={{ background: 'rgba(255,255,255,0.03)' }}>
          <input
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="Video title"
            className="w-full rounded-xl px-4 py-2.5 text-sm focus:outline-none"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#fff' }}
          />
          <input
            value={form.url}
            onChange={(e) => setForm({ ...form, url: e.target.value })}
            placeholder="YouTube/Vimeo URL or embed link"
            className="w-full rounded-xl px-4 py-2.5 text-sm focus:outline-none font-mono"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#fff' }}
          />
          <input
            value={form.thumbnail}
            onChange={(e) => setForm({ ...form, thumbnail: e.target.value })}
            placeholder="Thumbnail URL (optional)"
            className="w-full rounded-xl px-4 py-2.5 text-sm focus:outline-none font-mono"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#fff' }}
          />
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={3}
            placeholder="Description (optional)"
            className="w-full rounded-xl px-4 py-2.5 text-sm focus:outline-none"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#fff' }}
          />
          <label className="flex items-center gap-2 text-sm text-gray-300">
            <input
              type="checkbox"
              checked={form.is_published}
              onChange={(e) => setForm({ ...form, is_published: e.target.checked })}
            />
            Published
          </label>
          <div className="flex gap-2">
            <button
              onClick={save}
              disabled={saving}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold bg-gradient-to-r from-violet-600 to-orange-500 disabled:opacity-50"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Save
            </button>
            <button onClick={cancel} className="px-4 py-2 rounded-xl text-sm border border-white/10 hover:bg-white/5">
              Cancel
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 className="w-6 h-6 animate-spin text-violet-500" />
        </div>
      ) : videos.length === 0 ? (
        <div className="text-center py-24 rounded-2xl border border-white/[0.06]" style={{ background: 'rgba(255,255,255,0.02)' }}>
          <VideoIcon className="w-10 h-10 text-gray-700 mx-auto mb-3" />
          <p className="text-gray-500">No videos yet.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
          {videos.map((v) => (
            <div
              key={v.id}
              className="rounded-2xl border border-white/[0.06] overflow-hidden"
              style={{ background: 'rgba(255,255,255,0.03)' }}
            >
              {(v.thumbnail || v.thumbnail_url) && (
                <img src={v.thumbnail || v.thumbnail_url} alt="" className="w-full aspect-video object-cover" />
              )}
              <div className="p-4">
                <p className="text-sm font-bold truncate">{v.title || 'Untitled'}</p>
                <p className="text-xs text-gray-500 truncate font-mono mt-1">{v.url || v.video_url}</p>
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => startEdit(v)}
                    className="text-xs px-3 py-1.5 rounded-lg border border-white/10 hover:bg-white/5"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => remove(v.id)}
                    className="text-xs px-3 py-1.5 rounded-lg text-red-400 hover:bg-red-500/10"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminShell>
  );
};

export default AdminVideos;
