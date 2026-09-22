/**
 * CardsShowcasePage
 * ----------------------
 * A showcase page for various card components.
 * Displays all card variations used in the EANO system.
 */

import { ProductGridItem } from "@/eano/components/cards/ProductGridItem";
import { ContentCard } from "@/eano/components/cards/ContentCard";
import { ContentArticleCard } from "@/eano/components/cards/ContentArticleCard";
import { CouponsDiscountsCard } from "@/eano/components/cards/CouponsDiscountsCard";

export default function CardsShowcasePage() {
  return (
    <div className="w-full">
      <h2 className="text-2xl font-semibold mb-2">Cards Showcase</h2>

      <div className="flex flex-wrap gap-6">
        {/* ------------------------------------
            ProductGridItem (Example)
        ------------------------------------ */}
        <div className=" h-max w-64">
          <ProductGridItem
            item={{
              id: "1",
              name: "Product Card Example",
              subtitle: "256 GB | 512 GB",
              imageUrl:
                "https://images.unsplash.com/photo-1585314614250-d213876625e1?q=80&w=2428&auto=format&fit=crop",
              price: 2304,
              oldPrice: 2500,
              rating: 5,
              soldCount: 3500,
              colors: [
                { id: "c1", hex: "#111827" },
                { id: "c2", hex: "#f97316" },
                { id: "c3", hex: "#facc15" },
              ],
            }}
          />
        </div>

        {/* ------------------------------------
            ContentCard (New Example)
        ------------------------------------ */}
        <div className=" h-max w-64">
          <ContentCard
            data={{
              title: "Codex Court Decisions",
              subtitle: "Court decisions overview",
              tag: "COURT",
              primaryValue: 7,
              primaryLabel: "Docs",
              secondaryValue: 2507,
              secondaryLabel: "Annotations",
              editedAt: "18 Jun 2019",
              createdAt: "25 Jul 2019",
              imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQrGW-6l0_Lee5BLjweDiNWFxsTeIVp6y9cTQ&s",
            }}
          />
        </div>

        {/* ------------------------------------
            ContentArticleCard (New Example)
        ------------------------------------ */}
        <div className=" h-max w-72">
          <ContentArticleCard
            data={{
              author: "William Ashford",
              readingTime: "5 min read",
              title: "Optimizing Business decisions with Advanced Data Analytics",
              description: "Discover how data-driven solutions are reshaping industries.",
              category: "Data Science",
              date: "Mar 09, 2024",
              // imageUrl: "https://media.licdn.com/dms/image/v2/D5612AQGVr7E6sDMoEQ/article-cover_image-shrink_600_2000/article-cover_image-shrink_600_2000/0/1731479272970?e=2147483647&v=beta&t=IpZWvF35qSKfXgTDrTRp9K9YbF-fHWzi-A9AuzkMkWc",
            }}
            showImagePlaceholder
          />
        </div>

        {/* ------------------------------------
            CouponsDiscountsCard (New Example)
        ------------------------------------ */}
        <div className="h-max w-[380px] max-w-full">
          <CouponsDiscountsCard
            data={{
              title: "Coupons / Discounts",
              subtitle: "Track promo performance at a glance.",
              code: "SAVE15",
              discountLabel: "15% off",
              scopeLabel: "Orders over $50",
              startsAt: "Feb 03, 2026",
              expiresAt: "Feb 28, 2026",
              usedCount: 72,
              maxUses: 200,
              status: "active",
            }}
            onManageClick={() => undefined}
            onCopyCode={() => undefined}
          />
        </div>

      </div>
    </div>
  );
}
