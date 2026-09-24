<?php
return [
    'paths' => ['api/*'], 'allowed_methods' => ['*'],
    'allowed_origins' => explode(',', env('CORS_ALLOWED_ORIGINS', 'http://localhost:3000,http://localhost:5173')),
    'allowed_origins_patterns' => [], 'allowed_headers' => ['Content-Type','Accept','Authorization','Idempotency-Key'],
    'exposed_headers' => [], 'max_age' => 600, 'supports_credentials' => false,
];
