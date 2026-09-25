<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\{DB,Schema};
use Illuminate\Support\Str;
return new class extends Migration {
 public function up():void {
  Schema::table('destination_events',fn(Blueprint $t)=>$t->string('qr_token',64)->nullable()->unique()->after('slug'));
  DB::table('destination_events')->whereNull('qr_token')->orderBy('id')->eachById(fn($event)=>DB::table('destination_events')->where('id',$event->id)->update(['qr_token'=>Str::random(48)]));
 }
 public function down():void { Schema::table('destination_events',fn(Blueprint $t)=>$t->dropColumn('qr_token')); }
};
