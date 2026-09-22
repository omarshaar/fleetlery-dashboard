import { useLanguage } from "@/i18n/hooks";

export type DataEmptyStateProps = {
  text?: string;
};

export function DataEmptyState({ text }: DataEmptyStateProps) {
  const { t } = useLanguage();

  return (
    <div className="h-96 w-full flex justify-center items-center text-muted-foreground">
      {text ??
        t("system.state.empty", {
          ns: "components",
          defaultValue: "No data to display.",
        })}
    </div>
  );
}
