import { getSystemLogs } from "@/app/actions/logs"
import { format } from "date-fns"
import { tr } from "date-fns/locale"

export default async function SystemLogsPage({
    searchParams,
}: {
    searchParams: Promise<{
        page?: string
    }>
}) {
    const params = await searchParams
    const page = Number(params?.page) || 1
    const { logs, totalPages } = await getSystemLogs(page)

    return (
        <div className="container mx-auto py-10">
            <h1 className="text-3xl font-bold mb-6">Sistem Kayıtları</h1>

            <div className="rounded-md border">
                <table className="w-full text-sm text-left">
                    <thead className="bg-muted/50 text-muted-foreground uppercase">
                        <tr>
                            <th className="px-6 py-3">Tarih</th>
                            <th className="px-6 py-3">Seviye</th>
                            <th className="px-6 py-3">Eylem</th>
                            <th className="px-6 py-3">Varlık</th>
                            <th className="px-6 py-3">Kullanıcı</th>
                            <th className="px-6 py-3">Detaylar</th>
                        </tr>
                    </thead>
                    <tbody>
                        {logs.map((log) => (
                            <tr key={log.id} className="border-b hover:bg-muted/50 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {format(new Date(log.createdAt), "dd MMM yyyy HH:mm", { locale: tr })}
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${log.severity === 'CRITICAL' ? 'bg-red-100 text-red-800' :
                                        log.severity === 'WARNING' ? 'bg-yellow-100 text-yellow-800' :
                                            'bg-blue-100 text-blue-800'
                                        }`}>
                                        {log.severity}
                                    </span>
                                </td>
                                <td className="px-6 py-4 font-medium">{log.action}</td>
                                <td className="px-6 py-4">{log.entity}</td>
                                <td className="px-6 py-4 text-muted-foreground">{log.username || '-'}</td>
                                <td className="px-6 py-4 max-w-md truncate" title={log.details || ''}>
                                    {log.details}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="mt-4 flex justify-between items-center text-sm text-muted-foreground">
                <div>Sayfa {page} / {totalPages}</div>
                <div className="flex gap-2">
                    {page > 1 && (
                        <a href={`/admin/logs?page=${page - 1}`} className="px-4 py-2 border rounded hover:bg-muted">
                            Önceki
                        </a>
                    )}
                    {page < totalPages && (
                        <a href={`/admin/logs?page=${page + 1}`} className="px-4 py-2 border rounded hover:bg-muted">
                            Sonraki
                        </a>
                    )}
                </div>
            </div>
        </div>
    )
}
