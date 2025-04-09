import { ChangeEvent, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

import { supabase } from "../supabaseClient";
import { useAuth } from "../context/AuthProvider";

import { FaPlus } from "react-icons/fa";

import CustomButton from "../components/CustomButton";
import LittleNavbar from "../components/LittleNavbar";
import TextCard from "../components/TextCard";
import Block from "../components/Block";
import LittleNavbarMobile from "../components/LittleNavbarMobile";
import SubscriptionsTable from "../components/DetailedInfoTable";
import SubscriptionDetail from "../components/SubscriptionDetail";
import SideBar from "../components/SideBar";
import Modal from "../components/Modal";

import { fadeInFromSide } from "../variants";
import { SubscriptionInterface, SubscriptionIconInterface } from "../interfaces";


const Dashboard = () => {

    //====TABS====
    const [currentTab, setCurrentTab] = useState<"subscriptions" | "expences">("subscriptions");

    //====DATA====
    const [subscriptions, setSubscriptions] = useState<null | any>([]);
    const [subscriptionsIcons, setSubscriptionsIcons] = useState<null | any>([]);

    //====USERDATA====
    const [avatar, setAvatar] = useState<null | string>("");

    //====SIDEBAR====
    const [isShown, setIsShown] = useState<boolean>(true);

    //====MODALSFORMS====
    const [addFormData, setaddFormData] = useState({ subscriptionName: "", price: "", currency: "", typeOfPayment: "", upcomingPayment: "" });
    const [editFormData, setEditFormData] = useState({ id: 0, subscriptionName: "", price: "", currency: "", typeOfPayment: "", upcomingPayment: "" });

    //====RESETEMAILPASSWORD====
    const [updatedEmail, setUpdatedEmail] = useState("");
    const [updatedPassword, setUpdatedPassword] = useState("");
    const [isUpdatingEmail, setIsUpdatingEmail] = useState(false);
    const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

    //====ALERTS====
    const [alertMessage, setAlertMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    // Stores clicked subscription
    let clickedSubscription: SubscriptionInterface;


    const navigate = useNavigate();

    // Use Refs
    const modalAddFormRef = useRef(null);
    const modalDeleteConfirmRef = useRef(null);
    const modalEditFormRef = useRef(null);
    //-------
    const modalSettingsRef = useRef(null);
    //-------

    const { signOut, user }: any = useAuth();


    // Use Effects
    useEffect(() => {
        fetchSubscripions();
        fetchSubscripionsIcons();
        fetchAvatar();
    }, []);

    useEffect(() => {
        const checkForOAuthResults = async () => {
            const params = new URLSearchParams(location.search);
            const success = params.get('success');
            const error = params.get('error');

            if (success) {
                try {
                    // 1. Get fetched subscriptions from backend
                    const response = await fetch('http://localhost:3001/get-results');
                    const fetchedSubscriptions = await response.json();

                    // 2. Insert each subscription into Supabase
                    for (const subscription of fetchedSubscriptions) {
                        const { error } = await supabase
                            .from('subscriptions')
                            .insert({
                                name: subscription.name,
                                price: parseFloat(subscription.price),
                                currency: subscription.currency,
                                typeOfPayment: subscription.typeOfPayment,
                                upcommingPayment: subscription.upcommingPayment,
                                user_id: user.id,
                                icon: subscription.icon,
                            });

                        if (error) throw error;
                    }

                    console.log('Successfully inserted', fetchedSubscriptions.length, 'subscriptions');
                    fetchSubscripions();
                    navigate('/dashboard', { replace: true });

                } catch (error) {
                    console.error('Insert failed:', error);
                    navigate('/dashboard', { replace: true });
                }
            }
        };

        checkForOAuthResults();
    }, [location.search, user.id, navigate]);

    // Async Functions
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

    async function fetchAvatar() {
        const { data: files, error } = await supabase.storage.from('avatars').list(user.id);

        if (error || !files || files.length === 0) {
            console.error("No avatar found", error);
            setAvatar("https://fiverr-res.cloudinary.com/images/q_auto,f_auto/gigs/100938463/original/7b5408c3d7ce38ebe21db6d4d280482a614dab55/draw-you-like-spoderman-spodermen.png");
            return;
        }

        // Find any file that matches "avatar" (any extension)
        const avatarFile = files.find(file => file.name.startsWith("avatar."));

        if (!avatarFile) {
            setAvatar("https://fiverr-res.cloudinary.com/images/q_auto,f_auto/gigs/100938463/original/7b5408c3d7ce38ebe21db6d4d280482a614dab55/draw-you-like-spoderman-spodermen.png");
            return;
        }

        // Get the public URL of the avatar file
        const { data } = supabase.storage.from('avatars').getPublicUrl(`${user.id}/${avatarFile.name}`);

        setAvatar(data.publicUrl);
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

    async function editSubscription(subscription: SubscriptionInterface) {

        clickedSubscription = subscription;

        setEditFormData(
            {
                id: clickedSubscription.id,
                subscriptionName: clickedSubscription.name,
                price: String(clickedSubscription.price),
                currency: clickedSubscription.currency,
                typeOfPayment: clickedSubscription.typeOfPayment,
                upcomingPayment: clickedSubscription.upcommingPayment
            }
        )
    }

    async function handleAddSubmit(e: any) {
        e.preventDefault();

        // Check for required fields using updatedaddFormData
        if (!(
            addFormData.subscriptionName &&
            addFormData.price &&
            addFormData.currency &&
            addFormData.typeOfPayment &&
            addFormData.upcomingPayment
        )) {
            console.error("Missing required fields");
            return;
        }

        // Update state to reflect changes (optional for UI)
        setaddFormData(addFormData);

        // Find subscription icon
        const subscriptionIcon = subscriptionsIcons.find(
            (si: SubscriptionIconInterface) => si.name === addFormData.subscriptionName
        );

        // Submit to Supabase using updatedaddFormData
        const { error } = await supabase
            .from('subscriptions')
            .insert({
                name: addFormData.subscriptionName,
                price: Number(addFormData.price),
                currency: addFormData.currency,
                typeOfPayment: addFormData.typeOfPayment,
                upcommingPayment: addFormData.upcomingPayment,
                user_id: user.id,
                icon: subscriptionIcon?.icon || ""
            });

        if (error) {
            console.error(error);
            return;
        }

        setaddFormData({
            subscriptionName: "",
            price: "",
            currency: "",
            typeOfPayment: "",
            upcomingPayment: "",
        });
        closeModal(modalAddFormRef);
        fetchSubscripions();
    };

    async function handleEditSubmit(e: any) {
        e.preventDefault();

        const { error } = await supabase
            .from('subscriptions')
            .update({
                name: editFormData.subscriptionName,
                price: editFormData.price,
                currency: editFormData.currency,
                typeOfPayment: editFormData.typeOfPayment,
                upcommingPayment: editFormData.upcomingPayment
            })
            .eq('id', editFormData.id)

        if (error) {
            console.error(error)
        }

        setEditFormData({
            id: 0,
            subscriptionName: "",
            price: "",
            currency: "",
            typeOfPayment: "",
            upcomingPayment: "",
        })
        closeModal(modalEditFormRef);
        fetchSubscripions();
    }

    async function handleUpload(e: ChangeEvent<HTMLInputElement>) {
        let file;
        if (e.target.files) {
            file = e.target.files[0];
        }

        const fileExtension = file?.name.split('.').pop();
        const newFileName = `avatar.${fileExtension}`;
        const filePath = `${user.id}/${newFileName}`; // Store in user-specific folder

        await supabase.storage.from('avatars').remove([
            `${user.id}/avatar.jpg`,
            `${user.id}/avatar.jpeg`,
            `${user.id}/avatar.png`
        ]);

        const { data, error } = await supabase.storage.from('avatars').upload(filePath, file as File, {
            upsert: true, // This replaces the old file if it exists
        });

        if (data) {
            fetchAvatar()
        } else if (error) {
            console.error(error)
        }
    }

    async function handleDelete() {
        deleteSubscription(clickedSubscription.id);
        closeModal(modalDeleteConfirmRef);
    }

    async function handleUpdateEmail() {

        if (!isEmail(updatedEmail)) {
            setErrorMessage("Wrong email")
            const timer = setTimeout(() => {
                setErrorMessage("")
            }, 4000);

            return () => clearTimeout(timer);
        }

        console.log('render after if');

        const { data, error } = await supabase.auth.updateUser({
            email: updatedEmail,
        });

        if (data) {
            setAlertMessage("Confirmation link was send to email");
            const timer = setTimeout(() => {
                setAlertMessage("")
            }, 4000);

            return () => clearTimeout(timer);
        }

        if (error) {
            setErrorMessage("Something went wrong");
            const timer = setTimeout(() => {
                setAlertMessage("")
            }, 4000);

            console.error(error);
            return () => clearTimeout(timer);
        }
    }

    async function handleUpdatePassword() {
        if (updatedPassword.length < 8) {
            setErrorMessage("Password needs to be at least 8 characters");
            const timer = setTimeout(() => {
                setErrorMessage("")
            }, 4000);

            return () => clearTimeout(timer);
        }

        const { data, error } = await supabase.auth.updateUser({
            password: updatedPassword
        })

        if (data) {
            setAlertMessage("Password is changed")
            const timer = setTimeout(() => {
                setAlertMessage("")
            }, 4000);

            return () => clearTimeout(timer);
        }

        if (error) {
            setErrorMessage("Something went wrong")
            const timer = setTimeout(() => {
                setErrorMessage("")
            }, 4000);

            return () => clearTimeout(timer);
        }
    }

    // Functions
    function openModal(modal: any) {
        if (modal.current) {
            modal.current.showModal();
        }
    };

    function closeModal(modal: any) {
        if (modal.current) {
            modal.current.close();
        }
    };

    function isShownHandler() {
        setIsShown(!isShown);
    }

    function renderTabContent() {
        switch (currentTab) {
            case "subscriptions":
                return subscriptionContent;
            case "expences":
                return expencesContent;
        }
    }

    function parseEmail() {
        window.location.href = 'http://localhost:3001/auth'
    }

    const isEmail = (email: string) =>
        /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email);

    // Tabs Content
    const subscriptionContent = <>
        <h2 className="text-2xl md:text-5xl font-bold text-secondary mb-8">Your <TextCard backgroundColor="info" rotate="2">✨subscriptions</TextCard></h2>

        {/* Modal Form */}
        <Modal modalType="add" ref={modalAddFormRef} closeModal={closeModal} handleMainAction={handleAddSubmit} addFormData={addFormData} setAddFormData={setaddFormData} subscriptionIcons={subscriptionsIcons} parseEmail={parseEmail} />

        <Modal modalType="delete" ref={modalDeleteConfirmRef} closeModal={closeModal} handleMainAction={handleDelete} />

        <Modal modalType="edit" ref={modalEditFormRef} closeModal={() => {
            setEditFormData({
                id: 0,
                subscriptionName: "",
                price: "",
                currency: "",
                typeOfPayment: "",
                upcomingPayment: "",
            })
            // setClickedSubscription(null);
            closeModal(modalEditFormRef)
        }} editFormData={editFormData} setEditFormData={setEditFormData} handleMainAction={handleEditSubmit} />

        <Modal modalType="settings" ref={modalSettingsRef} userInfo={user} updatedEmail={updatedEmail} isUpdatingEmail={isUpdatingEmail} isUpdatingPassword={isUpdatingPassword} closeModal={closeModal} setIsUpdatingEmail={setIsUpdatingEmail} handleUpload={handleUpload} setUpdatedEmail={setUpdatedEmail} handleUpdateEmail={handleUpdateEmail} handleUpdatePassword={handleUpdatePassword} setIsUpdatingPassword={setIsUpdatingPassword} setUpdatedPassword={setUpdatedPassword} />

        {/* Content */}
        <SubscriptionDetail title="Total Active Subscriptions:" value={subscriptions.length} />

        <div className="flex justify-center md:justify-start w-full gap-10 flex-wrap">
            <Block size="small" onClick={() => openModal(modalAddFormRef)}>
                <div className="h-full w-full flex items-center justify-center">
                    <FaPlus className="text-secondary text-5xl" />
                </div>
            </Block>
            {subscriptions.map((subscription: SubscriptionInterface) => {

                return <Block size="small" key={subscription.id}>
                    <div className="flex justify-between">

                        <img src={subscription.icon} className="h-14" alt="" />
                        <p className="text-secondary"><span className="py-2 px-4 rounded-lg bg-neutral-300">{subscription.name.length > 10 ? subscription.name.slice(0, 10) + '.' : subscription.name}</span></p>
                    </div>
                    <div className="flex flex-col py-8 gap-5">
                        <p className="text-secondary"><span className="py-2 px-4 rounded-lg bg-neutral-300">{subscription.price}{subscription.currency}</span> {subscription.typeOfPayment}</p>
                        <p className="text-secondary">next pay: <span className="py-2 px-4 rounded-lg bg-neutral-300">{subscription.upcommingPayment}</span></p>
                        {/* <p className="text-secondary">total spend: <span className="py-2 px-4 rounded-lg bg-neutral-300">{subscription.totalSpend}{subscription.currency}</span></p> */}
                        {/* <p className="text-secondary">active for: <span className="py-2 px-4 rounded-lg bg-neutral-300">{subscription.activeFor}</span></p> */}
                        <div className="flex justify-between">
                            <CustomButton onClick={() => {
                                clickedSubscription = subscription;
                                openModal(modalDeleteConfirmRef);
                            }}>Delete</CustomButton>
                            <CustomButton backgroundColor="info" onClick={() => {
                                editSubscription(subscription);
                                openModal(modalEditFormRef)
                            }}>
                                Edit
                            </CustomButton>
                        </div>
                    </div>
                </Block>
            })}
        </div>
    </>;

    const expencesContent = <>
        <h2 className="text-2xl md:text-5xl font-bold text-secondary mb-8">track <TextCard backgroundColor="success" rotate="-2">💲expences</TextCard></h2>

        <SubscriptionsTable subscriptions={subscriptions} />
    </>;

    return <div className="drawer h-screen md:drawer-open">

        <input id="my-drawer-2" type="checkbox" className="drawer-toggle" checked={isShown} />
        <div className="drawer-content flex flex-col items-center md:items-start justify-start bg-neutral-100 py-10 px-10 overflow-y-auto">
            {/* Page content here */}

            {/* Allerts */}
            <AnimatePresence>
                {alertMessage && <motion.div
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    variants={fadeInFromSide}
                    role="alert" className="alert alert-success absolute bottom-10 right-10">
                    <svg className="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-base-100">{alertMessage}</span>
                </motion.div>}
            </AnimatePresence>

            <AnimatePresence>
                {errorMessage && <motion.div
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    variants={fadeInFromSide} role="alert" className="alert alert-error absolute bottom-10 right-10">
                    <svg className="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-base-100">{errorMessage}</span>
                </motion.div>}
            </AnimatePresence>


            <button className="btn btn-secondary top-1 h-7 right-24 md:right-54 text-base-100 z-100 fixed md:hidden" onClick={isShownHandler}>{isShown ? 'close' : 'open'} sidebar</button>

            {/* Desktop / Mobile MENU */}
            {avatar && <div className="hidden md:block">
                <LittleNavbar userEmail={user.email} avatarUrl={avatar} openSettings={() => openModal(modalSettingsRef)} onClick={signOut} />
            </div>}

            <div className="dropdown dropdown-bottom dropdown-end md:hidden fixed top-0 right-4 z-50">
                <LittleNavbarMobile userEmail={user.email} onClick={signOut} openSettings={() => openModal(modalSettingsRef)} />
            </div>

            {/* Render Content Of The Tab */}
            {renderTabContent()}

        </div>

        {/* SideBar */}
        <SideBar onClick={setCurrentTab} />
    </div >
}

export default Dashboard