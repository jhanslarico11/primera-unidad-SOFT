<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;
use Illuminate\Support\Facades\DB;
use Exception;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $users = User::with(['roles'])->get();
        $roles = Role::all();
        return Inertia::render('Users/Index', ['users' => $users, 'roles' => $roles]);
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
            'dni' => 'nullable|digits:8|unique:users,dni',
            'name' => 'required',
            'nombres' => 'nullable|string|max:100',
            'apellido_paterno' => 'nullable|string|max:100',
            'apellido_materno' => 'nullable|string|max:100',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|confirmed'
        ]);

        DB::beginTransaction();
        try {
            $user = new User();
            $user->dni = $request->dni;
            $user->name = $request->name;
            $user->nombres = $request->nombres;
            $user->apellido_paterno = $request->apellido_paterno;
            $user->apellido_materno = $request->apellido_materno;
            $user->email = $request->email;
            $user->password = Hash::make($request->password);
            $user->status = $request->status;
            $user->save();

            $user->assignRole($request->role_name);

            DB::commit();
            return Redirect::route('users.index')->with(['status' => true, 'message' => 'El usuario ' . $user->name . ' fue registrado correctamente']);
        } catch (Exception $exc) {
            DB::rollBack();
            return Redirect::route('users.index')->with(['status' => false, 'message' => 'Existen errores en el formulario.']);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $request->validate([
            'dni' => 'nullable|digits:8|unique:users,dni,' . $id,
            'name' => 'required',
            'nombres' => 'nullable|string|max:100',
            'apellido_paterno' => 'nullable|string|max:100',
            'apellido_materno' => 'nullable|string|max:100',
            'email' => 'required|email|unique:users,email,' . $id,
        ]);

        DB::beginTransaction();
        try {
            $user = User::find($id);
            $user->dni = $request->dni;
            $user->name = $request->name;
            $user->nombres = $request->nombres;
            $user->apellido_paterno = $request->apellido_paterno;
            $user->apellido_materno = $request->apellido_materno;
            $user->email = $request->email;
            $user->save();

            $user->syncRoles($request->role_name);

            DB::commit();
            return Redirect::route('users.index')->with(['status' => true, 'message' => 'El usuario ' . $user->name . ' fue actualizado correctamente']);
        } catch (Exception $exc) {
            DB::rollBack();
            return Redirect::route('users.index')->with(['status' => false, 'message' => 'Existen errores en el formulario.']);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        DB::beginTransaction();
        try {
            if ((int) $id === auth()->id()) {
                throw new Exception('No puedes eliminar tu propio usuario');
            }

            $user = User::findOrFail($id);
            $userName = $user->name;
            $user->syncRoles([]);
            $user->delete();

            DB::commit();
            return Redirect::route('users.index')->with(['status' => true, 'message' => 'El usuario ' . $userName . ' fue eliminado correctamente']);
        } catch (Exception $exc) {
            DB::rollBack();
            return Redirect::route('users.index')->with(['status' => false, 'message' => 'No se pudo eliminar el usuario: ' . $exc->getMessage()]);
        }
    }
}
