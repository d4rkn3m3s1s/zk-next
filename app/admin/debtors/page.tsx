import { getDebtors } from "@/app/actions/debtors";
import { DebtorList } from "@/components/admin/DebtorList";
import { AlertCircle } from "lucide-react";

export default async function DebtorsPage() {
    const result = await getDebtors();

    if (!result.success || !result.da) {
        return (
            <div className="p-8 flex items-center justify-center min-h-[50vh]">
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-6 py-4 rounded-xl flex items-center gap-3">
                    <AlertCircle className="size-5" />
                    <p>Veriler yüklenirken bir sorun oluştu: {result.error || "Bilinmeyen hata"}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8 pb-20">
            {/* Page Header */}
            <div>
                <h1 className="text-4xl font-bold font-display tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-purple-200 to-purple-400 drop-shadow-[0_0_15px_rgba(168,85,247,0.5)]">
                    Alacak Defteri
                </h1>
                <p className="text-slate-400 mt-2 max-w-2xl">
                    Dükkana borcu olan müşterilerin detaylı listesi ve yönetim paneli.
                </p>
            </div>

            <DebtorList initialDebtors={result.da} />
        </div>
    );
}
