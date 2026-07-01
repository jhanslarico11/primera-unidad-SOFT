<?php

namespace Tests\Feature;

use Illuminate\Support\Facades\Route;
use Tests\TestCase;

class CrudRoutesTest extends TestCase
{
    public function test_roles_and_users_delete_routes_are_registered(): void
    {
        $this->assertTrue(Route::has('roles.destroy'));
        $this->assertTrue(Route::has('users.destroy'));
    }
}
