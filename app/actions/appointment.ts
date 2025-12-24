'use server'

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { sendTelegramMessage } from "@/lib/telegram"

export async function getAppointments(query?: string) {
    const appointments = await prisma.appointment.findMany({
        where: query ? {
            OR: [
                { name: { contains: query } },
                { phone: { contains: query } }
            ]
        } : undefined,
        orderBy: { date: 'asc' }
    })
    return appointments
}

export async function getAppointment(id: number) {
    const appointment = await prisma.appointment.findUnique({
        where: { id }
    })
    return appointment
}

export async function updateAppointmentStatus(id: number, status: string) {
    await prisma.appointment.update({
        where: { id },
        data: { status }
    })
    revalidatePath("/admin/appointments")
    revalidatePath(`/admin/appointments/${id}`)
}

export async function deleteAppointment(id: number) {
    await prisma.appointment.delete({
        where: { id }
    })
    revalidatePath("/admin/appointments")
}

export async function createAppointment(data: {
    name: string
    phone: string
    date: Date
    time: string
    description?: string
}) {
    await prisma.appointment.create({
        data: {
            name: data.name,
            phone: data.phone,
            date: data.date,
            time: data.time,
            description: data.description,
            status: 'pending'
        }
    })
    revalidatePath("/admin/appointments")
}

export async function createAppointmentAction(formData: FormData) {
    const name = formData.get("name") as string
    const phone = formData.get("phone") as string
    const date = new Date(formData.get("date") as string)
    const time = formData.get("time") as string
    const description = formData.get("description") as string

    await prisma.appointment.create({
        data: {
            name,
            phone,
            date,
            time,
            description,
            status: 'pending'
        }
    })

    // Telegram Notification
    try {
        await sendTelegramMessage(
            `📅 <b>New Appointment Request!</b>\n\n` +
            `👤 <b>Name:</b> ${name}\n` +
            `📞 <b>Phone:</b> ${phone}\n` +
            `🗓️ <b>Date:</b> ${date.toLocaleDateString('tr-TR')} ${time}\n` +
            `📝 <b>Note:</b> ${description}`
        )
    } catch (e) {
        console.error("Telegram notification failed:", e)
    }

    revalidatePath("/admin/appointments")
    return { success: true }
}
