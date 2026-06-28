import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { categories } from '@/lib/products';
import { Plus, Trash2, CreditCard as Edit2 } from 'lucide-react';

export const Route = createFileRoute('/admin/categories')({
  component: CategoriesManagement,
});

function CategoriesManagement() {
  const [localCategories, setLocalCategories] = useState(categories);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    description: '',
  });
  const [showForm, setShowForm] = useState(false);

  const handleAddCategory = () => {
    setEditingId(null);
    setFormData({ id: '', name: '', description: '' });
    setShowForm(true);
  };

  const handleEditCategory = (category: any) => {
    setEditingId(category.id);
    setFormData(category);
    setShowForm(true);
  };

  const handleSaveCategory = () => {
    if (!formData.name.trim()) {
      alert('Category name is required');
      return;
    }

    if (editingId) {
      setLocalCategories(
        localCategories.map((cat) =>
          cat.id === editingId ? { ...cat, ...formData } : cat
        )
      );
    } else {
      const newId = Date.now().toString();
      setLocalCategories([
        ...localCategories,
        { id: newId, name: formData.name, description: formData.description },
      ]);
    }

    setShowForm(false);
    setFormData({ id: '', name: '', description: '' });
    setEditingId(null);
  };

  const handleDeleteCategory = (id: string) => {
    if (!confirm('Are you sure you want to delete this category?')) return;
    setLocalCategories(localCategories.filter((cat) => cat.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif text-pearl">Categories</h1>
          <p className="text-sm text-pearl/50 mt-1">
            {localCategories.length} categories
          </p>
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
        {localCategories.map((category) => (
          <div
            key={category.id}
            className="bg-pearl/5 border border-pearl/10 rounded-lg p-6 hover:border-champagne/30 transition-colors"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="font-serif text-lg text-champagne">{category.name}</h3>
                <p className="text-sm text-pearl/50 mt-2">{category.description}</p>
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
                <label className="block text-sm text-pearl/60 mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows={3}
                  className="w-full bg-pearl/5 border border-pearl/10 px-4 py-2 rounded text-pearl placeholder:text-pearl/30 focus:outline-none focus:border-champagne"
                  placeholder="e.g., Elegant rings for every occasion"
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
                    setFormData({ id: '', name: '', description: '' });
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
