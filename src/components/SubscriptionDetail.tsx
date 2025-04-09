import { FC } from 'react'

interface SubscriptionDetailProps {
    title: string,
    value: string | number
}

const SubscriptionDetail: FC<SubscriptionDetailProps> = ({ title, value }) => {
    return (
        <p className="font-medium text-secondary p-1">{title} <span className="py-2 px-4 rounded-lg bg-neutral-300">{value}</span></p>
    )
}

export default SubscriptionDetail