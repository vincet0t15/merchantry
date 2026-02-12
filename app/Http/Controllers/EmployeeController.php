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

        $employess = Employee::when($search, function ($query) use ($search) {
            $query->where('name', 'like', "%{$search}%");
        })
            ->when($request->query('branch_id'), function ($query) use ($request) {
                $query->where('branch_id', $request->query('branch_id'));
            })
            ->with('branch')
            ->paginate(25)
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
        ]);

        $validated['password'] = bcrypt($validated['password']);
        Employee::create($validated);

        return redirect()->back()->with('success', 'Employee created successfully');
    }

    public function toggleStatus(Employee $employee)
    {
        $employee->update([
            'is_active' => !$employee->is_active
        ]);

        return redirect()->back()->with('success', 'Employee status updated successfully');
    }

    public function update(Request $request, Employee $employee)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'username' => 'required|string|max:255|unique:employees,username,' . $employee->id,
            'branch_id' => 'required|integer|exists:branches,id',
            'password' => 'nullable|string|min:6'
        ]);

        // Only update password if filled
        if (!empty($validated['password'])) {
            $validated['password'] = bcrypt($validated['password']);
        } else {
            unset($validated['password']);
        }

        $employee->update($validated);

        return redirect()->back()->with('success', 'Employee updated successfully.');
    }
}
