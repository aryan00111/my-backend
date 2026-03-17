<?php

namespace App\Http\Controllers;

use App\Models\Gallery;
use Illuminate\Http\Request;
use Inertia\Inertia;

class GalleryController extends Controller
{
    public function index(Request $request)
    {
        $galleries = Gallery::latest()
            ->when($request->search, fn($q) => $q->where('title', 'like', "%{$request->search}%"))
            ->when($request->status, fn($q) => $q->where('status', $request->status))
            ->when($request->category, fn($q) => $q->where('category', $request->category))
            ->paginate(12)
            ->withQueryString();

        return Inertia::render('Gallery/Index', [
            'galleries' => $galleries,
            'filters'   => $request->only(['search', 'status', 'category']),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'title'       => 'required|string|max:255',
            'description' => 'nullable|string',
            'category'    => 'required|string',
            'status'      => 'required|in:active,inactive',
            'sort_order'  => 'nullable|integer',
            'images'      => 'required|array|min:1',
            'images.*'    => 'image|max:4096',
        ]);

        foreach ($request->file('images') as $image) {
            Gallery::create([
                'title'       => $request->title,
                'description' => $request->description,
                'category'    => $request->category,
                'status'      => $request->status,
                'sort_order'  => $request->sort_order ?? 0,
                'image'       => $image->store('gallery', 'public'),
            ]);
        }

        return redirect()->back()->with('success', 'Images uploaded successfully!');
    }

    public function update(Request $request, Gallery $gallery)
    {
        $request->validate([
            'title'       => 'required|string|max:255',
            'description' => 'nullable|string',
            'category'    => 'required|string',
            'status'      => 'required|in:active,inactive',
            'sort_order'  => 'nullable|integer',
            'image'       => 'nullable|image|max:4096',
        ]);

        $data = $request->only(['title', 'description', 'category', 'status', 'sort_order']);

        if ($request->hasFile('image')) {
            \Storage::disk('public')->delete($gallery->image);
            $data['image'] = $request->file('image')->store('gallery', 'public');
        }

        $gallery->update($data);

        return redirect()->back()->with('success', 'Gallery item updated successfully!');
    }

    public function destroy(Gallery $gallery)
    {
        \Storage::disk('public')->delete($gallery->image);
        $gallery->delete();

        return redirect()->back()->with('success', 'Image deleted successfully!');
    }
}