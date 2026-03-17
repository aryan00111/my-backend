<?php

namespace App\Http\Controllers;

use App\Models\Announcement;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AnnouncementController extends Controller
{
    public function index(Request $request)
    {
        $announcements = Announcement::latest()
            ->when($request->search, fn($q) => $q->where('title', 'like', "%{$request->search}%"))
            ->when($request->status, fn($q) => $q->where('status', $request->status))
            ->when($request->type, fn($q) => $q->where('type', $request->type))
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Announcements/Index', [
            'announcements' => $announcements,
            'filters'       => $request->only(['search', 'status', 'type']),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'title'        => 'required|string|max:255',
            'content'      => 'required',
            'type'         => 'required|in:general,urgent,event',
            'audience'     => 'required|in:all,students,teachers,parents',
            'status'       => 'required|in:draft,published',
            'image'        => 'nullable|image|max:2048',
            'published_at' => 'nullable|date',
            'expires_at'   => 'nullable|date',
        ]);

        $data = $request->only(['title', 'content', 'type', 'audience', 'status', 'published_at', 'expires_at']);

        if ($request->hasFile('image')) {
            $data['image'] = $request->file('image')->store('announcements', 'public');
        }

        if ($request->status === 'published' && empty($data['published_at'])) {
            $data['published_at'] = now();
        }

        Announcement::create($data);

        return redirect()->back()->with('success', 'Announcement created successfully!');
    }

    public function update(Request $request, Announcement $announcement)
    {
        $request->validate([
            'title'        => 'required|string|max:255',
            'content'      => 'required',
            'type'         => 'required|in:general,urgent,event',
            'audience'     => 'required|in:all,students,teachers,parents',
            'status'       => 'required|in:draft,published',
            'image'        => 'nullable|image|max:2048',
            'published_at' => 'nullable|date',
            'expires_at'   => 'nullable|date',
        ]);

        $data = $request->only(['title', 'content', 'type', 'audience', 'status', 'published_at', 'expires_at']);

        if ($request->hasFile('image')) {
            if ($announcement->image) {
                \Storage::disk('public')->delete($announcement->image);
            }
            $data['image'] = $request->file('image')->store('announcements', 'public');
        }

        $announcement->update($data);

        return redirect()->back()->with('success', 'Announcement updated successfully!');
    }

    public function destroy(Announcement $announcement)
    {
        if ($announcement->image) {
            \Storage::disk('public')->delete($announcement->image);
        }
        $announcement->delete();

        return redirect()->back()->with('success', 'Announcement deleted successfully!');
    }
}