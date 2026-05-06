import React, { useEffect, useRef, useState } from 'react';
import {
  Loader2, Plus, Trash2, Save, RefreshCw,
  Video as VideoIcon, Settings, ToggleLeft, ToggleRight,
  Link as LinkIcon, Upload, X, CheckCircle, Film,
} from 'lucide-react';
import { supabase } from '@/lib/customSupabaseClient';
import AdminShell from '@/components/admin/AdminShell';

const BUCKET = 'reel-videos';
const EMPTY = { title: '', url: '', thumbnail: '', description: '', is_published: true };

function extractYouTubeId(input) {
  if (!input) return '';
  if (/^[a-zA-Z0-9_-]{11}$/.test(input.trim())) return input.trim();
  const m = input.match(/(?:v=|youtu\.be\/|embed\/)([a-zA-Z0-9_-]{11})/);
  return m ? m[1] : input.trim();
}

function formatBytes(bytes) {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

// ── New Batch Page Video Settings ──────────────────────────────────────────
const NewBatchVideoSettings = () => {
  const [ytUrl, setYtUrl]         = useState('');
  const [autoplay, setAutoplay]   = useState(false);
  const [reelUrl, setReelUrl]     = useState('');   // uploaded video public URL
  const [reelPath, setReelPath]   = useState('');   // storage path for delete
  const [loading, setLoading]     = useState(true);
  const [saving, setSaving]       = useState(false);
  const [saved, setSaved]         = useState(false);
  const [error, setError]         = useState(null);

  // Upload state
  const [uploading, setUploading]   = useState(false);
  const [uploadPct, setUploadPct]   = useState(0);
  const [uploadError, setUploadError] = useState(null);
  const [deleting, setDeleting]     = useState(false);
  const fileRef = useRef(null);

  // ── Load from DB ──
  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from('seoSettings')
        .select('google_code, pixel_code, retargeting_code')
        .eq('page_key', 'new-batch-video')
        .maybeSingle();
      if (data) {
        setYtUrl(data.google_code || '');
        setAutoplay(data.pixel_code === 'true');
        setReelUrl(data.retargeting_code || '');
        // extract path from URL: …/reel-videos/<path>
        if (data.retargeting_code) {
          const m = data.retargeting_code.match(/reel-videos\/(.+)$/);
          if (m) setReelPath(m[1]);
        }
      }
      setLoading(false);
    };
    load();
  }, []);

  // ── Save YouTube + autoplay settings ──
  const save = async () => {
    setSaving(true); setError(null); setSaved(false);
    const payload = {
      google_code: ytUrl.trim(),
      pixel_code: autoplay ? 'true' : 'false',
    };
    const { data: existing } = await supabase
      .from('seoSettings').select('id').eq('page_key', 'new-batch-video').maybeSingle();
    let err;
    if (existing?.id) {
      ({ error: err } = await supabase.from('seoSettings').update(payload).eq('page_key', 'new-batch-video'));
    } else {
      ({ error: err } = await supabase.from('seoSettings').insert({ ...payload, retargeting_code: reelUrl || '', page_key: 'new-batch-video' }));
    }
    if (err) setError(err.message);
    else { setSaved(true); setTimeout(() => setSaved(false), 3000); }
    setSaving(false);
  };

  // ── Upload reel video ──
  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadError(null);

    // Validate size (100 MB)
    if (file.size > 100 * 1024 * 1024) {
      setUploadError(`File too large (${formatBytes(file.size)}). Maximum is 100 MB.`);
      return;
    }

    // Validate type
    if (!file.type.startsWith('video/')) {
      setUploadError('Please select a video file (MP4, MOV, WebM).');
      return;
    }

    setUploading(true); setUploadPct(0);

    const fileName = `reel-${Date.now()}-${file.name.replace(/\s+/g, '_')}`;

    // If old file exists, delete it first
    if (reelPath) {
      await supabase.storage.from(BUCKET).remove([reelPath]);
    }

    // Upload with progress tracking via XHR (Supabase JS client doesn't expose progress)
    const { data: { session } } = await supabase.auth.getSession();
    const token = session?.access_token;
    const projectRef = 'lcnfnwivodzjjpykihfn';
    const uploadUrl = `https://${projectRef}.supabase.co/storage/v1/object/${BUCKET}/${fileName}`;

    await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('POST', uploadUrl);
      xhr.setRequestHeader('Authorization', `Bearer ${token}`);
      xhr.setRequestHeader('x-upsert', 'true');
      xhr.upload.onprogress = (ev) => {
        if (ev.lengthComputable) setUploadPct(Math.round((ev.loaded / ev.total) * 100));
      };
      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) resolve();
        else reject(new Error(xhr.responseText));
      };
      xhr.onerror = () => reject(new Error('Upload failed'));

      const fd = new FormData();
      fd.append('', file, fileName);
      xhr.send(fd);
    }).catch((err) => {
      setUploadError(err.message);
      setUploading(false);
      return;
    });

    // Get public URL
    const { data: { publicUrl } } = supabase.storage.from(BUCKET).getPublicUrl(fileName);

    // Save to seoSettings
    const { data: existing } = await supabase
      .from('seoSettings').select('id').eq('page_key', 'new-batch-video').maybeSingle();
    if (existing?.id) {
      await supabase.from('seoSettings').update({ retargeting_code: publicUrl }).eq('page_key', 'new-batch-video');
    } else {
      await supabase.from('seoSettings').insert({ page_key: 'new-batch-video', google_code: ytUrl, pixel_code: autoplay ? 'true' : 'false', retargeting_code: publicUrl });
    }

    setReelUrl(publicUrl);
    setReelPath(fileName);
    setUploading(false);
    setUploadPct(0);
    if (fileRef.current) fileRef.current.value = '';
  };

  // ── Delete reel video ──
  const deleteReel = async () => {
    if (!window.confirm('Delete the uploaded reel video?')) return;
    setDeleting(true);
    if (reelPath) {
      await supabase.storage.from(BUCKET).remove([reelPath]);
    }
    await supabase.from('seoSettings').update({ retargeting_code: '' }).eq('page_key', 'new-batch-video');
    setReelUrl(''); setReelPath('');
    setDeleting(false);
  };

  const previewId = extractYouTubeId(ytUrl);

  return (
    <div className="rounded-2xl border border-violet-500/20 mb-8 overflow-hidden" style={{ background: 'rgba(139,92,246,0.05)' }}>
      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-4 border-b border-white/[0.06]">
        <Settings className="w-5 h-5 text-violet-400" />
        <div>
          <p className="text-sm font-bold text-white">New Batch Page — Video Settings</p>
          <p className="text-xs text-gray-500">Controls the video at <span className="font-mono text-gray-400">/new-batch</span> · Reel takes priority over YouTube</p>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-10">
          <Loader2 className="w-5 h-5 animate-spin text-violet-500" />
        </div>
      ) : (
        <div className="p-5 space-y-6">

          {/* ── SECTION A: Upload Reel Video ── */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Film className="w-4 h-4 text-orange-400" />
              <p className="text-sm font-bold text-white">Upload Reel Video</p>
              <span className="text-xs text-gray-500 bg-white/5 px-2 py-0.5 rounded-full">max 100 MB · MP4 / MOV / WebM</span>
            </div>

            {/* Current reel preview */}
            {reelUrl && !uploading && (
              <div className="mb-4 flex items-start gap-4">
                <div
                  className="relative rounded-xl overflow-hidden border border-white/10 bg-black flex-shrink-0"
                  style={{ width: 120, aspectRatio: '9/16' }}
                >
                  <video
                    src={reelUrl}
                    className="w-full h-full object-cover"
                    muted
                    playsInline
                    onMouseOver={(e) => e.target.play()}
                    onMouseOut={(e) => { e.target.pause(); e.target.currentTime = 0; }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                    <VideoIcon className="w-8 h-8 text-white" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-1">
                    <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                    <p className="text-sm text-green-300 font-semibold">Reel video uploaded</p>
                  </div>
                  <p className="text-xs text-gray-500 break-all font-mono mb-3">{reelUrl.split('/').pop()}</p>
                  <div className="flex gap-2">
                    <label
                      htmlFor="reel-upload"
                      className="cursor-pointer flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border border-white/10 hover:bg-white/5 text-gray-300"
                    >
                      <Upload className="w-3.5 h-3.5" /> Replace
                    </label>
                    <button
                      onClick={deleteReel}
                      disabled={deleting}
                      className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg text-red-400 hover:bg-red-500/10 border border-red-500/20"
                    >
                      {deleting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Upload area */}
            {!reelUrl && !uploading && (
              <label
                htmlFor="reel-upload"
                className="flex flex-col items-center justify-center gap-3 p-8 rounded-xl border-2 border-dashed border-white/10 hover:border-violet-500/40 cursor-pointer transition-colors"
                style={{ background: 'rgba(255,255,255,0.02)' }}
              >
                <div className="w-12 h-12 rounded-full bg-violet-500/10 flex items-center justify-center">
                  <Upload className="w-5 h-5 text-violet-400" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-semibold text-white">Click to upload reel video</p>
                  <p className="text-xs text-gray-500 mt-1">Vertical 9:16 format · Max 100 MB</p>
                </div>
              </label>
            )}

            {/* Upload progress */}
            {uploading && (
              <div className="p-5 rounded-xl border border-white/10" style={{ background: 'rgba(255,255,255,0.03)' }}>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-white font-semibold">Uploading…</p>
                  <p className="text-sm text-violet-400 font-bold">{uploadPct}%</p>
                </div>
                <div className="w-full bg-white/10 rounded-full h-2">
                  <div
                    className="h-2 rounded-full bg-gradient-to-r from-violet-500 to-orange-500 transition-all duration-300"
                    style={{ width: `${uploadPct}%` }}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-2">Do not close this tab while uploading</p>
              </div>
            )}

            <input
              ref={fileRef}
              id="reel-upload"
              type="file"
              accept="video/mp4,video/quicktime,video/webm,video/mpeg,video/x-m4v"
              className="hidden"
              onChange={handleFileChange}
            />

            {uploadError && (
              <p className="mt-2 text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-3 py-2">{uploadError}</p>
            )}
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-white/[0.06]" />
            <span className="text-xs text-gray-600 uppercase tracking-wider">or use YouTube</span>
            <div className="flex-1 h-px bg-white/[0.06]" />
          </div>

          {/* ── SECTION B: YouTube URL ── */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <LinkIcon className="w-4 h-4 text-red-400" />
              <p className="text-sm font-bold text-white">YouTube Video URL</p>
              {reelUrl && <span className="text-xs text-gray-600 bg-white/5 px-2 py-0.5 rounded-full">disabled — reel is active</span>}
            </div>
            <input
              value={ytUrl}
              onChange={(e) => { setYtUrl(e.target.value); setSaved(false); }}
              placeholder="https://youtube.com/watch?v=... or paste video ID"
              disabled={!!reelUrl}
              className="w-full pl-4 pr-4 py-2.5 rounded-xl text-sm focus:outline-none font-mono disabled:opacity-40"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }}
            />
            {previewId && !reelUrl && (
              <div className="mt-3 flex items-start gap-3">
                <img
                  src={`https://img.youtube.com/vi/${previewId}/hqdefault.jpg`}
                  alt="thumbnail"
                  className="w-32 aspect-video object-cover rounded-xl border border-white/10"
                />
                <p className="text-xs text-gray-500 font-mono mt-1">ID: <span className="text-violet-400">{previewId}</span></p>
              </div>
            )}
          </div>

          {/* ── Autoplay toggle ── */}
          <div
            className="flex items-center justify-between p-4 rounded-xl border border-white/8 cursor-pointer select-none"
            style={{ background: 'rgba(255,255,255,0.03)' }}
            onClick={() => setAutoplay((v) => !v)}
          >
            <div>
              <p className="text-sm font-semibold text-white">Autoplay video</p>
              <p className="text-xs text-gray-500 mt-0.5">
                {reelUrl ? 'Reel autoplays silently on page open' : 'YouTube player starts muted on page open'}
              </p>
            </div>
            {autoplay
              ? <ToggleRight className="w-8 h-8 text-violet-400 flex-shrink-0" />
              : <ToggleLeft className="w-8 h-8 text-gray-600 flex-shrink-0" />}
          </div>

          {error && (
            <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-3 py-2">{error}</p>
          )}

          {/* Save button */}
          <button
            onClick={save}
            disabled={saving || uploading}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all"
            style={{
              background: saved
                ? 'linear-gradient(135deg,#22c55e,#16a34a)'
                : 'linear-gradient(135deg,#7c3aed,#f97316)',
              opacity: (saving || uploading) ? 0.6 : 1,
            }}
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {saved ? 'Saved!' : saving ? 'Saving…' : 'Save Settings'}
          </button>
        </div>
      )}
    </div>
  );
};

