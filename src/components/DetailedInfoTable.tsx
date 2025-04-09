import { FC } from 'react'

import TextCard from './TextCard'

import { SubscriptionInterface } from '../interfaces'

interface DetailedInfoTableProps {
    dataType: "trials" | "subscriptions"
    data: SubscriptionInterface[] | { id: number, name: string, trialEndDate: string, icon: string }[]
}

const DetailedInfoTable: FC<DetailedInfoTableProps> = ({ dataType, data }) => {

    let tableContent;
    let tableWith;

    function getDaysLeft(dateString: string) {
        const today = new Date();
        const upcomingDate = new Date(dateString)

        today.setHours(0, 0, 0, 0);
        upcomingDate.setHours(0, 0, 0, 0);

        const diffTime = upcomingDate.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        // return diffDays > 0 ? `${diffDays} days left` : "today";

        if (diffDays > 0) {
            return `${diffDays} days left`
        } else if (diffDays === 0) {
            return "today"
        } else {
            return "not active"
        }
    }

    function renderDinamicTextCard(leftDays: string) {

        const days = leftDays.split(" ");

        if (Number(days[0]) >= 15) {
            return <TextCard backgroundColor="success">{leftDays}</TextCard>
        }

        if (Number(days[0]) >= 9) {
            return <TextCard backgroundColor="info">{leftDays}</TextCard>
        }

        if (Number(days[0]) >= 3) {
            return <TextCard backgroundColor="warning">{leftDays}</TextCard>
        }

        if (Number(days[0]) >= 1 || isNaN(Number(days[0]))) {
            return <TextCard backgroundColor="error">{leftDays}</TextCard>
        }
    }

    switch (dataType) {
        case "subscriptions":
            const subscriptions = data as SubscriptionInterface[];
            tableWith = "w-full";
            tableContent = <table className="table">
                {/* head */}
                <thead className="text-secondary">
                    <tr>
                        <th>Subscription</th>
                        <th>Price</th>
                        <th>Currency</th>
                        <th>Billing Cycle</th>
                        <th>Payment Method</th>
                        <th>Upcomming Payment</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody className="text-secondary">
                    {/* row 1 */}
                    {subscriptions.map((subscription: SubscriptionInterface) => <tr key={subscription.id}>
                        <td>
                            <div className="flex items-center gap-3">
                                <div className="avatar">
                                    <div className="mask mask-squircle h-12 w-12">
                                        <img
                                            src={subscription.icon}
                                            alt="icon" />
                                    </div>
                                </div>
                                <div>
                                    <div className="font-bold">{subscription.name}</div>
                                </div>
                            </div>
                        </td>
                        <td>
                            <span className="py-2 px-2 rounded-lg bg-neutral-300">{subscription.price}{subscription.currency}</span>
                        </td>
                        <td>
                            <span className="py-2 px-4 rounded-lg bg-neutral-300">{subscription.currency}</span>
                        </td>
                        <td>
                            <span className="py-2 px-1 rounded-lg bg-neutral-300">
                                {subscription.typeOfPayment}</span>
                        </td>
                        <td>
                            <span className="py-2 px-1 rounded-lg bg-neutral-300">{subscription.paymentMethod}</span>
                        </td>
                        <td>
                            {renderDinamicTextCard(getDaysLeft(subscription.upcommingPayment))}
                        </td>
                    </tr>)}
                </tbody>
            </table>
            break;

        case "trials":
            const trials = data as { id: number, name: string, trialEndDate: string, icon: string }[];
            tableWith = "w-[500px]";
            tableContent = <table className="table">
                {/* head */}
                <thead className="text-secondary">
                    <tr>
                        <th>Trial</th>
                        <th>Trial ends at</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody className="text-secondary">
                    {/* row 1 */}
                    {trials.map((trial: { id: number, name: string, trialEndDate: string, icon: string }) => <tr key={trial.id}>
                        <td>
                            <div className="flex items-center gap-3">
                                <div className="avatar">
                                    <div className="mask mask-squircle h-12 w-12">
                                        <img
                                            src={trial.icon}
                                            alt="icon" />
                                    </div>
                                </div>
                                <div>
                                    <div className="font-bold">{trial.name}</div>
                                </div>
                            </div>
                        </td>
                        <td>
                            {renderDinamicTextCard(getDaysLeft(trial.trialEndDate))}
                        </td>
                    </tr>)}
                </tbody>
            </table>
    }

    return (
        <div className={`bg-neutral-200 rounded-lg ${tableWith} mb-8 overflow-auto`}>
            {tableContent}
        </div>
    )
}

export default DetailedInfoTable