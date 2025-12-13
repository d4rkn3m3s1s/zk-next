
import { getSettings, updateSettings } from "@/app/actions/settings"
import { SettingsForm } from "@/components/admin/SettingsForm"

export default async function AdminSettingsPage() {
    // Fetch settings on server
    const settings = await getSettings()

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-foreground">Ayarlar</h2>
                    <p className="text-muted-foreground">Site genel ayarlarını buradan yönetebilirsiniz.</p>
                </div>
            </div>
            {/* Pass settings to client form wrapper */}
            <SettingsForm settings={settings} />
        </div>
    )
}
