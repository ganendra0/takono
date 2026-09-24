<?php
namespace Tests;
abstract class TestCase extends \Illuminate\Foundation\Testing\TestCase {
    public function json($method, $uri, array $data = [], array $headers = [], $options = 0) {
        $this->app['auth']->forgetGuards();
        return parent::json($method, $uri, $data, $headers, $options);
    }
    public function createApplication() { $app = require __DIR__.'/../bootstrap/app.php'; $app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap(); return $app; }
}
