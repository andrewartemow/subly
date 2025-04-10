import { ChangeEvent, ForwardedRef, forwardRef, Ref } from 'react'

import CustomButton from './CustomButton'
import TextCard from './TextCard'

import { ListedSubscriptionInterface } from '../interfaces'

interface ModalProps {
    addFormData?: { subscriptionName: string, price: string, currency: string, typeOfPayment: string, paymentMethod: string, upcomingPayment: string, websiteLink: string },
    editFormData?: { id: number, subscriptionName: string, price: string, currency: string, typeOfPayment: string, paymentMethod: string, upcomingPayment: string, websiteLink: string },
    editTrialFormData?: { id: number, subscriptionName: string, trialEndDate: string, websiteLink: string },
    addTrialFormData?: { subscriptionName: string, trialEndDate: string, websiteLink: string },
    modalType: "add" | "edit" | "delete" | "settings" | "addTrial" | "editTrial" | "deleteTrial" | "attachFile",
    listedSubscriptions?: ListedSubscriptionInterface[],
    userInfo?: any,
    isUpdatingEmail?: boolean,
    isUpdatingPassword?: boolean,
    updatedEmail?: string,
    updatedPassword?: string,
    setUpdatedEmail?: (argument: string) => void,
    setIsUpdatingEmail?: (argument: boolean) => void;
    setIsUpdatingPassword?: (argument: boolean) => void;
    setUpdatedPassword?: (argument: string) => void;
    setAddFormData?: (argument: { subscriptionName: string, price: string, currency: string, typeOfPayment: string, paymentMethod: string, upcomingPayment: string, websiteLink: string }) => void;
    setAddTrialFormData?: (argument: { subscriptionName: string, trialEndDate: string, websiteLink: string }) => void;
    setEditFormData?: (argument: { id: number, subscriptionName: string, price: string, currency: string, typeOfPayment: string, paymentMethod: string, upcomingPayment: string, websiteLink: string }) => void;
    setEditTrialFormData?: (argument: { id: number, subscriptionName: string, trialEndDate: string, websiteLink: string }) => void;
    closeModal: (argument: Ref<HTMLDialogElement>) => void,
    handleMainAction?: (argument?: any) => void,
    handleUploadAvatar?: (argument: ChangeEvent<HTMLInputElement>) => void,
    handleUploadAttachemnts?: (argument: ChangeEvent<HTMLInputElement>) => void,
    handleUpdateEmail?: () => void,
    handleUpdatePassword?: () => void,
    parseEmail?: () => void,
}


