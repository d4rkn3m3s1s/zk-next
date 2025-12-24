"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Mail, RefreshCw, CheckCircle2, XCircle, Eye, Loader2 } from "lucide-react"
import { resendRepairEmail } from "@/app/actions/email"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { generateEmailHTML } from "@/lib/email-template"
import { statusMessages } from "@/lib/email-config"

interface EmailLog {
    id: number
    recipient: string
    subject: string
    status: string
    statusType: string
    error: string | null
    sentAt: Date
}

interface EmailHistoryProps {
    repairId: number
    customerName: string
    trackingCode: string
    deviceModel: string
    estimatedCost?: number
    emails: EmailLog[]
}


export function EmailHistory({ repairId, customerName, trackingCode, deviceModel, estimatedCost, emails }: EmailHistoryProps) {
    const [resending, setResending] = useState<number | null>(null)
    const [previewEmail, setPreviewEmail] = useState<EmailLog | null>(null)

    async function handleResend(emailId: number, statusType: string) {
        if (!confirm('Bu emaili tekrar göndermek istediğinize emin misiniz?')) return

        setResending(emailId)
        try {
            const result = await resendRepairEmail(repairId, statusType)
            if (result.success) {
                alert('✅ Email başarıyla gönderildi!')
            } else {
                alert('❌ Email gönderilemedi: ' + (result.error || 'Bilinmeyen hata'))
            }
        } catch (error) {
            alert('❌ Bir hata oluştu')
        } finally {
            setResending(null)
        }
    }

    if (emails.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Mail className="h-5 w-5" />
                        Email Geçmişi
                    </CardTitle>
                    <CardDescription>Henüz email gönderilmedi</CardDescription>
                </CardHeader>
            </Card>
        )
    }

    return (
        <>
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Mail className="h-5 w-5" />
                        Email Geçmişi
                    </CardTitle>
                    <CardDescription>Müşteriye gönderilen tüm emailler</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {emails.map((email) => (
                            <div key={email.id} className="flex items-start justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        {email.status === 'sent' ? (
                                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                                        ) : (
                                            <XCircle className="h-4 w-4 text-red-500" />
                                        )}
                                        <span className="font-medium">{email.subject}</span>
                                        <Badge variant={email.status === 'sent' ? 'default' : 'destructive'}>
                                            {email.status === 'sent' ? 'Gönderildi' : 'Başarısız'}
                                        </Badge>
                                    </div>
                                    <div className="text-sm text-muted-foreground">
                                        <div>Alıcı: {email.recipient}</div>
                                        <div>Tarih: {new Date(email.sentAt).toLocaleString('tr-TR')}</div>
                                        {email.error && (
                                            <div className="text-red-500 mt-1">Hata: {email.error}</div>
                                        )}
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setPreviewEmail(email)}
                                    >
                                        <Eye className="h-4 w-4 mr-1" />
                                        Önizle
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleResend(email.id, email.statusType)}
                                        disabled={resending === email.id}
                                    >
                                        {resending === email.id ? (
                                            <Loader2 className="h-4 w-4 animate-spin mr-1" />
                                        ) : (
                                            <RefreshCw className="h-4 w-4 mr-1" />
                                        )}
                                        Tekrar Gönder
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Email Preview Dialog */}
            <Dialog open={!!previewEmail} onOpenChange={() => setPreviewEmail(null)}>
                <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Email Önizleme</DialogTitle>
                        <DialogDescription>
                            {previewEmail?.subject}
                        </DialogDescription>
                    </DialogHeader>
                    {previewEmail && (
                        <div className="border rounded-lg p-4 bg-white">
                            <iframe
                                srcDoc={generateEmailHTML(
                                    {
                                        repairId,
                                        customerName,
                                        customerEmail: previewEmail.recipient,
                                        trackingCode,
                                        deviceModel,
                                        estimatedCost,
                                        status: previewEmail.statusType
                                    },
                                    statusMessages[previewEmail.statusType] || statusMessages.received,
                                    `${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}/repair-tracking?code=${trackingCode}`
                                )}
                                className="w-full h-[500px] border-0"
                                title="Email Preview"
                            />
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </>
    )
}
