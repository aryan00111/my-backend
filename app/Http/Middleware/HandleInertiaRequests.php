<?php

namespace App\Http\Middleware;

use App\Models\Setting;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    protected $rootView = 'app';

    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    public function share(Request $request): array
    {
        return [
            ...parent::share($request),
            'auth' => [
                'user' => $request->user(),
            ],
            'schoolName'    => Setting::where('key', 'school_name')->value('value') ?? 'My School',
'schoolTagline' => Setting::where('key', 'school_tagline')->value('value') ?? 'Education is the key',
'schoolLogo'    => Setting::where('key', 'school_logo')->value('value') ?? '',
            'flash' => [
                'success' => session('success'),
                'error'   => session('error'),
            ],
        ];
    }
}