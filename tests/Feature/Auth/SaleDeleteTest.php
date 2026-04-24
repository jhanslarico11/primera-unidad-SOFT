<?php

namespace Tests\Feature\Sales;

use Tests\TestCase;
use App\Models\User;
use App\Models\Sale;
use Illuminate\Foundation\Testing\RefreshDatabase;

class SaleDeleteTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function puede_eliminar_una_venta()
    {
        $user = User::factory()->create();
        $sale = Sale::factory()->create();

        $response = $this->actingAs($user)
            ->delete("/sales/{$sale->id}");

        $response->assertRedirect('/sales');

        $this->assertDatabaseMissing('sales', ['id' => $sale->id]);
    }
}
