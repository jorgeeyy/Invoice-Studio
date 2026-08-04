import { useState } from 'react';
import { Plus, Search, Package, Edit2, Trash2, X } from 'lucide-react';
import { useProducts, useCreateProduct, useUpdateProduct, useDeleteProduct } from '@/hooks/useProducts';
import { productSchema } from '@/lib/validations';
import type { Product, Currency } from '@/types';

const currencySymbol: Record<Currency, string> = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  GHS: 'GH₵',
  CAD: 'CA$',
  AUD: 'A$',
};

function parseNumber(value: string): number {
  const num = parseFloat(value);
  return isNaN(num) ? 0 : num;
}

interface ProductFormData {
  name: string;
  description: string;
  unitPrice: string;
  currency: Currency;
  taxRate: string;
  quantity: string;
  category: string;
}

const defaultFormData: ProductFormData = {
  name: '',
  description: '',
  unitPrice: '0',
  currency: 'USD',
  taxRate: '10',
  quantity: '1',
  category: '',
};

export function ProductList() {
  const { data: products, isLoading } = useProducts();
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const deleteProduct = useDeleteProduct();

  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<ProductFormData>(defaultFormData);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const filteredProducts = products?.filter(
    (product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenModal = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        description: product.description || '',
        unitPrice: String(product.unitPrice),
        currency: product.currency,
        taxRate: String(product.taxRate),
        quantity: String(product.quantity),
        category: product.category || '',
      });
    } else {
      setEditingProduct(null);
      setFormData(defaultFormData);
    }
    setErrors({});
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingProduct(null);
    setFormData(defaultFormData);
    setErrors({});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const inputData = {
      name: formData.name,
      description: formData.description || undefined,
      unitPrice: parseNumber(formData.unitPrice),
      currency: formData.currency,
      taxRate: parseNumber(formData.taxRate),
      quantity: parseNumber(formData.quantity) || 1,
      category: formData.category || undefined,
    };

    const result = productSchema.safeParse(inputData);

    if (!result.success) {
      const newErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        newErrors[issue.path[0] as string] = issue.message;
      });
      setErrors(newErrors);
      return;
    }

    try {
      if (editingProduct) {
        await updateProduct.mutateAsync({ id: editingProduct.id, input: result.data });
      } else {
        await createProduct.mutateAsync(result.data);
      }
      handleCloseModal();
    } catch (error) {
      console.error('Failed to save product:', error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteProduct.mutateAsync(id);
      setDeleteConfirm(null);
    } catch (error) {
      console.error('Failed to delete product:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-headline text-2xl font-bold text-primary">Products & Services</h1>
          <p className="text-on-surface-variant mt-1">Manage your reusable products and services</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="bg-primary text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2 hover:opacity-90 active:scale-95 transition-all"
        >
          <Plus className="w-4 h-4" />
          Add Product
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant w-4 h-4" />
        <input
          type="text"
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full h-10 bg-surface-container-low border border-border-subtle rounded-lg pl-10 pr-4 text-sm focus:ring-2 focus:ring-secondary/10 focus:border-secondary outline-none transition-all"
        />
      </div>

      {/* Products Table */}
      <div className="bg-surface-container-lowest border border-border-subtle rounded-xl overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center">
            <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto" />
            <p className="text-on-surface-variant mt-4 text-sm">Loading products...</p>
          </div>
        ) : filteredProducts && filteredProducts.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-low/50">
                  <th className="px-6 py-3 text-xs font-semibold text-on-surface-variant border-b border-border-subtle uppercase tracking-wider">Product</th>
                  <th className="px-6 py-3 text-xs font-semibold text-on-surface-variant border-b border-border-subtle uppercase tracking-wider">Category</th>
                  <th className="px-6 py-3 text-xs font-semibold text-on-surface-variant border-b border-border-subtle uppercase tracking-wider">Price</th>
                  <th className="px-6 py-3 text-xs font-semibold text-on-surface-variant border-b border-border-subtle uppercase tracking-wider">Tax</th>
                  <th className="px-6 py-3 text-xs font-semibold text-on-surface-variant border-b border-border-subtle uppercase tracking-wider">Qty</th>
                  <th className="px-6 py-3 border-b border-border-subtle"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle">
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-surface-container/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center">
                          <Package className="w-5 h-5 text-secondary" />
                        </div>
                        <div>
                          <p className="font-semibold text-sm">{product.name}</p>
                          {product.description && (
                            <p className="text-xs text-on-surface-variant truncate max-w-[300px]">{product.description}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-on-surface-variant">
                      {product.category || '-'}
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold">
                      {currencySymbol[product.currency]}{product.unitPrice.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-on-surface-variant">
                      {product.taxRate}%
                    </td>
                    <td className="px-6 py-4 text-sm text-on-surface-variant">
                      {product.quantity}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleOpenModal(product)}
                          className="p-1.5 hover:bg-surface-container rounded-lg text-on-surface-variant transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        {deleteConfirm === product.id ? (
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleDelete(product.id)}
                              className="px-2 py-1 bg-error text-white text-xs rounded font-semibold hover:opacity-90"
                            >
                              Confirm
                            </button>
                            <button
                              onClick={() => setDeleteConfirm(null)}
                              className="px-2 py-1 border border-border-subtle text-xs rounded font-semibold hover:bg-surface-container"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setDeleteConfirm(product.id)}
                            className="p-1.5 hover:bg-error/10 rounded-lg text-on-surface-variant hover:text-error transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center">
            <Package className="w-12 h-12 text-on-surface-variant mx-auto mb-4" />
            <p className="text-on-surface-variant">
              {searchQuery ? 'No products found matching your search' : 'No products yet. Add your first product!'}
            </p>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-surface-container-lowest rounded-xl w-full max-w-md shadow-xl">
            <div className="flex items-center justify-between p-6 border-b border-border-subtle">
              <h3 className="font-headline text-lg font-semibold">
                {editingProduct ? 'Edit Product' : 'Add Product'}
              </h3>
              <button onClick={handleCloseModal} className="text-on-surface-variant hover:text-primary">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full h-10 border border-border-subtle rounded px-3 text-sm"
                  placeholder="e.g., Website Development"
                />
                {errors.name && <p className="text-error text-xs">{errors.name}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full border border-border-subtle rounded px-3 py-2 text-sm resize-none"
                  rows={2}
                  placeholder="Brief description..."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Price *</label>
                  <input
                    type="text"
                    inputMode="decimal"
                    value={formData.unitPrice}
                    onChange={(e) => setFormData({ ...formData, unitPrice: e.target.value.replace(/[^0-9.]/g, '') })}
                    className="w-full h-10 border border-border-subtle rounded px-3 text-sm"
                  />
                  {errors.unitPrice && <p className="text-error text-xs">{errors.unitPrice}</p>}
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Currency</label>
                  <select
                    value={formData.currency}
                    onChange={(e) => setFormData({ ...formData, currency: e.target.value as Currency })}
                    className="w-full h-10 border border-border-subtle rounded px-3 text-sm bg-surface-container-lowest"
                  >
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="GBP">GBP</option>
                    <option value="GHS">GHS</option>
                    <option value="CAD">CAD</option>
                    <option value="AUD">AUD</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Tax Rate (%)</label>
                  <input
                    type="text"
                    inputMode="decimal"
                    value={formData.taxRate}
                    onChange={(e) => setFormData({ ...formData, taxRate: e.target.value.replace(/[^0-9.]/g, '') })}
                    className="w-full h-10 border border-border-subtle rounded px-3 text-sm"
                  />
                  {errors.taxRate && <p className="text-error text-xs">{errors.taxRate}</p>}
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Default Qty</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value.replace(/[^0-9]/g, '') })}
                    className="w-full h-10 border border-border-subtle rounded px-3 text-sm"
                  />
                  {errors.quantity && <p className="text-error text-xs">{errors.quantity}</p>}
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Category</label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full h-10 border border-border-subtle rounded px-3 text-sm"
                  placeholder="e.g., Development, Design"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 h-10 border border-border-subtle rounded font-semibold text-sm hover:bg-surface-container transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createProduct.isPending || updateProduct.isPending}
                  className="flex-1 h-10 bg-primary text-white rounded font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  {createProduct.isPending || updateProduct.isPending ? 'Saving...' : 'Save Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
