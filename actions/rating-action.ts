"use server";

import { cookies } from "next/headers";
import { redis } from "@/db";

export const UpdateRating = async (rating: number) => {
  const previousRating = Number(await redis.get("rating")) || 0;
  const totalPeopleRated = Number(await redis.get("total_people_rated")) || 0;
  try {
    const currentTotalPeople = totalPeopleRated + 1;
    const currentRating =
      (previousRating * totalPeopleRated + rating + 1) / currentTotalPeople;

    await redis.set("rating", currentRating.toFixed(1));
    await redis.set("total_people_rated", currentTotalPeople);

    const cookieStore = await cookies();
    cookieStore.set({
      name: "hasRated",
      value: rating.toString(),
      maxAge: 365 * 24 * 60 * 60,
      sameSite: "none",
      secure: true,
      path: "/",
    });

    return {
      success: true,
      rating: currentRating.toFixed(1).toString(),
      people: currentTotalPeople.toString(),
    };
  } catch (error) {
    console.error("Something went wrong: ", error);
    return {
      success: false,
      rating: previousRating.toString(),
      people: totalPeopleRated.toString(),
    };
  }
};

export const GetRatingWithPeople = async (): Promise<{
  success: boolean;
  rating: string;
  people: string;
}> => {
  try {
    const rating = Number(await redis.get("rating")).toFixed(1);
    const people = (await redis.get("total_people_rated")) as string;

    return { success: true, rating, people };
  } catch (error) {
    console.error("Something went wrong: ", error);
    return { success: false, rating: "0", people: "0" };
  }
};
