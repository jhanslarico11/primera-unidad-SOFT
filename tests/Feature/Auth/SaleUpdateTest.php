<?php

namespace Tests\Feature\Sales;

use Tests\TestCase;
use App\Models\User;
use App\Models\Sale;
use App\Models\Client;
use Illuminate\Foundation\Testing\RefreshDatabase;

class SaleUpdateTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function puede_actualizar_una_venta()
    {
        $user = User::factory()->create();
        $client1 = Client::factory()->create();
        $client2 = Client::factory()->create();

        $sale = Sale::factory()->create([
            'client_id' => $client1->id,
            'user_id' => $user->id
        ]);

        $updateData = [
            'sale_date' => now()->addDay()->toDateString(),
            'client_id' => $client2->id,
            'user_id' => $user->id
        ];

        $response = $this->actingAs($user)
            ->put("/sales/{$sale->id}", $updateData);

        $response->assertRedirect('/sales');

        $this->assertDatabaseHas('sales', [
            'id' => $sale->id,
            'client_id' => $client2->id
        ]);
    }
}
