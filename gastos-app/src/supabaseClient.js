import { createClient } from "@supabase/supabase-js";

// Tus datos de Supabase
const supabaseUrl = "https://rlsfoorqnmtjeulpfjmb.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJsc2Zvb3Jxbm10amV1bHBmam1iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIzODM2NjUsImV4cCI6MjA3Nzk1OTY2NX0.JmC6KxCrdI0Vhre2ExLCdmE92eBLPS933mGCqq7-OYE";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
