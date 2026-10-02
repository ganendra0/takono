<?php

namespace Database\Seeders;

use App\Models\{Destination, Reward};
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

        $bungkul = Destination::where('code', 'BUNGKUL')->firstOrFail();
        $tuguPahlawan = Destination::where('code', 'TUGUPAHLAWAN')->firstOrFail();

        DB::transaction(function () use ($bungkul, $tuguPahlawan, $password): void {
            $accounts = [
                ['name' => 'Budi Santoso', 'email' => 'traveler@takono.id', 'role' => 'traveler', 'destination_id' => null, 'institution' => null],
                ['name' => 'Sari Wulandari', 'email' => 'sari.traveler@takono.id', 'role' => 'traveler', 'destination_id' => null, 'institution' => null],
                ['name' => 'Raka Pratama', 'email' => 'raka.traveler@takono.id', 'role' => 'traveler', 'destination_id' => null, 'institution' => null],
                ['name' => 'Maya Indah (Pengelola Taman Bungkul)', 'email' => 'manager@bungkul.id', 'role' => 'destination_manager', 'destination_id' => $bungkul->id, 'institution' => 'Pengelola Taman Bungkul'],
                ['name' => 'Dimas Prabowo (Pengelola Tugu Pahlawan)', 'email' => 'manager@tugupahlawan.id', 'role' => 'destination_manager', 'destination_id' => $tuguPahlawan->id, 'institution' => 'Pengelola Tugu Pahlawan Surabaya'],
                ['name' => 'Tenant Bungkul', 'email' => 'tenant@bungkul.id', 'role' => 'tenant', 'destination_id' => $bungkul->id, 'institution' => 'Mitra Taman Bungkul'],
                ['name' => 'Tenant Tugu Pahlawan', 'email' => 'tenant@tugupahlawan.id', 'role' => 'tenant', 'destination_id' => $tuguPahlawan->id, 'institution' => 'Mitra Tugu Pahlawan'],
                ['name' => 'Drs. Hendra W. (Dinas Pariwisata)', 'email' => 'dinas@surabaya.go.id', 'role' => 'government', 'destination_id' => null, 'institution' => 'Dinas Kebudayaan, Kepemudaan dan Olahraga serta Pariwisata Kota Surabaya'],
                ['name' => 'Admin Platform TAKONO', 'email' => 'admin@takono.id', 'role' => 'super_admin', 'destination_id' => null, 'institution' => 'TAKONO'],
            ];

            $users = [];
            foreach ($accounts as $account) {
                $user = User::firstOrNew(['email' => $account['email']]);
                $isNew = ! $user->exists;
                $user->fill([...$account, 'password' => $password, 'active' => true]);
                if ($isNew) {
                    $user->points_balance = 0;
                }
                $user->save();
                $user->tokens()->delete();
                $users[$user->email] = $user;
            }
            Reward::where('destination_id', $bungkul->id)->update(['tenant_user_id' => $users['tenant@bungkul.id']->id]);
            Reward::where('destination_id', $tuguPahlawan->id)->update(['tenant_user_id' => $users['tenant@tugupahlawan.id']->id]);
        });

        $this->command?->info('Sembilan akun demo TAKONO berhasil dibuat atau diperbarui.');
    }
}
