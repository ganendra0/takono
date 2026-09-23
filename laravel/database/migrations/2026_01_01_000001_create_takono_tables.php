<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // 1. Users table
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email')->unique();
            $table->string('password');
            $table->enum('role', ['traveler', 'destination_manager', 'government', 'super_admin'])->default('traveler');
            $table->string('avatar')->nullable();
            $table->unsignedBigInteger('destination_id')->nullable();
            $table->string('institution')->nullable();
            $table->integer('points_balance')->default(0);
            $table->rememberToken();
            $table->timestamps();
        });

        // 2. Destinations table
        Schema::create('destinations', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('code')->unique();
            $table->string('slug')->unique();
            $table->string('tagline')->nullable();
            $table->text('description')->nullable();
            $table->string('hero_image')->nullable();
            $table->json('gallery')->nullable();
            $table->string('address')->nullable();
            $table->string('city')->default('Surabaya');
            $table->string('province')->default('Jawa Timur');
            $table->decimal('latitude', 10, 7)->nullable();
            $table->decimal('longitude', 10, 7)->nullable();
            $table->json('boundary_coordinates')->nullable();
            $table->string('operating_hours')->nullable();
            $table->string('ticket_info')->nullable();
            $table->string('contact_phone')->nullable();
            $table->string('contact_email')->nullable();
            $table->json('facilities')->nullable();
            $table->enum('status', ['published', 'draft'])->default('published');
            $table->boolean('is_demo')->default(false);
            $table->timestamps();
        });

        // 3. Explore Points
        Schema::create('explore_points', function (Blueprint $table) {
            $table->id();
            $table->foreignId('destination_id')->constrained()->cascadeOnDelete();
            $table->string('name');
            $table->string('slug');
            $table->string('category');
            $table->text('description');
            $table->longText('story')->nullable();
            $table->longText('educational_content')->nullable();
            $table->json('fun_facts')->nullable();
            $table->string('image')->nullable();
            $table->decimal('latitude', 10, 7);
            $table->decimal('longitude', 10, 7);
            $table->string('estimated_duration')->default('15 menit');
            $table->string('difficulty')->default('Mudah');
            $table->string('secure_token')->unique();
            $table->integer('points_reward')->default(25);
            $table->enum('status', ['published', 'draft'])->default('published');
            $table->string('audio_guide_url')->nullable();
            $table->timestamps();
        });

        // 4. Quizzes
        Schema::create('quizzes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('explore_point_id')->constrained()->cascadeOnDelete();
            $table->string('title');
            $table->json('questions');
            $table->timestamps();
        });

        // 5. Destination Events
        Schema::create('destination_events', function (Blueprint $table) {
            $table->id();
            $table->foreignId('destination_id')->constrained()->cascadeOnDelete();
            $table->string('title');
            $table->string('slug');
            $table->text('description')->nullable();
            $table->string('image')->nullable();
            $table->string('start_date');
            $table->string('end_date')->nullable();
            $table->string('time')->nullable();
            $table->string('location')->nullable();
            $table->string('organizer')->nullable();
            $table->integer('points_reward')->default(30);
            $table->enum('status', ['published', 'upcoming', 'completed'])->default('published');
            $table->timestamps();
        });

        // 6. Local Discoveries (UMKM & Kuliner)
        Schema::create('local_discoveries', function (Blueprint $table) {
            $table->id();
            $table->foreignId('destination_id')->constrained()->cascadeOnDelete();
            $table->string('name');
            $table->string('category')->default('Kuliner');
            $table->text('description');
            $table->string('image')->nullable();
            $table->string('address');
            $table->decimal('latitude', 10, 7);
            $table->decimal('longitude', 10, 7);
            $table->string('operating_hours')->nullable();
            $table->string('contact')->nullable();
            $table->string('phone')->nullable();
            $table->string('promotion')->nullable();
            $table->string('reward_text')->nullable();
            $table->enum('status', ['published', 'draft'])->default('published');
            $table->integer('points_reward')->default(20);
            $table->timestamps();
        });

        // 7. Rewards Catalog
        Schema::create('rewards', function (Blueprint $table) {
            $table->id();
            $table->foreignId('destination_id')->constrained()->cascadeOnDelete();
            $table->string('name');
            $table->string('category')->nullable();
            $table->string('partner');
            $table->text('description');
            $table->string('image')->nullable();
            $table->integer('points_required');
            $table->integer('quota')->default(100);
            $table->integer('stock')->default(100);
            $table->integer('claimed_count')->default(0);
            $table->string('valid_until')->nullable();
            $table->json('terms')->nullable();
            $table->enum('status', ['active', 'out_of_stock', 'expired'])->default('active');
            $table->timestamps();
        });

        // 8. Reward Redemptions
        Schema::create('reward_redemptions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('reward_id')->constrained()->cascadeOnDelete();
            $table->string('reward_name');
            $table->string('partner');
            $table->string('redemption_code')->unique();
            $table->integer('points_spent');
            $table->timestamp('claimed_at');
            $table->timestamp('expires_at')->nullable();
            $table->enum('status', ['active', 'used', 'expired'])->default('active');
            $table->timestamps();
        });

        // 9. Point Transactions (Buku Kas Jejak Points)
        Schema::create('point_transactions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->enum('type', ['credit', 'debit']);
            $table->string('source_type');
            $table->string('source_id');
            $table->integer('amount');
            $table->string('description');
            $table->integer('balance_after')->nullable();
            $table->timestamps();
        });

        // 10. User Activities
        Schema::create('user_activities', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('destination_id');
            $table->string('type');
            $table->string('reference_id');
            $table->string('title');
            $table->integer('points_earned')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('user_activities');
        Schema::dropIfExists('point_transactions');
        Schema::dropIfExists('reward_redemptions');
        Schema::dropIfExists('rewards');
        Schema::dropIfExists('local_discoveries');
        Schema::dropIfExists('destination_events');
        Schema::dropIfExists('quizzes');
        Schema::dropIfExists('explore_points');
        Schema::dropIfExists('destinations');
        Schema::dropIfExists('users');
    }
};
