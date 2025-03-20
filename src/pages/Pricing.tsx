import { Link } from "react-router-dom";
import { motion } from "framer-motion"

import image from '/images/SubLy.png';

import CustomButton from "../components/CustomButton"
import Description from "../components/Description"
import TextCard from "../components/TextCard"

import { IoIosCheckmarkCircle } from "react-icons/io";

import { fadeIn } from "../variants"

const Pricing = () => {
    return (
        <div className="min-h-screen w-screen pb-20">
            <section>
                <motion.div
                    className="hero py-20 px-4"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={fadeIn}
                >
                    <div className="text-center">
                        <div className="max-w-4xl">
                            <h1 className="text-5xl md:text-7xl font-bold text-secondary leading-[100%]">
                                Flat and<br />
                                Simple <TextCard backgroundColor="warning" rotate="-2">
                                    💸pricing
                                </TextCard>
                            </h1>
                            <Description size="big">
                                Use SubLy for free or upgrade to Pro at a flat rate.
                            </Description>
                        </div>
                    </div>
                </motion.div>
            </section>
            <section>
                <motion.div
                    className="flex items-center justify-center px-4"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={fadeIn}
                >
                    <div className="p-10 border-neutral-200 w-fit border-2 rounded-lg transform hover:scale-105 duration-75">
                        <h2 className="text-2xl text-secondary font-extrabold mb-2">Free</h2>
                        <ul className="mb-6">
                            <li className="flex items-center gap-x-2 text-neutral-500 font-bold"><IoIosCheckmarkCircle />Up to 10 subscriptions</li>
                        </ul>
                        <Link to="/signup" className="text-primary text-md font-bold p-2 border-[1px] rounded-md">Get Started</Link>
                    </div>
                    <div className="p-10 border-warning bg-orange-50 border-2 rounded-lg w-fit transform hover:scale-105 duration-75">
                        <h2 className="text-5xl text-secondary font-extrabold mb-5">1$ / month</h2>
                        <ul className="mb-6">
                            <li className="flex text-xl items-center gap-x-2 text-neutral-500 font-bold"><IoIosCheckmarkCircle />Unlimited subscriptions</li>
                        </ul>
                        <Link to="/signup">
                            <CustomButton size="big">Get Started</CustomButton>
                        </Link>
                    </div>
                </motion.div>
            </section>
            <section className="pt-24">
                <motion.div
                    className="max-w-[1100px] px-4 mx-auto flex flex-col justify-center items-center text-center"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={fadeIn}
                >
                    <img src={image} className="mb-10 max-w-[20vw] min-w-[200px] w-full" alt="" />
                    <div className="max-w-4xl mb-8">
                        <h2 className="text-3xl md:text-5xl font-bold text-secondary text-center mb-12">
                            Track
                            <TextCard backgroundColor="info" rotate="-2">
                                🤩 subscribtions
                            </TextCard>
                            and
                            <TextCard backgroundColor="warning">
                                💸 expences
                            </TextCard>
                            in a
                            <TextCard backgroundColor="success">
                                🙈 simple
                            </TextCard>
                            and
                            <TextCard backgroundColor="error" rotate="-2">
                                ⚡️ easy
                            </TextCard>
                            way
                        </h2>
                        <Link to="/signup">
                            <CustomButton size="big">Get started for free</CustomButton>
                        </Link>
                    </div>
                </motion.div>
            </section>
        </div>
    )
}

export default Pricing