"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Navigation } from "lucide-react";

function getMapUrls(address: string) {
  const encoded = encodeURIComponent(address);
  return [
    {
      name: "高德地图",
      url: `https://uri.amap.com/marker?address=${encoded}&src=cat-feeder-app`,
    },
    {
      name: "百度地图",
      url: `https://api.map.baidu.com/marker?address=${encoded}&output=html&src=cat-feeder-app`,
    },
    {
      name: "腾讯地图",
      url: `https://apis.map.qq.com/uri/v1/search?keyword=${encoded}`,
    },
  ];
}

export function NavButton({ address }: { address: string }) {
  const [open, setOpen] = useState(false);
  const maps = getMapUrls(address);

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        className="gap-1.5"
        onClick={() => setOpen(true)}
      >
        <Navigation className="h-3.5 w-3.5" />
        导航
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-xs">
          <DialogHeader>
            <DialogTitle>选择导航应用</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            {maps.map((map) => (
              <a
                key={map.name}
                href={map.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
                onClick={() => setOpen(false)}
              >
                <Button variant="outline" className="w-full">
                  {map.name}
                </Button>
              </a>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
