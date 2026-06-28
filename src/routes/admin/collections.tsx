import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Plus, Search, Trash2, CreditCard as Edit2 } from 'lucide-react';
import { toast } from 'sonner';
import type { Tables } from '@/integrations/supabase/types';

export const Route = createFileRoute('/admin/collections')({
  component: CollectionsManagement,
});

type Collection = Tables<'collections'>;

function CollectionsManagement() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [filteredCollections, setFilteredCollections] = useState<Collection[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    image_url: '',
  });
  const [showForm, setShowForm] = useState(false);

  const fetchCollections = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('collections')
        .select('*')
        .order('sort_order', { ascending: true });

      if (error) throw error;
      setCollections(data || []);
      setFilteredCollections(data || []);
    } catch (error) {
      console.error('Error fetching collections:', error);
      toast.error('Failed to load collections');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCollections();
  }, [fetchCollections]);

  useEffect(() => {
    const filtered = collections.filter(
      (collection) =>
        collection.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        collection.slug.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredCollections(filtered);
  }, [searchQuery, collections]);

  const handleAddCollection = () => {
    setEditingId(null);
    setFormData({ name: '', slug: '', description: '', image_url: '' });
    setShowForm(true);
  };

  const handleEditCollection = (collection: Collection) => {
    setEditingId(collection.id);
    setFormData({
      name: collection.name,
      slug: collection.slug,
      description: collection.description || '',
      image_url: collection.image_url || '',
    });
    setShowForm(true);
  };

  const handleSaveCollection = async () => {
    if (!formData.name.trim()) {
      toast.error('Collection name is required');
      return;
    }
    if (!formData.slug.trim()) {
      toast.error('Collection slug is required');
      return;
    }

    try {
      const slug = formData.slug.toLowerCase().replace(/[^a-z0-9-]/g, '-');

      if (editingId) {
        const { error } = await (supabase as any)
          .from('collections')
          .update({
            name: formData.name,
            slug,
            description: formData.description || null,
            image_url: formData.image_url || null,
          })
          .eq('id', editingId);

        if (error) throw error;
        toast.success('Collection updated');
      } else {
        const { error } = await (supabase as any)
          .from('collections')
          .insert({
            id: slug,
            name: formData.name,
            slug,
            description: formData.description || null,
            image_url: formData.image_url || null,
          });

        if (error) throw error;
        toast.success('Collection created');
      }

      await fetchCollections();
      setShowForm(false);
      setFormData({ name: '', slug: '', description: '', image_url: '' });
      setEditingId(null);
    } catch (error) {
      console.error('Error saving collection:', error);
      toast.error('Failed to save collection');
    }
  };

  const handleDeleteCollection = async (id: string) => {
    if (!confirm('Are you sure you want to delete this collection?')) return;

    try {
      const { error } = await (supabase as any)
        .from('collections')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Collection deleted');
      await fetchCollections();
    } catch (error) {
      console.error('Error deleting collection:', error);
      toast.error('Failed to delete collection');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif text-pearl">Collections</h1>
          <p className="text-sm text-pearl/50 mt-1">
            {filteredCollections.length} of {collections.length} collections
          </p>
        </div>
        <button
          onClick={handleAddCollection}
          className="flex items-center justify-center gap-2 bg-champagne text-obsidian px-6 py-3 rounded font-medium hover:bg-pearl transition-colors"
        >
          <Plus size={18} />
          Add Collection
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-pearl/40" />
        <input
          type="search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search collections..."
          className="w-full bg-pearl/5 border border-pearl/10 pl-11 pr-4 py-3 rounded text-pearl placeholder:text-pearl/30 focus:outline-none focus:border-champagne transition-colors"
        />
      </div>

      {/* Collections Grid */}
      {loading ? (
        <div className="text-center py-12 text-pearl/50">Loading collections...</div>
      ) : filteredCollections.length === 0 ? (
        <div className="text-center py-12 text-pearl/50">
          {collections.length === 0 ? 'No collections yet. Click "Add Collection" to create one.' : 'No matching collections'}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCollections.map((collection) => (
            <div
              key={collection.id}
              className="bg-pearl/5 border border-pearl/10 rounded-lg p-6 hover:border-champagne/30 transition-colors"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="font-serif text-lg text-champagne">{collection.name}</h3>
                  <p className="text-xs text-pearl/30 mt-1">/{collection.slug}</p>
                  <p className="text-sm text-pearl/50 mt-2">{collection.description || 'No description'}</p>
                </div>
                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => handleEditCollection(collection)}
                    className="p-2 hover:bg-champagne/10 rounded text-champagne transition-colors"
                    title="Edit"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => handleDeleteCollection(collection.id)}
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
      )}

      {/* Collection Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-obsidian border border-pearl/20 rounded-lg max-w-md w-full p-6">
            <h2 className="text-xl font-serif text-pearl mb-6">
              {editingId ? 'Edit Collection' : 'Add Collection'}
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-pearl/60 mb-2">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-pearl/5 border border-pearl/10 px-4 py-2 rounded text-pearl placeholder:text-pearl/30 focus:outline-none focus:border-champagne"
                  placeholder="e.g., Spring Collection"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-sm text-pearl/60 mb-2">Slug (URL)</label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  className="w-full bg-pearl/5 border border-pearl/10 px-4 py-2 rounded text-pearl placeholder:text-pearl/30 focus:outline-none focus:border-champagne"
                  placeholder="e.g., spring-collection"
                />
              </div>

              <div>
                <label className="block text-sm text-pearl/60 mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full bg-pearl/5 border border-pearl/10 px-4 py-2 rounded text-pearl placeholder:text-pearl/30 focus:outline-none focus:border-champagne"
                  placeholder="Collection description..."
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
                  onClick={handleSaveCollection}
                  className="flex-1 bg-champagne text-obsidian px-4 py-2 rounded font-medium hover:bg-pearl transition-colors"
                >
                  Save Collection
                </button>
                <button
                  onClick={() => {
                    setShowForm(false);
                    setFormData({ name: '', slug: '', description: '', image_url: '' });
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
