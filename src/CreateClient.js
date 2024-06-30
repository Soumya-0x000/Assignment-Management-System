import { createClient } from "@supabase/supabase-js";

const supabaseURL = import.meta.env.VITE_SUPABASE_URL;
const apiKey = import.meta.env.VITE_SUPABASE_KEY;
const serviceRoleKey = import.meta.env.VITE_SERVICE_ROLE_KEY;

export const supabase = createClient(supabaseURL, apiKey);
export const supabaseAuth = createClient(supabaseURL, serviceRoleKey);
