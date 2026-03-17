import { useState } from "react";
import { Link, usePage } from "@inertiajs/react";

export default function AuthenticatedLayout({ children }) {
    const { url, props } = usePage();
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [openGroup, setOpenGroup] = useState(null);
    const userRole = props.auth.user.role;
    const isAdmin = userRole === "admin";
    const schoolName = props.schoolName || "My School";
    const schoolLogo = props.schoolLogo || "";

    const adminNavGroups = [
        { label: "Dashboard", icon: "📊", href: "/dashboard", single: true },
        {
            label: "Students",
            icon: "🎓",
            children: [
                { href: "/students", icon: "🎓", label: "All Students" },
                { href: "/students/create", icon: "➕", label: "Add Student" },
                { href: "/attendance", icon: "📋", label: "Attendance" },
                {
                    href: "/attendance/report",
                    icon: "📈",
                    label: "Attendance Report",
                },
            ],
        },
        {
            label: "Teachers",
            icon: "👨‍🏫",
            children: [
                { href: "/teachers", icon: "👨‍🏫", label: "All Teachers" },
                { href: "/teachers/create", icon: "➕", label: "Add Teacher" },
                { href: "/departments", icon: "🏢", label: "Departments" },
                {
                    href: "/teachers-attendance",
                    icon: "✅",
                    label: "Teacher Attendance",
                },
                {
                    href: "/teachers-attendance-report",
                    icon: "📊",
                    label: "Attendance Report",
                },
            ],
        },
        {
            label: "Fee Management",
            icon: "💰",
            children: [
                { href: "/fees", icon: "💰", label: "All Fees" },
                { href: "/fee-types", icon: "💳", label: "Fee Types" },
            ],
        },
        {
            label: "Academics",
            icon: "📚",
            children: [
                { href: "/classes", icon: "🏫", label: "Classes & Sections" },
                { href: "/subjects", icon: "📖", label: "Subjects" },
                { href: "/exams", icon: "📝", label: "Exams" },
                { href: "/results", icon: "🏆", label: "Results" },
            ],
        },
        { label: "Parents", icon: "👨‍👩‍👧", href: "/parents", single: true },
        {
            label: "Enrollments",
            icon: "📝",
            href: "/enrollments",
            single: true,
        },
        { label: "Contact", icon: "✉️", href: "/contact", single: true },
        {
            label: "Content",
            icon: "📝",
            children: [
                { href: "/blogs", icon: "📝", label: "Blogs" },
                { href: "/announcements", icon: "📢", label: "Announcements" },
                { href: "/notices", icon: "📋", label: "Notices" },
                { href: "/gallery", icon: "🖼️", label: "Gallery" },
                { href: "/programs", icon: "🎓", label: "Programs" },
            ],
        },

        { label: "Settings", icon: "⚙️", href: "/settings", single: true },
    ];

    const teacherNavGroups = [
        { label: "Dashboard", icon: "📊", href: "/dashboard", single: true },
        { label: "Attendance", icon: "📋", href: "/attendance", single: true },
        {
            label: "Attendance Report",
            icon: "📈",
            href: "/attendance/report",
            single: true,
        },
        { label: "Results", icon: "🏆", href: "/results", single: true },
    ];

    const navGroups = isAdmin ? adminNavGroups : teacherNavGroups;

    const isActive = (href) => {
        if (href === "/dashboard") return url === "/dashboard";
        return url.startsWith(href);
    };

    const isGroupActive = (group) => {
        if (group.single) return isActive(group.href);
        return group.children?.some((c) => isActive(c.href));
    };

    const toggleGroup = (label) => {
        setOpenGroup((prev) => (prev === label ? null : label));
    };

    // Auto open active group on load
    useState(() => {
        navGroups.forEach((g) => {
            if (!g.single && g.children?.some((c) => isActive(c.href))) {
                setOpenGroup(g.label);
            }
        });
    });

    const activeBg = isAdmin
        ? "bg-blue-600 border-blue-400"
        : "bg-green-600 border-green-400";
    const hoverBg = isAdmin ? "hover:bg-gray-700" : "hover:bg-green-800";
    const sidebarBg = isAdmin ? "bg-gray-900" : "bg-green-900";

    const NavContent = ({ mobile = false }) => (
        <>
            {navGroups.map((group) => (
                <div key={group.label}>
                    {group.single ? (
                        <Link
                            href={group.href}
                            onClick={() => mobile && setMobileOpen(false)}
                            className={`flex items-center gap-3 px-4 py-3 text-sm transition-all ${hoverBg} ${
                                isActive(group.href)
                                    ? `${activeBg} text-white border-r-4`
                                    : "text-gray-300"
                            }`}
                        >
                            <span className="text-lg min-w-[20px]">
                                {group.icon}
                            </span>
                            {(mobile || sidebarOpen) && (
                                <span>{group.label}</span>
                            )}
                        </Link>
                    ) : (
                        <>
                            <button
                                onClick={() => toggleGroup(group.label)}
                                className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition-all ${hoverBg} ${
                                    isGroupActive(group)
                                        ? "text-white"
                                        : "text-gray-300"
                                }`}
                            >
                                <span className="text-lg min-w-[20px]">
                                    {group.icon}
                                </span>
                                {(mobile || sidebarOpen) && (
                                    <>
                                        <span className="flex-1 text-left font-medium">
                                            {group.label}
                                        </span>
                                        <span className="text-xs text-gray-400">
                                            {openGroup === group.label
                                                ? "▾"
                                                : "▸"}
                                        </span>
                                    </>
                                )}
                            </button>
                            {(mobile || sidebarOpen) &&
                                openGroup === group.label && (
                                    <div className="bg-black bg-opacity-20">
                                        {group.children.map((child) => (
                                            <Link
                                                key={child.href}
                                                href={child.href}
                                                onClick={() =>
                                                    mobile &&
                                                    setMobileOpen(false)
                                                }
                                                className={`flex items-center gap-3 pl-8 pr-4 py-2.5 text-xs transition-all ${hoverBg} ${
                                                    isActive(child.href)
                                                        ? `${activeBg} text-white border-r-4`
                                                        : "text-gray-400"
                                                }`}
                                            >
                                                <span>{child.icon}</span>
                                                <span>{child.label}</span>
                                            </Link>
                                        ))}
                                    </div>
                                )}
                        </>
                    )}
                </div>
            ))}
        </>
    );

    const getPageTitle = () => {
        for (const g of navGroups) {
            if (g.single && isActive(g.href)) return g.label;
            if (g.children) {
                const active = g.children.find((c) => isActive(c.href));
                if (active) return `${g.label} — ${active.label}`;
            }
        }
        return "Dashboard";
    };

    return (
        <div className="flex h-screen bg-gray-100 overflow-hidden">
            {/* Desktop Sidebar */}
            <aside
                className={`hidden md:flex ${sidebarOpen ? "w-64" : "w-16"} ${sidebarBg} text-white transition-all duration-300 flex-col`}
            >
                <div className="flex items-center justify-between p-4 border-b border-gray-700">
                    {sidebarOpen && (
                        <div className="flex items-center gap-2">
                            {schoolLogo ? (
                                <img
                                    src={`/storage/${schoolLogo}`}
                                    alt="Logo"
                                    className="w-8 h-8 object-contain rounded"
                                />
                            ) : (
                                <span className="text-xl">🏫</span>
                            )}
                            <div>
                                <h1 className="text-sm font-bold text-white leading-tight">
                                    {schoolName}
                                </h1>
                                <p className="text-xs text-gray-400">
                                    {isAdmin
                                        ? "👑 Admin Panel"
                                        : "👨‍🏫 Teacher Panel"}
                                </p>
                            </div>
                        </div>
                    )}
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="text-gray-400 hover:text-white p-1 rounded"
                    >
                        {sidebarOpen ? "◀" : "▶"}
                    </button>
                </div>
                <nav className="flex-1 py-3 overflow-y-auto">
                    <NavContent />
                </nav>
                <div className="border-t border-gray-700 p-4">
                    {sidebarOpen && (
                        <div className="mb-3">
                            <p className="text-sm font-medium text-white">
                                {props.auth.user.name}
                            </p>
                            <p className="text-xs text-gray-400 capitalize">
                                {userRole}
                            </p>
                        </div>
                    )}
                    <Link
                        href="/logout"
                        method="post"
                        as="button"
                        className="flex items-center gap-3 text-sm text-gray-300 hover:text-white w-full"
                    >
                        <span className="text-lg">🚪</span>
                        {sidebarOpen && <span>Logout</span>}
                    </Link>
                </div>
            </aside>

            {/* Mobile Sidebar Overlay */}
            {mobileOpen && (
                <div className="fixed inset-0 z-50 md:hidden">
                    <div
                        className="absolute inset-0 bg-black bg-opacity-50"
                        onClick={() => setMobileOpen(false)}
                    />
                    <aside
                        className={`absolute left-0 top-0 h-full w-72 ${sidebarBg} text-white flex flex-col z-10`}
                    >
                        <div className="flex items-center justify-between p-4 border-b border-gray-700">
                            <div className="flex items-center gap-2">
                                {schoolLogo ? (
                                    <img
                                        src={`/storage/${schoolLogo}`}
                                        alt="Logo"
                                        className="w-8 h-8 object-contain rounded"
                                    />
                                ) : (
                                    <span className="text-xl">🏫</span>
                                )}
                                <div>
                                    <h1 className="text-sm font-bold text-white leading-tight">
                                        {schoolName}
                                    </h1>
                                    <p className="text-xs text-gray-400">
                                        {isAdmin ? "👑 Admin" : "👨‍🏫 Teacher"}
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => setMobileOpen(false)}
                                className="text-gray-400 hover:text-white p-1 rounded text-xl"
                            >
                                ✕
                            </button>
                        </div>
                        <nav className="flex-1 py-3 overflow-y-auto">
                            <NavContent mobile={true} />
                        </nav>
                        <div className="border-t border-gray-700 p-4">
                            <div className="mb-3">
                                <p className="text-sm font-medium text-white">
                                    {props.auth.user.name}
                                </p>
                                <p className="text-xs text-gray-400 capitalize">
                                    {userRole}
                                </p>
                            </div>
                            <Link
                                href="/logout"
                                method="post"
                                as="button"
                                className="flex items-center gap-3 text-sm text-gray-300 hover:text-white w-full"
                            >
                                <span className="text-lg">🚪</span>
                                <span>Logout</span>
                            </Link>
                        </div>
                    </aside>
                </div>
            )}

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Top Header */}
                <header className="bg-white shadow-sm px-4 md:px-6 py-3 md:py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        {/* Mobile menu button */}
                        <button
                            onClick={() => setMobileOpen(true)}
                            className="md:hidden text-gray-500 hover:text-gray-700 p-1"
                        >
                            <svg
                                className="w-6 h-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M4 6h16M4 12h16M4 18h16"
                                />
                            </svg>
                        </button>
                        <h2 className="text-base md:text-lg font-semibold text-gray-700 truncate">
                            {getPageTitle()}
                        </h2>
                    </div>
                    <div className="flex items-center gap-2 md:gap-3">
                        <span
                            className={`hidden sm:block text-xs px-2 py-1 rounded-full font-medium ${isAdmin ? "bg-blue-100 text-blue-700" : "bg-green-100 text-green-700"}`}
                        >
                            {isAdmin ? "👑 Admin" : "👨‍🏫 Teacher"}
                        </span>
                        <span className="hidden sm:block text-sm text-gray-500">
                            {props.auth.user.name}
                        </span>
                        <div
                            className={`w-8 h-8 ${isAdmin ? "bg-blue-500" : "bg-green-500"} rounded-full flex items-center justify-center text-white text-sm font-bold`}
                        >
                            {props.auth.user.name.charAt(0).toUpperCase()}
                        </div>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto">{children}</main>
            </div>
        </div>
    );
}
