<?php

namespace App\Http\Controllers;

use App\Models\Blog;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class BlogController extends Controller
{
    public function index(Request $request)
    {
        $blogs = Blog::latest()
            ->when($request->search, fn($q) => $q->where('title', 'like', "%{$request->search}%"))
            ->when($request->status, fn($q) => $q->where('status', $request->status))
            ->when($request->category, fn($q) => $q->where('category', $request->category))
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Blogs/Index', [
            'blogs'   => $blogs,
            'filters' => $request->only(['search', 'status', 'category']),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'title'        => 'required|string|max:255',
            'content'      => 'required',
            'category'     => 'required|string',
            'author'       => 'nullable|string|max:255',
            'status'       => 'required|in:draft,published',
            'image'        => 'nullable|image|max:2048',
            'published_at' => 'nullable|date',
        ]);

        $data = $request->only(['title', 'content', 'category', 'author', 'status', 'published_at']);
        $data['slug'] = Blog::generateSlug($request->title);

        if ($request->hasFile('image')) {
            $data['image'] = $request->file('image')->store('blogs', 'public');
        }

        if ($request->status === 'published' && empty($data['published_at'])) {
            $data['published_at'] = now();
        }

        Blog::create($data);

        return redirect()->back()->with('success', 'Blog created successfully!');
    }

    public function update(Request $request, Blog $blog)
    {
        $request->validate([
            'title'        => 'required|string|max:255',
            'content'      => 'required',
            'category'     => 'required|string',
            'author'       => 'nullable|string|max:255',
            'status'       => 'required|in:draft,published',
            'image'        => 'nullable|image|max:2048',
            'published_at' => 'nullable|date',
        ]);

        $data = $request->only(['title', 'content', 'category', 'author', 'status', 'published_at']);

        if ($request->hasFile('image')) {
            if ($blog->image) {
                \Storage::disk('public')->delete($blog->image);
            }
            $data['image'] = $request->file('image')->store('blogs', 'public');
        }

        if ($request->status === 'published' && empty($blog->published_at)) {
            $data['published_at'] = now();
        }

        $blog->update($data);

        return redirect()->back()->with('success', 'Blog updated successfully!');
    }

    public function destroy(Blog $blog)
    {
        if ($blog->image) {
            \Storage::disk('public')->delete($blog->image);
        }
        $blog->delete();

        return redirect()->back()->with('success', 'Blog deleted successfully!');
    }
}