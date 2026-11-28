import { useEffect, useState, type FormEvent } from "react";
import { ConfirmDialog } from "~/components/common/ConfirmDialog";
import { PersianDateTimePicker } from "~/components/common/PersianDateTimePicker";
import { localDateTimeToUtcIso, utcDateTimeToLocalInput } from "~/shared/utils/date-time";
import { discountCodeApi } from "../api/discount-code-api";
import type { DiscountCodeListOutput, DiscountCodeUpsertInput, PaymentMethod } from "../models/discount-code";

const inputClasses =
  "min-h-11 w-full rounded-xl border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 placeholder-gray-400 outline-none transition-colors focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 dark:border-gray-700 dark:bg-gray-950 dark:text-white dark:placeholder-gray-500";

const paymentMethods = [
  { value: "", label: "همه" },
  { value: "0", label: "نقدی" },
  { value: "1", label: "آنلاین" },
  { value: "2", label: "چک" },
];

const paymentMethodLabels: Record<number, string> = {
  0: "نقدی",
  1: "آنلاین",
  2: "چک",
};

function errorMessage(error: unknown) {
  return error instanceof Error ? error.message : "خطای غیرمنتظره‌ای رخ داد.";
}

interface FormState {
  code: string;
  maxDiscountAmount: string;
  discountPercentage: string;
  minimumPurchaseAmount: string;
  paymentMethod: string;
  expireAt: string;
  isActive: boolean;
}

const emptyForm: FormState = {
  code: "",
  maxDiscountAmount: "",
  discountPercentage: "",
  minimumPurchaseAmount: "",
  paymentMethod: "",
  expireAt: "",
  isActive: true,
};

function generateRandomCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789";
  let code = "";
  for (let i = 0; i < 6; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
}

