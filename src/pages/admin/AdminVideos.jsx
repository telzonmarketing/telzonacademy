import React, { useEffect, useRef, useState } from 'react';
import {
  Loader2, Plus, Trash2, Save, RefreshCw,
  Video as VideoIcon, Settings, ToggleLeft, ToggleRight,
  Upload, CheckCircle, Film, Eye, EyeOff,
} from 'lucide-react';
import { supabase } from '@/lib/customSupabaseClient';
import AdminShell from '@/components/admin/AdminShell';

const BUCKET = 'reel-videos';
const EMPTY  = { title: '', url: '', thumbnail: '', description: '', is_published: true };

function formatBytes(b) {
  return b < 1048576 ? `${(b / 1024).toFixed(1)} KB` : `${(b / 1048576).toFixed(1)} MB`;
}

// ── Toggle row ────────────────────────────────────────────────────────────
const Toggle = ({ label, sub, value, onChange }) => (
  <div
    onClick={() => onChange(!value)}
    className="flex items-center justify-between p-4 rounded-xl border border-white/8 cursor-pointer select-none transition-colors hover:bg-white/[0.03]"
    style={{ background: 'rgba(255,255,255,0.02)' }}
  >
    <div>
      <p className="text-sm font-semibold text-white">{label}</p>
      {sub && <p className="text-xs text-gray-500 mt-0.5">{sub}</p>}
    </div>
    {value
      ? <ToggleRight className="w-8 h-8 text-violet-400 flex-shrink-0" />
      : <ToggleLeft  className="w-8 h-8 text-gray-600 flex-shrink-0" />}
  </div>
);

