<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        DB::statement("ALTER TABLE users MODIFY role ENUM('traveler','destination_manager','government','super_admin','tenant') NOT NULL DEFAULT 'traveler'");
        Schema::table('rewards', function (Blueprint $table) {
            $table->foreignId('tenant_user_id')->nullable()->after('destination_id')->constrained('users')->nullOnDelete();
            $table->index(['tenant_user_id', 'status']);
        });
        Schema::table('reward_redemptions', function (Blueprint $table) {
            $table->foreignId('verified_by_user_id')->nullable()->after('user_id')->constrained('users')->nullOnDelete();
            $table->timestamp('used_at')->nullable()->after('claimed_at');
        });
    }

    public function down(): void {
        Schema::table('reward_redemptions', function (Blueprint $table) {
            $table->dropConstrainedForeignId('verified_by_user_id');
            $table->dropColumn('used_at');
        });
        Schema::table('rewards', function (Blueprint $table) {
            $table->dropIndex(['tenant_user_id', 'status']);
            $table->dropConstrainedForeignId('tenant_user_id');
        });
        DB::statement("ALTER TABLE users MODIFY role ENUM('traveler','destination_manager','government','super_admin') NOT NULL DEFAULT 'traveler'");
    }
};
