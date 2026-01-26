import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "resend";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface SendEmailRequest {
  orderNumber: string;
  customerEmail: string;
}

const ADMIN_EMAIL = Deno.env.get("ADMIN_EMAIL") || "divansabir06@gmail.com";

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verify authorization header exists
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(
        JSON.stringify({ error: "Unauthorized: Missing or invalid authorization header" }),
        { status: 401, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Parse request body
    const body: SendEmailRequest = await req.json();
    const { orderNumber, customerEmail } = body;

    // Validate required fields
    if (!orderNumber || !customerEmail) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: orderNumber and customerEmail" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Validate email format
    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    if (!emailRegex.test(customerEmail)) {
      return new Response(
        JSON.stringify({ error: "Invalid email format" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Create Supabase client with service role to verify order exists
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    
    const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

    // Verify order exists and email matches (prevents sending to arbitrary emails)
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .select(`
        *,
        delivery_areas!inner(name)
      `)
      .eq("order_number", orderNumber)
      .eq("customer_email", customerEmail.toLowerCase())
      .single();

    if (orderError || !order) {
      console.error("Order verification failed:", orderError);
      return new Response(
        JSON.stringify({ error: "Order not found or email mismatch" }),
        { status: 404, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Get order items
    const { data: orderItems, error: itemsError } = await supabase
      .from("order_items")
      .select("*")
      .eq("order_id", order.id);

    if (itemsError) {
      console.error("Failed to fetch order items:", itemsError);
      return new Response(
        JSON.stringify({ error: "Failed to fetch order items" }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Build email content from verified database data
    const itemsHtml = (orderItems || [])
      .map(
        (item) =>
          `<tr>
            <td style="padding: 10px; border-bottom: 1px solid #eee;">${escapeHtml(item.product_name)}</td>
            <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
            <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">${(item.price * item.quantity).toFixed(0)} kr</td>
          </tr>`
      )
      .join("");

    const deliverySpeedText = order.delivery_speed === "priority" ? "Prioriterad (10-20 min)" : "Standard (20-30 min)";
    const deliveryAreaName = order.delivery_areas?.name || "Okänt";

    const customerEmailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f5f5f5; margin: 0; padding: 20px;">
        <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          <div style="background: linear-gradient(135deg, #FF6B35, #FF8B5C); padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px;">🎉 Tack för din beställning!</h1>
          </div>
          
          <div style="padding: 30px;">
            <p style="font-size: 16px; color: #333;">Hej ${escapeHtml(order.customer_name)}!</p>
            <p style="font-size: 16px; color: #666;">Din beställning har mottagits och vi förbereder den nu. Du kommer att få dina snacks inom kort!</p>
            
            <div style="background: #f8f8f8; border-radius: 12px; padding: 20px; margin: 20px 0;">
              <h2 style="margin: 0 0 15px 0; font-size: 18px; color: #333;">Orderdetaljer</h2>
              <p style="margin: 5px 0; color: #666;"><strong>Ordernummer:</strong> ${escapeHtml(order.order_number)}</p>
              <p style="margin: 5px 0; color: #666;"><strong>Leveranstid:</strong> ${deliverySpeedText}</p>
              <p style="margin: 5px 0; color: #666;"><strong>Adress:</strong> ${escapeHtml(order.delivery_address)}</p>
            </div>

            <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
              <thead>
                <tr style="background: #f0f0f0;">
                  <th style="padding: 12px; text-align: left; font-size: 14px;">Produkt</th>
                  <th style="padding: 12px; text-align: center; font-size: 14px;">Antal</th>
                  <th style="padding: 12px; text-align: right; font-size: 14px;">Pris</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHtml}
              </tbody>
            </table>

            <div style="border-top: 2px solid #eee; padding-top: 20px; margin-top: 15px;">
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 10px 0; font-size: 15px; color: #333; font-weight: 500;">Delsumma:</td>
                  <td style="padding: 10px 0; font-size: 15px; color: #333; text-align: right; font-weight: 500;">${order.subtotal.toFixed(0)} kr</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; font-size: 15px; color: #333; font-weight: 500;">Leveransavgift (${escapeHtml(deliveryAreaName)}):</td>
                  <td style="padding: 10px 0; font-size: 15px; color: #333; text-align: right; font-weight: 500;">${order.delivery_fee} kr</td>
                </tr>
                ${order.priority_fee > 0 ? `
                <tr>
                  <td style="padding: 10px 0; font-size: 15px; color: #333; font-weight: 500;">Prioriterad leverans:</td>
                  <td style="padding: 10px 0; font-size: 15px; color: #333; text-align: right; font-weight: 500;">${order.priority_fee} kr</td>
                </tr>
                ` : ''}
                <tr style="border-top: 2px solid #FF6B35;">
                  <td style="padding: 15px 0 5px 0; font-size: 20px; color: #FF6B35; font-weight: bold;">Totalt:</td>
                  <td style="padding: 15px 0 5px 0; font-size: 20px; color: #FF6B35; text-align: right; font-weight: bold;">${order.total.toFixed(0)} kr</td>
                </tr>
              </table>
            </div>

            <div style="background: #fff3cd; border-radius: 8px; padding: 15px; margin-top: 20px;">
              <p style="margin: 0; font-size: 14px; color: #856404;">
                💳 <strong>Betalning:</strong> Du betalar med Apple Pay, kort eller Revolut när leveransen anländer.
              </p>
            </div>

            ${order.notes ? `
            <div style="background: #e8f4fd; border-radius: 8px; padding: 15px; margin-top: 15px;">
              <p style="margin: 0; font-size: 14px; color: #0c5460;">
                📝 <strong>Ditt meddelande:</strong> ${escapeHtml(order.notes)}
              </p>
            </div>
            ` : ''}

            <div style="background: linear-gradient(135deg, #1a1a1a, #2d2d2d); border-radius: 12px; padding: 24px; margin-top: 25px; text-align: center; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
              <p style="margin: 0; font-size: 15px; color: #ffffff; font-weight: 400; letter-spacing: 0.3px; line-height: 1.6;">
                📱 <span style="font-weight: 500;">Vänligen ha telefonen tillgänglig</span><br>
                <span style="color: #cccccc; font-size: 14px;">Vi kontaktar dig när vi är utanför din adress.</span>
              </p>
            </div>
          </div>

          <div style="background: #333; padding: 20px; text-align: center;">
            <p style="color: #999; margin: 0; font-size: 12px;">© 2025 Snaxo - Snabba snacks till din dörr</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const adminEmailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 20px;">
        <h1 style="color: #FF6B35;">🚨 Ny beställning!</h1>
        
        <div style="background: #f8f8f8; border-radius: 8px; padding: 20px; margin: 20px 0;">
          <h2 style="margin-top: 0;">Kunduppgifter</h2>
          <p><strong>Ordernummer:</strong> ${escapeHtml(order.order_number)}</p>
          <p><strong>Namn:</strong> ${escapeHtml(order.customer_name)}</p>
          <p><strong>Email:</strong> ${escapeHtml(order.customer_email)}</p>
          <p><strong>Telefon:</strong> ${escapeHtml(order.customer_phone)}</p>
          <p><strong>Adress:</strong> ${escapeHtml(order.delivery_address)}</p>
          <p><strong>Område:</strong> ${escapeHtml(deliveryAreaName)}</p>
          <p><strong>Leveranstid:</strong> ${deliverySpeedText}</p>
          ${order.notes ? `<p><strong>Meddelande:</strong> ${escapeHtml(order.notes)}</p>` : ''}
        </div>

        <h2>Produkter</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr style="background: #eee;">
              <th style="padding: 10px; text-align: left;">Produkt</th>
              <th style="padding: 10px; text-align: center;">Antal</th>
              <th style="padding: 10px; text-align: right;">Pris</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
        </table>

        <div style="margin-top: 20px; padding: 15px; background: #d4edda; border-radius: 8px;">
          <p style="margin: 5px 0;"><strong>Delsumma:</strong> ${order.subtotal.toFixed(0)} kr</p>
          <p style="margin: 5px 0;"><strong>Leverans:</strong> ${order.delivery_fee} kr</p>
          ${order.priority_fee > 0 ? `<p style="margin: 5px 0;"><strong>Prioritering:</strong> ${order.priority_fee} kr</p>` : ''}
          <p style="margin: 10px 0 0 0; font-size: 20px;"><strong>TOTALT: ${order.total.toFixed(0)} kr</strong></p>
        </div>
      </body>
      </html>
    `;

    // Send customer confirmation email
    const customerEmailResponse = await resend.emails.send({
      from: "Snaxo <order@snaxo.online>",
      to: [order.customer_email],
      subject: `Orderbekräftelse - ${order.order_number}`,
      html: customerEmailHtml,
    });

    console.log("Customer email sent:", customerEmailResponse);

    // Send admin notification email
    const adminEmailResponse = await resend.emails.send({
      from: "Snaxo Orders <order@snaxo.online>",
      to: [ADMIN_EMAIL],
      subject: `🚨 Ny beställning - ${order.order_number} - ${order.total.toFixed(0)} kr`,
      html: adminEmailHtml,
    });

    console.log("Admin email sent:", adminEmailResponse);

    return new Response(
      JSON.stringify({
        success: true,
        customerEmail: customerEmailResponse,
        adminEmail: adminEmailResponse,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Error in send-order-emails function:", errorMessage);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

// Helper function to escape HTML to prevent XSS
function escapeHtml(text: string | null | undefined): string {
  if (!text) return "";
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

serve(handler);
