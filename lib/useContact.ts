"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { ContactContent } from "@/types/content";

export const DEFAULT_CONTACT: ContactContent = {
  phone: "+255 000 000 000",
  whatsapp: "255000000000",
  email: "info@kilimohai.co.tz",
  location: { sw: "Tanzania", en: "Tanzania" },
};

export function useContact() {
  const [contact, setContact] = useState<ContactContent>(DEFAULT_CONTACT);

  useEffect(() => {
    supabase
      .from("site_content")
      .select("content")
      .eq("key", "contact")
      .maybeSingle()
      .then(({ data }) => {
        if (data?.content) {
          setContact({ ...DEFAULT_CONTACT, ...(data.content as ContactContent) });
        }
      });
  }, []);

  return contact;
}
