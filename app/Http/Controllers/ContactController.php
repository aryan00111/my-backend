<?php

namespace App\Http\Controllers;

use App\Models\ContactMessage;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Mail;

class ContactController extends Controller
{
    public function index(Request $request)
    {
        $messages = ContactMessage::latest()
            ->when($request->search, fn($q) => $q->where('name', 'like', "%{$request->search}%")
                ->orWhere('email', 'like', "%{$request->search}%")
                ->orWhere('subject', 'like', "%{$request->search}%"))
            ->when($request->status, fn($q) => $q->where('status', $request->status))
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('Contact/Index', [
            'messages' => $messages,
            'filters'  => $request->only(['search', 'status']),
            'counts'   => [
                'total'   => ContactMessage::count(),
                'unread'  => ContactMessage::where('status', 'unread')->count(),
                'read'    => ContactMessage::where('status', 'read')->count(),
                'replied' => ContactMessage::where('status', 'replied')->count(),
            ],
        ]);
    }

    public function show(ContactMessage $contact)
    {
        if ($contact->status === 'unread') {
            $contact->update(['status' => 'read']);
        }

        return Inertia::render('Contact/Show', [
            'contact' => $contact,
        ]);
    }

    public function reply(Request $request, ContactMessage $contact)
{
    $request->validate([
        'reply' => 'required|string',
    ]);

    $contact->update([
        'reply'      => $request->reply,
        'status'     => 'replied',
        'replied_at' => now(),
    ]);

    // Send email to user (works after email is configured in .env)
    try {
        \Mail::send([], [], function ($mail) use ($contact, $request) {
            $mail->to($contact->email, $contact->name)
                ->subject('Re: ' . $contact->subject . ' — Sanskar Public School')
                ->html('
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                        <div style="background: linear-gradient(to right, #0d9488, #0f766e); padding: 30px; border-radius: 10px 10px 0 0;">
                            <h1 style="color: white; margin: 0; font-size: 24px;">🏫 Sanskar Public School</h1>
                            <p style="color: #ccfbf1; margin: 5px 0 0;">Reply to your message</p>
                        </div>
                        <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e5e7eb;">
                            <p style="color: #374151;">Dear <strong>' . $contact->name . '</strong>,</p>
                            <p style="color: #374151;">Thank you for contacting us. Here is our reply to your message:</p>

                            <div style="background: #f0fdfa; border-left: 4px solid #0d9488; padding: 15px; margin: 20px 0; border-radius: 5px;">
                                <p style="color: #0f766e; font-weight: bold; margin: 0 0 5px;">Your Message:</p>
                                <p style="color: #374151; margin: 0;">' . nl2br(e($contact->message)) . '</p>
                            </div>

                            <div style="background: #fff; border: 1px solid #e5e7eb; padding: 15px; margin: 20px 0; border-radius: 5px;">
                                <p style="color: #0d9488; font-weight: bold; margin: 0 0 5px;">Our Reply:</p>
                                <p style="color: #374151; margin: 0;">' . nl2br(e($request->reply)) . '</p>
                            </div>

                            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
                            <p style="color: #6b7280; font-size: 13px;">
                                Regards,<br>
                                <strong>Sanskar Public School</strong><br>
                                📧 info@sanskarschool.com
                            </p>
                        </div>
                    </div>
                ');
        });
    } catch (\Exception $e) {
        // Email failed — reply still saved
        return redirect()->back()->with('success', 'Reply saved! (Email will work after deployment)');
    }

    return redirect()->back()->with('success', 'Reply sent successfully via email!');
}

    public function destroy(ContactMessage $contact)
    {
        $contact->delete();
        return redirect()->back()->with('success', 'Message deleted successfully!');
    }

    // Public API - React Frontend se form submit hoga
    public function store(Request $request)
    {
        $request->validate([
            'name'    => 'required|string|max:255',
            'email'   => 'required|email',
            'phone'   => 'nullable|string|max:20',
            'subject' => 'required|string|max:255',
            'message' => 'required|string',
        ]);

        ContactMessage::create($request->only(['name', 'email', 'phone', 'subject', 'message']));

        return response()->json(['message' => 'Message sent successfully!'], 201);
    }
}