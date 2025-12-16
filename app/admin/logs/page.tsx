import { prisma } from "@/lib/prisma";
import { format } from "date-fns";
import { tr } from "date-fns/locale";

export const dynamic = 'force-dynamic';

export default async function LogsPage() {
    const logs = await prisma.auditLog.findMany({
        take: 100,
        orderBy: { createdAt: 'desc' }
    });

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight text-foreground">İşlem Geçmişi</h2>
                <p className="text-muted-foreground">Sistem üzerindeki son işlemleri takip edin.</p>
            </div>

            <div className="rounded-md border border-white/10 bg-black/20 overflow-hidden">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-white/10 bg-white/5">
                            <th className="p-4 text-left font-medium text-slate-300">Tarih</th>
                            <th className="p-4 text-left font-medium text-slate-300">Kullanıcı</th>
                            <th className="p-4 text-left font-medium text-slate-300">İşlem</th>
                            <th className="p-4 text-left font-medium text-slate-300">Modül</th>
                            <th className="p-4 text-left font-medium text-slate-300">Detaylar</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {logs.map((log) => (
                            <tr key={log.id} className="hover:bg-white/5 transition-colors">
                                <td className="p-4 text-slate-400 whitespace-nowrap">
                                    {format(new Date(log.createdAt), 'dd MMM yyyy HH:mm', { locale: tr })}
                                </td>
                                <td className="p-4 text-slate-300 font-medium">{log.username || 'Sistem'}</td>
                                <td className="p-4">
                                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium 
                                        ${log.action === 'CREATE' ? 'bg-green-500/10 text-green-500' :
                                            log.action === 'DELETE' ? 'bg-red-500/10 text-red-500' :
                                                log.action === 'UPDATE' ? 'bg-blue-500/10 text-blue-500' :
                                                    'bg-slate-500/10 text-slate-500'}`}>
                                        {log.action}
                                    </span>
                                </td>
                                <td className="p-4 text-slate-300">{log.entity} <span className="text-slate-500 text-xs">#{log.entityId}</span></td>
                                <td className="p-4 text-slate-400 font-mono text-xs max-w-md truncate" title={log.details || ''}>
                                    {log.details}
                                </td>
                            </tr>
                        ))}
                        {logs.length === 0 && (
                            <tr>
                                <td colSpan={5} className="p-8 text-center text-slate-500">
                                    Henüz kayıt bulunamadı.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
