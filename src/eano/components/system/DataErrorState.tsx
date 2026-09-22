import { useLanguage } from "@/i18n/hooks";

export type DataErrorStateProps = {
  text?: string;
};

export function DataErrorState({ text }: DataErrorStateProps) {
  const { t } = useLanguage();

  return (
    <div className="h-96 w-full flex justify-center items-center text-red-600">
      {text ??
        t("system.state.error", {
          ns: "components",
          defaultValue: "Something went wrong.",
        })}
    </div>
  );
}
