import { Can } from "@/eano/access-control";
import { useAbilityFromContext } from "@/eano/access-control";

export default function TestPermissionAllPage() {
  const ability = useAbilityFromContext();
  const hasView = ability.can("view", "Test");
  const hasEdit = ability.can("edit", "Test");

  const all = hasView && hasEdit;

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Test: Permission ALL (AND)</h1>

      <p className="text-muted-foreground">
        يجب امتلاك الصلاحيات التالية لدخول الصفحة:
      </p>

      <ul className="list-disc list-inside">
        <li>view.Test</li>
        <li>edit.Test</li>
      </ul>

      <div
        className={`p-4 rounded-md border ${
          all ? "bg-green-100 border-green-400" : "bg-red-100 border-red-400"
        }`}
      >
        {all ? (
          <p className="text-green-700">لديك كل الصلاحيات المطلوبة 🎉</p>
        ) : (
          <p className="text-red-700">لا تمتلك جميع الصلاحيات المطلوبة ❌</p>
        )}
      </div>

      <Can I="view" a="Test">
        <div className="p-3 mt-3 rounded bg-blue-200 text-blue-900">
          عنصر يظهر لو عندك: view.Test
        </div>
      </Can>

      <Can I="edit" a="Test">
        <div className="p-3 mt-3 rounded bg-purple-200 text-purple-900">
          عنصر يظهر لو عندك: edit.Test
        </div>
      </Can>
    </div>
  );
}
