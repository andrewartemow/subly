import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

import { supabase } from "../supabaseClient";
import { useAuth } from "../context/AuthProvider";

import { MdOutlineSubscriptions, MdAttachMoney } from "react-icons/md";
import { RxUpdate } from "react-icons/rx";
import { FaPlus } from "react-icons/fa";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

import CustomButton from "../components/CustomButton";
import LittleNavbar from "../components/LittleNavbar";
import TextCard from "../components/TextCard";
import Block from "../components/Block";

import { SubscriptionInterface, SubscriptionIconInterface } from "../../interfaces";


const Dashboard = () => {

    const [currentTab, setCurrentTab] = useState<"subscriptions" | "expences" | "alerts">("expences");
    const [subscriptions, setSubscriptions] = useState<null | any>([]);
    const [clickedSubscription, setClickedSubscription] = useState<null | any>(null);
    const [subscriptionsIcons, setSubscriptionsIcons] = useState<null | any>([]);
    const [isShown, setIsShown] = useState<boolean>(true);
    const [formData, setFormData] = useState({ subscriptionName: "", price: "", currency: "", typeOfPayment: "", upcomingPayment: "", firstPaymentDate: "", activeFor: "", totalSpend: "" });

    const modalAddFormRef = useRef(null);
    const modalDeleteConfirm = useRef(null);

    const { signOut, user }: any = useAuth();

    useEffect(() => {
        fetchSubscripions();
        fetchSubscripionsIcons();
    }, []);

    async function fetchSubscripionsIcons() {
        const { data, error } = await supabase
            .from('subscriptionsIcons')
            .select("*")

        if (error) {
            console.error("Error fetching subscriptions icons:", error);
        } else {
            setSubscriptionsIcons(data);  // Set the state with the fetched data
        }
    };

    async function fetchSubscripions() {
        const { data, error } = await supabase
            .from('subscriptions')
            .select("*")
            .eq("user_id", user.id);

        if (error) {
            console.error("Error fetching subscriptions:", error);
        } else {
            setSubscriptions(data);  // Set the state with the fetched data
        }
    }

    async function deleteSubscription(id: number) {
        const { error } = await supabase
            .from('subscriptions')
            .delete()
            .eq('id', id)

        if (error) {
            console.error(error)
        }

        fetchSubscripions();
    }

    const openModal = (modal: any) => {
        if (modal.current) {
            modal.current.showModal();
        }
    };

    const closeModal = (modal: any) => {
        if (modal.current) {
            modal.current.close();
        }
    };

    const isShownHandler = () => {
        setIsShown(!isShown);
    }

    function calculateSubscriptionDetails() {
        const today = new Date();
        const { price, typeOfPayment, firstPaymentDate, ...rest } = formData;

        // Convert price to number
        const cyclePrice = parseFloat(price);
        if (isNaN(cyclePrice)) return { ...formData, activeFor: "Invalid price", totalSpend: "0.00", upcomingPayment: "Invalid date" };
        if (!firstPaymentDate) return { ...formData, activeFor: "Invalid date", totalSpend: "0.00", upcomingPayment: "Invalid date" };

        // Convert firstPaymentDate to Date
        const firstPayment = new Date(firstPaymentDate);
        if (isNaN(firstPayment.getTime())) return { ...formData, activeFor: "Invalid date", totalSpend: "0.00", upcomingPayment: "Invalid date" };

        // Calculate active days
        const activeDays = Math.floor((today.getTime() - firstPayment.getTime()) / (1000 * 60 * 60 * 24));

        // Determine activeFor and cyclesCompleted
        let activeFor = "";
        let cyclesCompleted = 0;

        if (activeDays < 30) {
            activeFor = `${activeDays} days`;
        } else if (typeOfPayment === "per month") {
            cyclesCompleted = Math.floor(activeDays / 30);
            activeFor = `${cyclesCompleted} months`;
        } else if (typeOfPayment === "per year") {
            cyclesCompleted = Math.floor(activeDays / 365);
            activeFor = `${cyclesCompleted} years`;
        }

        // Calculate total spent
        const totalSpent = cyclesCompleted > 0 ? cyclesCompleted * cyclePrice : cyclePrice;

        // Calculate upcoming payment date
        let upcomingPayment = new Date(firstPayment);
        if (typeOfPayment === "per month") {
            upcomingPayment.setMonth(upcomingPayment.getMonth() + 1);
        } else if (typeOfPayment === "per year") {
            upcomingPayment.setFullYear(upcomingPayment.getFullYear() + 1);
        }

        const upcomingPaymentFormatted = `${upcomingPayment.getFullYear()}-${(upcomingPayment.getMonth() + 1).toString().padStart(2, '0')}-${upcomingPayment.getDate().toString().padStart(2, '0')}`;

        return {
            ...rest,
            price,
            typeOfPayment,
            firstPaymentDate,
            activeFor,
            totalSpend: totalSpent.toFixed(2),
            upcomingPayment: upcomingPaymentFormatted
        };
    }

    async function handleSubmit(e: any) {
        e.preventDefault();

        // Compute updated form data
        const updatedFormData = calculateSubscriptionDetails();

        // Check for required fields using updatedFormData
        if (!(
            updatedFormData.subscriptionName &&
            updatedFormData.price &&
            updatedFormData.currency &&
            updatedFormData.typeOfPayment &&
            updatedFormData.firstPaymentDate &&
            updatedFormData.totalSpend &&
            updatedFormData.activeFor
        )) {
            console.error("Missing required fields");
            return;
        }

        // Update state to reflect changes (optional for UI)
        setFormData(updatedFormData);

        // Find subscription icon
        const subscriptionIcon = subscriptionsIcons.find(
            (si: SubscriptionIconInterface) => si.name === updatedFormData.subscriptionName
        );

        // Submit to Supabase using updatedFormData
        const { error } = await supabase
            .from('subscriptions')
            .insert({
                name: updatedFormData.subscriptionName,
                price: Number(updatedFormData.price),
                currency: updatedFormData.currency,
                typeOfPayment: updatedFormData.typeOfPayment,
                totalSpend: updatedFormData.totalSpend,
                activeFor: updatedFormData.activeFor,
                firstPaymentDate: updatedFormData.firstPaymentDate,
                upcommingPayment: updatedFormData.upcomingPayment,
                user_id: user.id,
                icon: subscriptionIcon?.icon || ""
            });

        if (error) {
            console.error(error);
            return;
        }

        closeModal(modalAddFormRef);
        setFormData({
            subscriptionName: "",
            price: "",
            currency: "",
            typeOfPayment: "",
            upcomingPayment: "",
            firstPaymentDate: "",
            activeFor: "",
            totalSpend: ""
        });

        fetchSubscripions();
    };

    function calculateTotalMonthSpending() {
        let sum = 0;

        subscriptions.forEach((subscription: SubscriptionInterface) => sum += subscription.price)

        return sum.toFixed(2);
    }

    function renderTabContent() {

        const data = subscriptions.map((subscription: SubscriptionInterface) => {
            return {
                name: subscription.name,
                value: subscription.price
            }
        })

        const COLORS = ['#059669', '#0596689d'];

        const subscriptionContent = <>
            <h2 className="text-2xl md:text-5xl font-bold text-secondary mb-8">Your <TextCard backgroundColor="info" rotate="2">✨subscriptions</TextCard></h2>

            {/* Modal Form */}
            <dialog ref={modalAddFormRef} className="modal">
                <div className="modal-box max-w-[700px]">

                    <form method="dialog">
                        {/* Close Button inside modal */}
                        <button type="button" onClick={() => closeModal(modalAddFormRef)} className="btn btn-sm absolute right-2 top-2 text-secondayr">
                            ✕
                        </button>
                    </form>
                    <h3 className="font-bold text-lg text-secondary mb-4"><TextCard backgroundColor="success" rotate="-2">new subscription 🆕</TextCard></h3>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4 items-start">
                        <div className="flex w-full items-center gap-x-4">
                            {/* <div>
                                <input type="text" placeholder="Subscription Name" className="input text-secondary bg-neutral-100" />
                            </div> */}

                            <select defaultValue="Pick a subscription" className="select text-secondary bg-neutral-100" onChange={(e) => setFormData({ ...formData, subscriptionName: e.target.value })} required>
                                <option disabled={true}>Pick a subscription</option>
                                {subscriptionsIcons.map((subscriptionIcon: SubscriptionIconInterface) => <option className="text-secondary font-bold" value={subscriptionIcon.name} key={subscriptionIcon.id}>
                                    {subscriptionIcon.name}
                                </option>)}
                            </select>

                            <div>
                                <input type="number" placeholder="Price" className="input text-secondary bg-neutral-100" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} required />
                            </div>
                        </div>

                        <div className="flex w-full items-center gap-x-4">

                            <div className="flex flex-col items-start gap-y-4">

                                <label className="input bg-neutral-100">
                                    <span className="label text-secondary">First Payment Date</span>
                                    <input type="date" className="text-secondary" value={formData.firstPaymentDate} onChange={(e) => setFormData({ ...formData, firstPaymentDate: e.target.value })} required />
                                </label>

                                <select defaultValue="Pick a type" className="select text-secondary bg-neutral-100" onChange={(e) => setFormData({ ...formData, typeOfPayment: e.target.value })} required>
                                    <option disabled={true}>Pick a type</option>
                                    <option value="per month">per month</option>
                                    <option value="per year">per year</option>
                                </select>

                                <select defaultValue="Pick currency" className="select text-secondary bg-neutral-100" onChange={(e) => setFormData({ ...formData, currency: e.target.value })} required>
                                    <option disabled={true}>Pick currency</option>
                                    <option value="$">$</option>
                                    <option value="€">€</option>
                                </select>
                            </div>
                        </div>


                        <button type="submit" className="btn btn-success text-base-100">Submit</button>
                    </form>
                </div>
            </dialog>

            <dialog ref={modalDeleteConfirm} className="modal">
                <div className="modal-box max-w-[700px]">

                    <form method="dialog">
                        {/* Close Button inside modal */}
                        <button type="button" onClick={() => closeModal(modalDeleteConfirm)} className="btn btn-sm absolute right-2 top-2 text-secondayr">
                            ✕
                        </button>
                    </form>
                    <h3 className="font-bold text-lg text-secondary mb-4">Are you sure you want to delete this subscription?</h3>

                    <button className="btn btn-error text-base-100" onClick={() => {
                        deleteSubscription(clickedSubscription.id);
                        closeModal(modalDeleteConfirm);
                    }}>Delete</button>
                </div>
            </dialog>

            {/* Content */}
            <p className="font-medium text-secondary p-1 mb-8">Total Active Subscriptions: <span className="py-2 px-4 rounded-lg bg-neutral-300">{subscriptions.length}</span></p>

            <div className="flex justify-center md:justify-start w-full gap-10 flex-wrap">
                <Block onClick={() => openModal(modalAddFormRef)}>
                    <div className="h-full w-full flex items-center justify-center">
                        <FaPlus className="text-secondary text-5xl" />
                    </div>
                </Block>
                {subscriptions.map((subscription: SubscriptionInterface) => {
                    // const subscriptionIcon = subscriptionsIcons.find((subscriptionIcon: SubscriptionIconInterface) => subscriptionIcon.name === subscription.name);

                    return <Block key={subscription.id}>
                        <div className="flex justify-between">
                            {/* <SiNetflix className="text-secondary text-5xl" /> */}
                            {/* <h2 className="text-secondary"><span className="p-2 rounded-lg bg-neutral-300">{subscription.name}</span></h2> */}
                            <img src={subscription.icon} className="h-14" alt="" />
                            <p className="text-secondary"><span className="py-2 px-4 rounded-lg bg-neutral-300">{subscription.price}{subscription.currency}</span> {subscription.typeOfPayment}</p>
                        </div>
                        <div className="flex flex-col py-2 gap-5">
                            <p className="text-secondary">next pay: <span className="py-2 px-4 rounded-lg bg-neutral-300">{subscription.upcommingPayment}</span></p>
                            <p className="text-secondary">total spend: <span className="py-2 px-4 rounded-lg bg-neutral-300">{subscription.totalSpend}{subscription.currency}</span></p>
                            <p className="text-secondary">active for: <span className="py-2 px-4 rounded-lg bg-neutral-300">{subscription.activeFor}</span></p>
                            <CustomButton onClick={() => {
                                setClickedSubscription(subscription);
                                openModal(modalDeleteConfirm);
                            }}>Delete</CustomButton>
                        </div>
                    </Block>
                })}
            </div>
        </>;
        const expencesContent = <>
            <h2 className="text-2xl md:text-5xl font-bold text-secondary mb-8">track <TextCard backgroundColor="success" rotate="-2">💲expences</TextCard></h2>

            <p className="font-medium text-secondary p-1 mb-8">Total Monthly Cost: <span className="py-2 px-4 rounded-lg bg-neutral-300">{calculateTotalMonthSpending()}$</span></p>

            <div className="bg-neutral-300 rounded-lg w-full mb-20">
                <table className="table">
                    {/* head */}
                    <thead className="text-secondary">
                        <tr>
                            <th>Subscription</th>
                            <th>Price</th>
                            <th>Currency</th>
                            <th>Billing Cycle</th>
                            <th>Total Spend</th>
                            <th>Active For</th>
                            <th>Upcomming Payment</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody className="text-secondary">
                        {/* row 1 */}
                        {subscriptions.map((subscription: SubscriptionInterface) => <tr>
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
                                <span className="badge badge-ghost badge-sm">{subscription.price}{subscription.currency}</span>
                            </td>
                            <td>
                                {subscription.currency}
                            </td>
                            <td>
                                {subscription.typeOfPayment}
                            </td>
                            <td>
                                <span className="badge badge-ghost badge-sm">{subscription.totalSpend}{subscription.currency}</span>
                            </td>
                            <td>
                                {subscription.activeFor}
                            </td>
                            <td>
                                {subscription.upcommingPayment}
                            </td>
                        </tr>)}
                    </tbody>
                </table>
            </div>

            <h3 className="font-medium text-2xl text-secondary p-1 mb-8">Visual <TextCard backgroundColor="success">📈graph</TextCard></h3>

            <ResponsiveContainer height={300} width={500} className="mx-auto">
                <PieChart width={500} height={500}> {/* Increased size of PieChart */}
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={120}
                        fill="#8884d8"
                        dataKey="value"
                        isAnimationActive={false}
                        label={({ name }) => `${name}`}
                    >
                        {data.map((_entry: any, index: number) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip content={({ payload }) => {
                        if (!payload || payload.length === 0) return null;
                        const data = payload[0].payload;
                        return (
                            <div className="text-secondary bg-neutral-50 p-2 border-2 border-neutral-200 rounded-xl">
                                <p>{`${data.name}: $${data.value.toFixed(2)}`}</p>
                            </div>
                        );
                    }} />
                </PieChart>
            </ResponsiveContainer>

        </>;
        const alertsContent = <>
        </>;

        switch (currentTab) {
            case "subscriptions":
                return subscriptionContent
            case "expences":
                return expencesContent;
            case "alerts":
                return alertsContent;
        }
    }


    return <div className="drawer h-screen md:drawer-open">

        <input id="my-drawer-2" type="checkbox" className="drawer-toggle" checked={isShown} />
        <div className="drawer-content flex flex-col items-center md:items-start justify-start bg-neutral-100 py-10 px-10 overflow-y-auto">
            {/* Page content here */}

            {/* Open Sidebar button */}
            <button className="btn btn-secondary top-1 h-7 right-24 md:right-54 text-base-100 z-100 fixed md:hidden" onClick={isShownHandler}>{isShown ? 'close' : 'open'} sidebar</button>

            {/* Desktop / Mobile MENU */}
            <div className="hidden md:block">
                <LittleNavbar>
                    <div className="flex flex-col items-start">
                        <p className="font-medium text-secondary p-1">{user.email}</p>
                        <p className="font-medium text-secondary p-1">Subscription Plan: <span className="p-2 rounded-lg bg-neutral-300">FREE</span></p>
                        <a className="text-secondary text-md font-medium hover:bg-neutral-100 p-1 rounded-md" href="#">Settings</a>
                        <a className="text-info text-md font-medium hover:bg-blue-100 p-1 rounded-md" href="#" onClick={signOut}>Log Out</a>
                    </div>
                </LittleNavbar>
            </div>
            <div className="dropdown dropdown-bottom dropdown-end md:hidden fixed top-0 right-4 z-50">
                <div tabIndex={0} role="button" className="btn m-1 bg-base-100 text-secondary">Menu</div>
                <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm">
                    <li><a className="text-secondary text-md font-medium hover:bg-neutral-100 p-1 rounded-md py-2 mb-2" href="#">Kamel Arraj</a></li>
                    <li><a className="text-secondary text-md font-medium hover:bg-neutral-100 p-1 rounded-md py-2 mb-2" href="#">Subscription Plan: <span className="p-2 rounded-lg bg-neutral-300 text-center">FREE</span></a></li>
                    <li><a className="text-primary text-md font-bold p-2 mb-2 border-[1px] rounded-md" href="#">Settings</a></li>
                    <li><a className="text-primary text-md font-bold p-2 border-[1px] rounded-md" href="#">Log Out</a></li>
                </ul>
            </div>

            {/* Render Content Of The Tab */}
            {renderTabContent()}

        </div>

        {/* SideBar */}
        <div className="drawer-side w-72 bg-base-100">
            <div className="h-full flex flex-col justify-between items-center p-4">
                <ul className="menu bg-base-100 text-base-content w-full">
                    {/* Sidebar content here */}
                    <li className="hover:bg-neutral-100 p-1 rounded-md" onClick={() => setCurrentTab("subscriptions")}><a className="text-neutral-700 font-bold text-lg"><MdOutlineSubscriptions /> Subscriptions</a></li>
                    <li className="hover:bg-neutral-100 p-1 rounded-md" onClick={() => setCurrentTab("expences")}><a className="text-neutral-700 font-bold text-lg"><MdAttachMoney /> Expences</a></li>
                    <li className="hover:bg-neutral-100 p-1 rounded-md" onClick={() => setCurrentTab("alerts")}><a className="text-neutral-700 font-bold text-lg"><RxUpdate /> Auto-Renewal Alerts</a></li>
                </ul>

                <div className="text-center flex flex-col items-center">
                    <p className="mb-4 text-secondary">Get <span className="font-bold">PRO</span> Plan by <TextCard backgroundColor="warning">💸price</TextCard> of coffee :)</p>
                    <Link to="/pricing">
                        <CustomButton>Change Subscription Plan</CustomButton>
                    </Link>
                </div>
            </div>
        </div>
    </div >
}

export default Dashboard