// ── Main AdminVideos ───────────────────────────────────────────────────────
const AdminVideos = () => {
  const [videos, setVideos]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving]   = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm]       = useState(EMPTY);
  const [error, setError]     = useState(null);
  const [columns, setColumns] = useState(null);

  const fetchVideos = async () => {
    setLoading(true); setError(null);
    const { data, error: err } = await supabase.from('videos').select('*').order('created_at', { ascending: false });
    if (err) setError(err.message);
    setVideos(data || []);
    if (data?.length > 0) setColumns(Object.keys(data[0]));
    setLoading(false);
  };

  useEffect(() => { fetchVideos(); }, []);

  const startEdit = (v) => {
    setEditing(v.id);
    setForm({ title: v.title || '', url: v.url || v.video_url || '', thumbnail: v.thumbnail || v.thumbnail_url || '', description: v.description || '', is_published: v.is_published ?? true });
  };
  const startNew = () => { setEditing('new'); setForm(EMPTY); };
  const cancel   = () => { setEditing(null); setForm(EMPTY); setError(null); };

  const save = async () => {
    setSaving(true); setError(null);
    try {
      const payload = {};
      const cols = columns ?? Object.keys(form);
      const fieldMap = { title: form.title, url: form.url, video_url: form.url, thumbnail: form.thumbnail, thumbnail_url: form.thumbnail, description: form.description, is_published: form.is_published };
      for (const c of cols) { if (c in fieldMap) payload[c] = fieldMap[c]; }
      if (!Object.keys(payload).length) Object.assign(payload, form);
      if (editing === 'new') {
        const { error: err } = await supabase.from('videos').insert(payload);
        if (err) throw err;
      } else {
        const { error: err } = await supabase.from('videos').update(payload).eq('id', editing);
        if (err) throw err;
      }
      await fetchVideos(); cancel();
    } catch (e) { setError(e.message); }
    setSaving(false);
  };

  const remove = async (id) => {
    if (!window.confirm('Delete this video?')) return;
    const { error: err } = await supabase.from('videos').delete().eq('id', id);
    if (err) { setError(err.message); return; }
    fetchVideos();
  };

  return (
    <AdminShell title="Videos">
      <NewBatchVideoSettings />

      <div className="flex items-center gap-2 mb-6">
        <button onClick={startNew} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold bg-gradient-to-r from-violet-600 to-orange-500 hover:opacity-90">
          <Plus className="w-4 h-4" /> New video
        </button>
        <button onClick={fetchVideos} className="p-2.5 rounded-xl border border-white/10 hover:bg-white/5 text-gray-400">
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {error && <div className="mb-4 p-3 rounded-xl text-red-300 text-sm border border-red-500/30 bg-red-500/10">{error}</div>}

      {editing && (
        <div className="rounded-2xl border border-white/[0.07] p-5 mb-6 space-y-3" style={{ background: 'rgba(255,255,255,0.03)' }}>
          {[['Video title', 'title', 'text'], ['YouTube/Vimeo URL', 'url', 'text'], ['Thumbnail URL (optional)', 'thumbnail', 'text']].map(([ph, key]) => (
            <input key={key} value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} placeholder={ph}
              className="w-full rounded-xl px-4 py-2.5 text-sm focus:outline-none"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#fff' }} />
          ))}
          <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} placeholder="Description (optional)"
            className="w-full rounded-xl px-4 py-2.5 text-sm focus:outline-none"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#fff' }} />
          <label className="flex items-center gap-2 text-sm text-gray-300">
            <input type="checkbox" checked={form.is_published} onChange={(e) => setForm({ ...form, is_published: e.target.checked })} /> Published
          </label>
          <div className="flex gap-2">
            <button onClick={save} disabled={saving} className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold bg-gradient-to-r from-violet-600 to-orange-500 disabled:opacity-50">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Save
            </button>
            <button onClick={cancel} className="px-4 py-2 rounded-xl text-sm border border-white/10 hover:bg-white/5">Cancel</button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-24"><Loader2 className="w-6 h-6 animate-spin text-violet-500" /></div>
      ) : videos.length === 0 ? (
        <div className="text-center py-24 rounded-2xl border border-white/[0.06]" style={{ background: 'rgba(255,255,255,0.02)' }}>
          <VideoIcon className="w-10 h-10 text-gray-700 mx-auto mb-3" />
          <p className="text-gray-500">No videos yet.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
          {videos.map((v) => (
            <div key={v.id} className="rounded-2xl border border-white/[0.06] overflow-hidden" style={{ background: 'rgba(255,255,255,0.03)' }}>
              {(v.thumbnail || v.thumbnail_url) && <img src={v.thumbnail || v.thumbnail_url} alt="" className="w-full aspect-video object-cover" />}
              <div className="p-4">
                <p className="text-sm font-bold truncate">{v.title || 'Untitled'}</p>
                <p className="text-xs text-gray-500 truncate font-mono mt-1">{v.url || v.video_url}</p>
                <div className="flex gap-2 mt-3">
                  <button onClick={() => startEdit(v)} className="text-xs px-3 py-1.5 rounded-lg border border-white/10 hover:bg-white/5">Edit</button>
                  <button onClick={() => remove(v.id)} className="text-xs px-3 py-1.5 rounded-lg text-red-400 hover:bg-red-500/10"><Trash2 className="w-3.5 h-3.5" /></button>
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
