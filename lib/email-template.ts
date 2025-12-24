// Email HTML generation utility (can be used in both client and server)
import { statusMessages } from './email-config'

interface RepairEmailData {
    repairId: number
    customerName: string
    customerEmail: string
    trackingCode: string
    deviceModel: string
    estimatedCost?: number
    status: string
}

export function generateEmailHTML(
    repair: RepairEmailData,
    statusInfo: typeof statusMessages[string],
    trackingUrl: string
) {
    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${statusInfo.subject}</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f3f4f6;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f3f4f6; padding: 40px 20px;">
        <tr>
            <td align="center">
                <!-- Main Container -->
                <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                    
                    <!-- Header -->
                    <tr>
                        <td style="background: linear-gradient(135deg, ${statusInfo.color} 0%, #1e293b 100%); padding: 40px 30px; text-align: center;">
                            <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">ZK İletişim</h1>
                            <p style="margin: 10px 0 0 0; color: #e2e8f0; font-size: 14px;">Teknik Servis & Onarım</p>
                        </td>
                    </tr>

                    <!-- Status Badge -->
                    <tr>
                        <td style="padding: 30px 30px 20px 30px; text-align: center;">
                            <div style="display: inline-block; background-color: ${statusInfo.color}20; color: ${statusInfo.color}; padding: 12px 24px; border-radius: 50px; font-weight: bold; font-size: 18px;">
                                ${statusInfo.title}
                            </div>
                        </td>
                    </tr>

                    <!-- Content -->
                    <tr>
                        <td style="padding: 0 30px 30px 30px;">
                            <p style="color: #1f2937; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                                Merhaba <strong>${repair.customerName}</strong>,
                            </p>
                            <p style="color: #4b5563; font-size: 15px; line-height: 1.6; margin: 0 0 20px 0;">
                                ${statusInfo.message}
                            </p>

                            <!-- Repair Details Box -->
                            <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f9fafb; border-radius: 12px; margin: 20px 0;">
                                <tr>
                                    <td style="padding: 20px;">
                                        <table width="100%" cellpadding="8" cellspacing="0">
                                            <tr>
                                                <td style="color: #6b7280; font-size: 14px; width: 40%;">Takip Kodu:</td>
                                                <td style="color: #1f2937; font-size: 14px; font-weight: bold; font-family: monospace;">${repair.trackingCode}</td>
                                            </tr>
                                            <tr>
                                                <td style="color: #6b7280; font-size: 14px;">Cihaz:</td>
                                                <td style="color: #1f2937; font-size: 14px; font-weight: 600;">${repair.deviceModel}</td>
                                            </tr>
                                            ${repair.estimatedCost ? `
                                            <tr>
                                                <td style="color: #6b7280; font-size: 14px;">Tahmini Ücret:</td>
                                                <td style="color: #059669; font-size: 16px; font-weight: bold;">₺${repair.estimatedCost.toLocaleString('tr-TR')}</td>
                                            </tr>
                                            ` : ''}
                                        </table>
                                    </td>
                                </tr>
                            </table>

                            <!-- CTA Button -->
                            <table width="100%" cellpadding="0" cellspacing="0" style="margin: 30px 0;">
                                <tr>
                                    <td align="center">
                                        <a href="${trackingUrl}" style="display: inline-block; background-color: ${statusInfo.color}; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: bold; font-size: 16px;">
                                            Durumu Takip Et
                                        </a>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <!-- Premium Footer -->
                    <tr>
                        <td style="background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%); padding: 50px 30px; text-align: center;">
                            
                            <!-- Company Name -->
                            <h2 style="margin: 0 0 10px 0; color: #ffffff; font-size: 24px; font-weight: bold; letter-spacing: 1px;">
                                ZK İletişim
                            </h2>
                            <p style="margin: 0 0 30px 0; color: #94a3b8; font-size: 14px; font-style: italic;">
                                Teknik Servis & Onarım Merkezi
                            </p>

                            <!-- Contact Cards Container -->
                            <table width="100%" cellpadding="0" cellspacing="0" style="margin: 0 0 30px 0;">
                                <tr>
                                    <td>
                                        <table width="100%" cellpadding="0" cellspacing="0">
                                            <tr>
                                                <!-- Phone Card -->
                                                <td style="padding: 10px;" width="33.33%">
                                                    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: rgba(255,255,255,0.1); border-radius: 12px; padding: 20px;">
                                                        <tr>
                                                            <td style="text-align: center;">
                                                                <div style="background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); width: 48px; height: 48px; border-radius: 50%; margin: 0 auto 12px; display: flex; align-items: center; justify-content: center;">
                                                                    <span style="color: white; font-size: 24px;">📞</span>
                                                                </div>
                                                                <p style="margin: 0 0 8px 0; color: #cbd5e1; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Telefon</p>
                                                                <a href="tel:+905415713850" style="color: #ffffff; text-decoration: none; font-size: 16px; font-weight: bold; display: block;">
                                                                    0541 571 38 50
                                                                </a>
                                                            </td>
                                                        </tr>
                                                    </table>
                                                </td>

                                                <!-- Email Card -->
                                                <td style="padding: 10px;" width="33.33%">
                                                    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: rgba(255,255,255,0.1); border-radius: 12px; padding: 20px;">
                                                        <tr>
                                                            <td style="text-align: center;">
                                                                <div style="background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%); width: 48px; height: 48px; border-radius: 50%; margin: 0 auto 12px;">
                                                                    <span style="color: white; font-size: 24px; line-height: 48px;">📧</span>
                                                                </div>
                                                                <p style="margin: 0 0 8px 0; color: #cbd5e1; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">E-posta</p>
                                                                <a href="mailto:${process.env.FROM_EMAIL || 'info@zkiletisim.com'}" style="color: #ffffff; text-decoration: none; font-size: 14px; font-weight: bold; display: block; word-break: break-all;">
                                                                    ${process.env.FROM_EMAIL || 'info@zkiletisim.com'}
                                                                </a>
                                                            </td>
                                                        </tr>
                                                    </table>
                                                </td>

                                                <!-- Location Card -->
                                                <td style="padding: 10px;" width="33.33%">
                                                    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: rgba(255,255,255,0.1); border-radius: 12px; padding: 20px;">
                                                        <tr>
                                                            <td style="text-align: center;">
                                                                <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); width: 48px; height: 48px; border-radius: 50%; margin: 0 auto 12px;">
                                                                    <span style="color: white; font-size: 24px; line-height: 48px;">📍</span>
                                                                </div>
                                                                <p style="margin: 0 0 8px 0; color: #cbd5e1; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Adres</p>
                                                                <a href="https://maps.google.com/?q=Sahabiye,+Sivas+Blv.+No:15+D:E,+38010+Kocasinan/Kayseri" target="_blank" style="color: #ffffff; text-decoration: none; font-size: 13px; font-weight: 500; display: block; line-height: 1.4;">
                                                                    Sahabiye, Sivas Blv.<br/>No:15 D:E, Kocasinan<br/>Kayseri
                                                                </a>
                                                            </td>
                                                        </tr>
                                                    </table>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>

                            <!-- Working Hours -->
                            <div style="background-color: rgba(59, 130, 246, 0.1); border-left: 4px solid #3b82f6; padding: 16px; border-radius: 8px; margin: 0 0 30px 0;">
                                <p style="margin: 0; color: #e2e8f0; font-size: 14px;">
                                    <strong style="color: #60a5fa;">⏰ Çalışma Saatleri:</strong> Pazartesi - Cumartesi | 09:00 - 19:00
                                </p>
                            </div>

                            <!-- Social Media & Links -->
                            <table width="100%" cellpadding="0" cellspacing="0" style="margin: 0 0 20px 0;">
                                <tr>
                                    <td style="text-align: center;">
                                        <a href="https://maps.google.com/?q=Sahabiye,+Sivas+Blv.+No:15+D:E,+38010+Kocasinan/Kayseri" target="_blank" style="display: inline-block; margin: 0 8px; padding: 10px 20px; background-color: rgba(59, 130, 246, 0.2); color: #60a5fa; text-decoration: none; border-radius: 6px; font-size: 13px; font-weight: 600; border: 1px solid rgba(59, 130, 246, 0.3);">
                                            🗺️ Haritada Gör
                                        </a>
                                        <a href="tel:+905415713850" style="display: inline-block; margin: 0 8px; padding: 10px 20px; background-color: rgba(16, 185, 129, 0.2); color: #34d399; text-decoration: none; border-radius: 6px; font-size: 13px; font-weight: 600; border: 1px solid rgba(16, 185, 129, 0.3);">
                                            📞 Hemen Ara
                                        </a>
                                    </td>
                                </tr>
                            </table>

                            <!-- Divider -->
                            <div style="height: 1px; background: linear-gradient(90deg, transparent 0%, rgba(148, 163, 184, 0.3) 50%, transparent 100%); margin: 30px 0;"></div>

                            <!-- Footer Note -->
                            <p style="margin: 0; color: #64748b; font-size: 12px; line-height: 1.6;">
                                Bu email otomatik olarak gönderilmiştir.<br/>
                                Cihazınızın durumu hakkında güncel bilgi almak için takip kodunuzu kullanabilirsiniz.
                            </p>
                            
                            <!-- Copyright -->
                            <p style="margin: 15px 0 0 0; color: #475569; font-size: 11px;">
                                © ${new Date().getFullYear()} ZK İletişim. Tüm hakları saklıdır.
                            </p>
                        </td>
                    </tr>

                </table>
            </td>
        </tr>
    </table>
</body>
</html>
    `
}
