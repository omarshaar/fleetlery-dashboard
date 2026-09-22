import { eanoApi } from "@/services/api/eanoApi"
import type { Driver, DriverStatus, PaginationMeta } from "@/types/driver"
import type { AuditEvent, AuditList, DriverStatusEvent } from "@/types/admin"
import type { CityOption } from "@/types/dashboard"
type Wrapped<T>={data:T;meta?:PaginationMeta}
export const adminApi=eanoApi.injectEndpoints({endpoints:(builder)=>({
 getDriverStatusHistory:builder.query<DriverStatusEvent[],string>({query:(id)=>`/drivers/${id}/status-history`,transformResponse:(r:Wrapped<DriverStatusEvent[]>)=>r.data,providesTags:(_r,_e,id)=>[{type:"DriverStatusHistory",id}]}),
 transitionDriverStatus:builder.mutation<Driver,{id:string;status:DriverStatus;reason:string|null;version:number}>({query:({id,...body})=>({url:`/drivers/${id}/status-transitions`,method:"POST",body}),transformResponse:(r:Wrapped<Driver>)=>r.data,invalidatesTags:(_r,_e,{id})=>[{type:"Drivers",id},{type:"Drivers",id:"LIST"},{type:"DriverStatusHistory",id},"Dashboard"]}),
 getAdminCities:builder.query<CityOption[],boolean>({query:(include)=>({url:"/cities",params:{include_inactive:include?1:0}}),transformResponse:(r:Wrapped<CityOption[]>)=>r.data,providesTags:["Cities"]}),
 createCity:builder.mutation<CityOption,{name:string}>({query:(body)=>({url:"/cities",method:"POST",body}),transformResponse:(r:Wrapped<CityOption>)=>r.data,invalidatesTags:["Cities","DriverCities","Dashboard"]}),
 updateCity:builder.mutation<CityOption,{id:string;name:string}>({query:({id,...body})=>({url:`/cities/${id}`,method:"PATCH",body}),transformResponse:(r:Wrapped<CityOption>)=>r.data,invalidatesTags:["Cities","DriverCities","Dashboard"]}),
 setCityStatus:builder.mutation<CityOption,{id:string;is_active:boolean}>({query:({id,...body})=>({url:`/cities/${id}/status`,method:"PATCH",body}),transformResponse:(r:Wrapped<CityOption>)=>r.data,invalidatesTags:["Cities","DriverCities","Dashboard"]}),
 getAuditEvents:builder.query<AuditList,{page:number;event?:string}>({query:(params)=>({url:"/admin/audit-events",params:{...params,per_page:20}}),transformResponse:(r:Wrapped<AuditEvent[]>)=>({data:r.data,meta:r.meta??{current_page:1,per_page:20,total:r.data.length,last_page:1}}),providesTags:["AuditEvents"]}),
})})
export const {useGetDriverStatusHistoryQuery,useTransitionDriverStatusMutation,useGetAdminCitiesQuery,useCreateCityMutation,useUpdateCityMutation,useSetCityStatusMutation,useGetAuditEventsQuery}=adminApi
