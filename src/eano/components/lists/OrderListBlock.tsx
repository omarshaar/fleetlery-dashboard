"use client";

import { useRef, useEffect } from "react";
import { Card } from "@/components";
import { cn } from "@/eano/lib/utils";
import { BookOpen, Factory, Loader, Locate, Orbit, User } from "lucide-react";

export interface OrderListItem {
  id: string;
  title: string;
  status: string;
  manufacturer: string;
  country: string;
  user: string;
  category: string;
  progress: { current: number; total: number };
  updatedAt: string;
  avatars?: string[];
}

export interface OrderListBlockProps {
  items: OrderListItem[];
  isLoading?: boolean;
  onLoadMore?: () => void;
  className?: string;
}

export function OrderListBlock({
  items,
  onLoadMore,
  isLoading,
  className,
}: OrderListBlockProps) {
  const loaderRef = useRef<HTMLDivElement | null>(null);

  // Infinite scroll observer
  useEffect(() => {
    if (!onLoadMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) onLoadMore();
      },
      { threshold: 1 }
    );

    if (loaderRef.current) observer.observe(loaderRef.current);

    return () => observer.disconnect();
  }, [onLoadMore]);

  return (
    <div className={cn("space-y-3", className)}>
      {items.map((item) => (
        <Card
          key={item.id}
          className="p-4 py-2.5 rounded-md border hover:opacity-85 transition cursor-pointer gap-0!"
        >
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-lg">
              <span className="text-slate-500">#{item.id}</span>
              <span className="font-semibold">{item.title}</span>
            </div>

            <div className="text-blue-600 bg-blue-100 dark:bg-blue-900 dark:text-white px-3 py-1 rounded-full text-sm">
              {item.status}
            </div>
          </div>

          {/* Meta Info */}
          <div className="flex items-center gap-4 mt-2 text-sm text-slate-600 dark:text-white/60">
            { item.manufacturer && <span className="flex items-center gap-1.5"><Factory size={15} /> {item.manufacturer}</span> }
            { item.country && <span className="flex items-center gap-1.5"><Locate size={15} /> {item.country}</span> }
            { item.user && <span className="flex items-center gap-1.5"><User size={15} /> {item.user}</span> }
            { item.category && <span className="flex items-center gap-1.5"><BookOpen size={15} /> {item.category}</span >}
          </div>

          <hr className="my-3" />

          {/* Bottom Row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-white/60">
              <Orbit className="w-4 h-4 text-blue-500 dark:text-white/60" />
              <span>
                Pre-Production ({item.progress.current}/{item.progress.total})
              </span>
              <span className="text-emerald-800 dark:text-emerald-500 ml-2">
                updated {item.updatedAt}
              </span>
            </div>

            {/* Avatars */}
            <div className="flex">
              {item.avatars?.map((src, i) => (
                <img
                  key={i}
                  src={src}
                  className="-ml-2 w-8 h-8 rounded-full border border-white shadow"
                />
              ))}
            </div>
          </div>
        </Card>
      ))}

      {/* Infinite loader area */}
      <div ref={loaderRef} className="flex justify-center py-6">
        {isLoading && <Loader className="animate-spin h-6 w-6 text-slate-500" />}
      </div>
    </div>
  );
}
