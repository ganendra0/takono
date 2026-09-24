<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
return new class extends Migration {
    public function up(): void {
        // Preserve existing balances, explicitly recording any pre-ledger opening balance.
        DB::transaction(function() {
            foreach(DB::table('users')->orderBy('id')->lockForUpdate()->get() as $u) {
                $ledger=(int)DB::table('point_transactions')->where('user_id',$u->id)->selectRaw("COALESCE(SUM(CASE WHEN type='credit' THEN amount ELSE -amount END),0) as balance")->value('balance');
                $difference=$u->points_balance-$ledger;
                if(!$difference) continue;
                DB::table('point_transactions')->insert(['user_id'=>$u->id,'type'=>$difference>0?'credit':'debit','source_type'=>'balance_migration','source_id'=>(string)$u->id,'claim_key'=>'opening:'.$u->id,
                    'amount'=>abs($difference),'balance_after'=>$u->points_balance,'description'=>'Rekonsiliasi saldo sebelum migrasi ledger','created_at'=>now(),'updated_at'=>now()]);
            }
        });
    }
    public function down(): void {
        // Financial history is deliberately retained on rollback.
    }
};
