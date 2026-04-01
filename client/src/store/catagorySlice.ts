import { BASE_URL } from "@/base_url/base_url";
import type { Catagory, CatagoryResponse } from "@/types";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";




export const catagorySlice = createApi({
    reducerPath: "cataGoryApi",
    baseQuery: fetchBaseQuery({ baseUrl: `${BASE_URL}/api/category`, credentials: "include" }),
    tagTypes: ["Catagory"],
    endpoints: (builder) => ({
        createCatagory: builder.mutation<any, FormData>({
            query: (formData) => ({
                url: "/create",
                method: "POST",
                body: formData
            }),
            invalidatesTags: ["Catagory"],
        }),
        getAllCatagory: builder.query<Catagory[], void>({
            query: () => "/all",
            transformResponse: (res: CatagoryResponse) => res.catagory,
            providesTags: ["Catagory"]
        }),
        getProductsByCategory: builder.query<any, string>({
            query: (id) => `/product/${id}`,
            transformResponse: (res: any) => res.products,
            providesTags: ["Catagory"]
        }),
        updatedCatagory: builder.mutation<Catagory, { id: string; formData: FormData }>({
            query: ({ id, formData }) => ({
                url: `update/${id}`,
                method: "PUT",
                body: formData
            }),
            invalidatesTags: ["Catagory"]
        }),
        deleteCatagory: builder.mutation<{ message: string }, { id: string }>({
            query: ({ id }) => ({
                url: `/delete/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Catagory"]
        })
    })
})

export const { useCreateCatagoryMutation, useGetProductsByCategoryQuery, useGetAllCatagoryQuery, useUpdatedCatagoryMutation, useDeleteCatagoryMutation } = catagorySlice