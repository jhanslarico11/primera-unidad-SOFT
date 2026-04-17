<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use Illuminate\Support\Facades\DB;
use Exception;

class RoleController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $roles = Role::with('permissions')->get();
        $permissions = Permission::all();
        return Inertia::render('Roles/Index', ['roles' => $roles, 'permissions' => $permissions]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|unique:roles,name',
        ]);

        DB::beginTransaction();
        try {
            $role = new Role();
            $role->name = $request->name;
            $role->save();

            if ($request->has('permissions')) {
                $role->syncPermissions($request->permissions);
            }

            DB::commit();

            return Redirect::route('roles.index')->with([
                'status' => true,
                'message' => 'El rol ' . $role->name . ' fue registrado correctamente'
            ]);
        } catch (Exception $exc) {
            DB::rollBack();
            return Redirect::route('roles.index')->with([
                'status' => false,
                'message' => 'Error al registrar el rol: ' . $exc->getMessage()
            ]);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        try {
            $role = Role::with('permissions')->findOrFail($id);
            return response()->json($role);
        } catch (Exception $exc) {
            return Redirect::route('roles.index')->with([
                'status' => false,
                'message' => 'Rol no encontrado'
            ]);
        }
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        try {
            $role = Role::with('permissions')->findOrFail($id);
            $permissions = Permission::all();

            return Inertia::render('Roles/Edit', [
                'role' => $role,
                'permissions' => $permissions
            ]);
        } catch (Exception $exc) {
            return Redirect::route('roles.index')->with([
                'status' => false,
                'message' => 'Rol no encontrado'
            ]);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $request->validate([
            'name' => 'required|unique:roles,name,' . $id,
        ]);

        DB::beginTransaction();
        try {
            $role = Role::findOrFail($id);
            $role->name = $request->name;
            $role->save();

            if ($request->has('permissions')) {
                $role->syncPermissions($request->permissions);
            } else {
                $role->syncPermissions([]);
            }

            DB::commit();

            return Redirect::route('roles.index')->with([
                'status' => true,
                'message' => 'El rol ' . $role->name . ' fue actualizado correctamente'
            ]);
        } catch (Exception $exc) {
            DB::rollBack();
            return Redirect::route('roles.index')->with([
                'status' => false,
                'message' => 'Error al actualizar el rol: ' . $exc->getMessage()
            ]);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        DB::beginTransaction();
        try {
            $role = Role::findOrFail($id);
            $roleName = $role->name;

            // Verificar si es un rol protegido (opcional)
            if (in_array($roleName, ['admin', 'super-admin'])) {
                throw new Exception('No se puede eliminar un rol protegido');
            }

            $role->syncPermissions([]); // Eliminar relaciones de permisos
            $role->delete();

            DB::commit();

            return Redirect::route('roles.index')->with([
                'status' => true,
                'message' => 'El rol ' . $roleName . ' fue eliminado correctamente'
            ]);
        } catch (Exception $exc) {
            DB::rollBack();
            return Redirect::route('roles.index')->with([
                'status' => false,
                'message' => 'Error al eliminar el rol: ' . $exc->getMessage()
            ]);
        }
    }
}
