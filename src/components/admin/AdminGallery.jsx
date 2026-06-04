import { useEffect, useState, useRef } from 'react';
import { supabase } from '../../lib/supabase';

const AdminGallery = () => {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchGallery();
  }, []);

  const fetchGallery = async () => {
    const { data, error } = await supabase
      .from('gallery')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (!error && data) {
      setPhotos(data);
    }
    setLoading(false);
  };

  const handleUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    setUploading(true);

    for (const file of files) {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('gallery-images')
        .upload(filePath, file);

      if (uploadError) {
        console.error('Upload error', uploadError);
        continue;
      }

      await supabase.from('gallery').insert([
        { storage_path: filePath, category: 'Uncategorized', sort_order: 0 }
      ]);
    }

    setUploading(false);
    fetchGallery();
  };

  const deletePhoto = async (id, path) => {
    if(window.confirm('Are you sure you want to delete this photo?')) {
      await supabase.storage.from('gallery-images').remove([path]);
      await supabase.from('gallery').delete().eq('id', id);
      fetchGallery();
    }
  };

  if (loading) return <div className="text-champagne-gold">Loading gallery...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <h1 className="text-2xl font-serif text-champagne-gold uppercase tracking-widest">Manage Gallery</h1>
        <div>
          <input 
            type="file" 
            multiple 
            accept="image/*" 
            className="hidden" 
            ref={fileInputRef} 
            onChange={handleUpload} 
          />
          <button 
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="px-4 py-2 bg-champagne-gold text-royal-blue uppercase tracking-wider text-xs font-semibold rounded hover:bg-ivory transition-colors disabled:opacity-50"
          >
            {uploading ? 'Uploading...' : 'Upload Photos'}
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {photos.map((p) => {
          const { data } = supabase.storage.from('gallery-images').getPublicUrl(p.storage_path);
          return (
            <div key={p.id} className="relative group bg-black/20 aspect-square rounded overflow-hidden border border-champagne-gold/20">
              <img src={data.publicUrl} alt="" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-2">
                <p className="text-xs text-ivory mb-2 truncate">{p.category}</p>
                <button 
                  onClick={() => deletePhoto(p.id, p.storage_path)}
                  className="w-full py-1 bg-red-500/80 text-white text-xs uppercase tracking-wider rounded hover:bg-red-500"
                >
                  Delete
                </button>
              </div>
            </div>
          );
        })}
        {photos.length === 0 && (
          <div className="col-span-full py-12 text-center text-ivory/50">
            No photos in gallery.
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminGallery;
