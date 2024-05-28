import { useQueryClient } from "@tanstack/react-query"
import { User } from "types"
import React from "react"
import { Gradient } from "./Gradient.js";

export default function Header() {
    const queryClient = useQueryClient();

    const gradient = new Gradient();

    const user = queryClient.getQueryData<User>(['user']);

    if (!user) return <div>Loading...</div>;

    return (
        <div className="w-full mx-auto  rounded-3xl p-5">
            <canvas id="gradient-canvas" data-transition-in>

            </canvas>
            <div className="flex items-center gap-2">
                <img src={user.images[1].url} alt="User profile" className="h-14 w-14 object-cover rounded-full" />
                <h1>{user.display_name}</h1>
            </div>
        </div>
    )
}