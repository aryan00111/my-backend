<?php

namespace App\Http\Controllers;

use App\Models\Setting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class SettingController extends Controller
{
    public function index()
    {
        $settings = Setting::all()->pluck('value', 'key')->toArray();

        $defaults = [
            'school_name'    => 'My School',
            'school_tagline' => 'Education is the key',
            'school_email'   => '',
            'school_phone'   => '',
            'school_address' => '',
            'academic_year'  => '2024-2025',
            'working_days'   => '6',
            'school_logo'    => '',
            'school_city'    => '',
            'school_country' => 'India',
        ];

        $settings = array_merge($defaults, $settings);

        return Inertia::render('Settings/Index', [
            'settings' => $settings,
        ]);
    }

    public function update(Request $request)
    {
        $fields = [
            'school_name', 'school_tagline', 'school_email',
            'school_phone', 'school_address', 'academic_year',
            'working_days', 'school_city', 'school_country',
        ];

        foreach ($fields as $field) {
            Setting::updateOrCreate(
                ['key' => $field],
                ['value' => $request->$field ?? '']
            );
        }

        return redirect()->route('settings.index')
            ->with('success', 'Settings saved successfully!');
    }

    public function changePassword(Request $request)
    {
        $request->validate([
            'current_password' => 'required',
            'new_password'     => 'required|min:6',
        ]);

        $user = auth()->user();

        if (!\Hash::check($request->current_password, $user->password)) {
            return back()->withErrors(['current_password' => 'Current password is incorrect!']);
        }

        $user->update(['password' => \Hash::make($request->new_password)]);

        return back()->with('success', 'Password changed successfully!');
    }

    public function uploadLogo(Request $request)
    {
        $request->validate([
            'logo' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        $oldLogo = Setting::where('key', 'school_logo')->first();
        if ($oldLogo && $oldLogo->value && Storage::disk('public')->exists($oldLogo->value)) {
            Storage::disk('public')->delete($oldLogo->value);
        }

        $path = $request->file('logo')->store('logos', 'public');

        Setting::updateOrCreate(
            ['key' => 'school_logo'],
            ['value' => $path]
        );

        return redirect()->route('settings.index')
            ->with('success', 'Logo uploaded successfully!');
    }
}