import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { IOrderResponse, IUserOrderResponse, Order } from "@/types";
import { BASE_URL } from "@/base_url/base_url";

export const orderSlice = createApi({
  reducerPath: "order",
  baseQuery: fetchBaseQuery({
    baseUrl: `${BASE_URL}/api/order`,
    credentials: "include",
  }),
  endpoints: (builder) => ({
    getAllOrder: builder.query<IOrderResponse, void>({
      query: () => "/all",
    }),
    getUserOrder: builder.query<Order[], void>({
      query: () => "/userOrder",
      transformResponse:(res:IUserOrderResponse)=>res.orders
    }),
  }),
});

export const { useGetAllOrderQuery,useGetUserOrderQuery } = orderSlice;