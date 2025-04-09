"use server";

import { createClient } from "@/utils/supabase/client";

export async function getAllNews(page: number = 1, limit: number = 3) {
  const supabase = createClient();
  const offset = (page - 1) * limit;

  try {
    const { data, count, error } = await supabase
      .from("news")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      throw new Error(`Failed to fetch news: ${error.message}`);
    }

    return { news: data, total: count || 0 };
  } catch (err) {
    console.error("Unexpected error during fetching news:", err);
    throw err;
  }
}

export async function getLatestNews() {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("news")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(5);

  if (error) {
    throw new Error("Failed to fetch latest news: " + error.message);
  }

  return data;
}

//REVIEWS

export async function getLatestReviews() {
  const supabase = createClient();

  try {
    const { data, error } = await supabase
      .from("reviews")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(10);

    if (error) {
      throw new Error("Failed to fetch latest reviews: " + error.message);
    }

    return data;
  } catch (err) {
    console.error("Unexpected error during fetching reviews:", err);
    throw err;
  }
}

export async function createRequest(
  name: string,
  mobile: string,
  mail: string,
  category: string,
  consent: boolean,
  message: string
): Promise<void> {
  const supabase = createClient();

  try {
    // Hent brugerens IP-adresse
    const ipResponse = await fetch("https://api64.ipify.org?format=json");
    const ipData = await ipResponse.json();
    const ipAddress = ipData.ip;

    const consentTimestamp = consent ? new Date().toISOString() : null;

    // Indsæt data i databasen
    const { error } = await supabase.from("requests").insert([
      {
        name,
        mobile,
        mail,
        category,
        consent,
        message,
        consent_timestamp: consentTimestamp,
        ip_address: ipAddress,
        terms_version: "v1.0",
      },
    ]);

    if (error) {
      throw new Error(`Failed to create request: ${error.message}`);
    }
  } catch (error) {
    console.error("Error in createRequest:", error);
    throw error;
  }
}
