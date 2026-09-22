// src/eano/access-control/core/types.ts

export type Action = string;     // example: "view", "edit", "delete"
export type Subject = string;    // example: "Product", "Order"

export type PermissionString = `${Action}.${Subject}`;
