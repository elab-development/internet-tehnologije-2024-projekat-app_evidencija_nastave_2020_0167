<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Subject>
 */
class SubjectFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition()
    {
        return [
            'name' => fake()->words(2, true) . ' ' . fake()->numberBetween(1, 3),
            'code' => strtoupper(fake()->lexify('???')) . fake()->numberBetween(1, 9),
            'credits' => fake()->numberBetween(4, 8),
            'semester' => fake()->numberBetween(1, 8),
        ];
    }
}
