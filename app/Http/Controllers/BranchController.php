<?php

namespace App\Http\Controllers;

use App\Models\Branch;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BranchController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $search = $request->input('search');
        $branches = Branch::query()
            ->when($search, function ($query, $search) {
                $query->where('name', 'like', "%{$search}%")
                    ->orWhere('address', 'like', "%{$search}%")
                ;
            })
            ->paginate(10)
            ->withQueryString();
        return Inertia::render(
            'settings/branches/index',
            [
                'branches' => $branches,
                'filters' => [
                    'search' => $search,
                ],
            ]

        );
    }

    public function store(Request $request)
    {

        $request->validate([
            'name' => 'required|string|max:255',
            'address' => 'required|string|max:255',
        ]);

        Branch::create($request->all());

        return redirect()->back()->with('success', 'Branch created successfully');
    }

    public function update(Request $request, Branch $branch)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'address' => 'required|string|max:255',
        ]);

        $branch->update($request->all());

        return redirect()->back()->with('success', 'Branch updated successfully');
    }

    public function destroy(Branch $branch)
    {
        $branch->delete();

        return redirect()->back()->with('success', 'Branch deleted successfully');
    }
}
