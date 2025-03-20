import { Link, NavLink } from 'react-router-dom';

import Block from '../components/Block';
import CustomButton from '../components/CustomButton';
import Description from '../components/Description';
import TextCard from '../components/TextCard';

// motion
import { motion } from 'framer-motion';
// variants
import { fadeIn } from '../variants';

import video from '/example_video.mp4';

import image from '/images/SubLy.png';
import screenshot_1 from '/images/chrome_7z7VL0O6VO.png';
import screenshot_2 from '/images/chrome_GwsYeswxwZ.png';
import screenshot_3 from '/images/chrome_Ra5pVaIm7W.png';
import screenshot_4 from '/images/chrome_Yl9ZtA159z.png';
import avatar_1 from '/avatars/1619192462048.jpg';
import avatar_2 from '/avatars/1682786485128.jpg';
import avatar_3 from '/avatars/1729926383582.jpg';



const Home = () => {

    return (
        <div className="min-h-screen overflow-y-scroll w-screen pb-20">
            {/* Hero Section */}
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
                            <div className="badge text-primary">
                                start saving your money
                            </div>
                            <h1 className="text-5xl md:text-7xl font-bold text-secondary leading-[100%]">
                                The smarter way to
                                <br />
                                manage <TextCard backgroundColor="info" rotate="-2">
                                    ✨subscribtions
                                </TextCard>
                            </h1>
                            <Description size="big">
                                Say goodbye to scattered subscription management and unreliable tools — Use SubLy to effortlessly track and manage all your subscriptions on a simple and intuitive timeline.
                            </Description>
                            <NavLink to="/signup"><CustomButton size="big">Get started for free</CustomButton></NavLink>
                        </div>
                    </div>
                </motion.div>
            </section>

            {/* Demo Video Section */}
            <section>
                <motion.div
                    className="max-w-[1100px] px-4 mx-auto"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={fadeIn}
                >
                    <video src={video} autoPlay muted loop className="rounded-2xl" />
                </motion.div>
            </section>

            {/* Trusted by users */}
            <section className="pt-24">
                <motion.div
                    className="max-w-[1100px] px-4 mx-auto"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={fadeIn}


                >

                    <div className="p-10 border-warning bg-orange-50 border-2 rounded-lg w-fit transform hover:scale-105 duration-75 flex flex-col items-center max-w-4xl mx-auto">
                        <h2 className="text-5xl text-secondary font-extrabold mb-5 text-center">Trusted by many users <br />around the globe🌎</h2>
                        <div className="avatar-group -space-x-6 justify-center mb-4">
                            <div className="avatar">
                                <div className="w-12">
                                    <img src={avatar_1} />
                                </div>
                            </div>
                            <div className="avatar">
                                <div className="w-12">
                                    <img src={avatar_2} />
                                </div>
                            </div>
                            <div className="avatar">
                                <div className="w-12">
                                    <img src={avatar_3} />
                                </div>
                            </div>
                            <div className="avatar avatar-placeholder">
                                <div className="bg-neutral text-neutral-content w-12">
                                    <span>+99</span>
                                </div>
                            </div>
                        </div>
                        <Link to="/signup">
                            <CustomButton size="big">Get Started</CustomButton>
                        </Link>
                    </div>
                </motion.div>
            </section>

            {/* Optimized for Speed Section */}
            <section className="pt-24">
                <motion.div
                    className="max-w-[1100px] px-4 mx-auto flex flex-col justify-center items-center text-center"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={fadeIn}
                >
                    <img src={image} className="mb-10 max-w-[20vw] min-w-[200px] w-full" alt="" />
                    <div className="max-w-2xl mb-8">
                        <h2 className="text-5xl font-bold text-secondary text-center">
                            Optimized for <TextCard backgroundColor="error" rotate="2">
                                ⚡️speed
                            </TextCard>
                            <br />
                            and ease of use
                        </h2>
                        <Description>
                            We designed SubLy for those who value simplicity, efficiency, and seamless organization. Our goal is to provide an intuitive yet powerful solution for managing and tracking all your subscriptions with ease.
                        </Description>
                    </div>
                    <div className="w-full mx-auto flex justify-center items-center flex-wrap gap-10">
                        <Block>
                            <img src={screenshot_2} className="scale-120" alt="" />
                        </Block>
                        <Block>
                            <img src={screenshot_4} className="scale-200" alt="" />
                        </Block>
                        <Block>
                            <img src={screenshot_1} className="scale-150 absolute right-[-65px] top-[55px]" alt="" />
                        </Block>
                    </div>
                </motion.div>
            </section>

            {/* Track Time Section */}
            <section className="pt-24">
                <motion.div
                    className="max-w-[1100px] px-4 mx-auto flex flex-col justify-center items-center text-center"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={fadeIn}
                >
                    <div className="max-w-2xl mb-8">
                        <h2 className="text-5xl font-bold text-secondary text-center">
                            Keep<TextCard backgroundColor="success" rotate="-2">
                                👀 track
                            </TextCard>
                            <br />
                            of your subscriptions and where your money is going.
                        </h2>
                        <Description>
                            SubLy gives you valuable insights into your subscription durations and costs, while also helping you track your spending patterns and manage your subscriptions with ease.
                        </Description>
                    </div>
                    <div className="mockup-window text-primary border border-base-300 mx-auto w-[600px]">
                        <img src={screenshot_3} alt="" />
                    </div>
                </motion.div>
            </section>

            {/* Control Time and Costs Section */}
            {/* <section className="pt-24">
                <motion.div
                    className="max-w-[1100px] px-4 mx-auto flex flex-col justify-center items-center text-center"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={fadeIn}
                >
                    <div className="max-w-2xl mb-8">
                        <h2 className="text-5xl font-bold text-secondary text-center">
                            Keep<TextCard backgroundColor="warning">
                                ⌛️ time
                            </TextCard>
                            <br />
                            and costs under control
                        </h2>
                        <Description>
                            You can make informed decisions and ensure optimal resource allocation.
                        </Description>
                    </div>
                    <div className="w-full mx-auto flex justify-center items-center flex-wrap gap-10">
                        <Block>
                            <div></div>
                        </Block>
                        <Block>
                            <div></div>
                        </Block>
                    </div>
                </motion.div>
            </section> */}

            {/* What is Resource Planning Section */}
            {/* <section className="pt-24">
                <motion.div
                    className="max-w-[1100px] px-4 mx-auto flex flex-col justify-center items-center text-center"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={fadeIn}
                >
                    <div className="max-w-2xl mb-8">
                        <h2 className="text-5xl font-bold text-secondary text-center">
                            What is Resource Planning?
                        </h2>
                        <Description>
                            Project Management is about getting things done.
                            <br />
                            Resource Planning is about the bigger picture.
                            <br />
                            You should know both.
                        </Description>
                    </div>
                    <div className="w-full mx-auto flex justify-center items-center flex-wrap gap-10">
                        <Block>
                            <div></div>
                        </Block>
                        <Block>
                            <div></div>
                        </Block>
                    </div>
                </motion.div>
            </section> */}

            {/* Track Subscriptions Section */}
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
                        <NavLink to="/signup"><CustomButton size="big">Get started for free</CustomButton></NavLink>
                    </div>
                </motion.div>
            </section>
        </div>
    );
};

export default Home;
