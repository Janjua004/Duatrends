import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Product } from '../../types';
import { Plus, Edit, Trash2, Search, X, Upload, Link, Check, Image as ImageIcon, Ruler, Download, FileJson, RefreshCw, Copy, CheckCircle2, Info } from 'lucide-react';
import rawScrapedProducts from '../../data/scraped_products.json';

const ALL_AVAILABLE_SIZES = [
  { id: 'UNSTITCHED', label: 'UNSTITCHED (3PC Fabric)' },
  { id: 'Small', label: 'Small (S)' },
  { id: 'Medium', label: 'Medium (M)' },
  { id: 'Large', label: 'Large (L)' },
  { id: 'XL', label: 'Extra Large (XL)' },
  { id: 'Custom Tailored', label: 'Custom Tailored' }
];

export const ProductManager: React.FC = () => {
  const { products, addProduct, updateProduct, deleteProduct, showToast, isCloudSynced, syncCloudNow } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSyncModalOpen, setIsSyncModalOpen] = useState(false);
  const [syncJsonText, setSyncJsonText] = useState('');
  const [copiedExport, setCopiedExport] = useState(false);
  const [isSyncingNow, setIsSyncingNow] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [sku, setSku] = useState('');
  const [price, setPrice] = useState(4500);
  const [compareAtPrice, setCompareAtPrice] = useState(5500);
  const [category, setCategory] = useState('Unstitched Wear');
  const [stock, setStock] = useState(25);
  const [description, setDescription] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [colorInput, setColorInput] = useState('');
  const [colors, setColors] = useState<string[]>(["Pastel Pink", "Emerald Green", "Royal Velvet"]);
  const [colorImageMap, setColorImageMap] = useState<Record<string, string>>({});
  const [sizes, setSizes] = useState<string[]>(["UNSTITCHED", "Small", "Medium", "Large"]);
  const [stitchingFee, setStitchingFee] = useState<number>(1500);
  const [isFeatured, setIsFeatured] = useState(false);
  const [isTrending, setIsTrending] = useState(false);
  const [isOffer, setIsOffer] = useState(false);

  const filteredProducts = products.filter(p => 
    p.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Export JSON file download
  const handleExportJSON = () => {
    const jsonStr = JSON.stringify(products, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'scraped_products.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('Downloaded scraped_products.json! Replace src/data/scraped_products.json to publish globally.');
  };

  // Copy JSON string to clipboard
  const handleCopyJSON = () => {
    const jsonStr = JSON.stringify(products, null, 2);
    navigator.clipboard.writeText(jsonStr);
    setCopiedExport(true);
    setTimeout(() => setCopiedExport(false), 3000);
    showToast('Copied products JSON to clipboard!');
  };

  // Import JSON file or text
  const handleImportJSON = () => {
    if (!syncJsonText.trim()) {
      showToast('Please paste JSON code or select a JSON file.');
      return;
    }

    try {
      const parsed = JSON.parse(syncJsonText.trim());
      if (!Array.isArray(parsed)) {
        showToast('Invalid format: JSON must be an array of products.');
        return;
      }
      localStorage.setItem('stylewing_products', JSON.stringify(parsed));
      showToast(`Successfully imported ${parsed.length} products! Reloading to apply...`);
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (err) {
      showToast('Error parsing JSON: Please check the syntax.');
    }
  };

  // Handle uploaded JSON file into text area
  const handleFileUploadJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        setSyncJsonText(content);
        showToast(`Loaded ${file.name}`);
      }
    };
    reader.readAsText(file);
  };

  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setTitle('');
    setSku(`SW-PROD-${Math.floor(1000 + Math.random() * 9000)}`);
    setPrice(4500);
    setCompareAtPrice(5500);
    setCategory('Unstitched Wear');
    setStock(30);
    setDescription('High grade luxury ladies apparel crafted for StyleWing collection.');
    setImages([
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=800&q=80'
    ]);
    setNewImageUrl('');
    setColors(["Pastel Pink", "Emerald Green", "Royal Velvet"]);
    setColorImageMap({
      "Pastel Pink": "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80",
      "Emerald Green": "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=800&q=80"
    });
    setSizes(["UNSTITCHED", "Small", "Medium", "Large"]);
    setStitchingFee(1500);
    setIsFeatured(false);
    setIsTrending(false);
    setIsOffer(false);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (p: Product) => {
    setEditingProduct(p);
    setTitle(p.title);
    setSku(p.sku);
    setPrice(p.price);
    setCompareAtPrice(p.compareAtPrice || p.price * 1.2);
    setCategory(p.category);
    setStock(p.stock);
    setDescription(p.description);
    setImages(p.images.length > 0 ? p.images : ['https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80']);
    setNewImageUrl('');
    setColors(p.colors && p.colors.length > 0 ? p.colors : ["Pastel Pink", "Emerald Green", "Royal Velvet"]);
    setColorImageMap(p.colorImageMap || {});
    setSizes(p.sizes && p.sizes.length > 0 ? p.sizes : ["UNSTITCHED"]);
    setStitchingFee(p.stitchingFee || 1500);
    setIsFeatured(!!p.isFeatured);
    setIsTrending(!!p.isTrending);
    setIsOffer(!!p.isOffer);
    setIsModalOpen(true);
  };

  // Convert uploaded image files to Base64
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        const base64Str = uploadEvent.target?.result as string;
        if (base64Str) {
          setImages(prev => [...prev, base64Str]);
          showToast(`Uploaded ${file.name} successfully!`);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleAddImageUrl = () => {
    if (newImageUrl.trim()) {
      setImages(prev => [...prev, newImageUrl.trim()]);
      setNewImageUrl('');
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleAddColor = () => {
    if (colorInput.trim() && !colors.includes(colorInput.trim())) {
      setColors(prev => [...prev, colorInput.trim()]);
      setColorInput('');
    }
  };

  const handleRemoveColor = (colorName: string) => {
    setColors(prev => prev.filter(c => c !== colorName));
    setColorImageMap(prev => {
      const updated = { ...prev };
      delete updated[colorName];
      return updated;
    });
  };

  const handleLinkColorImage = (colorName: string, imageUrl: string) => {
    setColorImageMap(prev => ({
      ...prev,
      [colorName]: imageUrl
    }));
  };

  const handleToggleSize = (sizeId: string) => {
    setSizes(prev => 
      prev.includes(sizeId) ? prev.filter(s => s !== sizeId) : [...prev, sizeId]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !price || images.length === 0) {
      showToast('Please provide a title, price, and at least 1 image.');
      return;
    }

    if (editingProduct) {
      updateProduct({
        ...editingProduct,
        title,
        sku,
        price: Number(price),
        compareAtPrice: Number(compareAtPrice),
        category,
        stock: Number(stock),
        description,
        images,
        colors,
        sizes: sizes.length > 0 ? sizes : ["UNSTITCHED"],
        colorImageMap,
        stitchingFee: Number(stitchingFee),
        isFeatured,
        isTrending,
        isOffer
      });
      showToast(`Updated product: ${title}`);
    } else {
      addProduct({
        title,
        slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        sku,
        price: Number(price),
        compareAtPrice: Number(compareAtPrice),
        category,
        stock: Number(stock),
        description,
        images,
        colors,
        sizes: sizes.length > 0 ? sizes : ["UNSTITCHED"],
        colorImageMap,
        stitchingFee: Number(stitchingFee),
        isFeatured,
        isTrending,
        isOffer
      });
      showToast(`Added new product: ${title}`);
    }

    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Header controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl font-bold text-white">Product Inventory Management</h2>
          <p className="text-xs text-gray-400">Total {products.length} products active in store database</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleExportJSON}
            className="px-3.5 py-2.5 rounded-xl font-semibold text-xs bg-gray-800 hover:bg-gray-700 text-white flex items-center gap-2 border border-gray-700 shadow transition-colors"
            title="Download scraped_products.json to publish changes globally for all visitors"
          >
            <Download className="w-4 h-4 text-brand-pink" />
            <span>Export Products JSON</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setSyncJsonText(JSON.stringify(products, null, 2));
              setIsSyncModalOpen(true);
            }}
            className="px-3.5 py-2.5 rounded-xl font-semibold text-xs bg-gray-800 hover:bg-gray-700 text-white flex items-center gap-2 border border-gray-700 shadow transition-colors"
            title="Import or sync products JSON on any device"
          >
            <FileJson className="w-4 h-4 text-emerald-400" />
            <span>Import / Sync JSON</span>
          </button>

          <button
            onClick={handleOpenAddModal}
            className="btn-pink-gradient px-4 py-2.5 rounded-xl font-semibold text-xs flex items-center gap-2 shadow-lg"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Product</span>
          </button>
        </div>
      </div>

      {/* Automatic Multi-Device Live Cloud Database Sync Banner */}
      <div className="bg-gradient-to-r from-emerald-950/40 via-gray-900 to-blue-950/40 border border-emerald-800/40 rounded-2xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-lg text-xs">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-emerald-900/40 text-emerald-400 rounded-xl mt-0.5 relative">
            <RefreshCw className={`w-5 h-5 flex-shrink-0 ${isSyncingNow ? 'animate-spin' : ''}`} />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
          </div>
          <div className="space-y-1">
            <h4 className="font-bold text-white text-xs flex items-center gap-2">
              <span className="text-emerald-400 font-mono">● LIVE CLOUD DATABASE ACTIVE</span>
              <span className="bg-emerald-950 text-emerald-300 border border-emerald-800 px-2 py-0.5 rounded-full text-[10px]">
                Automatic Sync Enabled
              </span>
            </h4>
            <p className="text-gray-300 leading-relaxed text-[11px]">
              Every product you add, edit, or delete automatically updates on our live cloud server database in real-time. When visitors open the store on any phone, laptop, or browser, all product changes appear everywhere automatically without manual steps!
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={async () => {
            setIsSyncingNow(true);
            const ok = await syncCloudNow();
            setIsSyncingNow(false);
            showToast(ok ? 'All product changes pushed to live server database!' : 'Synced to local device storage');
          }}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-xs shadow-lg whitespace-nowrap flex items-center gap-2 transition-all flex-shrink-0"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isSyncingNow ? 'animate-spin' : ''}`} />
          <span>{isSyncingNow ? 'Syncing...' : 'Sync Cloud DB Now'}</span>
        </button>
      </div>

      {/* Search Filter */}
      <div className="relative max-w-md">
        <input 
          type="text" 
          placeholder="Search by title or SKU..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-9 pr-4 py-2 text-xs bg-gray-950 border border-gray-800 rounded-xl focus:outline-none focus:border-brand-pink text-white"
        />
        <Search className="w-4 h-4 text-gray-500 absolute left-3 top-2.5" />
      </div>

      {/* Products Table */}
      <div className="bg-gray-950 rounded-3xl border border-gray-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-300">
            <thead className="bg-gray-900 text-gray-400 uppercase tracking-wider font-semibold border-b border-gray-800">
              <tr>
                <th className="px-6 py-4">Product</th>
                <th className="px-4 py-4">SKU</th>
                <th className="px-4 py-4">Category</th>
                <th className="px-4 py-4">Price</th>
                <th className="px-4 py-4">Available Sizes</th>
                <th className="px-4 py-4">Stock</th>
                <th className="px-4 py-4">Clicks</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-800">
              {filteredProducts.slice(0, 20).map(product => (
                <tr key={product.id} className="hover:bg-gray-900/50 transition-colors">
                  <td className="px-6 py-3 flex items-center gap-3">
                    <img src={product.images[0]} alt="" className="w-10 h-12 object-cover rounded-lg bg-gray-800" />
                    <div>
                      <span className="font-semibold text-white block line-clamp-1">{product.title}</span>
                      <div className="flex gap-1 mt-0.5">
                        {product.isFeatured && <span className="text-[9px] bg-rose-950 text-rose-300 px-1.5 py-0.2 rounded">Featured</span>}
                        {product.isTrending && <span className="text-[9px] bg-amber-950 text-amber-300 px-1.5 py-0.2 rounded">Trending</span>}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 font-mono text-gray-400">{product.sku}</td>
                  <td className="px-4 py-3">{product.category}</td>
                  <td className="px-4 py-3 font-bold text-emerald-400">Rs {product.price.toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <span className="text-gray-300 text-[11px]">
                      {product.sizes ? product.sizes.join(', ') : 'UNSTITCHED'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button 
                      onClick={() => {
                        const newStock = product.stock > 0 ? 0 : 25;
                        updateProduct({ ...product, stock: newStock });
                        showToast(`Updated ${product.title} stock to ${newStock > 0 ? 'In Stock (25)' : 'Out of Stock (0)'}`);
                      }}
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold transition-transform hover:scale-105 ${
                        product.stock > 0 ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-rose-950 text-rose-300 border border-rose-800'
                      }`}
                      title="Click to toggle Stock Status"
                    >
                      {product.stock > 0 ? `${product.stock} in stock` : 'Out of Stock (0)'}
                    </button>
                  </td>
                  <td className="px-4 py-3 font-mono text-amber-400">{product.clicks || 0}</td>
                  <td className="px-6 py-3 text-right space-x-2">
                    <button onClick={() => handleOpenEditModal(product)} className="p-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-blue-400" title="Edit Product">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button onClick={() => deleteProduct(product.id)} className="p-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-rose-400" title="Delete Product">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Enhanced Product Modal with Multi-Images, Sizes & Color Mapping */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-gray-900 border border-gray-800 rounded-3xl max-w-3xl w-full p-6 space-y-5 max-h-[92vh] overflow-y-auto">
            
            <div className="flex items-center justify-between border-b border-gray-800 pb-3">
              <div className="flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-brand-pink" />
                <h3 className="font-serif font-bold text-lg text-white">
                  {editingProduct ? 'Edit Product, Sizes & Color Image Variants' : 'Add New Product with Sizes & Color Image Variants'}
                </h3>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5 text-xs">
              
              {/* Title & SKU */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-300 font-semibold mb-1">Product Title</label>
                  <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-3 py-2 bg-gray-950 border border-gray-800 rounded-xl text-white focus:border-brand-pink focus:outline-none" />
                </div>
                <div>
                  <label className="block text-gray-300 font-semibold mb-1">SKU Code</label>
                  <input type="text" required value={sku} onChange={(e) => setSku(e.target.value)} className="w-full px-3 py-2 bg-gray-950 border border-gray-800 rounded-xl text-white font-mono focus:border-brand-pink focus:outline-none" />
                </div>
              </div>

              {/* Price, Compare Price, Stock */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-gray-300 font-semibold mb-1">Price (Rs)</label>
                  <input type="number" required value={price} onChange={(e) => setPrice(Number(e.target.value))} className="w-full px-3 py-2 bg-gray-950 border border-gray-800 rounded-xl text-white focus:border-brand-pink focus:outline-none" />
                </div>
                <div>
                  <label className="block text-gray-300 font-semibold mb-1">Compare Price (Rs)</label>
                  <input type="number" value={compareAtPrice} onChange={(e) => setCompareAtPrice(Number(e.target.value))} className="w-full px-3 py-2 bg-gray-950 border border-gray-800 rounded-xl text-white focus:border-brand-pink focus:outline-none" />
                </div>
                <div>
                  <label className="block text-gray-300 font-semibold mb-1">Stock Quantity</label>
                  <input type="number" required value={stock} onChange={(e) => setStock(Number(e.target.value))} className="w-full px-3 py-2 bg-gray-950 border border-gray-800 rounded-xl text-white focus:border-brand-pink focus:outline-none" />
                </div>
              </div>

              {/* Category */}
              <div>
                <label className="block text-gray-300 font-semibold mb-1">Category</label>
                <input type="text" required value={category} onChange={(e) => setCategory(e.target.value)} className="w-full px-3 py-2 bg-gray-950 border border-gray-800 rounded-xl text-white focus:border-brand-pink focus:outline-none" />
              </div>

              {/* Size Options & Stitching Fee Manager */}
              <div className="space-y-3 bg-gray-950 p-4 rounded-2xl border border-gray-800">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Ruler className="w-4 h-4 text-brand-pink" />
                    <label className="block text-white font-bold uppercase tracking-wider text-xs">
                      Size Options & Stitched Variant Manager
                    </label>
                  </div>
                  <span className="text-[10px] text-gray-400">Check size options available for this suit</span>
                </div>

                {/* Size Checkboxes */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-1">
                  {ALL_AVAILABLE_SIZES.map(s => (
                    <label 
                      key={s.id}
                      className={`flex items-center gap-2 p-2.5 rounded-xl border cursor-pointer transition-colors ${
                        sizes.includes(s.id) 
                          ? 'bg-rose-950/40 border-brand-pink text-white font-bold' 
                          : 'bg-gray-900 border-gray-800 text-gray-400 hover:border-gray-700'
                      }`}
                    >
                      <input 
                        type="checkbox" 
                        checked={sizes.includes(s.id)}
                        onChange={() => handleToggleSize(s.id)}
                        className="accent-brand-pink"
                      />
                      <span>{s.label}</span>
                    </label>
                  ))}
                </div>

                {/* Stitching Extra Fee Input */}
                <div className="pt-2 flex items-center gap-3">
                  <label className="text-gray-300 font-semibold">Stitching Extra Fee for Stitched Suits (Rs):</label>
                  <input 
                    type="number" 
                    value={stitchingFee} 
                    onChange={(e) => setStitchingFee(Number(e.target.value))} 
                    className="w-32 px-3 py-1.5 bg-gray-900 border border-gray-800 rounded-xl text-white font-bold focus:outline-none focus:border-brand-pink"
                  />
                </div>
              </div>

              {/* Multiple Images Upload & Base64 Converter */}
              <div className="space-y-3 bg-gray-950 p-4 rounded-2xl border border-gray-800">
                <div className="flex items-center justify-between">
                  <label className="block text-white font-bold uppercase tracking-wider text-xs">
                    Product Images ({images.length} Added)
                  </label>
                  <span className="text-[10px] text-gray-400">Upload photos or paste URLs</span>
                </div>

                {/* Upload File / Add URL */}
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
                  <div className="sm:col-span-8 flex gap-2">
                    <input 
                      type="url" 
                      placeholder="Paste Image URL..." 
                      value={newImageUrl} 
                      onChange={(e) => setNewImageUrl(e.target.value)} 
                      className="w-full px-3 py-2 bg-gray-900 border border-gray-800 rounded-xl text-white focus:outline-none"
                    />
                    <button 
                      type="button" 
                      onClick={handleAddImageUrl}
                      className="px-3 py-2 bg-gray-800 hover:bg-gray-700 text-white font-bold rounded-xl flex items-center gap-1"
                    >
                      <Plus className="w-4 h-4" />
                      <span>URL</span>
                    </button>
                  </div>

                  <div className="sm:col-span-4 relative">
                    <label className="w-full h-full bg-brand-pink hover:bg-brand-pink-hover text-white font-bold px-3 py-2 rounded-xl cursor-pointer flex items-center justify-center gap-2 shadow">
                      <Upload className="w-4 h-4" />
                      <span>Upload Files</span>
                      <input 
                        type="file" 
                        accept="image/*" 
                        multiple 
                        onChange={handleFileUpload} 
                        className="hidden" 
                      />
                    </label>
                  </div>
                </div>

                {/* Added Images Thumbnail Grid */}
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-3 pt-2">
                  {images.map((img, idx) => (
                    <div key={idx} className="relative group aspect-[3/4] rounded-xl overflow-hidden bg-gray-900 border border-gray-800 shadow">
                      <img src={img} alt="" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(idx)}
                        className="absolute top-1 right-1 p-1 bg-red-600/90 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Remove Image"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Color Variants & Image Link Mapping */}
              <div className="space-y-3 bg-gray-950 p-4 rounded-2xl border border-gray-800">
                <label className="block text-white font-bold uppercase tracking-wider text-xs">
                  Color Variants & Image Link Mapping
                </label>

                {/* Add Color */}
                <div className="flex gap-2 max-w-sm">
                  <input 
                    type="text" 
                    placeholder="Enter Color (e.g. Jet Black, Ruby Red)..." 
                    value={colorInput} 
                    onChange={(e) => setColorInput(e.target.value)} 
                    className="w-full px-3 py-1.5 bg-gray-900 border border-gray-800 rounded-xl text-white focus:outline-none"
                  />
                  <button 
                    type="button" 
                    onClick={handleAddColor}
                    className="px-3 py-1.5 bg-brand-pink text-white font-bold rounded-xl"
                  >
                    Add Color
                  </button>
                </div>

                {/* Color Buttons & Linked Image Mapping Selector */}
                <div className="space-y-2 pt-2">
                  {colors.map(color => (
                    <div key={color} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-2.5 bg-gray-900 rounded-xl border border-gray-800">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-xs">{color}</span>
                        <button 
                          type="button" 
                          onClick={() => handleRemoveColor(color)}
                          className="text-gray-500 hover:text-red-400 text-xs"
                        >
                          (remove)
                        </button>
                      </div>

                      {/* Select Linked Image for this Color */}
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-gray-400">Link Image:</span>
                        <select
                          value={colorImageMap[color] || ''}
                          onChange={(e) => handleLinkColorImage(color, e.target.value)}
                          className="px-2 py-1 bg-gray-950 border border-gray-800 rounded-lg text-white text-xs focus:outline-none"
                        >
                          <option value="">Default (Image 1)</option>
                          {images.map((img, idx) => (
                            <option key={idx} value={img}>
                              Image #{idx + 1} ({img.startsWith('data:') ? 'Base64 Upload' : img.substring(0, 25) + '...'})
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-gray-300 font-semibold mb-1">Description</label>
                <textarea rows={3} value={description} onChange={(e) => setDescription(e.target.value)} className="w-full px-3 py-2 bg-gray-950 border border-gray-800 rounded-xl text-white focus:border-brand-pink focus:outline-none" />
              </div>

              {/* Badges */}
              <div className="flex gap-4 pt-2">
                <label className="flex items-center gap-2 text-gray-300 cursor-pointer">
                  <input type="checkbox" checked={isFeatured} onChange={(e) => setIsFeatured(e.target.checked)} className="accent-brand-pink" />
                  <span>Featured</span>
                </label>
                <label className="flex items-center gap-2 text-gray-300 cursor-pointer">
                  <input type="checkbox" checked={isTrending} onChange={(e) => setIsTrending(e.target.checked)} className="accent-brand-pink" />
                  <span>Trending</span>
                </label>
                <label className="flex items-center gap-2 text-gray-300 cursor-pointer">
                  <input type="checkbox" checked={isOffer} onChange={(e) => setIsOffer(e.target.checked)} className="accent-brand-pink" />
                  <span>Offer Sale</span>
                </label>
              </div>

              {/* Submit / Cancel Buttons */}
              <div className="pt-4 flex justify-end gap-2 border-t border-gray-800">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 rounded-xl bg-gray-800 text-gray-300 font-semibold">Cancel</button>
                <button type="submit" className="btn-pink-gradient px-6 py-2.5 rounded-xl font-bold shadow-lg">Save Product</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Import / Sync JSON Modal */}
      {isSyncModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-gray-900 border border-gray-800 rounded-3xl max-w-2xl w-full p-6 space-y-4 shadow-2xl">
            
            <div className="flex items-center justify-between border-b border-gray-800 pb-3">
              <div className="flex items-center gap-2">
                <FileJson className="w-5 h-5 text-emerald-400" />
                <h3 className="font-serif font-bold text-lg text-white">
                  Import / Sync Products JSON Across Devices
                </h3>
              </div>
              <button onClick={() => setIsSyncModalOpen(false)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-gray-300">
              Paste the exported JSON data below or upload a <code className="bg-gray-950 px-1 py-0.5 rounded text-emerald-400">scraped_products.json</code> file to sync product catalog onto this device.
            </p>

            {/* Quick Actions */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <label className="bg-gray-800 hover:bg-gray-700 text-white text-xs font-bold px-3 py-2 rounded-xl cursor-pointer flex items-center gap-1.5 border border-gray-700">
                <Upload className="w-4 h-4 text-emerald-400" />
                <span>Upload JSON File</span>
                <input type="file" accept=".json" onChange={handleFileUploadJSON} className="hidden" />
              </label>

              <button
                type="button"
                onClick={handleCopyJSON}
                className="bg-gray-800 hover:bg-gray-700 text-white text-xs font-bold px-3 py-2 rounded-xl flex items-center gap-1.5 border border-gray-700"
              >
                {copiedExport ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-blue-400" />}
                <span>{copiedExport ? 'Copied to Clipboard!' : 'Copy Current JSON'}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setSyncJsonText(JSON.stringify(rawScrapedProducts, null, 2));
                  showToast('Loaded initial scraped_products.json template');
                }}
                className="bg-gray-800 hover:bg-gray-700 text-amber-300 text-xs font-bold px-3 py-2 rounded-xl flex items-center gap-1.5 border border-gray-700"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Load Default Products</span>
              </button>
            </div>

            {/* Textarea */}
            <div>
              <textarea
                rows={10}
                value={syncJsonText}
                onChange={(e) => setSyncJsonText(e.target.value)}
                placeholder="Paste JSON array here..."
                className="w-full p-3 bg-gray-950 border border-gray-800 rounded-2xl text-xs font-mono text-emerald-300 focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Modal Footer Buttons */}
            <div className="pt-2 flex justify-end gap-2 border-t border-gray-800">
              <button
                type="button"
                onClick={() => setIsSyncModalOpen(false)}
                className="px-5 py-2.5 rounded-xl bg-gray-800 text-gray-300 font-semibold text-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleImportJSON}
                className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-2.5 rounded-xl font-bold text-xs shadow-lg flex items-center gap-2"
              >
                <Check className="w-4 h-4" />
                <span>Apply & Import Products</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
