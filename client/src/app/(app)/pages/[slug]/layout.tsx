import PublicFooter from '@/components/pages/PublicFooter'
import PublicHeader from '@/components/pages/PublicHeader'
import React from 'react'

function layout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <PublicHeader />
            {children}
            <PublicFooter />
        </>
    )
}

export default layout