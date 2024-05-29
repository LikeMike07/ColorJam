import { useQueryClient } from "@tanstack/react-query";
import { User } from "types";
import React from "react";
import { GradientCanvas } from "../../../../components/GradientCanvas";

export default function Header() {
  const queryClient = useQueryClient();

  const user = queryClient.getQueryData<User>(["user"]);

  if (!user) return <div>Loading...</div>;

  return (
    <div className="flex items-center gap-2 bg-black/40 p-5 rounded-3xl backdrop-blur-lg text-white w-full max-w-4xl">
      <img
        src={user.images[1].url}
        alt="User profile"
        className="h-14 w-14 object-cover rounded-full"
      />
      <h1>{user.display_name}</h1>
    </div>
  );
}
