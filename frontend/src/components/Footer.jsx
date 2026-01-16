import { Facebook, Instagram, Youtube } from "lucide-react";

function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300 mt-12">
      <div className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* โลโก้ + คำอธิบาย */}
        <div>
          <h2 className="text-xl font-semibold text-white mb-2">
            Thai Sign Language Learning
          </h2>
          <p className="text-sm text-gray-400">
            แพลตฟอร์มเพื่อการเรียนรู้ภาษามือไทยสำหรับทุกคน  
            เรียนรู้ เข้าใจ และสื่อสารอย่างเท่าเทียม
          </p>
        </div>

        {/* ลิงก์ด่วน */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">
            ลิงก์ที่สำคัญ
          </h3>
          <ul className="space-y-2 text-sm">
            <li><a href="/" className="hover:text-white">หน้าแรก</a></li>
            <li><a href="/courses" className="hover:text-white">คอร์สเรียน</a></li>
            <li><a href="/about" className="hover:text-white">เกี่ยวกับเรา</a></li>
            <li><a href="/privacy" className="hover:text-white">นโยบายความเป็นส่วนตัว</a></li>
          </ul>
        </div>

        {/* โซเชียลมีเดีย */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">
            ติดตามเรา
          </h3>
          <div className="flex space-x-4">
            {/* เปลี่ยน href="#" เป็น URL จริง หรือใช้ button */}
            <a
              href="https://www.facebook.com/thaisignlearning"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-500"
              aria-label="Facebook"
            >
              <Facebook />
            </a>
            <a
              href="https://www.instagram.com/thaisignlearning"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-pink-500"
              aria-label="Instagram"
            >
              <Instagram />
            </a>
            <a
              href="https://www.youtube.com/@thaisignlearning"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-red-500"
              aria-label="Youtube"
            >
              <Youtube />
            </a>
          </div>
          <p className="mt-4 text-sm text-gray-400">
            ติดต่อเรา: <a href="mailto:info@thaisignlearning.com" className="hover:text-white">info@thaisignlearning.com</a>
          </p>
        </div>
      </div>

      <div className="border-t border-gray-700 text-center py-4 text-sm text-gray-400">
        © {year} Thai Sign Language Learning Platform. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;
