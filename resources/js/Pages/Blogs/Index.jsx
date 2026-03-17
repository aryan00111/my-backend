import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router, usePage } from "@inertiajs/react";
import { useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import { TextStyle } from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import TextAlign from "@tiptap/extension-text-align";

const MenuBar = ({ editor }) => {
    if (!editor) return null;

    const btn = (action, label, active = false) => (
        <button
            type="button"
            onClick={action}
            className={`px-2 py-1 rounded text-xs font-medium transition ${
                active
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 hover:bg-gray-200 text-gray-700"
            }`}
        >
            {label}
        </button>
    );

    return (
        <div className="flex flex-wrap gap-1 p-2 border-b bg-gray-50">
            {/* Headings */}
            {btn(
                () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
                "H1",
                editor.isActive("heading", { level: 1 }),
            )}
            {btn(
                () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
                "H2",
                editor.isActive("heading", { level: 2 }),
            )}
            {btn(
                () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
                "H3",
                editor.isActive("heading", { level: 3 }),
            )}

            <div className="w-px bg-gray-300 mx-1"></div>

            {/* Format */}
            {btn(
                () => editor.chain().focus().toggleBold().run(),
                "B",
                editor.isActive("bold"),
            )}
            {btn(
                () => editor.chain().focus().toggleItalic().run(),
                "I",
                editor.isActive("italic"),
            )}
            {btn(
                () => editor.chain().focus().toggleUnderline().run(),
                "U",
                editor.isActive("underline"),
            )}
            {btn(
                () => editor.chain().focus().toggleStrike().run(),
                "S̶",
                editor.isActive("strike"),
            )}

            <div className="w-px bg-gray-300 mx-1"></div>

            {/* Lists */}
            {btn(
                () => editor.chain().focus().toggleBulletList().run(),
                "• List",
                editor.isActive("bulletList"),
            )}
            {btn(
                () => editor.chain().focus().toggleOrderedList().run(),
                "1. List",
                editor.isActive("orderedList"),
            )}

            <div className="w-px bg-gray-300 mx-1"></div>

            {/* Align */}
            {btn(
                () => editor.chain().focus().setTextAlign("left").run(),
                "◀",
                editor.isActive({ textAlign: "left" }),
            )}
            {btn(
                () => editor.chain().focus().setTextAlign("center").run(),
                "■",
                editor.isActive({ textAlign: "center" }),
            )}
            {btn(
                () => editor.chain().focus().setTextAlign("right").run(),
                "▶",
                editor.isActive({ textAlign: "right" }),
            )}

            <div className="w-px bg-gray-300 mx-1"></div>

            {/* Blockquote + Code */}
            {btn(
                () => editor.chain().focus().toggleBlockquote().run(),
                "❝",
                editor.isActive("blockquote"),
            )}
            {btn(
                () => editor.chain().focus().toggleCodeBlock().run(),
                "</>",
                editor.isActive("codeBlock"),
            )}

            <div className="w-px bg-gray-300 mx-1"></div>

            {/* Color */}
            <div className="flex items-center gap-1">
                <label className="text-xs text-gray-500">Color:</label>
                <input
                    type="color"
                    onChange={(e) =>
                        editor.chain().focus().setColor(e.target.value).run()
                    }
                    className="w-6 h-6 rounded cursor-pointer border"
                    title="Text Color"
                />
            </div>

            <div className="w-px bg-gray-300 mx-1"></div>

            {/* Clear */}
            {btn(
                () => editor.chain().focus().clearNodes().unsetAllMarks().run(),
                "✕ Clear",
            )}
        </div>
    );
};

const RichEditor = ({ content, onChange }) => {
    const editor = useEditor({
        extensions: [
            StarterKit,
            Underline,
            TextStyle,
            Color,
            TextAlign.configure({ types: ["heading", "paragraph"] }),
        ],
        content: content || "",
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
    });

    return (
        <div className="border rounded-lg overflow-hidden">
            <MenuBar editor={editor} />
            <EditorContent
                editor={editor}
                className="min-h-[250px] p-3 text-sm prose max-w-none focus:outline-none"
            />
            <style>{`
                .ProseMirror { outline: none; min-height: 250px; }
                .ProseMirror h1 { font-size: 1.8em; font-weight: bold; margin: 0.5em 0; }
                .ProseMirror h2 { font-size: 1.4em; font-weight: bold; margin: 0.5em 0; }
                .ProseMirror h3 { font-size: 1.2em; font-weight: bold; margin: 0.5em 0; }
                .ProseMirror ul { list-style: disc; padding-left: 1.5em; }
                .ProseMirror ol { list-style: decimal; padding-left: 1.5em; }
                .ProseMirror blockquote { border-left: 3px solid #ccc; padding-left: 1em; color: #666; margin: 0.5em 0; }
                .ProseMirror code { background: #f4f4f4; padding: 2px 4px; border-radius: 3px; font-family: monospace; }
                .ProseMirror pre { background: #1e1e1e; color: #fff; padding: 1em; border-radius: 6px; }
                .ProseMirror p { margin: 0.3em 0; }
            `}</style>
        </div>
    );
};

export default function Index({ blogs, filters }) {
    const { props } = usePage();
    const flash = props.flash || {};

    const [search, setSearch] = useState(filters?.search || "");
    const [status, setStatus] = useState(filters?.status || "");
    const [category, setCategory] = useState(filters?.category || "");
    const [showModal, setShowModal] = useState(false);
    const [editData, setEditData] = useState(null);
    const [saving, setSaving] = useState(false);
    const [preview, setPreview] = useState(null);

    const emptyForm = {
        title: "",
        content: "",
        category: "general",
        author: "",
        status: "draft",
        published_at: "",
        image: null,
    };
    const [form, setForm] = useState(emptyForm);

    const categories = [
        "general",
        "academic",
        "sports",
        "events",
        "news",
        "achievement",
    ];

    const applyFilter = () => {
        router.get(
            "/blogs",
            { search, status, category },
            { preserveState: true, replace: true },
        );
    };

    const openAdd = () => {
        setForm(emptyForm);
        setEditData(null);
        setPreview(null);
        setShowModal(true);
    };

    const openEdit = (blog) => {
        setForm({
            title: blog.title,
            content: blog.content,
            category: blog.category,
            author: blog.author || "",
            status: blog.status,
            published_at: blog.published_at?.split("T")[0] || "",
            image: null,
        });
        setPreview(blog.image ? `/storage/${blog.image}` : null);
        setEditData(blog);
        setShowModal(true);
    };

    const handleImage = (e) => {
        const file = e.target.files[0];
        if (file) {
            setForm((p) => ({ ...p, image: file }));
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = () => {
        setSaving(true);
        const fd = new FormData();
        Object.entries(form).forEach(([k, v]) => {
            if (v !== null && v !== "") fd.append(k, v);
        });

        if (editData) {
            fd.append("_method", "PUT");
            router.post(`/blogs/${editData.id}`, fd, {
                onSuccess: () => {
                    setSaving(false);
                    setShowModal(false);
                },
                onError: () => setSaving(false),
            });
        } else {
            router.post("/blogs", fd, {
                onSuccess: () => {
                    setSaving(false);
                    setShowModal(false);
                    setForm(emptyForm);
                },
                onError: () => setSaving(false),
            });
        }
    };

    const deleteBlog = (id) => {
        if (confirm("Delete this blog?")) router.delete(`/blogs/${id}`);
    };

    const statusBadge = (s) =>
        s === "published"
            ? "bg-green-100 text-green-700"
            : "bg-yellow-100 text-yellow-700";

    return (
        <AuthenticatedLayout>
            <Head title="Blogs" />
            <div className="py-4 px-4 md:py-8 md:px-6">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl p-5 mb-6 text-white flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-bold">📝 Blogs</h2>
                        <p className="text-blue-100 text-sm mt-1">
                            Manage school blog posts
                        </p>
                    </div>
                    <button
                        onClick={openAdd}
                        className="bg-white text-blue-700 px-4 py-2 rounded-lg text-sm hover:bg-blue-50 font-medium"
                    >
                        + Add Blog
                    </button>
                </div>

                {/* Flash */}
                {flash.success && (
                    <div className="bg-green-50 text-green-700 px-4 py-3 rounded-lg mb-4 text-sm">
                        ✅ {flash.success}
                    </div>
                )}

                {/* Filters */}
                <div className="bg-white rounded-xl shadow p-4 mb-5 flex flex-wrap gap-3 items-end">
                    <div className="flex-1 min-w-40">
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            onKeyDown={(e) =>
                                e.key === "Enter" && applyFilter()
                            }
                            placeholder="🔍 Search blogs..."
                            className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">All Status</option>
                        <option value="published">Published</option>
                        <option value="draft">Draft</option>
                    </select>
                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">All Categories</option>
                        {categories.map((c) => (
                            <option key={c} value={c} className="capitalize">
                                {c}
                            </option>
                        ))}
                    </select>
                    <button
                        onClick={applyFilter}
                        className="bg-blue-600 text-white px-5 py-2 rounded-lg text-sm hover:bg-blue-700"
                    >
                        Filter
                    </button>
                    {(search || status || category) && (
                        <button
                            onClick={() => {
                                setSearch("");
                                setStatus("");
                                setCategory("");
                                router.get("/blogs");
                            }}
                            className="bg-gray-100 text-gray-600 px-4 py-2 rounded-lg text-sm hover:bg-gray-200"
                        >
                            Clear
                        </button>
                    )}
                </div>

                {/* Table */}
                <div className="bg-white rounded-xl shadow overflow-x-auto">
                    {blogs.data.length === 0 ? (
                        <div className="text-center py-16">
                            <p className="text-5xl mb-3">📝</p>
                            <p className="text-gray-400">No blogs found</p>
                        </div>
                    ) : (
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-gray-50 text-left">
                                    <th className="p-4">#</th>
                                    <th className="p-4">Title</th>
                                    <th className="p-4">Category</th>
                                    <th className="p-4">Author</th>
                                    <th className="p-4">Status</th>
                                    <th className="p-4">Published</th>
                                    <th className="p-4">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {blogs.data.map((blog, i) => (
                                    <tr
                                        key={blog.id}
                                        className="border-t hover:bg-gray-50"
                                    >
                                        <td className="p-4 text-gray-400">
                                            {(blogs.current_page - 1) *
                                                blogs.per_page +
                                                i +
                                                1}
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                {blog.image && (
                                                    <img
                                                        src={`/storage/${blog.image}`}
                                                        alt=""
                                                        className="w-10 h-10 object-cover rounded-lg"
                                                    />
                                                )}
                                                <div>
                                                    <p className="font-bold text-gray-800">
                                                        {blog.title}
                                                    </p>
                                                    <p className="text-xs text-gray-400 mt-0.5">
                                                        {blog.content
                                                            ?.replace(
                                                                /<[^>]*>/g,
                                                                "",
                                                            )
                                                            .substring(0, 60)}
                                                        ...
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-xs capitalize">
                                                {blog.category}
                                            </span>
                                        </td>
                                        <td className="p-4 text-gray-600">
                                            {blog.author || "-"}
                                        </td>
                                        <td className="p-4">
                                            <span
                                                className={`px-2 py-1 rounded-full text-xs font-medium ${statusBadge(blog.status)}`}
                                            >
                                                {blog.status}
                                            </span>
                                        </td>
                                        <td className="p-4 text-gray-500 text-xs">
                                            {blog.published_at
                                                ? new Date(
                                                      blog.published_at,
                                                  ).toLocaleDateString()
                                                : "-"}
                                        </td>
                                        <td className="p-4">
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() =>
                                                        openEdit(blog)
                                                    }
                                                    className="bg-yellow-400 text-white px-3 py-1 rounded text-xs hover:bg-yellow-500"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        deleteBlog(blog.id)
                                                    }
                                                    className="bg-red-500 text-white px-3 py-1 rounded text-xs hover:bg-red-600"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}

                    {/* Pagination */}
                    {blogs.last_page > 1 && (
                        <div className="p-4 flex gap-2 justify-center border-t">
                            {Array.from(
                                { length: blogs.last_page },
                                (_, i) => i + 1,
                            ).map((page) => (
                                <button
                                    key={page}
                                    onClick={() =>
                                        router.get("/blogs", {
                                            ...filters,
                                            page,
                                        })
                                    }
                                    className={`px-3 py-1 rounded text-sm ${page === blogs.current_page ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
                                >
                                    {page}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center z-50 px-4 py-8 overflow-y-auto">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl p-6">
                        <div className="flex justify-between items-center mb-5">
                            <h3 className="text-lg font-bold text-gray-800">
                                {editData ? "✏️ Edit Blog" : "➕ Add Blog"}
                            </h3>
                            <button
                                onClick={() => setShowModal(false)}
                                className="text-gray-400 hover:text-gray-600 text-xl"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="space-y-4">
                            {/* Title */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Title *
                                </label>
                                <input
                                    type="text"
                                    value={form.title}
                                    onChange={(e) =>
                                        setForm((p) => ({
                                            ...p,
                                            title: e.target.value,
                                        }))
                                    }
                                    className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Blog title"
                                />
                            </div>

                            {/* Category + Author */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Category *
                                    </label>
                                    <select
                                        value={form.category}
                                        onChange={(e) =>
                                            setForm((p) => ({
                                                ...p,
                                                category: e.target.value,
                                            }))
                                        }
                                        className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        {categories.map((c) => (
                                            <option
                                                key={c}
                                                value={c}
                                                className="capitalize"
                                            >
                                                {c}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Author
                                    </label>
                                    <input
                                        type="text"
                                        value={form.author}
                                        onChange={(e) =>
                                            setForm((p) => ({
                                                ...p,
                                                author: e.target.value,
                                            }))
                                        }
                                        className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Author name"
                                    />
                                </div>
                            </div>

                            {/* TipTap Rich Editor */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Content *{" "}
                                    <span className="text-xs text-blue-500 font-normal">
                                        — Bold, Headings, Colors, Lists
                                        supported
                                    </span>
                                </label>
                                <RichEditor
                                    content={form.content}
                                    onChange={(html) =>
                                        setForm((p) => ({
                                            ...p,
                                            content: html,
                                        }))
                                    }
                                />
                            </div>

                            {/* Image */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Featured Image
                                </label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImage}
                                    className="w-full border rounded-lg px-3 py-2 text-sm"
                                />
                                {preview && (
                                    <img
                                        src={preview}
                                        alt="Preview"
                                        className="mt-2 h-32 object-cover rounded-lg border"
                                    />
                                )}
                            </div>

                            {/* Status + Published At */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Status *
                                    </label>
                                    <select
                                        value={form.status}
                                        onChange={(e) =>
                                            setForm((p) => ({
                                                ...p,
                                                status: e.target.value,
                                            }))
                                        }
                                        className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="draft">Draft</option>
                                        <option value="published">
                                            Published
                                        </option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Publish Date
                                    </label>
                                    <input
                                        type="date"
                                        value={form.published_at}
                                        onChange={(e) =>
                                            setForm((p) => ({
                                                ...p,
                                                published_at: e.target.value,
                                            }))
                                        }
                                        className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-3 mt-5">
                            <button
                                onClick={handleSubmit}
                                disabled={saving}
                                className="bg-blue-600 text-white px-6 py-2 rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50 font-medium"
                            >
                                {saving
                                    ? "Saving..."
                                    : editData
                                      ? "Update Blog"
                                      : "Save Blog"}
                            </button>
                            <button
                                onClick={() => setShowModal(false)}
                                className="bg-gray-100 text-gray-600 px-6 py-2 rounded-lg text-sm hover:bg-gray-200"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
