'use server'

import nodemailer from 'nodemailer'
import { prisma } from '@/lib/prisma'
import { statusMessages } from './email-config'
import { generateEmailHTML } from './email-template'

// Create reusable transporter
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
})

interface RepairEmailData {
    repairId: number
    customerName: string
    customerEmail: string
    trackingCode: string
    deviceModel: string
    estimatedCost?: number
    status: string
}

export async function sendRepairStatusEmail(repair: RepairEmailData) {
    const statusInfo = statusMessages[repair.status] || statusMessages.received

    const trackingUrl = `${process.env.NEXTAUTH_URL}/repair-tracking?code=${repair.trackingCode}`
    const subject = `${statusInfo.subject} - ${repair.trackingCode}`

    const htmlContent = generateEmailHTML(repair, statusInfo, trackingUrl)

    try {
        await transporter.sendMail({
            from: `"${process.env.FROM_NAME}" <${process.env.FROM_EMAIL}>`,
            to: repair.customerEmail,
            subject: subject,
            html: htmlContent,
        })

        console.log(`✅ Email sent to ${repair.customerEmail} for status: ${repair.status}`)

        // Log successful email to database
        await prisma.emailLog.create({
            data: {
                repairId: repair.repairId,
                recipient: repair.customerEmail,
                subject: subject,
                status: 'sent',
                statusType: repair.status,
            }
        })

        return { success: true }
    } catch (error) {
        console.error('❌ Email sending failed:', error)

        // Log failed email to database
        await prisma.emailLog.create({
            data: {
                repairId: repair.repairId,
                recipient: repair.customerEmail,
                subject: subject,
                status: 'failed',
                statusType: repair.status,
                error: error instanceof Error ? error.message : 'Unknown error'
            }
        })

        return { success: false, error }
    }
}
