// Upload handler for Corzo Notary
// Accepts file uploads with password check, stores in R2, sends email notification

const UPLOAD_PASSWORD = 'TCWPZFNA';
const RECIPIENT_EMAIL = 'corzo.notary@outlook.com';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export default {
  async fetch(request, env) {
    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    if (request.method !== 'POST') {
      return new Response('Method not allowed', {
        status: 405,
        headers: { 'Content-Type': 'text/plain', ...corsHeaders },
      });
    }

    try {
      const formData = await request.formData();

      // Password check - accept both 'password' and 'uploadPassword' field names
      const password = formData.get('password') || formData.get('uploadPassword');
      if (password !== UPLOAD_PASSWORD) {
        return new Response('Invalid password. Please check and try again.', {
          status: 403,
          headers: { 'Content-Type': 'text/plain', ...corsHeaders },
        });
      }

      // Get file
      const file = formData.get('file');
      if (!file) {
        return new Response('No file provided.', {
          status: 400,
          headers: { 'Content-Type': 'text/plain', ...corsHeaders },
        });
      }

      // Client info - name required, email and phone optional
      const clientName = formData.get('uploaderName') || formData.get('clientname') || 'Unknown_Client';
      const clientEmail = formData.get('uploaderEmail') || formData.get('clientemail') || 'Not provided';
      const clientPhone = formData.get('uploaderPhone') || formData.get('clientphone') || 'Not provided';

      // Sanitize client name for storage path
      const sanitizedName = clientName.replace(/[^a-zA-Z0-9]/g, '_');
      const timestamp = Date.now();
      const fileName = file.name;
      const key = 'uploads/' + sanitizedName + '_' + timestamp + '/' + fileName;

      // Convert file to ArrayBuffer for R2 upload
      const fileBuffer = await file.arrayBuffer();

      // Upload to R2
      await env.UPLOAD_BUCKET.put(key, fileBuffer, {
        customMetadata: {
          clientName: clientName,
          clientEmail: clientEmail,
          clientPhone: clientPhone,
          uploadedAt: new Date().toISOString(),
        },
      });

      // Send email notification via Resend
      try {
        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': 'Bearer ' + env.RESEND_API_KEY,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: 'Corzo Notary <corzo.notary@outlook.com>',
            to: [RECIPIENT_EMAIL],
            subject: 'New Document Upload from ' + clientName,
            html: '<h2>New Document Upload</h2>' +
              '<p><strong>Client Name:</strong> ' + clientName + '</p>' +
              '<p><strong>Email:</strong> ' + clientEmail + '</p>' +
              '<p><strong>Phone:</strong> ' + clientPhone + '</p>' +
              '<p><strong>File:</strong> ' + fileName + '</p>' +
              '<p><strong>Uploaded at:</strong> ' + new Date().toISOString() + '</p>' +
              '<p><strong>Storage path:</strong> ' + key + '</p>',
          }),
        });
      } catch (emailErr) {
        console.error('Email notification failed: ' + emailErr.message);
      }

      // Return plain text success (compatible with frontend's response.ok check)
      return new Response('Document uploaded successfully', {
        status: 200,
        headers: { 'Content-Type': 'text/plain', ...corsHeaders },
      });

    } catch (err) {
      return new Response('Upload failed: ' + err.message, {
        status: 500,
        headers: { 'Content-Type': 'text/plain', ...corsHeaders },
      });
    }
  },
};
