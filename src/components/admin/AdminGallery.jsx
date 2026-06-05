import { useEffect, useState, useRef } from 'react';

const AdminGallery = () => {
  const [folders, setFolders] = useState([]);
  const [selectedFolderId, setSelectedFolderId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const scriptUrl = import.meta.env.VITE_GOOGLE_SCRIPT_URL || "https://script.google.com/macros/s/AKfycbyuX6fJn9h41iXZWxbaxzjBz0aGZ_7z9UmmKMnpvjQSXAReKC6U5CcZxutouazCr3iz/exec";
  const driveRootId = import.meta.env.VITE_DRIVE_FOLDER_ID || "1fcHs_FnyV-sMolypjj7wul7H8yRmahgs";

  useEffect(() => {
    if(scriptUrl && driveRootId) fetchGallery();
    else setLoading(false);
  }, [scriptUrl, driveRootId]);

  const scriptFetch = async (payload) => {
    payload.parentFolderId = driveRootId;
    const res = await fetch(scriptUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain' },
      body: JSON.stringify(payload)
    });
    return await res.json();
  };

  const fetchGallery = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${scriptUrl}?action=list&folderId=${driveRootId}`);
      const data = await res.json();
      if (data.success) {
        setFolders(data.folders);
        if (data.folders.length > 0 && !selectedFolderId) {
          setSelectedFolderId(data.folders[0].id);
        }
      }
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const toBase64 = (file) => new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
  });

  const handleUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length || !selectedFolderId) return;
    setUploading(true);

    for (const file of files) {
      try {
        const base64 = await toBase64(file);
        await scriptFetch({
          action: 'upload',
          folderId: selectedFolderId,
          filename: file.name,
          mimeType: file.type,
          base64: base64
        });
      } catch (err) {
        console.error('Upload error', err);
      }
    }

    setUploading(false);
    fetchGallery();
  };

  const createFolder = async () => {
    const name = window.prompt("Enter new folder name:");
    if (name) {
      setLoading(true);
      await scriptFetch({ action: 'create_folder', folderName: name });
      fetchGallery();
    }
  };

  const renameFolder = async (id, currentName) => {
    const newName = window.prompt("Enter new folder name:", currentName);
    if (newName && newName !== currentName) {
      setLoading(true);
      await scriptFetch({ action: 'rename_folder', folderId: id, newName });
      fetchGallery();
    }
  };

  const deleteFolder = async (id) => {
    if(window.confirm('Are you sure you want to delete this folder and ALL its contents?')) {
      setLoading(true);
      await scriptFetch({ action: 'delete_folder', folderId: id });
      if (selectedFolderId === id) setSelectedFolderId(folders.find(f => f.id !== id)?.id || null);
      fetchGallery();
    }
  };

  const deletePhoto = async (fileId) => {
    if(window.confirm('Are you sure you want to delete this photo?')) {
      await scriptFetch({ action: 'delete', fileId });
      fetchGallery();
    }
  };

  const movePhoto = async (fileId, newFolderId) => {
    if(newFolderId && newFolderId !== selectedFolderId) {
       await scriptFetch({ action: 'move', fileId, sourceFolderId: selectedFolderId, targetFolderId: newFolderId });
       fetchGallery();
    }
  };

  if (!scriptUrl || !driveRootId) return <div className="text-red-400">Environment variables missing.</div>;
  if (loading && folders.length === 0) return <div className="text-champagne-gold">Loading gallery...</div>;

  const currentFolder = folders.find(f => f.id === selectedFolderId);

  return (
    <div className="flex flex-col md:flex-row gap-8 h-full">
      {/* Sidebar */}
      <div className="w-full md:w-64 flex flex-col space-y-4 shrink-0">
        <h2 className="text-xl font-serif text-champagne-gold uppercase tracking-widest border-b border-[#FFC300]/30 pb-2">Albums</h2>
        <button 
          onClick={createFolder}
          className="w-full py-2 bg-stationery-gradient border border-[#FFC300]/50 text-[#F8F4E8] uppercase tracking-wider text-xs hover:border-[#FFC300] transition-colors"
        >
          + Create Album
        </button>
        <div className="flex flex-col space-y-2 mt-4">
          {folders.map(f => (
            <div 
              key={f.id} 
              className={`flex justify-between items-center px-3 py-2 border cursor-pointer transition-colors ${selectedFolderId === f.id ? 'border-[#FFC300] bg-card-blue-dark text-[#FFC300]' : 'border-transparent text-[#F8F4E8]/70 hover:text-[#F8F4E8]'}`}
              onClick={() => setSelectedFolderId(f.id)}
            >
              <span className="truncate text-sm">{f.name}</span>
              {selectedFolderId === f.id && (
                <div className="flex space-x-2 text-xs">
                  <span onClick={(e) => { e.stopPropagation(); renameFolder(f.id, f.name); }} className="hover:text-white" title="Rename">✎</span>
                  <span onClick={(e) => { e.stopPropagation(); deleteFolder(f.id); }} className="text-red-400 hover:text-red-300" title="Delete">✕</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Main Area */}
      <div className="flex-1 flex flex-col space-y-6">
        <div className="flex justify-between items-end">
          <h1 className="text-2xl font-serif text-champagne-gold uppercase tracking-widest">{currentFolder ? currentFolder.name : 'Select Album'}</h1>
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
              disabled={uploading || !selectedFolderId}
              className="px-4 py-2 bg-champagne-gold text-[#F8F4E8] uppercase tracking-wider text-xs font-semibold rounded hover:bg-royal-blue/20 transition-colors disabled:opacity-50"
            >
              {uploading ? 'Uploading...' : 'Upload Photos'}
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {currentFolder?.images?.map((p) => (
            <div key={p.id} className="relative group bg-card-blue-dark aspect-square rounded overflow-hidden border border-[#FFC300]">
              <img src={p.thumbnail} alt={p.name} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-card-blue-dark opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-2 space-y-2">
                <p className="text-xs text-[#F8F4E8] truncate">{p.name}</p>
                <select 
                  className="w-full bg-black/50 text-white text-xs border border-white/20 p-1 outline-none"
                  onChange={(e) => movePhoto(p.id, e.target.value)}
                  value=""
                >
                  <option value="" disabled>Move to...</option>
                  {folders.filter(f => f.id !== selectedFolderId).map(f => (
                    <option key={f.id} value={f.id}>{f.name}</option>
                  ))}
                </select>
                <button 
                  onClick={() => deletePhoto(p.id)}
                  className="w-full py-1 bg-red-500/80 text-white text-xs uppercase tracking-wider rounded hover:bg-red-500"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
          {(!currentFolder?.images || currentFolder.images.length === 0) && (
            <div className="col-span-full py-12 text-center text-[#F8F4E8]/50">
              No photos in this album.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminGallery;
