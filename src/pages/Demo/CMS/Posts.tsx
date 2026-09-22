import { Page } from "@/eano/components/page/Page";
import PageHeader from "@/eano/components/widgets/PageHeader";
import { useLanguage } from "@/i18n/hooks";
import { ContentArticleCard } from "@/eano/components/cards/ContentArticleCard";
import { Input } from "@/eano/design-system/shadcn/input";
import { Button } from "@/eano/design-system/shadcn/button";
import { Badge } from "@/eano/design-system/shadcn/badge";
import { useMemo, useState } from "react";

import postsMock from "./mock.data/posts.mock.json";

type PostMockItem = {
  title: string;
  subtitle: string;
  tag: string;
  primaryValue: number;
  primaryLabel: string;
  secondaryValue: number;
  secondaryLabel: string;
  editedAt: string;
  createdAt: string;
  imageUrl: string;
};

export default function PostsPage() {
  const { t } = useLanguage();
  const [query, setQuery] = useState("");

  const items = postsMock as PostMockItem[];

  const filteredItems = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;

    return items.filter((item) => {
      return (
        item.title.toLowerCase().includes(q) ||
        item.subtitle.toLowerCase().includes(q) ||
        item.tag.toLowerCase().includes(q)
      );
    });
  }, [items, query]);

  return (
    <Page>
      <PageHeader
        title={t("navigation.posts")}
        subtitle={t("cms.posts.pageSubtitle")}
      />

      <div className="mt-4 flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
          <div className="w-full sm:max-w-md">
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t("cms.posts.searchPlaceholder")}
            />
          </div>

          <div className="flex items-center gap-2 justify-between sm:justify-end">
            <Badge variant="secondary">
              {t("cms.posts.results", { count: filteredItems.length })}
            </Badge>

            {query && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setQuery("")}
              >
                {t("cms.posts.clear")}
              </Button>
            )}
          </div>
        </div>

        {filteredItems.length === 0 ? (
          <div className="w-full rounded-lg border bg-card text-card-foreground p-6">
            <div className="text-sm text-muted-foreground">
              {t("cms.posts.empty")}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-3">
            {filteredItems.map((item) => (
              <ContentArticleCard
                key={`${item.title}-${item.createdAt}`}
                data={{
                  title: item.title,
                  description: item.subtitle,
                  category: item.tag,
                  date: item.editedAt,
                  imageUrl: item.imageUrl,
                  readingTime: `${item.primaryValue} ${item.primaryLabel} • ${item.secondaryValue} ${item.secondaryLabel}`,
                }}
                onClick={() => console.log("Post:", item.title)}
              />
            ))}
          </div>
        )}
      </div>
    </Page>
  );
}
