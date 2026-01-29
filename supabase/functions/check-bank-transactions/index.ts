import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const vcbToken = Deno.env.get("VCB_API_TOKEN");

    if (!vcbToken) {
      return new Response(
        JSON.stringify({ error: "VCB_API_TOKEN not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Fetch bank transactions
    const apiUrl = `https://thueapibank.vn/historyapivcb/${vcbToken}`;
    const bankResponse = await fetch(apiUrl);
    const bankData = await bankResponse.json();

    if (bankData.code !== "00" || !bankData.transactions) {
      return new Response(
        JSON.stringify({ error: "Failed to fetch bank data", data: bankData }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    let processedCount = 0;
    const errors: string[] = [];

    // Get the transfer content prefix from settings
    const { data: settingData } = await supabase
      .from("settings")
      .select("value")
      .eq("key", "transfer_content")
      .single();

    const transferPrefix = settingData?.value || "vietool";

    for (const tx of bankData.transactions) {
      // Only process credit transactions (incoming money)
      if (tx.DorCCode !== "C") continue;

      // Parse amount
      const amount = parseInt(tx.Amount.replace(/,/g, ""));
      if (isNaN(amount) || amount < 10000) continue;

      // Check if this transaction is already processed
      const txRef = `${tx.SeqNo}-${tx.PostingDate}`;
      const { data: existingTx } = await supabase
        .from("transactions")
        .select("id")
        .eq("description", `Bank: ${txRef}`)
        .single();

      if (existingTx) continue;

      // Parse the transfer content to find username
      const description = tx.Description || tx.Remark || "";
      const upperDesc = description.toUpperCase();
      
      // Look for transfer content pattern: vietool + username
      // Example: "vietooluser123" or "vietool user123" or "VIETOOL USER123"
      const prefixIndex = upperDesc.indexOf(transferPrefix.toUpperCase());
      
      if (prefixIndex === -1) continue;

      // Extract username after the prefix
      const afterPrefix = description.slice(prefixIndex + transferPrefix.length).trim();
      const usernameMatch = afterPrefix.match(/^[\s.]?([a-zA-Z0-9]+)/);
      
      if (!usernameMatch) continue;

      const username = usernameMatch[1].toLowerCase();

      // Find user by username
      const { data: profile } = await supabase
        .from("profiles")
        .select("user_id, money")
        .eq("username", username)
        .single();

      if (!profile) {
        errors.push(`User not found: ${username}`);
        continue;
      }

      // Update user balance
      const newBalance = (profile.money || 0) + amount;
      const { error: updateError } = await supabase
        .from("profiles")
        .update({ 
          money: newBalance,
          total_money: newBalance
        })
        .eq("user_id", profile.user_id);

      if (updateError) {
        errors.push(`Failed to update balance for ${username}: ${updateError.message}`);
        continue;
      }

      // Create transaction record
      await supabase.from("transactions").insert({
        user_id: profile.user_id,
        type: "deposit",
        amount: amount,
        description: `Bank: ${txRef}`,
        status: "completed",
      });

      processedCount++;
    }

    return new Response(
      JSON.stringify({
        success: true,
        processed: processedCount,
        errors: errors.length > 0 ? errors : undefined,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
