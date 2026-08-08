import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Category } from '../../types';
import { uploadImageFile } from '../../services/imageUpload';
import { 
  FolderPlus, 
  Edit, 
  Trash2, 
  Search, 
  Layers, 
  Image as ImageIcon, 
  X, 
  Check, 
  Tag
} from 'lucide-react';

export const CategoryManager: React.FC = () => {
  const { categories, products, addCategory, updateCategory, deleteCategory, showToast } = useStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [image, setImage] = useState('');
  const [description, setDescription] = useState('');
  const [isComingSoon, setIsComingSoon] = useState(false);

  const openAddModal = () => {
    setEditingCategory(null);
    setName('');
    setSlug('');
    setImage('https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=600&q=80');
    setDescription('');
    setIsComingSoon(false);
    setIsModalOpen(true);
  };

  const openEditModal = (cat: Category) => {
    setEditingCategory(cat);
    setName(cat.name);
    setSlug(cat.slug);
    setImage(cat.image);
    setDescription(cat.description || '');
    setIsComingSoon(!!cat.isComingSoon);
    setIsModalOpen(true);
  };

  const handleNameChange = (val: string) => {
    setName(val);
    if (!editingCategory) {
      setSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      showToast('Category name is required');
      return;
    }

    if (editingCategory) {
      updateCategory({
        ...editingCategory,
        name: name.trim(),
        slug: slug.trim() || name.toLowerCase().replace(/\s+/g, '-'),
        image: image.trim() || 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=600&q=80',
        description: description.trim(),
        isComingSoon
      });
      showToast(`Category "${name}" updated successfully!`);
    } else {
      addCategory({
        name: name.trim(),
        slug: slug.trim() || name.toLowerCase().replace(/\s+/g, '-'),
        image: image.trim() || 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=600&q=80',
        description: description.trim(),
        isComingSoon
      });
      showToast(`Category "${name}" added successfully!`);
    }

    setIsModalOpen(false);
  };

  const handleDelete = (cat: Category) => {
    const productsInCat = products.filter(p => p.category.toLowerCase() === cat.name.toLowerCase()).length;
    if (productsInCat > 0) {
      if (!window.confirm(`Warning: ${productsInCat} product(s) are assigned to "${cat.name}". Are you sure you want to delete this category?`)) {
        return;
      }
    } else {
      if (!window.confirm(`Delete category "${cat.name}"?`)) return;
    }

    deleteCategory(cat.id);
    showToast(`Category "${cat.name}" deleted.`);
  };

  const filteredCategories = categories.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.slug.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-gray-900 p-5 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-brand-pink" />
            Category Management
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Create, edit, and organize product categories across the store catalog.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="bg-brand-pink hover:bg-brand-pink-hover text-white px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all shadow-md shadow-brand-pink/20"
        >
          <FolderPlus className="w-4 h-4" />
          Add New Category
        </button>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 text-gray-400 absolute left-4 top-3.5" />
        <input
          type="text"
          placeholder="Search categories by name or slug..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl pl-11 pr-4 py-3 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-brand-pink"
        />
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredCategories.map((cat) => {
          const itemCount = products.filter(p => p.category.toLowerCase() === cat.name.toLowerCase()).length;
          return (
            <div 
              key={cat.id} 
              className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="relative h-36 overflow-hidden bg-gray-100 dark:bg-gray-800">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=600&q=80';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  
                  <span className="absolute top-3 left-3 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                    {itemCount} Products
                  </span>
                </div>

                <div className="p-4 space-y-2">
                  <h3 className="font-bold text-gray-900 dark:text-white text-base flex items-center justify-between">
                    <span>{cat.name}</span>
                  </h3>
                  
                  <p className="text-xs font-mono text-gray-400 dark:text-gray-500">
                    slug: /{cat.slug}
                  </p>

                  {cat.description && (
                    <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">
                      {cat.description}
                    </p>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-4 pt-0 border-t border-gray-50 dark:border-gray-800/50 mt-3 flex items-center justify-end gap-2">
                <button
                  onClick={() => openEditModal(cat)}
                  className="p-2 text-gray-600 dark:text-gray-300 hover:text-brand-pink hover:bg-brand-pink/10 rounded-lg transition-colors text-xs font-semibold flex items-center gap-1"
                >
                  <Edit className="w-3.5 h-3.5" />
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(cat)}
                  className="p-2 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg transition-colors text-xs font-semibold flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Delete
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal Form for Add/Edit Category */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in duration-200">
            
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-3">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Tag className="w-5 h-5 text-brand-pink" />
                {editingCategory ? 'Edit Category' : 'Create New Category'}
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">
                  Category Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Velvet Collection"
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-3.5 py-2.5 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-brand-pink"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">
                  URL Slug
                </label>
                <input
                  type="text"
                  placeholder="velvet-collection"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-3.5 py-2.5 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-brand-pink font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">
                  Banner / Image (URL or File Upload)
                </label>
                <div className="space-y-2">
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/..."
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-3.5 py-2.5 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-brand-pink"
                  />
                  <div className="flex items-center gap-2">
                    <label className="cursor-pointer bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-white px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors border border-gray-200 dark:border-gray-700">
                      <ImageIcon className="w-3.5 h-3.5 text-brand-pink" />
                      <span>Upload Image File</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const res = await uploadImageFile(file);
                            if (res.url) {
                              setImage(res.url);
                              showToast('Image uploaded successfully!');
                            }
                          }
                        }}
                      />
                    </label>
                    {image && (
                      <span className="text-[10px] text-emerald-500 font-semibold flex items-center gap-1">
                        <Check className="w-3 h-3" /> Image attached
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Short description of this luxury collection..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-3.5 py-2.5 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-brand-pink"
                />
              </div>

              <div className="flex items-center gap-3 p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/40 rounded-xl">
                <input 
                  type="checkbox"
                  id="isComingSoon"
                  checked={isComingSoon}
                  onChange={(e) => setIsComingSoon(e.target.checked)}
                  className="w-4 h-4 text-brand-pink rounded border-gray-300 focus:ring-brand-pink"
                />
                <label htmlFor="isComingSoon" className="text-xs font-bold text-gray-800 dark:text-gray-200 cursor-pointer">
                  Mark Collection as "Coming Soon" (Displays Coming Soon Badge on Category Card)
                </label>
              </div>

              <div className="pt-3 flex justify-end gap-3 border-t border-gray-100 dark:border-gray-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-brand-pink hover:bg-brand-pink-hover text-white px-5 py-2 text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-md shadow-brand-pink/20"
                >
                  <Check className="w-4 h-4" />
                  {editingCategory ? 'Save Changes' : 'Create Category'}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};
