<?php

namespace App\Http\Controllers;

use App\Models\Branch;
use App\Models\Employee;
use Illuminate\Http\Request;
use Inertia\Inertia;

class EmployeeController extends Controller
{
    public function index(Request $request)
    {

        $search = $request->query('search');

        $employess = Employee::where('branch_id', $request->user()->branch_id)
            ->when($search, function ($query) use ($search) {
                $query->where('name', 'like', "%{$search}%");
            })->paginate(25)
            ->withQueryString();

        $branches = Branch::where('is_active', true)
            ->get();

        return Inertia::render('settings/Employees/Index', [
            'employees' => $employess,
            'branches' => $branches,
            'filters' => [
                'search' => $search,
            ]
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'username' => 'required|string|max:255|unique:employees,username',
            'password' => 'required|string|min:8|max:255',
            'branch_id' => 'required|integer|exists:branches,id',
            'is_active' => 'required|boolean',
        ]);

        $validated['password'] = bcrypt($validated['password']);

        $employee = Employee::create($validated);

        return redirect()->route('settings.employees.index')->with('success', 'Employee created successfully');
    }
}
