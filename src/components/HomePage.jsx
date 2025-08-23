// src/components/HomePage.jsx
import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, BookOpen, Award, Users, Target, Zap, Brain } from 'lucide-react';
import heroImage from '../assets/hero_image.png';
import rewardsImage from '../assets/rewards_image.png';
import { Helmet } from "react-helmet";
import { getUsersCount } from "../utils/usersCount";
import { trackVisitor, getVisitorsCount } from "../utils/visitorsCount";
import FloatingStats from "@/components/FloatingStats";
import AdsenseAd from "./AdsenseAd";
const HomePage = ({ currentUser }) => {
    const [usersCount, setUsersCount] = useState(0);
    const [visitorsCount, setVisitorsCount] = useState(0);

    useEffect(() => {
        async function fetchData() {
            try {
                // جلب عدد المستخدمين
                const users = await getUsersCount();
                setUsersCount(users);

                // تسجيل الزائر الحالي
                await trackVisitor();

                // جلب عدد الزوار
                const visitors = await getVisitorsCount();
                setVisitorsCount(visitors);
            } catch (error) {
                console.error("خطأ أثناء جلب الإحصائيات:", error);
            }
        }

        fetchData();
    }, []);

    const features = [
        {
            icon: Shield,
            title: 'الأمن السيبراني',
            description: 'تعلم كيفية حماية الأنظمة والشبكات والبيانات من التهديدات الإلكترونية.'
        },
        {
            icon: Brain,
            title: 'الذكاء الاصطناعي',
            description: 'استكشف عالم تعلم الآلة، والتعلم العميق، وتطبيقات الذكاء الاصطناعي الحديثة.'
        },
        {
            icon: Award,
            title: 'نظام النقاط والحوافز',
            description: 'اجعل رحلتك التعليمية أكثر متعة من خلال نظام النقاط والشارات والمستويات.'
        },
        {
            icon: Users,
            title: 'مجتمع تعليمي',
            description: 'انضم إلى مجتمع نشط من المتعلمين والخبراء لتبادل المعرفة والخبرات.'
        },
        {
            icon: Target,
            title: 'تطبيق عملي',
            description: 'مختبرات عملية وتحديات واقعية لتطبيق ما تتعلمه في كلا المجالين.'
        },
        {
            icon: Zap,
            title: 'محتوى محدث باستمرار',
            description: 'محتوى متجدد يواكب أحدث التطورات في مجالي الأمن السيبراني والذكاء الاصطناعي.'
        }
    ];

    const learningPaths = [
        {
            title: 'الأمن السيبراني',
            description: 'مسار شامل من الأساسيات حتى التخصصات المتقدمة في الأمن السيبراني.',
            icon: Shield
        },
        {
            title: 'الذكاء الاصطناعي',
            description: 'دليل كامل لتعلم الذكاء الاصطناعي من مفاهيمه الأساسية إلى المشاريع العملية.',
            icon: Brain
        }
    ];

    return (
        <>
            <Helmet>
                <link rel="icon" type="image/png" sizes="32x32" href="https://cyberlearn0.netlify.app/og-image.png" />
                <link rel="icon" type="image/png" sizes="16x16" href="https://cyberlearn0.netlify.app/og-image.png" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <meta name="google-adsense-account" content="ca-pub-2404732748519909"></meta>
                <title>منصة التعلم الشاملة: الأمن السيبراني والذكاء الاصطناعي</title>
                <meta name="description" content="ابدأ رحلتك في تعلم الأمن السيبراني والذكاء الاصطناعي من الصفر حتى الاحتراف، مع مسارات تعليمية منظمة وموارد عالية الجودة." />
                <meta name="keywords" content="الأمن السيبراني, الذكاء الاصطناعي, تعلم الأمن السيبراني, تعلم الذكاء الاصطناعي, سيبراني, AI, AI learning, cybersecurity" />
                <meta name="author" content="waheeb al_sharabi" />
                <meta property="og:title" content="منصة التعلم الشاملة: الأمن السيبراني والذكاء الاصطناعي" />
                <meta property="og:description" content="منصة تعليمية متكاملة تقدم مسارات شاملة في الأمن السيبراني والذكاء الاصطناعي." />
                <meta property="og:image" content="https://cyberlearn0.netlify.app/og-image.png" />
                <meta property="og:url" content="https://cyberlearn0.netlify.app" />
                <meta property="og:type" content="website" />
                <meta property="og:site_name" content="منصة التعلم الشاملة" />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="منصة التعلم الشاملة: الأمن السيبراني والذكاء الاصطناعي" />
                <meta name="twitter:description" content="منصة تعليمية متكاملة تقدم مسارات شاملة في الأمن السيبراني والذكاء الاصطناعي." />
                <meta name="twitter:image" content="https://cyberlearn0.netlify.app/og-image.png" />
            </Helmet>

            <div className="min-h-screen">
                {/* Hero Section */}
                <section className="hero-gradient py-20 px-4">
                    <div className="max-w-7xl mx-auto">
                        <div className="grid lg:grid-cols-2 gap-12 items-center">
                            <div className="text-center lg:text-right">
                                <h1 className="text-4xl lg:text-6xl font-bold mb-6 text-foreground" style={{ color: 'white' }}>
                                    منصة تعلم <span className="text-primary block">الأمن السيبراني والذكاء الاصطناعي</span>
                                </h1>
                                <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                                    انطلق في رحلتك نحو المستقبل مع مسارات تعليمية شاملة في أهم مجالات التكنولوجيا.
                                </p>
                                <section>
                                    <AdsenseAd />
                                </section>

                                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                                    {currentUser ? (
                                        <>
                                            <Link to="/learning-path">
                                                <Button size="lg" className="w-full sm:w-auto glow-effect">
                                                    اختر مسارك الآن
                                                </Button>
                                            </Link>
                                            <Link to="/dashboard">
                                                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                                                    لوحة التحكم
                                                </Button>
                                            </Link>
                                        </>
                                    ) : (
                                        <>
                                            <Link to="/register">
                                                <Button size="lg" className="w-full sm:w-auto glow-effect">
                                                    ابدأ التعلم الآن
                                                </Button>
                                            </Link>
                                            <Link to="/learning-path">
                                                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                                                    استكشف المسارات
                                                </Button>
                                            </Link>
                                        </>
                                    )}
                                </div>
                            </div>
                            <div className="flex justify-center">
                                <img
                                    src={heroImage}
                                    alt="AI and Cybersecurity Learning"
                                    className="max-w-full h-auto rounded-lg shadow-2xl"
                                />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section className="py-20 px-4 bg-background">
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl lg:text-4xl font-bold mb-4" style={{ color: 'white' }}>لماذا تختار منصتنا؟</h2>
                            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                                نوفر لك تجربة تعليمية متكاملة في أهم مجالات التكنولوجيا.
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {features.map((feature, index) => (
                                <Card key={index} className="card-hover">
                                    <CardHeader>
                                        <div className="flex items-center space-x-3 rtl:space-x-reverse">
                                            <feature.icon className="h-8 w-8 text-primary" />
                                            <CardTitle className="text-xl">{feature.title}</CardTitle>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <CardDescription className="text-base leading-relaxed">
                                            {feature.description}
                                        </CardDescription>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Learning Paths Section */}
                <section className="py-20 px-4 bg-card">
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl lg:text-4xl font-bold mb-4" style={{ color: 'white' }}>مساراتنا التعليمية</h2>
                            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                                مسارات منظمة ومتدرجة تأخذك من المبتدئ إلى الخبير في كل مجال.
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            {learningPaths.map((path, index) => (
                                <Card key={index} className="card-hover">
                                    <CardHeader>
                                        <div className="flex items-center space-x-3 rtl:space-x-reverse">
                                            <path.icon className="h-8 w-8 text-primary" />
                                            <CardTitle className="text-2xl">{path.title}</CardTitle>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-base text-muted-foreground leading-relaxed">
                                            {path.description}
                                        </p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Gamification Section */}
                <section className="py-20 px-4 bg-background">
                    <div className="max-w-7xl mx-auto">
                        <div className="grid lg:grid-cols-2 gap-12 items-center">
                            <div className="flex justify-center">
                                <img
                                    src={rewardsImage}
                                    alt="Rewards and Gamification"
                                    className="max-w-full h-auto rounded-lg"
                                />
                            </div>

                            <div className="text-center lg:text-right">
                              
                                <h2 className="text-3xl lg:text-4xl font-bold mb-6" style={{ color: 'white' }}>
                                    نظام النقاط والمستويات
                                </h2>
                                <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                                    اجعل تعلمك أكثر متعة وتحفيزاً مع نظام النقاط والشارات. احصل على نقاط عند إكمال كل قسم وتنافس مع المتعلمين الآخرين.
                                </p>
                                <ul className="text-right space-y-3 mb-8">
                                    <li className="flex items-center justify-end space-x-2 rtl:space-x-reverse">
                                        <span>نقاط لكل قسم مكتمل</span>
                                        <Award className="h-5 w-5 text-primary" />
                                    </li>
                                    <li className="flex items-center justify-end space-x-2 rtl:space-x-reverse">
                                        <span>شارات للإنجازات المميزة</span>
                                        <Shield className="h-5 w-5 text-primary" />
                                    </li>
                                    <li className="flex items-center justify-end space-x-2 rtl:space-x-reverse">
                                        <span>مستويات تقدم متدرجة</span>
                                        <Target className="h-5 w-5 text-primary" />
                                    </li>
                                </ul>
                                {currentUser ? (
                                    <Link to="/learning-path">
                                        <Button size="lg" className="glow-effect">
                                            استكشف مسارك الآن
                                        </Button>
                                    </Link>
                                ) : (
                                    <Link to="/register">
                                        <Button size="lg" className="glow-effect">
                                            ابدأ رحلتك الآن
                                        </Button>
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className={`py-20 px-4 ${currentUser ? 'bg-red-500 text-white' : 'bg-primary text-primary-foreground'}`}>
                    <div className="max-w-4xl mx-auto text-center">
                        {currentUser ? (
                            <>
                                <h2 className="text-3xl lg:text-4xl font-bold mb-6">
                                    واصل رحلتك نحو التميز!
                                </h2>
                                <p className="text-xl mb-8 opacity-90">
                                    لقد قطعت شوطاً رائعاً، استعرض تقدمك واستمر في التعلم
                                </p>
                            </>
                        ) : (
                            <>
                                <h2 className="text-3xl lg:text-4xl font-bold mb-6">
                                    هل أنت مستعد لتصبح خبيراً في مجالك؟
                                </h2>
                                <p className="text-xl mb-8 opacity-90">
                                    انضم إلى آلاف المتعلمين الذين بدأوا رحلتهم معنا وحققوا أهدافهم المهنية
                                </p>
                            </>
                        )}
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            {currentUser ? (
                                <Link to="/profile">
                                    <Button
                                        size="lg"
                                        variant="default"
                                        className="w-full sm:w-auto text-red-500 bg-white hover:bg-gray-100"
                                    >
                                        استكشف ملفك الشخصي
                                    </Button>
                                </Link>
                            ) : (
                                <Link to="/register">
                                    <Button
                                        size="lg"
                                        variant="secondary"
                                        className="w-full sm:w-auto"
                                    >
                                        إنشاء حساب مجاني
                                    </Button>
                                </Link>
                            )}
                            <Link to="/sponsor">
                                <Button
                                    size="lg"
                                    variant="outline"
                                    className={`w-full sm:w-auto ${currentUser ? 'border-white text-white hover:bg-white hover:text-red-500' : 'border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary'}`}
                                >
                                    تعرف على الراعي
                                </Button>
                            </Link>
                        </div>
                    </div>
                    <div>
                        {/* باقي الصفحة */}
                        <FloatingStats usersCount={usersCount} visitorsCount={visitorsCount} />
                    </div>
                </section>
            </div>
        </>
    );
};

export default HomePage;