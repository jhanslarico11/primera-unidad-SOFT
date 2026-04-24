<?php

namespace Tests\Feature\Sales;

use Tests\TestCase;
use App\Models\User;
use App\Models\Product;
use App\Models\Client;
use Illuminate\Foundation\Testing\RefreshDatabase;

class SaleCreationTest extends TestCase
{
    use RefreshDatabase;

    private $user;

    protected function setUp(): void
    {
        parent::setUp();
        $this->user = User::factory()->create();
    }

    /** @test */
    public function puede_crear_una_venta_con_cliente_existente()
    {
        // Crear cliente existente
        $client = Client::factory()->create(['dni' => '12345678', 'full_name' => 'Juan Perez']);

        // Crear producto con stock
        $product = Product::factory()->create(['quantity' => 10]);

        // Datos de la venta
        $saleData = [
            'dni' => '12345678',
            'client_name' => 'Juan Perez',
            'products' => [
                ['id' => $product->id, 'quantity' => 2, 'sale_price' => 100]
            ]
        ];

        // Actuar: usuario autenticado crea venta
        $response = $this->actingAs($this->user)
            ->post('/sales', $saleData);

        // Verificar redirección
        $response->assertRedirect('/dashboard');
        $response->assertSessionHas('status', true);

        // Verificar venta creada
        $this->assertDatabaseHas('sales', [
            'client_id' => $client->id,
            'user_id' => $this->user->id
        ]);

        // Verificar stock actualizado
        $product->refresh();
        $this->assertEquals(8, $product->quantity);
    }

    /** @test */
    public function crea_cliente_automaticamente_si_no_existe()
    {
        $product = Product::factory()->create(['quantity' => 10]);

        $saleData = [
            'dni' => '99999999',
            'client_name' => 'Nuevo Cliente',
            'products' => [
                ['id' => $product->id, 'quantity' => 1, 'sale_price' => 100]
            ]
        ];

        $response = $this->actingAs($this->user)
            ->post('/sales', $saleData);

        // Verificar cliente creado
        $this->assertDatabaseHas('clients', [
            'dni' => '99999999',
            'full_name' => 'Nuevo Cliente'
        ]);

        $response->assertRedirect('/dashboard');
        $response->assertSessionHas('status', true);
    }

    /** @test */
    public function no_permite_vender_mas_del_stock_disponible()
    {
        // Crear producto con stock limitado
        $product = Product::factory()->create(['quantity' => 5]);

        $saleData = [
            'dni' => '12345678',
            'client_name' => 'Cliente Test',
            'products' => [
                ['id' => $product->id, 'quantity' => 10, 'sale_price' => 100] // 10 > stock 5
            ]
        ];

        $response = $this->actingAs($this->user)
            ->post('/sales', $saleData);

        // Debería fallar (tu controlador actualmente no valida, por eso falla)
        // Esto te ayudará a identificar que necesitas agregar validación de stock
        $response->assertSessionHas('status', false);
    }

    /** @test */
    public function requiere_dni_y_nombre_del_cliente()
    {
        $product = Product::factory()->create();

        $saleData = [
            'dni' => '',
            'client_name' => '',
            'products' => [
                ['id' => $product->id, 'quantity' => -1, 'sale_price' => 100]
            ]
        ];

        $response = $this->actingAs($this->user)
            ->post('/sales', $saleData);

        $response->assertSessionHas('status', false);
    }

    /** @test */
    public function requiere_al_menos_un_producto()
    {
        $saleData = [
            'dni' => '12345678',
            'client_name' => 'Cliente Test',
            'products' => [] // Sin productos
        ];

        $response = $this->actingAs($this->user)
            ->post('/sales', $saleData);

        $response->assertSessionHas('status', false);
    }
}
