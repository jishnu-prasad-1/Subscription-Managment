"use client";

import React, { useState } from "react";
import { WindowCard } from "@/components/ui/WindowCard";
import { NeoButton } from "@/components/ui/NeoButton";
import { Modal } from "@/components/ui/Modal";
import { PennyMascot } from "@/components/mascot/PennyMascot";

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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form State
  const [name, setName] = useState("");
  const [productType, setProductType] = useState("Software");
  const [salesPrice, setSalesPrice] = useState(1500);
  const [costPrice, setCostPrice] = useState(300);
  const [notes, setNotes] = useState("");
  const [hasOdooVariant, setHasOdooVariant] = useState(true);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
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

  return (
    <div className="flex flex-col gap-6">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#FFD600] border-[2.5px] border-[#1D1E24] shadow-[4px_4px_0px_#1D1E24] px-4 py-2 font-headline text-[12px] font-black uppercase animate-in slide-in-from-bottom-2">
          {toastMessage}
        </div>
      )}

      {/* Top Banner */}
      <section className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white border-2 border-[#1D1E24] p-4 shadow-[4px_4px_0px_#1D1E24]">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-[#FFD600] border-2 border-[#1D1E24] flex items-center justify-center shadow-[3px_3px_0px_#1D1E24]">
            <span className="material-symbols-outlined text-[28px] text-[#1D1E24] font-black">
              inventory_2
            </span>
          </div>
          <div>
            <h1 className="font-headline text-[20px] uppercase font-black text-[#1D1E24]">
              Product &amp; Variant Master Catalog
            </h1>
            <p className="text-[12px] text-[#606275] font-semibold">
              Manage base subscription offerings, modular add-ons, and brand variant surcharges
            </p>
          </div>
        </div>

        <NeoButton
          variant="secondary"
          size="md"
          icon="add"
          onClick={() => setIsModalOpen(true)}
        >
          + Add New Product
        </NeoButton>
      </section>

      {/* Product Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((prod) => (
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
                    ${prod.salesPrice.toLocaleString()}
                  </span>
                  <span className="text-[11px] font-bold text-[#606275]">
                    Cost: ${prod.costPrice.toLocaleString()}
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
                        {v.additionalPrice > 0 ? `+₹${v.additionalPrice} / +$${v.additionalPrice}` : "Included"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-[#1D1E24]/20 font-headline text-[11px]">
                <span className="text-[#006b5b] font-bold">● Active in Catalog</span>
                <button
                  onClick={() => showToast(`Opening editor for ${prod.name}...`)}
                  className="px-2 py-0.5 bg-[#FFF8EE] border border-[#1D1E24] font-black uppercase shadow-[1px_1px_0px_#1D1E24] hover:bg-[#FFD600]"
                >
                  Edit
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
              placeholder="e.g. BrightDesk Analytics Suite"
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
                Sales Price ($)
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
                Cost Price ($)
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
    </div>
  );
};

