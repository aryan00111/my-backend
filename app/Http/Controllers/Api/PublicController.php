<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Blog;
use App\Models\Announcement;
use App\Models\Notice;
use App\Models\Gallery;
use Illuminate\Http\Request;

class PublicController extends Controller
{
    public function blogs(Request $request)
    {
        $blogs = Blog::where('status', 'published')
            ->when($request->category, fn($q) => $q->where('category', $request->category))
            ->latest('published_at')
            ->paginate($request->per_page ?? 10);

        return response()->json($blogs);
    }

    public function blog($slug)
    {
        $blog = Blog::where('slug', $slug)->where('status', 'published')->firstOrFail();
        return response()->json($blog);
    }

    public function announcements(Request $request)
    {
        $announcements = Announcement::where('status', 'published')
            ->where(fn($q) => $q->whereNull('expires_at')->orWhere('expires_at', '>=', now()))
            ->when($request->type, fn($q) => $q->where('type', $request->type))
            ->when($request->audience, fn($q) => $q->where('audience', $request->audience)->orWhere('audience', 'all'))
            ->latest('published_at')
            ->paginate($request->per_page ?? 10);

        return response()->json($announcements);
    }

    public function notices(Request $request)
    {
        $notices = Notice::where('status', 'published')
            ->where(fn($q) => $q->whereNull('expires_at')->orWhere('expires_at', '>=', now()))
            ->when($request->type, fn($q) => $q->where('type', $request->type))
            ->when($request->audience, fn($q) => $q->where('audience', $request->audience)->orWhere('audience', 'all'))
            ->latest('published_at')
            ->paginate($request->per_page ?? 10);

        return response()->json($notices);
    }

    public function gallery(Request $request)
{
    $gallery = Gallery::where('status', 'active')
        ->when($request->category, fn($q) => $q->where('category', $request->category))
        ->orderBy('sort_order')
        ->latest()
        ->paginate($request->per_page ?? 20);

    return response()->json($gallery);
}

public function programs()
{
    $programs = \App\Models\Program::where('status', 'active')
        ->orderBy('sort_order')
        ->get();
    return response()->json($programs);
}

}