const Modal = forwardRef<HTMLDialogElement, ModalProps>(
    function Modal(
        { addFormData, editFormData, modalType, listedSubscriptions, userInfo, isUpdatingEmail, isUpdatingPassword, updatedPassword, updatedEmail, addTrialFormData, editTrialFormData, setAddTrialFormData, setEditTrialFormData, setAddFormData, setEditFormData, closeModal, handleMainAction, parseEmail, setIsUpdatingEmail, setUpdatedEmail, handleUploadAvatar, handleUpdateEmail, setIsUpdatingPassword, setUpdatedPassword, handleUpdatePassword, handleUploadAttachemnts }: ModalProps, ref: ForwardedRef<HTMLDialogElement>
    ) {

        let modalContent;

        if (modalType === "add" && addFormData && ref && listedSubscriptions && handleMainAction && parseEmail && setAddFormData) {
            modalContent = <>
                <h3 className="font-bold text-lg text-secondary mb-4 w-full text-center">How you will add <TextCard backgroundColor="info" rotate="-2">new 🆕</TextCard> subscription?</h3>

                {/* Form */}
                <form onSubmit={handleMainAction} className="flex flex-col gap-4 items-start flex-1">

                    <select value={addFormData.subscriptionName || "Pick a subscription"} className="select text-secondary bg-neutral-100" onChange={(e) => {

                        const selectedSubscription = listedSubscriptions.find(sub => sub.name === e.target.value);

                        setAddFormData({ ...addFormData, subscriptionName: e.target.value, websiteLink: selectedSubscription?.websiteLink || "" })
                    }} required>
                        <option disabled={true} value="Pick a subscription">Pick a subscription</option>
                        {listedSubscriptions.map((listedSubscription: ListedSubscriptionInterface) => <option className="text-secondary font-bold" value={listedSubscription.name} key={listedSubscription.id}>
                            {listedSubscription.name}
                        </option>)}
                    </select>

                    <div className="flex w-full items-center justify-center gap-x-5">
                        <div className="border-t-[1px] border-secondary w-20"></div>
                        <span className="text-secondary">OR</span>
                        <div className="border-t-[1px] border-secondary w-20"></div>
                    </div>

                    <input type="text" placeholder="Service Name" className="input text-secondary bg-neutral-100" value={addFormData.subscriptionName || ""} onChange={(e) => setAddFormData({ ...addFormData, subscriptionName: e.target.value })} required />

                    <input type="number" placeholder="Price" className="input text-secondary bg-neutral-100" value={addFormData.price || ""} onChange={(e) => setAddFormData({ ...addFormData, price: e.target.value })} required />

                    <label className="input bg-neutral-100">
                        <span className="label text-secondary">Next Payment Date</span>
                        <input type="date" className="text-secondary" value={addFormData.upcomingPayment || ""} onChange={(e) => setAddFormData({ ...addFormData, upcomingPayment: e.target.value })} required />
                    </label>

                    <select value={addFormData.typeOfPayment || "Pick a type"} className="select text-secondary bg-neutral-100" onChange={(e) => setAddFormData({ ...addFormData, typeOfPayment: e.target.value })} required>
                        <option disabled={true}>Pick a type</option>
                        <option value="per month">per month</option>
                        <option value="per year">per year</option>
                    </select>

                    <select defaultValue="Pick a payment method" className="select text-secondary bg-neutral-100" onChange={(e) => setAddFormData({ ...addFormData, paymentMethod: e.target.value })} required>
                        <option disabled={true}>Pick a payment method</option>
                        <option value="PayPal">PayPal</option>
                        <option value="Credit Card">Credit Card</option>
                    </select>

                    <select value={addFormData.currency || "Pick currency"} className="select text-secondary bg-neutral-100" onChange={(e) => setAddFormData({ ...addFormData, currency: e.target.value })} required>
                        <option disabled={true}>Pick currency</option>
                        <option value="$">$</option>
                        <option value="€">€</option>
                    </select>

                    <input type="text" placeholder="Website Link" className="input text-secondary bg-neutral-100" value={addFormData.websiteLink || ""} onChange={(e) => setAddFormData({ ...addFormData, websiteLink: e.target.value })} required />

                    <button type="submit" className="btn btn-success text-base-100">Submit</button>
                </form>
                <div className="flex flex-col justify-center items-center gap-y-4 flex-1">
                    <TextCard backgroundColor="warning">work in progress</TextCard>
                    {/* <CustomButton onClick={() => { }}>Fetch subscriptions</CustomButton> */}
                    <p className="text-neutral text-center leading-[180%]">
                        Scan your Gmail for subscription emails (Netflix, Spotify, etc.) and automatically extract data.
                        {/* <span className="py-1 px-4 rounded-lg bg-neutral-300 text-secondary">beta</span> */}
                    </p>
                </div>
            </>
        }

        if (modalType === "addTrial" && addTrialFormData && ref && listedSubscriptions && handleMainAction && setAddTrialFormData) {
            modalContent = <>
                <h3 className="font-bold text-lg text-secondary mb-4 w-full text-center">Add your <TextCard backgroundColor="info" rotate="-2">new 🆕</TextCard> trial</h3>

                {/* Form */}
                <form onSubmit={handleMainAction} className="flex flex-col gap-4 items-start flex-1">

                    <select value={addTrialFormData.subscriptionName || "Pick a subscription"} className="select text-secondary bg-neutral-100" onChange={(e) => {

                        const selectedSubscription = listedSubscriptions.find(sub => sub.name === e.target.value);

                        setAddTrialFormData({ ...addTrialFormData, subscriptionName: e.target.value, websiteLink: selectedSubscription?.websiteLink || "" })
                    }} required>
                        <option disabled={true}>Pick a subscription</option>
                        {listedSubscriptions.map((listedSubscription: ListedSubscriptionInterface) => <option className="text-secondary font-bold" value={listedSubscription.name} key={listedSubscription.id}>
                            {listedSubscription.name}
                        </option>)}
                    </select>

                    <div className="flex w-full items-center justify-center gap-x-5">
                        <div className="border-t-[1px] border-secondary w-20"></div>
                        <span className="text-secondary">OR</span>
                        <div className="border-t-[1px] border-secondary w-20"></div>
                    </div>

                    <input type="text" placeholder="Service Name" className="input text-secondary bg-neutral-100" value={addTrialFormData.subscriptionName || ""} onChange={(e) => setAddTrialFormData({ ...addTrialFormData, subscriptionName: e.target.value })} required />

                    <label className="input bg-neutral-100">
                        <span className="label text-secondary">Trial ends at</span>
                        <input type="date" className="text-secondary" value={addTrialFormData.trialEndDate || ""} onChange={(e) => setAddTrialFormData({ ...addTrialFormData, trialEndDate: e.target.value })} required />
                    </label>

                    <input type="text" placeholder="Website Link" className="input text-secondary bg-neutral-100" value={addTrialFormData.websiteLink || ""} onChange={(e) => setAddTrialFormData({ ...addTrialFormData, websiteLink: e.target.value })} required />


                    <button type="submit" className="btn btn-success text-base-100">Submit</button>
                </form>
                <div className="flex flex-col justify-center items-center gap-y-4 flex-1">
                    <TextCard backgroundColor="warning">work in progress</TextCard>
                    {/* <CustomButton onClick={() => { }}>Fetch subscriptions</CustomButton> */}
                    <p className="text-neutral text-center leading-[180%]">
                        Scan your Gmail for subscription emails (Netflix, Spotify, etc.) and automatically extract data.
                        {/* <span className="py-1 px-4 rounded-lg bg-neutral-300 text-secondary">beta</span> */}
                    </p>
                </div>
            </>
        }

        if (modalType === "edit" && editFormData && ref && setEditFormData) {
            modalContent = <>
                <h3 className="font-bold text-lg text-secondary mb-4 w-full text-center"><TextCard backgroundColor="info" rotate="-2">Edit</TextCard> subscription data</h3>

                {/* Form */}
                <form onSubmit={handleMainAction} className="flex flex-col gap-y-4 items-center w-full">

                    <input type="text" placeholder="Subscription Name" value={editFormData.subscriptionName || ""} className="input text-secondary bg-neutral-100" onChange={(e) => setEditFormData({ ...editFormData, subscriptionName: e.target.value })} required />

                    <input type="number" placeholder="Price" className="input text-secondary bg-neutral-100" value={editFormData.price || ""} onChange={(e) => setEditFormData({ ...editFormData, price: e.target.value })} required />


                    <label className="input bg-neutral-100 ">
                        <span className="label text-secondary">Next Payment Date</span>
                        <input type="date" className="text-secondary" value={editFormData.upcomingPayment || ""} onChange={(e) => setEditFormData({ ...editFormData, upcomingPayment: e.target.value })} required />
                    </label>

                    <select defaultValue="Pick a type" className="select text-secondary bg-neutral-100 " onChange={(e) => setEditFormData({ ...editFormData, typeOfPayment: e.target.value })} required>
                        <option disabled={true}>Pick a type</option>
                        <option value="per month">per month</option>
                        <option value="per year">per year</option>
                    </select>

                    <select defaultValue="Pick a payment method" className="select text-secondary bg-neutral-100" onChange={(e) => setEditFormData({ ...editFormData, paymentMethod: e.target.value })} required>
                        <option disabled={true}>Pick a payment method</option>
                        <option value="PayPal">PayPal</option>
                        <option value="Credit Card">Credit Card</option>
                    </select>

                    <select defaultValue="Pick currency" className="select text-secondary bg-neutral-100" onChange={(e) => setEditFormData({ ...editFormData, currency: e.target.value })} required>
                        <option disabled={true}>Pick currency</option>
                        <option value="$">$</option>
                        <option value="€">€</option>
                    </select>

                    <input type="text" placeholder="Website Link" className="input text-secondary bg-neutral-100" value={editFormData.websiteLink || ""} onChange={(e) => setEditFormData({ ...editFormData, websiteLink: e.target.value })} required />


                    <button type="submit" className="btn btn-success text-base-100">Submit</button>
                </form>
            </>
        }

        if (modalType === "editTrial" && editTrialFormData && ref && setEditTrialFormData) {
            modalContent = <>
                <h3 className="font-bold text-lg text-secondary mb-4 w-full text-center"><TextCard backgroundColor="info" rotate="-2">Edit</TextCard> trial data</h3>

                {/* Form */}
                <form onSubmit={handleMainAction} className="flex flex-col gap-y-4 items-center w-full">

                    <input type="text" placeholder="Subscription Name" value={editTrialFormData.subscriptionName || ""} className="input text-secondary bg-neutral-100" onChange={(e) => setEditTrialFormData({ ...editTrialFormData, subscriptionName: e.target.value })} required />


                    <label className="input bg-neutral-100 ">
                        <span className="label text-secondary">Trial ends at</span>
                        <input type="date" className="text-secondary" value={editTrialFormData.trialEndDate || ""} onChange={(e) => setEditTrialFormData({ ...editTrialFormData, trialEndDate: e.target.value })} required />
                    </label>

                    <input type="text" placeholder="Website Link" className="input text-secondary bg-neutral-100" value={editTrialFormData.websiteLink || ""} onChange={(e) => setEditTrialFormData({ ...editTrialFormData, websiteLink: e.target.value })} required />

                    <button type="submit" className="btn btn-success text-base-100">Submit</button>
                </form>
            </>
        }

        if (modalType === "delete" && ref) {
            modalContent = <>
                <form method="dialog">
                    {/* Close Button inside modal */}
                    <button type="button" onClick={() => closeModal(ref)} className="btn btn-sm absolute right-2 top-2 text-secondayr">
                        ✕
                    </button>
                </form>
                <h3 className="font-bold text-lg text-secondary mb-4 w-full">Are you sure you want to delete this subscription?</h3>

                <button className="btn bg-error text-base-100" onClick={handleMainAction}>Delete</button>
            </>
        }

        if (modalType === "deleteTrial" && ref) {
            modalContent = <>
                <form method="dialog">
                    {/* Close Button inside modal */}
                    <button type="button" onClick={() => closeModal(ref)} className="btn btn-sm absolute right-2 top-2 text-secondayr">
                        ✕
                    </button>
                </form>
                <h3 className="font-bold text-lg text-secondary mb-4 w-full">Are you sure you want to delete this trial?</h3>

                <button className="btn bg-error text-base-100" onClick={handleMainAction}>Delete</button>
            </>
        }

        if (modalType === "settings" && ref && userInfo && setIsUpdatingEmail && setUpdatedEmail && handleUpdateEmail && setIsUpdatingPassword && setUpdatedPassword && handleUpdatePassword) {
            modalContent = <>
                <form method="dialog">
                    {/* Close Button inside modal */}
                    <button type="button" onClick={() => closeModal(ref)} className="btn btn-sm absolute right-2 top-2 text-secondayr">
                        ✕
                    </button>
                </form>
                <div className="flex flex-col items-start gap-y-4">
                    <h3 className="font-bold text-lg text-secondary mb-4 w-full">Settings</h3>
                    <div className="flex gap-x-10">
                        <div>
                            <p className="text-secondary mb-4">Subscription Plan: <span className="p-2 rounded-lg bg-neutral-300">FREE</span></p>
                            <fieldset className="fieldset">
                                <legend className="fieldset-legend text-secondary">Pick an avatar</legend>
                                <input type="file" className="file-input text-secondary bg-neutral-100 text-sm" name="avatar" onChange={handleUploadAvatar} />
                            </fieldset>
                        </div>

                        <div>
                            <div className="flex gap-x-2">
                                <input type="text" className="input text-secondary bg-neutral-100 mb-8 w-52" name="email" required value={isUpdatingEmail ? updatedEmail : userInfo.email} disabled={!isUpdatingEmail} onChange={(e) => setUpdatedEmail(e.target.value)} />
                                <CustomButton size="small" onClick={() => setIsUpdatingEmail(!isUpdatingEmail)}>{isUpdatingEmail ? 'cancel' : 'update'}</CustomButton>
                                <CustomButton size="small" backgroundColor="success" disabled={!isUpdatingEmail} onClick={() => {
                                    setIsUpdatingEmail(!isUpdatingEmail);
                                    handleUpdateEmail()
                                }}>save</CustomButton>
                            </div>

                            <div>
                                {isUpdatingPassword ?
                                    <div className="flex gap-x-2"><input type="text" className="input text-secondary bg-neutral-100 mb-8 w-52" name="email" required value={updatedPassword} onChange={(e) => setUpdatedPassword(e.target.value)} /> <CustomButton size="small" onClick={() => setIsUpdatingPassword(!isUpdatingPassword)}>cancel</CustomButton> <CustomButton size="small" backgroundColor="success" onClick={() => {
                                        setIsUpdatingPassword(!isUpdatingPassword);
                                        handleUpdatePassword()
                                    }}>save</CustomButton></div> : <CustomButton size="small" onClick={() => setIsUpdatingPassword(!isUpdatingPassword)}>Set New Password</CustomButton>}
                            </div>
                        </div>
                    </div>
                </div>
            </>
        }

        if (modalType === "attachFile" && ref && handleUploadAttachemnts) {
            modalContent = <>
                <form method="dialog">
                    {/* Close Button inside modal */}
                    <button type="button" onClick={() => closeModal(ref)} className="btn btn-sm absolute right-2 top-2 text-secondayr">
                        ✕
                    </button>
                </form>
                <div className="flex flex-col items-start gap-y-4">
                    <h3 className="font-bold text-lg text-secondary mb-4 w-full">Upload your <TextCard backgroundColor="warning">attachments</TextCard></h3>
                    <div>
                        <fieldset className="fieldset">
                            <legend className="fieldset-legend text-secondary">Select your .pdf file</legend>
                            <input type="file" className="file-input text-secondary bg-neutral-100 text-sm" name="avatar" onChange={handleUploadAttachemnts} />
                        </fieldset>
                    </div>
                </div>
            </>
        }

        return (
            <dialog ref={ref} className="modal">
                <div className="modal-box max-w-[700px] flex flex-wrap">

                    <form method="dialog">
                        {/* Close Button inside modal */}
                        <button type="button" onClick={() => closeModal(ref)} className="btn btn-sm absolute right-2 top-2 text-secondayr">
                            ✕
                        </button>
                    </form>
                    {modalContent}
                </div>
            </dialog>
        )
    }
)

export default Modal;