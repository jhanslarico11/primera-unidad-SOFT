<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use Spatie\Permission\PermissionRegistrar;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class PermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        app(PermissionRegistrar::class)->forgetCachedPermissions();

        $permissions = [
            'Lectura categorias',
            'Escritura categorias',
            'Eliminar categorias',
            'Lectura proveedores',
            'Escritura proveedores',
            'Eliminar proveedores',
            'Lectura clientes',
            'Escritura clientes',
            'Eliminar clientes',
            'Lectura productos',
            'Escritura productos',
            'Eliminar productos',
            'Lectura roles',
            'Escritura roles',
            'Eliminar roles',
            'Lectura usuarios',
            'Escritura usuarios',
            'Eliminar usuarios',
            'Lectura ventas',
            'Escritura ventas',
            'Eliminar ventas',
            'Lectura compras',
            'Escritura compras',
            'Eliminar compras',
            'Lectura reportes',
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate([
                'name' => $permission,
                'guard_name' => 'web',
            ]);
        }

        $adminRole = Role::firstOrCreate([
            'name' => 'admin',
            'guard_name' => 'web',
        ]);

        $adminRole->syncPermissions($permissions);

        User::doesntHave('roles')->get()->each(function (User $user) use ($adminRole) {
            $user->assignRole($adminRole);
        });

        app(PermissionRegistrar::class)->forgetCachedPermissions();
    }
}
