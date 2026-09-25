<?php

namespace Database\Seeders;

use App\Models\Destination;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use RuntimeException;

class DemoAccountSeeder extends Seeder
{
    public function run(): void
    {
        $password = (string) env('DEMO_ACCOUNT_PASSWORD', '');

        if (strlen($password) < 10) {
            throw new RuntimeException('DEMO_ACCOUNT_PASSWORD wajib diisi dan minimal 10 karakter.');
        }

        $destination = Destination::where('code', 'BUNGKUL')->firstOrFail();

        DB::transaction(function () use ($destination, $password): void {
            $accounts = [
                ['name' => 'Budi Santoso', 'email' => 'traveler@takono.id', 'role' => 'traveler', 'destination_id' => null, 'institution' => null],
                ['name' => 'Maya Indah (Pengelola Taman Bungkul)', 'email' => 'manager@bungkul.id', 'role' => 'destination_manager', 'destination_id' => $destination->id, 'institution' => 'Pengelola Taman Bungkul'],
                ['name' => 'Drs. Hendra W. (Dinas Pariwisata)', 'email' => 'dinas@surabaya.go.id', 'role' => 'government', 'destination_id' => null, 'institution' => 'Dinas Kebudayaan, Kepemudaan dan Olahraga serta Pariwisata Kota Surabaya'],
                ['name' => 'Admin Platform TAKONO', 'email' => 'admin@takono.id', 'role' => 'super_admin', 'destination_id' => null, 'institution' => 'TAKONO'],
            ];

            foreach ($accounts as $account) {
                $user = User::firstOrNew(['email' => $account['email']]);
                $isNew = ! $user->exists;
                $user->fill([...$account, 'password' => $password, 'active' => true]);
                if ($isNew) {
                    $user->points_balance = 0;
                }
                $user->save();
                $user->tokens()->delete();
            }
        });

        $this->command?->info('Empat akun demo TAKONO berhasil dibuat atau diperbarui.');
    }
}
