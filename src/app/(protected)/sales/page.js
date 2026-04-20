"use client";

import { useMemo, useRef, useState } from "react";
import { Check, Edit, Minus, Plus, Printer, Search, ShoppingCart, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { useApp } from "@/context/app-context";
import { Badge, Button, Card, EmptyState, Input, Select, TableShell } from "@/components/ui";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { createPlaceholderImage } from "@/lib/storage";

function makeItem(product) {
  return {
    id: `${product.id}-${Date.now()}`,
    productId: product.id,
    productName: product.name,
    vegetableName: product.name,
    qty: 1,
    price: product.pricePerKg,
    total: product.pricePerKg,
    image: product.image,
    unit: product.unit,
  };
}

function EmptySection({ title, description }) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-200 p-4 text-sm text-slate-500 dark:border-slate-800 dark:text-slate-400">
      <p className="font-medium text-slate-900 dark:text-slate-50">{title}</p>
      <p className="mt-1">{description}</p>
    </div>
  );
}

export default function SalesPage() {
  const { products, sales, addSale, updateSale, removeSale, formatCurrency, t } = useApp();
  const [bill, setBill] = useState({
    date: new Date().toISOString().slice(0, 10),
    customerName: "",
    items: [],
  });
  const [productSearch, setProductSearch] = useState("");
  const [billSearch, setBillSearch] = useState("");
  const [sortBy, setSortBy] = useState("date-desc");
  const [lastBill, setLastBill] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [editingSaleId, setEditingSaleId] = useState(null);
  const printRef = useRef(null);

  const subtotal = useMemo(
    () => bill.items.reduce((sum, item) => sum + Number(item.qty || 0) * Number(item.price || 0), 0),
    [bill.items]
  );

  const filteredProducts = useMemo(() => {
    const term = productSearch.trim().toLowerCase();
    return products
      .filter((item) => item.active)
      .filter((item) => {
        if (!term) return true;
        return (
          item.name.toLowerCase().includes(term) ||
          item.category.toLowerCase().includes(term) ||
          item.unit.toLowerCase().includes(term)
        );
      });
  }, [products, productSearch]);

  const selectedIds = useMemo(() => new Set(bill.items.map((item) => item.productId)), [bill.items]);
  const selectedEntries = useMemo(
    () =>
      bill.items
        .map((item) => ({
          item,
          product: products.find((entry) => entry.id === item.productId),
        }))
        .filter(({ item, product }) => item && (product || item.productId)),
    [bill.items, products]
  );

  const filteredSales = useMemo(() => {
    let list = [...sales].filter((sale) => {
      const term = billSearch.trim().toLowerCase();
      if (!term) return true;
      return (
        sale.customerName.toLowerCase().includes(term) ||
        sale.date.includes(term) ||
        sale.items.some((item) => item.productName.toLowerCase().includes(term))
      );
    });

    list = list.sort((a, b) => {
      switch (sortBy) {
        case "date-asc":
          return a.date.localeCompare(b.date);
        case "date-desc":
          return b.date.localeCompare(a.date);
        case "total-asc":
          return a.grandTotal - b.grandTotal;
        case "total-desc":
          return b.grandTotal - a.grandTotal;
        default:
          return 0;
      }
    });

    return list;
  }, [sales, billSearch, sortBy]);

  const availableProducts = useMemo(
    () => filteredProducts.filter((product) => !selectedIds.has(product.id)),
    [filteredProducts, selectedIds]
  );

  const toggleProduct = (product) => {
    setBill((current) => {
      const exists = current.items.find((item) => item.productId === product.id);
      if (exists) {
        return {
          ...current,
          items: current.items.filter((item) => item.productId !== product.id),
        };
      }

      return {
        ...current,
        items: [makeItem(product), ...current.items],
      };
    });
  };

  const updateItem = (id, field, value) => {
    setBill((current) => ({
      ...current,
      items: current.items.map((item) =>
        item.id === id
          ? {
              ...item,
              [field]: value,
              total:
                field === "qty" || field === "price"
                  ? Number(field === "qty" ? value : item.qty) * Number(field === "price" ? value : item.price)
                  : item.total,
            }
          : item
      ),
    }));
  };

  const addQuantity = (id, delta) => {
    setBill((current) => ({
      ...current,
      items: current.items.map((item) =>
        item.id === id
          ? {
              ...item,
              qty: Math.max(0.1, Number(item.qty || 0) + delta),
              total: Math.max(0.1, Number(item.qty || 0) + delta) * Number(item.price || 0),
            }
          : item
      ),
    }));
  };

  const saveBill = (event) => {
    event.preventDefault();

    const hasValidItem = bill.items.some(
      (item) => item.productId && Number(item.qty) > 0 && Number(item.price) > 0
    );

    if (!hasValidItem) {
      toast.error(t("tapProductCardToAddAtLeastOneItem"));
      return;
    }

    const payload = {
      date: bill.date,
      customerName: bill.customerName,
      items: bill.items,
    };

    const result = editingSaleId ? updateSale(editingSaleId, payload) : addSale(payload);

    setLastBill(result);
    setBill({
      date: new Date().toISOString().slice(0, 10),
      customerName: "",
      items: [],
    });
    setEditingSaleId(null);
    toast.success(t("billSavedSuccessfully"));
    setIsCartOpen(false);
  };

  const openBillForEdit = (sale) => {
    setLastBill(sale);
    setEditingSaleId(sale.id);
    setBill({
      date: sale.date,
      customerName: sale.customerName || "",
      items: sale.items.map((item) => ({
        ...item,
        total: Number(item.qty || 0) * Number(item.price || 0),
      })),
    });
    setIsCartOpen(true);
  };

  const openBillForPrint = (sale) => {
    setLastBill(sale);
    setBill({
      date: sale.date,
      customerName: sale.customerName || "",
      items: sale.items.map((item) => ({
        ...item,
        total: Number(item.qty || 0) * Number(item.price || 0),
      })),
    });
    setIsCartOpen(true);
  };

  const handleDelete = (id) => {
    setDeleteTarget(sales.find((item) => item.id === id) || null);
  };

  const confirmDelete = () => {
    if (!deleteTarget) {
      return;
    }

    removeSale(deleteTarget.id);
    if (lastBill?.id === deleteTarget.id) {
      setLastBill(null);
    }
    setDeleteTarget(null);
    toast.success(t("billDeleted"));
  };

  const printBill = () => {
    window.print();
  };

  const previewBill = lastBill || {
    date: bill.date,
    customerName: bill.customerName,
    items: bill.items,
    grandTotal: subtotal,
  };

  const selectedCount = bill.items.length;

  return (
    <div className="space-y-6 pb-20">
      <Card className="space-y-5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-semibold">{t("productGrid")}</h3>
          </div>
          <button
            type="button"
            onClick={() => setIsCartOpen(true)}
            className="inline-flex items-center gap-2 rounded-xl border border-emerald-100 bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-950 shadow-sm transition hover:border-emerald-200 hover:bg-emerald-100 hover:shadow-md dark:border-emerald-900/40 dark:bg-emerald-950/30 dark:text-emerald-100 dark:hover:bg-emerald-950/50"
          >
            <ShoppingCart className="h-4 w-4 text-emerald-600" />
            <span>Cart</span>
            <Badge variant="success" className="ml-1">
              {selectedCount}
            </Badge>
          </button>
        </div>

        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            className="pl-10"
            value={productSearch}
            onChange={(e) => setProductSearch(e.target.value)}
            placeholder={t("search")}
          />
        </div>

        <div className="grid grid-cols-4 gap-2 md:hidden">
          {filteredProducts.length === 0 ? (
            <div className="col-span-4">
              <EmptySection title={t("noData")} description={t("searchProductNameOrCategory")} />
            </div>
          ) : (
            filteredProducts.map((product) => {
              const selected = bill.items.some((item) => item.productId === product.id);

              return (
                <button
                  key={product.id}
                  type="button"
                  onClick={() => toggleProduct(product)}
                  aria-label={product.name}
                  className={`relative aspect-square overflow-hidden rounded-2xl border transition ${
                    selected
                      ? "border-black-forest-500 bg-dark-emerald-50 shadow-soft dark:border-black-forest-500 dark:bg-black-forest-950/40"
                      : "border-slate-200 bg-white hover:border-black-forest-300 dark:border-slate-800 dark:bg-slate-900"
                  }`}
                >
                  <img
                    src={product.image || createPlaceholderImage(product.name)}
                    alt={product.name}
                    className="h-full w-full object-cover"
                  />
                  {selected ? (
                    <span className="absolute right-1.5 top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-black-forest-700 text-white">
                      <Check className="h-3.5 w-3.5" />
                    </span>
                  ) : null}
                </button>
              );
            })
          )}
        </div>

        <div className="hidden gap-4 md:grid md:grid-cols-2 xl:grid-cols-3">
          {filteredProducts.length === 0 ? (
            <div className="col-span-full">
              <EmptySection title={t("noData")} description={t("searchProductNameOrCategory")} />
            </div>
          ) : (
            filteredProducts.map((product) => {
              const selected = bill.items.some((item) => item.productId === product.id);
              return (
                <button
                  key={product.id}
                  type="button"
                  onClick={() => toggleProduct(product)}
                className={`group rounded-2xl border p-3 text-left transition ${
                  selected
                    ? "border-black-forest-500 bg-dark-emerald-50 shadow-soft dark:border-black-forest-500 dark:bg-black-forest-950/40"
                    : "border-slate-200 bg-white hover:border-black-forest-300 hover:shadow-soft dark:border-slate-800 dark:bg-slate-900"
                }`}
              >
                  <div className="relative mb-3 aspect-square overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-800">
                    <img
                      src={product.image || createPlaceholderImage(product.name)}
                      alt={product.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="truncate text-sm font-semibold">{product.name}</p>
                      {selected ? <Check className="h-4 w-4 flex-none text-black-forest-600" /> : null}
                    </div>
                    <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                      {product.category || t("general")} Â· {product.unit}
                    </p>
                    <p className="mt-1 text-sm font-semibold">{formatCurrency(product.pricePerKg)}</p>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </Card>

      <Card className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="flex-1">
            <label className="mb-2 block text-sm font-medium">{t("searchBills")}</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                className="pl-10"
                value={billSearch}
                onChange={(e) => setBillSearch(e.target.value)}
                placeholder={t("customerOrItemOrDate")}
              />
            </div>
          </div>
          <div className="sm:w-44">
            <label className="mb-2 block text-sm font-medium">{t("sort")}</label>
            <Select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="date-desc">{t("newestFirst")}</option>
              <option value="date-asc">{t("oldestFirst")}</option>
              <option value="total-desc">{t("highestTotal")}</option>
              <option value="total-asc">{t("lowestTotal")}</option>
            </Select>
          </div>
        </div>

        {filteredSales.length === 0 ? (
          <EmptySection title={t("noBillsFound")} description={t("createAndSaveBill")} />
        ) : (
          <TableShell>
            <table className="min-w-max w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-slate-50 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                <tr>
                  <th className="px-4 py-3 font-medium">{t("date")}</th>
                  <th className="px-4 py-3 font-medium">{t("customer")}</th>
                  <th className="px-4 py-3 font-medium">{t("products")}</th>
                  <th className="px-4 py-3 font-medium">{t("total")}</th>
                  <th className="px-4 py-3 font-medium">{t("actions")}</th>
                </tr>
              </thead>
              <tbody>
                {filteredSales.map((sale) => (
                  <tr
                    key={sale.id}
                    role="button"
                    tabIndex={0}
                    onClick={() => openBillForEdit(sale)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        openBillForEdit(sale);
                      }
                    }}
                    className="cursor-pointer border-t border-slate-200 align-top transition hover:bg-slate-50 focus:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/40 dark:focus:bg-slate-800/40"
                  >
                    <td className="px-4 py-3">{sale.date}</td>
                    <td className="px-4 py-3">{sale.customerName || t("walkInCustomer")}</td>
                    <td className="px-4 py-3 max-w-[240px] whitespace-normal break-words">
                      <div className="flex flex-wrap gap-2">
                        {sale.items.map((item) => (
                          <Badge key={item.id}>{item.productName}</Badge>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3 font-semibold">{formatCurrency(sale.grandTotal)}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2" onClick={(event) => event.stopPropagation()}>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => openBillForEdit(sale)}
                          aria-label={t("edit")}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => {
                            openBillForPrint(sale);
                            setTimeout(() => window.print(), 250);
                          }}
                          aria-label={t("print")}
                        >
                          <Printer className="h-4 w-4" />
                        </Button>
                        <Button variant="danger" size="sm" onClick={() => handleDelete(sale.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </TableShell>
        )}
      </Card>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title={`${t("deleteBill")} ${deleteTarget?.date || t("bill")}?`}
        description={t("deleteBillDesc")}
        confirmLabel={t("deleteBill")}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />

      {isCartOpen ? (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/60 px-3 py-3 backdrop-blur-sm md:items-center md:px-6">
          <div className="flex max-h-[92vh] w-full max-w-6xl flex-col overflow-hidden rounded-3xl border border-dark-emerald-100 bg-white shadow-2xl dark:border-black-forest-900/40 dark:bg-slate-900">
            <div className="flex items-start justify-between gap-4 border-b border-slate-200 p-4 dark:border-slate-800">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-black-forest-600 dark:text-dark-emerald-300">
                  {t("cartDrawer")}
                </p>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50">
                  {selectedCount} {t("selected")}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsCartOpen(false)}
                className="rounded-xl p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-slate-50"
                aria-label={t("deleteDialogClose")}
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              <div className="grid gap-4">
                <Card className="space-y-4 border-slate-200 bg-slate-50/70 dark:border-slate-800 dark:bg-slate-950/40">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <h4 className="text-sm font-semibold">{t("allProducts")}</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{t("tapCardToAdd")}</p>
                    </div>
                    <Badge variant="success">{availableProducts.length}</Badge>
                  </div>

                  <div className="grid grid-cols-4 gap-2">
                    {availableProducts.length === 0 ? (
                      <div className="col-span-4">
                        <EmptySection title={t("allGood")} description={t("selected")} />
                      </div>
                    ) : (
                      availableProducts.map((product) => (
                        <button
                          key={product.id}
                          type="button"
                          onClick={() => toggleProduct(product)}
                          className="relative aspect-square overflow-hidden rounded-2xl border border-slate-200 bg-white transition hover:border-black-forest-400 dark:border-slate-800 dark:bg-slate-950"
                          aria-label={product.name}
                        >
                          <img
                            src={product.image || createPlaceholderImage(product.name)}
                            alt={product.name}
                            className="h-full w-full object-cover"
                          />
                          <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-2 pb-2 pt-6 text-[10px] font-semibold text-white">
                            {product.name}
                          </span>
                        </button>
                      ))
                    )}
                  </div>
                </Card>

                <div className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
                  <Card className="space-y-4 border-slate-200 bg-slate-50/70 dark:border-slate-800 dark:bg-slate-950/40">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-semibold">{t("selected")}</h4>
                      <Badge variant="success">{selectedEntries.length}</Badge>
                    </div>

                    <div className="grid gap-3">
                      {selectedEntries.length === 0 ? (
                        <EmptySection title={t("noData")} description={t("tapProductCardToAddAtLeastOneItem")} />
                      ) : (
                        selectedEntries.map(({ item, product }) => (
                          <Card key={item.id} className="space-y-3 border-slate-200 bg-white p-3 shadow-none dark:border-slate-800 dark:bg-slate-900">
                            <div className="flex items-start gap-3">
                              <img
                                src={item.image || product?.image || createPlaceholderImage(item.productName)}
                                alt={item.productName}
                                className="h-14 w-14 rounded-xl object-cover"
                              />
                              <div className="min-w-0 flex-1">
                                <div className="flex items-start justify-between gap-3">
                                  <div className="min-w-0">
                                    <p className="truncate font-medium">{item.productName}</p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">
                                      {product?.category || t("general")} · {item.unit}
                                    </p>
                                  </div>
                                  <Button
                                    variant="danger"
                                    size="sm"
                                    type="button"
                                    onClick={() => {
                                      if (product) {
                                        toggleProduct(product);
                                        return;
                                      }

                                      setBill((current) => ({
                                        ...current,
                                        items: current.items.filter((entry) => entry.id !== item.id),
                                      }));
                                    }}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            </div>

                            <div className="grid grid-cols-3 gap-2">
                              <div>
                                <label className="mb-2 block text-xs font-medium text-slate-500">{t("quantity")}</label>
                                <div className="flex items-center overflow-hidden rounded-xl border border-dark-emerald-100 bg-white shadow-sm dark:border-black-forest-900/60 dark:bg-slate-950">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    type="button"
                                    className="h-11 w-11 rounded-none border-r border-dark-emerald-100 px-0 dark:border-black-forest-900/60"
                                    onClick={() => addQuantity(item.id, -1)}
                                    disabled={Number(item.qty || 0) <= 0.1}
                                    aria-label="Decrease quantity"
                                  >
                                    <Minus className="h-4 w-4" />
                                  </Button>
                                  <Input
                                    type="number"
                                    min="0"
                                    step="0.1"
                                    value={item.qty}
                                    onChange={(e) => updateItem(item.id, "qty", e.target.value)}
                                    className="h-11 rounded-none border-0 bg-transparent px-0 text-center shadow-none focus:ring-0"
                                  />
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    type="button"
                                    className="h-11 w-11 rounded-none border-l border-dark-emerald-100 px-0 dark:border-black-forest-900/60"
                                    onClick={() => addQuantity(item.id, 1)}
                                    aria-label="Increase quantity"
                                  >
                                    <Plus className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                              <div>
                                <label className="mb-2 block text-xs font-medium text-slate-500">{t("price")}</label>
                                <Input
                                  type="number"
                                  min="0"
                                  step="0.01"
                                  value={item.price}
                                  onChange={(e) => updateItem(item.id, "price", e.target.value)}
                                />
                              </div>
                              <div>
                                <label className="mb-2 block text-xs font-medium text-slate-500">{t("total")}</label>
                                <Input value={formatCurrency(Number(item.qty || 0) * Number(item.price || 0))} readOnly />
                              </div>
                            </div>
                          </Card>
                        ))
                      )}
                    </div>
                  </Card>

                  <div className="space-y-4">
                    <div
                      ref={printRef}
                      className="space-y-4 rounded-2xl border border-slate-200 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-950/40"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="text-xs uppercase tracking-[0.25em] text-slate-500">{t("printableBill")}</p>
                          <h4 className="text-lg font-semibold">{t("receipt")}</h4>
                        </div>
                        <Button variant="secondary" size="sm" onClick={printBill}>
                          <Printer className="h-4 w-4" />
                          {t("print")}
                        </Button>
                      </div>

                      <div className="grid gap-3 sm:grid-cols-2">
                        <div>
                          <label className="mb-2 block text-sm font-medium">{t("date")}</label>
                          <Input
                            type="date"
                            value={bill.date}
                            onChange={(e) => setBill({ ...bill, date: e.target.value })}
                          />
                        </div>
                        <div>
                          <label className="mb-2 block text-sm font-medium">{t("customerName")}</label>
                          <Input
                            value={bill.customerName}
                            onChange={(e) => setBill({ ...bill, customerName: e.target.value })}
                            placeholder={t("optional")}
                          />
                        </div>
                      </div>

                      <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900">
                        <div className="space-y-2 text-sm">
                          {previewBill.items.length === 0 ? (
                            <p className="text-sm text-slate-500">{t("selectProductsToPreviewBill")}</p>
                          ) : (
                            previewBill.items.map((item) => (
                              <div key={item.id} className="flex items-center justify-between gap-3">
                                <span className="min-w-0 truncate">
                                  {item.productName} x {item.qty}
                                </span>
                                <span className="shrink-0">{formatCurrency(Number(item.qty || 0) * Number(item.price || 0))}</span>
                              </div>
                            ))
                          )}
                        </div>

                        <div className="mt-3 flex items-center justify-between border-t border-dashed border-slate-200 pt-3 text-base font-semibold dark:border-slate-800">
                          <span>{t("grandTotal")}</span>
                          <span>{formatCurrency(previewBill.grandTotal || 0)}</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-[1fr_auto] items-center gap-3">
                        <Button type="button" size="lg" className="w-full" onClick={saveBill}>
                          <Plus className="h-4 w-4" />
                          {t("generateBill")}
                        </Button>
                        <Button
                          type="button"
                          variant="secondary"
                          size="lg"
                          className="whitespace-nowrap px-5"
                          onClick={() => {
                            setBill({
                              date: new Date().toISOString().slice(0, 10),
                              customerName: "",
                              items: [],
                            });
                            setEditingSaleId(null);
                          }}
                        >
                          {t("clear")}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

