export const fetchWaifuImage = async () => {
  const apiUrl = "https://api.waifu.im/search";
  const params = {
    included_tags: ["raiden-shogun"],
    height: ">=1000",
  };

  const queryParams = new URLSearchParams();

  for (const key in params) {
    if (Array.isArray(params[key])) {
      params[key].forEach((value: string) => {
        queryParams.append(key, value);
      });
    } else {
      queryParams.set(key, params[key]);
    }
  }

  try {
    const response = await fetch(`${apiUrl}?${queryParams.toString()}`);
    if (!response.ok) throw new Error("Request failed");
    const data = await response.json();
    return data.images[0].url;
  } catch (error) {
    console.error(error);
    return null;
  }
};
