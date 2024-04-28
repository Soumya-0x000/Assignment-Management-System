import { createClient } from "@supabase/supabase-js";

const supabaseURL = 'https://mthyfupivatxyjbianpp.supabase.co';
const apiKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im10aHlmdXBpdmF0eHlqYmlhbnBwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTQyMzM4NTIsImV4cCI6MjAyOTgwOTg1Mn0.b25Q1G_QWlnTYfmEsal_a2SiFRzCNMSeRef3Krm9ZcA';

export const supabase = createClient(supabaseURL, apiKey);
