import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Plus, Search, Trash2, CreditCard as Edit2 } from 'lucide-react';
import type { Tables } from '@/integrations/supabase/types';

export const Route = createFileRoute('/admin/collections')({
  component: CollectionsManagement,
});

function CollectionsManagement() {
  const [collections, setCollections] = useState<Set<string>>(new Set());
  const [filteredCollections, setFilteredCollections] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [editingCollection, setEditingCollection] = useState<string | null>(null);
  const [formData, setFormData] = useState('');
  const [showForm, setShowForm] = useState(false);

  const fetchCollections = useCallback(async () => {
    try {
      const { data } = await supabase
        .from('products')
        .select('collection')
        .not('collection', 'is', null);

      const uniqueCollections = new Set(
        data?.map((p) => p.collection).filter((c) => c) as string[]
      );
      setCollections(uniqueCollections);
      setFilteredCollections(Array.from(uniqueCollections).sort());
    } catch (error) {
      console.error('Error fetching collections:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCollections();
  }, [fetchCollections]);

  useEffect(() => {
    const filtered = Array.from(collections)
      .filter((collection) =>
        collection.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .sort();
    setFilteredCollections(filtered);
  }, [searchQuery, collections]);

  const handleAddCollection = () => {
    setEditingCollection(null);
    setFormData('');
    setShowForm(true);
  };

  const handleEditCollection = (collection: string) => {
    setEditingCollection(collection);
    setFormData(collection);
    setShowForm(true);
  };

  const handleSaveCollection = async () => {
    if (!formData.trim()) {
      alert('Collection name is required');
      return;
    }

    try {
      if (editingCollection && editingCollection !== formData) {
        // Update all products with the old collection name to the new one
        await supabase
          .from('products')
          .update({ collection: formData })
          .eq('collection', editingCollection);
      } else if (!editingCollection) {
        // Just adding - no need to update existing products
        // The collection will be created when a product is assigned to it
        setCollections(new Set([...collections, formData]));
      }

      await fetchCollections();
      setShowForm(false);
      setFormData('');
      setEditingCollection(null);
    } catch (error) {
      console.error('Error saving collection:', error);
      alert('Failed to save collection');
    }
  };

  const handleDeleteCollection = async (collection: string) => {
    if (!confirm(`Delete "${collection}"? Products in this collection will have it removed.`))
      return;

    try {
      await supabase
        .from('products')
        .update({ collection: null })
        .eq('collection', collection);

      const newCollections = new Set(collections);
      newCollections.delete(collection);
      setCollections(newCollections);
      await fetchCollections();
    } catch (error) {
      console.error('Error deleting collection:', error);
      alert('Failed to delete collection');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif text-pearl">Collections</h1>
          <p className="text-sm text-pearl/50 mt-1">
            {filteredCollections.length} of {collections.size} collections
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
          {collections.size === 0 ? 'No collections yet' : 'No matching collections'}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCollections.map((collection) => {
            // Count products in this collection
            const productCount = 0; // We'd need to fetch this separately if needed
            return (
              <div
                key={collection}
                className="bg-pearl/5 border border-pearl/10 rounded-lg p-6 hover:border-champagne/30 transition-colors"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="font-serif text-lg text-champagne">{collection}</h3>
                    <p className="text-sm text-pearl/50 mt-2">
                      Collection name
                    </p>
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
                      onClick={() => handleDeleteCollection(collection)}
                      className="p-2 hover:bg-red-500/10 rounded text-red-400 transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Collection Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-obsidian border border-pearl/20 rounded-lg max-w-md w-full p-6">
            <h2 className="text-xl font-serif text-pearl mb-6">
              {editingCollection ? 'Edit Collection' : 'Add Collection'}
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-pearl/60 mb-2">Name</label>
                <input
                  type="text"
                  value={formData}
                  onChange={(e) => setFormData(e.target.value)}
                  className="w-full bg-pearl/5 border border-pearl/10 px-4 py-2 rounded text-pearl placeholder:text-pearl/30 focus:outline-none focus:border-champagne"
                  placeholder="e.g., Spring Collection"
                  autoFocus
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
                    setFormData('');
                    setEditingCollection(null);
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
