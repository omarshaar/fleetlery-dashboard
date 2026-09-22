import { useAbilityFromContext } from "@/eano/access-control";
import { Can } from "@/eano/access-control";

export default function TestPermissionAnyPage() {
  const ability = useAbilityFromContext();
  const hasSpecial = ability.can("special", "Test");
  const hasAdmin = ability.can("admin", "Test");

  const any = hasSpecial || hasAdmin;
  

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Test: Permission ANY (OR)</h1>

      <p className="text-muted-foreground">
        يكفي امتلاك <b>واحدة</b> من الصلاحيات التالية لدخول الصفحة:
      </p>

      <ul className="list-disc list-inside">
        <li>special.Test</li>
        <li>admin.Test</li>
      </ul>

      <div
        className={`p-4 rounded-md border ${
          any ? "bg-green-100 border-green-400" : "bg-red-100 border-red-400"
        }`}
      >
        {any ? (
          <p className="text-green-700">لديك واحدة من الصلاحيات 🎉</p>
        ) : (
          <p className="text-red-700">لا تمتلك أي صلاحية من المطلوبة ❌</p>
        )}
      </div>

      <Can I="special" a="Test">
        <div className="p-3 mt-3 rounded bg-blue-200 text-blue-900">
          عنصر يظهر لو عندك: special.Test
        </div>
      </Can>

      <Can I="admin" a="Test">
        <div className="p-3 mt-3 rounded bg-purple-200 text-purple-900">
          عنصر يظهر لو عندك: admin.Test
        </div>
      </Can>
    </div>
  );
}
