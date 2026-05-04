import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Save, Loader2, Search, Share2, Lock, Code2 } from 'lucide-react';
import { Helmet } from 'react-helmet';

const SeoSettingsDashboard = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    meta_title: '',
    meta_description: '',
    meta_keywords: '',
    og_title: '',
    og_description: '',
    google_code: '',
    pixel_code: '',
    retargeting_code: ''
  });
  
  const PAGE_KEY = 'home';

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('seoSettings')
        .select('*')
        .eq('page_key', PAGE_KEY)
        .maybeSingle();

      if (error) {
        console.error('Error fetching SEO settings:', error);
        toast({
          title: "Error fetching settings",
          description: error.message,
          variant: "destructive"
        });
      } else if (data) {
        setFormData({
          meta_title: data.meta_title || '',
          meta_description: data.meta_description || '',
          meta_keywords: data.meta_keywords || '',
          og_title: data.og_title || '',
          og_description: data.og_description || '',
          google_code: data.google_code || '',
          pixel_code: data.pixel_code || '',
          retargeting_code: data.retargeting_code || ''
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const payload = {
        page_key: PAGE_KEY, 
        ...formData,
        updated_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('seoSettings')
        .upsert(payload, { onConflict: 'page_key' });

      if (error) throw error;

      toast({
        title: "SEO Settings Updated",
        description: `Settings for "${PAGE_KEY}" page have been saved successfully.`,
        variant: "default",
        className: "bg-green-600 text-white border-none"
      });

    } catch (error) {
      console.error('Error saving settings:', error);
      toast({
        title: "Save Failed",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6 md:p-12 font-sans">
      <Helmet>
        <title>SEO Dashboard | Telzon Academy Admin</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <div className="p-3 bg-red-600/20 rounded-xl border border-red-500/30">
            <Lock className="w-8 h-8 text-red-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-400 to-orange-400">
              SEO Settings Dashboard (Private)
            </h1>
            <p className="text-gray-400 mt-1">
              Use this page to manually control homepage SEO, Google tags, Meta Pixel, and retargeting code.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <Tabs defaultValue="meta" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-gray-900">
              <TabsTrigger value="meta">Meta Tags</TabsTrigger>
              <TabsTrigger value="social">Social Media</TabsTrigger>
              <TabsTrigger value="tracking">Tracking</TabsTrigger>
            </TabsList>
            
            <TabsContent value="meta" className="mt-6">
              <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 shadow-xl backdrop-blur-sm">
                <div className="flex items-center gap-2 mb-6 pb-4 border-b border-gray-800">
                  <Search className="w-5 h-5 text-blue-400" />
                  <h2 className="text-xl font-semibold text-white">Homepage Meta Tags</h2>
                </div>
                
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">Meta Title (Browser Tab)</label>
                    <Input
                      name="meta_title"
                      value={formData.meta_title}
                      onChange={handleChange}
                      placeholder="e.g. Best Digital Marketing Course in Nagpur | Telzon Academy"
                      className="bg-gray-950 border-gray-800 focus:border-blue-500 text-white h-12"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">Meta Description</label>
                    <Textarea
                      name="meta_description"
                      value={formData.meta_description}
                      onChange={handleChange}
                      placeholder="Brief summary of the page content..."
                      className="bg-gray-950 border-gray-800 focus:border-blue-500 text-white min-h-[100px]"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">Meta Keywords</label>
                    <Input
                      name="meta_keywords"
                      value={formData.meta_keywords}
                      onChange={handleChange}
                      placeholder="e.g. digital marketing, seo, nagpur course"
                      className="bg-gray-950 border-gray-800 focus:border-blue-500 text-white h-12"
                    />
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="social" className="mt-6">
              <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 shadow-xl backdrop-blur-sm">
                 <div className="flex items-center gap-2 mb-6 pb-4 border-b border-gray-800">
                  <Share2 className="w-5 h-5 text-purple-400" />
                  <h2 className="text-xl font-semibold text-white">Social Media (Open Graph)</h2>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">OG Title</label>
                    <Input
                      name="og_title"
                      value={formData.og_title}
                      onChange={handleChange}
                      placeholder="Title shown when sharing on social media"
                      className="bg-gray-950 border-gray-800 focus:border-purple-500 text-white h-12"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">OG Description</label>
                    <Textarea
                      name="og_description"
                      value={formData.og_description}
                      onChange={handleChange}
                      placeholder="Description shown on social media cards..."
                      className="bg-gray-950 border-gray-800 focus:border-purple-500 text-white min-h-[80px]"
                    />
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="tracking" className="mt-6">
              <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 shadow-xl backdrop-blur-sm">
                <div className="flex items-center gap-2 mb-6 pb-4 border-b border-gray-800">
                  <Code2 className="w-5 h-5 text-orange-400" />
                  <h2 className="text-xl font-semibold text-white">Pixels & Retargeting</h2>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">Google Tag / Analytics Code</label>
                    <Textarea
                      name="google_code"
                      value={formData.google_code}
                      onChange={handleChange}
                      placeholder="Paste your Google tag, GA4, Google Ads, or GTM snippet here..."
                      className="bg-gray-950 border-gray-800 focus:border-orange-500 text-white min-h-[150px] font-mono text-xs"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">Meta / Facebook Pixel Code</label>
                    <Textarea
                      name="pixel_code"
                      value={formData.pixel_code}
                      onChange={handleChange}
                      placeholder="Paste your full Meta Pixel snippet here..."
                      className="bg-gray-950 border-gray-800 focus:border-orange-500 text-white min-h-[150px] font-mono text-xs"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">Retargeting / Conversion Code</label>
                    <Textarea
                      name="retargeting_code"
                      value={formData.retargeting_code}
                      onChange={handleChange}
                      placeholder="Paste any LinkedIn, Google Ads conversion, remarketing, or custom retargeting code here..."
                      className="bg-gray-950 border-gray-800 focus:border-orange-500 text-white min-h-[150px] font-mono text-xs"
                    />
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end pt-4">
            <Button
              type="submit"
              disabled={saving}
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold min-w-[200px]"
            >
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SeoSettingsDashboard;
