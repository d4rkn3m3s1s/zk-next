"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { UserCog, Shield, Download, ChevronDown, CheckCircle, XCircle } from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { bulkDeleteUsers, bulkUpdateUserStatus } from "@/app/actions/user"

interface User {
    id: number
    username: string
    email: string
    role: string
    isActive: boolean
    phone: string | null
    createdAt: Date
    orders: any[]
}

const roleConfig: Record<string, { label: string, color: "default" | "secondary" | "destructive" | "outline" }> = {
    admin: { label: "Yönetici", color: "destructive" },
    technician: { label: "Teknisyen", color: "default" },
    user: { label: "Müşteri", color: "secondary" }
}

export function UserTable({ users }: { users: User[] }) {
    const router = useRouter()
    const [selectedIds, setSelectedIds] = useState<number[]>([])

    const toggleSelectAll = () => {
        if (selectedIds.length === users.length) {
            setSelectedIds([])
        } else {
            setSelectedIds(users.map(u => u.id))
        }
    }

    const toggleSelect = (id: number) => {
        if (selectedIds.includes(id)) {
            setSelectedIds(selectedIds.filter(i => i !== id))
        } else {
            setSelectedIds([...selectedIds, id])
        }
    }

    const handleBulkDelete = async () => {
        if (!confirm(`${selectedIds.length} kullanıcıyı silmek istediğinize emin misiniz?`)) return
        await bulkDeleteUsers(selectedIds)
        setSelectedIds([])
        router.refresh()
    }

    const handleBulkStatus = async (isActive: boolean) => {
        await bulkUpdateUserStatus(selectedIds, isActive)
        setSelectedIds([])
        router.refresh()
    }

    const handleExport = () => {
        const headers = ["ID", "Username", "Email", "Role", "Phone", "Status", "Created At"]
        const csvContent = [
            headers.join(","),
            ...users.map(u => [
                u.id,
                `"${u.username.replace(/"/g, '""')}"`,
                u.email,
                u.role,
                u.phone || "",
                u.isActive ? "Active" : "Passive",
                new Date(u.createdAt).toISOString()
            ].join(","))
        ].join("\n")

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
        const link = document.createElement("a")
        const url = URL.createObjectURL(blob)
        link.setAttribute("href", url)
        link.setAttribute("download", "users.csv")
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">{users.length} kullanıcı listeleniyor</span>
                    {selectedIds.length > 0 && (
                        <span className="text-sm font-medium text-primary">({selectedIds.length} seçildi)</span>
                    )}
                </div>
                <div className="flex items-center gap-2">
                    {selectedIds.length > 0 && (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" className="gap-2">
                                    Toplu İşlemler <ChevronDown className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuLabel>Seçili Kullanıcıları...</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => handleBulkStatus(true)}>
                                    <CheckCircle className="h-4 w-4 mr-2" /> Aktif Yap
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleBulkStatus(false)}>
                                    <XCircle className="h-4 w-4 mr-2" /> Pasif Yap (Askıya Al)
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={handleBulkDelete} className="text-destructive">
                                    Sil
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}
                    <Button variant="outline" onClick={handleExport} className="gap-2">
                        <Download className="h-4 w-4" /> CSV İndir
                    </Button>
                </div>
            </div>

            <div className="rounded-md border border-border bg-card shadow-sm">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[50px]">
                                <Checkbox
                                    checked={users.length > 0 && selectedIds.length === users.length}
                                    onCheckedChange={toggleSelectAll}
                                />
                            </TableHead>
                            <TableHead>Kullanıcı</TableHead>
                            <TableHead>Rol</TableHead>
                            <TableHead>Durum</TableHead>
                            <TableHead>Telefon</TableHead>
                            <TableHead>Kayıt Tarihi</TableHead>
                            <TableHead className="text-right">İşlemler</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {users.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center py-10 text-muted-foreground">
                                    Kullanıcı bulunamadı.
                                </TableCell>
                            </TableRow>
                        ) : (
                            users.map((user) => {
                                const role = roleConfig[user.role] || roleConfig.user
                                return (
                                    <TableRow key={user.id}>
                                        <TableCell>
                                            <Checkbox
                                                checked={selectedIds.includes(user.id)}
                                                onCheckedChange={() => toggleSelect(user.id)}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <Avatar className="h-9 w-9">
                                                    <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`} />
                                                    <AvatarFallback>{user.username.substring(0, 2).toUpperCase()}</AvatarFallback>
                                                </Avatar>
                                                <div className="flex flex-col">
                                                    <span className="font-medium">{user.username}</span>
                                                    <span className="text-xs text-muted-foreground">{user.email}</span>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={role.color} className="gap-1">
                                                {user.role === 'admin' && <Shield className="h-3 w-3" />}
                                                {role.label}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={user.isActive ? "outline" : "secondary"} className={user.isActive ? "text-green-500 border-green-500/20 bg-green-500/10" : "text-muted-foreground"}>
                                                {user.isActive ? "Aktif" : "Pasif"}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>{user.phone || "-"}</TableCell>
                                        <TableCell>{new Date(user.createdAt).toLocaleDateString('tr-TR')}</TableCell>
                                        <TableCell className="text-right">
                                            <Link href={`/admin/users/${user.id}`}>
                                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                                    <UserCog className="h-4 w-4" />
                                                </Button>
                                            </Link>
                                        </TableCell>
                                    </TableRow>
                                )
                            })
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
