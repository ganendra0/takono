<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return response()->json([
        'name' => 'TAKONO Digital Tourism Platform Backend',
        'status' => 'online',
        'version' => '1.0.0',
    ]);
});
