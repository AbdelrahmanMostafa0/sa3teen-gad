import axios from "axios";

export const getPrayers = async ({
  date,
  city,
  country,
}: {
  date: string;
  city: string;
  country: string;
}) => {
  try {
    const response = await axios.get(
      `https://api.aladhan.com/v1/timingsByCity/${date}`,
      {
        params: {
          city,
          country,
        },
      }
    );
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      throw error.response?.data;
    }
    throw error;
  }
};
