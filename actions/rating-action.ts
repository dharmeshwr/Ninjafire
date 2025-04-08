"use server";

import { redis } from "@/db";

export const UpdateRating = async (rating: number) => {
  try {
    const previousRating = Number(await redis.get("rating")) || 0;
    const totalPeopleRated = Number(await redis.get("total_people_rated")) || 0;

    const currentTotalPeople = totalPeopleRated + 1;
    const currentRating =
      (previousRating * totalPeopleRated + rating + 1) / currentTotalPeople;

    await redis.set("rating", currentRating);
    await redis.set("total_people_rated", currentTotalPeople);

    return { success: true };
  } catch (error) {
    console.error("Something went wrong: ", error);
    return { success: false };
  }
};

export const GetRatingWithPeople = async () => {
  try {
    const rating = Number(await redis.get("rating")).toFixed(1);
    const people = await redis.get("total_people_rated");

    return { success: true, rating, people };
  } catch (error) {
    console.error("Something went wrong: ", error);
    return { success: false };
  }
};
