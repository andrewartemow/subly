import { Link, NavLink } from 'react-router-dom';

import CustomButton from '../components/CustomButton';
import Description from '../components/Description';
import TextCard from '../components/TextCard';

// motion
import { motion } from 'framer-motion';
// variants
import { fadeIn } from '../variants';

import video from '/example_video.webm';

import image from '/images/SubLy.png';
// import screenshot_1 from '/images/chrome_7z7VL0O6VO.png';
// import screenshot_2 from '/images/chrome_GwsYeswxwZ.png';
// import screenshot_3 from '/images/chrome_Ra5pVaIm7W.png';
// import screenshot_4 from '/images/chrome_Yl9ZtA159z.png';
import avatar_1 from '/avatars/avatar.jpg';
import avatar_2 from '/avatars/1682786485128.jpg';
import avatar_3 from '/avatars/1729926383582.jpg';



const Home = () => {

    return (
        <div className="min-h-screen overflow-y-scroll w-screen pb-20 relative">

            <div className="bg-orange-50 p-4 border-2 border-warning rounded-lg fixed z-50 top-[100px] right-[20px]">
                <a href="https://www.producthunt.com/posts/subly-2?embed=true&utm_source=badge-featured&utm_medium=badge&utm_souce=badge-subly&#0045;2" target="_blank"><img src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=951774&theme=light&t=1744270769696" alt="Subly - Track&#0032;your&#0032;subscriptions&#0032;before&#0032;they&#0032;drain&#0032;your&#0032;wallet&#0046; | Product Hunt" style={{ width: "250px", height: "54px", marginBottom: 10 }} width="250" height="54" /></a>
                <p className="text-xl font-bold text-secondary text-center"><TextCard backgroundColor="warning" rotate="2">🚀upvote</TextCard> me here</p>
            </div>
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
                            <div className="badge text-primary bg-neutral-50 border-[1px] border-neutral-300 text-lg">
                                struggling to track your subscriptions?
                            </div>
                            <h1 className="text-5xl md:text-7xl font-bold text-secondary leading-[100%]">
                                The smarter way to
                                <br />
                                manage <TextCard backgroundColor="info" rotate="-2">
                                    ✨subscribtions
                                </TextCard>
                            </h1>
                            <Description size="big">
                                Stay on top of all your recurring expenses—personal, business, or anything in between.
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

                    <div className="p-10 border-warning bg-orange-50 border-2 rounded-lg w-full transform hover:scale-105 duration-75 flex flex-col items-center max-w-4xl mx-auto">
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
                    <div className="max-w-4xl mb-10">
                        <h2 className="text-5xl font-bold text-secondary text-center mb-10">
                            Why It Will Save You <br /><TextCard backgroundColor="success" rotate="-2">
                                💸money
                            </TextCard> and <TextCard backgroundColor="warning" rotate="2">⌛time</TextCard>?
                        </h2>
                        {/* <Description> */}
                        <div className="flex flex-col w-full items-center lg:flex-row lg:items-start">
                            <div className="card bg-neutral-100 rounded-box grid place-items-center py-5 px-4">
                                <h3 className="mb-4 text-xl font-extrabold w-full text-left text-secondary">With Subly</h3>
                                <ul className="flex flex-col gap-y-5 w-full">
                                    <li className="text-left"><span className="py-2 px-4 rounded-lg text-secondary bg-neutral-200 font-bold">✅ No more surprise charges</span></li>
                                    <li className="text-left"><span className="py-2 px-4 rounded-lg text-secondary bg-neutral-200 font-bold">✅ See upcoming bills at a glance</span></li>
                                    <li className="text-left"><span className="py-2 px-4 rounded-lg text-secondary bg-neutral-200 font-bold">✅ Stop losing money on forgotten trials</span></li>
                                    <li className="text-left"><span className="py-2 px-4 rounded-lg text-secondary bg-neutral-200 font-bold">✅ Track monthly & yearly costs</span></li>
                                    <li className="text-left"><span className="py-2 px-4 rounded-lg text-secondary bg-neutral-200 font-bold">✅ Store and manage invoices</span></li>
                                </ul>
                            </div>
                            <div className="divider divider-vertical lg:divider-horizontal text-secondary">OR</div>
                            <div className="card bg-neutral-100 rounded-box grid place-items-center py-5 px-4">
                                <h3 className="mb-4 text-xl font-extrabold w-full text-left text-secondary">Without Subly</h3>
                                <ul className="flex flex-col w-full gap-y-5">
                                    <li className="text-left"><span className="py-2 px-4 rounded-lg bg-neutral-200 text-secondary font-bold">❌ Forgetting about upcoming payments</span></li>
                                    <li className="text-left"><span className="py-2 px-4 rounded-lg bg-neutral-200 text-secondary font-bold">❌ Manually tracking costs in spreadsheets</span></li>
                                    <li className="text-left"><span className="py-2 px-4 rounded-lg bg-neutral-200 text-secondary font-bold">❌ Getting charged after free trials end</span></li>
                                    <li className="text-left"><span className="py-2 px-4 rounded-lg bg-neutral-200 text-secondary font-bold">❌ Overspending without realizing it</span></li>
                                    <li className="text-left"><span className="py-2 px-4 rounded-lg bg-neutral-200 text-secondary font-bold">❌ Confusing payment dates</span></li>
                                    <li className="text-left"><span className="py-2 px-4 rounded-lg bg-neutral-200 text-secondary font-bold">❌ Missing saving opportunities</span></li>
                                    <li className="text-left"><span className="py-2 px-4 rounded-lg bg-neutral-200 text-secondary font-bold">❌ No clear cost overview</span></li>
                                </ul>
                            </div>
                        </div>
                        {/* </Description> */}
                    </div>
                    {/* <div className="w-full mx-auto flex justify-center items-center flex-wrap gap-10">
                        <Block>
                            <img src={screenshot_2} className="scale-120" alt="" />
                        </Block>
                        <Block>
                            <img src={screenshot_4} className="scale-200" alt="" />
                        </Block>
                        <Block>
                            <img src={screenshot_1} className="scale-150 absolute right-[-65px] top-[55px]" alt="" />
                        </Block>
                    </div> */}
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
                            Its Free to <TextCard backgroundColor="info" rotate="-2">
                                🚀 use
                            </TextCard>
                            <br />
                            You <TextCard backgroundColor="success" rotate="2">💸buy</TextCard> me <TextCard backgroundColor="warning" rotate="2">☕coffee</TextCard> if you want to 😁
                        </h2>
                        <Description>
                            I built this SaaS because I genuinely enjoy creating tools that make life easier for people. Sometimes the best ideas come from scratching your own itch — and I figured if it helps me, it might help others too.
                            I'm offering it for free because I believe useful tools should be accessible. That said, if you find value in what I’ve made and want to support its ongoing development (or just buy me a coffee ☕), it means the world and helps me keep building more like it.
                        </Description>
                        <a href="https://buymeacoffee.com/andrewarten" className="p-2 bg-orange-50 border-2 border-warning rounded-lg text-xl text-secondary font-bold">Buy me a coffee ☕</a>
                    </div>

                </motion.div>
            </section>

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
                            Found a <TextCard backgroundColor="error" rotate="2">🪳bug</TextCard>? <br />Feel free to contact me
                        </h2>
                        <a href="mailto:andrewartemow@gmail.com" className="p-2 bg-green-100 border-2 border-success rounded-lg text-xl font-bold text-secondary">📬 Reach me anytime</a>
                    </div>
                </motion.div>
            </section>
        </div>
    );
};

export default Home;
