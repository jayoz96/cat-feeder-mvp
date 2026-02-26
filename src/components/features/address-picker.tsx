"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { MapPin, Loader2 } from "lucide-react";

interface AddressTip {
  id: string;
  name: string;
  district: string;
  address: string;
}

interface AddressPickerProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function AddressPicker({ value, onChange, placeholder = "搜索地址..." }: AddressPickerProps) {
  const [query, setQuery] = useState(value);
  const [tips, setTips] = useState<AddressTip[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  // 点击外部关闭下拉
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const searchAddress = useCallback(async (keyword: string) => {
    if (!keyword.trim()) {
      setTips([]);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(
        `https://restapi.amap.com/v3/assistant/inputtips?keywords=${encodeURIComponent(keyword)}&city=南京&datatype=all&key=your_amap_key`
      );
      const data = await res.json();
      if (data.status === "1" && Array.isArray(data.tips)) {
        setTips(
          data.tips
            .filter((t: { id: string; name: string }) => t.id && t.name)
            .slice(0, 8)
            .map((t: { id: string; name: string; district?: string; address?: string }) => ({
              id: t.id,
              name: t.name,
              district: t.district || "",
              address: t.address || "",
            }))
        );
        setOpen(true);
      }
    } catch {
      // API 不可用时降级为手动输入
      setTips([]);
    } finally {
      setLoading(false);
    }
  }, []);

  function handleInputChange(val: string) {
    setQuery(val);
    onChange(val);

    // debounce 300ms
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => searchAddress(val), 300);
  }

  function handleSelect(tip: AddressTip) {
    const fullAddress = tip.district + tip.address + tip.name;
    setQuery(fullAddress);
    onChange(fullAddress);
    setOpen(false);
    setTips([]);
  }

  return (
    <div ref={wrapperRef} className="relative">
      <div className="relative">
        <Input
          placeholder={placeholder}
          value={query}
          onChange={(e) => handleInputChange(e.target.value)}
          onFocus={() => tips.length > 0 && setOpen(true)}
        />
        {loading && (
          <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
        )}
      </div>

      {open && tips.length > 0 && (
        <ul className="absolute z-50 mt-1 w-full rounded-md border bg-popover shadow-md max-h-60 overflow-auto">
          {tips.map((tip) => (
            <li
              key={tip.id}
              className="flex items-start gap-2 px-3 py-2 cursor-pointer hover:bg-accent text-sm"
              onClick={() => handleSelect(tip)}
            >
              <MapPin className="h-4 w-4 mt-0.5 shrink-0 text-muted-foreground" />
              <div>
                <p className="font-medium">{tip.name}</p>
                <p className="text-xs text-muted-foreground">{tip.district}{tip.address}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
