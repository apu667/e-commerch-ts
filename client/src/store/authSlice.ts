import { BASE_URL } from '@/base_url/base_url';
import type { ISignleUserResposne, IUser, IUserProfile, IUserResponse, SignInForm, SignUpForm } from '@/types';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const authSlice = createApi({
    reducerPath: "auth",
    baseQuery: fetchBaseQuery({
        baseUrl: `${BASE_URL}/api/auth`,
        credentials: "include"
    }),
    tagTypes: ["User"],
    endpoints: (builder) => ({
        signUp: builder.mutation<ISignleUserResposne, SignUpForm>({
            query: (formData) => ({
                url: "/signup",
                method: "POST",
                body: formData,

            }),
            invalidatesTags: ["User"]
        }),
        signIn: builder.mutation<ISignleUserResposne, SignInForm>({
            query: (formData) => ({
                url: "/signin",
                method: "POST",
                body: formData
            }),
            invalidatesTags: ["User"]
        }),
        logout: builder.mutation<{ message: string }, void>({
            query: () => ({
                url: "/logout",
                method: "POST",
                credentials: "include"
            }),
            invalidatesTags: ["User"],
        }),
        updateProfile: builder.mutation<IUserProfile, FormData>({
            query: (formData) => ({
                url: "/profile/update",
                method: "POST",
                body: formData,
            }),
            invalidatesTags: ["User"]
        }),
        allUser: builder.query<IUser[], void>({
            query: () => "/all",
            transformResponse: (res: IUserResponse) => res.user,
            providesTags: ["User"]
        }),
        updatedUser: builder.mutation<IUserResponse, { id: string, formData: FormData }>({
            query: ({ id, formData }) => ({
                url: `/updated/${id}`,
                method: "PUT",
                body: formData,
                credentials: "include"
            }),
            invalidatesTags: ["User"]
        }),
        deletedUser: builder.mutation<{ message: string }, { id: string }>({
            query: (id) => ({
                url: `/delete/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["User"]
        })
    })
})

export const { useSignUpMutation, useSignInMutation, useAllUserQuery, useUpdatedUserMutation, useDeletedUserMutation, useUpdateProfileMutation, useLogoutMutation } = authSlice