<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('user_destination_journeys', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('destination_id')->constrained()->cascadeOnDelete();
            $table->enum('status', ['active', 'completed'])->default('active');
            $table->timestamp('started_at');
            $table->timestamp('completed_at')->nullable();
            $table->unsignedInteger('explore_points_total')->nullable();
            $table->unsignedInteger('explore_points_completed')->nullable();
            $table->timestamps();
            $table->unique(['user_id', 'destination_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('user_destination_journeys');
    }
};
