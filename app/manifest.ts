
import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'ZK İletişim',
        short_name: 'ZK',
        description: 'Kadıköy Telefon Tamiri ve Aksesuar Mağazası',
        start_url: '/',
        display: 'standalone',
        background_color: '#020204',
        theme_color: '#00F0FF',
        icons: [
            {
                src: '/favicon.ico',
                sizes: 'any',
                type: 'image/x-icon',
            },
        ],
    }
}
