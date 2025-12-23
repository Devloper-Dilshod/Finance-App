import React from 'react';
import { PlusCircle, MinusCircle, List, PieChart as ChartIcon } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

// Saytning pastki qismidagi menyu (Mobile Web App style)
const Navbar = () => {
    const location = useLocation();

    // Menyudagi tugmalar
    const navItems = [
        { name: 'Kirim', path: '/income', icon: PlusCircle },
        { name: 'Chiqim', path: '/expense', icon: MinusCircle },
        { name: 'Tarix', path: '/history', icon: List },
        { name: 'Grafika', path: '/analytics', icon: ChartIcon },
    ];

    // Qaysi sahifa faolligini tekshirish
    const isActive = (path) => location.pathname === path;

    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] px-4 pb-safe z-50">
            <div className="max-w-md mx-auto flex justify-between items-center h-20">
                {navItems.map((item) => (
                    <Link
                        key={item.path}
                        to={item.path}
                        className="flex flex-col items-center justify-center flex-1 transition-all duration-200"
                    >
                        <div className={`p-2 rounded-xl transition-all duration-300 ${isActive(item.path)
                                ? 'bg-blue-600 text-white transform -translate-y-1'
                                : 'text-slate-400 group-hover:text-blue-500'
                            }`}>
                            <item.icon size={24} strokeWidth={isActive(item.path) ? 2.5 : 2} />
                        </div>
                        <span className={`text-[10px] font-bold mt-1 transition-colors duration-200 ${isActive(item.path) ? 'text-blue-600' : 'text-slate-400'
                            }`}>
                            {item.name}
                        </span>
                    </Link>
                ))}
            </div>
        </nav>
    );
};

export default Navbar;
