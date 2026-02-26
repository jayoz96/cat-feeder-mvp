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

// 内置地址库，无 API key 时用于本地模糊搜索
const LOCAL_ADDRESSES: AddressTip[] = [
  { id: "l-1", name: "万达广场", district: "南京市江宁区", address: "东山街道" },
  { id: "l-2", name: "百家湖花园", district: "南京市江宁区", address: "百家湖街道" },
  { id: "l-3", name: "翠屏山小区", district: "南京市江宁区", address: "东山街道" },
  { id: "l-4", name: "金轮新都汇", district: "南京市江宁区", address: "义乌小商品城旁" },
  { id: "l-5", name: "九龙湖国际企业总部园", district: "南京市江宁区", address: "九龙湖街道" },
  { id: "l-6", name: "21世纪假日花园", district: "南京市江宁区", address: "东山街道" },
  { id: "l-7", name: "景枫KINGMO", district: "南京市江宁区", address: "百家湖街道" },
  { id: "l-8", name: "文鼎广场", district: "南京市江宁区", address: "大学城" },
  { id: "l-9", name: "东山总部商务园", district: "南京市江宁区", address: "东山街道" },
  { id: "l-10", name: "河定桥地铁站", district: "南京市江宁区", address: "双龙大道" },
  { id: "l-11", name: "同曦鸣城", district: "南京市江宁区", address: "东山街道" },
  { id: "l-12", name: "托乐嘉花园", district: "南京市江宁区", address: "科学园街道" },
  { id: "l-13", name: "仙林大学城", district: "南京市栖霞区", address: "仙林街道" },
  { id: "l-14", name: "新街口", district: "南京市秦淮区", address: "中山南路" },
  { id: "l-15", name: "河西万达广场", district: "南京市建邺区", address: "江东中路" },
  { id: "l-16", name: "南京南站", district: "南京市雨花台区", address: "玉兰路" },
];

function localSearch(keyword: string): AddressTip[] {
  const kw = keyword.toLowerCase();
  return LOCAL_ADDRESSES.filter(
    (a) =>
      a.name.toLowerCase().includes(kw) ||
      a.district.includes(kw) ||
      a.address.includes(kw)
  ).slice(0, 8);
}

interface AddressPickerProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const AMAP_KEY = process.env.NEXT_PUBLIC_AMAP_KEY;

export function AddressPicker({ value, onChange, placeholder = "搜索地址..." }: AddressPickerProps) {
  const [query, setQuery] = useState(value);
  const [tips, setTips] = useState<AddressTip[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

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

    // 有高德 key 走远程 API，否则走本地模糊搜索
    if (AMAP_KEY) {
      setLoading(true);
      try {
        const res = await fetch(
          `https://restapi.amap.com/v3/assistant/inputtips?keywords=${encodeURIComponent(keyword)}&city=南京&datatype=all&key=${AMAP_KEY}`
        );
        const data = await res.json();
        if (data.status === "1" && Array.isArray(data.tips)) {
          const results = data.tips
            .filter((t: { id: string; name: string }) => t.id && t.name)
            .slice(0, 8)
            .map((t: { id: string; name: string; district?: string; address?: string }) => ({
              id: t.id,
              name: t.name,
              district: t.district || "",
              address: t.address || "",
            }));
          setTips(results);
          setOpen(results.length > 0);
          return;
        }
      } catch {
        // 远程失败，降级到本地搜索
      } finally {
        setLoading(false);
      }
    }

    // 本地模糊搜索
    const results = localSearch(keyword);
    setTips(results);
    setOpen(results.length > 0);
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
