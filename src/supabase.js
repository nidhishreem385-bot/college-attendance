import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://sqwvjcovvbdjdcyhkjlg.supabase.co";
const supabaseKey = "sb_publishable_Po2bm0pbgj_O2OXCb7sXbw_VYG-rMPj";

export const supabase = createClient(supabaseUrl, supabaseKey);
