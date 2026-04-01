import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { IOrderResponse, Order } from "@/types";
import { BASE_URL } from "@/base_url/base_url";

export const orderSlice = createApi({
  reducerPath: "order",
  baseQuery: fetchBaseQuery({
    baseUrl: `${BASE_URL}/api/order`,
    credentials: "include",
  }),
  endpoints: (builder) => ({
    getAllOrder: builder.query<Order[], void>({
      query: () => "/all",
    }),
    getUserOrder: builder.query<Order[], void>({
      query: () => "/all",
      transformResponse:(res:IOrderResponse)=>res.orders
    }),
  }),
});

export const { useGetAllOrderQuery,useGetUserOrderQuery } = orderSlice;