// ── New Batch Page Video Settings ─────────────────────────────────────────
const NewBatchVideoSettings = () => {
  const [videoUrl,  setVideoUrl]  = useState('');
  const [videoPath, setVideoPath] = useState('');
  const [autoplay,  setAutoplay]  = useState(true);
  const [showVideo, setShowVideo] = useState(true);

  const [loading,      setLoading]      = useState(true);
  const [saving,       setSaving]       = useState(false);
  const [saved,        setSaved]        = useState(false);
  const [error,        setError]        = useState(null);
  const [uploading,    setUploading]    = useState(false);
  const [uploadPct,    setUploadPct]    = useState(0);
  const [uploadError,  setUploadError]  = useState(null);
  const [deleting,     setDeleting]     = useState(false);

  const fileRef = useRef(null);

  // ── Load ──
  useEffect(() => {
    supabase
      .from('seoSettings')
      .select('google_code, pixel_code, retargeting_code')
      .eq('page_key', 'new-batch-video')
      .maybeSingle()
      .then(({ data }) => {
        if (data) {
          setShowVideo(data.google_code !== 'false');           // google_code = show toggle
          setAutoplay(data.pixel_code !== 'false');             // pixel_code  = autoplay
          setVideoUrl(data.retargeting_code || '');             // retargeting = video URL
          if (data.retargeting_code) {
            const m = data.retargeting_code.match(/reel-videos\/(.+)$/);
            if (m) setVideoPath(m[1]);
          }
        }
        setLoading(false);
      });
  }, []);

  // ── Save toggles only ──
  const save = async () => {
    setSaving(true); setError(null); setSaved(false);
    const payload = {
      google_code:      showVideo ? 'true' : 'false',
      pixel_code:       autoplay  ? 'true' : 'false',
      retargeting_code: videoUrl,
    };
    const { data: ex } = await supabase.from('seoSettings').select('id').eq('page_key', 'new-batch-video').maybeSingle();
    const { error: err } = ex?.id
      ? await supabase.from('seoSettings').update(payload).eq('page_key', 'new-batch-video')
      : await supabase.from('seoSettings').insert({ ...payload, page_key: 'new-batch-video' });
    if (err) setError(err.message);
    else { setSaved(true); setTimeout(() => setSaved(false), 3000); }
    setSaving(false);
  };

  // ── Upload ──
  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadError(null);

    if (file.size > 100 * 1024 * 1024) {
      setUploadError(`File too large (${formatBytes(file.size)}). Max is 100 MB.`);
      return;
    }
    if (!file.type.startsWith('video/')) {
      setUploadError('Please select a video file (MP4, MOV, WebM).');
      return;
    }

    setUploading(true); setUploadPct(0);

    // Delete old file from storage
    if (videoPath) await supabase.storage.from(BUCKET).remove([videoPath]);

    const fileName = `reel-${Date.now()}-${file.name.replace(/\s+/g, '_')}`;
    const { data: { session } } = await supabase.auth.getSession();
    const token = session?.access_token;
    const uploadUrl = `https://lcnfnwivodzjjpykihfn.supabase.co/storage/v1/object/${BUCKET}/${fileName}`;

    try {
      await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', uploadUrl);
        xhr.setRequestHeader('Authorization', `Bearer ${token}`);
        xhr.setRequestHeader('x-upsert', 'true');
        xhr.setRequestHeader('Content-Type', file.type);        // ← raw binary, no FormData
        xhr.setRequestHeader('Cache-Control', 'max-age=3600');
        xhr.upload.onprogress = (ev) => {
          if (ev.lengthComputable) setUploadPct(Math.round((ev.loaded / ev.total) * 100));
        };
        xhr.onload  = () => xhr.status < 300 ? resolve() : reject(new Error(xhr.responseText));
        xhr.onerror = () => reject(new Error('Network error during upload'));
        xhr.send(file);   // ← send file directly, not FormData
      });
    } catch (err) {
      setUploadError(err.message);
      setUploading(false);
      return;
    }

    const { data: { publicUrl } } = supabase.storage.from(BUCKET).getPublicUrl(fileName);

    // Persist URL immediately
    const payload = {
      google_code:      showVideo ? 'true' : 'false',
      pixel_code:       autoplay  ? 'true' : 'false',
      retargeting_code: publicUrl,
    };
    const { data: ex } = await supabase.from('seoSettings').select('id').eq('page_key', 'new-batch-video').maybeSingle();
    if (ex?.id) await supabase.from('seoSettings').update(payload).eq('page_key', 'new-batch-video');
    else        await supabase.from('seoSettings').insert({ ...payload, page_key: 'new-batch-video' });

    setVideoUrl(publicUrl);
    setVideoPath(fileName);
    setUploading(false); setUploadPct(0);
    if (fileRef.current) fileRef.current.value = '';
  };

  // ── Delete ──
  const deleteVideo = async () => {
    if (!window.confirm('Delete this video? The page will show nothing until you upload a new one.')) return;
    setDeleting(true);
    if (videoPath) await supabase.storage.from(BUCKET).remove([videoPath]);
    await supabase.from('seoSettings').update({ retargeting_code: '' }).eq('page_key', 'new-batch-video');
    setVideoUrl(''); setVideoPath('');
    setDeleting(false);
  };

  return (
    <div className="rounded-2xl border border-violet-500/20 mb-8 overflow-hidden" style={{ background: 'rgba(139,92,246,0.04)' }}>

      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-4 border-b border-white/[0.06]">
        <Film className="w-5 h-5 text-violet-400" />
        <div>
          <p className="text-sm font-bold text-white">New Batch Page — Video Settings</p>
          <p className="text-xs text-gray-500">
            Upload your video · toggle autoplay &amp; visibility · changes go live instantly
          </p>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-10">
          <Loader2 className="w-5 h-5 animate-spin text-violet-500" />
        </div>
      ) : (
        <div className="p-5 space-y-5">

          {/* ── Video upload / preview ── */}
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3">
              Video file · MP4 / MOV / WebM · max 100 MB
            </p>

            {videoUrl && !uploading ? (
              /* Preview */
              <div className="flex items-start gap-4">
                <div
                  className="relative rounded-xl overflow-hidden border border-white/10 bg-black flex-shrink-0"
                  style={{ width: 110, aspectRatio: '9/16' }}
                >
                  <video
                    src={videoUrl}
                    className="w-full h-full object-cover"
                    muted playsInline
                    onMouseOver={(e) => e.target.play()}
                    onMouseOut={(e) => { e.target.pause(); e.target.currentTime = 0; }}
                  />
                </div>
                <div className="flex-1 min-w-0 pt-1">
                  <div className="flex items-center gap-1.5 mb-1">
                    <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                    <p className="text-sm text-green-300 font-semibold">Video uploaded</p>
                  </div>
                  <p className="text-xs text-gray-600 font-mono break-all mb-4">
                    {videoUrl.split('/').pop()}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <label htmlFor="reel-upload"
                      className="cursor-pointer flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border border-white/10 hover:bg-white/5 text-gray-300">
                      <Upload className="w-3.5 h-3.5" /> Replace video
                    </label>
                    <button onClick={deleteVideo} disabled={deleting}
                      className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg text-red-400 hover:bg-red-500/10 border border-red-500/20">
                      {deleting
                        ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        : <Trash2 className="w-3.5 h-3.5" />}
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ) : uploading ? (
              /* Progress */
              <div className="p-5 rounded-xl border border-white/10" style={{ background: 'rgba(255,255,255,0.03)' }}>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-white font-semibold">Uploading…</p>
                  <p className="text-sm text-violet-400 font-black">{uploadPct}%</p>
                </div>
                <div className="w-full bg-white/10 rounded-full h-2.5">
                  <div className="h-2.5 rounded-full bg-gradient-to-r from-violet-500 to-orange-500 transition-all duration-200"
                    style={{ width: `${uploadPct}%` }} />
                </div>
                <p className="text-xs text-gray-600 mt-2">Do not close this tab while uploading</p>
              </div>
            ) : (
              /* Drop zone */
              <label htmlFor="reel-upload"
                className="flex flex-col items-center justify-center gap-3 p-10 rounded-xl border-2 border-dashed border-white/10 hover:border-violet-500/40 cursor-pointer transition-colors"
                style={{ background: 'rgba(255,255,255,0.02)' }}
              >
                <div className="w-14 h-14 rounded-full bg-violet-500/10 flex items-center justify-center">
                  <Upload className="w-6 h-6 text-violet-400" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-semibold text-white">Click to upload your video</p>
                  <p className="text-xs text-gray-500 mt-1">Vertical 9:16 reel format recommended · Max 100 MB</p>
                </div>
              </label>
            )}

            <input ref={fileRef} id="reel-upload" type="file"
              accept="video/mp4,video/quicktime,video/webm,video/mpeg,video/x-m4v"
              className="hidden" onChange={handleFile} />

            {uploadError && (
              <p className="mt-2 text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-3 py-2">
                {uploadError}
              </p>
            )}
          </div>

          {/* ── Toggles ── */}
          <div className="space-y-3">
            <Toggle
              label="Show video on page"
              sub={showVideo ? 'Video section is visible on /new-batch' : 'Video section is hidden — page shows only the form'}
              value={showVideo}
              onChange={setShowVideo}
            />
            <Toggle
              label="Autoplay on page open"
              sub="Video starts automatically (muted) when visitor opens the page"
              value={autoplay}
              onChange={setAutoplay}
            />
          </div>

          {error && (
            <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-3 py-2">{error}</p>
          )}

          {/* Save */}
          <button onClick={save} disabled={saving || uploading}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all disabled:opacity-50"
            style={{ background: saved ? 'linear-gradient(135deg,#22c55e,#16a34a)' : 'linear-gradient(135deg,#7c3aed,#f97316)' }}
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
  const [videos,  setVideos]  = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving,  setSaving]  = useState(false);
  const [editing, setEditing] = useState(null);
  const [form,    setForm]    = useState(EMPTY);
  const [error,   setError]   = useState(null);
  const [columns, setColumns] = useState(null);

  const fetchVideos = async () => {
    setLoading(true); setError(null);
    const { data, error: err } = await supabase.from('videos').select('*').order('created_at', { ascending: false });
    if (err) setError(err.message);
    setVideos(data || []);
    if (data?.length) setColumns(Object.keys(data[0]));
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
      const map  = { title: form.title, url: form.url, video_url: form.url, thumbnail: form.thumbnail, thumbnail_url: form.thumbnail, description: form.description, is_published: form.is_published };
      for (const c of cols) { if (c in map) payload[c] = map[c]; }
      if (!Object.keys(payload).length) Object.assign(payload, form);
      const { error: err } = editing === 'new'
        ? await supabase.from('videos').insert(payload)
        : await supabase.from('videos').update(payload).eq('id', editing);
      if (err) throw err;
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
        <button onClick={startNew}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold bg-gradient-to-r from-violet-600 to-orange-500 hover:opacity-90">
          <Plus className="w-4 h-4" /> New video
        </button>
        <button onClick={fetchVideos}
          className="p-2.5 rounded-xl border border-white/10 hover:bg-white/5 text-gray-400">
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {error && <div className="mb-4 p-3 rounded-xl text-red-300 text-sm border border-red-500/30 bg-red-500/10">{error}</div>}

      {editing && (
        <div className="rounded-2xl border border-white/[0.07] p-5 mb-6 space-y-3" style={{ background: 'rgba(255,255,255,0.03)' }}>
          {[['Video title', 'title'], ['Video URL', 'url'], ['Thumbnail URL (optional)', 'thumbnail']].map(([ph, key]) => (
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
            <button onClick={save} disabled={saving}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold bg-gradient-to-r from-violet-600 to-orange-500 disabled:opacity-50">
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
