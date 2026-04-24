<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Client;
use App\Models\User;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Sale>
 */
class SaleFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'sale_date' => $this->faker->dateTimeBetween('-1 month', 'now'),
            'user_id' => User::factory(),  // ✅ Crea un usuario automáticamente
            'client_id' => Client::factory(), // ✅ Crea un cliente automáticamente
        ];
    }
}
