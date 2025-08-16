import { User, Eye } from "lucide-react"; // أيقونات جاهزة

export default function FloatingStats({ usersCount, visitorsCount }) {
  return (
    <div className="fixed top-130 right-5 z-2 flex flex-col gap-2">
      {/* بطاقة الترحيب */}
      <div className="bg-gradient-to-r from-blue-500 to-indigo-00 text-white shadow-xl rounded-2xl p-1">
        <h1 className="text-lg font-bold text-center">
          👋 مرحباً بك في <span className="text-yellow-300">CyberLearn</span>
        </h1>
      </div>

      {/* بطاقة الإحصائيات */}
      <div className="grid grid-cols-2 gap-4">
        {/* عدد المستخدمين */}
        <div className="flex flex-col items-center justify-center  bg-white/50 backdrop-blur-md shadow-lg rounded-xl p-1 hover:scale-105 transition">
          <User className="w-4 h-4 text-blue-500" />
          <span className="text-gray-600 text-sm">المستخدمين</span>
          <p className="text-lg font-bold text-gray-900">{usersCount}</p>
        </div>

        {/* عدد الزوار */}
        <div className="flex flex-col items-center justify-center bg-white/50 backdrop-blur-md shadow-lg rounded-xl p-1 hover:scale-105 transition">
          <Eye className="w-4 h-4 text-green-500" />
          <span className="text-gray-600 text-sm">الزوار</span>
          <p className="text-lg font-bold text-gray-900">{visitorsCount}</p>
        </div>
      </div>
    </div>
  );
}
