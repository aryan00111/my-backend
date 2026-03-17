<?php

namespace App\Http\Controllers;

use App\Models\Notice;
use Illuminate\Http\Request;
use Inertia\Inertia;

class NoticeController extends Controller
{
    public function index(Request $request)
    {
        $notices = Notice::latest()
            ->when($request->search, fn($q) => $q->where('title', 'like', "%{$request->search}%"))
            ->when($request->status, fn($q) => $q->where('status', $request->status))
            ->when($request->type, fn($q) => $q->where('type', $request->type))
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Notices/Index', [
            'notices' => $notices,
            'filters' => $request->only(['search', 'status', 'type']),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'title'        => 'required|string|max:255',
            'content'      => 'required',
            'type'         => 'required|in:general,exam,holiday,event,urgent',
            'audience'     => 'required|in:all,students,teachers,parents',
            'status'       => 'required|in:draft,published',
            'attachment'   => 'nullable|file|max:5120',
            'published_at' => 'nullable|date',
            'expires_at'   => 'nullable|date',
        ]);

        $data = $request->only(['title', 'content', 'type', 'audience', 'status', 'published_at', 'expires_at']);

        if ($request->hasFile('attachment')) {
            $data['attachment'] = $request->file('attachment')->store('notices', 'public');
        }

        if ($request->status === 'published' && empty($data['published_at'])) {
            $data['published_at'] = now();
        }

        Notice::create($data);

        return redirect()->back()->with('success', 'Notice created successfully!');
    }

    public function update(Request $request, Notice $notice)
    {
        $request->validate([
            'title'        => 'required|string|max:255',
            'content'      => 'required',
            'type'         => 'required|in:general,exam,holiday,event,urgent',
            'audience'     => 'required|in:all,students,teachers,parents',
            'status'       => 'required|in:draft,published',
            'attachment'   => 'nullable|file|max:5120',
            'published_at' => 'nullable|date',
            'expires_at'   => 'nullable|date',
        ]);

        $data = $request->only(['title', 'content', 'type', 'audience', 'status', 'published_at', 'expires_at']);

        if ($request->hasFile('attachment')) {
            if ($notice->attachment) {
                \Storage::disk('public')->delete($notice->attachment);
            }
            $data['attachment'] = $request->file('attachment')->store('notices', 'public');
        }

        $notice->update($data);

        return redirect()->back()->with('success', 'Notice updated successfully!');
    }

    public function destroy(Notice $notice)
    {
        if ($notice->attachment) {
            \Storage::disk('public')->delete($notice->attachment);
        }
        $notice->delete();

        return redirect()->back()->with('success', 'Notice deleted successfully!');
    }
}