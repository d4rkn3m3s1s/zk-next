import { Calendar, Clock, User } from "lucide-react"

export function TodayAppointmentsWidget({ appointments }: { appointments: any[] }) {
    return (
        <div className="bg-slate-900/50 border border-purple-500/20 rounded-2xl p-6 backdrop-blur-md relative overflow-hidden group">
            <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl group-hover:bg-purple-500/20 transition-colors"></div>

            <div className="flex items-center gap-2 mb-4 relative z-10">
                <div className="p-2 bg-purple-500/10 rounded-lg text-purple-400">
                    <Calendar className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-white">Bugünün Randevuları</h3>
            </div>

            <div className="space-y-3 relative z-10">
                {appointments.map((apt) => (
                    <div key={apt.id} className="flex gap-4 p-3 bg-black/40 rounded-xl border border-white/5 border-l-4 border-l-purple-500">
                        <div className="flex flex-col items-center justify-center px-2 border-r border-white/10">
                            <span className="text-lg font-black text-white">{apt.time}</span>
                            <Clock className="w-3 h-3 text-slate-500 mt-1" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-white">{apt.name}</p>
                            <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                                <User className="w-3 h-3" /> {apt.phone}
                            </p>
                            <p className="text-xs text-purple-400 mt-1">{apt.description || "Genel Kontrol"}</p>
                        </div>
                    </div>
                ))}
                {appointments.length === 0 && (
                    <div className="py-8 text-center text-slate-500 text-sm border border-dashed border-white/10 rounded-xl">
                        Bugün için randevu yok.
                    </div>
                )}
            </div>
        </div>
    )
}
