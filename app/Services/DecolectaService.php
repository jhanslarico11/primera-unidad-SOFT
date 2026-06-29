<?php

namespace App\Services;

use Illuminate\Http\Client\ConnectionException;
use Illuminate\Http\Client\RequestException;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class DecolectaService
{
    private const CACHE_TTL_SECONDS = 86400;

    public function consultarDni(string $dni): array
    {
        $dni = trim($dni);

        if (!preg_match('/^\d{8}$/', $dni)) {
            return $this->response(false, 'DNI invalido.');
        }

        $cacheKey = "decolecta:dni:{$dni}";

        if (Cache::has($cacheKey)) {
            return Cache::get($cacheKey);
        }

        $response = $this->fetchDni($dni);

        if (in_array($response['code'], [null, 'not_found'], true)) {
            Cache::put($cacheKey, $response, self::CACHE_TTL_SECONDS);
        }

        return $response;
    }

    private function fetchDni(string $dni): array
    {
        $key = config('services.decolecta.key');
        $baseUrl = rtrim((string) config('services.decolecta.url'), '/');
        $timeout = (int) config('services.decolecta.timeout', 10);

        if (blank($key) || blank($baseUrl)) {
            return $this->response(false, 'Servicio de DNI no configurado.');
        }

        try {
            $httpResponse = Http::withToken($key)
                ->acceptJson()
                ->timeout($timeout)
                ->retry(2, 300, throw: false)
                ->get("{$baseUrl}/v1/reniec/dni", [
                    'numero' => $dni,
                ]);

            if ($httpResponse->status() === 429) {
                return $this->response(false, 'Limite de peticiones alcanzado.', null, 'rate_limited');
            }

            if ($httpResponse->failed()) {
                Log::warning('Decolecta DNI request failed', [
                    'dni' => $dni,
                    'status' => $httpResponse->status(),
                    'body' => Str::limit($httpResponse->body(), 300),
                ]);

                return $this->response(false, 'No se pudo consultar el DNI.', null, 'provider_error');
            }

            $payload = $httpResponse->json();

            if (!is_array($payload)) {
                return $this->response(false, 'Respuesta invalida del proveedor.', null, 'invalid_response');
            }

            $person = $this->normalizePayload($dni, $payload);

            if (blank($person['nombre_completo'])) {
                return $this->response(false, 'No encontrado.', null, 'not_found');
            }

            return $this->response(true, 'Datos encontrados.', $person);
        } catch (ConnectionException|RequestException $exception) {
            Log::warning('Decolecta DNI connection error', [
                'dni' => $dni,
                'message' => $exception->getMessage(),
            ]);

            return $this->response(false, 'Error de conexion.', null, 'connection_error');
        } catch (\Throwable $exception) {
            Log::error('Unexpected Decolecta DNI error', [
                'dni' => $dni,
                'message' => $exception->getMessage(),
            ]);

            return $this->response(false, 'Error inesperado al consultar DNI.', null, 'unexpected_error');
        }
    }

    private function normalizePayload(string $dni, array $payload): array
    {
        $data = $payload['data'] ?? $payload;

        $nombres = $data['nombres']
            ?? $data['nombre']
            ?? $data['first_name']
            ?? '';

        $apellidoPaterno = $data['apellido_paterno']
            ?? $data['apellidoPaterno']
            ?? $data['primer_apellido']
            ?? $data['paternal_surname']
            ?? '';

        $apellidoMaterno = $data['apellido_materno']
            ?? $data['apellidoMaterno']
            ?? $data['segundo_apellido']
            ?? $data['maternal_surname']
            ?? '';

        $nombreCompleto = $data['nombre_completo']
            ?? $data['full_name']
            ?? trim("{$nombres} {$apellidoPaterno} {$apellidoMaterno}");

        return [
            'dni' => $data['dni'] ?? $data['numero'] ?? $dni,
            'nombres' => trim((string) $nombres),
            'apellido_paterno' => trim((string) $apellidoPaterno),
            'apellido_materno' => trim((string) $apellidoMaterno),
            'nombre_completo' => trim((string) $nombreCompleto),
        ];
    }

    private function response(bool $found, string $message, ?array $person = null, ?string $code = null): array
    {
        return [
            'found' => $found,
            'message' => $message,
            'code' => $code,
            'person' => $person,
        ];
    }
}
