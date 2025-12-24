import { createLog } from "@/lib/logger"

// ... existing imports

const isPasswordValid = await bcrypt.compare(credentials.password, user.password)

if (!isPasswordValid) {
    return null
}

// Log Successful Login
await createLog(
    'LOGIN',
    'Auth',
    `User ${user.username} logged in successfully`,
    user.username,
    'WARNING' // Warning level to track admin logins visibly
)

return {
    id: user.id.toString(),
    name: user.username,
    email: user.email,
    role: user.role,
}
            }
        })
    ],
callbacks: {
        async session({ session, token }) {
        if (session?.user) {
            session.user.role = token.role as string
            session.user.id = token.id as string
        }
        return session
    },
        async jwt({ token, user }) {
        if (user) {
            token.role = user.role
            token.id = user.id.toString()
        }
        return token
    }
},
pages: {
    signIn: '/auth/login',
    },
session: {
    strategy: "jwt"
}
})

export { handler as GET, handler as POST }
