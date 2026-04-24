const { data, error } = await supabase
  .from("wishes")
  .select("*")
  .eq("status", "approved")
  .order("created_at", { ascending: false });
