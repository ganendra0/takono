<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

Artisan::command('takono:admin {email} {--name=Admin TAKONO}', function () {
    $email = $this->argument('email');
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) { $this->error('Email tidak valid.'); return 1; }
    if (\App\Models\User::where('email',$email)->exists()) { $this->error('Email sudah terdaftar; gunakan akun lain.'); return 1; }
    $password = $this->secret('Password admin (minimal 10 karakter)');
    if (strlen($password ?? '') < 10) { $this->error('Password terlalu pendek.'); return 1; }
    \App\Models\User::create(['name'=>$this->option('name'),'email'=>$email,'password'=>$password,'role'=>'super_admin','active'=>true,'points_balance'=>0]);
    $this->info('Akun admin dibuat.');
})->purpose('Buat administrator pertama dengan password pilihan sendiri');
