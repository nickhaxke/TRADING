import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const { email, confirmationUrl } = await req.json();

    if (!email || !confirmationUrl) {
      return new Response(
        JSON.stringify({ error: "Missing email or confirmationUrl" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const htmlBody = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
      line-height: 1.6;
      color: #333;
      margin: 0;
      padding: 0;
      background-color: #f8fafc;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    .email-wrapper {
      background: white;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    }
    .header {
      background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
      padding: 40px 20px;
      text-align: center;
      color: white;
    }
    .header h1 {
      margin: 0;
      font-size: 28px;
      font-weight: 700;
      letter-spacing: -0.5px;
    }
    .content {
      padding: 40px 30px;
    }
    .greeting {
      font-size: 16px;
      margin-bottom: 20px;
      color: #1f2937;
    }
    .message {
      font-size: 15px;
      color: #4b5563;
      margin-bottom: 30px;
      line-height: 1.7;
    }
    .button-container {
      text-align: center;
      margin: 40px 0;
    }
    .button {
      display: inline-block;
      padding: 14px 40px;
      background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
      color: white;
      text-decoration: none;
      border-radius: 8px;
      font-weight: 600;
      font-size: 16px;
      transition: transform 0.2s, box-shadow 0.2s;
      box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
    }
    .button:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(37, 99, 235, 0.4);
    }
    .verification-code {
      background: #f0f9ff;
      border-left: 4px solid #2563eb;
      padding: 20px;
      margin: 20px 0;
      border-radius: 6px;
      font-family: 'Courier New', monospace;
      font-size: 14px;
      color: #0c4a6e;
      word-break: break-all;
    }
    .divider {
      height: 1px;
      background: #e5e7eb;
      margin: 40px 0;
    }
    .footer {
      background: #f8fafc;
      padding: 30px;
      text-align: center;
      border-top: 1px solid #e5e7eb;
    }
    .footer-text {
      font-size: 13px;
      color: #6b7280;
      margin: 0;
      line-height: 1.6;
    }
    .footer-link {
      color: #2563eb;
      text-decoration: none;
    }
    .footer-link:hover {
      text-decoration: underline;
    }
    .icon {
      width: 60px;
      height: 60px;
      margin: 0 auto 20px;
      background: rgba(255, 255, 255, 0.2);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 30px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="email-wrapper">
      <div class="header">
        <div class="icon">✓</div>
        <h1>Verify Your Email</h1>
      </div>
      <div class="content">
        <p class="greeting">Welcome!</p>
        <p class="message">
          Thank you for signing up. To complete your registration and secure your account, 
          please verify your email address by clicking the button below.
        </p>
        <div class="button-container">
          <a href="${confirmationUrl}" class="button">Verify Email Address</a>
        </div>
        <p class="message">
          Or copy and paste this link in your browser:
        </p>
        <div class="verification-code">${confirmationUrl}</div>
        <p class="message" style="color: #6b7280; font-size: 14px;">
          This link will expire in 24 hours. If you didn't create this account, 
          please ignore this email.
        </p>
      </div>
      <div class="divider"></div>
      <div class="footer">
        <p class="footer-text">
          Need help? <a href="#" class="footer-link">Contact our support team</a>
        </p>
        <p class="footer-text">
          © 2025 Trading Platform. All rights reserved.
        </p>
      </div>
    </div>
  </div>
</body>
</html>
    `;

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error("Missing Supabase configuration");
    }

    const response = await fetch(`${supabaseUrl}/rest/v1/rpc/send_email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${supabaseServiceKey}`,
      },
      body: JSON.stringify({
        to: email,
        subject: "Verify Your Email Address",
        html: htmlBody,
      }),
    });

    if (!response.ok) {
      console.error("Email sending failed:", await response.text());
      return new Response(
        JSON.stringify({ error: "Failed to send verification email" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    return new Response(
      JSON.stringify({ success: true, message: "Verification email sent" }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Internal server error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
