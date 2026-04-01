import { BASE_URL } from "@/base_url/base_url";
import type { IProduct, IproductResponse, ProductResponse, products } from "@/types";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";



export const productSlice = createApi({
    reducerPath: "productApi",
    baseQuery: fetchBaseQuery({
        baseUrl: `${BASE_URL}/api/product`,
        credentials: "include",
    }),
    tagTypes: ["Product"],
    endpoints: (builder) => ({
        getAllProduct: builder.query<products[], void>({
            query: () => "/all",
            transformResponse: (res: ProductResponse) => res.products,
            providesTags: ["Product"],
        }),
        getSingleProduct: builder.query<IProduct, { id: string }>({
            query: ({ id }) => `/${id}`,
            transformResponse: (res: IproductResponse) => res.product,
            providesTags: ["Product"],
        }),
        createProduct: builder.mutation<products, FormData>({
            query: (formData) => ({
                url: "/create",
                method: "POST",
                body: formData
            }),
            invalidatesTags: ["Product"],
        }),
        updateProduct: builder.mutation<products, { id: string, formData: FormData }>({
            query: ({ formData, id }) => ({
                url: `/update/${id}`,
                method: "PUT",
                body: formData,
            }),
            invalidatesTags: ["Product"],
        }),
        deleteProduct: builder.mutation<void, string>({
            query: (id) => ({
                url: `/delete/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Product"],
        }),
        filterProduct: builder.mutation({
            query: (body) => ({
                url: "/filter",
                method: "POST",
                body
            })
        })
    })
})

export const { useGetAllProductQuery, useCreateProductMutation, useUpdateProductMutation, useDeleteProductMutation, useFilterProductMutation, useGetSingleProductQuery } = productSlice