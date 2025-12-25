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
    trackingUrl: string,
    settings?: any
) {
    const year = new Date().getFullYear();
    const primaryColor = statusInfo.color || '#06b6d4';
    const siteName = settings?.siteName || 'ZK İletişim';
    const logoUrl = settings?.emailLogo || 'https://zkiletisim.com/logo.png';

    return `
<!DOCTYPE html>
<html lang="tr">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${statusInfo.subject}</title>
    <!--[if mso]>
    <style type="text/css">
        body, table, td, p, h1, h2, h3 { font-family: Arial, sans-serif !important; }
    </style>
    <![endif]-->
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #020204; color: #ffffff;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #020204; padding: 40px 10px;">
        <tr>
            <td align="center">
                <!-- Outer Container -->
                <table width="600" cellpadding="0" cellspacing="0" style="max-width: 600px; width: 100%; position: relative;">
                    
                    <!-- Decorative Background Glow -->
                    <tr>
                        <td align="center" style="padding-bottom: 30px;">
                            <img src="${logoUrl}" alt="${siteName}" style="height: 60px; width: auto; display: block; filter: drop-shadow(0 0 10px ${primaryColor}50);">
                        </td>
                    </tr>

                    <!-- Main Card -->
                    <tr>
                        <td style="background-color: #0a0a0c; border: 1px solid #1e293b; border-radius: 32px; padding: 40px; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);">
                            
                            <!-- Header Info -->
                            <table width="100%" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td align="center" style="padding-bottom: 30px;">
                                        <div style="display: inline-block; padding: 8px 16px; border-radius: 100px; background-color: ${primaryColor}15; border: 1px solid ${primaryColor}30;">
                                            <span style="color: ${primaryColor}; font-family: monospace; font-size: 12px; font-weight: bold; letter-spacing: 2px; text-transform: uppercase;">REPAIR_STATUS_UPDATE</span>
                                        </div>
                                        <h1 style="margin: 20px 0 10px 0; color: #ffffff; font-size: 32px; font-weight: 900; tracking-tighter; letter-spacing: -0.5px;">${statusInfo.title}</h1>
                                        <p style="margin: 0; color: #94a3b8; font-size: 16px; font-weight: 300;">Merhaba ${repair.customerName}, cihazınız için yeni bir gelişme var.</p>
                                    </td>
                                </tr>
                            </table>

                            <!-- Message Body -->
                            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 30px;">
                                <tr>
                                    <td style="background-color: #111114; border: 1px solid #1e293b; border-radius: 20px; padding: 25px; text-align: center;">
                                        <p style="margin: 0; color: #e2e8f0; font-size: 16px; line-height: 1.6;">
                                            ${statusInfo.message}
                                        </p>
                                    </td>
                                </tr>
                            </table>

                            <!-- Details Table -->
                            <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #020204; border: 1px solid #1e293b; border-radius: 20px; margin-bottom: 40px; overflow: hidden;">
                                <tr>
                                    <td style="padding: 24px;">
                                        <table width="100%" cellpadding="0" cellspacing="0">
                                            <tr>
                                                <td style="padding: 8px 0; border-bottom: 1px solid #1e293b;">
                                                    <span style="color: #64748b; font-size: 13px; text-transform: uppercase; font-weight: bold;">Takip Kodu</span><br/>
                                                    <span style="color: #ffffff; font-size: 18px; font-weight: 900; font-family: monospace;">${repair.trackingCode}</span>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="padding: 16px 0; border-bottom: 1px solid #1e293b;">
                                                    <span style="color: #64748b; font-size: 13px; text-transform: uppercase; font-weight: bold;">Cihaz Modeli</span><br/>
                                                    <span style="color: #ffffff; font-size: 16px; font-weight: 500;">${repair.deviceModel}</span>
                                                </td>
                                            </tr>
                                            ${repair.estimatedCost ? `
                                            <tr>
                                                <td style="padding: 16px 0;">
                                                    <span style="color: #64748b; font-size: 13px; text-transform: uppercase; font-weight: bold;">Tahmini Ücret</span><br/>
                                                    <span style="color: ${primaryColor}; font-size: 24px; font-weight: 900;">₺${repair.estimatedCost.toLocaleString('tr-TR')}</span>
                                                </td>
                                            </tr>
                                            ` : ''}
                                        </table>
                                    </td>
                                </tr>
                            </table>

                            <!-- CTA Button -->
                            <table width="100%" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td align="center">
                                        <a href="${trackingUrl}" style="display: inline-block; width: 100%; border-radius: 16px; background: linear-gradient(135deg, ${primaryColor} 0%, #3b82f6 100%); color: #ffffff; text-decoration: none; padding: 20px 0; font-size: 18px; font-weight: 900; text-transform: uppercase; letter-spacing: 1px; box-shadow: 0 10px 20px -5px ${primaryColor}50;">
                                            ONARIM DURUMUNU GÖRÜNTÜLE
                                        </a>
                                    </td>
                                </tr>
                            </table>

                        </td>
                    </tr>

                    <!-- 3D Inspired Contact Section -->
                    <tr>
                        <td style="padding: 40px 20px;">
                            <table width="100%" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td width="50%" style="padding-right: 10px;">
                                        <div style="background-color: #0a0a0c; border: 1px solid #1e293b; border-radius: 20px; padding: 20px;">
                                            <span style="color: #64748b; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; display: block; margin-bottom: 5px;">Müşteri Destek</span>
                                            <a href="tel:${settings?.phone || ''}" style="color: #ffffff; text-decoration: none; font-size: 16px; font-weight: bold;">${settings?.phone || '0541 571 38 50'}</a>
                                        </div>
                                    </td>
                                    <td width="50%" style="padding-left: 10px;">
                                        <div style="background-color: #0a0a0c; border: 1px solid #1e293b; border-radius: 20px; padding: 20px;">
                                            <span style="color: #64748b; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; display: block; margin-bottom: 5px;">Email Adresi</span>
                                            <a href="mailto:${settings?.email || ''}" style="color: #ffffff; text-decoration: none; font-size: 14px; font-weight: bold; overflow-wrap: break-word;">${settings?.email || 'info@zkiletisim.com'}</a>
                                        </div>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <!-- Footer Info -->
                    <tr>
                        <td align="center" style="padding: 0 40px 40px 40px;">
                            <p style="color: #475569; font-size: 14px; line-height: 1.6; margin-bottom: 20px;">
                                ${settings?.address || 'Sahabiye, Sivas Blv. No:15 D:E, Kocasinan, Kayseri'}
                            </p>
                            
                            <!-- Socials -->
                            <div style="margin-bottom: 30px;">
                                ${settings?.instagram ? `<a href="${settings.instagram}" style="display: inline-block; margin: 0 10px; color: #94a3b8; text-decoration: none; font-size: 12px; font-weight: bold;">INSTAGRAM</a>` : ''}
                                ${settings?.facebook ? `<a href="${settings.facebook}" style="display: inline-block; margin: 0 10px; color: #94a3b8; text-decoration: none; font-size: 12px; font-weight: bold;">FACEBOOK</a>` : ''}
                                ${settings?.twitter ? `<a href="${settings.twitter}" style="display: inline-block; margin: 0 10px; color: #94a3b8; text-decoration: none; font-size: 12px; font-weight: bold;">TWITTER</a>` : ''}
                            </div>

                            <div style="height: 1px; background: linear-gradient(90deg, transparent, #1e293b, transparent); margin-bottom: 30px;"></div>

                            <p style="color: #64748b; font-size: 12px; margin-bottom: 10px;">
                                ${settings?.emailSignature || 'Onarım süreciniz boyunca size destek olmaktan mutluluk duyuyoruz.'}
                            </p>
                            <p style="color: #475569; font-size: 11px;">
                                ${settings?.emailFooter || `© ${year} ${siteName}. Tüm hakları saklıdır.`}
                            </p>
                        </td>
                    </tr>

                </table>
            </td>
        </tr>
    </table>
</body>
</html>
    `;
}
