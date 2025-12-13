import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Search, Filter, Plus } from "lucide-react"
import { Input } from "@/components/ui/input"
import { getUsers } from "@/app/actions/user"
import { UserTable } from "./UserTable"

export default async function AdminUsersPage({ searchParams }: { searchParams: Promise<{ q?: string, role?: string, status?: string }> }) {
    const { q: query, role, status } = await searchParams

    // Parse status string to boolean or undefined
    let isActive: boolean | undefined = undefined
    if (status === 'active') isActive = true
    if (status === 'passive') isActive = false

    const users = await getUsers({ query, role, isActive })

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-foreground">Kullanıcılar</h2>
                    <p className="text-muted-foreground">Sistemdeki kullanıcıları ve rollerini yönetin.</p>
                </div>
                {/* Optional: Add New User button if needed */}
            </div>

            <div className="bg-card p-4 rounded-lg border border-border shadow-sm space-y-4">
                <form action="/admin/users" method="GET" className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <div className="relative col-span-2 lg:col-span-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            name="q"
                            defaultValue={query}
                            placeholder="İsim veya e-posta ara..."
                            className="pl-9 bg-background"
                        />
                    </div>

                    <select
                        name="role"
                        defaultValue={role}
                        className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <option value="">Tüm Roller</option>
                        <option value="user">Müşteri</option>
                        <option value="admin">Yönetici</option>
                        <option value="technician">Teknisyen</option>
                    </select>

                    <select
                        name="status"
                        defaultValue={status}
                        className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <option value="">Tüm Durumlar</option>
                        <option value="active">Aktif</option>
                        <option value="passive">Pasif</option>
                    </select>

                    <div className="flex gap-2 justify-end lg:col-start-4">
                        <Button type="submit" variant="secondary" className="gap-2 w-full">
                            <Filter className="h-4 w-4" /> Filtrele
                        </Button>
                        <Link href="/admin/users">
                            <Button variant="outline" type="button">Temizle</Button>
                        </Link>
                    </div>
                </form>
            </div>

            <UserTable users={users as any} />
        </div>
    )
}
