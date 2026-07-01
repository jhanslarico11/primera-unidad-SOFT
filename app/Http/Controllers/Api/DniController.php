<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Client;
use App\Models\User;
use App\Services\DecolectaService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DniController extends Controller
{
    public function show(Request $request, string $dni, DecolectaService $decolectaService): JsonResponse
    {
        $validator = validator(['dni' => $dni], [
            'dni' => ['required', 'digits:8', 'numeric'],
        ]);

        if ($validator->fails()) {
            return response()->json([
                'found' => false,
                'source' => null,
                'message' => 'DNI obligatorio, numerico y de 8 digitos.',
                'errors' => $validator->errors(),
            ], 422);
        }

        $client = Client::where('dni', $dni)->first();

        if ($client) {
            return response()->json([
                'found' => true,
                'source' => 'database',
                'message' => 'Cliente encontrado.',
                'person' => $this->formatClient($client),
            ]);
        }

        $user = User::where('dni', $dni)->first();

        if ($user) {
            return response()->json([
                'found' => true,
                'source' => 'database',
                'message' => 'Usuario encontrado.',
                'person' => $this->formatUser($user),
            ]);
        }

        $response = $decolectaService->consultarDni($dni);

        return response()->json([
            'found' => $response['found'],
            'source' => $response['found'] ? 'decolecta' : null,
            'message' => $response['message'],
            'code' => $response['code'],
            'person' => $response['person'],
        ]);
    }

    private function formatClient(Client $client): array
    {
        return [
            'id' => $client->id,
            'type' => 'client',
            'dni' => $client->dni,
            'nombres' => $client->nombres,
            'apellido_paterno' => $client->apellido_paterno,
            'apellido_materno' => $client->apellido_materno,
            'nombre_completo' => $client->full_name,
            'full_name' => $client->full_name,
            'cell_phone' => $client->cell_phone,
            'address' => $client->address,
            'email' => $client->email,
        ];
    }

    private function formatUser(User $user): array
    {
        return [
            'id' => $user->id,
            'type' => 'user',
            'dni' => $user->dni,
            'nombres' => $user->nombres,
            'apellido_paterno' => $user->apellido_paterno,
            'apellido_materno' => $user->apellido_materno,
            'nombre_completo' => $user->name,
            'full_name' => $user->name,
            'email' => $user->email,
        ];
    }
}
