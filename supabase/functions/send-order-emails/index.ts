import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "resend";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface OrderItem {
  product_name: string;
  quantity: number;
  price: number;
}

interface OrderEmailRequest {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  deliveryAddress: string;
  deliveryArea: string;
  deliverySpeed: string;
  deliveryFee: number;
  priorityFee: number;
  subtotal: number;
  total: number;
  notes: string | null;
  items: OrderItem[];
}

const ADMIN_EMAIL = "divansabir06@gmail.com";

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const order: OrderEmailRequest = await req.json();

    // Validate required fields
    if (!order.customerEmail || !order.orderNumber) {
      throw new Error("Missing required fields");
    }

    const itemsHtml = order.items
      .map(
        (item) =>
          `<tr>
            <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.product_name}</td>
            <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
            <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">${(item.price * item.quantity).toFixed(0)} kr</td>
          </tr>`
      )
      .join("");

    const deliverySpeedText = order.deliverySpeed === "priority" ? "Prioriterad (10-20 min)" : "Standard (20-30 min)";

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
            <p style="font-size: 16px; color: #333;">Hej ${order.customerName}!</p>
            <p style="font-size: 16px; color: #666;">Din beställning har mottagits och vi förbereder den nu. Du kommer att få dina snacks inom kort!</p>
            
            <div style="background: #f8f8f8; border-radius: 12px; padding: 20px; margin: 20px 0;">
              <h2 style="margin: 0 0 15px 0; font-size: 18px; color: #333;">Orderdetaljer</h2>
              <p style="margin: 5px 0; color: #666;"><strong>Ordernummer:</strong> ${order.orderNumber}</p>
              <p style="margin: 5px 0; color: #666;"><strong>Leveranstid:</strong> ${deliverySpeedText}</p>
              <p style="margin: 5px 0; color: #666;"><strong>Adress:</strong> ${order.deliveryAddress}</p>
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

            <div style="border-top: 2px solid #eee; padding-top: 15px; margin-top: 10px;">
              <div style="display: flex; justify-content: space-between; margin: 8px 0; font-size: 14px; color: #666;">
                <span>Delsumma</span>
                <span>${order.subtotal.toFixed(0)} kr</span>
              </div>
              <div style="display: flex; justify-content: space-between; margin: 8px 0; font-size: 14px; color: #666;">
                <span>Leveransavgift (${order.deliveryArea})</span>
                <span>${order.deliveryFee} kr</span>
              </div>
              ${order.priorityFee > 0 ? `
              <div style="display: flex; justify-content: space-between; margin: 8px 0; font-size: 14px; color: #666;">
                <span>Prioriterad leverans</span>
                <span>${order.priorityFee} kr</span>
              </div>
              ` : ''}
              <div style="display: flex; justify-content: space-between; margin: 15px 0 0 0; font-size: 20px; font-weight: bold; color: #FF6B35;">
                <span>Totalt</span>
                <span>${order.total.toFixed(0)} kr</span>
              </div>
            </div>

            <div style="background: #fff3cd; border-radius: 8px; padding: 15px; margin-top: 20px;">
              <p style="margin: 0; font-size: 14px; color: #856404;">
                💳 <strong>Betalning:</strong> Du betalar med Apple Pay, kort eller Revolut när leveransen anländer.
              </p>
            </div>

            ${order.notes ? `
            <div style="background: #e8f4fd; border-radius: 8px; padding: 15px; margin-top: 15px;">
              <p style="margin: 0; font-size: 14px; color: #0c5460;">
                📝 <strong>Ditt meddelande:</strong> ${order.notes}
              </p>
            </div>
            ` : ''}
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
          <p><strong>Ordernummer:</strong> ${order.orderNumber}</p>
          <p><strong>Namn:</strong> ${order.customerName}</p>
          <p><strong>Email:</strong> ${order.customerEmail}</p>
          <p><strong>Telefon:</strong> ${order.customerPhone}</p>
          <p><strong>Adress:</strong> ${order.deliveryAddress}</p>
          <p><strong>Område:</strong> ${order.deliveryArea}</p>
          <p><strong>Leveranstid:</strong> ${deliverySpeedText}</p>
          ${order.notes ? `<p><strong>Meddelande:</strong> ${order.notes}</p>` : ''}
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
          <p style="margin: 5px 0;"><strong>Leverans:</strong> ${order.deliveryFee} kr</p>
          ${order.priorityFee > 0 ? `<p style="margin: 5px 0;"><strong>Prioritering:</strong> ${order.priorityFee} kr</p>` : ''}
          <p style="margin: 10px 0 0 0; font-size: 20px;"><strong>TOTALT: ${order.total.toFixed(0)} kr</strong></p>
        </div>
      </body>
      </html>
    `;

    // Send customer confirmation email
    const customerEmailResponse = await resend.emails.send({
      from: "Snaxo <order@snaxo.online>",
      to: [order.customerEmail],
      subject: `Orderbekräftelse - ${order.orderNumber}`,
      html: customerEmailHtml,
    });

    console.log("Customer email sent:", customerEmailResponse);

    // Send admin notification email
    const adminEmailResponse = await resend.emails.send({
      from: "Snaxo Orders <order@snaxo.online>",
      to: [ADMIN_EMAIL],
      subject: `🚨 Ny beställning - ${order.orderNumber} - ${order.total.toFixed(0)} kr`,
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
  } catch (error: any) {
    console.error("Error in send-order-emails function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
