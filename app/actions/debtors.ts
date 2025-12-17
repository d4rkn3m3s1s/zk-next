"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { logAction } from "@/lib/logger";

export interface Debtor {
    id: number;
    name: string;
    phone: string;
    balance: number;
    taxOffice?: string;
    taxNumber?: string;
    city?: string;
    district?: string;
    notes?: string;
}

export type GetDebtorsResponse =
    | { success: true; da: Debtor[] }
    | { success: false; error: string; da?: never };

export async function getDebtors(): Promise<GetDebtorsResponse> {
    try {
        const debtors = await prisma.debtor.findMany({
            orderBy: { balance: 'desc' }
        });

        const mappedDebtors: Debtor[] = debtors.map((d: any) => ({
            id: d.id,
            name: d.name,
            phone: d.phone || "",
            balance: Number(d.balance),
            taxOffice: d.taxOffice || "",
            taxNumber: d.taxNumber || "",
            city: d.city || "",
            district: d.district || "",
            notes: d.notes || ""
        }));

        return { success: true, da: mappedDebtors };
    } catch (error: any) {
        console.error("Error fetching debtors:", error);
        return { success: false, error: error.message };
    }
}

export async function getDebtorById(id: number): Promise<{ success: true; debtor: Debtor } | { success: false; error: string }> {
    try {
        const debtor = await prisma.debtor.findUnique({
            where: { id }
        });

        if (!debtor) {
            return { success: false, error: "Debtor not found" };
        }

        return {
            success: true,
            debtor: {
                id: debtor.id,
                name: debtor.name,
                phone: debtor.phone || "",
                balance: Number(debtor.balance),
                taxOffice: debtor.taxOffice || "",
                taxNumber: debtor.taxNumber || "",
                city: debtor.city || "",
                district: debtor.district || "",
                notes: debtor.notes || ""
            }
        };
    } catch (error: any) {
        console.error("Error fetching debtor:", error);
        return { success: false, error: error.message };
    }
}

export async function createDebtor(data: {
    name: string;
    phone?: string;
    balance: number;
    city?: string;
    district?: string;
    notes?: string;
}) {
    try {
        const debtor = await prisma.debtor.create({
            data: {
                name: data.name,
                phone: data.phone,
                balance: data.balance,
                city: data.city,
                district: data.district,
                notes: data.notes
            }
        });

        await logAction("CREATE", "Debtor", debtor.id, { name: debtor.name, balance: debtor.balance });

        revalidatePath('/admin/debtors');
        return { success: true };
    } catch (error: any) {
        console.error("Error creating debtor:", error);
        return { success: false, error: error.message };
    }
}

export async function processPayment(id: number, amount: number, description?: string) {
    try {
        const debtor = await prisma.debtor.findUnique({ where: { id } });
        if (!debtor) throw new Error("Debtor not found");

        const newBalance = Number(debtor.balance) - amount;

        // Transaction + Update in Transaction (Prisma Transaction)
        await prisma.$transaction([
            prisma.debtor.update({
                where: { id },
                data: { balance: newBalance }
            }),
            prisma.debtorTransaction.create({
                data: {
                    debtorId: id,
                    type: "PAYMENT",
                    amount: amount,
                    description: description || "Ödeme Alındı"
                }
            })
        ]);

        await logAction("PAYMENT", "Debtor", id, { amount, description: description || "Ödeme Alındı", newBalance });

        revalidatePath(`/admin/debtors/${id}`);
        revalidatePath('/admin/debtors');
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function addDebt(id: number, amount: number, description?: string) {
    try {
        const debtor = await prisma.debtor.findUnique({ where: { id } });
        if (!debtor) throw new Error("Debtor not found");

        const newBalance = Number(debtor.balance) + amount;

        await prisma.$transaction([
            prisma.debtor.update({
                where: { id },
                data: { balance: newBalance }
            }),
            prisma.debtorTransaction.create({
                data: {
                    debtorId: id,
                    type: "DEBT",
                    amount: amount,
                    description: description || "Borç Eklendi"
                }
            })
        ]);

        await logAction("ADD_DEBT", "Debtor", id, { amount, description: description || "Borç Eklendi", newBalance });

        revalidatePath(`/admin/debtors/${id}`);
        revalidatePath('/admin/debtors');
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function deleteDebtor(id: number) {
    try {
        await prisma.debtor.delete({ where: { id } });
        await logAction("DELETE", "Debtor", id, "Deleted debtor");
        revalidatePath('/admin/debtors');
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}
