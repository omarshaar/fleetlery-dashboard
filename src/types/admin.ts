import type { PaginationMeta } from "@/types/driver"
import type { DriverStatus } from "@/types/driver"
export type DriverStatusEvent={id:string;from_status:DriverStatus|null;to_status:DriverStatus;reason:string|null;changed_by:{id:string;name:string}|null;created_at:string}
export type AuditEvent={id:string;event:string;subject_type:string|null;subject_id:string|null;request_id:string|null;ip_address:string|null;old_values:Record<string,unknown>|null;new_values:Record<string,unknown>|null;metadata:Record<string,unknown>|null;created_at:string;actor:{id:string;name:string;email:string}|null}
export type AuditList={data:AuditEvent[];meta:PaginationMeta}
