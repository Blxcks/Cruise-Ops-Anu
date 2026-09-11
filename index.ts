import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};
const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } });

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);
  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!supabaseUrl || !serviceRoleKey) return json({ error: "Server configuration is incomplete." }, 500);
  const authHeader = req.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) return json({ error: "Missing authorization." }, 401);
  const accessToken = authHeader.slice(7);
  const adminClient = createClient(supabaseUrl, serviceRoleKey, { auth: { persistSession: false } });
  const { data: { user }, error: userError } = await adminClient.auth.getUser(accessToken);
  if (userError || !user) return json({ error: "Invalid session." }, 401);
  const { data: actor, error: actorError } = await adminClient.from("profiles").select("id, role, active").eq("id", user.id).maybeSingle();
  if (actorError) return json({ error: actorError.message }, 500);
  if (!actor || actor.role !== "admin" || actor.active !== true) return json({ error: "Admin access required." }, 403);
  let body: any;
  try { body = await req.json(); } catch { return json({ error: "Invalid JSON." }, 400); }
  const action = body?.action;
  const allowedRoles = ["admin", "port_manager", "port_agent", "tours_agent", "finance", "viewer"];
  if (action === "list") {
    const { data: profiles, error } = await adminClient.from("profiles").select("id, full_name, role, phone, active, created_at, updated_at").order("created_at", { ascending: true });
    if (error) return json({ error: error.message }, 500);
    const enriched = await Promise.all((profiles ?? []).map(async (p) => { const { data: au } = await adminClient.auth.admin.getUserById(p.id); return { ...p, email: au.user?.email ?? "", email_confirmed: !!au.user?.email_confirmed_at, last_sign_in_at: au.user?.last_sign_in_at ?? null }; }));
    return json({ users: enriched });
  }
  if (action === "invite") {
    const email = String(body?.email ?? "").trim().toLowerCase();
    const fullName = String(body?.full_name ?? "").trim();
    const phone = String(body?.phone ?? "").trim() || null;
    const role = String(body?.role ?? "viewer");
    if (!email || !email.includes("@")) return json({ error: "A valid email is required." }, 400);
    if (!fullName) return json({ error: "Full name is required." }, 400);
    if (!allowedRoles.includes(role)) return json({ error: "Invalid role." }, 400);
    const { data, error } = await adminClient.auth.admin.inviteUserByEmail(email, { data: { full_name: fullName }, redirectTo: `${supabaseUrl.replace(/\/$/, "")}/auth/v1/verify?redirect_to=${encodeURIComponent(body?.redirect_to || "")}` });
    if (error) return json({ error: error.message }, 400);
    const userId = data.user?.id;
    if (!userId) return json({ error: "Invitation did not create a user." }, 500);
    const { error: profileError } = await adminClient.from("profiles").upsert({ id: userId, full_name: fullName, phone, role, active: true }, { onConflict: "id" });
    if (profileError) return json({ error: profileError.message }, 500);
    return json({ user: { id: userId, email, full_name: fullName, role } });
  }
  if (action === "update") {
    const userId = String(body?.user_id ?? ""); const role = String(body?.role ?? ""); const active = body?.active;
    if (!userId) return json({ error: "User ID is required." }, 400);
    if (userId === user.id && role && role !== "admin") return json({ error: "You cannot remove your own admin role." }, 400);
    if (userId === user.id && active === false) return json({ error: "You cannot deactivate your own account." }, 400);
    const patch: Record<string, unknown> = {};
    if (role) { if (!allowedRoles.includes(role)) return json({ error: "Invalid role." }, 400); patch.role = role; }
    if (typeof active === "boolean") patch.active = active;
    if (!Object.keys(patch).length) return json({ error: "No changes supplied." }, 400);
    const { error } = await adminClient.from("profiles").update(patch).eq("id", userId);
    if (error) return json({ error: error.message }, 500);
    return json({ success: true });
  }
  if (action === "resend") {
    const userId = String(body?.user_id ?? "");
    const { data: target, error: targetError } = await adminClient.auth.admin.getUserById(userId);
    if (targetError || !target.user?.email) return json({ error: targetError?.message || "User email not found." }, 404);
    const { error } = await adminClient.auth.resend({ type: "signup", email: target.user.email });
    if (error) return json({ error: error.message }, 400);
    return json({ success: true });
  }
  return json({ error: "Unknown action." }, 400);
});
