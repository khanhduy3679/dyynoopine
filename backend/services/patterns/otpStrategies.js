// Strategy Pattern: các chiến lược gửi OTP dùng chung interface sendOtp(destination, code).
class ConsoleOtpStrategy {
  async sendOtp(destination, code) {
    console.log(`[OTP][console] Gửi OTP ${code} tới ${destination}`);
  }
}

class EmailOtpStrategy {
  async sendOtp(destination, code) {
    // Có thể tích hợp nodemailer bằng SMTP trong .env. Giữ console fallback để dễ demo local.
    console.log(`[OTP][email-demo] Gửi OTP ${code} tới email ${destination}`);
  }
}

function createOtpStrategy() {
  return process.env.OTP_MODE === 'email' ? new EmailOtpStrategy() : new ConsoleOtpStrategy();
}

module.exports = { createOtpStrategy };
