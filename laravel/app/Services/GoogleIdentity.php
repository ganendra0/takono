<?php

namespace App\Services;

use Google\Client;
use Illuminate\Validation\ValidationException;

class GoogleIdentity
{
    public function verify(string $credential): array
    {
        try {
            $client = new Client(['client_id' => config('google.client_id')]);
            $payload = $client->verifyIdToken($credential);
        } catch (\Throwable $exception) {
            throw ValidationException::withMessages(['credential' => 'Google tidak dapat diverifikasi. Silakan coba lagi.']);
        }
        if (!$payload || empty($payload['sub']) || empty($payload['email'])
            || !filter_var($payload['email'], FILTER_VALIDATE_EMAIL)
            || !in_array($payload['email_verified'] ?? false, [true, 'true', 1], true)
            || ($payload['aud'] ?? '') !== config('google.client_id')
            || !in_array($payload['iss'] ?? '', ['accounts.google.com', 'https://accounts.google.com'], true)
            || ($payload['exp'] ?? 0) <= time()) {
            throw ValidationException::withMessages(['credential' => 'Identitas Google tidak valid atau sudah kedaluwarsa.']);
        }
        return $payload;
    }
}
