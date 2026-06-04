import { createClient } from "@supabase/supabase-js"

const supabaseUrl = "https://pkbtkzzhnldtciedncna.supabase.co"
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBrYnRrenpobmxkdGNpZWRuY25hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk2MTg0ODksImV4cCI6MjA5NTE5NDQ4OX0.3zxiOeP7McsCZeui5S53KdRgkulPMvuO9BSED__hIc4"

export const supabase = createClient(supabaseUrl, supabaseKey)