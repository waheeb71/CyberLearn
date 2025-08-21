// src/components/LearningPath.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain, Shield } from 'lucide-react';
import { ReactTyped } from "react-typed";
import { motion } from "framer-motion";
import { Helmet } from 'react-helmet';

const LearningPath = () => {
  const buttonVariants = {
    hover: {
      scale: 1.1,
      boxShadow: "0px 0px 8px rgb(255,255,255)",
      textShadow: "0px 0px 8px rgb(255,255,255)",
      transition: {
        duration: 0.3,
        yoyo: Infinity
      }
    },
    animate: {
      y: ["-10%", "10%"],
      transition: {
        y: {
          duration: 2,
          yoyo: Infinity,
          ease: "easeInOut"
        }
      }
    }
  };

  return (
    <>
      <Helmet>
        <title>اختر مسار التعلم</title>
        <meta name="description" content="اختر مسار التعلم الخاص بك، الأمن السيبراني أو الذكاء الاصطناعي، وابدأ رحلتك." />
      </Helmet>


      <div className="min-h-screen bg-background py-8 px-4 flex flex-col items-center justify-center">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-extrabold text-foreground mb-4" style={{ color: 'white' }}>
            اختر مسار التعلم الخاص بك
          </h1>
          <p className="text-lg text-muted-foreground mb-8">
            ابدأ رحلتك في عالم التكنولوجيا واختر المسار الذي يناسب شغفك.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-8 mb-12 w-full justify-center items-center">
          {/* Cybersecurity Button */}
          <motion.div
            variants={buttonVariants}
            animate="animate"
            whileHover="hover"
            className="flex-1 max-w-sm"
          >
            <Link to="/cybersecurity-learning-path">
              <Button
                size="lg"
                className="w-full h-auto py-8 text-2xl font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                style={{
                  background: 'linear-gradient(45deg, #0f172a, #1e3a8a)',
                  color: 'white',
                }}
              >
                <Shield className="h-10 w-10 mr-4" />
                <span>تعلم الأمن السيبراني</span>
              </Button>
            </Link>
          </motion.div>

          {/* AI Button */}
          <motion.div
            variants={buttonVariants}
            animate="animate"
            whileHover="hover"
            className="flex-1 max-w-sm"
          >
            <Link to="/ai-learning-path">
              <Button
                size="lg"
                className="w-full h-auto py-8 text-2xl font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                style={{
                  background: 'linear-gradient(45deg, #4c1d95, #7e22ce)',
                  color: 'white',
                }}
              >
                <Brain className="h-10 w-10 mr-4" />
                <span>تعلم الذكاء الاصطناعي</span>
              </Button>
            </Link>
          </motion.div>
        </div>

        {/* Motivational Card */}
        <div className="w-full max-w-2xl mt-8">
          <Card className="bg-muted/50">
            <CardContent className="pt-6">
              <h3 className="font-semibold text-lg text-center mb-3 w-full " style={{ color: 'white' }}>💡 تذكر:</h3>
              <p className="text-xl font-bold text-primary leading-relaxed text-center">
                <ReactTyped
                  strings={[
                    "النجاح لا يزور المترددين.",
                    "الفشل ليس النهاية، بل تصحيح المسار.",
                    "الفشل هو خطوة نحو النجاح.",
                    "المعرفة قوة، والبحث مفتاحها.",
                    "تعلم شيئًا جديدًا كل يوم.",
                    "النجاح يحتاج صبر واجتهاد، فأنت على الطريق الصحيح.",
                    "كل خطوة صغيرة تقربك أكثر من هدفك.",
                  ]}
                  typeSpeed={70}
                  backSpeed={40}
                  backDelay={1500}
                  loop
                />
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default LearningPath;