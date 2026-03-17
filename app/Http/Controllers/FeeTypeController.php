<?php

namespace App\Http\Controllers;

use App\Models\FeeType;
use Illuminate\Http\Request;
use Inertia\Inertia;

class FeeTypeController extends Controller
{
    public function index(Request $request)
    {
        $feeTypes = FeeType::when($request->search, function($q) use ($request) {
                $q->where('name', 'like', "%{$request->search}%");
            })
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('FeeTypes/Index', [
            'feeTypes' => $feeTypes,
            'filters'  => $request->only(['search']),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name'           => 'required|string|max:255|unique:fee_types,name',
            'default_amount' => 'nullable|numeric|min:0',
            'description'    => 'nullable|string',
        ]);

        FeeType::create([
            'name'           => $request->name,
            'default_amount' => $request->default_amount ?? 0,
            'description'    => $request->description,
            'status'         => 'active',
        ]);

        return redirect()->route('fee-types.index')
            ->with('success', 'Fee type added successfully!');
    }

    public function update(Request $request, FeeType $feeType)
    {
        $request->validate([
            'name'           => 'required|string|max:255|unique:fee_types,name,' . $feeType->id,
            'default_amount' => 'nullable|numeric|min:0',
            'description'    => 'nullable|string',
            'status'         => 'required|in:active,inactive',
        ]);

        $feeType->update($request->all());

        return redirect()->route('fee-types.index')
            ->with('success', 'Fee type updated successfully!');
    }

    public function destroy(FeeType $feeType)
    {
        $feeType->delete();
        return redirect()->route('fee-types.index')
            ->with('success', 'Fee type deleted successfully!');
    }
}