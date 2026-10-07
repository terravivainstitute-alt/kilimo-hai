"use client";

import { Suspense, useEffect, useState, type FormEvent } from "react";
import { useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useLanguage, pick } from "@/lib/LanguageContext";
import type { Service } from "@/types/content";

function BookingForm() {
  const { lang, t } = useLanguage();
  const searchParams = useSearchParams();
  const preselectedSlug = searchParams.get("service");

  const [services, setServices] = useState<Service[]>([]);
  const [form, setForm] = useState({
    farmer_name: "",
    phone: "",
    region: "",
    district: "",
    farm_size_acres: "",
    crop: "",
    service_id: "",
    package_name: "",
    notes: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from("services")
        .select("*")
        .eq("is_active", true)
        .order("sort_order");
      if (data) {
        setServices(data as Service[]);
        const match = (data as Service[]).find((s) => s.slug === preselectedSlug);
        if (match) {
          setForm((f) => ({ ...f, service_id: match.id }));
        }
      }
    }
    load();
  }, [preselectedSlug]);

  const selectedService = services.find((s) => s.id === form.service_id);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setStatus("idle");

    const { error } = await supabase.from("bookings").insert({
      farmer_name: form.farmer_name,
      phone: form.phone,
      region: form.region || null,
      district: form.district || null,
      farm_size_acres: form.farm_size_acres ? Number(form.farm_size_acres) : null,
      crop: form.crop || null,
      service_id: form.service_id || null,
      package_name: form.package_name || null,
      notes: form.notes || null,
    });

    if (error) {
      setStatus("error");
    } else {
      setStatus("success");
      setForm({
        farmer_name: "",
        phone: "",
        region: "",
        district: "",
        farm_size_acres: "",
        crop: "",
        service_id: "",
        package_name: "",
        notes: "",
      });
    }
    setSubmitting(false);
  }

  return (
    <div className="mx-auto max-w-2xl px-6 py-16">
      <h1 className="font-[family-name:var(--font-display)] text-4xl font-semibold text-forest-dark">
        {t.booking.title}
      </h1>

      <form onSubmit={handleSubmit} className="mt-10 space-y-8">
        <fieldset className="space-y-4">
          <legend className="text-sm font-semibold uppercase tracking-wide text-forest">
            {t.booking.step1}
          </legend>
          <Field
            label={t.booking.name}
            required
            value={form.farmer_name}
            onChange={(v) => setForm({ ...form, farmer_name: v })}
          />
          <Field
            label={t.booking.phone}
            required
            type="tel"
            value={form.phone}
            onChange={(v) => setForm({ ...form, phone: v })}
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              label={t.booking.region}
              value={form.region}
              onChange={(v) => setForm({ ...form, region: v })}
            />
            <Field
              label={t.booking.district}
              value={form.district}
              onChange={(v) => setForm({ ...form, district: v })}
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              label={t.booking.farmSize}
              type="number"
              value={form.farm_size_acres}
              onChange={(v) => setForm({ ...form, farm_size_acres: v })}
            />
            <Field
              label={t.booking.crop}
              value={form.crop}
              onChange={(v) => setForm({ ...form, crop: v })}
            />
          </div>
        </fieldset>

        <fieldset className="space-y-4">
          <legend className="text-sm font-semibold uppercase tracking-wide text-forest">
            {t.booking.step2}
          </legend>
          <label className="block text-sm font-medium text-ink/80">
            {t.booking.service}
            <select
              value={form.service_id}
              onChange={(e) => setForm({ ...form, service_id: e.target.value })}
              className="mt-1 w-full rounded-md border border-forest-dark/20 bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-forest/40"
            >
              <option value="">—</option>
              {services.map((s) => (
                <option key={s.id} value={s.id}>
                  {pick(lang, s.name)}
                </option>
              ))}
            </select>
          </label>

          {selectedService && selectedService.packages?.length > 0 && (
            <label className="block text-sm font-medium text-ink/80">
              {t.booking.package}
              <select
                value={form.package_name}
                onChange={(e) => setForm({ ...form, package_name: e.target.value })}
                className="mt-1 w-full rounded-md border border-forest-dark/20 bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-forest/40"
              >
                <option value="">—</option>
                {selectedService.packages.map((p, i) => (
                  <option key={i} value={pick(lang, p.name)}>
                    {pick(lang, p.name)}
                  </option>
                ))}
              </select>
            </label>
          )}
        </fieldset>

        <fieldset className="space-y-4">
          <legend className="text-sm font-semibold uppercase tracking-wide text-forest">
            {t.booking.step3}
          </legend>
          <label className="block text-sm font-medium text-ink/80">
            {t.booking.notes}
            <textarea
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              rows={4}
              className="mt-1 w-full rounded-md border border-forest-dark/20 bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-forest/40"
            />
          </label>
        </fieldset>

        <button
          type="submit"
          disabled={submitting}
          className="rounded-full bg-forest px-8 py-3 text-sm font-medium text-cream transition hover:bg-forest-dark disabled:opacity-60"
        >
          {submitting ? t.booking.submitting : t.booking.submit}
        </button>

        {status === "success" && (
          <p className="rounded-md bg-leaf-light/40 px-4 py-3 text-sm text-forest-dark">
            {t.booking.success}
          </p>
        )}
        {status === "error" && (
          <p className="rounded-md bg-red-50 px-4 py-3 text-sm text-red-700">
            {t.booking.error}
          </p>
        )}
      </form>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  required = false,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="block text-sm font-medium text-ink/80">
      {label}
      <input
        type={type}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-md border border-forest-dark/20 bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-forest/40"
      />
    </label>
  );
}

export default function BookingPage() {
  return (
    <Suspense fallback={null}>
      <BookingForm />
    </Suspense>
  );
}
