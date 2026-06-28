import { createFileRoute } from '@tanstack/react-router';
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Plus, Trash2, CreditCard as Edit2 } from 'lucide-react';
import { toast } from 'sonner';
import type { Tables } from '@/integrations/supabase/types';

export const Route = createFileRoute('/admin/categories')({
  component: CategoriesManagement,
});

type Category = Tables<'categories'>;

function CategoriesManagement() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    tagline: '',
    image_url: '',
  });
  const [showForm, setShowForm] = useState(false);

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('sort_order', { ascending: true });

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error('Failed to load categories');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleAddCategory = () => {
    setEditingId(null);
    setFormData({ name: '', slug: '', description: '', tagline: '', image_url: '' });
    setShowForm(true);
  };

  const handleEditCategory = (category: Category) => {
    setEditingId(category.id);
    setFormData({
      name: category.name,
      slug: category.slug,
      description: category.description || '',
      tagline: category.tagline || '',
      image_url: category.image_url || '',
    });
    setShowForm(true);
  };

  const handleSaveCategory = async () => {
    if (!formData.name.trim()) {
      toast.error('Category name is required');
      return;
    }
    if (!formData.slug.trim()) {
      toast.error('Category slug is required');
      return;
    }

    try {
      const slug = formData.slug.toLowerCase().replace(/[^a-z0-9-]/g, '-');

      if (editingId) {
        const { error } = await (supabase as any)
          .from('categories')
          .update({
            name: formData.name,
            slug,
            description: formData.description || null,
            tagline: formData.tagline || null,
            image_url: formData.image_url || null,
          })
          .eq('id', editingId);

        if (error) throw error;
        toast.success('Category updated');
      } else {
        const { error } = await (supabase as any)
          .from('categories')
          .insert({
            id: slug,
            name: formData.name,
            slug,
            description: formData.description || null,
            tagline: formData.tagline || null,
            image_url: formData.image_url || null,
          });

        if (error) throw error;
        toast.success('Category created');
      }

      await fetchCategories();
      setShowForm(false);
      setFormData({ name: '', slug: '', description: '', tagline: '', image_url: '' });
      setEditingId(null);
    } catch (error) {
      console.error('Error saving category:', error);
      toast.error('Failed to save category');
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (!confirm('Are you sure you want to delete this category?')) return;

    try {
      const { error } = await (supabase as any)
        .from('categories')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Category deleted');
      await fetchCategories();
    } catch (error) {
      console.error('Error deleting category:', error);
      toast.error('Failed to delete category');
    }
  };

  if (loading) {
    return <div className="text-center py-12 text-pearl/50">Loading categories...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif text-pearl">Categories</h1>
          <p className="text-sm text-pearl/50 mt-1">{categories.length} categories</p>
        </div>
        <button
          onClick={handleAddCategory}
          className="flex items-center justify-center gap-2 bg-champagne text-obsidian px-6 py-3 rounded font-medium hover:bg-pearl transition-colors"
        >
          <Plus size={18} />
          Add Category
        </button>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((category) => (
          <div
            key={category.id}
            className="bg-pearl/5 border border-pearl/10 rounded-lg p-6 hover:border-champagne/30 transition-colors"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="font-serif text-lg text-champagne">{category.name}</h3>
                <p className="text-xs text-pearl/30 mt-1">/{category.slug}</p>
                <p className="text-sm text-pearl/50 mt-2">{category.description || category.tagline}</p>
              </div>
              <div className="flex gap-2 ml-4">
                <button
                  onClick={() => handleEditCategory(category)}
                  className="p-2 hover:bg-champagne/10 rounded text-champagne transition-colors"
                  title="Edit"
                >
                  <Edit2 size={16} />
                </button>
                <button
                  onClick={() => handleDeleteCategory(category.id)}
                  className="p-2 hover:bg-red-500/10 rounded text-red-400 transition-colors"
                  title="Delete"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {categories.length === 0 && (
        <div className="text-center py-12 text-pearl/50">
          No categories yet. Click "Add Category" to create one.
        </div>
      )}

      {/* Category Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-obsidian border border-pearl/20 rounded-lg max-w-md w-full p-6">
            <h2 className="text-xl font-serif text-pearl mb-6">
              {editingId ? 'Edit Category' : 'Add Category'}
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-pearl/60 mb-2">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-pearl/5 border border-pearl/10 px-4 py-2 rounded text-pearl placeholder:text-pearl/30 focus:outline-none focus:border-champagne"
                  placeholder="e.g., Rings"
                />
              </div>

              <div>
                <label className="block text-sm text-pearl/60 mb-2">Slug (URL)</label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  className="w-full bg-pearl/5 border border-pearl/10 px-4 py-2 rounded text-pearl placeholder:text-pearl/30 focus:outline-none focus:border-champagne"
                  placeholder="e.g., rings"
                />
              </div>

              <div>
                <label className="block text-sm text-pearl/60 mb-2">Tagline</label>
                <input
                  type="text"
                  value={formData.tagline}
                  onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                  className="w-full bg-pearl/5 border border-pearl/10 px-4 py-2 rounded text-pearl placeholder:text-pearl/30 focus:outline-none focus:border-champagne"
                  placeholder="e.g., Eternal silhouettes"
                />
              </div>

              <div>
                <label className="block text-sm text-pearl/60 mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full bg-pearl/5 border border-pearl/10 px-4 py-2 rounded text-pearl placeholder:text-pearl/30 focus:outline-none focus:border-champagne"
                  placeholder="Category description..."
                />
              </div>

              <div>
                <label className="block text-sm text-pearl/60 mb-2">Image URL</label>
                <input
                  type="text"
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  className="w-full bg-pearl/5 border border-pearl/10 px-4 py-2 rounded text-pearl placeholder:text-pearl/30 focus:outline-none focus:border-champagne"
                  placeholder="https://..."
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleSaveCategory}
                  className="flex-1 bg-champagne text-obsidian px-4 py-2 rounded font-medium hover:bg-pearl transition-colors"
                >
                  Save Category
                </button>
                <button
                  onClick={() => {
                    setShowForm(false);
                    setFormData({ name: '', slug: '', description: '', tagline: '', image_url: '' });
                    setEditingId(null);
                  }}
                  className="flex-1 border border-pearl/20 text-pearl px-4 py-2 rounded font-medium hover:border-pearl/40 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
