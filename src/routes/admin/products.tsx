import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Plus, Search, Trash2, CreditCard as Edit2, Star, Badge, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import type { Tables } from '@/integrations/supabase/types';

export const Route = createFileRoute('/admin/products')({
  component: ProductsManagement,
});

function ProductsManagement() {
  const [products, setProducts] = useState<Tables<'products'>[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Tables<'products'>[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Tables<'products'>>>({});
  const [showForm, setShowForm] = useState(false);

  const fetchProducts = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProducts((data || []) as Tables<'products'>[]);
      setFilteredProducts((data || []) as Tables<'products'>[]);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    const filtered = products.filter(
      (product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.sku?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredProducts(filtered);
  }, [searchQuery, products]);

  const handleAddProduct = () => {
    setEditingId(null);
    setFormData({
      name: '',
      slug: '',
      description: '',
      category: 'rings',
      price: 0,
      stock: 0,
      images: [],
      details: [],
      is_featured: false,
      is_new_arrival: false,
      is_best_seller: false,
    });
    setShowForm(true);
  };

  const handleEditProduct = (product: Tables<'products'>) => {
    setEditingId(product.id);
    setFormData(product);
    setShowForm(true);
  };

  const handleSaveProduct = async () => {
    try {
      if (editingId) {
        const { error } = await (supabase as any)
          .from('products')
          .update(formData)
          .eq('id', editingId);

        if (error) throw error;
        toast.success('Product updated');
      } else {
        const { error } = await (supabase as any)
          .from('products')
          .insert(formData);

        if (error) throw error;
        toast.success('Product created');
      }

      await fetchProducts();
      setShowForm(false);
      setFormData({});
      setEditingId(null);
    } catch (error) {
      console.error('Error saving product:', error);
      toast.error('Failed to save product');
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      const { error } = await (supabase as any)
        .from('products')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Product deleted');
      await fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Failed to delete product');
    }
  };

  const toggleFlag = async (
    productId: string,
    flag: 'is_featured' | 'is_best_seller' | 'is_new_arrival',
    currentValue: boolean
  ) => {
    try {
      const { error } = await (supabase as any)
        .from('products')
        .update({ [flag]: !currentValue })
        .eq('id', productId);

      if (error) throw error;
      await fetchProducts();
    } catch (error) {
      console.error('Error updating product:', error);
      toast.error('Failed to update product');
    }
  };

  if (loading) {
    return <div className="text-center py-12 text-pearl/50">Loading products...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif text-pearl">Products</h1>
          <p className="text-sm text-pearl/50 mt-1">
            {filteredProducts.length} of {products.length} products
          </p>
        </div>
        <button
          onClick={handleAddProduct}
          className="flex items-center justify-center gap-2 bg-champagne text-obsidian px-6 py-3 rounded font-medium hover:bg-pearl transition-colors"
        >
          <Plus size={18} />
          Add Product
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-pearl/40" />
        <input
          type="search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by name, SKU, or category..."
          className="w-full bg-pearl/5 border border-pearl/10 pl-11 pr-4 py-3 rounded text-pearl placeholder:text-pearl/30 focus:outline-none focus:border-champagne transition-colors"
        />
      </div>

      {/* Products Table */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-12 text-pearl/50">
          {products.length === 0 ? 'No products yet. Click "Add Product" to create one.' : 'No matching products'}
        </div>
      ) : (
        <div className="bg-pearl/5 border border-pearl/10 rounded-lg overflow-hidden overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-pearl/10 bg-pearl/5">
                <th className="text-left p-4 text-pearl/60">Name</th>
                <th className="text-left p-4 text-pearl/60">Category</th>
                <th className="text-left p-4 text-pearl/60">Price</th>
                <th className="text-left p-4 text-pearl/60">Stock</th>
                <th className="text-left p-4 text-pearl/60">Flags</th>
                <th className="text-left p-4 text-pearl/60">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <tr
                  key={product.id}
                  className="border-b border-pearl/5 hover:bg-champagne/5 transition-colors"
                >
                  <td className="p-4">
                    <div>
                      <p className="text-pearl font-medium">{product.name}</p>
                      <p className="text-xs text-pearl/40 mt-1">{product.sku}</p>
                    </div>
                  </td>
                  <td className="p-4 text-pearl/60 capitalize">{product.category}</td>
                  <td className="p-4 text-champagne font-medium">
                    ${product.price.toFixed(2)}
                  </td>
                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded text-xs font-medium ${
                        product.stock > 0
                          ? 'bg-green-500/20 text-green-200'
                          : 'bg-red-500/20 text-red-200'
                      }`}
                    >
                      {product.stock} units
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      {product.is_featured && (
                        <button
                          onClick={() => toggleFlag(product.id, 'is_featured', product.is_featured)}
                          title="Featured"
                          className="text-champagne hover:opacity-70"
                        >
                          <Star size={14} fill="currentColor" />
                        </button>
                      )}
                      {product.is_best_seller && (
                        <button
                          onClick={() => toggleFlag(product.id, 'is_best_seller', product.is_best_seller)}
                          title="Best Seller"
                          className="text-red-400 hover:opacity-70"
                        >
                          <Badge size={14} fill="currentColor" />
                        </button>
                      )}
                      {product.is_new_arrival && (
                        <button
                          onClick={() => toggleFlag(product.id, 'is_new_arrival', product.is_new_arrival)}
                          title="New Arrival"
                          className="text-blue-400 hover:opacity-70"
                        >
                          <Sparkles size={14} fill="currentColor" />
                        </button>
                      )}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEditProduct(product)}
                        className="p-2 hover:bg-champagne/10 rounded text-champagne transition-colors"
                        title="Edit"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(product.id)}
                        className="p-2 hover:bg-red-500/10 rounded text-red-400 transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Product Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-obsidian border border-pearl/20 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
            <h2 className="text-xl font-serif text-pearl mb-6">
              {editingId ? 'Edit Product' : 'Add Product'}
            </h2>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-pearl/60 mb-2">Name</label>
                  <input
                    type="text"
                    value={formData.name || ''}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-pearl/5 border border-pearl/10 px-4 py-2 rounded text-pearl placeholder:text-pearl/30 focus:outline-none focus:border-champagne"
                  />
                </div>
                <div>
                  <label className="block text-sm text-pearl/60 mb-2">SKU</label>
                  <input
                    type="text"
                    value={formData.sku || ''}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    className="w-full bg-pearl/5 border border-pearl/10 px-4 py-2 rounded text-pearl placeholder:text-pearl/30 focus:outline-none focus:border-champagne"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-pearl/60 mb-2">Category</label>
                  <select
                    value={formData.category || 'rings'}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-pearl/5 border border-pearl/10 px-4 py-2 rounded text-pearl focus:outline-none focus:border-champagne"
                  >
                    <option value="rings">Rings</option>
                    <option value="earrings">Earrings</option>
                    <option value="bracelets">Bracelets</option>
                    <option value="necklaces">Necklaces</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-pearl/60 mb-2">Price</label>
                  <input
                    type="number"
                    value={formData.price || 0}
                    onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                    className="w-full bg-pearl/5 border border-pearl/10 px-4 py-2 rounded text-pearl placeholder:text-pearl/30 focus:outline-none focus:border-champagne"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-pearl/60 mb-2">Stock</label>
                  <input
                    type="number"
                    value={formData.stock || 0}
                    onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) })}
                    className="w-full bg-pearl/5 border border-pearl/10 px-4 py-2 rounded text-pearl placeholder:text-pearl/30 focus:outline-none focus:border-champagne"
                  />
                </div>
                <div>
                  <label className="block text-sm text-pearl/60 mb-2">Slug</label>
                  <input
                    type="text"
                    value={formData.slug || ''}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className="w-full bg-pearl/5 border border-pearl/10 px-4 py-2 rounded text-pearl placeholder:text-pearl/30 focus:outline-none focus:border-champagne"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-pearl/60 mb-2">Description</label>
                <textarea
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full bg-pearl/5 border border-pearl/10 px-4 py-2 rounded text-pearl placeholder:text-pearl/30 focus:outline-none focus:border-champagne"
                />
              </div>

              <div className="space-y-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.is_featured || false}
                    onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                    className="rounded"
                  />
                  <span className="text-sm text-pearl">Featured</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.is_best_seller || false}
                    onChange={(e) => setFormData({ ...formData, is_best_seller: e.target.checked })}
                    className="rounded"
                  />
                  <span className="text-sm text-pearl">Best Seller</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.is_new_arrival || false}
                    onChange={(e) => setFormData({ ...formData, is_new_arrival: e.target.checked })}
                    className="rounded"
                  />
                  <span className="text-sm text-pearl">New Arrival</span>
                </label>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleSaveProduct}
                  className="flex-1 bg-champagne text-obsidian px-4 py-2 rounded font-medium hover:bg-pearl transition-colors"
                >
                  Save Product
                </button>
                <button
                  onClick={() => {
                    setShowForm(false);
                    setFormData({});
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