export default function DiscountCodesPage() {
  const [codes, setCodes] = useState<DiscountCodeListOutput[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [detailLoading, setDetailLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [confirmData, setConfirmData] = useState<{
    title: string;
    message: string;
    onConfirm: () => void;
  } | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      setCodes(await discountCodeApi.list());
    } catch (caughtError) {
      setError(errorMessage(caughtError));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const setFormField = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((previous) => ({ ...previous, [key]: value }));
  };

  const setDiscountAmount = (value: string) => {
    if (value !== "" && form.discountPercentage !== "") {
      setFormError("امکان وارد کردن مبلغ و درصد تخفیف به‌صورت هم‌زمان وجود ندارد. یکی را خالی کنید.");
      return;
    }
    setFormError(null);
    setFormField("maxDiscountAmount", value);
  };

  const setDiscountPercentage = (value: string) => {
    if (value !== "" && form.maxDiscountAmount !== "") {
      setFormError("امکان وارد کردن مبلغ و درصد تخفیف به‌صورت هم‌زمان وجود ندارد. یکی را خالی کنید.");
      return;
    }
    if (value !== "" && Number(value) > 100) {
      setFormError("درصد تخفیف نمی‌تواند بیشتر از ۱۰۰ باشد.");
      return;
    }
    setFormError(null);
    setFormField("discountPercentage", value);
  };

  const resetModal = () => {
    setModalOpen(false);
    setEditingId(null);
    setForm(emptyForm);
    setFormError(null);
    setDetailLoading(false);
  };

  const closeModal = () => {
    if (!saving) resetModal();
  };

  const openModal = (item?: DiscountCodeListOutput) => {
    setFormError(null);
    setModalOpen(true);
    if (!item) {
      setEditingId(null);
      setForm(emptyForm);
      return;
    }

    setEditingId(item.id);
    setDetailLoading(true);
    void discountCodeApi.get(item.id)
      .then((detail) => {
        const expireAtLocal = utcDateTimeToLocalInput(detail.expireAt);
        setForm({
          code: detail.code,
          maxDiscountAmount: detail.maxDiscountAmount != null ? String(detail.maxDiscountAmount) : "",
          discountPercentage: detail.discountPercentage != null ? String(detail.discountPercentage) : "",
          minimumPurchaseAmount: String(detail.minimumPurchaseAmount),
          paymentMethod: detail.paymentMethod != null ? String(detail.paymentMethod) : "",
          expireAt: expireAtLocal,
          isActive: detail.isActive,
        });
        if (detail.expireAt && !expireAtLocal) {
          setFormError("تاریخ انقضای دریافت‌شده از سرور معتبر نیست.");
        }
      })
      .catch((caughtError: unknown) => setFormError(errorMessage(caughtError)))
      .finally(() => setDetailLoading(false));
  };

  const validateForm = () => {
    const amount = Number(form.maxDiscountAmount);
    const percentage = Number(form.discountPercentage);
    const minimumPurchase = Number(form.minimumPurchaseAmount);
    if (!form.code.trim()) return "کد تخفیف را وارد کنید.";

    const hasAmount = form.maxDiscountAmount !== "";
    const hasPercentage = form.discountPercentage !== "";
    if (hasAmount === hasPercentage) return "فقط یکی از مبلغ تخفیف یا درصد تخفیف را وارد کنید.";
    if (hasAmount && (!Number.isFinite(amount) || amount <= 0)) return "مبلغ تخفیف باید بیشتر از صفر باشد.";
    if (hasPercentage && (!Number.isFinite(percentage) || percentage <= 0 || percentage > 100)) {
      return "درصد تخفیف باید بیشتر از صفر و حداکثر ۱۰۰ باشد.";
    }
    if (!Number.isFinite(minimumPurchase) || minimumPurchase < 0) {
      return "حداقل مبلغ خرید نمی‌تواند منفی باشد.";
    }
    if (form.expireAt && !localDateTimeToUtcIso(form.expireAt)) return "تاریخ انقضا معتبر نیست.";
    return null;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const validationError = validateForm();
    if (validationError) {
      setFormError(validationError);
      return;
    }

    const payload: DiscountCodeUpsertInput = {
      code: form.code.trim(),
      maxDiscountAmount: form.maxDiscountAmount !== "" ? Number(form.maxDiscountAmount) : null,
      discountPercentage: form.discountPercentage !== "" ? Number(form.discountPercentage) : null,
      minimumPurchaseAmount: Number(form.minimumPurchaseAmount),
      paymentMethod: form.paymentMethod !== "" ? (Number(form.paymentMethod) as PaymentMethod) : null,
      expireAt: localDateTimeToUtcIso(form.expireAt),
      isActive: form.isActive,
    };

    setSaving(true);
    setFormError(null);
    try {
      if (editingId) await discountCodeApi.update(editingId, payload);
      else await discountCodeApi.create(payload);
      resetModal();
      await load();
    } catch (caughtError) {
      setFormError(errorMessage(caughtError));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await discountCodeApi.remove(id);
      await load();
    } catch (caughtError) {
      setError(errorMessage(caughtError));
    }
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">کدهای تخفیف</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">ایجاد و مدیریت کدهای تخفیف عمومی.</p>
        </div>
        <button onClick={() => openModal()} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-primary-600 px-5 text-sm font-semibold text-white transition-colors hover:bg-primary-700">
          <span className="material-symbols-outlined text-xl">add</span>
          کد تخفیف جدید
        </button>
      </div>

      {error && (
        <div role="alert" className="flex items-center justify-between gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-300">
          <span>{error}</span>
          <button onClick={() => void load()} className="font-semibold">تلاش مجدد</button>
        </div>
      )}

      {loading ? (
        <div className="rounded-xl border border-gray-200 bg-white py-16 text-center text-sm text-gray-500 dark:border-gray-800 dark:bg-gray-900">در حال بارگذاری کدهای تخفیف...</div>
      ) : codes.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-300 bg-white py-16 text-center dark:border-gray-700 dark:bg-gray-900">
          <span className="material-symbols-outlined text-5xl text-gray-300 dark:text-gray-600">local_offer</span>
          <p className="mt-3 text-sm text-gray-500">هنوز کد تخفیفی وجود ندارد.</p>
          <button onClick={() => openModal()} className="mt-5 min-h-11 rounded-xl bg-primary-600 px-5 text-sm font-semibold text-white hover:bg-primary-700">ایجاد کد تخفیف</button>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
          <div className="hidden border-b border-gray-200 bg-gray-50 px-6 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:border-gray-800 dark:bg-gray-800/50 dark:text-gray-400 lg:grid lg:grid-cols-[1fr_160px_120px_100px] lg:gap-4">
            <span>کد</span>
            <span className="text-center">مقدار تخفیف</span>
            <span className="text-center">وضعیت</span>
            <span className="text-center">عملیات</span>
          </div>
          <ul className="divide-y divide-gray-200 dark:divide-gray-800">
            {codes.map((item) => (
              <li key={item.id} className="flex flex-col gap-3 p-4 lg:grid lg:grid-cols-[1fr_160px_120px_100px] lg:items-center lg:gap-4 lg:px-6">
                <div className="min-w-0">
                  <p className="truncate font-medium text-gray-900 dark:text-white">{item.code}</p>
                  <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                    {paymentMethodLabels[item.paymentMethod ?? -1] ?? "همه روش‌ها"}
                    {` · حداقل خرید ${item.minimumPurchaseAmount.toLocaleString("fa-IR")} تومان`}
                  </p>
                </div>
                <p className="flex justify-between text-sm font-semibold text-primary-600 dark:text-primary-400 lg:block lg:text-center"><span className="font-normal text-gray-400 lg:hidden">مقدار تخفیف</span><span>{item.discountPercentage != null ? `${item.discountPercentage.toLocaleString("fa-IR")} درصد` : `${item.maxDiscountAmount!.toLocaleString("fa-IR")} تومان`}</span></p>
                <div className="flex items-center justify-between lg:justify-center">
                  <span className="text-sm text-gray-400 lg:hidden">وضعیت</span>
                  <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${item.isActive ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300" : "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400"}`}>
                    <span className={`size-1.5 rounded-full ${item.isActive ? "bg-emerald-500" : "bg-gray-400"}`} />
                    {item.isActive ? "فعال" : "غیرفعال"}
                  </span>
                </div>
                <div className="flex items-center justify-center gap-1">
                  <button onClick={() => openModal(item)} className="flex size-10 items-center justify-center rounded-lg text-gray-500 transition-colors hover:bg-primary-50 hover:text-primary-600 dark:hover:bg-primary-950/40 dark:hover:text-primary-400" title="ویرایش"><span className="material-symbols-outlined text-xl">edit</span></button>
                  <button onClick={() => setConfirmData({ title: "حذف کد تخفیف", message: `آیا از حذف کد «${item.code}» اطمینان دارید؟`, onConfirm: async () => { setConfirmData(null); await handleDelete(item.id); } })} className="flex size-10 items-center justify-center rounded-lg text-gray-500 transition-colors hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/30" title="حذف"><span className="material-symbols-outlined text-xl">delete</span></button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-gray-950/60 p-0 backdrop-blur-sm sm:items-center sm:p-6" role="dialog" aria-modal="true" onMouseDown={closeModal}>
          <div onMouseDown={(event) => event.stopPropagation()} className="flex h-dvh max-h-dvh w-full max-w-3xl flex-col overflow-hidden border border-gray-200 bg-white shadow-2xl dark:border-gray-800 dark:bg-gray-900 sm:h-auto sm:max-h-[90dvh] sm:rounded-3xl">
            <header className="flex items-start justify-between border-b border-gray-200 px-5 py-4 dark:border-gray-800 sm:px-7 sm:py-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-primary-600 dark:text-primary-400">{editingId ? "ویرایش کد تخفیف" : "کد تخفیف جدید"}</p>
                <h2 className="mt-1 text-xl font-semibold text-gray-950 dark:text-white">{editingId ? `ویرایش ${form.code || "کد تخفیف"}` : "ایجاد کد تخفیف"}</h2>
              </div>
              <button type="button" onClick={closeModal} className="flex size-11 items-center justify-center rounded-xl text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-white" aria-label="بستن"><span className="material-symbols-outlined">close</span></button>
            </header>

            <form onSubmit={(event) => void handleSubmit(event)} className="flex min-h-0 flex-1 flex-col">
              <div className="overflow-y-auto px-5 py-6 sm:px-7 sm:py-7">
                {formError && <div className="mb-5 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-300" role="alert"><span className="material-symbols-outlined text-[20px]">error</span><span>{formError}</span></div>}
                {detailLoading ? (
                  <div className="py-16 text-center text-sm text-gray-500"><span className="material-symbols-outlined animate-spin">progress_activity</span><p className="mt-2">در حال بارگذاری...</p></div>
                ) : (
                  <>
                    <h3 className="text-lg font-semibold text-gray-950 dark:text-white">جزئیات کد تخفیف</h3>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">اطلاعات کد تخفیف عمومی را وارد کنید.</p>
                    <div className="mt-6 grid gap-5 sm:grid-cols-2">
                      <label className="sm:col-span-2">
                        <span className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">کد تخفیف <span className="text-red-500">*</span></span>
                        <div className="flex gap-2"><input value={form.code} onChange={(event) => setFormField("code", event.target.value)} placeholder="مثال: SUMMER20" dir="ltr" className={inputClasses} required /><button type="button" onClick={() => setFormField("code", generateRandomCode())} className="inline-flex min-h-11 shrink-0 items-center justify-center rounded-xl border border-gray-300 bg-gray-50 px-3 text-gray-700 hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300" title="تولید کد تصادفی"><span className="material-symbols-outlined text-xl">casino</span></button></div>
                      </label>
                      <label><span className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">مبلغ تخفیف (تومان)</span><input type="number" min={1} value={form.maxDiscountAmount} onChange={(event) => setDiscountAmount(event.target.value)} placeholder="مثال: ۲۰۰۰۰۰" className={inputClasses} /></label>
                      <label><span className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">درصد تخفیف</span><input type="number" min={0.01} max={100} step="0.01" value={form.discountPercentage} onChange={(event) => setDiscountPercentage(event.target.value)} placeholder="مثال: ۱۰" className={inputClasses} /></label>
                      <label><span className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">حداقل مبلغ خرید (تومان) <span className="text-red-500">*</span></span><input type="number" min={0} value={form.minimumPurchaseAmount} onChange={(event) => setFormField("minimumPurchaseAmount", event.target.value)} placeholder="مثال: ۱۰۰۰۰۰۰" className={inputClasses} required /></label>
                      <label><span className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">روش پرداخت</span><select value={form.paymentMethod} onChange={(event) => setFormField("paymentMethod", event.target.value)} className={inputClasses}>{paymentMethods.map((method) => <option key={method.value} value={method.value}>{method.label}</option>)}</select></label>
                      <label><span className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">تاریخ انقضا</span><PersianDateTimePicker mode="datetime" value={form.expireAt} onChange={(value) => setFormField("expireAt", value)} className={inputClasses} ariaLabel="تاریخ انقضا" /></label>
                      <label className="flex cursor-pointer items-center gap-3 sm:col-span-2"><input type="checkbox" checked={form.isActive} onChange={(event) => setFormField("isActive", event.target.checked)} className="size-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500" /><span className="text-sm font-medium text-gray-700 dark:text-gray-300">فعال</span></label>
                    </div>
                  </>
                )}
              </div>
              <footer className="mt-auto flex items-center justify-between gap-3 border-t border-gray-200 bg-gray-50 px-5 py-4 dark:border-gray-800 dark:bg-gray-900 sm:px-7">
                <button type="button" onClick={closeModal} className="min-h-11 rounded-xl px-4 text-sm font-medium text-gray-600 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-800">لغو</button>
                <button type="submit" disabled={saving || detailLoading} className="flex min-h-11 items-center gap-2 rounded-xl bg-primary-600 px-5 text-sm font-semibold text-white hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-50">{saving && <span className="material-symbols-outlined animate-spin text-[19px]">progress_activity</span>}{saving ? "در حال ذخیره..." : "ذخیره"}</button>
              </footer>
            </form>
          </div>
        </div>
      )}

      <ConfirmDialog open={confirmData !== null} title={confirmData?.title ?? ""} message={confirmData?.message ?? ""} onConfirm={() => confirmData?.onConfirm()} onCancel={() => setConfirmData(null)} />
    </div>
  );
}
