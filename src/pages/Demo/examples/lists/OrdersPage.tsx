import { useState } from "react";
import { OrderListBlock, type OrderListItem } from "@/components";

export default function OrdersPage() {
    const [items, setItems] = useState<OrderListItem[]>([]);
    const [loading, setLoading] = useState(false);

    const loadMore = async () => {
        if (loading) return;

        setLoading(true);

        // Simulate API
        await new Promise((r) => setTimeout(r, 1200));

        const more = [
            {
                id: "80149",
                title: "Summer Linen Jacket SS22",
                status: "In progress",
                manufacturer: "Bozkurt Konfeksiyon San A.S.",
                country: "Turkey",
                user: "Stephanie Carvalho",
                category: "Jackets & coats",
                progress: { current: 2, total: 11 },
                updatedAt: "4d ago",
                avatars: [
                    "https://i.pravatar.cc/150?img=1",
                    "https://i.pravatar.cc/150?img=2",
                    "https://i.pravatar.cc/150?img=3",
                ],
            },
            {
                id: "80149",
                title: "Summer Linen Jacket SS22",
                status: "In progress",
                manufacturer: "Bozkurt Konfeksiyon San A.S.",
                country: "Turkey",
                user: "Stephanie Carvalho",
                category: "Jackets & coats",
                progress: { current: 2, total: 11 },
                updatedAt: "4d ago",
                avatars: [
                    "https://i.pravatar.cc/150?img=1",
                    "https://i.pravatar.cc/150?img=2",
                    "https://i.pravatar.cc/150?img=3",
                ],
            },
            {
                id: "80149",
                title: "Summer Linen Jacket SS22",
                status: "In progress",
                manufacturer: "Bozkurt Konfeksiyon San A.S.",
                country: "Turkey",
                user: "Stephanie Carvalho",
                category: "Jackets & coats",
                progress: { current: 2, total: 11 },
                updatedAt: "4d ago",
                avatars: [
                    "https://i.pravatar.cc/150?img=1",
                    "https://i.pravatar.cc/150?img=2",
                    "https://i.pravatar.cc/150?img=3",
                ],
            },
        ];

        setItems((prev) => [...prev, ...more]);
        setLoading(false);
    };

    return (
        <div>
            <OrderListBlock items={items} onLoadMore={loadMore} isLoading={loading} />
        </div>
    );
}
