import { ChangeEvent, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

import { supabase } from "../supabaseClient";
import { useAuth } from "../context/AuthProvider";

import { FaPlus } from "react-icons/fa";
import { MdSubscriptions } from "react-icons/md";
import { IoIosAttach, IoMdSettings, IoIosTimer } from "react-icons/io";
import { RiLogoutBoxFill } from "react-icons/ri";
import { CiFileOn } from "react-icons/ci";

import CustomButton from "../components/CustomButton";
// import LittleNavbar from "../components/LittleNavbar";
import TextCard from "../components/TextCard";
import Block from "../components/Block";
// import LittleNavbarMobile from "../components/LittleNavbarMobile";
import DetailedInfoTable from "../components/DetailedInfoTable";
import SubscriptionDetail from "../components/SubscriptionDetail";
// import SideBar from "../components/SideBar";
import Modal from "../components/Modal";
import SubscriptionsContextMenu from "../components/SubscriptionsContextMenu";
import FilesContextMenu from "../components/FilesContextMenu";
import SubscriptionsList from "../components/SubscriptionsList";

import customSubscriptionIcon from '/icons/features.png'

import { fadeInFromSide } from "../variants";
import { SubscriptionInterface, ListedSubscriptionInterface } from "../interfaces";


const initialSubscriptionsContextMenu = {
    data: { websiteLink: "" },
    show: false,
    x: 0,
    y: 0
}

const initialFilesContextMenu = {
    show: false,
    x: 0,
    y: 0
}

const invalidateCache = (key: string) => {
    localStorage.removeItem(key);
};

const getCachedData = (key: string) => {
    const cachedData = localStorage.getItem(key);
    if (!cachedData) return null;
    return JSON.parse(cachedData);
};

const setCachedData = (key: string, data: any) => {
    localStorage.setItem(key, JSON.stringify({
        data,
        timestamp: new Date().getTime()
    }));
};

const Dashboard = () => {

    //====TABS====
    const [currentTab, setCurrentTab] = useState<"subscriptions" | "attachments" | "trials">("subscriptions");

    //====CONTEXT_MENUS_FOR_SUBSCRIPTIONS====
    const [subscriptionsContextMenu, setSubscriptionsContextMenu] = useState(initialSubscriptionsContextMenu);
    const [filesContextMenu, setFilesContextMenu] = useState(initialFilesContextMenu);
    const [rightClickSubscriptionId, setRightClickSubscriptionId] = useState(0);
    const [rightClickFileName, setRightClickFileName] = useState("");

    //====DATA====
    const [subscriptions, setSubscriptions] = useState<null | any>([]);
    const [listedSubscriptions, setlistedSubscriptions] = useState<null | any>([]);
    const [trials, setTrials] = useState<any | null>([])
    const [attachments, setAttachmentsUrls] = useState<{ id: number, name: string, attachments: string[] }[]>([]);

    //====USERDATA====
    const [avatar, setAvatar] = useState<null | string>("");
    const [userFirstName, setUserFirstName] = useState("");

    //====MODALSFORMS====
    const [addFormData, setaddFormData] = useState({ subscriptionName: "", price: "", currency: "", typeOfPayment: "", paymentMethod: "", upcomingPayment: "", websiteLink: "" });
    const [editFormData, setEditFormData] = useState({ id: 0, subscriptionName: "", price: "", currency: "", typeOfPayment: "", paymentMethod: "", upcomingPayment: "", websiteLink: "" });
    const [addTrialFormData, setAddTrialFormData] = useState({ subscriptionName: "", trialEndDate: "", websiteLink: "" })
    const [editTrialFormData, setEditTrialFormData] = useState({ id: 0, subscriptionName: "", trialEndDate: "", websiteLink: "" })

    //====RESETEMAILPASSWORD====
    const [updatedEmail, setUpdatedEmail] = useState("");
    const [updatedPassword, setUpdatedPassword] = useState("");
    const [isUpdatingEmail, setIsUpdatingEmail] = useState(false);
    const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

    //====ALERTS====
    const [alertMessage, setAlertMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    //====TEST_RATE====
    const EURO_DOLLAR_RATE = 1.08;

    // Stores clicked subscription
    const clickedSubscriptionRef = useRef<any>(null);
    const clickedTrialRef = useRef<any>(null)

    const navigate = useNavigate();

    // Use Refs
    const modalAddFormRef = useRef<HTMLDialogElement>(null);
    const modalDeleteConfirmRef = useRef<HTMLDialogElement>(null);
    const modalEditFormRef = useRef<HTMLDialogElement>(null);
    const modalAddtrialFormRef = useRef<HTMLDialogElement>(null);
    const modalDeleteTrialConfirmRef = useRef<HTMLDialogElement>(null);
    const modalEditTrialFormRef = useRef<HTMLDialogElement>(null);
    const modalAttachFileRef = useRef<HTMLDialogElement>(null);

    //-------
    const modalSettingsRef = useRef<HTMLDialogElement>(null);
    //-------

    const { signOut, user }: any = useAuth();


    // Use Effects
    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                await Promise.all([
                    fetchAvatar(),
                    fetchSubscripions(),
                    fetchTrials(),
                    fetchListedSubscriptions(),
                    fetchUserFirstName()
                ]);
            } catch (error) {
                console.error("Initial data loading error:", error);
            }
        };

        fetchInitialData();
    }, []);

    useEffect(() => {
        const checkForOAuthResults = async () => {
            const params = new URLSearchParams(location.search);
            const success = params.get('success');
            // const error = params.get('error');

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

    // Memoize Expensive Calculations
    const monthlyCost = useMemo(() => calculateMonthlyCostsInDollars(), [subscriptions]);
    const yearlyCost = useMemo(() => calculateYearlyCostsInDollars(), [subscriptions]);

    // Async Functions
    async function fetchListedSubscriptions() {
        const CACHE_KEY = 'listedSubscriptions';
        const cache = getCachedData(CACHE_KEY);

        if (cache && Date.now() - cache.timestamp < 5 * 60 * 1000) { // 5 minutes cache
            setlistedSubscriptions(cache.data);
            return;
        }

        const { data, error } = await supabase
            .from('listedSubscriptions')
            .select("*");

        if (error) {
            console.error("Error fetching listedSubscriptions:", error);
        } else {
            setlistedSubscriptions(data);
            setCachedData(CACHE_KEY, data);
        }
    }

    async function fetchSubscripions() {
        const CACHE_KEY = `subscriptions-${user.id}`;
        const cache = getCachedData(CACHE_KEY);

        if (cache && Date.now() - cache.timestamp < 5 * 60 * 1000) {
            setSubscriptions(cache.data);
            getAttachmentsFromSubscriptions(cache.data);
            return;
        }

        const { data, error } = await supabase
            .from('subscriptions')
            .select("*")
            .eq("user_id", user.id);

        if (error) {
            console.error("Error fetching subscriptions:", error);
        } else {
            checkSubscriptionsUpcomingPaymentDateAndUpdate(data);
            setSubscriptions(data);
            getAttachmentsFromSubscriptions(data);
            setCachedData(CACHE_KEY, data);
        }
    }

    async function fetchTrials() {
        const CACHE_KEY = `trials-${user.id}`;
        const cache = getCachedData(CACHE_KEY);

        if (cache && Date.now() - cache.timestamp < 5 * 60 * 1000) {
            setTrials(cache.data);
            return;
        }

        const { data, error } = await supabase
            .from('trials')
            .select("*")
            .eq("user_id", user.id);

        if (error) {
            console.error("Error fetching trials:", error);
        } else {
            setTrials(data);
            setCachedData(CACHE_KEY, data);
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

    async function fetchUserFirstName() {
        const CACHE_KEY = `user-${user.id}-info`;
        const cache = getCachedData(CACHE_KEY);

        if (cache && Date.now() - cache.timestamp < 60 * 60 * 1000) { // 1 hour cache
            setUserFirstName(cache.data.first_name);
            return;
        }

        const { data, error } = await supabase
            .from('customers')
            .select("*")
            .eq("user_id", user.id)
            .single();

        if (error) {
            console.error("Error fetching user info:", error);
        } else {
            setUserFirstName(data.first_name);
            setCachedData(CACHE_KEY, data);
        }
    }

    function getPublicUrlsForAttachments(attachments: string[]) {
        return attachments.map((attachmentPath: string) => {
            const { data } = supabase.storage.from('attachments').getPublicUrl(attachmentPath);

            return data.publicUrl;
        });
    };

    async function deleteSubscription(id: number) {
        const { error: deleteError } = await supabase
            .from('subscriptions')
            .delete()
            .eq('id', id)

        if (deleteError) {
            console.error(deleteError)
            return;
        }

        // Delete all associated attachments from storage
        const folderPath = `${user.id}/${id}`;
        const { data: fileList, error: listError } = await supabase
            .storage
            .from('attachments')
            .list(folderPath);

        if (!listError && fileList.length > 0) {
            const filesToDelete = fileList.map(file => `${folderPath}/${file.name}`);
            const { error: deleteStorageError } = await supabase
                .storage
                .from('attachments')
                .remove(filesToDelete);

            if (deleteStorageError) {
                console.error("Error deleting attachments:", deleteStorageError);
            }
        }

        invalidateCache(`subscriptions-${user.id}`);
        fetchSubscripions();
    }

    async function deleteTrial(id: number) {
        const { error } = await supabase
            .from('trials')
            .delete()
            .eq('id', id)

        if (error) {
            console.error(error)
        }

        invalidateCache(`trials-${user.id}`);
        fetchTrials();
    }

    async function editTrialSubscription(trial: { id: number, name: string, trialEndDate: string, websiteLink: string }) {

        clickedSubscriptionRef.current = trial;

        setEditTrialFormData(
            {
                id: trial.id,
                subscriptionName: trial.name,
                trialEndDate: trial.trialEndDate,
                websiteLink: trial.websiteLink
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
            addFormData.paymentMethod &&
            addFormData.upcomingPayment &&
            addFormData.websiteLink
        )) {
            console.error("Missing required fields");
            console.log(addFormData);

            setErrorMessage("Missing required fields")
            const timer = setTimeout(() => {
                setErrorMessage("")
            }, 4000);

            return () => clearTimeout(timer);
        }

        const selectedDate = new Date(addFormData.upcomingPayment);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (selectedDate < today) {
            console.error("The next payment date must be in the future.");
            setErrorMessage("The next payment date must be in the future")
            const timer = setTimeout(() => {
                setErrorMessage("")
            }, 4000);

            return () => clearTimeout(timer);
        }

        // Update state to reflect changes (optional for UI)
        setaddFormData(addFormData);

        // Find subscription icon
        const listedSubscription = listedSubscriptions.find(
            (si: ListedSubscriptionInterface) => si.name === addFormData.subscriptionName
        );

        // Submit to Supabase using updatedaddFormData
        const { error } = await supabase
            .from('subscriptions')
            .insert({
                name: addFormData.subscriptionName,
                price: Number(addFormData.price),
                currency: addFormData.currency,
                typeOfPayment: addFormData.typeOfPayment,
                paymentMethod: addFormData.paymentMethod,
                upcommingPayment: addFormData.upcomingPayment,
                websiteLink: addFormData.websiteLink,
                user_id: user.id,
                icon: listedSubscription?.icon || customSubscriptionIcon
            });

        if (error) {
            console.error(error);
            return;
        }

        invalidateCache(`subscriptions-${user.id}`);

        setaddFormData({
            subscriptionName: "",
            price: "",
            currency: "",
            typeOfPayment: "",
            paymentMethod: "",
            upcomingPayment: "",
            websiteLink: ""
        });
        closeModal(modalAddFormRef);
        fetchSubscripions();
    };

    async function handleAddTrialSubmit(e: any) {
        e.preventDefault();

        // Check for required fields using updatedaddFormData
        if (!(
            addTrialFormData.subscriptionName &&
            addTrialFormData.trialEndDate &&
            addTrialFormData.websiteLink
        )) {
            console.error("Missing required fields");
            console.log(addTrialFormData);

            setErrorMessage("Missing required fields")
            const timer = setTimeout(() => {
                setErrorMessage("")
            }, 4000);

            return () => clearTimeout(timer);
        }

        const selectedDate = new Date(addTrialFormData.trialEndDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (selectedDate < today) {
            console.error("The trial ending date must be in the future.");
            setErrorMessage("The trial ending date must be in the future")
            const timer = setTimeout(() => {
                setErrorMessage("")
            }, 4000);

            return () => clearTimeout(timer);
        }

        // Update state to reflect changes (optional for UI)
        setAddTrialFormData(addTrialFormData);

        // Find subscription icon
        const subscriptionIcon = listedSubscriptions.find(
            (si: ListedSubscriptionInterface) => si.name === addTrialFormData.subscriptionName
        );

        // Submit to Supabase using updatedaddTrialFormData
        const { error } = await supabase
            .from('trials')
            .insert({
                name: addTrialFormData.subscriptionName,
                trialEndDate: addTrialFormData.trialEndDate,
                websiteLink: addTrialFormData.websiteLink,
                user_id: user.id,
                icon: subscriptionIcon?.icon || customSubscriptionIcon
            });

        if (error) {
            console.error(error);
            return;
        }

        setAddTrialFormData({
            subscriptionName: "",
            trialEndDate: "",
            websiteLink: ""
        });
        closeModal(modalAddtrialFormRef);

        invalidateCache(`trials-${user.id}`);
        fetchTrials();
    }

    async function handleEditSubmit(e: any) {
        e.preventDefault();

        const { error } = await supabase
            .from('subscriptions')
            .update({
                name: editFormData.subscriptionName,
                price: editFormData.price,
                currency: editFormData.currency,
                typeOfPayment: editFormData.typeOfPayment,
                paymentMethod: editFormData.paymentMethod,
                upcommingPayment: editFormData.upcomingPayment,
                websiteLink: editFormData.websiteLink
            })
            .eq('id', editFormData.id)

        if (error) {
            console.error(error)
            return;
        }

        invalidateCache(`subscriptions-${user.id}`);

        setEditFormData({
            id: 0,
            subscriptionName: "",
            price: "",
            currency: "",
            typeOfPayment: "",
            paymentMethod: "",
            upcomingPayment: "",
            websiteLink: ""
        })
        closeModal(modalEditFormRef);
        fetchSubscripions();
    }

    async function handleEditTrialSubmit(e: any) {
        e.preventDefault();

        const { error } = await supabase
            .from('trials')
            .update({
                name: editTrialFormData.subscriptionName,
                trialEndDate: editTrialFormData.trialEndDate,
                websiteLink: editTrialFormData.websiteLink
            })
            .eq('id', editTrialFormData.id)

        if (error) {
            console.error(error)
        }

        setEditTrialFormData({
            id: 0,
            subscriptionName: "",
            trialEndDate: "",
            websiteLink: ""
        })
        closeModal(modalEditTrialFormRef);

        invalidateCache(`trials-${user.id}`);
        fetchTrials();
    }

    async function handleUploadAvatar(e: ChangeEvent<HTMLInputElement>) {
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

    async function handleUploadAttachment(e: ChangeEvent<HTMLInputElement>, subscriptionId: number) {
        let file;
        if (e.target.files) {
            file = e.target.files[0];
        }

        if (!file) {
            setErrorMessage("Please select a file.");

            const timer = setTimeout(() => {
                setErrorMessage("")
            }, 4000);

            return () => clearTimeout(timer);
        }

        // ✅ Validate file type (Only PDFs allowed)
        if (file.type !== "application/pdf") {
            setErrorMessage("Only PDF files are allowed.");

            const timer = setTimeout(() => {
                setErrorMessage("")
            }, 4000);

            return () => clearTimeout(timer);
        }

        // ✅ Validate file size (Max 5MB)
        if (file.size > 10 * 1024 * 1024) {
            setErrorMessage("File size exceeds 5MB.");

            const timer = setTimeout(() => {
                setErrorMessage("")
            }, 4000);

            return () => clearTimeout(timer);
        }

        // 📂 Define file path (Store per user + subscription)
        const fileName = `${Date.now()}-${file.name}`;
        const editedFileName = fileName.split(" ").join("-");
        const filePath = `${user.id}/${subscriptionId}/${editedFileName}`;


        // ⬆️ Upload file to Supabase Storage
        const uploadAttachment = async () => {
            const { data, error } = await supabase.storage
                .from("attachments")
                .upload(filePath, file, { upsert: true });

            if (data) {
                return data;
            } else {
                console.error(error);

                setErrorMessage("Failed to upload attachment. Please try again.");

                const timer = setTimeout(() => {
                    setErrorMessage("")
                }, 4000);

                return () => clearTimeout(timer);
            }
        }

        const updateAttachmentField = async () => {
            const { data, error: fetchError } = await supabase
                .from("subscriptions")
                .select("attachments")
                .eq("id", subscriptionId)
                .single();

            if (fetchError) {
                console.error(fetchError);
                return;
            }

            // 📌 Ensure attachments is an array (handle null cases)
            const currentAttachments = data?.attachments ?? [];

            // ✅ Update the subscriptions table with the new file path
            const { error: updateError } = await supabase
                .from("subscriptions")
                .update({ attachments: [...currentAttachments, filePath] })
                .eq("id", subscriptionId);

            if (updateError) {
                console.error(updateError);
                return;
            }

            invalidateCache(`subscriptions-${user.id}`);
            fetchSubscripions();

            setAlertMessage("Attachment is uploaded");

            const timer = setTimeout(() => {
                setAlertMessage("")
            }, 4000);

            return () => clearTimeout(timer);
        }

        await uploadAttachment();
        await updateAttachmentField();
    }

    async function deleteClickedAttachedFile() {


        const { data: deletedConfirm } = await supabase.storage.from('attachments').remove([
            `${user.id}/${rightClickSubscriptionId}/${rightClickFileName}`,
        ]);

        if (deletedConfirm) {
            console.log(`${user.id}/${rightClickSubscriptionId}/${rightClickFileName}`);
        }

        const { data, error: fetchError } = await supabase
            .from("subscriptions")
            .select("attachments")
            .eq("id", rightClickSubscriptionId)
            .single();

        if (fetchError) {
            console.error(fetchError);
            return;
        }

        // 📌 Ensure attachments is an array (handle null cases)
        const currentAttachments = data?.attachments ?? [];
        const filteredAttachments = currentAttachments.filter((attachment: string) => attachment !== `${user.id}/${rightClickSubscriptionId}/${rightClickFileName}`)

        // ✅ Update the subscriptions table with the new file path
        const { error: updateError } = await supabase
            .from("subscriptions")
            .update({ attachments: filteredAttachments })
            .eq("id", rightClickSubscriptionId);

        if (updateError) {
            console.error(updateError);
            return;
        }

        setAlertMessage("Attachment is removed");

        const timer = setTimeout(() => {
            setAlertMessage("")
        }, 4000);

        setRightClickFileName("");
        setRightClickSubscriptionId(0);

        invalidateCache(`subscriptions-${user.id}`);
        fetchSubscripions();

        return () => clearTimeout(timer);
    }

    async function handleDelete() {
        deleteSubscription(clickedSubscriptionRef.current?.id);
        closeModal(modalDeleteConfirmRef);
    }

    async function handleDeleteTrial() {
        deleteTrial(clickedTrialRef.current.id);
        closeModal(modalDeleteTrialConfirmRef);
    }

    async function handleUpdateEmail() {

        if (!isEmail(updatedEmail)) {
            setErrorMessage("Wrong email")
            const timer = setTimeout(() => {
                setErrorMessage("")
            }, 4000);

            return () => clearTimeout(timer);
        }

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

    async function updateSubscriptionPaymentDate(id: number, dateString: string) {
        const { error } = await supabase
            .from('subscriptions')
            .update({
                upcommingPayment: dateString
            })
            .eq('id', id)

        if (error) {
            console.error(error)
        }
    }

    function checkSubscriptionsUpcomingPaymentDateAndUpdate(subscriptions: SubscriptionInterface[]) {
        const today = new Date();

        subscriptions.forEach((subscription: SubscriptionInterface) => {
            let nextPaymentDate = new Date(subscription.upcommingPayment);

            // Clone the date to avoid mutation issues
            let updatedDate = new Date(nextPaymentDate);

            while (nextPaymentDate <= today) {
                if (subscription.typeOfPayment === "per month") {
                    nextPaymentDate.setMonth(nextPaymentDate.getMonth() + 1);
                    updateSubscriptionPaymentDate(subscription.id, nextPaymentDate.toISOString().split("T")[0])
                } else if (subscription.typeOfPayment === "per year") {
                    nextPaymentDate.setFullYear(nextPaymentDate.getFullYear() + 1);
                }
            }

            // Only update if needed
            if (updatedDate > nextPaymentDate) {
                updateSubscriptionPaymentDate(subscription.id, updatedDate.toISOString().split("T")[0]);
            }
        })
    }

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

    function renderTabContent() {
        switch (currentTab) {
            case "subscriptions":
                return subscriptionContent;
            case "trials":
                return trialsContent;
            case "attachments":
                return attachmentsContent;
        }
    }

    function calculateMonthlyCostsInDollars() {
        let sum = 0;

        subscriptions.forEach((subscription: SubscriptionInterface) => {

            if (subscription.typeOfPayment === "per month") {
                if (subscription.currency === "$") {
                    sum += subscription.price
                }

                if (subscription.currency === "€") {
                    sum += subscription.price * EURO_DOLLAR_RATE
                }
            }
        })

        return sum.toFixed(2);
    }

    function calculateYearlyCostsInDollars() {
        let sum = 0;

        subscriptions.forEach((subscription: SubscriptionInterface) => {

            if (subscription.typeOfPayment === "per month") {
                if (subscription.currency === "$") {
                    sum += subscription.price * 12
                }

                if (subscription.currency === "€") {
                    sum += subscription.price * EURO_DOLLAR_RATE * 12
                }
            }

            if (subscription.typeOfPayment === "per year") {
                sum += subscription.price
            }

        })

        return sum.toFixed(2);
    }

    function handleSubscriptionsContextMenu(e: any, websiteLink: string, subscriptionId: number) {
        e.preventDefault();

        const { pageX, pageY } = e;
        setSubscriptionsContextMenu({ show: true, x: pageX, y: pageY, data: { websiteLink: websiteLink } });
        setRightClickSubscriptionId(subscriptionId);
    }

    function handleFilesContextMenu(e: any, subscriptionId: number, nameOftheFile: string) {
        e.preventDefault();

        const { pageX, pageY } = e;
        setFilesContextMenu({ show: true, x: pageX, y: pageY });
        setRightClickSubscriptionId(subscriptionId);
        setRightClickFileName(nameOftheFile);
    }

    function subscriptionsContextMenuClose() {
        setSubscriptionsContextMenu(initialSubscriptionsContextMenu);
    }

    function filesContextMenuClose() {
        setFilesContextMenu(initialFilesContextMenu);
    }

    function getAttachmentsFromSubscriptions(subscriptions: SubscriptionInterface[]) {
        const attachmentsArray = subscriptions.map((subscription: SubscriptionInterface) => {
            const publicUrls = getPublicUrlsForAttachments(subscription.attachments)

            return {
                id: subscription.id,
                name: subscription.name,
                attachments: publicUrls
            }
        })

        setAttachmentsUrls(attachmentsArray);
    }

    function onSetEditFormData() {
        setEditFormData(
            {
                id: clickedSubscriptionRef.current.id,
                subscriptionName: clickedSubscriptionRef.current.name,
                price: String(clickedSubscriptionRef.current.price),
                currency: clickedSubscriptionRef.current.currency,
                typeOfPayment: clickedSubscriptionRef.current.typeOfPayment,
                paymentMethod: clickedSubscriptionRef.current.paymentMethod,
                upcomingPayment: clickedSubscriptionRef.current.upcommingPayment,
                websiteLink: clickedSubscriptionRef.current.websiteLink
            }
        );
    }

    const isEmail = (email: string) =>
        /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email);

    // Tabs Content
    const subscriptionContent = <>
        <h3 className="text-xl font-bold text-secondary mb-8">Your <TextCard backgroundColor="info" rotate="2">✨subscriptions</TextCard></h3>

        {/* Modal Form */}
        <Modal modalType="add" ref={modalAddFormRef} closeModal={() => {
            setaddFormData({
                subscriptionName: "",
                price: "",
                currency: "",
                typeOfPayment: "",
                paymentMethod: "",
                upcomingPayment: "",
                websiteLink: ""
            });
            closeModal(modalAddFormRef);
        }} handleMainAction={handleAddSubmit} addFormData={addFormData} setAddFormData={setaddFormData} listedSubscriptions={listedSubscriptions} parseEmail={() => { }} />

        <Modal modalType="delete" ref={modalDeleteConfirmRef} closeModal={closeModal} handleMainAction={handleDelete} />

        <Modal modalType="edit" ref={modalEditFormRef} closeModal={() => {
            setEditFormData({
                id: 0,
                subscriptionName: "",
                price: "",
                currency: "",
                typeOfPayment: "",
                upcomingPayment: "",
                paymentMethod: "",
                websiteLink: ""
            })
            // setClickedSubscription(null);
            closeModal(modalEditFormRef)
        }} editFormData={editFormData} setEditFormData={setEditFormData} handleMainAction={handleEditSubmit} />

        <Modal modalType="attachFile" ref={modalAttachFileRef} closeModal={closeModal} handleUploadAttachemnts={(e) => handleUploadAttachment(e, rightClickSubscriptionId)} />

        {/* Content */}
        <div className="flex gap-x-5 flex-wrap">
            <div className="bg-base-100 p-5 rounded-lg mb-8 w-fit">
                <SubscriptionDetail title="Total Active Subscriptions:" value={subscriptions.length} />
            </div>

            <div className="bg-base-100 p-5 rounded-lg mb-8 w-fit">
                <SubscriptionDetail title="Total Month Cost:" value={monthlyCost + '$'} />
            </div>

            <div className="bg-base-100 p-5 rounded-lg mb-8 w-fit">
                <SubscriptionDetail title="Total Year Cost:" value=
                    {yearlyCost + '$'} />
            </div>
        </div>

        <SubscriptionsList subscriptions={subscriptions} clickedSubscriptionRef={clickedSubscriptionRef} onSetEditFormData={onSetEditFormData} openAddModal={() => openModal(modalAddFormRef)} openDeleteModal={() => openModal(modalDeleteConfirmRef)} openEditModal={() => openModal(modalEditFormRef)} onClickContext={handleSubscriptionsContextMenu} />

        <DetailedInfoTable dataType="subscriptions" data={subscriptions} />
    </>;

    const trialsContent = <>
        <h3 className="text-xl font-bold text-secondary mb-8">Your <TextCard backgroundColor="success" rotate="-2">⏳trials</TextCard></h3>

        {/* Content */}
        <div className="bg-base-100 p-5 rounded-lg mb-8 w-fit">
            <SubscriptionDetail title="Trials:" value={trials.length} />
        </div>

        <Modal modalType="addTrial" ref={modalAddtrialFormRef} closeModal={() => {
            setAddTrialFormData({
                subscriptionName: "",
                websiteLink: "",
                trialEndDate: ""
            });
            closeModal(modalAddtrialFormRef);
        }} handleMainAction={handleAddTrialSubmit} addTrialFormData={addTrialFormData} setAddTrialFormData={setAddTrialFormData} listedSubscriptions={listedSubscriptions} />

        <Modal modalType="deleteTrial" ref={modalDeleteTrialConfirmRef} closeModal={closeModal} handleMainAction={handleDeleteTrial} />

        <Modal modalType="editTrial" ref={modalEditTrialFormRef} closeModal={() => {
            setEditTrialFormData({
                id: 0,
                subscriptionName: "",
                trialEndDate: "",
                websiteLink: ""
            })
            // setClickedSubscription(null);
            closeModal(modalEditTrialFormRef)
        }} editTrialFormData={editTrialFormData} setEditTrialFormData={setEditTrialFormData} handleMainAction={handleEditTrialSubmit} />


        <div className="flex justify-center md:justify-start w-full gap-10 flex-wrap mb-8">
            <Block size="superSmall" onClick={() => openModal(modalAddtrialFormRef)}>
                <div className="h-full w-full flex items-center justify-center">
                    <FaPlus className="text-secondary text-5xl" />
                </div>
            </Block>
            {trials.map((trial: { id: number, name: string, trialEndDate: string, icon: string, websiteLink: string }) => {

                return <Block size="superSmall" key={trial.id} onClickContext={(e) => handleSubscriptionsContextMenu(e, trial.websiteLink, rightClickSubscriptionId)}>
                    <div className="flex justify-between">

                        <img src={trial.icon} className="h-12" alt="" />
                        <p className="text-secondary"><span className="py-2 px-4 rounded-lg bg-neutral-300 text-sm">{trial.name.length > 10 ? trial.name.slice(0, 10) + '.' : trial.name}</span></p>
                    </div>
                    <div className="flex flex-col py-4 gap-3">
                        <p className="text-secondary text-sm">ends at: <span className="py-2 px-2 rounded-lg bg-neutral-300">{trial.trialEndDate}</span></p>
                        <div className="flex justify-between">
                            <CustomButton size="small" onClick={() => {
                                clickedTrialRef.current = trial;
                                openModal(modalDeleteTrialConfirmRef);
                            }}>Delete</CustomButton>
                            <CustomButton size="small" backgroundColor="info" onClick={() => {
                                editTrialSubscription(trial);
                                openModal(modalEditTrialFormRef)
                            }}>
                                Edit
                            </CustomButton>
                        </div>
                    </div>
                </Block>
            })}
        </div>

        <DetailedInfoTable dataType="trials" data={trials} />
    </>;

    const attachmentsContent = <>
        <h3 className="text-xl font-bold text-secondary mb-8">track <TextCard backgroundColor="warning" rotate="2">📎attachments</TextCard></h3>

        <div className="flex justify-center md:justify-start w-full gap-10 flex-wrap mb-8">
            {attachments.map((attachment: { id: number, name: string, attachments: string[] }) => <Block size="large" key={attachment.id}>
                <p className="text-secondary mb-4"><span className="py-2 px-4 rounded-lg bg-neutral-300 text-lg font-extrabold">{attachment.name}</span></p>
                {attachment.attachments.length ? <ul className="flex flex-col gap-y-2">{attachment.attachments.map((url, index) => {
                    const fileName = url.split('/').pop() as string;

                    // Remove the numbers and dash before the actual name
                    const cleanedName = fileName.replace(/^\d+-/, '').split('.').slice(0, -1).join('.');

                    return <li className="hover:scale-105 transform duration-75" key={attachment.id * 1000 + index} onContextMenu={(e) => {
                        handleFilesContextMenu(e, attachment.id, fileName)
                    }}>
                        <div className="p-2 bg-orange-50 border-2 border-warning rounded-lg">
                            <a href={url} target="_blank" className="text-xs flex items-center gap-x-4">
                                <CiFileOn className="text-2xl" />
                                {cleanedName.slice(0, 21)}
                            </a>
                        </div>

                    </li>
                })}</ul> : <TextCard backgroundColor="info" rotate="2">No files attached</TextCard>}
            </Block>)}
        </div>
    </>;

    console.log('render')

    return <div className="flex">
        <div className="fixed bg-base-100 w-50 py-10 px-4 flex flex-col items-center justify-between border-r-[1px] border-neutral-300 h-screen">

            <Modal modalType="settings" ref={modalSettingsRef} userInfo={user} updatedEmail={updatedEmail} isUpdatingEmail={isUpdatingEmail} isUpdatingPassword={isUpdatingPassword} closeModal={closeModal} setIsUpdatingEmail={setIsUpdatingEmail} handleUploadAvatar={handleUploadAvatar} setUpdatedEmail={setUpdatedEmail} handleUpdateEmail={handleUpdateEmail} handleUpdatePassword={handleUpdatePassword} setIsUpdatingPassword={setIsUpdatingPassword} setUpdatedPassword={setUpdatedPassword} />

            <div className="flex flex-col items-center">
                <div className="flex items-center gap-x-4 mb-2">
                    {avatar && <div className="avatar indicator">
                        <span className="indicator-item badge badge-secondary text-base-100 text-xs p-2">Free</span>
                        <div className="w-10 rounded-xl">
                            <img src={avatar} />
                        </div>
                    </div>}
                    {userFirstName && <span className="text-secondary text-md">{userFirstName}</span>}
                </div>
            </div>
            <ul className="text-secondary flex flex-col gap-y-7">
                <li className="flex items-center gap-x-4 p-2 hover:bg-info rounded-lg cursor-pointer hover:text-base-100 transform duration-75" onClick={() => setCurrentTab("subscriptions")}>
                    <MdSubscriptions className="text-3xl" /><span className="text-md">Subscriptions</span>
                </li>
                <li className="flex items-center gap-x-4 p-2 hover:bg-success rounded-lg cursor-pointer hover:text-base-100 transform duration-75" onClick={() => setCurrentTab("trials")}>
                    <IoIosTimer className="text-3xl" /><span className="text-md">Trials</span>
                </li>
                <li className="flex items-center gap-x-4 p-2 hover:bg-warning rounded-lg cursor-pointer hover:text-base-100 transform duration-75" onClick={() => setCurrentTab("attachments")}>
                    <IoIosAttach className="text-3xl" /><span className="text-md">Attachments</span>
                </li>
            </ul>
            <div className="w-full">

                <a href="https://buymeacoffee.com/andrewarten" className="block px-4 py-2 border-warning w-full bg-orange-50 border-2 rounded-lg text-secondary text-lg font-bold mb-2 text-center">Buy me a coffee ☕</a>
                <ul className="text-secondary flex flex-col gap-y-2 pt-3 mt-5 border-t-[1px] border-neutral-300">
                    <li className="flex items-center gap-x-4 p-2 hover:bg-neutral-100 rounded-lg cursor-pointer  transform duration-75" onClick={signOut}>
                        <RiLogoutBoxFill className="text-3xl" /><span className="text-md">Logout</span>
                    </li>
                    <li className="flex items-center gap-x-4 p-2 hover:bg-neutral-100 rounded-lg cursor-pointer  transform duration-75" onClick={() => openModal(modalSettingsRef)}>
                        <IoMdSettings className="text-3xl" /><span className="text-md">Settings</span>
                    </li>
                </ul>
            </div>

        </div>
        <div className="p-10 pl-60 bg-neutral-100 w-full min-h-screen overflow-hidden">

            {/* Context Menus */}
            {subscriptionsContextMenu.show && <SubscriptionsContextMenu x={subscriptionsContextMenu.x} y={subscriptionsContextMenu.y} websiteLink={subscriptionsContextMenu.data.websiteLink} closeContextMenu={subscriptionsContextMenuClose} openModalAttachFile={() => openModal(modalAttachFileRef)} />}

            {filesContextMenu.show && <FilesContextMenu x={filesContextMenu.x} y={filesContextMenu.y} closeContextMenu={filesContextMenuClose} deleteClickedAttachedFile={deleteClickedAttachedFile} />}

            {/* Allerts */}
            <AnimatePresence>
                {alertMessage && <motion.div
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    variants={fadeInFromSide}
                    role="alert" className="alert alert-success absolute bottom-10 right-10 z-50">
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
                    variants={fadeInFromSide} role="alert" className="alert alert-error absolute bottom-10 right-10 z-50">
                    <svg className="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-base-100">{errorMessage}</span>
                </motion.div>}
            </AnimatePresence>

            {renderTabContent()}
        </div>

    </div>

}

export default Dashboard