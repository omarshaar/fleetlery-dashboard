import { Can } from "@/eano/access-control";

export default function TestPermissionPage() {

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Test: Single Permission</h1>
      <p className="text-muted-foreground">
        هذه الصفحة تتطلب الصلاحية: <b>view.Test</b>
      </p>

      <div className="p-4 rounded-md border bg-card">
        <Can I="view" a="Test">
          <div className="p-3 rounded bg-green-200 text-green-900">
            لديك صلاحية <b>view.Test</b> — العنصر ظاهر 🎉
          </div>
        </Can>

        <Can I="edit" a="Test">
          <div className="p-3 mt-3 rounded bg-blue-200 text-blue-900">
            لديك صلاحية <b>edit.Test</b>
          </div>
        </Can>
      </div>
    </div>
  );
}
