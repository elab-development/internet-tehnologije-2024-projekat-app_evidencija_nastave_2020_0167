<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class ProfileController extends Controller
{
    // profil trenutnog korisnika
    public function show(Request $request)
    {
        $user = $request->user();
        
        return response()->json([
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
                'student_id' => $user->student_id,
                'phone' => $user->phone,
                'bio' => $user->bio,
                'profile_image' => $user->profile_image ? url('storage/' . $user->profile_image) : null
            ]
        ]);
    }

    // azuriranje info
    public function update(Request $request)
    {
        $user = $request->user();
        
        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|string|max:255',
            'phone' => 'sometimes|string|max:20',
            'bio' => 'sometimes|string|max:500', 
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $user->update($request->only(['name', 'phone', 'bio']));

        return response()->json([
            'message' => 'Profile updated successfully',
            'user' => $user
        ]);
    }

    // upload profilne slike
    public function uploadImage(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'image' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048' 
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $user = $request->user();

        // brisanje stare, ako postoji
        if ($user->profile_image) {
            Storage::disk('public')->delete($user->profile_image);
        }

        // upload nove
        $image = $request->file('image');
        $imageName = 'profile_' . $user->id . '_' . time() . '.' . $image->getClientOriginalExtension();
        $imagePath = $image->storeAs('profile_images', $imageName, 'public');

        // cuvanje u bazi
        $user->update(['profile_image' => $imagePath]);

        return response()->json([
            'message' => 'Profile image uploaded successfully',
            'image_url' => url('storage/' . $imagePath)
        ]);
    }

    // brisanje slike
    public function deleteImage(Request $request)
    {
        $user = $request->user();

        if (!$user->profile_image) {
            return response()->json(['message' => 'No profile image to delete'], 404);
        }

        Storage::disk('public')->delete($user->profile_image);

        //brisanje iz baze
        $user->update(['profile_image' => null]);

        return response()->json(['message' => 'Profile image deleted successfully']);
    }
}