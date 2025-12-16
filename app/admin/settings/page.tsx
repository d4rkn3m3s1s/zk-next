
import { getSettings, updateSettings } from "@/app/actions/settings"
import { getUsers } from "@/app/actions/user"
import { SettingsForm, SettingsFormReal } from "@/components/admin/SettingsForm"

export default async function AdminSettingsPage() {
    // Fetch settings on server
    const settings = await getSettings()
    // Fetch users for Team tab
    const users = await getUsers()

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-foreground">Ayarlar</h2>
                    <p className="text-muted-foreground">Site genel ayarlarını buradan yönetebilirsiniz.</p>
                </div>
            </div>
            {/* Pass settings to client form wrapper */}
            <SettingsFormReal settings={settings} users={users} />
        </div>
    )
}
