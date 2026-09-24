<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
return new class extends Migration {
    public function up(): void {
        Schema::table('users', function(Blueprint $t) {
            $t->boolean('active')->default(true);
            $t->foreign('destination_id')->references('id')->on('destinations')->nullOnDelete();
        });
        if (!Schema::hasTable('personal_access_tokens')) Schema::create('personal_access_tokens', function(Blueprint $t) {
            $t->id(); $t->morphs('tokenable'); $t->string('name'); $t->string('token',64)->unique();
            $t->text('abilities')->nullable(); $t->timestamp('last_used_at')->nullable(); $t->timestamp('expires_at')->nullable()->index(); $t->timestamps();
        });
        foreach (['explore_points','destination_events','local_discoveries','rewards'] as $table) Schema::table($table, function(Blueprint $t) { $t->softDeletes(); $t->index(['destination_id','status']); });
        Schema::table('destination_events', function(Blueprint $t) { $t->string('status')->default('draft')->change(); });
        Schema::table('rewards', function(Blueprint $t) { $t->string('status')->default('inactive')->change(); $t->date('valid_from')->nullable(); });
        Schema::table('user_activities', function(Blueprint $t) {
            $t->foreign('destination_id')->references('id')->on('destinations')->restrictOnDelete();
            $t->index(['user_id','type','reference_id']); $t->index(['destination_id','created_at']);
        });
        // Nullable keys preserve historical rows; all new awards carry a unique claim key.
        Schema::table('point_transactions', function(Blueprint $t) { $t->string('claim_key')->nullable()->unique(); $t->index(['user_id','created_at']); });
        Schema::table('reward_redemptions', function(Blueprint $t) {
            $t->string('request_id',100)->nullable();
            $t->json('terms')->nullable();
            $t->unique(['user_id','request_id']);
        });
        Schema::create('audit_logs', function(Blueprint $t) {
            $t->id(); $t->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $t->string('action'); $t->string('resource'); $t->string('resource_id');
            $t->json('changes')->nullable(); $t->timestamps();
        });
    }
    public function down(): void {
        Schema::dropIfExists('audit_logs');
        Schema::table('reward_redemptions', function(Blueprint $t) { $t->dropUnique(['user_id','request_id']); $t->dropColumn(['request_id','terms']); });
        Schema::table('point_transactions', function(Blueprint $t) { $t->dropColumn('claim_key'); $t->dropIndex(['user_id','created_at']); });
        Schema::table('user_activities', function(Blueprint $t) { $t->dropForeign(['destination_id']); $t->dropIndex(['user_id','type','reference_id']); $t->dropIndex(['destination_id','created_at']); });
        foreach (['explore_points','destination_events','local_discoveries','rewards'] as $table) Schema::table($table, function(Blueprint $t) { $t->dropSoftDeletes(); $t->dropIndex(['destination_id','status']); });
        Schema::table('rewards', fn(Blueprint $t) => $t->dropColumn('valid_from'));
        Schema::table('users', function(Blueprint $t) { $t->dropForeign(['destination_id']); $t->dropColumn('active'); });
    }
};
