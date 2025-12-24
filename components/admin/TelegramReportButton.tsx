'use client'

import { useState } from "react"
import { sendDailyReport } from "@/app/actions/reports"
import { Button } from "@/components/ui/button"
import { Loader2, Send } from "lucide-react"
import { toast } from "sonner"

export function TelegramReportButton() {
    const [isLoading, setIsLoading] = useState(false)

    const handleSend = async () => {
        setIsLoading(true)
        try {
            const result = await sendDailyReport()
            if (result.success) {
                toast.success("Rapor Telegram'a gönderildi!")
            } else {
                toast.error("Rapor gönderilemedi.")
            }
        } catch (error) {
            toast.error("Hata oluştu.")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Button
            onClick={handleSend}
            disabled={isLoading}
            variant="outline"
            size="sm"
            className="gap-2 border-blue-500 text-blue-500 hover:bg-blue-50"
        >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            Günlük Raporu Gönder (Telegram)
        </Button>
    )
}
