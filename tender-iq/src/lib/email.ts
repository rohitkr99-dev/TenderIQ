export async function sendEmail({ to, subject, body }: { to: string, subject: string, body: string }) {
  console.log(`[Email Mock] To: ${to}, Subject: ${subject}`);
  // Implementation for Resend/SendGrid would go here
  return { success: true };
}
