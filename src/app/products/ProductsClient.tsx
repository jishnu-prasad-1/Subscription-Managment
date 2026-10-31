"use client";

import React, { useState } from "react";
import { WindowCard } from "@/components/ui/WindowCard";
import { NeoButton } from "@/components/ui/NeoButton";
import { Modal } from "@/components/ui/Modal";
import { PennyMascot } from "@/components/mascot/PennyMascot";
import { exportToCsv } from "@/lib/exportCsv";

interface VariantRow {
  id: string;
  variantName: string;
  attributeKey: string;
  attributeValue: string;
  additionalPrice: number;
}

interface ProductRow {
  id: string;
  name: string;
  productType: string;
  salesPrice: number;
  costPrice: number;
  notes: string | null;
  isActive: boolean;
  variants: VariantRow[];
}

interface ProductsClientProps {
  initialProducts: ProductRow[];
}

export const ProductsClient: React.FC<ProductsClientProps> = ({ initialProducts }) => {
  const [products, setProducts] = useState<ProductRow[]>(initialProducts);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductRow | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form State
  const [name, setName] = useState("");
  const [productType, setProductType] = useState("Software");
  const [salesPrice, setSalesPrice] = useState(1500);
  const [costPrice, setCostPrice] = useState(300);
  const [notes, setNotes] = useState("");
  const [hasOdooVariant, setHasOdooVariant] = useState(true);

  // Edit State
  const [editName, setEditName] = useState("");
  const [editSalesPrice, setEditSalesPrice] = useState(0);
  const [editCostPrice, setEditCostPrice] = useState(0);
  const [editNotes, setEditNotes] = useState("");

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleOpenEdit = (prod: ProductRow) => {
    setEditingProduct(prod);
    setEditName(prod.name);
    setEditSalesPrice(prod.salesPrice);
    setEditCostPrice(prod.costPrice);
    setEditNotes(prod.notes || "");
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    setProducts((prev) =>
      prev.map((p) =>
        p.id === editingProduct.id
          ? {
              ...p,
              name: editName,
              salesPrice: Number(editSalesPrice),
              costPrice: Number(editCostPrice),
              notes: editNotes,
            }
          : p
      )
    );
    showToast(`Saved modifications to '${editName}'!`);
    setEditingProduct(null);
  };

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const newVariants: VariantRow[] = [
      {
        id: `var-std-${Date.now()}`,
        variantName: "Standard Cloud Edition",
        attributeKey: "Edition",
        attributeValue: "Standard",
        additionalPrice: 0.0,
      },
    ];

    if (hasOdooVariant) {
      newVariants.push({
        id: `var-odoo-${Date.now()}`,
        variantName: "Odoo Brand Integration Edition",
        attributeKey: "Brand",
        attributeValue: "Odoo Brand",
        additionalPrice: 560.0, // EXACT requirement from problem statement
      });
    }

    const newProd: ProductRow = {
      id: `prod-${Date.now()}`,
      name,
      productType,
      salesPrice,
      costPrice,
      notes,
      isActive: true,
      variants: newVariants,
    };

    setProducts([newProd, ...products]);
    setIsModalOpen(false);
    showToast(`Added product '${name}' with ${newVariants.length} variants!`);
  };

  const handleExportCatalog = () => {
    const headers = ["Product Name", "Type", "Sales Price (₹)", "Cost Price (₹)", "Variant Count", "Status"];
    const rows = products.map((p) => [
      p.name,
      p.productType,
      p.salesPrice,
      p.costPrice,
      p.variants.length,
      p.isActive ? "Active" : "Inactive",
    ]);
    exportToCsv("brightloop_product_catalog.csv", headers, rows);
    showToast(`📁 Exported ${rows.length} catalog items to CSV!`);
  };

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.productType.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-8">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#FFD600] border-[2.5px] border-[#1D1E24] shadow-[4px_4px_0px_#1D1E24] px-4 py-2 font-headline text-[12px] font-black uppercase animate-in slide-in-from-bottom-2">
          {toastMessage}
        </div>
      )}

      {/* Top Banner - Comfortable Spacing */}
      <section className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white border-2 border-[#1D1E24] p-5 sm:p-6 shadow-[4px_4px_0px_#1D1E24]">
        <div className="flex items-center gap-3.5">
          <div className="w-14 h-14 bg-[#FFD600] border-2 border-[#1D1E24] flex items-center justify-center shadow-[3px_3px_0px_#1D1E24] shrink-0">
            <span className="material-symbols-outlined text-[32px] text-[#1D1E24] font-black">
              inventory_2
            </span>
          </div>
          <div>
            <h1 className="font-headline text-[22px] uppercase font-black text-[#1D1E24]">
              Product &amp; Variant Master Catalog
            </h1>
            <p className="text-[13px] text-[#606275] font-semibold mt-0.5">
              Manage base subscription offerings, modular add-ons, and brand variant surcharges
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <NeoButton
            variant="ghost"
            size="sm"
            icon="download"
            onClick={handleExportCatalog}
          >
            Export Catalog
          </NeoButton>
          <NeoButton
            variant="secondary"
            size="md"
            icon="add"
            onClick={() => setIsModalOpen(true)}
          >
            + Add New Product
          </NeoButton>
        </div>
      </section>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-[#FFF2DF] p-3 border-2 border-[#1D1E24] shadow-[3px_3px_0px_#1D1E24]">
        <div className="flex items-center gap-2">
          <span className="font-headline text-[11px] uppercase font-black text-[#1D1E24]">
            Catalog View:
          </span>
          <span className="px-2 py-0.5 bg-[#25F4D2] text-[#003D32] border border-[#1D1E24] font-headline text-[10px] uppercase font-black">
            All Offerings ({products.length})
          </span>
        </div>

        <div className="relative flex items-center w-full sm:w-64">
          <span className="material-symbols-outlined absolute left-2 text-[#1D1E24] text-[16px]">
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search products or variants..."
            className="w-full pl-7 pr-3 py-1 bg-white border border-[#1D1E24] text-[12px] font-bold shadow-[1.5px_1.5px_0px_#1D1E24] focus:outline-none"
          />
        </div>
      </div>

      {/* Product Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((prod) => (
          <WindowCard
            key={prod.id}
            title={prod.name}
            icon="inventory"
            badge={prod.productType}
            badgeColor="bg-[#25F4D2]"
          >
            <div className="flex flex-col justify-between h-full gap-4">
              <div>
                <div className="flex items-baseline justify-between mb-2">
                  <span className="font-headline text-[24px] font-black text-[#1D1E24]">
                    ₹{prod.salesPrice.toLocaleString()}
                  </span>
                  <span className="text-[11px] font-bold text-[#606275]">
                    Cost: ₹{prod.costPrice.toLocaleString()}
                  </span>
                </div>
                <p className="text-[12px] text-[#34363F] font-medium mb-3">
                  {prod.notes || "Standard subscription SKU for commercial deployments."}
                </p>

                {/* Variants List */}
                <div className="flex flex-col gap-1.5 pt-2 border-t-2 border-[#1D1E24]">
                  <span className="font-headline text-[10px] uppercase font-black text-[#5B5D68]">
                    Configured Variants ({prod.variants.length})
                  </span>
                  {prod.variants.map((v) => (
                    <div
                      key={v.id}
                      className="flex items-center justify-between p-1.5 bg-[#FFF0DC] border border-[#1D1E24] text-[11px]"
                    >
                      <span className="font-bold text-[#1D1E24]">{v.variantName}</span>
                      <span
                        className={`font-headline text-[10px] font-black px-1.5 py-0.2 border border-[#1D1E24] ${
                          v.additionalPrice > 0 ? "bg-[#FFD600] text-[#1D1E24]" : "bg-white"
                        }`}
                      >
                        {v.additionalPrice > 0 ? `+₹${v.additionalPrice}` : "Included"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-[#1D1E24]/20 font-headline text-[11px]">
                <span className="text-[#006b5b] font-bold">● Active in Catalog</span>
                <button
                  onClick={() => handleOpenEdit(prod)}
                  className="px-2.5 py-1 bg-[#FFD600] border border-[#1D1E24] font-black uppercase text-[10px] shadow-[1.5px_1.5px_0px_#1D1E24] hover:bg-[#FFE04D] active:translate-x-0.5 active:translate-y-0.5 transition-all"
                >
                  Edit SKU
                </button>
              </div>
            </div>
          </WindowCard>
        ))}
      </div>

      {/* Modal: Add Product */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create Product & Variant Offering"
        icon="add_box"
      >
        <form onSubmit={handleCreateProduct} className="flex flex-col gap-4">
          <div className="flex items-center gap-3 p-2.5 bg-[#FFF0DC] border-2 border-[#1D1E24]">
            <PennyMascot mood="dispatch" size="sm" />
            <p className="text-[12px] font-bold text-[#1D1E24]">
              &ldquo;Don&apos;t forget to include the Odoo Brand variant with the ₹560 surcharge!&rdquo;
            </p>
          </div>

          <div>
            <label className="block font-headline text-[11px] uppercase font-black text-[#1D1E24] mb-1">
              Product Name
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Brightloop Analytics Suite"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 bg-white border-2 border-[#1D1E24] font-bold text-[12px] shadow-[2px_2px_0px_#1D1E24] focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block font-headline text-[11px] uppercase font-black text-[#1D1E24] mb-1">
                Type
              </label>
              <select
                value={productType}
                onChange={(e) => setProductType(e.target.value)}
                className="w-full p-2 bg-white border-2 border-[#1D1E24] font-bold text-[12px] shadow-[2px_2px_0px_#1D1E24] focus:outline-none"
              >
                <option value="Software">Software</option>
                <option value="Add-on">Add-on</option>
                <option value="Service">Service</option>
                <option value="Hardware">Hardware</option>
              </select>
            </div>
            <div>
              <label className="block font-headline text-[11px] uppercase font-black text-[#1D1E24] mb-1">
                Sales Price (₹)
              </label>
              <input
                type="number"
                value={salesPrice}
                onChange={(e) => setSalesPrice(parseFloat(e.target.value) || 0)}
                className="w-full p-2 bg-white border-2 border-[#1D1E24] font-bold text-[12px] shadow-[2px_2px_0px_#1D1E24] focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-headline text-[11px] uppercase font-black text-[#1D1E24] mb-1">
                Cost Price (₹)
              </label>
              <input
                type="number"
                value={costPrice}
                onChange={(e) => setCostPrice(parseFloat(e.target.value) || 0)}
                className="w-full p-2 bg-white border-2 border-[#1D1E24] font-bold text-[12px] shadow-[2px_2px_0px_#1D1E24] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block font-headline text-[11px] uppercase font-black text-[#1D1E24] mb-1">
              Internal Notes / Description
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Enterprise SKU details..."
              className="w-full p-2 bg-white border-2 border-[#1D1E24] font-bold text-[12px] shadow-[2px_2px_0px_#1D1E24] focus:outline-none"
            />
          </div>

          <div className="p-3 bg-[#FFE170]/40 border-2 border-[#1D1E24] flex items-center justify-between">
            <div>
              <span className="font-headline text-[12px] uppercase font-black text-[#1D1E24] block">
                Include Odoo Brand Variant
              </span>
              <span className="text-[11px] text-[#606275]">
                Automatically adds the +₹560 surcharge option as required by the problem statement.
              </span>
            </div>
            <input
              type="checkbox"
              checked={hasOdooVariant}
              onChange={(e) => setHasOdooVariant(e.target.checked)}
              className="w-5 h-5 accent-[#00BFA0] border-2 border-[#1D1E24]"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t-2 border-[#1D1E24]">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 bg-[#FFF8EE] border-2 border-[#1D1E24] font-headline text-[11px] uppercase font-black shadow-[2px_2px_0px_#1D1E24]"
            >
              Cancel
            </button>
            <NeoButton variant="secondary" size="md" type="submit">
              Save Product &amp; Launch
            </NeoButton>
          </div>
        </form>
      </Modal>

      {/* Modal: Edit Product SKU */}
      <Modal
        isOpen={editingProduct !== null}
        onClose={() => setEditingProduct(null)}
        title={`Edit Offering: ${editingProduct?.name}`}
        icon="edit_note"
      >
        <form onSubmit={handleSaveEdit} className="flex flex-col gap-4">
          <div className="flex items-center gap-3 p-2.5 bg-[#FFF0DC] border-2 border-[#1D1E24]">
            <PennyMascot mood="dispatch" size="sm" />
            <p className="text-[12px] font-bold text-[#1D1E24]">
              &ldquo;Update catalog pricing and tier notes in real time!&rdquo;
            </p>
          </div>

          <div>
            <label className="block font-headline text-[11px] uppercase font-black text-[#1D1E24] mb-1">
              Product SKU Name
            </label>
            <input
              type="text"
              required
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              className="w-full p-2 bg-white border-2 border-[#1D1E24] font-bold text-[12px] shadow-[2px_2px_0px_#1D1E24] focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-headline text-[11px] uppercase font-black text-[#1D1E24] mb-1">
                Sales Price (₹)
              </label>
              <input
                type="number"
                required
                value={editSalesPrice}
                onChange={(e) => setEditSalesPrice(parseFloat(e.target.value) || 0)}
                className="w-full p-2 bg-white border-2 border-[#1D1E24] font-bold text-[12px] shadow-[2px_2px_0px_#1D1E24] focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-headline text-[11px] uppercase font-black text-[#1D1E24] mb-1">
                Cost Price (₹)
              </label>
              <input
                type="number"
                required
                value={editCostPrice}
                onChange={(e) => setEditCostPrice(parseFloat(e.target.value) || 0)}
                className="w-full p-2 bg-white border-2 border-[#1D1E24] font-bold text-[12px] shadow-[2px_2px_0px_#1D1E24] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block font-headline text-[11px] uppercase font-black text-[#1D1E24] mb-1">
              Tier Notes &amp; Capabilities
            </label>
            <textarea
              rows={2}
              value={editNotes}
              onChange={(e) => setEditNotes(e.target.value)}
              className="w-full p-2 bg-white border-2 border-[#1D1E24] font-bold text-[12px] shadow-[2px_2px_0px_#1D1E24] focus:outline-none"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t-2 border-[#1D1E24]">
            <button
              type="button"
              onClick={() => setEditingProduct(null)}
              className="px-4 py-2 bg-[#FFF8EE] border-2 border-[#1D1E24] font-headline text-[11px] uppercase font-black shadow-[2px_2px_0px_#1D1E24]"
            >
              Cancel
            </button>
            <NeoButton variant="secondary" size="md" type="submit">
              Update SKU
            </NeoButton>
          </div>
        </form>
      </Modal>
    </div>
  );
};
