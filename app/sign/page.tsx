'use client'

import { useState } from 'react'
import BasicCard from '@/components/basic-card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

const Sign = () => {
    const [requestId, setRequestId] = useState<string>('')
    const router = useRouter()

    return (
        <div className="flex flex-row items-center justify-center mt-8">
            <BasicCard
                title="Find request"
                description="Find and verify a fund request using your wallet."
                className="min-w-[400px] p-4"
            >
                <Input
                    placeholder="Enter request address"
                    value={requestId}
                    onChange={(e) => setRequestId(e.target.value)}
                />

                <Button
                    className="mt-4"
                    onClick={() => {
                        console.log('Sign request')
                        router.push(`/sign/${requestId}`)
                    }}
                >
                    Go to request page
                </Button>
            </BasicCard>
        </div>
    )
}

export default Sign
