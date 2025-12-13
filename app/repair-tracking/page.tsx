import { getPublicRepairStatus } from "@/app/actions/repair"
import RepairTrackingClient from "./client"

export default async function RepairTrackingPage({
    searchParams,
}: {
    searchParams: Promise<{ code?: string }>
}) {
    const { code } = await searchParams
    const repair = code ? await getPublicRepairStatus(code) : null

    return <RepairTrackingClient initialCode={code} repair={repair} />
}
