<?php

namespace App\Http\Controllers\Api;

use App\Models\Subject;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class SubjectController extends Controller
{
    
    public function index(Request $request)
    {
        $query = Subject::query();

        if ($request->has('semester')) {
            $query->where('semester', $request->semester);
        }

        if ($request->has('credits')) {
            $query->where('credits', $request->credits);
        }

        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('code', 'like', "%{$search}%");
            });
        }

        $subjects = $query->orderBy('semester')
                         ->orderBy('name')
                         ->paginate($request->get('per_page', 15));

        return response()->json([
            'message' => 'Subjects retrieved successfully',
            'data' => $subjects->items(),
            'pagination' => [
                'current_page' => $subjects->currentPage(),
                'total' => $subjects->total()
            ]
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'code' => 'required|string|unique:subjects|max:10',
            'credits' => 'required|integer|min:1|max:15',
            'semester' => 'required|integer|min:1|max:8'
        ]);

        $subject = Subject::create($request->all());

        return response()->json([
            'message' => 'Subject created successfully',
            'data' => $subject
        ], 201);
    }

    public function show($id)
    {
        $subject = Subject::with(['schedules.user'])->find($id);

        if (!$subject) {
            return response()->json(['message' => 'Subject not found'], 404);
        }

        return response()->json([
            'message' => 'Subject retrieved successfully',
            'data' => $subject
        ]);
    }

    public function update(Request $request, $id)
    {
        $subject = Subject::find($id);

        if (!$subject) {
            return response()->json(['message' => 'Subject not found'], 404);
        }

        $request->validate([
            'name' => 'sometimes|string|max:255',
            'code' => 'sometimes|string|max:10|unique:subjects,code,' . $id,
            'credits' => 'sometimes|integer|min:1|max:15',
            'semester' => 'sometimes|integer|min:1|max:8'
        ]);

        $subject->update($request->all());

        return response()->json([
            'message' => 'Subject updated successfully',
            'data' => $subject
        ]);
    }

    public function destroy($id)
    {
        $subject = Subject::find($id);

        if (!$subject) {
            return response()->json(['message' => 'Subject not found'], 404);
        }

        if ($subject->schedules()->count() > 0) {
            return response()->json([
                'message' => 'Cannot delete subject that has active schedules'
            ], 422);
        }

        $subject->delete();

        return response()->json([
            'message' => 'Subject deleted successfully'
        ]);
    }

    public function bySemester()
    {
        $subjects = Subject::selectRaw('semester, COUNT(*) as count')
                          ->groupBy('semester')
                          ->orderBy('semester')
                          ->get();

        return response()->json([
            'message' => 'Subjects by semester',
            'data' => $subjects
        ]);
    }
}