<?php

namespace Tests\Unit\Models;

use Tests\TestCase;
use App\Models\Sale;
use App\Models\Client;
use App\Models\User;
use App\Models\Product;
use Illuminate\Foundation\Testing\RefreshDatabase;

class SaleTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function puede_crear_una_venta()
    {
        $client = Client::factory()->create();
        $user = User::factory()->create();

        $sale = Sale::create([
            'sale_date' => now(),
            'client_id' => $client->id,
            'user_id' => $user->id
        ]);

        $this->assertDatabaseHas('sales', [
            'id' => $sale->id,
            'client_id' => $client->id,
            'user_id' => $user->id
        ]);
    }

    /** @test */
    public function una_venta_pertenece_a_un_cliente()
    {
        $client = Client::factory()->create();
        $sale = Sale::factory()->create(['client_id' => $client->id]);

        $this->assertInstanceOf(Client::class, $sale->client);
        $this->assertEquals($client->id, $sale->client->id);
    }

    /** @test */
    public function una_venta_pertenece_a_un_usuario()
    {
        $user = User::factory()->create();
        $sale = Sale::factory()->create(['user_id' => $user->id]);

        $this->assertInstanceOf(User::class, $sale->user);
        $this->assertEquals($user->id, $sale->user->id);
    }

    /** @test */
    public function una_venta_tiene_muchos_productos()
    {
        $sale = Sale::factory()->create();
        $product1 = Product::factory()->create();
        $product2 = Product::factory()->create();

        $sale->products()->attach($product1->id, ['quantity' => 2, 'sale_price' => 100]);
        $sale->products()->attach($product2->id, ['quantity' => 1, 'sale_price' => 50]);

        $this->assertCount(2, $sale->products);
        $this->assertEquals(2, $sale->products->first()->pivot->quantity);
    }
}
