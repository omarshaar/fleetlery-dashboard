/**
 * ACCESS CONTROL CONFIG
 * ---------------------
 * المطوّر المسؤول عن ربط الـ Backend يعدّل هذا الملف فقط.
 *
 * الهدف:
 * - تحديد كيف وأين يتم جلب permissions للمستخدم الحالي.
 * - ممكن يرجعها من API أو من LocalStorage أو من Mock أثناء التطوير.
 */

export const accessControlConfig = {
  // هنا يقوم المطور بتحديد طريقة جلب الصلاحيات
  getPermissions: async () => {
    // Example:
    // return ["view.Product", "edit.Product", "delete.Product"];
    
    return [
        "view.Product", 
        "edit.Product", 
        "delete.Product"
    ];
  },
};
