<?php

namespace App\Http\Controllers;

use App\Models\Client;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use App\Mail\ClientMail;
use Exception;
use Illuminate\Support\Facades\Mail;

class ClientController extends Controller
{
    private const CLIENT_MESSAGE = 'El cliente ';

    public function index()
    {
        $clients = Client::paginate(20);
        return Inertia::render('Clients/Index', ['clients' => $clients]);
    }

    public function create()
    {
        return Inertia::render('Clients/Create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'dni' => 'required|digits:8|unique:clients,dni',
            'full_name' => 'required',
            'nombres' => 'nullable|string|max:100',
            'apellido_paterno' => 'nullable|string|max:100',
            'apellido_materno' => 'nullable|string|max:100',
            'email' => 'nullable|email',
        ]);

        try {
            $client = new Client();
            $client->dni = $request->dni;
            $client->full_name = $request->full_name;
            $client->nombres = $request->nombres;
            $client->apellido_paterno = $request->apellido_paterno;
            $client->apellido_materno = $request->apellido_materno;
            $client->cell_phone = $request->cell_phone;
            $client->address = $request->address;
            $client->email = $request->email;
            $client->save();

            if (!empty($request->email)) {
                Mail::to($client->email)->send(new ClientMail($client));
            }

            return Redirect::route('clients.index')->with([
                'status' => true,
                'message' => self::CLIENT_MESSAGE . $client->full_name . ' fue registrado correctamente',
            ]);
        } catch (Exception $exc) {
            return Redirect::route('clients.index')->with([
                'status' => false,
                'message' => 'Existen errores en el formulario.',
            ]);
        }
    }

    public function show(string $id)
    {
        $client = Client::find($id);
        return Inertia::render('Client/Show', ['client' => $client]);
    }

    public function edit(string $id)
    {
        $client = Client::findOrFail($id);
        return Inertia::render('Clients/Edit', ['client' => $client]);
    }

    public function update(Request $request, string $id)
    {
        $request->validate([
            'dni' => 'required|digits:8|unique:clients,dni,' . $id,
            'full_name' => 'required',
            'nombres' => 'nullable|string|max:100',
            'apellido_paterno' => 'nullable|string|max:100',
            'apellido_materno' => 'nullable|string|max:100',
            'email' => 'nullable|email',
        ]);

        try {
            $client = Client::findOrFail($id);
            $client->dni = $request->dni;
            $client->full_name = $request->full_name;
            $client->nombres = $request->nombres;
            $client->apellido_paterno = $request->apellido_paterno;
            $client->apellido_materno = $request->apellido_materno;
            $client->cell_phone = $request->cell_phone;
            $client->address = $request->address;
            $client->email = $request->email;
            $client->save();

            return Redirect::route('clients.index')->with([
                'status' => true,
                'message' => self::CLIENT_MESSAGE . $client->full_name . ' fue actualizado correctamente',
            ]);
        } catch (Exception $exc) {
            return Redirect::route('clients.index')->with([
                'status' => false,
                'message' => 'Existen errores en el formulario.',
            ]);
        }
    }

    public function destroy(string $id)
    {
        try {
            $client = Client::findOrFail($id);
            $clientName = $client->full_name;
            $client->delete();

            return Redirect::route('clients.index')->with([
                'status' => true,
                'message' => self::CLIENT_MESSAGE . $clientName . ' fue eliminado correctamente',
            ]);
        } catch (Exception $exc) {
            return Redirect::route('clients.index')->with([
                'status' => false,
                'message' => 'No se pudo eliminar el cliente.',
            ]);
        }
    }
}
