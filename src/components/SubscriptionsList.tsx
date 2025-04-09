import { Ref, FC, useState } from 'react';

import Block from './Block';
import CustomButton from './CustomButton';

import { FaPlus } from 'react-icons/fa';

import { SubscriptionInterface } from '../interfaces';

interface SubscriptionListProps {
    subscriptions: SubscriptionInterface[],
    clickedSubscriptionRef: any,
    openAddModal: () => void,
    openEditModal: () => void
    openDeleteModal: () => void,
    onSetEditFormData: () => void,
    onClickContext: (event: MouseEvent, websiteLink: string, subscriptionId: number) => void
}

const SubscriptionsList: FC<SubscriptionListProps> = ({ subscriptions, clickedSubscriptionRef, openAddModal, openEditModal, openDeleteModal, onSetEditFormData, onClickContext }) => {


    function editSubscription(subscription: SubscriptionInterface) {
        clickedSubscriptionRef.current = subscription;
        onSetEditFormData()
    }


    return <div className="flex justify-center md:justify-start w-full gap-10 flex-wrap mb-8">
        <Block size="small" onClick={openAddModal}>
            <div className="h-full w-full flex items-center justify-center">
                <FaPlus className="text-secondary text-5xl" />
            </div>
        </Block>
        {subscriptions.map((subscription: SubscriptionInterface) => {

            return <Block size="small" key={subscription.id} onClickContext={(e) => onClickContext(e, subscription.websiteLink, subscription.id)}>
                <div className="flex justify-between">

                    <img src={subscription.icon} className="h-12" alt="" />
                    <p className="text-secondary"><span className="py-2 px-4 rounded-lg bg-neutral-300 text-sm">{subscription.name.length > 10 ? subscription.name.slice(0, 10) + '.' : subscription.name}</span></p>
                </div>
                <div className="flex flex-col py-4 gap-3">
                    <p className="text-secondary"><span className="py-2 px-2 rounded-lg bg-neutral-300 text-sm">{subscription.price}{subscription.currency}</span> {subscription.typeOfPayment}</p>
                    <p className="text-secondary text-sm">next pay: <span className="py-2 px-2 rounded-lg bg-neutral-300">{subscription.upcommingPayment}</span></p>
                    <div className="flex justify-between">
                        <CustomButton size="small" onClick={() => {
                            clickedSubscriptionRef.current = subscription
                            openDeleteModal();
                        }}>Delete</CustomButton>
                        <CustomButton size="small" backgroundColor="info" onClick={() => {
                            editSubscription(subscription);
                            openEditModal();
                        }}>
                            Edit
                        </CustomButton>
                    </div>
                </div>
            </Block>
        })}
    </div>
}

export default SubscriptionsList