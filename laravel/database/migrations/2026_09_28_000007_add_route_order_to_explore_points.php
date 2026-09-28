<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::table('explore_points', function (Blueprint $table) {
            $table->unsignedInteger('route_order')->default(0)->after('destination_id');
            $table->index(['destination_id', 'route_order']);
        });
    }

    public function down(): void {
        Schema::table('explore_points', function (Blueprint $table) {
            $table->dropIndex(['destination_id', 'route_order']);
            $table->dropColumn('route_order');
        });
    }
};
